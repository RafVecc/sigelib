$('.valorizarProfessor').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/professores/valorizarProfessor',
        data: { id: id },
        dataType: 'json',

        success: function (data) {
            var imagem = url + 'uploads/professores/' + data[0]['token'] + '/' + data[0]['foto']
            $('#professor_id').val(data[0]['id'])
            $('#imgLogoEditar').attr('src', imagem)
            $('#cpf_editar').val(data[0]['cpf'])
            $('#nome_editar').val(data[0]['nome'])
            $('#telefone_editar').val(data[0]['telefone'])
            $('#email_editar').val(data[0]['email'])
            $('#rede_social_editar').val(data[0]['rede_social'])
            $('#cep_editar').val(data[0]['cep'])
            $('#bairro_id_editar').val(data[0]['bairro_id'])
            $('#numero_editar').val(data[0]['numero'])
            $('#endereco_editar').val(data[0]['endereco'])
            $('#referencia_editar').val(data[0]['referencia'])
            $('#complemento_editar').val(data[0]['complemento'])

            var area_atuacao_id = [];
            $.each(data[1], function (key, value) {
                $.each(value, function (chave, valor) {
                    if (chave == "area_atuacao_id") {
                        area_atuacao_id.push(valor);
                    }
                })
            });

            $("#area_atuacao_id_editar").val(area_atuacao_id);
            $("#area_atuacao_id_editar").trigger('change');

        }
    })
})

$('.statusProfessor').on("click", function () {
    var url = $('table').attr('url');
    var id = $(this).attr('data-id');
    var status = $(this).attr('data-status');
    if (status == 1) {
        var title = 'Deseja realmente inativar esse professor?'
        var text = 'O professor não poderá mais ministrar aulas!'
        var confirmButtonText = 'Sim, inativar!'
    } else {
        var title = 'Deseja realmente ativar esse professor?'
        var text = 'O professor passará a aparecer como opção para ministrar aulas!'
        var confirmButtonText = 'Sim, ativar!'
    }

    Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: confirmButtonText
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: url + 'admin/professores/statusProfessor',
                data: { id: id },
                success: function (data) {

                    if (data == true) {
                        Swal.fire({
                            icon: "success",
                            title: "Sucesso!",
                            text: 'Status mudado com sucesso!',

                        }).then(() => {
                            location.reload();
                        })
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Erro!",
                            text: 'Um erro foi encontrado!',

                        }).then(() => {
                            location.reload();
                        })
                    }
                }
            })

        }
    });

})

$("#ModalCadastrarProfessor").find('#cpf').on("input", function (e) {
    console.log('1')
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
                        $('#ModalCadastrarProfessor').find('#cpf').val('');
                        $('#ModalCadastrarProfessor').modal('hide');
                        $(`.valorizarProfessor[data-id='${result}']`).click();
                    }
                }
            });

            e.preventDefault();
        }
    }

}
);