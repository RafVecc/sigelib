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
        echo $this->template->renderizar('devolucao_emprestimo/listar.html', [
            'cor_racas' => $cor_racas->busca()->resultado(true),
            'escolaridades' => $escolaridades->busca()->resultado(true),
        ]);
    }

    public function emprestimo(): void
    {
        //Só permitir que Administrador entren na tela de listar usuarios
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        $livros = new LivroModelo();
        $leitor = new LeitorModelo();
        $generos_livro = new GeneroLivroModelo();
        $idiomas_livro = new IdiomaLivroModelo();
        $paises_livro = new PaisLivroModelo();
        $tipos_procedencia_livro = new TipoProcedenciaLivro();

        echo $this->template->renderizar('devolucao_emprestimo/emprestimo.html', [
            'livros' => $livros->busca()->resultado(true),
            'leitor' => $leitor->buscaPorId($dados['leitor_id']),
            'generos_livro' => $generos_livro->busca()->resultado(true),
            'idiomas_livro' => $idiomas_livro->busca()->resultado(true),
            'paises_livro' => $paises_livro->busca()->resultado(true),
            'tipos_procedencia_livro' => $tipos_procedencia_livro->busca()->resultado(true),
        ]);
    }

    public function fichaLeitor(): void
    {
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);

        $leitor = (new LeitorModelo())->busca("cpf_leitor = {$dados['cpf_leitor']}")->resultado();
        echo $this->template->renderizar('leitores/fichaLeitor.html', [
            'leitor' => $leitor
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
                $emprestimo->livro_id = isset($dados['livro_id_emprestimo']) && !empty($dados['livro_id_emprestimo']) ? $dados['livro_id_emprestimo'] : NULL;
                $emprestimo->leitor_id = isset($dados['leitor_id_emprestimo']) && !empty($dados['leitor_id_emprestimo']) ? $dados['leitor_id_emprestimo'] : NULL;
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
        //Só permitir que Administrador entren na tela de editar livros
        if ($this->usuario->tipo_usuario_id != 1) {
            $this->mensagem->erro("Sem premissão de acesso")->flash();
            Helpers::redirecionar('admin/');
        }
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        if (isset($dados)) {
            Conexao::getInstancia()->beginTransaction();
            //checa os dados 
            if ($this->validarDados($dados)) {

                $livro = (new LivroModelo())->buscaPorId($dados['livro_id']);

                $livro->usuario_modificacao_id = $this->usuario->id;
                $livro->titulo_livro = isset($dados['titulo_livro_editar']) && !empty($dados['titulo_livro_editar']) ? $dados['titulo_livro_editar'] : NULL;
                $livro->genero_livro_id = isset($dados['genero_livro_editar_id']) && !empty($dados['genero_livro_editar_id']) ? $dados['genero_livro_editar_id'] : NULL;
                $livro->editora_livro = isset($dados['editora_livro_editar']) && !empty($dados['editora_livro_editar']) ? $dados['editora_livro_editar'] : NULL;
                $livro->autor_livro = isset($dados['autor_livro_editar']) && !empty($dados['autor_livro_editar']) ? $dados['autor_livro_editar'] : NULL;
                $livro->ano_livro = isset($dados['ano_livro_editar']) && !empty($dados['ano_livro_editar']) ? $dados['ano_livro_editar'] : NULL;
                $livro->pais_livro_id = isset($dados['pais_livro_editar_id']) && !empty($dados['pais_livro_editar_id']) ? $dados['pais_livro_editar_id'] : NULL;
                $livro->idioma_livro_id = isset($dados['idioma_livro_editar_id']) && !empty($dados['idioma_livro_editar_id']) ? $dados['idioma_livro_editar_id'] : NULL;
                $livro->quantidade_livro = isset($dados['quantidade_livro_editar']) && !empty($dados['quantidade_livro_editar']) ? $dados['quantidade_livro_editar'] : NULL;
                $livro->tipo_procedencia_livro_id = isset($dados['tipo_procedencia_livro_editar_id']) && !empty($dados['tipo_procedencia_livro_editar_id']) ? $dados['tipo_procedencia_livro_editar_id'] : NULL;
                $livro->procedencia_livro = isset($dados['procedencia_livro_editar']) && !empty($dados['procedencia_livro_editar']) ? $dados['procedencia_livro_editar'] : NULL;
                $livro->localizacao_livro = isset($dados['localizacao_livro_editar']) && !empty($dados['localizacao_livro_editar']) ? $dados['localizacao_livro_editar'] : NULL;
                $livro->sinopse_livro = isset($dados['sinopse_livro_editar']) && !empty($dados['sinopse_livro_editar']) ? $dados['sinopse_livro_editar'] : NULL;
                $foto_antiga = $livro->foto_capa_livro;

                if ($_FILES['foto_capa_livro_editar']['error'] == 0) {
                    $upload = new Upload($_FILES['foto_capa_livro_editar'], 'pt_BR');
                    if ($upload->uploaded) {
                        if (in_array($upload->file_src_name_ext, ['png', 'jpg', 'jpeg'])) {

                            $foto_token = Helpers::gerarToken();
                            $titulo = $upload->file_new_name_body = 'fotoLivro_' . $foto_token;
                            $upload->jpeg_quality = 80;
                            $upload->image_convert = 'jpg';
                            $upload->process('uploads/livros/');
                            $livro->foto_capa_livro = $titulo . '.jpg';
                            if (!$upload->processed) {
                                Conexao::getInstancia()->rollBack();
                                $this->mensagem->alerta('Erro de Processamento!')->flash();
                                Helpers::redirecionar('admin/livros/listar');
                            }
                            if (isset($foto_antiga)) {
                                unlink('uploads/livros/' . $foto_antiga);
                            }
                        } else {
                            Conexao::getInstancia()->rollBack();
                            $this->mensagem->alerta('Formato de imagem não permitido!')->flash();
                            Helpers::redirecionar('admin/livros/listar');
                        }
                    } else {
                        Conexao::getInstancia()->rollBack();
                        $this->mensagem->alerta('Erro de Upload!')->flash();
                        Helpers::redirecionar('admin/livros/listar');
                    }
                }

                if ($livro->salvar()) {
                    Conexao::getInstancia()->commit();
                    $this->mensagem->sucesso('Livro editado com sucesso')->flash();
                    Helpers::redirecionar('admin/livros/listar');
                } else {
                    Conexao::getInstancia()->rollBack();
                    $this->mensagem->erro($livro->erro())->flash();
                    Helpers::redirecionar('admin/livros/listar');
                }
            } else {
                Conexao::getInstancia()->rollBack();
                $this->mensagem->erro($this->validarDados($dados))->flash();
                Helpers::redirecionar('admin/livros/listar');
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
            $check_leitor = (new ControleLivroModelo())->busca("leitor_id = {$leitor_cpf[0]['id']} and data_efetiva is null")->resultado(true);
            if (isset($check_leitor)) {
                $leitor_cpf[0]['check'] = 'invalido';
            } else {
                $leitor_cpf[0]['check'] = 'valido';
            }
            return json_encode($leitor_cpf);
        } else {
            return json_encode(null);;
        }
    }
}
