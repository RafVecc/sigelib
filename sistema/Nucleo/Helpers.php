<?php

namespace sistema\Nucleo;

use Exception;
use sistema\Nucleo\Sessao;


class Helpers
{

    public static function gerarToken(int $tamanho = 16): string
    {
        return bin2hex(random_bytes($tamanho));
    }

    /**
     * Cria retorno json
     * @param string $chave
     * @param string $valor
     * @return void
     */
    public static function json(string $chave, string $valor): void
    {
        header('Content-Type: application/json');

        $json[$chave] = $valor;
        echo json_encode($json);

        exit();
    }

    /**
     * Valida a senha
     * @param string $senha
     * @return bool
     */
    public static function validarSenha(string $senha): bool
    {
        $pattern = "/^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_.]).{6,})$/";
        if (preg_match($pattern, $senha)) {
            return true;
        }else{
            return false;
        }

    }

    /**
     * Gera senha segura
     * @param string $senha
     * @return string
     */
    public static function gerarSenha(string $senha): string
    {
        return password_hash($senha, PASSWORD_DEFAULT, ['cost' => 10]);
    }

    /**
     * Verifica a senha
     * @param string $senha
     * @param string $hash
     * @return bool
     */
    public static function verificarSenha(string $senha, string $hash): bool
    {
        return password_verify($senha, $hash);
    }

