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

$("#pesquisaLeitor").find('#cpf').on("input", function (e) {
    var cpf = $(this).val().replace(/[^0-9]/g, '');
    cpf = cpf.replace(/[0-9]{12}$/, cpf.slice(0, -1));
    if (cpf.length != 11) {

    } else {

        var novoCpf = cpf.replace(/[^\d]/g, '')
        if (novoCpf.match(/(\d)\1{10}/)) {
            Swal.fire({
                icon: "error",
                title: "CPF Não Válido!",
                text: 'Esse CPF não é válido, por favor informe um CPF existente!',

            }).then(() => {
                $(this).val('')
            })
        } else {
            var contador = 0
            for (t = 9; t < 11; t++) {
                for (d = 0, c = 0; c < t; c++) {
                    d += novoCpf[c] * ((t + 1) - c);
                }
                d = ((10 * d) % 11) % 10;
                if (novoCpf[c] != d) {
                    contador++
                    Swal.fire({
                        icon: "error",
                        title: "CPF Não Válido!",
                        text: 'Esse CPF não é válido, por favor informe um CPF existente!',

                    }).then(() => {
                        $(this).val('')
                    })
                }
            }
        }
        if (contador == 0) {

            $.ajax({
                type: "POST",
                url: "checarCpf",
                data: { cpf: novoCpf },
                success: function (result) {
                    if (result.trim() == '') {

                        Swal.fire({
                            title: "CPF não cadastrado, deseja iniciar o cadastro?",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Sim, cadastrar!"
                        }).then((result2) => {
                            if (result2.isConfirmed) {
                                $('#ModalCadastrarLeitor').modal('show');
                                $('#ModalCadastrarLeitor').find('#cpf_leitor').val(novoCpf);
                            } else {
                                $('#pesquisaLeitor').find('#cpf').val('');
                            }
                        });

                    } else {
                        Swal.fire({
                            title: "CPF encontrado, deseja abrir a ficha?",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Sim, abrir!"
                        }).then((result3) => {
                            if (result3.isConfirmed) {
                                $('#pesquisaLeitor').submit()
                            } else {
                                $('#pesquisaLeitor').find('#cpf').val('');
                            }
                        });
                    }
                }
            });

            e.preventDefault();
        }
    }

}
);

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