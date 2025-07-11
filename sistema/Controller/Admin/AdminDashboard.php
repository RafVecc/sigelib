<?php

namespace sistema\Controller\Admin;

use sistema\Nucleo\Sessao;
use sistema\Nucleo\Helpers;
use sistema\Nucleo\Conexao;
use sistema\Modelo\UnidadeModelo;
use sistema\Modelo\UsuarioModelo;
use sistema\Modelo\CategoriaModelo;
use sistema\Modelo\ControleLivroModelo;
use sistema\Modelo\VagasUnidadeModelo;


class AdminDashboard extends AdminController
{

    /**
     * Home do admin
     * @return void
     */
    public function dashboard(): void
    {

        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        } else if ($this->usuario->status != 1) {
            $this->mensagem->erro("Usuário Inativo!")->flash();
            Helpers::redirecionar('admin/sair');
        }

        echo $this->template->renderizar('dashboard.html', [

            'dashboard' => true,
        ]);
    }

    public function checkNotificacao()
    {
        $usuario_flag = $this->usuario->flag_notificacao;

        if ($usuario_flag == 0) {
            return json_encode(true);
        } else {
            return json_encode('false');
        }
    }

    public function listaAtrasos()
    {
        $check_atrasos = (new ControleLivroModelo)->busca(
            "data_efetiva is null",
            "",
            "*, (select nome_leitor from leitores where controle_livros.leitor_id = leitores.id) as nome_leitor, (select titulo_livro from livros where controle_livros.livro_id = livros.id) as titulo_livro"
        )->resultado(false, true);

        Conexao::getInstancia()->beginTransaction();

        $usuario = (new UsuarioModelo())->buscaPorId($this->usuario->id);

        $usuario->usuario_modificacao_id = $this->usuario->id;
        $usuario->flag_notificacao = 1;

        if ($usuario->salvar()) {
            Conexao::getInstancia()->commit();
        } else {
            Conexao::getInstancia()->rollBack();
        }

        if (isset($check_atrasos)) {
            return json_encode($check_atrasos);
        } else {
            return json_encode(null);
        }
    }

    /**
     * Faz logout do usuário
     * @return void
     */
    public function sair(): void
    {
        Conexao::getInstancia()->beginTransaction();

        $usuario = (new UsuarioModelo())->buscaPorId($this->usuario->id);

        $usuario->usuario_modificacao_id = $this->usuario->id;
        $usuario->flag_notificacao = 0;

        if ($usuario->salvar()) {
            Conexao::getInstancia()->commit();
        } else {
            Conexao::getInstancia()->rollBack();
        }

        $sessao = new Sessao();
        $sessao->limpar('usuarioId');

        $this->mensagem->informa('Você saiu do painel de controle!')->flash();
        //Helpers::redirecionar('admin/login');
        Helpers::redirecionar('login');
    }
}
