<?php

namespace sistema\Controller\Admin;

use sistema\Nucleo\Helpers;
use sistema\Nucleo\Conexao;
use sistema\Modelo\UsuarioModelo;
use sistema\Modelo\UnidadeModelo;
use sistema\Modelo\TipoUsuarioModelo;



class AdminUsuarios extends AdminController
{

    public function listar(): void
    {
        //Só permitir que Administrador entren na tela de listar usuarios
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }
        $usuario = new UsuarioModelo();
        $tipo_usuarios = (new TipoUsuarioModelo())->busca()->resultado(true);
        $unidades = (new UnidadeModelo())->busca()->resultado(true);

        echo $this->template->renderizar('usuarios/listar.html', [
            'usuarios' => $usuario->busca()->resultado(true),
            'tipo_usuarios' => $tipo_usuarios,
            'unidades' => $unidades,
            'total' => [
                'usuarios' => $usuario->busca('tipo_usuario_id != 1')->total(),
                'usuariosAtivo' => $usuario->busca('status = 1 AND tipo_usuario_id != 1')->total(),
                'usuariosInativo' => $usuario->busca('status = 2 AND tipo_usuario_id != 1')->total(),
                'admin' => $usuario->busca('tipo_usuario_id = 1')->total(),
                'adminAtivo' => $usuario->busca('status = 1 AND tipo_usuario_id = 1')->total(),
                'adminInativo' => $usuario->busca('status = 2 AND tipo_usuario_id = 1')->total()
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
            if ($this->validarDados($dados)['check']) {

                $usuario = new UsuarioModelo();

                $usuario->usuario_cadastro_id = $this->usuario->id;
                $usuario->usuario_modificacao_id = $this->usuario->id;
                $usuario->nome = isset($dados['nome']) && !empty($dados['nome']) ? $dados['nome'] : NULL;
                $usuario->telefone = isset($dados['telefone']) && !empty($dados['telefone']) ? $dados['telefone'] : NULL;
                $usuario->email = isset($dados['email']) && !empty($dados['email']) ? $dados['email'] : NULL;
                $usuario->login = isset($dados['login']) && !empty($dados['login']) ? $dados['login'] : NULL;
                $usuario->senha = Helpers::gerarSenha('123456');
                $usuario->status = '1';
                $usuario->tipo_usuario_id = isset($dados['tipo_usuario_id']) && !empty($dados['tipo_usuario_id']) ? $dados['tipo_usuario_id'] : NULL;
                $usuario->unidade_id = isset($dados['unidade_id']) && !empty($dados['unidade_id']) ? $dados['unidade_id'] : NULL;
                $usuario->data_inicio = isset($dados['data_inicio']) && !empty($dados['data_inicio']) ? $dados['data_inicio'] : (new \DateTime())->format('Y-m-d');
                $usuario->data_fim = isset($dados['data_fim']) && !empty($dados['data_fim']) ? $dados['data_fim'] : NULL;

                if ($usuario->salvar()) {
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Usuário cadastrado com sucesso')->flash();
                    Helpers::redirecionar('admin/usuarios/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($usuario->erro())->flash();
                    Helpers::redirecionar('admin/usuarios/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados)['mensagem'])->flash();
                Helpers::redirecionar('admin/usuarios/listar');
            }
        }
    }

    public function editar(): void
    {
        //Só permitir que Administrador entren na tela de editar usuarios
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }

        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        if (isset($dados)) {
            Conexao::getInstancia()->beginTransaction();
            $usuario = (new UsuarioModelo())->buscaPorId($dados['id']);
            if ($this->validarDados($dados, $usuario)['check']) {

                $usuario->usuario_modificacao_id = $this->usuario->id;
                $usuario->nome = isset($dados['nome']) && !empty($dados['nome']) ? $dados['nome'] : NULL;
                $usuario->telefone = isset($dados['telefone']) && !empty($dados['telefone']) ? $dados['telefone'] : NULL;
                $usuario->email = isset($dados['email']) && !empty($dados['email']) ? $dados['email'] : NULL;
                $usuario->login = isset($dados['login']) && !empty($dados['login']) ? $dados['login'] : NULL;
                $usuario->tipo_usuario_id = isset($dados['tipo_usuario_id']) && !empty($dados['tipo_usuario_id']) ? $dados['tipo_usuario_id'] : NULL;
                $usuario->unidade_id = isset($dados['unidade_id']) && !empty($dados['unidade_id']) ? $dados['unidade_id'] : NULL;
                $usuario->data_inicio = isset($dados['data_inicio']) && !empty($dados['data_inicio']) ? $dados['data_inicio'] : NULL;
                $usuario->data_fim = isset($dados['data_fim']) && !empty($dados['data_fim']) ? $dados['data_fim'] : NULL;

                if ($usuario->salvar()) {
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Usuário atualizado com sucesso')->flash();
                    Helpers::redirecionar('admin/usuarios/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($usuario->erro())->flash();
                    Helpers::redirecionar('admin/usuarios/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados, $usuario)['mensagem'])->flash();
                Helpers::redirecionar('admin/usuarios/listar');
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
        if (empty($dados['nome'])) {
            return ['check' => false, 'mensagem' => 'Informe o nome do usuário!'];
        }

        if (empty($dados['telefone'])) {
            return ['check' => false, 'mensagem' => 'Informe o telefone do usuário!'];
        }

        if (!empty($dados['email'])) {
            if (!Helpers::validarEmail($dados['email'])) {
                return ['check' => false, 'mensagem' => 'Informe um e-mail válido!'];
            }
        }

        if (
            empty($usuario) ||
            ((isset($usuario->data_inicio) && !empty($usuario->data_inicio) ? (new \DateTime($usuario->data_inicio))->format('Y-m-d') : NULL) != $dados['data_inicio'] ||
                (isset($usuario->data_fim) && !empty($usuario->data_fim) ? (new \DateTime($usuario->data_fim))->format('Y-m-d') : NULL) != $dados['data_fim'])
        ) {
            if (empty($dados['data_fim']) && empty($dados['data_inicio'])) {
            } else {
                $data_hoje = (new \DateTime())->format('Y-m-d');
                if (!empty($dados['data_fim']) && !empty($dados['data_inicio'])) {
                    if ($dados['data_inicio'] >= $dados['data_fim']) {
                        return ['check' => false, 'mensagem' => 'A data de início não pode ser maior ou igual a data final de permissão de acesso!'];
                    } else {
                        if ($dados['data_inicio'] < $data_hoje && empty($usuario)) {
                            return ['check' => false, 'mensagem' => 'A data de início não pode ser menor que a data de hoje!'];
                        } else {
                            if ($dados['data_fim'] < $data_hoje) {
                                return ['check' => false, 'mensagem' => 'A data final não pode ser menor que a data de hoje!'];
                            }
                        }
                    }
                } elseif (empty($dados['data_fim']) && !empty($dados['data_inicio'])) {
                    if ($dados['data_inicio'] < $data_hoje && empty($usuario)) {
                        return ['check' => false, 'mensagem' => 'A data de início não pode ser menor que a data de hoje!'];
                    }
                }
            }
        }

        return ['check' => true, 'mensagem' => ''];
    }

    public function valorizarUsuarios()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $valorizar_usuario = (new UsuarioModelo())->busca("id = {$dados['id']}")->resultado(false, true);

        return json_encode($valorizar_usuario);
    }

    public function statusUsuario()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $mudar_status = (new UsuarioModelo())->buscaPorId($dados['id']);

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

    public function resetarSenha()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $resetar_senha = (new UsuarioModelo())->buscaPorId($dados['id']);

        if (isset($resetar_senha)) {
            Conexao::getInstancia()->beginTransaction();
            $resetar_senha->usuario_modificacao_id = $this->usuario->id;
            $resetar_senha->senha = Helpers::gerarSenha('123456');
            $resetar_senha->flag_primeiro_acesso = 0;
            
            if ($resetar_senha->salvar()) {
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
