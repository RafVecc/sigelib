<?php

namespace sistema\Nucleo;

use sistema\Suporte\Template;

class Controller
{
    protected Template $template;
    protected Mensagem $mensagem;

    /**
     * Construtor responsável por definir o diretório pai das views e criar a instancia do engine template e mensagens.
     * @param string $diretorio
     */
    public function __construct(string $diretorio)
    {
        $this->template = new Template($diretorio);
        
        $this->mensagem = new Mensagem();
    }
}
