$('.cadastrarLeitor').on("click", function (event) {

    event.preventDefault();

    Swal.fire({
        title: "Deseja finalizar o cadastro desse leitor?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, cadastrar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $('#cadastrarLeitor').submit()
        }
    });


});

$('.editarLeitor').on("click", function (event) {

    event.preventDefault();

    Swal.fire({
        title: "Deseja finalizar a edição desse leitor?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, editar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $('#editarLeitor').submit()
        }
    });


});

// $('.valorizarLivro').on("click", function () {
//     var url = $('#url').val();
//     var id = $(this).attr('data-id')

//     $.ajax({
//         type: 'POST',
//         url: url + 'admin/livros/valorizarLivro',
//         data: { id: id },
//         dataType: 'json',

//         success: function (data) {
//             var imagem = url + 'uploads/livros/' + data[0]['foto_capa_livro']
//             $('#livro_id').val(data[0]['id'])
//             $('#foto_capa_livro_editar').attr('src', imagem)
//             $('#titulo_livro_editar').val(data[0]['titulo_livro'])
//             $('#genero_livro_editar_id').val(data[0]['genero_livro_id'])
//             $('#editora_livro_editar').val(data[0]['editora_livro'])
//             $('#ano_livro_editar').val(data[0]['ano_livro'])
//             $('#pais_livro_editar_id').val(data[0]['pais_livro_id'])
//             $('#idioma_livro_editar_id').val(data[0]['idioma_livro_id'])
//             $('#autor_livro_editar').val(data[0]['autor_livro'])
//             $('#quantidade_livro_editar').val(data[0]['quantidade_livro'])
//             $('#tipo_procedencia_livro_editar_id').val(data[0]['tipo_procedencia_livro_id'])
//             $('#procedencia_livro_editar').val(data[0]['procedencia_livro'])
//             $('#localizacao_livro_editar').val(data[0]['localizacao_livro'])
//             $('#sinopse_livro_editar').val(data[0]['sinopse_livro'])


//         }
//     })
// })

$(document).ready(function () {

    $("#ModalCadastrarLeitor").find('#cep_leitor').on("input", function (e) {
        console.log('algo')
        var cep = $(this).val().replace(/[^0-9]/g, '');
        cep = cep.replace(/[0-9]{9}$/, cep.slice(0, -1));
        if (cep.length != 8) {

        } else {

            let url = 'http://viacep.com.br/ws/' + cep + '/json/';

            let xmlHttp = new XMLHttpRequest();

            xmlHttp.open('GET', url);


            xmlHttp.onreadystatechange = () => {

                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {

                    let dadosJSONtext = xmlHttp.responseText;
                    let dadosJSONObs = JSON.parse(dadosJSONtext);
                    console.log(dadosJSONObs)
                    $("#ModalCadastrarLeitor").find('#rua_leitor').val(dadosJSONObs.logradouro);
                    $("#ModalCadastrarLeitor").find('#bairro_leitor').val(dadosJSONObs.bairro);

                }
            }
            xmlHttp.send();
        }

    });
});