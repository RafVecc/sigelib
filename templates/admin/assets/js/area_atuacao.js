$('.valorizarAreaAtuacao').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/areaAtuacao/valorizarAreaAtuacao',
        data: { id: id },
        dataType: 'json',

        success: function (data) {
            
            $('#area_atuacao_id').val(data.area_atuacao[0].id)
            $('#area_atuacao_editar').val(data.area_atuacao[0].area_atuacao)

            var html_especializacao = ``;
            $.each(data.especializacao, function (key, value) {
                html_especializacao += `<div>
                                            <div class="row mb-2">
                                                <div class="col-md-5">
                                                <div class="mb-3">
                                                    <input type="hidden" name="especializacao_id[]" value="`+ value.id + `" class="form-control">
                                                    <input type="text" name="especializacao_editar[]" value="`+ value.especializacao + `" class="form-control">
                                                </div>
                                                </div>
                                                <div class="col-sm-1">
                                                    <button type="button" class="btn btn-xs btn-default remover_especializacao" value=""
                                                    title="Remover Especialização"><i class="fa fa-minus-circle" style="color: red"></i></button>
                                                </div>
                                            </div>
                                        </div>`;
            });

            $("#especializacao_existentes").children().remove()
            $("#especializacao_existentes").append(html_especializacao)
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

$('#ModalCadastrarAreaAtuacao, #ModalEditarAreaAtuacao').on('shown.bs.modal', function (e) {

    var title_first = "Deseja realmente remover essa especialização?"
    var title_second = "Removida!"
    var text_first = "Essa especialização será removida!"
    var text_second = "Especialização removida com sucesso."
    var icon_first = "warning"
    var icon_second = "success"

    $('#especializacao').on("click", '.remover_especializacao', function (event) {
        var elemento = this
        removerElementos(elemento, event, title_first, text_first, icon_first, title_second, text_second, icon_second)
    })

    $('.remover_especializacao').on("click", function (event) {
        var elemento = this
        removerElementos(elemento, event, title_first, text_first, icon_first, title_second, text_second, icon_second)
    })
})

function removerElementos(elemento, event, title_first, text_first, icon_first, title_second, text_second, icon_second) {
    Swal.fire({
        title: title_first,
        text: text_first,
        icon: icon_first,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, remover!"
    }).then((result) => {
        if (result.isConfirmed) {
            // console.log(ts.parentNode.parentNode.parentNode)
            $(elemento)[0].parentNode.parentNode.parentNode.remove();
            Swal.fire({
                title: title_second,
                text: text_second,
                icon: icon_second
            });
        }
    });
    event.preventDefault();
}