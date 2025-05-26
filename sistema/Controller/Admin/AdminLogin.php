<?php

namespace sistema\Controller\Admin;

use sistema\Nucleo\Controller;
use sistema\Nucleo\Helpers;
use sistema\Modelo\UsuarioModelo;
use sistema\Controller\UsuarioController;


class AdminLogin extends Controller
{

    public function __construct()
    {
        parent::__construct('templates/admin/views');
    }

    public function index(): void
    {
        $usuario = UsuarioController::usuario();
        if ($usuario && $usuario->level == 3) {
            Helpers::redirecionar('admin/dashboard');
        } else {
            //Helpers::redirecionar('admin/login');
            Helpers::redirecionar('login');
        }
    }
}
