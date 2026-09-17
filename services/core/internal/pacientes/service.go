// Package pacientes — módulo de domínio de pacientes (Sprint 02).
// Fronteira: NÃO conhece exames/laudos. Comunicação só por contratos (packages/contracts).
package pacientes

import "errors"

// Erros de domínio tipados (padrão do cérebro §4).
var (
	ErrNaoEncontrado   = errors.New("paciente não encontrado")
	ErrConsentimento   = errors.New("consentimento obrigatório ausente ou revogado")
	ErrDadosInvalidos  = errors.New("dados de paciente inválidos")
)

// Paciente — entidade mínima (Sprint 02 implementará CRUD completo).
// Campos mapeados no Inventário de Dados (LGPD): docs/07-lgpd/inventario-de-dados.md
type Paciente struct {
	ID            string
	NomeCompleto  string
	CPFHash       string // nunca CPF em claro: hash + índice único
	DataNascimento string
}

// Service — regras de negócio do módulo (handler → service → repository).
type Service struct {
	repo Repository
}

// Repository — contratos de persistência; implementação vive em adapter de banco.
type Repository interface {
	ObterPorID(id string) (*Paciente, error)
}

func NovoService(r Repository) *Service { return &Service{repo: r} }

// Obter — exemplo do padrão: validação na borda, erro de domínio tipado.
func (s *Service) Obter(id string) (*Paciente, error) {
	if id == "" {
		return nil, ErrDadosInvalidos
	}
	p, err := s.repo.ObterPorID(id)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, ErrNaoEncontrado
	}
	return p, nil
}
