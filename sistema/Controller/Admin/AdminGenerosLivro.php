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



class AdminGenerosLivro extends AdminController
{

    public function listar(): void
    {
        //Só permitir que Administrador entren na tela de listar usuarios
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        } else if ($this->usuario->status != 1) {
            $this->mensagem->erro("Usuário Inativo!")->flash();
            Helpers::redirecionar('admin/sair');
        }

        $generos_livro = new GeneroLivroModelo();

        echo $this->template->renderizar('generos_livro/listar.html', [
            'generos_livro' => $generos_livro->busca()->resultado(true),
        ]);
    }

    public function cadastrar(): void
    {
        //Só permitir que Administrador entren na tela de cadastrar genero do livro
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        } else if ($this->usuario->status != 1) {
            $this->mensagem->erro("Usuário Inativo!")->flash();
            Helpers::redirecionar('admin/sair');
        }
        // phpinfo();
        // die;
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        if (isset($dados)) {
            Conexao::getInstancia()->beginTransaction();
            //checa os dados 
            if ($this->validarDados($dados)) {

                $generos_livro = new GeneroLivroModelo();

                $generos_livro->usuario_cadastro_id = $this->usuario->id;
                $generos_livro->usuario_modificacao_id = $this->usuario->id;
                $generos_livro->genero_livro = isset($dados['genero_livro']) && !empty($dados['genero_livro']) ? $dados['genero_livro'] : NULL;

                if ($generos_livro->salvar()) {
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Tipo do Livro cadastrado com sucesso')->flash();
                    Helpers::redirecionar('admin/generos_livro/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($generos_livro->erro())->flash();
                    Helpers::redirecionar('admin/generos_livro/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/generos_livro/listar');
            }
        }
    }

    public function editar(): void
    {
        //Só permitir que Administrador entren na tela de editar genero do livro
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        } else if ($this->usuario->status != 1) {
            $this->mensagem->erro("Usuário Inativo!")->flash();
            Helpers::redirecionar('admin/sair');
        }
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        if (isset($dados)) {
            Conexao::getInstancia()->beginTransaction();
            //checa os dados 
            if ($this->validarDados($dados)) {

                $generos_livro = (new EditoraModelo())->buscaPorId($dados['genero_livro_id']);

                $generos_livro->usuario_modificacao_id = $this->usuario->id;
                $generos_livro->genero_livro = isset($dados['genero_livro_editar']) && !empty($dados['genero_livro_editar']) ? $dados['genero_livro_editar'] : NULL;

                if ($generos_livro->salvar()) {
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Tipo do Livro editado com sucesso')->flash();
                    Helpers::redirecionar('admin/generos_livro/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($generos_livro->erro())->flash();
                    Helpers::redirecionar('admin/generos_livro/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/generos_livro/listar');
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

    public function valorizarGeneroLivro()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $valorizar_genero_livro = (new GeneroLivroModelo())->busca("id = {$dados['id']}")->resultado(false, true);

        return json_encode($valorizar_genero_livro);
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
