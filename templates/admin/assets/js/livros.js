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

            if (!validarCampos(element)) {
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
            if (data[0]['check'] == 'invalido') {
                $('#titulo_livro_editar').attr('disabled', true)
                $('#genero_livro_editar_id').attr('disabled', true)
                $('#editora_livro_editar_id').attr('disabled', true)
                $('#ano_livro_editar').attr('disabled', true)
                $('#pais_livro_editar_id').attr('disabled', true)
                $('#idioma_livro_editar_id').attr('disabled', true)
                $('#autor_livro_editar').attr('disabled', true)
                $('#quantidade_livro_editar').attr('disabled', true)
                $('#tipo_procedencia_livro_editar_id').attr('disabled', true)
                $('#procedencia_livro_editar').attr('disabled', true)
                $('#data_doacao_compra_livro_editar').attr('disabled', true)
                $('#sinopse_livro_editar').attr('disabled', true)
                $('#img_capa_livro_editar').attr('disabled', true)
            } else {
                $('#titulo_livro_editar').attr('disabled', false)
                $('#genero_livro_editar_id').attr('disabled', false)
                $('#editora_livro_editar_id').attr('disabled', false)
                $('#ano_livro_editar').attr('disabled', false)
                $('#pais_livro_editar_id').attr('disabled', false)
                $('#idioma_livro_editar_id').attr('disabled', false)
                $('#autor_livro_editar').attr('disabled', false)
                $('#quantidade_livro_editar').attr('disabled', false)
                $('#tipo_procedencia_livro_editar_id').attr('disabled', false)
                $('#procedencia_livro_editar').attr('disabled', false)
                $('#data_doacao_compra_livro_editar').attr('disabled', false)
                $('#sinopse_livro_editar').attr('disabled', false)
                $('#img_capa_livro_editar').attr('disabled', false)
            }
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
