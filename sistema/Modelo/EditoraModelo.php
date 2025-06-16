<?php

namespace sistema\Modelo;

use sistema\Nucleo\Modelo;
use sistema\Nucleo\Sessao;
use sistema\Nucleo\Helpers;


class EditoraModelo extends Modelo
{

    public function __construct()
    {
        parent::__construct('editora_livro');
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

    public function pais_editora_livro(): ?PaisLivroModelo
    {
        if ($this->pais_editora_livro_id) {
            return (new PaisLivroModelo())->buscaPorId($this->pais_editora_livro_id);
        }
        return null;
    }

    public function salvar(): bool
    {
        return parent::salvar();
    }
}
