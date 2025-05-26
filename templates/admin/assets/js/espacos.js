$('.valorizarEspaco').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/espacos/valorizarEspaco',
        data: { id: id },
        dataType: 'json',

        success: function (data) {
            $('#espaco_id').val(data[0]['id'])
            $('#numero_sala_editar').val(data[0]['numero_sala'])
            $('#andar_editar').val(data[0]['andar'])
            $('#complemento_editar').val(data[0]['complemento'])
            $('#capacidade_editar').val(data[0]['capacidade'])
            $('#tipo_id_editar').val(data[0]['tipo_id'])

        }
    })
})

$('.statusEspaco').on("click", function () {
    var url = $('table').attr('url');
    var id = $(this).attr('data-id');
    var status = $(this).attr('data-status');
    if (status == 1) {
        var title = 'Deseja realmente inativar esse espaço?'
        var text = 'O espaço não poderá mais ser utilizada para dar aulas!'
        var confirmButtonText = 'Sim, inativar!'
    } else {
        var title = 'Deseja realmente ativar esse espaço?'
        var text = 'O espaço passará a aparecer como opção no cadastro de aulas!'
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
                url: url + 'admin/espacos/statusEspaco',
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