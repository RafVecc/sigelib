function validarCampos(elementos) {

    if (elementos[0].name == 'data_nascimento_leitor') {

        var hoje = moment(new Date());
        var data_nascimento_leitor = moment(elementos.val());

        var idade = hoje.diff(data_nascimento_leitor, 'years');
        if (idade < 18) {
            elementos.addClass('is-invalid');
            elementos[0].setCustomValidity('Leitor precisa ser maior de idade!')
            elementos[0].reportValidity()
            $("#ModalCadastrarLivro").scrollTo('.is-invalid');
            return false
        }
    }

    if (elementos[0].name == 'ano_livro') {
        var ano_atual = moment(new Date()).format('YYYY');
        if (elementos.val().length != 4) {
            elementos.addClass('is-invalid');
            elementos[0].setCustomValidity('Ano deve ter 4 dígitos!')
            elementos[0].reportValidity()
            $("#ModalCadastrarLivro").scrollTo('.is-invalid');
            return false
        } else if (elementos.val() > ano_atual) {
            elementos.addClass('is-invalid');
            elementos[0].setCustomValidity('Ano não pode ser maior que ano atual!')
            elementos[0].reportValidity()
            $("#ModalCadastrarLivro").scrollTo('.is-invalid');
            return false
        }
    }

    if (elementos[0].name == 'quantidade_livro') {
        if (!$.isNumeric(elementos.val())) {
            elementos.addClass('is-invalid');
            elementos[0].setCustomValidity('Quantidade deve ser um número!')
            elementos[0].reportValidity()
            $("#ModalCadastrarLivro").scrollTo('.is-invalid');
            return false
        }
    }

    if (elementos[0].name == 'data_doacao_compra_livro') {
        var hoje = moment(new Date()).format('YYYY-MM-DD');
        var data_doacao_compra_livro = moment(elementos.val()).format('YYYY-MM-DD');
        if (data_doacao_compra_livro > hoje) {
            elementos.addClass('is-invalid');
            elementos[0].setCustomValidity('Data de doação ou compra não pode ser maior que a data atual!')
            elementos[0].reportValidity()
            $("#ModalCadastrarLivro").scrollTo('.is-invalid');
            return false
        }
    }

    return true
}