<?php

namespace sistema\Controller\Admin;

use sistema\Modelo\AreaAtuacaoModelo;
use sistema\Modelo\BairroModelo;
use Verot\Upload\Upload;
use sistema\Nucleo\Helpers;
use sistema\Nucleo\Conexao;
use sistema\Modelo\UsuarioModelo;
use sistema\Modelo\UnidadeModelo;
use sistema\Modelo\TipoUsuarioModelo;
use sistema\Modelo\EntidadeModelo;
use sistema\Modelo\EspecializacaoModelo;

class AdminAreaAtuacao extends AdminController
{

    public function listar(): void
    {
        //Só permitir que Administrador entren na tela de listar usuarios
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }
        $areaAtuacao = new AreaAtuacaoModelo();
        // $unidades = (new UnidadeModelo())->busca()->resultado(true);

        echo $this->template->renderizar('areaAtuacao/listar.html', [
            'areaAtuacoes' => $areaAtuacao->busca()->resultado(true),
            'total' => [
                'areaAtuacao' => $areaAtuacao->busca()->total(),
                'areaAtuacaoAtivas' => $areaAtuacao->busca('status = 1')->total(),
                'areaAtuacaoInativas' => $areaAtuacao->busca('status = 2')->total()
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

            if ($this->validarDados($dados)) {

                $area_atuacao = new AreaAtuacaoModelo();

                $area_atuacao->usuario_cadastro_id = $this->usuario->id;
                $area_atuacao->usuario_modificacao_id = $this->usuario->id;
                $area_atuacao->area_atuacao = isset($dados['area_atuacao']) && !empty($dados['area_atuacao']) ? $dados['area_atuacao'] : NULL;
                $area_atuacao->status = 1;
                if ($area_atuacao->salvar()) {
                    foreach ($dados['especializacao'] as $key => $value) {

                        if (!empty($value)) {
                            $especializacao = new EspecializacaoModelo();

                            $especializacao->usuario_cadastro_id = $this->usuario->id;
                            $especializacao->usuario_modificacao_id = $this->usuario->id;
                            $especializacao->area_atuacao_id = $area_atuacao->id;
                            $especializacao->especializacao = $value;
                            $especializacao->status = 1;

                            if ($especializacao->salvar()) {
                            } else {
                                Conexao::getInstancia()->rollBack();
                                $this->mensagem->erro($especializacao->erro())->flash();
                                Helpers::redirecionar('admin/areaAtuacao/listar');
                            }
                        }
                    }
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Área de Atuação cadastrada com sucesso')->flash();
                    Helpers::redirecionar('admin/areaAtuacao/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($area_atuacao->erro())->flash();
                    Helpers::redirecionar('admin/areaAtuacao/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/areaAtuacao/listar');
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

            if ($this->validarDados($dados)) {

                $area_atuacao = (new AreaAtuacaoModelo())->buscaPorId($dados['area_atuacao_id']);

                $area_atuacao->usuario_modificacao_id = $this->usuario->id;
                $area_atuacao->area_atuacao = isset($dados['area_atuacao_editar']) && !empty($dados['area_atuacao_editar']) ? $dados['area_atuacao_editar'] : NULL;
                if ($area_atuacao->salvar()) {
                    foreach ($dados['especializacao_id'] as $key => $value) {

                        if (!empty($value)) {
                            $especializacao = (new EspecializacaoModelo())->buscaPorId($value);

                            $especializacao->usuario_modificacao_id = $this->usuario->id;
                            $especializacao->especializacao = isset($dados['especializacao_editar'][$key]) && !empty($dados['especializacao_editar'][$key]) ? $dados['especializacao_editar'][$key] : NULL;

                            if ($especializacao->salvar()) {
                            } else {
                                Conexao::getInstancia()->rollBack();
                                $this->mensagem->erro($especializacao->erro())->flash();
                                Helpers::redirecionar('admin/areaAtuacao/listar');
                            }
                        }elseif(empty($value) && !empty($dados['especializacao_editar'][$key])){

                            $especializacao = new EspecializacaoModelo();

                            $especializacao->usuario_cadastro_id = $this->usuario->id;
                            $especializacao->usuario_modificacao_id = $this->usuario->id;
                            $especializacao->area_atuacao_id = $dados['area_atuacao_id'];
                            $especializacao->especializacao = isset($dados['especializacao_editar'][$key]) && !empty($dados['especializacao_editar'][$key]) ? $dados['especializacao_editar'][$key] : NULL;
                            $especializacao->status = 1;

                            if ($especializacao->salvar()) {
                            } else {
                                Conexao::getInstancia()->rollBack();
                                $this->mensagem->erro($especializacao->erro())->flash();
                                Helpers::redirecionar('admin/areaAtuacao/listar');
                            }

                        }
                    }

                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Área de Atuação cadastrada com sucesso')->flash();
                    Helpers::redirecionar('admin/areaAtuacao/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($area_atuacao->erro())->flash();
                    Helpers::redirecionar('admin/areaAtuacao/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/areaAtuacao/listar');
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
        return true;
    }

    public function valorizarAreaAtuacao()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $valorizar_area_atuacao = (new AreaAtuacaoModelo())->busca("id = {$dados['id']}")->resultado(false, true);
        $valorizar_especializacao = (new EspecializacaoModelo())->busca("area_atuacao_id = {$dados['id']}")->resultado(false, true);

        return json_encode(['area_atuacao' => $valorizar_area_atuacao, 'especializacao' => $valorizar_especializacao]);
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
