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
use sistema\Modelo\EspacoModelo;
use sistema\Modelo\TipoEspacoModelo;

class AdminEspacos extends AdminController
{

    public function listar(): void
    {
        //Só permitir que Administrador entren na tela de listar usuarios
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }
        $espaco = new EspacoModelo();
        $tipo_espacos = (new TipoEspacoModelo())->busca()->resultado(true);

        echo $this->template->renderizar('espacos/listar.html', [
            'espacos' => $espaco->busca()->resultado(true),
            'tipo_espacos' => $tipo_espacos,
            // 'unidades' => $unidades,
            'total' => [
                'espacos' => $espaco->busca()->total(),
                'espacosAtivos' => $espaco->busca('status = 1')->total(),
                'espacosInativos' => $espaco->busca('status = 2')->total()
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

                $espaco = new EspacoModelo();

                $espaco->usuario_cadastro_id = $this->usuario->id;
                $espaco->usuario_modificacao_id = $this->usuario->id;
                $espaco->numero_sala = isset($dados['numero_sala']) && !empty($dados['numero_sala']) ? $dados['numero_sala'] : NULL;
                $espaco->andar = isset($dados['andar']) && !empty($dados['andar']) ? $dados['andar'] : NULL;
                $espaco->capacidade = isset($dados['capacidade']) && !empty($dados['capacidade']) ? $dados['capacidade'] : NULL;
                $espaco->complemento = isset($dados['complemento']) && !empty($dados['complemento']) ? $dados['complemento'] : NULL;
                $espaco->tipo_id = isset($dados['tipo_id']) && !empty($dados['tipo_id']) ? $dados['tipo_id'] : NULL;
                $espaco->status = 1;

                if ($espaco->salvar()) {
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Espaço cadastrado com sucesso')->flash();
                    Helpers::redirecionar('admin/espacos/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($espaco->erro())->flash();
                    Helpers::redirecionar('admin/espacos/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/espacos/listar');
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

                $espaco = (new EspacoModelo())->buscaPorId($dados['espaco_id']);

                $espaco->usuario_modificacao_id = $this->usuario->id;
                $espaco->numero_sala = isset($dados['numero_sala_editar']) && !empty($dados['numero_sala_editar']) ? $dados['numero_sala_editar'] : NULL;
                $espaco->andar = isset($dados['andar_editar']) && !empty($dados['andar_editar']) ? $dados['andar_editar'] : NULL;
                $espaco->capacidade = isset($dados['capacidade_editar']) && !empty($dados['capacidade_editar']) ? $dados['capacidade_editar'] : NULL;
                $espaco->complemento = isset($dados['complemento_editar']) && !empty($dados['complemento_editar']) ? $dados['complemento_editar'] : NULL;
                $espaco->tipo_id = isset($dados['tipo_id_editar']) && !empty($dados['tipo_id_editar']) ? $dados['tipo_id_editar'] : NULL;

                if ($espaco->salvar()) {
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Espaço Editado com sucesso')->flash();
                    Helpers::redirecionar('admin/espacos/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($espaco->erro())->flash();
                    Helpers::redirecionar('admin/espacos/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/espacos/listar');
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

    public function valorizarEspaco()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $valorizar_espaco = (new EspacoModelo())->busca("id = {$dados['id']}")->resultado(false, true);

        return json_encode($valorizar_espaco);
    }

    public function statusEspaco()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $mudar_status = (new EspacoModelo())->buscaPorId($dados['id']);

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
