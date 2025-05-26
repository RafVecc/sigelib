<?php

namespace sistema\Modelo;

use sistema\Nucleo\Modelo;
use sistema\Nucleo\Sessao;
use sistema\Nucleo\Helpers;


class EspacoModelo extends Modelo
{

    public function __construct()
    {
        parent::__construct('espaco');
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
     * Busca o tipo de usuário pelo ID
     * @return TipoEspacoModelo|null
     */
    public function tipoEspaco(): ?TipoEspacoModelo
    {
        if ($this->tipo_id) {
            return (new TipoEspacoModelo())->buscaPorId($this->tipo_id);
        }
        return null;
    }

    public function buscarEspaco(): ?EspacoModelo
    {
        if ($this->unidade_id) {
            return (new UnidadeModelo())->buscaPorId($this->unidade_id);
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

    public function salvar(): bool
    {
        return parent::salvar();
    }
}
