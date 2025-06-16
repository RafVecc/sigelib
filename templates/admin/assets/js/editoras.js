$('.cadastrarEditora').on("click", function (event) {

    event.preventDefault();

    Swal.fire({
        title: "Deseja finalizar o cadastro dessa editora?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, cadastrar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $('#cadastrarEditora').submit()
        }
    });


});

$('.editarEditora').on("click", function (event) {

    event.preventDefault();

    Swal.fire({
        title: "Deseja finalizar a edição dessa editora?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, editar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $('#editarEditora').submit()
        }
    });


});

$('.valorizarEditora').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/editoras/valorizarEditora',
        data: { id: id },
        dataType: 'json',

        success: function (data) {
            $('#editora_id').val(data[0]['id'])
            $('#editora_livro_editar').val(data[0]['editora_livro'])
            $('#pais_editora_livro_editar_id').val(data[0]['pais_editora_livro_id'])
        }
    })
})