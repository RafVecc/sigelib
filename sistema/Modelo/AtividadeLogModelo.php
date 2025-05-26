<?php

namespace sistema\Modelo;

use sistema\Nucleo\Modelo;
use sistema\Nucleo\Sessao;
use sistema\Nucleo\Helpers;


class AtividadeLogModelo extends Modelo
{

    public function __construct()
    {
        parent::__construct('atividades_log');
    }

    /**
     * Busca usuário por e-mail
     * @param string $email
     * @return UsuarioModelo|null
     */
    public function buscaPorEmail(string $email): ?UsuarioModelo
    {
        $busca = $this->busca("email = :e", "e={$email}");
        return $busca->resultado();
    }
    public function buscaLogin(string $login): ?UsuarioModelo
    {
        $busca = $this->busca("login = :e", "e={$login}");
        return $busca->resultado();
    }

    /**
     * Busca a Unidade pelo ID
     * @return UnidadeModelo|null
     */
    public function unidade(): ?UnidadeModelo
    {
        if ($this->unidade_id) {
            return (new UnidadeModelo())->buscaPorId($this->unidade_id);
        }
        return null;
    }

    public function atividadeCurso(): ?CursoModelo
    {
        if ($this->curso_id) {
            return (new CursoModelo())->buscaPorId($this->curso_id);
        }
        return null;
    }

    /**
     * Busca o tipo de usuário pelo ID
     * @return TipoUsuarioModelo|null
     */
    public function tipoUsuario(): ?TipoUsuarioModelo
    {
        if ($this->tipo_usuario_id) {
            return (new TipoUsuarioModelo())->buscaPorId($this->tipo_usuario_id);
        }
        return null;
    }

    /**
     * Busca usuário por token
     * @param string $token
     * @return UsuarioModelo|null
     */
    public function buscaPorToken(string $token): ?UsuarioModelo
    {
        $busca = $this->busca("token = :t", "t={$token}");
        return $busca->resultado();
    }

    /**
     * Valida o login do usuário
     * @param array $dados
     * @param int $level
     * @return boolean
     */
    public function login(array $dados, int $level = 1): bool
    {
        $usuario = (new UsuarioModelo())->buscaLogin(trim($dados['login']));
        if (!$usuario) {
            $this->mensagem->erro("Os dados informados para o login estão incorretos!")->flash();
            return false;
        }

        if (!Helpers::verificarSenha(trim($dados['senha']), $usuario->senha)) {
            $this->mensagem->erro("Os dados informados para a senha estão incorretas!")->flash();
            return false;
        }

        if ($usuario->status == 1) {
            if (empty($usuario->data_inicio) && empty($usuario->data_fim)) {
            } else {
                $data_hoje = (new \DateTime())->format('Y-m-d H:i:s');
                if (!empty($usuario->data_inicio) && empty($usuario->data_fim)) {
                    if ($data_hoje >= $usuario->data_inicio) {
                    } else {
                        $this->mensagem->alerta("Seu período de acesso ainda não teve início!")->flash();
                        return false;
                    }
                } elseif (!empty($usuario->data_inicio) && !empty($usuario->data_fim)) {
                    if ($data_hoje >= $usuario->data_inicio) {
                        if ($data_hoje < $usuario->data_fim) {
                        } else {
                            $this->mensagem->alerta("Seu período de acesso expirou!")->flash();
                            return false;
                        }
                    } else {
                        $this->mensagem->alerta("Seu período de acesso ainda não teve início!")->flash();
                        return false;
                    }
                }
            }
        } else {
            $this->mensagem->alerta("Para fazer login, primeiro ative sua conta!")->flash();
            return false;
        }

        if ($usuario->flag_primeiro_acesso  == 0) {
            (new Sessao())->criar('usuarioLogin', $usuario->login);
            Helpers::redirecionar('redefinirSenha');
        }


        //salva a data e hora do login
        $usuario->ultimo_login = date('Y-m-d H:i:s');
        $usuario->salvar();

        //cria uma sessão com o id
        (new Sessao())->criar('usuarioId', $usuario->id);

        //$this->mensagem->sucesso("{$usuario->nome}, seja bem vindo ao Painel de Gestão")->flash();
        return true;
    }

    /**
     * Valida o login do usuário
     * @param array $dados
     * @param int $level
     * @return boolean
     */
    public function alterarSenha(array $dados): bool
    {
        $sessao = new Sessao();
        $usuario = (new UsuarioModelo())->buscaLogin(trim($sessao->usuarioLogin));

        $usuario->flag_primeiro_acesso = 1;
        $usuario->senha = Helpers::gerarSenha($dados['nova_senha']);
        $usuario->salvar();

        $sessao->limpar('usuarioLogin');

        return true;
    }

    public function salvar(): bool
    {
        return parent::salvar();
    }
}
