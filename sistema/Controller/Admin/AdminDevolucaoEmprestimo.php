<?php

namespace sistema\Controller\Admin;

use sistema\Modelo\ControleLivroModelo;
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


class AdminDevolucaoEmprestimo extends AdminController
{

    public function listar(): void
    {
        //Só permitir que Administrador entren na tela de listar usuarios
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }
        $cor_racas = new CorRacaModelo();
        $escolaridades = new EscolaridadeModelo();
        $livros = new LivroModelo();
        echo $this->template->renderizar('devolucao_emprestimo/listar.html', [
            'cor_racas' => $cor_racas->busca()->resultado(true),
            'escolaridades' => $escolaridades->busca()->resultado(true),
            'livros' => $livros->busca()->resultado(true),
        ]);
    }

    public function cadastrar(): void
    {
        //Só permitir que Administrador entren na tela de cadastrar emprestimos
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }

        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);

        if (isset($dados)) {
            Conexao::getInstancia()->beginTransaction();
            //checa os dados
            if ($this->validarDados($dados)) {

                $emprestimo = new ControleLivroModelo();

                $emprestimo->usuario_cadastro_id = $this->usuario->id;
                $emprestimo->usuario_modificacao_id = $this->usuario->id;
                $emprestimo->livro_id = isset($dados['emp_dev_id']) && !empty($dados['emp_dev_id']) ? $dados['emp_dev_id'] : NULL;
                $emprestimo->leitor_id = isset($dados['leitor_id']) && !empty($dados['leitor_id']) ? $dados['leitor_id'] : NULL;
                $emprestimo->data_emprestimo = isset($dados['data_emprestimo']) && !empty($dados['data_emprestimo']) ? $dados['data_emprestimo'] : NULL;
                $emprestimo->data_prevista = isset($dados['data_prevista']) && !empty($dados['data_prevista']) ? $dados['data_prevista'] : NULL;
                $emprestimo->observacao_emprestimo = isset($dados['observacao_emprestimo']) && !empty($dados['observacao_emprestimo']) ? $dados['observacao_emprestimo'] : NULL;

                if ($emprestimo->salvar()) {
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Empréstimo realizado com sucesso')->flash();
                    Helpers::redirecionar('admin/devolucao_emprestimo/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($emprestimo->erro())->flash();
                    Helpers::redirecionar('admin/devolucao_emprestimo/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/devolucao_emprestimo/listar');
            }
        }
    }

    public function editar(): void
    {
        //Só permitir que Administrador entren na tela de editar emprestimos
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        // var_dump($dados);die;
        if (isset($dados)) {
            Conexao::getInstancia()->beginTransaction();
            //checa os dados 
            if ($this->validarDados($dados)) {

                $devolucao = (new ControleLivroModelo())->buscaPorId($dados['emp_dev_id']);

                $devolucao->usuario_modificacao_id = $this->usuario->id;
                $devolucao->data_efetiva = isset($dados['data_efetiva_devolucao_livro']) && !empty($dados['data_efetiva_devolucao_livro']) ? $dados['data_efetiva_devolucao_livro'] : NULL;
                $devolucao->observacao_devolucao = isset($dados['observacao_devolucao_livro']) && !empty($dados['observacao_devolucao_livro']) ? $dados['observacao_devolucao_livro'] : NULL;

                if ($devolucao->salvar()) {
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Devolução realizada com sucesso')->flash();
                    Helpers::redirecionar('admin/devolucao_emprestimo/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($devolucao->erro())->flash();
                    Helpers::redirecionar('admin/devolucao_emprestimo/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/devolucao_emprestimo/listar');
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

    public function valorizarLivro()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $valorizar_livro = (new LivroModelo())->busca("id = {$dados['id']}")->resultado(false, true);

        return json_encode($valorizar_livro);
    }

    public function checarCpf()
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $leitor_cpf = (new LeitorModelo())->busca("cpf_leitor = {$dados['cpf']}")->resultado(false, true);
        if (isset($leitor_cpf)) {
            $check_leitor = (new ControleLivroModelo())->busca("leitor_id = {$leitor_cpf[0]['id']} and data_efetiva is null")->resultado();
            if (isset($check_leitor)) {
                $livro = (new LivroModelo())->busca("id = {$check_leitor->livro_id}")->resultado(false, true);
                $controle_livro = (new ControleLivroModelo())->busca("id = {$check_leitor->id}")->resultado(false, true);
                $leitor_cpf[0]['data_emprestimo'] = $controle_livro[0]['data_emprestimo'];
                $leitor_cpf[0]['data_prevista'] = $controle_livro[0]['data_prevista'];
                $leitor_cpf[0]['observacao_emprestimo'] = $controle_livro[0]['observacao_emprestimo'];
                $leitor_cpf[0]['controle_id'] = $controle_livro[0]['id'];
                $leitor_cpf[0]['titulo_livro'] = $livro[0]['titulo_livro'];
                $leitor_cpf[0]['foto_capa_livro'] = $livro[0]['foto_capa_livro'];
                $leitor_cpf[0]['check'] = 'invalido';
            } else {
                $livro = (new LivroModelo())->busca(
                    "",
                    "",
                    "*, (select count(id) as total_emp from controle_livros where livros.id = controle_livros.livro_id and data_efetiva is null) as total_emp, (select idioma_livro from idioma_livro where livros.idioma_livro_id = idioma_livro.id) as idioma_livro"
                )->resultado(false, true);
                $leitor_cpf[0]['emp_dev'] = $livro;
                $leitor_cpf[0]['check'] = 'valido';
            }
            return json_encode($leitor_cpf);
        } else {
            return json_encode(null);;
        }
    }
}
