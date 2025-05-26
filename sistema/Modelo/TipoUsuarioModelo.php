<?php

namespace sistema\Modelo;

use sistema\Nucleo\Conexao;
use sistema\Nucleo\Modelo;

class TipoUsuarioModelo extends Modelo
{

    public function __construct()
    {
        parent::__construct('tipo_usuario');
    }

    /**
     * Salva o unidade com slug
     * @return bool
     */
    public function salvar(): bool
    {
        return parent::salvar();
    }

}
