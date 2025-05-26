<?php

namespace sistema\Modelo;

use sistema\Nucleo\Modelo;


class UnidadeModelo extends Modelo
{

    public function __construct()
    {
        parent::__construct('unidades');
    }

    /**
     * Busca o usuário pelo ID
     * @return UsuarioModelo|null
     */
    public function usuario(): ?UsuarioModelo
    {
        if ($this->usuario_id) {
            return (new UsuarioModelo())->buscaPorId($this->usuario_id);
        }
        return null;
    }
    
    /**
     * Salva o post com slug
     * @return bool
     */
    public function salvar(): bool
    {
        return parent::salvar();
    }


    

}
