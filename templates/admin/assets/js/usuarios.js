$('.valorizarEditarUsuario').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/usuarios/valorizarUsuarios',
        data: { id: id },
        dataType: 'json',

        success: function (data) {

            $('#usuario_id').val(data[0]['id'])
            $('.resetarSenha').attr('data-id', data[0]['id'])
            $('#nome_editar').val(data[0]['nome'])
            $('#telefone_editar').val(data[0]['telefone'])
            $('#email_editar').val(data[0]['email'])
            $('#login_editar').val(data[0]['login'])
            $('#tipo_usuario_id_editar').val(data[0]['tipo_usuario_id'])
            $('#unidade_id_editar').val(data[0]['unidade_id'])
            $('#data_inicio_editar').val(moment(data[0]['data_inicio']).format('YYYY-MM-DD'))
            $('#data_fim_editar').val(moment(data[0]['data_fim']).format('YYYY-MM-DD'))

        }
    })
})

$('.statusUsuario').on("click", function () {
    var url = $('table').attr('url');
    var id = $(this).attr('data-id');
    var status = $(this).attr('data-status');
    if (status == 1) {
        var title = 'Deseja realmente inativar esse usuário?'
        var text = 'O usuário não será mais capaz de logar no sistema!'
        var confirmButtonText = 'Sim, inativar!'
    } else {
        var title = 'Deseja realmente ativar esse usuário?'
        var text = 'O usuário passará a ter acesso ao sistema!'
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
                url: url + 'admin/usuarios/statusUsuario',
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

$('.resetarSenha').on("click", function () {
    var url = $('table').attr('url');
    var id = $(this).attr('data-id');

    Swal.fire({
        title: 'Deseja resetar a senha desse usuário?',
        text: 'A senha desse usuário será a senha padrão e deverá ser mudada em seu primeiro acesso!',
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: 'Sim, resetar!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: url + 'admin/usuarios/resetarSenha',
                data: { id: id },
                success: function (data) {

                    if (data == true) {
                        Swal.fire({
                            icon: "success",
                            title: "Sucesso!",
                            text: 'Senha resetada com sucesso!',

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