<?php

namespace sistema\Controller\Admin;

use sistema\Nucleo\Controller;
use sistema\Nucleo\Helpers;
use sistema\Controller\UsuarioController;
use sistema\Nucleo\Sessao;



class AdminController extends Controller
{
    protected $usuario;

    public function __construct()
    {
        parent::__construct('templates/admin/views');
        
        $this->usuario = UsuarioController::usuario();
        
        if(!$this->usuario){
            $this->mensagem->erro('Faça login para acessar o Sistema de Gestão de Acolhimento!')->flash();
            
            $sessao = new Sessao();
            $sessao->limpar('usuarioId');
            
            //Helpers::redirecionar('admin/login');
            Helpers::redirecionar('login');
        }
    }
    
}
