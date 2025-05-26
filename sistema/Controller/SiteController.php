<?php

namespace sistema\Controller;

use sistema\Nucleo\Controller;
use sistema\Modelo\UnidadeModelo;
use sistema\Nucleo\Helpers;
use sistema\Modelo\CategoriaModelo;
use sistema\Modelo\UsuarioModelo;
use sistema\Biblioteca\Paginar;
use sistema\Suporte\Email;

class SiteController extends Controller
{

    public function __construct()
    {
        parent::__construct('templates/site/views');
    }

    /**
     * Checa se o admin existe e redireciona
     * @return void
     */
    public function index(): void
    {

        $usuario = UsuarioController::usuario();
        if ($usuario && $usuario->level == 3) {
            Helpers::redirecionar('admin/');
        } else {
            Helpers::redirecionar('login');
        }
    }


    /**
     * Busca unidades 
     * @return void
     */
    // public function buscar(): void
    // {
    //     $busca = filter_input(INPUT_POST, 'busca', FILTER_DEFAULT);
    //     if (isset($busca)) {
    //         $unidades = (new UnidadeModelo())->busca("status = 1 AND titulo LIKE '%{$busca}%'")->limite(20)->resultado(true);
    //         if ($unidades) {
    //             foreach ($unidades as $unidade) {
    //                 echo "<li class='list-group-item fw-bold'><a href=" . Helpers::url('unidade/') . $unidade->categoria()->slug . '/' . $unidade->slug . ">$unidade->titulo</a></li>";
    //             }
    //         }
    //     }
    // }

    /**
     * Busca unidade por ID
     * @param string $categoria apenas para o slug da categoria
     * @param string $slug
     * @return void
     */
    // public function unidade(string $categoria, string $slug): void
    // {
    //     $unidade = (new UnidadeModelo())->buscaPorSlug($slug);
    //     if (!$unidade) {
    //         Helpers::redirecionar('404');
    //     }
    //     $unidade->salvarVisitas();

    //     echo $this->template->renderizar('unidade.html', [
    //         'unidade' => $unidade,
    //         'categorias' => $this->categorias(),
    //     ]);
    // }

    /**
     * Categorias
     * @return array|null
     */
    // public function categorias(): ?array
    // {
    //     return (new CategoriaModelo())->busca("status = 1")->resultado(true);
    // }

    /**
     * Lista unidades por categoria
     * @param string $slug
     * @return void
     */
    // public function categoria(string $slug, int $pagina = null): void
    // {
    //     $categoria = (new CategoriaModelo())->buscaPorSlug($slug);
    //     if (!$categoria) {
    //         Helpers::redirecionar('404');
    //     }
    //     $categoria->salvarVisitas();

    //     $unidades = (new UnidadeModelo());
    //     $total = $unidades->busca('categoria_id = :c AND status = :s', "c={$categoria->id}&s=1 COUNT(id)", 'id')->total();

    //     $paginar = new Paginar(Helpers::url('categoria/' . $slug), ($pagina ?? 1), 10, 3, $total);

    //     echo $this->template->renderizar('categoria.html', [
    //         'unidades' => $unidades->busca("categoria_id = {$categoria->id} AND status = 1")->limite($paginar->limite())->offset($paginar->offset())->resultado(true),
    //         'paginacao' => $paginar->renderizar(),
    //         'paginacaoInfo' => $paginar->info(),
    //         'categorias' => $this->categorias(),
    //     ]);
    // }

    /**
     * Sobre
     * @return void
     */
    // public function sobre(): void
    // {
    //     echo $this->template->renderizar('sobre.html', [
    //         'titulo' => 'Sobre nós',
    //         'categorias' => $this->categorias(),
    //     ]);
    // }

    /**
     * ERRO 404
     * @return void
     */
    public function erro404(): void
    {
        echo $this->template->renderizar('404.html', [
            'titulo' => 'Página não encontrada',
            //'categorias' => $this->categorias(),
        ]);
    }

