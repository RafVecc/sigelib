<?php

namespace sistema\Nucleo;

use PDO;
use PDOException;


class ConexaoSigebe
{

    private static $instancia;

    public static function getInstancia(): PDO
    {
        if (empty(self::$instancia)) {
            try {
                self::$instancia = new PDO('mysql:host=' . DB_HOST_SIGEBE . ';port=' . DB_PORTA_SIGEBE . ';dbname=' . DB_NOME_SIGEBE. "; charset=utf8mb4; ", DB_USUARIO_SIGEBE, DB_SENHA_SIGEBE, [
                    //garante que o charset do PDO seja o mesmo do banco de dados
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
                    //todo erro através da PDO será uma exceção
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    //converter qualquer resultado como um objeto anônimo
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
                    //garante que o mesmo nome das colunas do banco seja utilizado
                    PDO::ATTR_CASE => PDO::CASE_NATURAL,
                    //Limitar tempo de espera de conexão em  segundos
                    PDO::ATTR_TIMEOUT => 10
                ]);
            } catch (PDOException $ex) {
                die("Erro de conexão de conexão com Sistema SIGEBE:: " . $ex->getMessage());
            }            
        }
        return self::$instancia;
    }

    /**
     * Construtor do tipo protegido previne que uma nova instância da
     * Classe seja criada através do operador `new` de fora dessa classe.
     */
    protected function __construct()
    {
        
    }

    /**
     * Método clone do tipo privado previne a clonagem dessa instância da classe
     * @return void
     */
    private function __clone(): void
    {
        
    }

}
