<?php

namespace sistema\Controller\Admin;

use sistema\Modelo\BairroModelo;
use Verot\Upload\Upload;
use sistema\Nucleo\Helpers;
use sistema\Nucleo\Conexao;
use sistema\Modelo\UsuarioModelo;
use sistema\Modelo\UnidadeModelo;
use sistema\Modelo\TipoUsuarioModelo;
use sistema\Modelo\EntidadeModelo;



class AdminEntidades extends AdminController
{

    public function listar(): void
    {
        //Só permitir que Administrador entren na tela de listar usuarios
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }
        $entidade = new EntidadeModelo();
        $bairros = (new BairroModelo())->busca()->resultado(true);
        // $unidades = (new UnidadeModelo())->busca()->resultado(true);

        echo $this->template->renderizar('entidades/listar.html', [
            'entidades' => $entidade->busca()->resultado(true),
            'bairros' => $bairros,
            // 'unidades' => $unidades,
            'total' => [
                'entidades' => $entidade->busca()->total(),
                'entidadesAtivas' => $entidade->busca('status = 1')->total(),
                'entidadesInativas' => $entidade->busca('status = 2')->total()
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

                $entidade = new EntidadeModelo();

                $token = Helpers::gerarToken(6);
                $check = $entidade->busca("token = '{$token}'")->total();

                while ($check > 0) {
                    $token = Helpers::gerarToken(6);
                    $check = $entidade->busca("token = '{$token}'")->total();
                }

                $entidade->usuario_cadastro_id = $this->usuario->id;
                $entidade->usuario_modificacao_id = $this->usuario->id;
                $entidade->nome = isset($dados['nome']) && !empty($dados['nome']) ? $dados['nome'] : NULL;
                $entidade->cep = isset($dados['cep']) && !empty($dados['cep']) ? $dados['cep'] : NULL;
                $entidade->bairro_id = isset($dados['bairro_id']) && !empty($dados['bairro_id']) ? $dados['bairro_id'] : NULL;
                $entidade->endereco = isset($dados['endereco']) && !empty($dados['endereco']) ? $dados['endereco'] : NULL;
                $entidade->numero = isset($dados['numero']) && !empty($dados['numero']) ? $dados['numero'] : NULL;
                $entidade->complemento = isset($dados['complemento']) && !empty($dados['complemento']) ? $dados['complemento'] : NULL;
                $entidade->referencia = isset($dados['referencia']) && !empty($dados['referencia']) ? $dados['referencia'] : NULL;
                $entidade->email = isset($dados['email']) && !empty($dados['email']) ? $dados['email'] : NULL;
                $entidade->telefone_entidade = isset($dados['telefone_entidade']) && !empty($dados['telefone_entidade']) ? $dados['telefone_entidade'] : NULL;
                $entidade->nome_responsavel = isset($dados['nome_responsavel']) && !empty($dados['nome_responsavel']) ? $dados['nome_responsavel'] : NULL;
                $entidade->telefone_responsavel = isset($dados['telefone_responsavel']) && !empty($dados['telefone_responsavel']) ? $dados['telefone_responsavel'] : NULL;
                $entidade->status = 1;
                $entidade->token = $token;

                if ($_FILES['contrato']['error'] == 0) {
                    $upload = new Upload($_FILES['contrato'], 'pt_BR');
                    if ($upload->uploaded) {
                        if (in_array($upload->file_src_name_ext, ['pdf'])) {

                            $contrato_token = Helpers::gerarToken();
                            $titulo = $upload->file_new_name_body = 'termoCompromisso_' . $contrato_token;

                            // var_dump($upload);die;
                            $upload->process('uploads/entidades/' . $token . '/');
                            $entidade->contrato = $titulo . '.pdf';
                            if (!$upload->processed) {
                                Conexao::getInstancia()->rollBack();
                                $this->mensagem->alerta('Erro de Processamento!')->flash();
                                Helpers::redirecionar('admin/entidades/listar');
                            }
                        } else {
                            Conexao::getInstancia()->rollBack();
                            $this->mensagem->alerta('Formato de imagem não permitido!')->flash();
                            Helpers::redirecionar('admin/entidades/listar');
                        }
                    } else {
                        Conexao::getInstancia()->rollBack();
                        $this->mensagem->alerta('Erro de Upload!')->flash();
                        Helpers::redirecionar('admin/entidades/listar');
                    }
                }

                if ($_FILES['logo']['error'] == 0) {
                    $upload = new Upload($_FILES['logo'], 'pt_BR');
                    if ($upload->uploaded) {
                        if (in_array($upload->file_src_name_ext, ['png', 'jpg', 'jpeg'])) {

                            $logo_token = Helpers::gerarToken();
                            $titulo = $upload->file_new_name_body = 'logoEntidade_' . $logo_token;
                            $upload->jpeg_quality = 80;
                            $upload->image_convert = 'jpg';
                            $upload->process('uploads/entidades/' . $token . '/');
                            $entidade->logo = $titulo . '.jpg';
                            if (!$upload->processed) {
                                Conexao::getInstancia()->rollBack();
                                $this->mensagem->alerta('Erro de Processamento!')->flash();
                                Helpers::redirecionar('admin/entidades/listar');
                            }
                        } else {
                            Conexao::getInstancia()->rollBack();
                            $this->mensagem->alerta('Formato de imagem não permitido!')->flash();
                            Helpers::redirecionar('admin/entidades/listar');
                        }
                    } else {
                        Conexao::getInstancia()->rollBack();
                        $this->mensagem->alerta('Erro de Upload!')->flash();
                        Helpers::redirecionar('admin/entidades/listar');
                    }
                }

                if ($entidade->salvar()) {
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Usuário cadastrado com sucesso')->flash();
                    Helpers::redirecionar('admin/entidades/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($entidade->erro())->flash();
                    Helpers::redirecionar('admin/entidades/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/entidades/listar');
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

                $entidade = (new EntidadeModelo())->buscaPorId($dados['entidade_id']);

                $entidade->usuario_modificacao_id = $this->usuario->id;
                $entidade->nome = isset($dados['nome_editar']) && !empty($dados['nome_editar']) ? $dados['nome_editar'] : NULL;
                $entidade->cep = isset($dados['cep_editar']) && !empty($dados['cep_editar']) ? $dados['cep_editar'] : NULL;
                $entidade->bairro_id = isset($dados['bairro_id_editar']) && !empty($dados['bairro_id_editar']) ? $dados['bairro_id_editar'] : NULL;
                $entidade->endereco = isset($dados['endereco_editar']) && !empty($dados['endereco_editar']) ? $dados['endereco_editar'] : NULL;
                $entidade->numero = isset($dados['numero_editar']) && !empty($dados['numero_editar']) ? $dados['numero_editar'] : NULL;
                $entidade->complemento = isset($dados['complemento_editar']) && !empty($dados['complemento_editar']) ? $dados['complemento_editar'] : NULL;
                $entidade->referencia = isset($dados['referencia_editar']) && !empty($dados['referencia_editar']) ? $dados['referencia_editar'] : NULL;
                $entidade->email = isset($dados['email_editar']) && !empty($dados['email_editar']) ? $dados['email_editar'] : NULL;
                $entidade->telefone_entidade = isset($dados['telefone_entidade_editar']) && !empty($dados['telefone_entidade_editar']) ? $dados['telefone_entidade_editar'] : NULL;
                $entidade->nome_responsavel = isset($dados['nome_responsavel_editar']) && !empty($dados['nome_responsavel_editar']) ? $dados['nome_responsavel_editar'] : NULL;
                $entidade->telefone_responsavel = isset($dados['telefone_responsavel_editar']) && !empty($dados['telefone_responsavel_editar']) ? $dados['telefone_responsavel_editar'] : NULL;
                $logo_antiga = $entidade->logo;
                $contrato_antigo = $entidade->contrato;
                $token = $entidade->token;

                if ($_FILES['contrato_editar']['error'] == 0) {
                    $upload = new Upload($_FILES['contrato_editar'], 'pt_BR');
                    if ($upload->uploaded) {
                        if (in_array($upload->file_src_name_ext, ['pdf'])) {
                            $contrato_token = Helpers::gerarToken();
                            $titulo = $upload->file_new_name_body = 'termoCompromisso_' . $contrato_token;
                            $upload->process('uploads/entidades/' . $token . '/');
                            $entidade->contrato = $titulo . '.pdf';
                            if (!$upload->processed) {
                                Conexao::getInstancia()->rollBack();
                                $this->mensagem->alerta('Erro de Processamento!')->flash();
                                Helpers::redirecionar('admin/entidades/listar');
                            }
                            if (isset($contrato_antigo)) {
                                unlink('uploads/entidades/' . $token . '/' . $contrato_antigo);
                            }
                        } else {
                            Conexao::getInstancia()->rollBack();
                            $this->mensagem->alerta('Formato de imagem não permitido!')->flash();
                            Helpers::redirecionar('admin/entidades/listar');
                        }
                    } else {
                        Conexao::getInstancia()->rollBack();
                        $this->mensagem->alerta('Erro de Upload!')->flash();
                        Helpers::redirecionar('admin/entidades/listar');
                    }
                }

                if ($_FILES['logo_editar']['error'] == 0) {
                    $upload = new Upload($_FILES['logo_editar'], 'pt_BR');
                    if ($upload->uploaded) {
                        if (in_array($upload->file_src_name_ext, ['png', 'jpg', 'jpeg'])) {

                            $logo_token = Helpers::gerarToken();
                            $titulo = $upload->file_new_name_body = 'logoEntidade_' . $logo_token;
                            $upload->jpeg_quality = 80;
                            $upload->image_convert = 'jpg';
                            $upload->process('uploads/entidades/' . $token . '/');
                            $entidade->logo = $titulo . '.jpg';
                            if (!$upload->processed) {
                                Conexao::getInstancia()->rollBack();
                                $this->mensagem->alerta('Erro de Processamento!')->flash();
                                Helpers::redirecionar('admin/entidades/listar');
                            }
                            if (isset($logo_antiga)) {
                                unlink('uploads/entidades/' . $token . '/' . $logo_antiga);
                            }
                        } else {
                            Conexao::getInstancia()->rollBack();
                            $this->mensagem->alerta('Formato de imagem não permitido!')->flash();
                            Helpers::redirecionar('admin/entidades/listar');
                        }
                    } else {
                        Conexao::getInstancia()->rollBack();
                        $this->mensagem->alerta('Erro de Upload!')->flash();
                        Helpers::redirecionar('admin/entidades/listar');
                    }
                }

                if ($entidade->salvar()) {
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Usuário cadastrado com sucesso')->flash();
                    Helpers::redirecionar('admin/entidades/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($entidade->erro())->flash();
                    Helpers::redirecionar('admin/entidades/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/entidades/listar');
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

    public function valorizarEntidade()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $valorizar_entidade = (new EntidadeModelo())->busca("id = {$dados['id']}")->resultado(false, true);

        return json_encode($valorizar_entidade);
    }

    public function statusEntidade()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $mudar_status = (new EntidadeModelo())->buscaPorId($dados['id']);

        if (isset($mudar_status)) {
            Conexao::getInstancia()->beginTransaction();
            $mudar_status->usuario_modificacao_id = $this->usuario->id;
            if ($mudar_status->status == 1) {
                $mudar_status->status = 2;
            } else {
                $mudar_status->status = 1;
            }
            if ($mudar_status->salvar()) {
                Conexao::getInstancia()->commit();
                return true;
            } else {
                Conexao::getInstancia()->rollBack();
                return 'false';
            }
        } else {
            return 'false';
        }
    }

}
