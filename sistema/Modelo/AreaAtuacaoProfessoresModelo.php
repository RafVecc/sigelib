<?php

namespace sistema\Modelo;

use sistema\Nucleo\Modelo;
use sistema\Nucleo\Sessao;
use sistema\Nucleo\Helpers;


class AreaAtuacaoProfessoresModelo extends Modelo
{

    public function __construct()
    {
        parent::__construct('area_atuacao_professores');
    }

    public function salvar(): bool
    {
        return parent::salvar();
    }
}
