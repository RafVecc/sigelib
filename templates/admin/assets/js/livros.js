$('.cadastrarLivro').on("click", function (event) {

    event.preventDefault();

    var emptyCount = 0;
    $("#cadastrarLivro").find('input[required], select[required], textarea[required]').each(function (index, element) {
        var element = $(element);

        if (element.val() === '') {
            emptyCount++;
            element.addClass('is-invalid');
            $("#ModalCadastrarLivro").scrollTo('.is-invalid');
        } else {

            if (!validarCamposLivros(element)) {
                emptyCount++;
            } else {
                element.removeClass('is-invalid');
            }
        }
    });
    if (emptyCount == 0) {
        Swal.fire({
            title: "Deseja finalizar o cadastro desse livro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim",
            cancelButtonText: "Não"
        }).then((result) => {
            if (result.isConfirmed) {
                $('#cadastrarLivro').submit()
            }
        });
    }
});

$('.editarLivro').on("click", function (event) {

    event.preventDefault();

    Swal.fire({
        title: "Deseja finalizar a edição desse livro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
    }).then((result) => {
        if (result.isConfirmed) {
            $('#editarLivro').submit()
        }
    });


});

$('.valorizarLivro').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/livros/valorizarLivro',
        data: { id: id },
        dataType: 'json',

        success: function (data) {
            var imagem = url + 'uploads/livros/' + data[0]['foto_capa_livro']
            $('#livro_id').val(data[0]['id'])
            $('#foto_capa_livro_editar').attr('src', imagem)
            $('#titulo_livro_editar').val(data[0]['titulo_livro'])
            $('#genero_livro_editar_id').val(data[0]['genero_livro_id'])
            $('#editora_livro_editar_id').val(data[0]['editora_livro'])
            $('#ano_livro_editar').val(data[0]['ano_livro'])
            $('#pais_livro_editar_id').val(data[0]['pais_livro_id'])
            $('#idioma_livro_editar_id').val(data[0]['idioma_livro_id'])
            $('#autor_livro_editar').val(data[0]['autor_livro'])
            $('#quantidade_livro_editar').val(data[0]['quantidade_livro'])
            $('#tipo_procedencia_livro_editar_id').val(data[0]['tipo_procedencia_livro_id'])
            $('#procedencia_livro_editar').val(data[0]['procedencia_livro'])
            $('#data_doacao_compra_livro_editar').val(data[0]['data_doacao_compra_livro'])
            $('#localizacao_livro_editar').val(data[0]['localizacao_livro'])
            $('#sinopse_livro_editar').val(data[0]['sinopse_livro'])


        }
    })
})

function validarCamposLivros(elementos) {
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