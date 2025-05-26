<?php

namespace sistema\Controller\Admin;

use sistema\Modelo\AtividadeLogModelo;
use sistema\Modelo\AtividadeModelo;
use sistema\Modelo\BairroModelo;
use sistema\Modelo\CursoModelo;
use Verot\Upload\Upload;
use sistema\Nucleo\Helpers;
use sistema\Nucleo\Conexao;
use sistema\Modelo\UsuarioModelo;
use sistema\Modelo\UnidadeModelo;
use sistema\Modelo\TipoUsuarioModelo;
use sistema\Modelo\EntidadeModelo;
use sistema\Modelo\EspacoModelo;
use sistema\Modelo\EspecializacaoModelo;
use sistema\Modelo\ProfessorModelo;

class AdminCursos extends AdminController
{

    public function listar(): void
    {
        //Só permitir que Administrador entren na tela de listar usuarios
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }
        $atividade = new AtividadeModelo();
        $especializacoes = (new EspecializacaoModelo())->busca()->resultado(true);
        $entidades = (new EntidadeModelo())->busca()->resultado(true);
        $professores = (new ProfessorModelo())->busca()->resultado(true);
        $espacos = (new EspacoModelo())->busca()->resultado(true);
        // $unidades = (new UnidadeModelo())->busca()->resultado(true);

