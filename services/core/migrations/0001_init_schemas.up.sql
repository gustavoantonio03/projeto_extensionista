-- Sprint 00 · ADR-0003: um banco, schemas por módulo.
-- Migração versionada e imutável — nunca DDL manual.
CREATE SCHEMA IF NOT EXISTS pacientes;
CREATE SCHEMA IF NOT EXISTS exames;
CREATE SCHEMA IF NOT EXISTS laudos;
CREATE SCHEMA IF NOT EXISTS iam;
CREATE SCHEMA IF NOT EXISTS auditoria;
CREATE SCHEMA IF NOT EXISTS bi;

COMMENT ON SCHEMA auditoria IS 'Trilha append-only (quem, quando, o quê) — sem PII adicional';
COMMENT ON SCHEMA bi IS 'Somente leitura; consumo exclusivo de views pseudonimizadas';
