<?php

namespace sistema\Controller\Admin;

use sistema\Nucleo\Sessao;
use sistema\Nucleo\Helpers;
use sistema\Modelo\UnidadeModelo;
use sistema\Modelo\UsuarioModelo;
use sistema\Modelo\CategoriaModelo;
use sistema\Modelo\VagasUnidadeModelo;


class AdminDashboard extends AdminController
{

    /**
     * Home do admin
     * @return void
     */
    public function dashboard(): void
    {
        // $unidades = new UnidadeModelo();
        $usuarios = new UsuarioModelo();
        // $categorias = new CategoriaModelo();
        // $vagasUnidades = new VagasUnidadeModelo();
        
        // $dadosUnidades = [];
        $vagasPorTipoDeVaga = [];
        $vagasPorTipoDeVagaUnidade = [];
        $vagasPorCategoria = [];
        $totalDeVagas = [];
        if(($this->usuario->tipo_de_usuario_id == 2 OR  $this->usuario->tipo_de_usuario_id == 1)){
        // $dadosUnidades = [
        //     // 'vagasUnidades' => $vagasUnidades->VagasPorUnidade(),
        //     'unidades' => $unidades->busca()->ordem('id DESC')->resultado(true),
        //     'total' => $unidades->busca(null,'COUNT(id)','id')->total(),
        //     'ativo' => $unidades->busca('data_exclusao is null')->total(),
        //     'inativo' => $unidades->busca('data_exclusao is not null')->total()
        // ];

        // $vagasPorTipoDeVaga = $vagasUnidades->VagasPorTipoDeVaga();
        // $vagasPorTipoDeVagaUnidade = $vagasUnidades->VagasPorTipoDeVagaUnidade();
        // $vagasPorCategoria = $vagasUnidades->VagasPorCategoria();
        // $totalDeVagas = $vagasUnidades->TotalDeVagas();
        }

        echo $this->template->renderizar('dashboard.html', [

            // 'unidades' => $dadosUnidades,
            'vagasPorTipoDeVaga' => $vagasPorTipoDeVaga,
            'vagasPorTipoDeVagaUnidade' => $vagasPorTipoDeVagaUnidade,
            'vagasPorCategoria' => $vagasPorCategoria,
            'totalDeVagas' => $totalDeVagas,
            // 'usuarios' => [
            //     'logins' => $usuarios->busca()->ordem('ultimo_login DESC')->limite(5)->resultado(true),
            //     'usuarios' => $usuarios->busca('level != 3')->total(),
            //     'usuariosAtivo' => $usuarios->busca('status = 1 AND level != 3')->total(),
            //     'usuariosInativo' => $usuarios->busca('status = 0 AND level != 3')->total(),
            //     'admin' => $usuarios->busca('level = 3')->total(),
            //     'adminAtivo' => $usuarios->busca('status = 1 AND level = 3')->total(),
            //     'adminInativo' => $usuarios->busca('status = 0 AND level = 3')->total()
            // ],
            'dashboard' => true,
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

        $this->mensagem->informa('Você saiu do painel de controle!')->flash();
        //Helpers::redirecionar('admin/login');
        Helpers::redirecionar('login');
    }

}