    /**
     * Verifica a senha
     * @param string $senha
     * @param string $hash
     * @return bool
     */
    public static function verificarNovaSenha(string $nova_senha, string $confirmar_senha): bool
    {
        if ($nova_senha === $confirmar_senha) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Instancia e retorna as mensagens flash por sessão
     * @return string|null
     */
    public static function flash(): ?string
    {
        $sessao = new Sessao();

        $flash = $sessao->flash();

        if ($flash) {
            echo $flash;
        }
        return null;
    }

    /**
     * Redireciona para a url informada
     * @param string $url
     * @return void
     */
    public static function redirecionar(string $url = null): void
    {
        header('HTTP/1.1 302 Found');

        $local = ($url ? self::url($url) : self::url());

        header("Location: {$local} ");
        exit();
    }

    /**
     * Válida um número de CPF
     * @param string $cpf
     * @return bool
     */
    public static function validarCpf(string $cpf): bool
    {
        $cpf = self::limparNumero($cpf);

        $cpf = str_pad($cpf, 11, '0', STR_PAD_LEFT);


        if (mb_strlen($cpf) != 11 or preg_match('/(\d)\1{10}/', $cpf)) {
            //throw new Exception('O CPF precisa ter 11 digitos');
            //return 'O CPF precisa ter 11 digitos';
            return false;
        }
        for ($t = 9; $t < 11; $t++) {
            for ($d = 0, $c = 0; $c < $t; $c++) {
                $d += $cpf[$c] * (($t + 1) - $c);
            }
            $d = ((10 * $d) % 11) % 10;
            if ($cpf[$c] != $d) {
                //throw new Exception('CPF Inválido');
                //return 'CPF Inválido';
                return false;
            }
        }
        return true;
    }

    /**
     * Limpa todos os caracteres não numéricos
     * @param string $numero
     * @return string
     */
    public static function limparNumero(string $numero): string
    {
        return preg_replace('/[^0-9]/', '', $numero);
    }

    /**
     * Gera url amigável
     * @param string $string
     * @return string slug
     */
    public static function slug(string $string): string
    {
        /*
    $mapa['a'] = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜüÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿRr"!@#$%&*()_-+={[}]/?¨|;:.,\\\'<>°ºª  ';

    $mapa['b'] = 'aaaaaaaceeeeiiiidnoooooouuuuuybsaaaaaaaceeeeiiiidnoooooouuuyybyRr                                 ';
    $slug = strtr(utf8_decode($string), utf8_decode($mapa['a']), $mapa['b']);
    $slug = strip_tags(trim($slug));
    $slug = str_replace(' ', '-', $slug);
    $slug = str_replace(['-----', '----', '---', '--', '-'], '-', $slug);

    return strtolower(utf8_decode($slug));
    */

        $string = preg_replace('/[\t\n]/', ' ', $string);
        $string = preg_replace('/\s{2,}/', ' ', $string);
        $list = array(
            'Š' => 'S',
            'š' => 's',
            'Đ' => 'Dj',
            'đ' => 'dj',
            'Ž' => 'Z',
            'ž' => 'z',
            'Č' => 'C',
            'č' => 'c',
            'Ć' => 'C',
            'ć' => 'c',
            'À' => 'A',
            'Á' => 'A',
            'Â' => 'A',
            'Ã' => 'A',
            'Ä' => 'A',
            'Å' => 'A',
            'Æ' => 'A',
            'Ç' => 'C',
            'È' => 'E',
            'É' => 'E',
            'Ê' => 'E',
            'Ë' => 'E',
            'Ì' => 'I',
            'Í' => 'I',
            'Î' => 'I',
            'Ï' => 'I',
            'Ñ' => 'N',
            'Ò' => 'O',
            'Ó' => 'O',
            'Ô' => 'O',
            'Õ' => 'O',
            'Ö' => 'O',
            'Ø' => 'O',
            'Ù' => 'U',
            'Ú' => 'U',
            'Û' => 'U',
            'Ü' => 'U',
            'Ý' => 'Y',
            'Þ' => 'B',
            'ß' => 'Ss',
            'à' => 'a',
            'á' => 'a',
            'â' => 'a',
            'ã' => 'a',
            'ä' => 'a',
            'å' => 'a',
            'æ' => 'a',
            'ç' => 'c',
            'è' => 'e',
            'é' => 'e',
            'ê' => 'e',
            'ë' => 'e',
            'ì' => 'i',
            'í' => 'i',
            'î' => 'i',
            'ï' => 'i',
            'ð' => 'o',
            'ñ' => 'n',
            'ò' => 'o',
            'ó' => 'o',
            'ô' => 'o',
            'õ' => 'o',
            'ö' => 'o',
            'ø' => 'o',
            'ù' => 'u',
            'ú' => 'u',
            'û' => 'u',
            'ý' => 'y',
            'ý' => 'y',
            'þ' => 'b',
            'ÿ' => 'y',
            'Ŕ' => 'R',
            'ŕ' => 'r',
            '/' => '-',
            ' ' => '-',
            '.' => '-',
        );

        $string = strtr($string, $list);
        $string = preg_replace('/-{2,}/', '-', $string);
        $string = strtolower($string);

        return $string;
    }

    /**
     * Data atual formatada 
     * @return string
     */
    public static function dataAtual(): string
    {
        $diaMes = date('d');
        $diaSemana = date('w');
        $mes = date('n') - 1;
        $ano = date('Y');

        $nomesDiasDaSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sabádo'];

        $nomesDosMeses = [
            'janeiro',
            'fevereiro',
            'março',
            'abril',
            'maio',
            'junho',
            'julho',
            'agosto',
            'setembro',
            'outubro',
            'novembro',
            'dezembro'
        ];

        $dataFormatada = $nomesDiasDaSemana[$diaSemana] . ', ' . $diaMes . ' de ' . $nomesDosMeses[$mes] . ' de ' . $ano;

        return $dataFormatada;
    }

    /**
     * Monta url de acordo com o ambiente
     * @param string $url parte da url ex. admin
     * @return string url completa
     */
    public static function url(string $url = null): string
    {
        $servidor = filter_input(INPUT_SERVER, 'SERVER_NAME');
        $ambiente = ($servidor == 'localhost' ? URL_DESENVOLVIMENTO : URL_PRODUCAO);

        if (!empty($url)) {
            if (str_starts_with($url, '/')) {
                return $ambiente . $url;
            }
        }
        return $ambiente . '/' . $url;
    }

    /**
     * Checa se o servidor é localhost
     * @return bool
     */
    public static function localhost(): bool
    {
        $servidor = filter_input(INPUT_SERVER, 'SERVER_NAME');
        if ($servidor == 'localhost') {
            return true;
        }
        return false;
    }

    /**
     * Valida uma url
     * @param string $url
     * @return bool
     */
    public static function validarUrl(string $url): bool
    {
        if (mb_strlen($url) < 10) {
            return false;
        }
        if (!str_contains($url, '.')) {
            return false;
        }
        if (str_contains($url, 'http://') or str_contains($url, 'https://')) {
            return true;
        }
        return false;
    }

    public static function validarUrlComFiltro(string $url): bool
    {
        return filter_var($url, FILTER_VALIDATE_URL);
    }

    /**
     * Valida um endereço de e-mail
     * @param string $email
     * @return bool
     */
    public static function validarEmail(string $email): bool
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    /**
     * Conta o tempo decorrido de uma data
     * @param string $data
     * @return string
     */
    public static function contarTempo(string $data): string
    {
        $agora = strtotime(date('Y-m-d H:i:s'));
        $tempo = strtotime($data);
        $diferenca = $agora - $tempo;

        $segundos = $diferenca;
        $minutos = round($diferenca / 60);
        $horas = round($diferenca / 3600);
        $dias = round($diferenca / 86400);
        $semanas = round($diferenca / 604800);
        $meses = round($diferenca / 2419200);
        $anos = round($diferenca / 29030400);

        if ($segundos <= 60) {
            return 'agora';
        } elseif ($minutos <= 60) {
            return $minutos == 1 ? '1 minuto' : $minutos . ' minutos';
        } elseif ($horas <= 24) {
            return $horas == 1 ? '1 hora' : $horas . ' horas';
        } elseif ($dias <= 7) {
            return $dias == 1 ? 'ontem' : $dias . ' dias';
        } elseif ($semanas <= 4) {
            return $semanas == 1 ? '1 semana' : $semanas . ' semanas';
        } elseif ($meses <= 12) {
            return $meses == 1 ? '1 mês' : $meses . ' meses';
        } else {
            return $anos == 1 ? '1 ano' : $anos . ' anos';
        }
    }

    /**
     * Formata um valor com ponto e virgula
     * @param float $valor
     * @return string
     */
    public static function formatarValor(float $valor = null): string
    {
        return number_format(($valor ? $valor : 0), 2, ',', '.');
    }

    /**
     * Formata um número com pontos
     * @param int $numero
     * @return string
     */
    public static function formatarNumero(int $numero = null): string
    {
        return number_format($numero ?: 0, 0, '.', '.');
    }

    /**
     * Formata um número com decimal separado com ponto
     * @param int $valor
     * @return string
     */
    public static function decimalComPonto(string $valor = null)
    {
        if (!empty(preg_replace("/[^0-9]/", "", $valor))) {
            if (strstr($valor, ",")) {
                $valor = str_replace(".", "", $valor); // replace dots (thousand seps) with blancs

                $valor = str_replace(",", ".", $valor); // replace ',' with '.'
            }
            if (preg_match("#([0-9\.]+)#", $valor, $match)) { // search for number that may contain '.'
                return floatval($match[0]);
            } else {
                return floatval($valor); // take some last chances with floatval
            }
        } else {
            return NULL;
        }
    }


    /**
     * Saudação de acordo com o horário
     * @return string saudação
     */
    public static function saudacao(): string
    {
        $hora = date('H');

        $saudacao = match (true) {
            $hora >= 0 and $hora <= 5 => 'Boa madrugada',
            $hora >= 6 and $hora <= 12 => 'Bom dia',
            $hora >= 13 and $hora <= 18 => 'Boa tarde',
            default => 'Boa noite'
        };

        return $saudacao;
    }
    /**
     * Converte data dd/mm/aaaa para aaa-mm-dd
     * @return string saudação
     */
    public static function dataParaBanco(string $data): string
    {
        $data = date("Y-m-d", strtotime(str_replace('/', '-', $data)));
        return $data;
    }
    public static function dataHoraParaBr(string $data): string
    {
        if (empty($data)) {
            return "";
        }
        $data = date("d/m/Y H:i", strtotime($data));
        return $data;
    }
    public static function dataParaBr(string $data): string
    {
        if (empty($data)) {
            return "";
        }
        $data = date("d/m/Y", strtotime($data));
        return $data;
    }

    /**
     * Resume um texto para um limite de caracteres.
     *
     * @param string $texto O texto a ser resumido.
     * @param int $limite O limite de caracteres para o resumo.
     * @param string $continue O texto que será adicionado ao final do resumo (opcional, padrão: '...').
     * @return string O texto resumido.
     */
    public static function resumirTexto(string $texto, int $limite, string $continue = '...'): string
    {
        $textoLimpo = trim(strip_tags($texto));
        if (mb_strlen($textoLimpo) <= $limite) {
            return $textoLimpo;
        }

        $resumirTexto = mb_substr($textoLimpo, 0, mb_strrpos(mb_substr($textoLimpo, 0, $limite), ''));

        return $resumirTexto . $continue;
    }
    // public static function object_to_array($data): array 
    // {
    //     if ((! is_array($data)) and (! is_object($data)))
    //         return ''; // $data;

    //     $result = array();

    //     $data = (array) $data;
    //     foreach ($data as $key => $value) {
    //         if (is_object($value))
    //             $value = (array) $value;
    //         if (!is_array($value))
    //         {
    //             $result[$key] = $value;
    //         }
    //         /*
    //         if (is_array($value))
    //             $result[$key] = object_to_array($value);
    //         else
    //             $result[$key] = $value;
    //         */
    //     }
    //     return $result;
    // }

}
