<?php

namespace sistema\Controller;

use sistema\Controller\UsuarioController;
use sistema\Nucleo\Controller;
use sistema\Nucleo\Sessao;
use sistema\Nucleo\Helpers;


class SaasController extends Controller
{

    private $usuario;

    public function __construct()
    {
        parent::__construct('templates/saas/views');

        $this->usuario = UsuarioController::usuario();

        if (!$this->usuario OR $this->usuario->level < 1) {
            $this->mensagem->alerta('Faça login para acessar o painel do usuário!')->flash();

            $sessao = new Sessao();
            $sessao->limpar('usuarioId');

            Helpers::redirecionar();
        }
    }

    public function index(): void
    {
        echo $this->template->renderizar('conta.html', [
            'usuario' => $this->usuario
        ]);
    }

    /**
     * Faz logout do usuário
     * @return void
     */
    public function sair(): void
    {
        $sessao = new Sessao();
        $sessao->limpar('usuarioId');

        $this->mensagem->informa($this->usuario->nome . ', você saiu do painel de controle!')->flash();
        Helpers::redirecionar();
    }

    public function alterarDados(): void
    {
        
    }

    public function alterarEmail(): void
    {
        
    }

    public function alterarSenha(): void
    {
        
    }

    public function endereco(): void
    {
        
    }

    public function cadastrarEndereco(): void
    {
        
    }

    public function editarEndereco(): void
    {
        
    }
}
