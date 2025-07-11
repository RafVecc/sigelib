<?php

namespace sistema\Modelo;

use sistema\Nucleo\Modelo;
use sistema\Nucleo\Sessao;
use sistema\Nucleo\Helpers;


class OrientacaoSexualLeitorModelo extends Modelo
{

    public function __construct()
    {
        parent::__construct('orientacao_sexual_leitor');
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

    public function salvar(): bool
    {
        return parent::salvar();
    }
}
