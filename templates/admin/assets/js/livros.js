$('.cadastrarLivro').on("click", function (event) {

    event.preventDefault();

    Swal.fire({
        title: "Deseja finalizar o cadastro desse livro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, cadastrar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $('#cadastrarLivro').submit()
        }
    });


});

$('.editarLivro').on("click", function (event) {

    event.preventDefault();

    Swal.fire({
        title: "Deseja finalizar a edição desse livro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, editar!"
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
            $('#editora_livro_editar').val(data[0]['editora_livro'])
            $('#ano_livro_editar').val(data[0]['ano_livro'])
            $('#pais_livro_editar_id').val(data[0]['pais_livro_id'])
            $('#idioma_livro_editar_id').val(data[0]['idioma_livro_id'])
            $('#autor_livro_editar').val(data[0]['autor_livro'])
            $('#quantidade_livro_editar').val(data[0]['quantidade_livro'])
            $('#tipo_procedencia_livro_editar_id').val(data[0]['tipo_procedencia_livro_id'])
            $('#procedencia_livro_editar').val(data[0]['procedencia_livro'])
            $('#localizacao_livro_editar').val(data[0]['localizacao_livro'])
            $('#sinopse_livro_editar').val(data[0]['sinopse_livro'])
            

        }
    })
})

// $('.statusEspaco').on("click", function () {
//     var url = $('table').attr('url');
//     var id = $(this).attr('data-id');
//     var status = $(this).attr('data-status');
//     if (status == 1) {
//         var title = 'Deseja realmente inativar esse espaço?'
//         var text = 'O espaço não poderá mais ser utilizada para dar aulas!'
//         var confirmButtonText = 'Sim, inativar!'
//     } else {
//         var title = 'Deseja realmente ativar esse espaço?'
//         var text = 'O espaço passará a aparecer como opção no cadastro de aulas!'
//         var confirmButtonText = 'Sim, ativar!'
//     }

//     Swal.fire({
//         title: title,
//         text: text,
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: confirmButtonText
//     }).then((result) => {
//         if (result.isConfirmed) {
//             $.ajax({
//                 type: "POST",
//                 dataType: "json",
//                 url: url + 'admin/espacos/statusEspaco',
//                 data: { id: id },
//                 success: function (data) {

//                     if (data == true) {
//                         Swal.fire({
//                             icon: "success",
//                             title: "Sucesso!",
//                             text: 'Status mudado com sucesso!',

//                         }).then(() => {
//                             location.reload();
//                         })
//                     } else {
//                         Swal.fire({
//                             icon: "error",
//                             title: "Erro!",
//                             text: 'Um erro foi encontrado!',

//                         }).then(() => {
//                             location.reload();
//                         })
//                     }
//                 }
//             })

//         }
//     });

// })