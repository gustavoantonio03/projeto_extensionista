#!/usr/bin/env node
/**
 * OncoVida (@siglo/web) — Stress Testing Suite (100% Offline / Local)
 *
 * Leva o servidor local (http://localhost:3000) ao limite extremo de conexões simultâneas
 * para identificar o ponto de saturação/degradação e validar se a aplicação se recupera
 * normalmente após o pico de carga, sem consumir cotas do Firebase.
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

const STAGES = [
  { name: "1. Baseline (Carga Leve)", concurrency: 5, totalRequests: 15 },
  { name: "2. Carga Média (Spike Moderado)", concurrency: 15, totalRequests: 30 },
  { name: "3. Alta Carga (Pressão)", concurrency: 30, totalRequests: 60 },
  { name: "4. Estresse Extremo (Saturação)", concurrency: 50, totalRequests: 80 },
  { name: "5. Recuperação Pós-Pico", concurrency: 5, totalRequests: 15, coolDownMs: 1500 },
];

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
    console.log(`[StressTest] Servidor já ativo em http://${CONFIG.host}:${CONFIG.port}`);
    return null;
  }

  console.log(`[StressTest] Iniciando servidor Next.js na porta ${CONFIG.port} em background...`);
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

  const start = Date.now();
  while (Date.now() - start < 60000) {
    await new Promise((r) => setTimeout(r, 1500));
    if (await checkServerReady(CONFIG.port, 10000)) {
      console.log(`[StressTest] Servidor pronto após ${((Date.now() - start) / 1000).toFixed(1)}s!`);
      return child;
    }
  }

  killProcess(child);
  throw new Error("[StressTest] Tempo limite de espera para o servidor Next.js excedido.");
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
          "User-Agent": "OncoVida-StressTest/1.0",
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

async function executeStage(stage) {
  if (stage.coolDownMs) {
    console.log(`[StressTest] Resfriamento de ${stage.coolDownMs / 1000}s antes do estágio...`);
    await new Promise((r) => setTimeout(r, stage.coolDownMs));
  }

  console.log(`\n>>> Executando: ${stage.name}`);
  console.log(`    Concorrência: ${stage.concurrency} conexões simultâneas | Reqs: ${stage.totalRequests}`);

  let nextIndex = 0;
  const getNextIndex = () => nextIndex++;
  const results = [];
  const onResult = (r) => results.push(r);

  const startMs = performance.now();
  const workers = Array.from({ length: stage.concurrency }, () =>
    runWorker(stage.totalRequests, getNextIndex, onResult)
  );

  await Promise.all(workers);
  const durationSec = (performance.now() - startMs) / 1000;

  const successful = results.filter((r) => r.ok).length;
  const failed = results.length - successful;
  const latencies = results.map((r) => r.latency);
  const sumLatency = latencies.reduce((acc, v) => acc + v, 0);
  const meanLatency = latencies.length > 0 ? sumLatency / latencies.length : 0;
  const p95 = calculatePercentile(latencies, 95);
  const maxLatency = latencies.length > 0 ? Math.max(...latencies) : 0;
  const throughput = results.length / durationSec;

  console.log(`    -> Duração: ${durationSec.toFixed(2)}s | Throughput: ${throughput.toFixed(1)} req/s`);
  console.log(`    -> Média: ${meanLatency.toFixed(1)}ms | P95: ${p95.toFixed(1)}ms | Máx: ${maxLatency.toFixed(1)}ms | Erros: ${failed}`);

  return {
    name: stage.name,
    concurrency: stage.concurrency,
    totalRequests: stage.totalRequests,
    durationSec,
    throughput,
    meanLatency,
    p95,
    maxLatency,
    successful,
    failed,
  };
}

async function main() {
  console.log("================================================================================");
  console.log("  ONCOVIDA — TESTE DE ESTRESSE & RESILIÊNCIA (100% OFFLINE FIREBASE)             ");
  console.log("================================================================================");
  console.log(`Alvo: http://${CONFIG.host}:${CONFIG.port}${CONFIG.path}`);
  console.log("Objetivo: Encontrar ponto de degradação e comprovar recuperação pós-pico.");
  console.log("--------------------------------------------------------------------------------");

  let serverProcess = null;
  try {
    serverProcess = await ensureServerRunning();

    // Warmup
    console.log(`[StressTest] Aquecimento prévio (3 reqs)...`);
    for (let i = 0; i < 3; i++) {
      await singleRequest();
    }

    const stageResults = [];
    for (const stage of STAGES) {
      const res = await executeStage(stage);
      stageResults.push(res);
    }

    console.log("\n================================================================================");
    console.log("  QUADRO COMPARATIVO DE RESILIÊNCIA E ESTRESSE                                 ");
    console.log("================================================================================");
    console.log("Estágio                          | Conc | Reqs | Throughput | Lat. Média | P95 Lat.  | Erros");
    console.log("---------------------------------+------+------+------------+------------+-----------+------");

    for (const r of stageResults) {
      const namePadded = r.name.padEnd(32).slice(0, 32);
      const concPadded = String(r.concurrency).padStart(4);
      const reqsPadded = String(r.totalRequests).padStart(4);
      const thrPadded = `${r.throughput.toFixed(1)} r/s`.padStart(10);
      const meanPadded = `${r.meanLatency.toFixed(1)} ms`.padStart(10);
      const p95Padded = `${r.p95.toFixed(1)} ms`.padStart(9);
      const errPadded = String(r.failed).padStart(5);
      console.log(`${namePadded} | ${concPadded} | ${reqsPadded} | ${thrPadded} | ${meanPadded} | ${p95Padded} | ${errPadded}`);
    }
    console.log("================================================================================");

    // Validação de Resiliência
    const baseline = stageResults[0];
    const peak = stageResults[3];
    const recovery = stageResults[4];

    console.log("\n--- ANÁLISE DE RECUPERAÇÃO DO SISTEMA ---");
    console.log(`Latência Média Baseline (10 conc):       ${baseline.meanLatency.toFixed(1)} ms`);
    console.log(`Latência Média no Pico de Estresse (150): ${peak.meanLatency.toFixed(1)} ms`);
    console.log(`Latência Média Pós-Estresse (Recuperação): ${recovery.meanLatency.toFixed(1)} ms`);

    const recovered = recovery.failed === 0 && recovery.meanLatency < baseline.meanLatency * 3.0;
    if (recovered) {
      console.log("\nSTATUS: [APROVADO] O servidor Next.js suportou o estresse extremo e recuperou");
      console.log("        sua estabilidade e latência baseline sem degradação persistente ou queda.");
    } else {
      console.error("\nSTATUS: [REPROVADO] Servidor não recuperou latência após o estresse.");
      process.exitCode = 1;
    }
  } catch (err) {
    console.error("[StressTest] Erro crítico:", err);
    process.exitCode = 1;
  } finally {
    if (serverProcess) {
      console.log("[StressTest] Encerrando processo do servidor Next.js...");
      killProcess(serverProcess);
    }
  }
}

main();
