<?php

namespace sistema\Controller\Admin;

use sistema\Modelo\AlunoModelo;
use sistema\Modelo\BairroModelo;
use Verot\Upload\Upload;
use sistema\Nucleo\Helpers;
use sistema\Nucleo\Conexao;
use sistema\Modelo\UsuarioModelo;
use sistema\Modelo\UnidadeModelo;
use sistema\Modelo\TipoUsuarioModelo;
use sistema\Modelo\EntidadeModelo;



class AdminAlunos extends AdminController
{

    public function listar(): void
    {
        //Só permitir que Administrador entren na tela de listar usuarios
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }
        $aluno = new AlunoModelo();
        $bairros = (new BairroModelo())->busca()->resultado(true);
        // $unidades = (new UnidadeModelo())->busca()->resultado(true);

        echo $this->template->renderizar('alunos/listar.html', [
            'alunos' => $aluno->busca()->resultado(true),
            'bairros' => $bairros,
            // 'unidades' => $unidades,
            'total' => [
                'alunos' => $aluno->busca()->total(),
            ]
        ]);
    }

    public function cadastrar(): void
    {
        //Só permitir que Administrador entren na tela de cadastrar usuarios
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        if (isset($dados)) {
            Conexao::getInstancia()->beginTransaction();
            //checa os dados 
            if ($this->validarDados($dados)) {

                $aluno = new AlunoModelo();

                $token = Helpers::gerarToken(6);
                $check = $aluno->busca("token = '{$token}'")->total();

                while ($check > 0) {
                    $token = Helpers::gerarToken(6);
                    $check = $aluno->busca("token = '{$token}'")->total();
                }

                $aluno->usuario_cadastro_id = $this->usuario->id;
                $aluno->usuario_modificacao_id = $this->usuario->id;
                $aluno->cpf = isset($dados['cpf']) && !empty($dados['cpf']) ? Helpers::limparNumero($dados['cpf']) : NULL;
                $aluno->nome = isset($dados['nome']) && !empty($dados['nome']) ? $dados['nome'] : NULL;
                $aluno->telefone_residencia = isset($dados['telefone_residencia']) && !empty($dados['telefone_residencia']) ? $dados['telefone_residencia'] : NULL;
                $aluno->telefone_celular = isset($dados['telefone_celular']) && !empty($dados['telefone_celular']) ? $dados['telefone_celular'] : NULL;
                $aluno->email = isset($dados['email']) && !empty($dados['email']) ? $dados['email'] : NULL;
                $aluno->rede_social = isset($dados['rede_social']) && !empty($dados['rede_social']) ? $dados['rede_social'] : NULL;
                $aluno->cep = isset($dados['cep']) && !empty($dados['cep']) ? $dados['cep'] : NULL;
                $aluno->bairro_id = isset($dados['bairro_id']) && !empty($dados['bairro_id']) ? $dados['bairro_id'] : NULL;
                $aluno->endereco = isset($dados['endereco']) && !empty($dados['endereco']) ? $dados['endereco'] : NULL;
                $aluno->numero = isset($dados['numero']) && !empty($dados['numero']) ? $dados['numero'] : NULL;
                $aluno->complemento = isset($dados['complemento']) && !empty($dados['complemento']) ? $dados['complemento'] : NULL;
                $aluno->referencia = isset($dados['referencia']) && !empty($dados['referencia']) ? $dados['referencia'] : NULL;
                $aluno->token = $token;

                if ($_FILES['foto']['error'] == 0) {
                    $upload = new Upload($_FILES['foto'], 'pt_BR');
                    if ($upload->uploaded) {
                        if (in_array($upload->file_src_name_ext, ['png', 'jpg', 'jpeg'])) {

                            $foto_token = Helpers::gerarToken();
                            $titulo = $upload->file_new_name_body = 'fotoAluno_' . $foto_token;
                            $upload->jpeg_quality = 80;
                            $upload->image_convert = 'jpg';
                            $upload->process('uploads/alunos/' . $token . '/');
                            $aluno->foto = $titulo . '.jpg';
                            if (!$upload->processed) {
                                Conexao::getInstancia()->rollBack();
                                $this->mensagem->alerta('Erro de Processamento!')->flash();
                                Helpers::redirecionar('admin/alunos/listar');
                            }
                        } else {
                            Conexao::getInstancia()->rollBack();
                            $this->mensagem->alerta('Formato de imagem não permitido!')->flash();
                            Helpers::redirecionar('admin/alunos/listar');
                        }
                    } else {
                        Conexao::getInstancia()->rollBack();
                        $this->mensagem->alerta('Erro de Upload!')->flash();
                        Helpers::redirecionar('admin/alunos/listar');
                    }
                }

                if ($aluno->salvar()) {
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Aluno cadastrado com sucesso')->flash();
                    Helpers::redirecionar('admin/alunos/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($aluno->erro())->flash();
                    Helpers::redirecionar('admin/alunos/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/alunos/listar');
            }
        }
    }

    public function editar(): void
    {
        //Só permitir que Administrador entren na tela de cadastrar usuarios
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        if (isset($dados)) {
            Conexao::getInstancia()->beginTransaction();
            //checa os dados 
            if ($this->validarDados($dados)) {

                $aluno = (new AlunoModelo())->buscaPorId($dados['aluno_id']);

                $aluno->usuario_modificacao_id = $this->usuario->id;
                $aluno->cpf = isset($dados['cpf_editar']) && !empty($dados['cpf_editar']) ? Helpers::limparNumero($dados['cpf_editar']) : NULL;
                $aluno->nome = isset($dados['nome_editar']) && !empty($dados['nome_editar']) ? $dados['nome_editar'] : NULL;
                $aluno->telefone_residencia = isset($dados['telefone_residencia_editar']) && !empty($dados['telefone_residencia_editar']) ? $dados['telefone_residencia_editar'] : NULL;
                $aluno->telefone_celular = isset($dados['telefone_celular_editar']) && !empty($dados['telefone_celular_editar']) ? $dados['telefone_celular_editar'] : NULL;
                $aluno->email = isset($dados['email_editar']) && !empty($dados['email_editar']) ? $dados['email_editar'] : NULL;
                $aluno->rede_social = isset($dados['rede_social_editar']) && !empty($dados['rede_social_editar']) ? $dados['rede_social_editar'] : NULL;
                $aluno->cep = isset($dados['cep_editar']) && !empty($dados['cep_editar']) ? $dados['cep_editar'] : NULL;
                $aluno->bairro_id = isset($dados['bairro_id_editar']) && !empty($dados['bairro_id_editar']) ? $dados['bairro_id_editar'] : NULL;
                $aluno->endereco = isset($dados['endereco_editar']) && !empty($dados['endereco_editar']) ? $dados['endereco_editar'] : NULL;
                $aluno->numero = isset($dados['numero_editar']) && !empty($dados['numero_editar']) ? $dados['numero_editar'] : NULL;
                $aluno->complemento = isset($dados['complemento_editar']) && !empty($dados['complemento_editar']) ? $dados['complemento_editar'] : NULL;
                $aluno->referencia = isset($dados['referencia_editar']) && !empty($dados['referencia_editar']) ? $dados['referencia_editar'] : NULL;
                $foto_antiga = $aluno->foto;
                $token = $aluno->token;

                if ($_FILES['foto_editar']['error'] == 0) {
                    $upload = new Upload($_FILES['foto_editar'], 'pt_BR');
                    if ($upload->uploaded) {
                        if (in_array($upload->file_src_name_ext, ['png', 'jpg', 'jpeg'])) {

                            $foto_token = Helpers::gerarToken();
                            $titulo = $upload->file_new_name_body = 'fotoAluno_' . $foto_token;
                            $upload->jpeg_quality = 80;
                            $upload->image_convert = 'jpg';
                            $upload->process('uploads/alunos/' . $token . '/');
                            $aluno->foto = $titulo . '.jpg';
                            if (!$upload->processed) {
                                Conexao::getInstancia()->rollBack();
                                $this->mensagem->alerta('Erro de Processamento!')->flash();
                                Helpers::redirecionar('admin/alunos/listar');
                            }
                            if (isset($foto_antiga)) {
                                unlink('uploads/alunos/' . $token . '/' . $foto_antiga);
                            }
                        } else {
                            Conexao::getInstancia()->rollBack();
                            $this->mensagem->alerta('Formato de imagem não permitido!')->flash();
                            Helpers::redirecionar('admin/alunos/listar');
                        }
                    } else {
                        Conexao::getInstancia()->rollBack();
                        $this->mensagem->alerta('Erro de Upload!')->flash();
                        Helpers::redirecionar('admin/alunos/listar');
                    }
                }

                if ($aluno->salvar()) {
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Aluno editado com sucesso')->flash();
                    Helpers::redirecionar('admin/alunos/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($aluno->erro())->flash();
                    Helpers::redirecionar('admin/alunos/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/alunos/listar');
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

    public function valorizarAluno()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $valorizar_aluno = (new AlunoModelo())->busca("id = {$dados['id']}")->resultado(false, true);

        return json_encode($valorizar_aluno);
    }

    public function checarCpf()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        
        $aluno_cpf = (new AlunoModelo())->busca("cpf = {$dados['cpf']}","","id")->resultado();

        if(isset($aluno_cpf)){
            return $aluno_cpf->id;
        }else{
            return null;
        }
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