        echo $this->template->renderizar('cursos/listar.html', [
            'atividades' => $atividade->busca()->resultado(true),
            'especializacoes' => $especializacoes,
            'entidades' => $entidades,
            'professores' => $professores,
            'espacos' => $espacos,
            // 'unidades' => $unidades,
            'total' => [
                'atividades' => $atividade->busca()->total(),
                'atividadesAtivas' => $atividade->busca('status = 1')->total(),
                'atividadesInativas' => $atividade->busca('status = 2')->total()
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

                $curso = new CursoModelo();

                $curso->usuario_cadastro_id = $this->usuario->id;
                $curso->usuario_modificacao_id = $this->usuario->id;
                $curso->nome = isset($dados['nome']) && !empty($dados['nome']) ? $dados['nome'] : NULL;
                $curso->especializacao_id = isset($dados['especializacao_id']) && !empty($dados['especializacao_id']) ? $dados['especializacao_id'] : NULL;
                $curso->entidade_id = isset($dados['entidade_id']) && !empty($dados['entidade_id']) ? $dados['entidade_id'] : NULL;
                $curso->data_inicio_curso = isset($dados['data_inicio_curso']) && !empty($dados['data_inicio_curso']) ? $dados['data_inicio_curso'] : NULL;
                $curso->data_fim_curso = isset($dados['data_fim_curso']) && !empty($dados['data_fim_curso']) ? $dados['data_fim_curso'] : NULL;
                $curso->hora_inicio = isset($dados['hora_inicio']) && !empty($dados['hora_inicio']) ? $dados['hora_inicio'] : NULL;
                $curso->hora_fim = isset($dados['hora_fim']) && !empty($dados['hora_fim']) ? $dados['hora_fim'] : NULL;
                $curso->descricao = isset($dados['descricao']) && !empty($dados['descricao']) ? $dados['descricao'] : NULL;
                $curso->vagas = isset($dados['vagas']) && !empty($dados['vagas']) ? $dados['vagas'] : NULL;
                $curso->fim_inscricao = isset($dados['fim_inscricao']) && !empty($dados['fim_inscricao']) ? $dados['fim_inscricao'] : NULL;
                $curso->inicio_inscricao = isset($dados['inicio_inscricao']) && !empty($dados['inicio_inscricao']) ? $dados['inicio_inscricao'] : NULL;
                // $curso->status = 1;

                if ($curso->salvar()) {

                    $atividade = new AtividadeModelo();

                    $atividade->usuario_cadastro_id = $this->usuario->id;
                    $atividade->usuario_modificacao_id = $this->usuario->id;
                    $atividade->espaco_id = isset($dados['espaco_id']) && !empty($dados['espaco_id']) ? $dados['espaco_id'] : NULL;
                    $atividade->professor_id = isset($dados['professor_id']) && !empty($dados['professor_id']) ? $dados['professor_id'] : NULL;
                    $atividade->curso_id = $curso->id;
                    $atividade->status = 1;

                    if ($atividade->salvar()) {

                        $atividade_log = new AtividadeLogModelo();

                        $atividade_log->usuario_cadastro_id = $this->usuario->id;
                        $atividade_log->usuario_modificacao_id = $this->usuario->id;
                        $atividade_log->espaco_id = isset($dados['espaco_id']) && !empty($dados['espaco_id']) ? $dados['espaco_id'] : NULL;
                        $atividade_log->professor_id = isset($dados['professor_id']) && !empty($dados['professor_id']) ? $dados['professor_id'] : NULL;
                        $atividade_log->atividade_id = $atividade->id;
                        $atividade_log->status = 1;

                        if ($atividade_log->salvar()) {
                            Conexao::getInstancia()->commit();
                            $this->mensagem->sucesso('Curso cadastrado com sucesso')->flash();
                            Helpers::redirecionar('admin/cursos/listar');
                        } else {
                            Conexao::getInstancia()->rollBack();
                            $this->mensagem->erro($atividade_log->erro())->flash();
                            Helpers::redirecionar('admin/cursos/listar');
                        }
                    } else {
                        Conexao::getInstancia()->rollBack();
                        $this->mensagem->erro($atividade->erro())->flash();
                        Helpers::redirecionar('admin/cursos/listar');
                    }
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($curso->erro())->flash();
                    Helpers::redirecionar('admin/cursos/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/cursos/listar');
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

                $curso = (new CursoModelo())->buscaPorId($dados['curso_id']);

                $curso->usuario_modificacao_id = $this->usuario->id;
                $curso->nome = isset($dados['nome_editar']) && !empty($dados['nome_editar']) ? $dados['nome_editar'] : NULL;
                $curso->especializacao_id = isset($dados['especializacao_id_editar']) && !empty($dados['especializacao_id_editar']) ? $dados['especializacao_id_editar'] : NULL;
                $curso->entidade_id = isset($dados['entidade_id_editar']) && !empty($dados['entidade_id_editar']) ? $dados['entidade_id_editar'] : NULL;
                $curso->data_inicio_curso = isset($dados['data_inicio_curso_editar']) && !empty($dados['data_inicio_curso_editar']) ? $dados['data_inicio_curso_editar'] : NULL;
                $curso->data_fim_curso = isset($dados['data_fim_curso_editar']) && !empty($dados['data_fim_curso_editar']) ? $dados['data_fim_curso_editar'] : NULL;
                $curso->hora_inicio = isset($dados['hora_inicio_editar']) && !empty($dados['hora_inicio_editar']) ? $dados['hora_inicio_editar'] : NULL;
                $curso->hora_fim = isset($dados['hora_fim_editar']) && !empty($dados['hora_fim_editar']) ? $dados['hora_fim_editar'] : NULL;
                $curso->descricao = isset($dados['descricao_editar']) && !empty($dados['descricao_editar']) ? $dados['descricao_editar'] : NULL;
                $curso->vagas = isset($dados['vagas_editar']) && !empty($dados['vagas_editar']) ? $dados['vagas_editar'] : NULL;
                $curso->fim_inscricao = isset($dados['fim_inscricao_editar']) && !empty($dados['fim_inscricao_editar']) ? $dados['fim_inscricao_editar'] : NULL;
                $curso->inicio_inscricao = isset($dados['inicio_inscricao_editar']) && !empty($dados['inicio_inscricao_editar']) ? $dados['inicio_inscricao_editar'] : NULL;

                if ($curso->salvar()) {
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Curso editado com sucesso')->flash();
                    Helpers::redirecionar('admin/cursos/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($curso->erro())->flash();
                    Helpers::redirecionar('admin/cursos/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/cursos/listar');
            }
        }
    }

    public function editarAtividade(): void
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

                $atividade = (new AtividadeModelo())->buscaPorId($dados['atividade_id']);

                $espaco_antigo = $atividade->espaco_id;
                $professor_antigo = $atividade->professor_id;
                $atividade->usuario_modificacao_id = $this->usuario->id;
                $atividade->espaco_id = isset($dados['espaco_id_editar']) && !empty($dados['espaco_id_editar']) ? $dados['espaco_id_editar'] : NULL;
                $atividade->professor_id = isset($dados['professor_id_editar']) && !empty($dados['professor_id_editar']) ? $dados['professor_id_editar'] : NULL;

                if ($atividade->salvar()) {
                    if ($atividade->espaco_id == $espaco_antigo && $atividade->professor_id == $professor_antigo) {
                        Conexao::getInstancia()->commit();
                        $this->mensagem->sucesso('Troca realizada com sucesso')->flash();
                        Helpers::redirecionar('admin/cursos/listar');
                    } else {

                        $atividade_log = new AtividadeLogModelo();

                        if (($atividade->espaco_id != $espaco_antigo && $atividade->professor_id == $professor_antigo)) {
                            $atividade_log->status = 2;
                        } elseif (($atividade->espaco_id == $espaco_antigo && $atividade->professor_id != $professor_antigo)) {
                            $atividade_log->status = 3;
                        } else {
                            $atividade_log->status = 4;
                        }

                        $atividade_log->usuario_cadastro_id = $this->usuario->id;
                        $atividade_log->usuario_modificacao_id = $this->usuario->id;
                        $atividade_log->atividade_id = $atividade->id;
                        $atividade_log->espaco_id = isset($dados['espaco_id_editar']) && !empty($dados['espaco_id_editar']) ? $dados['espaco_id_editar'] : NULL;
                        $atividade_log->professor_id = isset($dados['professor_id_editar']) && !empty($dados['professor_id_editar']) ? $dados['professor_id_editar'] : NULL;
                        $atividade_log->motivo = isset($dados['motivo']) && !empty($dados['motivo']) ? $dados['motivo'] : NULL;

                        if ($atividade_log->salvar()) {

                            Conexao::getInstancia()->commit();
                            $this->mensagem->sucesso('Troca realizada com sucesso')->flash();
                            Helpers::redirecionar('admin/cursos/listar');
                        } else {
                            Conexao::getInstancia()->rollBack();
                            $this->mensagem->erro($atividade_log->erro())->flash();
                            Helpers::redirecionar('admin/cursos/listar');
                        }
                    }
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($atividade->erro())->flash();
                    Helpers::redirecionar('admin/cursos/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/cursos/listar');
            }
        }
    }

    public function cancelarCurso()
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

                $atividade = (new AtividadeModelo())->buscaPorId($dados['id']);

                $atividade->usuario_modificacao_id = $this->usuario->id;
                $atividade->status = 2;

                if ($atividade->salvar()) {


                    $atividade_log = new AtividadeLogModelo();

                    $atividade_log->usuario_cadastro_id = $this->usuario->id;
                    $atividade_log->usuario_modificacao_id = $this->usuario->id;
                    $atividade_log->atividade_id = $atividade->id;
                    $atividade_log->espaco_id = $atividade->espaco_id;
                    $atividade_log->professor_id = $atividade->professor_id;
                    $atividade_log->status = 5;
                    $atividade_log->motivo = isset($dados['motivo']) && !empty($dados['motivo']) ? $dados['motivo'] : NULL;

                    if ($atividade_log->salvar()) {

                        Conexao::getInstancia()->commit();
                        return true;
                    } else {
                        Conexao::getInstancia()->rollBack();
                        return 'false';
                    }
                } else {
                    Conexao::getInstancia()->rollBack();
                    return 'false';
                }
            } else {
                Conexao::getInstancia()->rollBack();
                return 'false';
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

    public function valorizarCurso()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $valorizar_curso = (new CursoModelo())->busca("cursos.id = {$dados['id']}")->resultado(false, true);
        return json_encode($valorizar_curso);
    }

