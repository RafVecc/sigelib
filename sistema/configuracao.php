<?php

use sistema\Nucleo\Helpers;

//Arquivo de configuração do sistema
//define o fuso horario
date_default_timezone_set('America/Sao_Paulo');



//informações do sistema
define('SITE_NOME', 'Sigelib');
define('SITE_DESCRICAO', 'Sistema Integrado de Gestão de Livros e Bibliotecas');

//urls do sistema
define('URL_PRODUCAO', 'https://sigelib-homologa.salvador.ba.gov.br/');
define('URL_DESENVOLVIMENTO', 'http://localhost:8080/sigelib');



if (Helpers::localhost()) {
    //dados de acesso ao banco de dados em localhost
    define('DB_HOST', 'localhost');
    define('DB_PORTA', '3306');
    define('DB_NOME', 'sigelib');
    define('DB_USUARIO', 'root');
    define('DB_SENHA', '');

    define('DB_HOST_SIGEBE', '177.20.4.61');
    define('DB_PORTA_SIGEBE', '3306');
    define('DB_NOME_SIGEBE', 'semps_db_sige');
    define('DB_USUARIO_SIGEBE', 'sige');
    define('DB_SENHA_SIGEBE', 'XcSems1ge!');

    define('URL_SITE', 'sigelib/');
    define('URL_ADMIN', 'sigelib/admin/');
} else {
    //dados de acesso ao banco de dados na hospedagem
    define('DB_HOST', '177.20.4.234');
    define('DB_PORTA', '3306');
    define('DB_NOME', 'sigelib');
    define('DB_USUARIO', 'usr_sigelib');
    define('DB_SENHA', 'D8i^r7tR!*3#sb!');

    define('DB_HOST_SIGEBE', '177.20.4.61');
    define('DB_PORTA_SIGEBE', '3306');
    define('DB_NOME_SIGEBE', 'semps_db_sige');
    define('DB_USUARIO_SIGEBE', 'sige');
    define('DB_SENHA_SIGEBE', 'XcSems1ge!');

    define('URL_SITE', '/');
    define('URL_ADMIN', '/admin/');
}

//autenticação do servidor de emails
define('EMAIL_HOST', 'smtp-mail.outlook.com');
define('EMAIL_PORTA', '587');
define('EMAIL_USUARIO', ''); // email para envio dos e-mails
define('EMAIL_SENHA', ''); //  senha da conta de email acima
define('EMAIL_REMETENTE', ['email' => EMAIL_USUARIO, 'nome' => SITE_NOME]);