    /**
     * Contato
     * @return void
     */
    // public function contato(): void
    // {
    //     $dados = filter_input_array(INPUT_POST, FILTER_SANITIZE_SPECIAL_CHARS);

    //     if (isset($dados)) {
    //         if (in_array('', $dados)) {
    //             Helpers::json('erro', 'Preencha todos os campos!');
    //         } elseif (!Helpers::validarEmail($dados['email'])) {
    //             Helpers::json('erro', 'E-mail inválido!');
    //         } else {
    //             try {
    //                 $email = new Email();

    //                 $view = $this->template->renderizar('emails/contato.html', [
    //                     'dados' => $dados,
    //                 ]);

    //                 $email->criar(
    //                         'Contato via Site - ' . SITE_NOME,
    //                         $view,
    //                         EMAIL_REMETENTE['email'],
    //                         EMAIL_REMETENTE['nome'],
    //                         $dados['email'],
    //                         $dados['nome']
    //                 );

    //                 $anexos = $_FILES['anexos'];

    //                 foreach ($anexos['tmp_name'] as $indice => $anexo) {
    //                     if (!$anexo == UPLOAD_ERR_OK) {
    //                         $email->anexar($anexo, $anexos['name'][$indice]);
    //                     }
    //                 }
    //                 $email->enviar(EMAIL_REMETENTE['email'], EMAIL_REMETENTE['nome']);

    //                 Helpers::json('successo', 'E-mail enviado com sucesso!');
    //                 Helpers::json('redirecionar', Helpers::url());
    //             } catch (\PHPMailer\PHPMailer\Exception $ex) {
    //                 Helpers::json('erro', 'Erro ao enviar e-mail. Tente novamente mais tarde! ' . $ex->getMessage());
    //             }
    //         }
    //     }

    //     echo $this->template->renderizar('contato.html', [
    //         'categorias' => $this->categorias(),
    //     ]);
    // }

    /**
     * Login
     * @return void
     */
    public function login(): void
    {
        $usuario = UsuarioController::usuario();
        if ($usuario) {
            switch ($usuario->tipo_usuario_id) {
                case 1: //Administração
                    Helpers::redirecionar('admin/dashboard');
                    break;
                case 2: //Central de vagas
                    Helpers::redirecionar('admin/dashboard');
                    break;
                case 3: //Unidade de acolhimento
                    Helpers::redirecionar('admin/dashboard');
                    break;
                case 4: //Centro pop
                    Helpers::redirecionar('admin/dashboard');
                    break;
                case 5: //Seas
                    Helpers::redirecionar('admin/dashboard');
                    break;
                case 6: //NOA
                    Helpers::redirecionar('admin/dashboard');
                    break;
            }
        }

        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        if (isset($dados)) {
            if (in_array('', $dados)) {
                $this->mensagem->alerta('Todos os campos são obrigatórios!')->flash();
            } else {
                $usuario = (new UsuarioModelo())->login($dados, 3);
                if ($usuario) {
                    Helpers::redirecionar('login');
                }
            }
        }

        echo $this->template->renderizar('login.html', []);
    }

    public function redefinirSenha(): void
    {
        // $this->mensagem->alerta('A nova senha deve conter ao menos uma letra minúscula, uma letra maiúscula, um número, um caráter especial (.-_) e um mínimo de 6 caracteres.')->flash();
        $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
        if (isset($dados)) {
            if (Helpers::verificarNovaSenha(trim($dados['nova_senha']), trim($dados['confirmar_senha']))) {

                if (Helpers::validarSenha(trim($dados['nova_senha']))) {
                    $usuario = (new UsuarioModelo())->alterarSenha($dados);
                    if ($usuario) {
                        Helpers::redirecionar('login');
                    }
                } else {
                    $this->mensagem->erro('A nova senha não atende os requisitos mínimos.')->flash();
                }
            } else {
                $this->mensagem->alerta('A confirmação de senha não confere com a nova senha.')->flash();
            }
        }
        echo $this->template->renderizar('redefinirSenha.html', []);
    }
}
