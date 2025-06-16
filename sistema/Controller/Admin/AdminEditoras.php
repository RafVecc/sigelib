<?php

namespace sistema\Controller\Admin;

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



class AdminEditoras extends AdminController
{

    public function listar(): void
    {
        //Só permitir que Administrador entren na tela de listar usuarios
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }

        $editoras = new EditoraModelo();
        $paises_livro = new PaisLivroModelo();

        echo $this->template->renderizar('editoras/listar.html', [
            'editoras' => $editoras->busca()->resultado(true),
            'paises_livro' => $paises_livro->busca()->resultado(true),
        ]);
    }

    public function cadastrar(): void
    {
        //Só permitir que Administrador entren na tela de cadastrar editoras
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }
        // phpinfo();
        // die;
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        if (isset($dados)) {
            Conexao::getInstancia()->beginTransaction();
            //checa os dados 
            if ($this->validarDados($dados)) {

                $editora = new EditoraModelo();

                $editora->usuario_cadastro_id = $this->usuario->id;
                $editora->usuario_modificacao_id = $this->usuario->id;
                $editora->editora_livro = isset($dados['editora_livro']) && !empty($dados['editora_livro']) ? $dados['editora_livro'] : NULL;
                $editora->pais_editora_livro_id = isset($dados['pais_editora_livro_id']) && !empty($dados['pais_editora_livro_id']) ? $dados['pais_editora_livro_id'] : NULL;

                if ($editora->salvar()) {
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Editora cadastrada com sucesso')->flash();
                    Helpers::redirecionar('admin/editoras/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($editora->erro())->flash();
                    Helpers::redirecionar('admin/editoras/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/editoras/listar');
            }
        }
    }

    public function editar(): void
    {
        //Só permitir que Administrador entren na tela de editar editoras
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        if (isset($dados)) {
            Conexao::getInstancia()->beginTransaction();
            //checa os dados 
            if ($this->validarDados($dados)) {

                $editora = (new EditoraModelo())->buscaPorId($dados['editora_id']);

                $editora->usuario_modificacao_id = $this->usuario->id;
                $editora->editora_livro = isset($dados['editora_livro_editar']) && !empty($dados['editora_livro_editar']) ? $dados['editora_livro_editar'] : NULL;
                $editora->pais_editora_livro_id = isset($dados['pais_editora_livro_editar_id']) && !empty($dados['pais_editora_livro_editar_id']) ? $dados['pais_editora_livro_editar_id'] : NULL;

                if ($editora->salvar()) {
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Editora editada com sucesso')->flash();
                    Helpers::redirecionar('admin/editoras/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($editora->erro())->flash();
                    Helpers::redirecionar('admin/editoras/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/editoras/listar');
            }
        }
    }

    /**
     * Checa os dados do formulário
     * @param array $dados
     * @return bool
     */
    public function validarDados(array $dados, $usuario = null)
    {
        // if (empty($dados['nome'])) {
        //     return ['check' => false, 'mensagem' => 'Informe o nome do usuário!'];
        // }

        // if (empty($dados['telefone'])) {
        //     return ['check' => false, 'mensagem' => 'Informe o telefone do usuário!'];
        // }

        // if (!empty($dados['email'])) {
        //     if (!Helpers::validarEmail($dados['email'])) {
        //         return ['check' => false, 'mensagem' => 'Informe um e-mail válido!'];
        //     }
        // }

        // if (
        //     empty($usuario) ||
        //     ((isset($usuario->data_inicio) && !empty($usuario->data_inicio) ? (new \DateTime($usuario->data_inicio))->format('Y-m-d') : NULL) != $dados['data_inicio'] ||
        //         (isset($usuario->data_fim) && !empty($usuario->data_fim) ? (new \DateTime($usuario->data_fim))->format('Y-m-d') : NULL) != $dados['data_fim'])
        // ) {
        //     if (empty($dados['data_fim']) && empty($dados['data_inicio'])) {
        //     } else {
        //         $data_hoje = (new \DateTime())->format('Y-m-d');
        //         if (!empty($dados['data_fim']) && !empty($dados['data_inicio'])) {
        //             if ($dados['data_inicio'] >= $dados['data_fim']) {
        //                 return ['check' => false, 'mensagem' => 'A data de início não pode ser maior ou igual a data final de permissão de acesso!'];
        //             } else {
        //                 if ($dados['data_inicio'] < $data_hoje && empty($usuario)) {
        //                     return ['check' => false, 'mensagem' => 'A data de início não pode ser menor que a data de hoje!'];
        //                 } else {
        //                     if ($dados['data_fim'] < $data_hoje) {
        //                         return ['check' => false, 'mensagem' => 'A data final não pode ser menor que a data de hoje!'];
        //                     }
        //                 }
        //             }
        //         } elseif (empty($dados['data_fim']) && !empty($dados['data_inicio'])) {
        //             if ($dados['data_inicio'] < $data_hoje && empty($usuario)) {
        //                 return ['check' => false, 'mensagem' => 'A data de início não pode ser menor que a data de hoje!'];
        //             }
        //         }
        //     }
        // }

        // return ['check' => true, 'mensagem' => ''];
        return true;
    }

    public function valorizarEditora()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $valorizar_editora = (new EditoraModelo())->busca("id = {$dados['id']}")->resultado(false, true);

        return json_encode($valorizar_editora);
    }

    // public function statusAluno()
    // {
    //     $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
    //     $mudar_status = (new AlunoModelo())->buscaPorId($dados['id']);

    //     if (isset($mudar_status)) {
    //         Conexao::getInstancia()->beginTransaction();
    //         $mudar_status->usuario_modificacao_id = $this->usuario->id;
    //         if ($mudar_status->status == 1) {
    //             $mudar_status->status = 2;
    //         } else {
    //             $mudar_status->status = 1;
    //         }
    //         if ($mudar_status->salvar()) {
    //             Conexao::getInstancia()->commit();
    //             return true;
    //         } else {
    //             Conexao::getInstancia()->rollBack();
    //             return 'false';
    //         }
    //     } else {
    //         return 'false';
    //     }
    // }
}
