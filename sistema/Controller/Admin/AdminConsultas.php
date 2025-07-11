<?php

namespace sistema\Controller\Admin;

use sistema\Modelo\ControleLivroModelo;
use sistema\Modelo\EditoraModelo;
use sistema\Modelo\GeneroLivroModelo;
use sistema\Modelo\IdiomaLivroModelo;
use sistema\Modelo\LivroModelo;
use sistema\Modelo\PaisLivroModelo;
use sistema\Modelo\TipoProcedenciaLivro;
use Verot\Upload\Upload;
use sistema\Nucleo\Helpers;
use sistema\Nucleo\Conexao;
use sistema\Modelo\UsuarioModelo;
use sistema\Modelo\TipoUsuarioModelo;



class AdminConsultas extends AdminController
{

    public function listarAtrasos(): void
    {
        //Só permitir que Administrador entren na tela de listar usuarios
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        } else if ($this->usuario->status != 1) {
            $this->mensagem->erro("Usuário Inativo!")->flash();
            Helpers::redirecionar('admin/sair');
        }
        // $hoje = (new \DateTime())->format('Y-m-d');
        // var_dump($hoje);die;
        $lista_atrasos = (new ControleLivroModelo)->busca(
            "data_efetiva is null and data_prevista < now()",
            "",
            "*, (select nome_leitor from leitores where controle_livros.leitor_id = leitores.id) as nome_leitor, (select titulo_livro from livros where controle_livros.livro_id = livros.id) as titulo_livro"
        );

        echo $this->template->renderizar('consultas/listarAtrasos.html', [
            'lista_atrasos' => $lista_atrasos->resultado(true),
        ]);
    }
}
