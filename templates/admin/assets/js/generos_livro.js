$('.cadastrarGenerosLivro').on("click", function (event) {

    event.preventDefault();

    var emptyCount = 0;
    $("#cadastrarGenerosLivro").find('input[required], select[required], textarea[required]').each(function (index, element) {
        var element = $(element);

        if (element.val() === '') {
            emptyCount++;
            element.addClass('is-invalid');
            $("#ModalCadastrarGenerosLivro").scrollTo('.is-invalid');
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
            title: "Deseja finalizar o cadastro desse Tipo de Livro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, cadastrar!"
        }).then((result) => {
            if (result.isConfirmed) {
                $('#cadastrarGenerosLivro').submit()
            }
        });

    }
});

$('.editarGenerosLivro').on("click", function (event) {

    event.preventDefault();

    Swal.fire({
        title: "Deseja finalizar a edição desse Tipo de Livro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, editar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $('#editarGenerosLivro').submit()
        }
    });


});

$('.valorizarGeneroLivro').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/generos_livro/valorizarGeneroLivro',
        data: { id: id },
        dataType: 'json',

        success: function (data) {
            $('#genero_livro_id').val(data[0]['id'])
            $('#genero_livro_editar').val(data[0]['genero_livro'])
        }
    })
})