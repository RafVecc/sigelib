$('.valorizarAluno').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/alunos/valorizarAluno',
        data: { id: id },
        dataType: 'json',

        success: function (data) {
            console.log()
            var imagem = url + 'uploads/alunos/' + data[0]['token'] + '/' + data[0]['foto']
            $('#aluno_id').val(data[0]['id'])
            $('#imgLogoEditar').attr('src', imagem)
            $('#cpf_editar').val(data[0]['cpf'])
            $('#nome_editar').val(data[0]['nome'])
            $('#telefone_residencia_editar').val(data[0]['telefone_residencia'])
            $('#nome_responsavel_editar').val(data[0]['nome_responsavel'])
            $('#telefone_celular_editar').val(data[0]['telefone_celular'])
            $('#email_editar').val(data[0]['email'])
            $('#rede_social_editar').val(data[0]['rede_social'])
            $('#cep_editar').val(data[0]['cep'])
            $('#bairro_id_editar').val(data[0]['bairro_id'])
            $('#numero_editar').val(data[0]['numero'])
            $('#endereco_editar').val(data[0]['endereco'])
            $('#referencia_editar').val(data[0]['referencia'])
            $('#complemento_editar').val(data[0]['complemento'])

        }
    })
})

$("#ModalCadastrarAluno").find('#cpf').on("input", function (e) {
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

                    } else {
                        $('#ModalCadastrarAluno').find('#cpf').val('');
                        $('#ModalCadastrarAluno').modal('hide');
                        $(`.valorizarAluno[data-id='${result}']`).click();
                    }
                }
            });

            e.preventDefault();
        }
    }

}
);

// $('.statusEntidade').on("click", function () {
//     var url = $('table').attr('url');
//     var id = $(this).attr('data-id');
//     var status = $(this).attr('data-status');
//     if (status == 1) {
//         var title = 'Deseja realmente inativar essa entidade?'
//         var text = 'A entidade não poderá mais ser utilizada para cadastrar cursos!'
//         var confirmButtonText = 'Sim, inativar!'
//     } else {
//         var title = 'Deseja realmente ativar essa entidade?'
//         var text = 'A entidade passará a aparecer como opção no cadastro de cursos!'
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
//                 url: url + 'admin/entidades/statusEntidade',
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