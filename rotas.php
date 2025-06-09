<?php

use Pecee\SimpleRouter\SimpleRouter;
use sistema\Nucleo\Helpers;

try {
    //namespace dos controladores
    SimpleRouter::setDefaultNamespace('sistema\Controller');

    //SITE
    SimpleRouter::get(URL_SITE, 'SiteController@index');
    SimpleRouter::match(['get', 'post'], URL_SITE . 'login', 'SiteController@login');
    SimpleRouter::match(['get', 'post'], URL_SITE . 'redefinirSenha', 'SiteController@redefinirSenha');
    SimpleRouter::get(URL_SITE . '404', 'SiteController@erro404');

    //ROTAS ADMIN
    SimpleRouter::group(['namespace' => 'Admin'], function () {

        //ADMIN LOGIN
        SimpleRouter::get(URL_ADMIN, 'AdminLogin@index');
        SimpleRouter::get(URL_SITE, 'AdminLogin@index');

        //DASHBOAD
        SimpleRouter::get(URL_ADMIN . 'dashboard', 'AdminDashboard@dashboard');
        SimpleRouter::get(URL_ADMIN . 'sair', 'AdminDashboard@sair');

        //ADMIN USUARIOS
        SimpleRouter::get(URL_ADMIN . 'usuarios/listar', 'AdminUsuarios@listar');
        SimpleRouter::match(['get', 'post'], URL_ADMIN . 'usuarios/cadastrar', 'AdminUsuarios@cadastrar');
        SimpleRouter::match(['get', 'post'], URL_ADMIN . 'usuarios/editar', 'AdminUsuarios@editar');
        SimpleRouter::match(['get', 'post'], URL_ADMIN . 'usuarios/valorizarUsuarios', 'AdminUsuarios@valorizarUsuarios');
        SimpleRouter::match(['get', 'post'], URL_ADMIN . 'usuarios/statusUsuario', 'AdminUsuarios@statusUsuario');
        SimpleRouter::match(['get', 'post'], URL_ADMIN . 'usuarios/resetarSenha', 'AdminUsuarios@resetarSenha');

        // //ADMIN ENTIDADES
        // SimpleRouter::get(URL_ADMIN . 'entidades/listar', 'AdminEntidades@listar');
        // SimpleRouter::match(['get', 'post'], URL_ADMIN . 'entidades/cadastrar', 'AdminEntidades@cadastrar');
        // SimpleRouter::match(['get', 'post'], URL_ADMIN . 'entidades/editar', 'AdminEntidades@editar');
        // SimpleRouter::match(['get', 'post'], URL_ADMIN . 'entidades/valorizarEntidade', 'AdminEntidades@valorizarEntidade');
        // SimpleRouter::match(['get', 'post'], URL_ADMIN . 'entidades/statusEntidade', 'AdminEntidades@statusEntidade');

        // //ADMIN AREA ATUACAO
        // SimpleRouter::get(URL_ADMIN . 'areaAtuacao/listar', 'AdminAreaAtuacao@listar');
        // SimpleRouter::match(['get', 'post'], URL_ADMIN . 'areaAtuacao/cadastrar', 'AdminAreaAtuacao@cadastrar');
        // SimpleRouter::match(['get', 'post'], URL_ADMIN . 'areaAtuacao/editar', 'AdminAreaAtuacao@editar');
        // SimpleRouter::match(['get', 'post'], URL_ADMIN . 'areaAtuacao/valorizarAreaAtuacao', 'AdminAreaAtuacao@valorizarAreaAtuacao');
        // SimpleRouter::match(['get', 'post'], URL_ADMIN . 'areaAtuacao/statusAreaAtuacao', 'AdminAreaAtuacao@statusAreaAtuacao');

        //  //ADMIN PROFESSORES
        //  SimpleRouter::get(URL_ADMIN . 'professores/listar', 'AdminProfessores@listar');
        //  SimpleRouter::match(['get', 'post'], URL_ADMIN . 'professores/cadastrar', 'AdminProfessores@cadastrar');
        //  SimpleRouter::match(['get', 'post'], URL_ADMIN . 'professores/editar', 'AdminProfessores@editar');
        //  SimpleRouter::match(['get', 'post'], URL_ADMIN . 'professores/valorizarProfessor', 'AdminProfessores@valorizarProfessor');
        //  SimpleRouter::match(['get', 'post'], URL_ADMIN . 'professores/statusProfessor', 'AdminProfessores@statusProfessor');
        //  SimpleRouter::match(['get', 'post'], URL_ADMIN . 'professores/checarCpf', 'AdminProfessores@checarCpf');


        //   //ADMIN ESPAÇOS
        //   SimpleRouter::get(URL_ADMIN . 'espacos/listar', 'AdminEspacos@listar');
        //   SimpleRouter::match(['get', 'post'], URL_ADMIN . 'espacos/cadastrar', 'AdminEspacos@cadastrar');
        //   SimpleRouter::match(['get', 'post'], URL_ADMIN . 'espacos/editar', 'AdminEspacos@editar');
        //   SimpleRouter::match(['get', 'post'], URL_ADMIN . 'espacos/valorizarEspaco', 'AdminEspacos@valorizarEspaco');
        //   SimpleRouter::match(['get', 'post'], URL_ADMIN . 'espacos/statusEspaco', 'AdminEspacos@statusEspaco');

          //ADMIN LIVROS
          SimpleRouter::get(URL_ADMIN . 'livros/listar', 'AdminLivros@listar');
          SimpleRouter::match(['get', 'post'], URL_ADMIN . 'livros/cadastrar', 'AdminLivros@cadastrar');
          SimpleRouter::match(['get', 'post'], URL_ADMIN . 'livros/editar', 'AdminLivros@editar');
          SimpleRouter::match(['get', 'post'], URL_ADMIN . 'livros/valorizarLivro', 'AdminLivros@valorizarLivro');
          SimpleRouter::match(['get', 'post'], URL_ADMIN . 'livros/statusLivro', 'AdminLivros@statusLivro');

          //ADMIN LEITORES
          SimpleRouter::get(URL_ADMIN . 'leitores/listar', 'AdminLeitores@listar');
          SimpleRouter::match(['get', 'post'], URL_ADMIN . 'leitores/cadastrar', 'AdminLeitores@cadastrar');
          SimpleRouter::match(['get', 'post'], URL_ADMIN . 'leitores/editar', 'AdminLeitores@editar');
          SimpleRouter::match(['get', 'post'], URL_ADMIN . 'leitores/valorizarLivro', 'AdminLeitores@valorizarLivro');
          SimpleRouter::match(['get', 'post'], URL_ADMIN . 'leitores/statusLivro', 'AdminLeitores@statusLivro');
          SimpleRouter::match(['get', 'post'], URL_ADMIN . 'leitores/checarCpf', 'AdminLeitores@checarCpf');
          SimpleRouter::match(['get', 'post'], URL_ADMIN . 'leitores/fichaLeitor', 'AdminLeitores@fichaLeitor');

        //   //ADMIN CURSOS
        //   SimpleRouter::get(URL_ADMIN . 'cursos/listar', 'AdminCursos@listar');
        //   SimpleRouter::match(['get', 'post'], URL_ADMIN . 'cursos/cadastrar', 'AdminCursos@cadastrar');
        //   SimpleRouter::match(['get', 'post'], URL_ADMIN . 'cursos/editar', 'AdminCursos@editar');
        //   SimpleRouter::match(['get', 'post'], URL_ADMIN . 'cursos/editarAtividade', 'AdminCursos@editarAtividade');
        //   SimpleRouter::match(['get', 'post'], URL_ADMIN . 'cursos/valorizarCurso', 'AdminCursos@valorizarCurso');
        //   SimpleRouter::match(['get', 'post'], URL_ADMIN . 'cursos/valorizarAtividade', 'AdminCursos@valorizarAtividade');
        //   SimpleRouter::match(['get', 'post'], URL_ADMIN . 'cursos/buscarEspaco', 'AdminCursos@buscarEspaco');
        //   SimpleRouter::match(['get', 'post'], URL_ADMIN . 'cursos/cancelarCurso', 'AdminCursos@cancelarCurso');
        //   SimpleRouter::match(['get', 'post'], URL_ADMIN . 'cursos/statusCurso', 'AdminCursos@statusCurso');

        //   //ADMIN ESPAÇOS
        //   SimpleRouter::get(URL_ADMIN . 'teste/listar', 'AdminTeste@listar');
        //   SimpleRouter::match(['get', 'post'], URL_ADMIN . 'teste/cadastrar', 'AdminTeste@cadastrar');
        //   SimpleRouter::match(['get', 'post'], URL_ADMIN . 'teste/editar', 'AdminTeste@editar');
        //   SimpleRouter::match(['get', 'post'], URL_ADMIN . 'teste/valorizarEspaco', 'AdminTeste@valorizarEspaco');
        //   SimpleRouter::match(['get', 'post'], URL_ADMIN . 'teste/statusEspaco', 'AdminTeste@statusEspaco');
        
    });
    SimpleRouter::start();
} catch (Pecee\SimpleRouter\Exceptions\NotFoundHttpException $ex) {
    if (Helpers::localhost()) {
        echo $ex->getMessage();
    } else {
        Helpers::redirecionar('404');
    }
}
