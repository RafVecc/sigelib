$('.valorizarCurso').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/cursos/valorizarCurso',
        data: { id: id },
        dataType: 'json',

        success: function (data) {
            $('#curso_id').val(data[0]['id'])
            $('#nome_editar').val(data[0]['nome'])
            $('#entidade_id_editar').val(data[0]['entidade_id'])
            $('#especializacao_id_editar').val(data[0]['especializacao_id'])
            // $('#professor_id_editar').val(data[0]['professor_id'])
            // $('#espaco_id_editar').val(data[0]['espaco_id'])
            $('#data_inicio_curso_editar').val(data[0]['data_inicio_curso'])
            $('#data_fim_curso_editar').val(data[0]['data_fim_curso'])
            $('#hora_inicio_editar').val(data[0]['hora_inicio'])
            $('#hora_fim_editar').val(data[0]['hora_fim'])
            $('#vagas_editar').val(data[0]['vagas'])
            $('#inicio_inscricao_editar').val(moment(data[0]['inicio_inscricao']).format('YYYY-MM-DD'))
            $('#fim_inscricao_editar').val(moment(data[0]['fim_inscricao']).format('YYYY-MM-DD'))
            $('#descricao_editar').val(data[0]['descricao'])

        }
    })
})

$('.valorizarAtividade').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/cursos/valorizarAtividade',
        data: { id: id },
        dataType: 'json',

        success: function (data) {
            $('#atividade_id').val(data[0]['id'])
            $('#professor_id_editar').val(data[0]['professor_id'])
            $('#espaco_id_editar').val(data[0]['espaco_id'])

        }
    })
})

$('.cancelarCurso').on("click", function () {
    var url = $('table').attr('url');
    var id = $(this).attr('data-id');

    Swal.fire({
        title: 'Cancelar Curso!',
        text: 'Tem certeza que deseja cancelar esse curso? Justifique o motivo!',
        input: 'textarea',
        inputPlaceholder: 'Motivo do cancelamento',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Fechar',
        confirmButtonText: 'Continuar',
        preConfirm: () => {
            var texto = document.getElementsByClassName("swal2-textarea");
            var valor = texto[0].value;
            if (valor.length != 0) {

            } else { Swal.showValidationMessage('Digite algo') }
        }
    }).then((result) => {
        //alert (result.value);
        if (result.value != null) {

            var text = result.value;
            $.ajax({
                type: "POST",
                dataType: "json",
                url: url + 'admin/cursos/cancelarCurso',
                data: { id: id, motivo: text },
                success: function (data) {

                    if (data == true) {
                        Swal.fire({
                            icon: "success",
                            title: "Sucesso!",
                            text: 'Curso cancelado com sucesso!',

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
    })


});



// $('.statusCurso').on("click", function () {
//     var url = $('table').attr('url');
//     var id = $(this).attr('data-id');
//     var status = $(this).attr('data-status');
//     if (status == 1) {
//         var title = 'Deseja realmente inativar esse curso?'
//         var text = 'O curso será encerrado até ser ativado novamente!'
//         var confirmButtonText = 'Sim, inativar!'
//     } else {
//         var title = 'Deseja realmente ativar esse curso?'
//         var text = 'A curso voltará a percorrer normalmente de acordo com as datas e horários!'
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
//                 url: url + 'admin/cursos/statusCurso',
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