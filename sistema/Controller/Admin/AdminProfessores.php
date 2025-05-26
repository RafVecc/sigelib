<?php

namespace sistema\Controller\Admin;

use sistema\Modelo\AreaAtuacaoModelo;
use sistema\Modelo\AreaAtuacaoProfessoresModelo;
use sistema\Modelo\BairroModelo;
use Verot\Upload\Upload;
use sistema\Nucleo\Helpers;
use sistema\Nucleo\Conexao;
use sistema\Modelo\UsuarioModelo;
use sistema\Modelo\UnidadeModelo;
use sistema\Modelo\TipoUsuarioModelo;
use sistema\Modelo\EntidadeModelo;
use sistema\Modelo\ProfessorModelo;

class AdminProfessores extends AdminController
{

    public function listar(): void
    {
        //Só permitir que Administrador entren na tela de listar usuarios
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }
        $professor = new ProfessorModelo();
        $bairros = (new BairroModelo())->busca()->resultado(true);
        $area_atuacoes = (new AreaAtuacaoModelo())->busca("status = '1'")->resultado(true);
        // $unidades = (new UnidadeModelo())->busca()->resultado(true);

        echo $this->template->renderizar('professores/listar.html', [
            'professores' => $professor->busca()->resultado(true),
            'bairros' => $bairros,
            'area_atuacoes' => $area_atuacoes,
            'total' => [
                'professores' => $professor->busca()->total(),
                'professoresAtivos' => $professor->busca('status = 1')->total(),
                'professoresInativos' => $professor->busca('status = 2')->total()
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

                $professor = new ProfessorModelo();

                $token = Helpers::gerarToken(6);
                $check = $professor->busca("token = '{$token}'")->total();

                while ($check > 0) {
                    $token = Helpers::gerarToken(6);
                    $check = $professor->busca("token = '{$token}'")->total();
                }

                $professor->usuario_cadastro_id = $this->usuario->id;
                $professor->usuario_modificacao_id = $this->usuario->id;
                $professor->cpf = isset($dados['cpf']) && !empty($dados['cpf']) ? Helpers::limparNumero($dados['cpf']) : NULL;
                $professor->nome = isset($dados['nome']) && !empty($dados['nome']) ? $dados['nome'] : NULL;
                $professor->telefone = isset($dados['telefone']) && !empty($dados['telefone']) ? $dados['telefone'] : NULL;
                $professor->email = isset($dados['email']) && !empty($dados['email']) ? $dados['email'] : NULL;
                $professor->rede_social = isset($dados['rede_social']) && !empty($dados['rede_social']) ? $dados['rede_social'] : NULL;
                $professor->cep = isset($dados['cep']) && !empty($dados['cep']) ? $dados['cep'] : NULL;
                $professor->bairro_id = isset($dados['bairro_id']) && !empty($dados['bairro_id']) ? $dados['bairro_id'] : NULL;
                $professor->endereco = isset($dados['endereco']) && !empty($dados['endereco']) ? $dados['endereco'] : NULL;
                $professor->numero = isset($dados['numero']) && !empty($dados['numero']) ? $dados['numero'] : NULL;
                $professor->complemento = isset($dados['complemento']) && !empty($dados['complemento']) ? $dados['complemento'] : NULL;
                $professor->referencia = isset($dados['referencia']) && !empty($dados['referencia']) ? $dados['referencia'] : NULL;
                $professor->status = 1;
                $professor->token = $token;

                if ($_FILES['foto']['error'] == 0) {
                    $upload = new Upload($_FILES['foto'], 'pt_BR');
                    if ($upload->uploaded) {
                        if (in_array($upload->file_src_name_ext, ['png', 'jpg', 'jpeg'])) {

                            $foto_token = Helpers::gerarToken();
                            $titulo = $upload->file_new_name_body = 'fotoProfessor_' . $foto_token;
                            $upload->jpeg_quality = 80;
                            $upload->image_convert = 'jpg';
                            $upload->process('uploads/professores/' . $token . '/');
                            $professor->foto = $titulo . '.jpg';
                            if (!$upload->processed) {
                                Conexao::getInstancia()->rollBack();
                                $this->mensagem->alerta('Erro de Processamento!')->flash();
                                Helpers::redirecionar('admin/professores/listar');
                            }
                        } else {
                            Conexao::getInstancia()->rollBack();
                            $this->mensagem->alerta('Formato de imagem não permitido!')->flash();
                            Helpers::redirecionar('admin/professores/listar');
                        }
                    } else {
                        Conexao::getInstancia()->rollBack();
                        $this->mensagem->alerta('Erro de Upload!')->flash();
                        Helpers::redirecionar('admin/professores/listar');
                    }
                }

                if ($professor->salvar()) {

                    if (isset($dados['area_atuacao_id'])) {
                        if (isset($dados['area_atuacao_id'])) {
                            foreach ($dados['area_atuacao_id'] as $key => $value) {
                                $professor_especializacao = new AreaAtuacaoProfessoresModelo();
                                $professor_especializacao->professor_id = $professor->id;
                                $professor_especializacao->area_atuacao_id = isset($value) && !empty($value) ? $value : NULL;
                                if ($professor_especializacao->salvar()) {
                                } else {
                                    Conexao::getInstancia()->rollBack();
                                    $this->mensagem->erro($professor_especializacao->erro())->flash();
                                    Helpers::redirecionar('admin/professores/listar');
                                }
                            }
                        }
                    }

                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Professor cadastrado com sucesso')->flash();
                    Helpers::redirecionar('admin/professores/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($professor->erro())->flash();
                    Helpers::redirecionar('admin/professores/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/professores/listar');
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

                $professor = (new ProfessorModelo())->buscaPorId($dados['professor_id']);

                $professor->usuario_modificacao_id = $this->usuario->id;
                $professor->cpf = isset($dados['cpf_editar']) && !empty($dados['cpf_editar']) ? Helpers::limparNumero($dados['cpf_editar']) : NULL;
                $professor->nome = isset($dados['nome_editar']) && !empty($dados['nome_editar']) ? $dados['nome_editar'] : NULL;
                $professor->telefone = isset($dados['telefone_editar']) && !empty($dados['telefone_editar']) ? $dados['telefone_editar'] : NULL;
                $professor->email = isset($dados['email_editar']) && !empty($dados['email_editar']) ? $dados['email_editar'] : NULL;
                $professor->rede_social = isset($dados['rede_social_editar']) && !empty($dados['rede_social_editar']) ? $dados['rede_social_editar'] : NULL;
                $professor->cep = isset($dados['cep_editar']) && !empty($dados['cep_editar']) ? $dados['cep_editar'] : NULL;
                $professor->bairro_id = isset($dados['bairro_id_editar']) && !empty($dados['bairro_id_editar']) ? $dados['bairro_id_editar'] : NULL;
                $professor->endereco = isset($dados['endereco_editar']) && !empty($dados['endereco_editar']) ? $dados['endereco_editar'] : NULL;
                $professor->numero = isset($dados['numero_editar']) && !empty($dados['numero_editar']) ? $dados['numero_editar'] : NULL;
                $professor->complemento = isset($dados['complemento_editar']) && !empty($dados['complemento_editar']) ? $dados['complemento_editar'] : NULL;
                $professor->referencia = isset($dados['referencia_editar']) && !empty($dados['referencia_editar']) ? $dados['referencia_editar'] : NULL;
                $foto_antiga = $professor->foto;
                $token = $professor->token;

                if ($_FILES['foto_editar']['error'] == 0) {
                    $upload = new Upload($_FILES['foto_editar'], 'pt_BR');
                    if ($upload->uploaded) {
                        if (in_array($upload->file_src_name_ext, ['png', 'jpg', 'jpeg'])) {

                            $foto_token = Helpers::gerarToken();
                            $titulo = $upload->file_new_name_body = 'fotoProfessor' . $foto_token;
                            $upload->jpeg_quality = 80;
                            $upload->image_convert = 'jpg';
                            $upload->process('uploads/professores/' . $token . '/');
                            $professor->foto = $titulo . '.jpg';
                            if (!$upload->processed) {
                                Conexao::getInstancia()->rollBack();
                                $this->mensagem->alerta('Erro de Processamento!')->flash();
                                Helpers::redirecionar('admin/professores/listar');
                            }
                            if (isset($foto_antiga)) {
                                unlink('uploads/professores/' . $token . '/' . $foto_antiga);
                            }
                        } else {
                            Conexao::getInstancia()->rollBack();
                            $this->mensagem->alerta('Formato de imagem não permitido!')->flash();
                            Helpers::redirecionar('admin/professores/listar');
                        }
                    } else {
                        Conexao::getInstancia()->rollBack();
                        $this->mensagem->alerta('Erro de Upload!')->flash();
                        Helpers::redirecionar('admin/professores/listar');
                    }
                }

                if ($professor->salvar()) {

                    //==========================================================================

                    if (isset($dados['area_atuacao_id_editar'])) {
                        $antigos_especializacao = (new AreaAtuacaoProfessoresModelo())->busca("professor_id = {$dados['professor_id']}")->resultado(false, true);
                        $antigo_especializacao_array = [];

                        if ($antigos_especializacao === false) {
                            Conexao::getInstancia()->rollBack();
                            $this->mensagem->erro('Erro!')->flash();
                            Helpers::redirecionar('admin/professores/listar');
                        } else {
                            if (isset($antigos_especializacao)) {
                                foreach ($antigos_especializacao as $antigo_especializacao) {
                                    $antigo_especializacao_array[$antigo_especializacao['id']] = $antigo_especializacao['area_atuacao_id'];
                                }
                                $array_delete = array_diff($antigo_especializacao_array, $dados['area_atuacao_id_editar']);
                                if (isset($array_delete)) {
                                    $especializacao_delete = (new AreaAtuacaoProfessoresModelo());
                                    foreach ($array_delete as $key => $value) {
                                        if ($especializacao_delete->apagar("id = {$key}")) {
                                        } else {
                                            Conexao::getInstancia()->rollBack();
                                            $this->mensagem->erro($especializacao_delete->erro())->flash();
                                            Helpers::redirecionar('admin/professores/listar');
                                        }
                                    }
                                }
                            }
                        }
                        $array_insert = array_diff($dados['area_atuacao_id_editar'], $antigo_especializacao_array);
                        if (isset($array_insert)) {
                            foreach ($array_insert as $key => $value) {
                                $professor_especializacao = new AreaAtuacaoProfessoresModelo();
                                $professor_especializacao->professor_id = $dados['professor_id'];
                                $professor_especializacao->area_atuacao_id = isset($value) && !empty($value) ? $value : NULL;
                                if ($professor_especializacao->salvar()) {
                                } else {
                                    Conexao::getInstancia()->rollBack();
                                    $this->mensagem->erro($professor_especializacao->erro())->flash();
                                    Helpers::redirecionar('admin/professores/listar');
                                }
                            }
                        }
                    } else {
                        $antigos_especializacao = (new AreaAtuacaoProfessoresModelo())->busca("professor_id = {$dados['professor_id']}")->resultado(false, true);
                        $antigo_especializacao_array = [];
                        if ($antigos_especializacao === false) {
                            Conexao::getInstancia()->rollBack();
                            $this->mensagem->erro('Erro!')->flash();
                            Helpers::redirecionar('admin/professores/listar');
                        } else {
                            if (isset($antigos_especializacao)) {
                                foreach ($antigos_especializacao as $antigo_especializacao) {
                                    $antigo_especializacao_array[$antigo_especializacao['id']] = $antigo_especializacao['area_atuacao_id'];
                                }
                                $array_delete = array_diff($antigo_especializacao_array, []);
                                if (isset($array_delete)) {
                                    $especializacao_delete = (new AreaAtuacaoProfessoresModelo());
                                    foreach ($array_delete as $key => $value) {
                                        if ($especializacao_delete->apagar("id = {$key}")) {
                                        } else {
                                            Conexao::getInstancia()->rollBack();
                                            $this->mensagem->erro($especializacao_delete->erro())->flash();
                                            Helpers::redirecionar('admin/professores/listar');
                                        }
                                    }
                                }
                            }
                        }
                    }

                    //==========================================================================
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Usuário cadastrado com sucesso')->flash();
                    Helpers::redirecionar('admin/professores/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($professor->erro())->flash();
                    Helpers::redirecionar('admin/professores/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/professores/listar');
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

    public function valorizarProfessor()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $valorizar_professor = (new ProfessorModelo())->busca("id = {$dados['id']}")->resultado(false, true);

        $professor_especializacao = (new AreaAtuacaoProfessoresModelo())->busca("professor_id = {$dados['id']}")->resultado(false, true);

        $dados_array = [$valorizar_professor[0]];

        if (isset($professor_especializacao)) {
            $dados_array[] = $professor_especializacao;
        } else {
            $dados_array[] = [];
        }

        return json_encode($dados_array);
    }

    public function checarCpf()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);

        $professor_cpf = (new ProfessorModelo())->busca("cpf = {$dados['cpf']}", "", "id")->resultado();

        if (isset($professor_cpf)) {
            return $professor_cpf->id;
        } else {
            return null;
        }
    }

    public function statusProfessor()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $mudar_status = (new ProfessorModelo())->buscaPorId($dados['id']);

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