    public function valorizarAtividade()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $valorizar_atividade = (new AtividadeModelo())->busca("id = {$dados['id']}")->resultado(false, true);
        return json_encode($valorizar_atividade);
    }

    public function buscarEspaco()
    {

        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);

        $cursos_indisponiveis = (new CursoModelo())->busca(
            "(('{$dados['hora_inicio']}' >= hora_inicio and '{$dados['hora_inicio']}' <= hora_fim) or ('{$dados['hora_fim']}' <= hora_fim and '{$dados['hora_fim']}' >= hora_inicio)) and 
        (('{$dados['data_inicio_curso']}' >= data_inicio_curso and '{$dados['data_inicio_curso']}' <= data_fim_curso) or ('{$dados['data_fim_curso']}' <= data_fim_curso and '{$dados['data_fim_curso']}' >= data_inicio_curso))",
            "",
            "id"
        )->resultado(false, true);
        if (empty($cursos_indisponiveis)) {
            $salas_disponiveis = (new EspacoModelo)->busca("status = '1' and capacidade >= '{$dados['vagas']}'")->resultado(false,true);
        } else {
            $salas_ocupadas = (new AtividadeModelo)->busca(
                "curso_id in ({$cursos_indisponiveis[0]['id']}) and status = '1'",
                "",
                "espaco_id"
            )->resultado(false, true);

            $salas_disponiveis = (new EspacoModelo)->busca(
                "id not in ({$salas_ocupadas[0]['espaco_id']}) and status = '1' and capacidade >= '{$dados['vagas']}'"
            )->resultado(false, true);
        }
        return json_encode($salas_disponiveis);
    }

    // public function statusCurso()
    // {
    //     $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
    //     $mudar_status = (new CursoModelo())->buscaPorId($dados['id']);

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
