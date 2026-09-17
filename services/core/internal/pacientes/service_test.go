package pacientes

import (
	"errors"
	"testing"
)

type repoFake struct{ p *Paciente }

func (r *repoFake) ObterPorID(string) (*Paciente, error) { return r.p, nil }

func TestObterSemIDRetornaErroDominio(t *testing.T) {
	s := NovoService(&repoFake{})
	if _, err := s.Obter(""); !errors.Is(err, ErrDadosInvalidos) {
		t.Fatalf("esperado ErrDadosInvalidos, obtido %v", err)
	}
}

func TestObterInexistenteRetornaErroDominio(t *testing.T) {
	s := NovoService(&repoFake{p: nil})
	if _, err := s.Obter("x"); !errors.Is(err, ErrNaoEncontrado) {
		t.Fatalf("esperado ErrNaoEncontrado, obtido %v", err)
	}
}
