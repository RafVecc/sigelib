<?php

namespace sistema\Controller\Admin;

use sistema\Modelo\CorRacaModelo;
use sistema\Modelo\EscolaridadeModelo;
use sistema\Modelo\GeneroLivroModelo;
use sistema\Modelo\IdiomaLivroModelo;
use sistema\Modelo\LeitorModelo;
use sistema\Modelo\LivroModelo;
use sistema\Modelo\PaisLivroModelo;
use sistema\Modelo\TipoProcedenciaLivro;
use Verot\Upload\Upload;
use sistema\Nucleo\Helpers;
use sistema\Nucleo\Conexao;
use sistema\Modelo\UsuarioModelo;
use sistema\Modelo\TipoUsuarioModelo;


class AdminLeitores extends AdminController
{

    public function listar(): void
    {
        //Só permitir que Administrador entren na tela de listar usuarios
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }
        $leitores = new LeitorModelo();
        $cor_racas = new CorRacaModelo();
        $escolaridades = new EscolaridadeModelo();
        echo $this->template->renderizar('leitores/listar.html', [
            'cor_racas' => $cor_racas->busca()->resultado(true),
            'escolaridades' => $escolaridades->busca()->resultado(true),
            'leitores' => $leitores->busca()->resultado(true),
        ]);
    }

    public function fichaLeitor(): void
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);

        $leitor = (new LeitorModelo())->buscaPorId($dados['leitor_id']);
        
        echo $this->template->renderizar('leitores/fichaLeitor.html', [
            'leitor' => $leitor
        ]);
    }

    public function cadastrar(): void
    {
        //Só permitir que Administrador entren na tela de cadastrar leitores
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

                $leitor = new LeitorModelo();

                $leitor->usuario_cadastro_id = $this->usuario->id;
                $leitor->usuario_modificacao_id = $this->usuario->id;
                $leitor->cpf_leitor = isset($dados['cpf_leitor']) && !empty($dados['cpf_leitor']) ? Helpers::limparNumero($dados['cpf_leitor']) : NULL;
                $leitor->nome_leitor = isset($dados['nome_leitor']) && !empty($dados['nome_leitor']) ? $dados['nome_leitor'] : NULL;
                $leitor->data_nascimento_leitor = isset($dados['data_nascimento_leitor']) && !empty($dados['data_nascimento_leitor']) ? $dados['data_nascimento_leitor'] : NULL;
                $leitor->telefone_leitor = isset($dados['telefone_leitor']) && !empty($dados['telefone_leitor']) ? Helpers::limparNumero($dados['telefone_leitor']) : NULL;
                $leitor->sexo_leitor_id = isset($dados['sexo_leitor_id']) && !empty($dados['sexo_leitor_id']) ? $dados['sexo_leitor_id'] : NULL;
                $leitor->cor_leitor_id = isset($dados['cor_leitor_id']) && !empty($dados['cor_leitor_id']) ? $dados['cor_leitor_id'] : NULL;
                $leitor->escolaridade_leitor_id = isset($dados['escolaridade_leitor_id']) && !empty($dados['escolaridade_leitor_id']) ? $dados['escolaridade_leitor_id'] : NULL;
                $leitor->cep_leitor = isset($dados['cep_leitor']) && !empty($dados['cep_leitor']) ? $dados['cep_leitor'] : NULL;
                $leitor->rua_leitor = isset($dados['rua_leitor']) && !empty($dados['rua_leitor']) ? $dados['rua_leitor'] : NULL;
                $leitor->numero_leitor = isset($dados['numero_leitor']) && !empty($dados['numero_leitor']) ? $dados['numero_leitor'] : NULL;
                $leitor->bairro_leitor = isset($dados['bairro_leitor']) && !empty($dados['bairro_leitor']) ? $dados['bairro_leitor'] : NULL;
                $leitor->ponto_de_referencia_leitor = isset($dados['ponto_de_referencia_leitor']) && !empty($dados['ponto_de_referencia_leitor']) ? $dados['ponto_de_referencia_leitor'] : NULL;
                $leitor->email_leitor = isset($dados['email_leitor']) && !empty($dados['email_leitor']) ? $dados['email_leitor'] : NULL;
                $leitor->rede_social_leitor = isset($dados['rede_social_leitor']) && !empty($dados['rede_social_leitor']) ? $dados['rede_social_leitor'] : NULL;

                if ($_FILES['foto_leitor']['error'] == 0) {
                    $upload = new Upload($_FILES['foto_leitor'], 'pt_BR');
                    if ($upload->uploaded) {
                        if (in_array($upload->file_src_name_ext, ['png', 'jpg', 'jpeg'])) {

                            $foto_token = Helpers::gerarToken();
                            $titulo = $upload->file_new_name_body = 'fotoLeitor_' . $foto_token;
                            // $upload->jpeg_quality = 80;
                            // $upload->jpeg_size = 2000000;
                            $upload->image_convert = 'jpg';
                            $upload->image_resize         = true;
                            $upload->image_x              = 500;
                            $upload->image_ratio_y        = true;
                            $upload->process('uploads/leitores/');
                            $leitor->foto_leitor = $titulo . '.jpg';
                            if (!$upload->processed) {
                                Conexao::getInstancia()->rollBack();
                                $this->mensagem->alerta('Erro de Processamento!')->flash();
                                Helpers::redirecionar('admin/leitores/listar');
                            }
                        } else {
                            Conexao::getInstancia()->rollBack();
                            $this->mensagem->alerta('Formato de imagem não permitido!')->flash();
                            Helpers::redirecionar('admin/leitores/listar');
                        }
                    } else {
                        Conexao::getInstancia()->rollBack();
                        $this->mensagem->alerta('Erro de Upload!')->flash();
                        Helpers::redirecionar('admin/leitores/listar');
                    }
                }

                if ($leitor->salvar()) {
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Leitor cadastrado com sucesso')->flash();
                    Helpers::redirecionar('admin/leitores/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($leitor->erro())->flash();
                    Helpers::redirecionar('admin/leitores/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/leitores/listar');
            }
        }
    }

    public function editar(): void
    {
        //Só permitir que Administrador entren na tela de editar leitores
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        if (isset($dados)) {
            Conexao::getInstancia()->beginTransaction();
            //checa os dados 
            if ($this->validarDados($dados)) {

                $leitor = (new LeitorModelo())->buscaPorId($dados['leitor_id']);

                $leitor->usuario_modificacao_id = $this->usuario->id;
                $leitor->cpf_leitor = isset($dados['cpf_leitor_editar']) && !empty($dados['cpf_leitor_editar']) ? $dados['cpf_leitor_editar'] : NULL;
                $leitor->nome_leitor = isset($dados['nome_leitor_editar']) && !empty($dados['nome_leitor_editar']) ? $dados['nome_leitor_editar'] : NULL;
                $leitor->data_nascimento_leitor = isset($dados['data_nascimento_leitor_editar']) && !empty($dados['data_nascimento_leitor_editar']) ? $dados['data_nascimento_leitor_editar'] : NULL;
                $leitor->telefone_leitor = isset($dados['telefone_leitor_editar']) && !empty($dados['telefone_leitor_editar']) ? $dados['telefone_leitor_editar'] : NULL;
                $leitor->sexo_leitor_id = isset($dados['sexo_leitor_editar_id']) && !empty($dados['sexo_leitor_editar_id']) ? $dados['sexo_leitor_editar_id'] : NULL;
                $leitor->cor_leitor_id = isset($dados['cor_leitor_editar_id']) && !empty($dados['cor_leitor_editar_id']) ? $dados['cor_leitor_editar_id'] : NULL;
                $leitor->escolaridade_leitor_id = isset($dados['escolaridade_leitor_editar_id']) && !empty($dados['escolaridade_leitor_editar_id']) ? $dados['escolaridade_leitor_editar_id'] : NULL;
                $leitor->cep_leitor = isset($dados['cep_leitor_editar']) && !empty($dados['cep_leitor_editar']) ? $dados['cep_leitor_editar'] : NULL;
                $leitor->rua_leitor = isset($dados['rua_leitor_editar']) && !empty($dados['rua_leitor_editar']) ? $dados['rua_leitor_editar'] : NULL;
                $leitor->numero_leitor = isset($dados['numero_leitor_editar']) && !empty($dados['numero_leitor_editar']) ? $dados['numero_leitor_editar'] : NULL;
                $leitor->bairro_leitor = isset($dados['bairro_leitor_editar']) && !empty($dados['bairro_leitor_editar']) ? $dados['bairro_leitor_editar'] : NULL;
                $leitor->ponto_de_referencia_leitor = isset($dados['ponto_de_referencia_leitor_editar']) && !empty($dados['ponto_de_referencia_leitor_editar']) ? $dados['ponto_de_referencia_leitor_editar'] : NULL;
                $leitor->email_leitor = isset($dados['email_leitor_editar']) && !empty($dados['email_leitor_editar']) ? $dados['email_leitor_editar'] : NULL;
                $leitor->rede_social_leitor = isset($dados['rede_social_leitor_editar']) && !empty($dados['rede_social_leitor_editar']) ? $dados['rede_social_leitor_editar'] : NULL;
                $foto_antiga = $leitor->foto_leitor;

                if ($_FILES['foto_leitor_editar']['error'] == 0) {
                    $upload = new Upload($_FILES['foto_leitor_editar'], 'pt_BR');
                    if ($upload->uploaded) {
                        if (in_array($upload->file_src_name_ext, ['png', 'jpg', 'jpeg'])) {

                            $foto_token = Helpers::gerarToken();
                            $titulo = $upload->file_new_name_body = 'fotoLeitor_' . $foto_token;
                            // $upload->jpeg_quality = 80;
                            // $upload->jpeg_size = 2000000;
                            $upload->image_convert = 'jpg';
                            $upload->image_resize         = true;
                            $upload->image_x              = 500;
                            $upload->image_ratio_y        = true;
                            $upload->process('uploads/leitores/');
                            $leitor->foto_leitor = $titulo . '.jpg';
                            if (!$upload->processed) {
                                Conexao::getInstancia()->rollBack();
                                $this->mensagem->alerta('Erro de Processamento!')->flash();
                                Helpers::redirecionar('admin/leitores/listar');
                            }
                            if (isset($foto_antiga)) {
                                unlink('uploads/leitores/' . $foto_antiga);
                            }
                        } else {
                            Conexao::getInstancia()->rollBack();
                            $this->mensagem->alerta('Formato de imagem não permitido!')->flash();
                            Helpers::redirecionar('admin/leitores/listar');
                        }
                    } else {
                        Conexao::getInstancia()->rollBack();
                        $this->mensagem->alerta('Erro de Upload!')->flash();
                        Helpers::redirecionar('admin/leitores/listar');
                    }
                }

                if ($leitor->salvar()) {
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Leitor editado com sucesso')->flash();
                    Helpers::redirecionar('admin/leitores/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($leitor->erro())->flash();
                    Helpers::redirecionar('admin/leitores/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/leitores/listar');
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

    public function valorizarLeitor()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $valorizar_leitor = (new LeitorModelo())->busca("id = {$dados['id']}")->resultado(false, true);

        return json_encode($valorizar_leitor);
    }

    public function checarCpf()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $leitor_cpf = (new LeitorModelo())->busca("cpf_leitor = {$dados['cpf']}", "", "id")->resultado();

        if (isset($leitor_cpf)) {
            return $leitor_cpf->id;
        } else {
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
