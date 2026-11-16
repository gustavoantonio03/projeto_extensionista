#!/usr/bin/env node
/**
 * OncoVida (@siglo/web) — Loading Test Suite (100% Offline / Local)
 *
 * Avalia velocidade, estabilidade, latência e req/s do servidor Next.js
 * sob condições normais e múltiplos acessos simultâneos sem acionar cotas do Firebase.
 */

import http from "node:http";
import { spawn } from "node:child_process";
import { performance } from "node:perf_hooks";
import path from "node:path";
import { fileURLToPath } from "node:url";

import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webDir = path.resolve(__dirname, "..");

const CONFIG = {
  host: "127.0.0.1",
  port: 3000,
  path: "/login",
  concurrency: 10,
  totalRequests: 100,
  warmupRequests: 5,
  timeoutMs: 15000,
};

async function detectAvailablePort(preferred = 3000) {
  const isUp = await checkServerReady(preferred, 5000);
  if (isUp) return preferred;

  const canBind = await new Promise((resolve) => {
    const s = http.createServer();
    s.once("error", () => resolve(false));
    s.listen(preferred, "127.0.0.1", () => {
      s.close(() => resolve(true));
    });
  });

  if (canBind) return preferred;
  return 3001;
}

function checkServerReady(port = CONFIG.port, timeout = 5000) {
  return new Promise((resolve) => {
    const req = http.get(
      {
        host: CONFIG.host,
        port,
        path: CONFIG.path,
        timeout,
      },
      (res) => {
        res.resume();
        resolve(res.statusCode >= 200 && res.statusCode < 500);
      }
    );
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

function killProcess(child) {
  if (!child || !child.pid) return;
  if (process.platform === "win32") {
    try {
      spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    } catch {
      child.kill();
    }
  } else {
    child.kill();
  }
}

async function ensureServerRunning() {
  CONFIG.port = await detectAvailablePort(Number(process.env.PORT) || 3000);
  const isUp = await checkServerReady(CONFIG.port, 2000);
  if (isUp) {
    console.log(`[LoadTest] Servidor já ativo em http://${CONFIG.host}:${CONFIG.port}`);
    return null;
  }

  console.log(`[LoadTest] Iniciando servidor Next.js na porta ${CONFIG.port} em background...`);
  const isWindows = process.platform === "win32";
  const npmCmd = isWindows ? "npm.cmd" : "npm";
  const child = spawn(npmCmd, ["run", "dev", "--", "-p", String(CONFIG.port), "-H", "127.0.0.1"], {
    cwd: webDir,
    stdio: "pipe",
    detached: false,
    shell: isWindows,
  });

  child.stdout.on("data", (data) => {
    const msg = data.toString().trim();
    if (msg.includes("Ready") || msg.includes("Compiled") || msg.includes("Local:")) {
      console.log(`[NextDev] ${msg}`);
    }
  });

  child.stderr.on("data", (data) => {
    console.error(`[NextDev ERR] ${data.toString().trim()}`);
  });

  // Aguarda até o servidor estar pronto (até 60s)
  const start = Date.now();
  while (Date.now() - start < 60000) {
    await new Promise((r) => setTimeout(r, 1500));
    if (await checkServerReady(CONFIG.port, 10000)) {
      console.log(`[LoadTest] Servidor pronto após ${((Date.now() - start) / 1000).toFixed(1)}s!`);
      return child;
    }
  }

  killProcess(child);
  throw new Error("[LoadTest] Tempo limite de espera para o servidor Next.js excedido.");
}

function singleRequest() {
  return new Promise((resolve) => {
    const start = performance.now();
    const req = http.get(
      {
        host: CONFIG.host,
        port: CONFIG.port,
        path: CONFIG.path,
        agent: false,
        headers: {
          Connection: "close",
          "User-Agent": "OncoVida-LoadTest/1.0",
        },
        timeout: CONFIG.timeoutMs,
      },
      (res) => {
        res.resume();
        res.on("end", () => {
          const latency = performance.now() - start;
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 400,
            status: res.statusCode,
            latency,
          });
        });
      }
    );

    req.on("error", (err) => {
      const latency = performance.now() - start;
      resolve({
        ok: false,
        status: 0,
        error: err.message,
        latency,
      });
    });

    req.on("timeout", () => {
      req.destroy();
      const latency = performance.now() - start;
      resolve({
        ok: false,
        status: 408,
        error: "Timeout",
        latency,
      });
    });
  });
}

async function runWorker(totalTasks, getNextIndex, onResult) {
  while (true) {
    const idx = getNextIndex();
    if (idx >= totalTasks) break;
    const res = await singleRequest();
    onResult(res);
  }
}

function calculatePercentile(latencies, percentile) {
  if (latencies.length === 0) return 0;
  const sorted = [...latencies].sort((a, b) => a - b);
  const index = Math.min(
    Math.floor((percentile / 100) * sorted.length),
    sorted.length - 1
  );
  return sorted[index];
}

async function main() {
  console.log("================================================================================");
  console.log("  ONCOVIDA — TESTE DE CARGA (LOADING TEST - 100% LOCAL / OFFLINE FIREBASE)      ");
  console.log("================================================================================");
  console.log(`Alvo: http://${CONFIG.host}:${CONFIG.port}${CONFIG.path}`);
  console.log(`Concorrência: ${CONFIG.concurrency} conexões simultâneas`);
  console.log(`Volume Total: ${CONFIG.totalRequests} requisições`);
  console.log("--------------------------------------------------------------------------------");

  let serverProcess = null;
  try {
    serverProcess = await ensureServerRunning();

    // Warmup
    console.log(`[LoadTest] Executando aquecimento inicial (${CONFIG.warmupRequests} reqs)...`);
    for (let i = 0; i < CONFIG.warmupRequests; i++) {
      await singleRequest();
    }
    console.log(`[LoadTest] Aquecimento concluído. Iniciando medição de carga...`);

    let nextIndex = 0;
    const getNextIndex = () => nextIndex++;
    const results = [];
    const onResult = (r) => results.push(r);

    const testStartTime = performance.now();
    const workers = Array.from({ length: CONFIG.concurrency }, () =>
      runWorker(CONFIG.totalRequests, getNextIndex, onResult)
    );

    await Promise.all(workers);
    const totalDurationMs = performance.now() - testStartTime;
    const totalDurationSec = totalDurationMs / 1000;

    // Métricas
    const successful = results.filter((r) => r.ok).length;
    const failed = results.length - successful;
    const latencies = results.map((r) => r.latency);

    const sumLatency = latencies.reduce((acc, v) => acc + v, 0);
    const meanLatency = latencies.length > 0 ? sumLatency / latencies.length : 0;
    const minLatency = latencies.length > 0 ? Math.min(...latencies) : 0;
    const maxLatency = latencies.length > 0 ? Math.max(...latencies) : 0;
    const p50 = calculatePercentile(latencies, 50);
    const p90 = calculatePercentile(latencies, 90);
    const p95 = calculatePercentile(latencies, 95);
    const p99 = calculatePercentile(latencies, 99);
    const throughput = results.length / totalDurationSec;

    console.log("\n================================================================================");
    console.log("  RESULTADOS DO TESTE DE CARGA (LOADING TEST)                                  ");
    console.log("================================================================================");
    console.log(`Total de Requisições:     ${results.length}`);
    console.log(`Requisições Bem-Sucedidas: ${successful} (${((successful / results.length) * 100).toFixed(1)}%)`);
    console.log(`Falhas / Erros de Conexão: ${failed} (${((failed / results.length) * 100).toFixed(1)}%)`);
    console.log(`Tempo Total de Teste:     ${totalDurationSec.toFixed(2)}s`);
    console.log(`Throughput Médio:         ${throughput.toFixed(2)} req/s`);
    console.log("--------------------------------------------------------------------------------");
    console.log("DISTRIBUIÇÃO DE LATÊNCIA (TEMPO DE RESPOSTA):");
    console.log(`  Mínima:                 ${minLatency.toFixed(2)} ms`);
    console.log(`  Média:                  ${meanLatency.toFixed(2)} ms`);
    console.log(`  Mediana (p50):          ${p50.toFixed(2)} ms`);
    console.log(`  Percentil 90 (p90):     ${p90.toFixed(2)} ms`);
    console.log(`  Percentil 95 (p95):     ${p95.toFixed(2)} ms`);
    console.log(`  Percentil 99 (p99):     ${p99.toFixed(2)} ms`);
    console.log(`  Máxima:                 ${maxLatency.toFixed(2)} ms`);
    console.log("================================================================================");

    const passed = failed === 0 && meanLatency < 8000;
    if (passed) {
      console.log("STATUS: [APROVADO] O servidor Next.js suporta a carga sob condições normais (0 erros).");
    } else {
      console.error("STATUS: [REPROVADO] Métricas fora dos limites operacionais esperados.");
      process.exitCode = 1;
    }
  } catch (err) {
    console.error("[LoadTest] Erro crítico:", err);
    process.exitCode = 1;
  } finally {
    if (serverProcess) {
      console.log("[LoadTest] Encerrando processo do servidor Next.js...");
      killProcess(serverProcess);
    }
  }
}

main();
