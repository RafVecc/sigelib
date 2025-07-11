$(document).ready(function () {

    if ($('.conteudo').find('#flag_notificacao').val() == 'true') {
        var url = $('#url').val();
        // var id = $(this).attr('data-id')

        $.ajax({
            type: 'POST',
            url: url + 'admin/checkNotificacao',
            // data: { id: id },
            dataType: 'json',

            success: function (data) {
                if (data == true) {

                    $.ajax({
                        type: 'POST',
                        url: url + 'admin/listaAtrasos',
                        // data: { id: id },
                        dataType: 'json',

                        success: function (result) {
                            if (result) {

                                var data_efetiva = moment(new Date()); //todays date
                                var html = '';

                                $.each(result, function (key, value) {
                                    var data_prevista = moment(value['data_prevista']);

                                    var dias = data_efetiva.diff(data_prevista, 'days');


                                    if (dias > 0) {
                                        var leitor = `<label for="leitor" class="form-label">Nome Leitor: ${value['nome_leitor']}</label>`;
                                        var livro = `<label for="livro" class="form-label">Título Livro: ${value['titulo_livro']}</label>`;
                                        var label_dias = `<label for="label_aviso_atraso" class="form-label text-danger">${dias} dias em atraso!</label>`;
                                        html += `${leitor} - ${livro} - ${label_dias}<br>`;
                                    } else {

                                    }

                                });

                                if (html == '') {
                                    Swal.fire({
                                        icon: "success",
                                        title: "Atrasos!",
                                        text: 'Não existem atrasos registrados até o momento!',

                                    })
                                } else {

                                    Swal.fire({
                                        title: 'Atrasos',
                                        icon: "warning",
                                        width: 1200,
                                        html: html,
                                        showCancelButton: true,
                                        confirmButtonColor: "#3085d6",
                                        cancelButtonColor: "#d33",
                                        confirmButtonText: "Ver Fichas",
                                        cancelButtonText: "Fechar"
                                    }).then((result2) => {
                                        if (result2.isConfirmed) {
                                            window.location.href = url + 'admin/consultas/listarAtrasos';
                                        }
                                    });
                                }
                            }
                        }
                    })
                }
            }
        })
    }
})