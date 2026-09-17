"""SIGLO BI — FastAPI (Sprint 08 implementará ETL e dashboards).

Regra do módulo (ADR-0003): consome SOMENTE views pseudonimizadas — sem PII.
"""

from fastapi import FastAPI

app = FastAPI(title="SIGLO BI", version="0.1.0")


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok", "service": "siglo-bi"}
