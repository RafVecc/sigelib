<?php

namespace sistema\Modelo;

use sistema\Nucleo\Modelo;
use sistema\Nucleo\Sessao;
use sistema\Nucleo\Helpers;


class LeitorModelo extends Modelo
{

    public function __construct()
    {
        parent::__construct('leitores');
    }

    /**
     * Busca o tipo de usuário pelo ID
     * @return TipoUsuarioModelo|null
     */
    public function tipoUsuario(): ?TipoUsuarioModelo
    {
        if ($this->tipo_usuario_id) {
            return (new TipoUsuarioModelo())->buscaPorId($this->tipo_usuario_id);
        }
        return null;
    }

    public function genero_livro(): ?GeneroLivroModelo
    {
        if ($this->genero_livro_id) {
            return (new GeneroLivroModelo())->buscaPorId($this->genero_livro_id);
        }
        return null;
    }

    public function idioma_livro(): ?IdiomaLivroModelo
    {
        if ($this->idioma_livro_id) {
            return (new IdiomaLivroModelo())->buscaPorId($this->idioma_livro_id);
        }
        return null;
    }

    public function pais_livro(): ?PaisLivroModelo
    {
        if ($this->pais_livro_id) {
            return (new PaisLivroModelo())->buscaPorId($this->pais_livro_id);
        }
        return null;
    }

    public function tipo_procedencia_livro(): ?TipoProcedenciaLivro
    {
        if ($this->tipo_procedencia_livro_id) {
            return (new TipoProcedenciaLivro())->buscaPorId($this->tipo_procedencia_livro_id);
        }
        return null;
    }

    public function cor_raca(): ?CorRacaModelo
    {
        if ($this->cor_leitor_id) {
            return (new CorRacaModelo())->buscaPorId($this->cor_leitor_id);
        }
        return null;
    }

    public function escolaridade(): ?EscolaridadeModelo
    {
        if ($this->escolaridade_leitor_id) {
            return (new EscolaridadeModelo())->buscaPorId($this->escolaridade_leitor_id);
        }
        return null;
    }

    public function genero_sexual_leitor(): ?GeneroSexualLeitorModelo
    {
        if ($this->genero_sexual_leitor_id) {
            return (new GeneroSexualLeitorModelo())->buscaPorId($this->genero_sexual_leitor_id);
        }
        return null;
    }

    public function orientacao_sexual_leitor(): ?OrientacaoSexualLeitorModelo
    {
        if ($this->orientacao_sexual_leitor_id) {
            return (new OrientacaoSexualLeitorModelo())->buscaPorId($this->orientacao_sexual_leitor_id);
        }
        return null;
    }

    public function livro_emprestado()
    {
        if ($this->id) {
            return (new ControleLivroModelo())->busca("leitor_id = {$this->id} and data_efetiva is null")->total();
        }
        return null;
    }

    public function salvar(): bool
    {
        return parent::salvar();
    }
}
