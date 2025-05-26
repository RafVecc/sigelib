$('.valorizarEditarEntidade').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/entidades/valorizarEntidade',
        data: { id: id },
        dataType: 'json',

        success: function (data) {
            console.log()
            var imagem = url + 'uploads/entidades/' + data[0]['token'] + '/' + data[0]['logo']
            $('#entidade_id').val(data[0]['id'])
            $('#imgLogoEditar').attr('src', imagem)
            $('#nome_editar').val(data[0]['nome'])
            $('#telefone_entidade_editar').val(data[0]['telefone_entidade'])
            $('#nome_responsavel_editar').val(data[0]['nome_responsavel'])
            $('#telefone_responsavel_editar').val(data[0]['telefone_responsavel'])
            $('#email_editar').val(data[0]['email'])
            $('#cep_editar').val(data[0]['cep'])
            $('#bairro_id_editar').val(data[0]['bairro_id'])
            $('#numero_editar').val(data[0]['numero'])
            $('#endereco_editar').val(data[0]['endereco'])
            $('#referencia_editar').val(data[0]['referencia'])
            $('#complemento_editar').val(data[0]['complemento'])


        }
    })
})

$('.statusEntidade').on("click", function () {
    var url = $('table').attr('url');
    var id = $(this).attr('data-id');
    var status = $(this).attr('data-status');
    if (status == 1) {
        var title = 'Deseja realmente inativar essa entidade?'
        var text = 'A entidade não poderá mais ser utilizada para cadastrar cursos!'
        var confirmButtonText = 'Sim, inativar!'
    } else {
        var title = 'Deseja realmente ativar essa entidade?'
        var text = 'A entidade passará a aparecer como opção no cadastro de cursos!'
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
                url: url + 'admin/entidades/statusEntidade',
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