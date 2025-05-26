function sameDay(d1, d2) {

    return d1.getFullYear() == d2.getFullYear() &&
        d1.getMonth() == d2.getMonth() &&
        d1.getDay() == d2.getDay();
}

$('.submitPesquisarVagas').on("click", function () {
    var url = $('table').attr('url');


    var inputs = $(".selecionarPessoa");
    var btnBuscar = '';
    var array_check = [];
    var array_idade = [];
    var array_idade_nao_enviados = [];
    var array_sexo = [];
    var array_pcd = [];
    var array_parentesco = [];

    if ($(this).attr('data-search')) {
        btnBuscar = true;
    }

    $.each(inputs, function (chave, valor) {
        if ($(valor).is(':checked') == true) {
            array_check.push($(valor).is(':checked'));
            array_idade.push($(valor).attr('data-idade'));
            array_sexo.push($(valor).attr('data-sexo'));
            array_pcd.push($(valor).attr('data-pcd'));
            array_parentesco.push($(valor).attr('data-parentesco'));
        } else {
            array_idade_nao_enviados.push($(valor).attr('data-idade'));
        }
    });

    $.ajax({
        type: 'POST',
        url: url + 'admin/vagasUnidade/checkPesquisaVaga',
        data: {
            btnBuscar: btnBuscar,
            array_idade: array_idade,
            array_idade_nao_enviados: array_idade_nao_enviados,
        },
        dataType: 'html',
        success: function (data) {
            if (data == 'false') {
                Swal.fire({
                    title: "As pessoas selecionadas não podem ser enviadas!",
                    text: "Não é possível deixar ou enviar crianças desacompanhadas!",
                    icon: "warning",
                    showCancelButton: false,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Ok!"
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload();
                    }
                });
            } else {
                $('#tabelaPesquisaPessoas').DataTable({
                    order: [[0, 'asc']],
                    lengthMenu: [
                        [10, 25, 50, 999999999],
                        [10, 25, 50, 'Todos']
                    ],
                    destroy: true,
                    processing: true,
                    serverSide: true,
                    ajax: {
                        url: url + 'admin/vagasUnidade/datatablePesquisarVaga',
                        type: 'POST',
                        data: {
                            btnBuscar: btnBuscar,
                            array_idade: array_idade,
                            array_idade_nao_enviados: array_idade_nao_enviados,
                            array_sexo: array_sexo,
                            array_pcd: array_pcd,
                            array_parentesco: array_parentesco
                        },
                        error: function (xhr, resp, text) {
                            console.log(xhr, resp, text);

                        },

                    },

                    columns: [
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ]
                });
            }
        }
    })



});

$('.selecionarPessoa').on("click", function () {
    if ($('.limpar').length > 0) {
        console.log('algo')
        var url = $('table').attr('url');

        $('#tabelaPesquisaPessoas').DataTable({
            order: [[0, 'asc']],
            lengthMenu: [
                [10, 25, 50, 999999999],
                [10, 25, 50, 'Todos']
            ],
            destroy: true,
            processing: true,
            serverSide: true,
            ajax: {
                url: url + 'admin/vagasUnidade/datatablePesquisarVaga',
                type: 'POST',
                data: {
                    btnBuscar: '',
                    array_idade: []

                },
                error: function (xhr, resp, text) {
                    console.log(xhr, resp, text);

                },

            },

            columns: [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
            ]
        });
    }
})


$('.negarSolicitacao').on("click", function (event) {
    event.preventDefault();
    var url = $('table').attr('url');
    var id = $(this).attr('data-id');

    Swal.fire({
        title: 'Negar Solicitação!',
        html: '<h4 class="swal2-title" id="swal2-title" style="display: block;">Tem certeza que deseja continuar? Justifique sua negativa!</h4>' +
            '<textarea id="swal2-textarea" placeholder="Justificativa de negativa" name="restricoes" class="swal2-textarea" style="width: 80%; display: flex;"></textarea>' +
            '<br><br>' +
            '<input type="file" name="documento_bo" id="documento_bo" class="form-control"></input>',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Continuar',
        preConfirm: () => {
            var texto = document.getElementsByClassName("swal2-textarea");
            var valor = texto[0].value;
            if (valor.length != 0) {
                //alert (id[0].value); mache nichts
            } else { Swal.showValidationMessage('Preencha os campos acima!') }
        },
        onBeforeOpen: () => {
            $("#documento_bo").change(function () {
                var reader = new FileReader();
                reader.readAsDataURL(this.files[0]);
            });
        }

    }).then((result) => {
        // console.log(result.isConfirmed)
        if (result.isConfirmed) {
            if ($('#swal2-textarea').val() != null) {
                var formData = new FormData();
                var file = $('#documento_bo')[0].files[0];
                var text = $('#swal2-textarea').val();
                formData.append("id", id);
                formData.append("justificativa", text);
                formData.append("documento", file);

                $.ajax({
                    method: "POST",
                    dataType: "json",
                    url: url + 'admin/solicitacaoAcolhimento/negarSolicitacao',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (data) {

                        if (data == true) {
                            Swal.fire({
                                icon: "success",
                                title: "Sucesso!",
                                text: 'Justificativa enviada com sucesso!',

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
        }
    })


});

$('.aceitarSolicitacao').on("click", function () {
    var url = $('table').attr('url');

    var id = $(this).attr('data-id');

    Swal.fire({
        title: "Deseja realmente aceitar este acolhimento?",
        text: "Você não será capaz de reverter isso!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, encerrar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: url + 'admin/solicitacaoAcolhimento/aceitarSolicitacao',
                data: { id: id },
                success: function (data) {

                    if (data == true) {
                        Swal.fire({
                            icon: "success",
                            title: "Sucesso!",
                            text: 'Acolhimento realizado com sucesso!',

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

});

$('.recusarAcolhimento').on("click", function () {
    var url = $('table').attr('url');
    var id = $(this).attr('data-id');

    Swal.fire({
        title: 'Recusar Acolhimento!',
        text: 'Tem certeza que deseja continuar? Justifique sua negativa!',
        input: 'textarea',
        inputPlaceholder: 'Justificativa de negativa',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Continuar',
        preConfirm: () => {
            var texto = document.getElementsByClassName("swal2-textarea");
            var valor = texto[0].value;
            if (valor.length != 0) {
                //alert (id[0].value); mache nichts
            } else { Swal.showValidationMessage('Digite algo') }
        }
    }).then((result) => {
        //alert (result.value);
        if (result.value != null) {

            var text = result.value;
            $.ajax({
                type: "POST",
                dataType: "json",
                url: url + 'admin/acolhimento/recusarAcolhimento',
                data: { id: id, justificativa: text },
                success: function (data) {

                    if (data == true) {
                        Swal.fire({
                            icon: "success",
                            title: "Sucesso!",
                            text: 'Justificativa enviada com sucesso!',

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

$('.cancelarDisparo').on("click", function () {
    var url = $('table').attr('url');
    var id = $(this).attr('data-id');

    Swal.fire({
        title: 'Cancelar Solicitação!',
        text: 'Tem certeza que deseja continuar? Justifique seu cancelamento!',
        input: 'textarea',
        inputPlaceholder: 'Justificativa de cancelamento',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Continuar',
        preConfirm: () => {
            var texto = document.getElementsByClassName("swal2-textarea");
            var valor = texto[0].value;
            if (valor.length != 0) {
                //alert (id[0].value); mache nichts
            } else { Swal.showValidationMessage('Digite algo') }
        }
    }).then((result) => {
        //alert (result.value);
        if (result.value != null) {

            var text = result.value;
            $.ajax({
                type: "POST",
                dataType: "json",
                url: url + 'admin/solicitacaoAcolhimento/cancelarSolicitacao',
                data: { id: id, justificativa: text },
                success: function (data) {

                    if (data == true) {
                        Swal.fire({
                            icon: "success",
                            title: "Sucesso!",
                            text: 'Justificativa enviada com sucesso!',

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

// CADASTRO DE RELATO SOCIAL

$('#cadastrarRelatoSocial').on("submit", function (event) {
    var url = $('#url').val();

    var acolhimento_id = $('#acolhimento_id').val();
    var pessoa_id = $('#pessoa_id').val();
    var relato_social = CKEDITOR.instances["relato_social"].getData();
    var principais_demandas = $('#principais_demandas').val();
    event.preventDefault();
    if (relato_social.length == 0) {
        Swal.fire({
            icon: "warning",
            title: "Relato Vazio!",
            text: 'O Campo de Descrição do Relato deve estar Preenchido!',

        })
    } else {

        Swal.fire({
            title: "Deseja realmente enviar este relato?",
            text: "Você apenas poderá editar esse relato no mesmo dia em que foi criado!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, enviar!"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: url + 'admin/prontuario/cadastrarRelatoSocial',
                    data: {
                        acolhimento_id: acolhimento_id,
                        pessoa_id: pessoa_id,
                        relato_social: relato_social,
                        principais_demandas: principais_demandas,
                    },
                    success: function (data) {

                        if (data == true) {
                            Swal.fire({
                                icon: "success",
                                title: "Sucesso!",
                                text: 'Relato salvo com sucesso!',

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
    }

});

$('#editarRelatoSocial').on("submit", function (event) {
    var url = $('#url').val();

    event.preventDefault();
    var relato_social_id = $('#relato_social_id').val();
    var relato_social_editar = CKEDITOR.instances["relato_social_editar"].getData();
    var principais_demandas_editar = $('#principais_demandas_editar').val();
    var cadastrado_em = new Date($('#cadastrado_em_editar').val());
    var dataHoje = new Date();

    if (sameDay(cadastrado_em, dataHoje)) {
        if (relato_social_editar.length == 0) {
            Swal.fire({
                icon: "warning",
                title: "Relato Vazio!",
                text: 'O Campo de Descrição do Relato deve estar Preenchido!',

            })
        } else {

            Swal.fire({
                title: "Deseja realmente editar este relato?",
                text: "Você tem até o final do dia para realizar as modificações necessárias!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sim, editar!"
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: url + 'admin/prontuario/editarRelatoSocial',
                        data: {
                            relato_social_id: relato_social_id,
                            relato_social_editar: relato_social_editar,
                            principais_demandas_editar: principais_demandas_editar,
                        },
                        success: function (data) {

                            if (data == true) {
                                Swal.fire({
                                    icon: "success",
                                    title: "Sucesso!",
                                    text: 'Relato salvo com sucesso!',

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
        }
    } else {
        Swal.fire({
            icon: "error",
            title: "Período de Edição Esgotado!",
            text: 'Não é possível editar relatos de dias anteriores, crie um novo relato se necessário!',

        }).then(() => {
            location.reload();
        })
    }


});

// CADASTRAR/EDITAR DE RELATO PSICOLOGICO

$('#cadastrarRelatoPsicologico, #editarRelatoPsicologico').on("submit", function (event) {
    var url = $('#url').val();
    var formulario = $(this).attr('id')
    var acolhimento_id = $('#acolhimento_id').val();
    var pessoa_id = $('#pessoa_id').val();
    var dataHoje = new Date();
    if (formulario == 'cadastrarRelatoPsicologico') {
        var id_relato_psicologico = '';
        var cadastrado_em = new Date();
        var titulo_relato_psicologico = $('#titulo_relato_psicologico').val();
        var fk_id_tipo_comportamento = $('#fk_id_tipo_comportamento').val();
        var relato_psicologico = CKEDITOR.instances["relato_psicologico"].getData();
        var desenvolvimento_grupo = CKEDITOR.instances["desenvolvimento_grupo"].getData();

        var id_estudo_psicologico = $('.id_estudo_psicologico').map(function () {
            return this.value;
        }).get();
        var fk_id_fator = $('.fk_id_fator').map(function () {
            return this.value;
        }).get();
        var condicoes_percebidas = $('.condicoes_percebidas').map(function () {
            return this.value;
        }).get();
        var acoes_desenvolvidas = $('.acoes_desenvolvidas').map(function () {
            return this.value;
        }).get();
        var id_avaliacao_processual = $('.id_avaliacao_processual').map(function () {
            return this.value;
        }).get();
        var fk_id_tipo_avaliacao_processual = $('.fk_id_tipo_avaliacao_processual').map(function () {
            return this.value;
        }).get();
        var descricao_avaliacao_processual = $('.descricao_avaliacao_processual').map(function () {
            return this.value;
        }).get();
    } else if (formulario == 'editarRelatoPsicologico') {
        var id_relato_psicologico = $('#id_relato_psicologico_editar').val();
        var cadastrado_em = new Date($('#cadastrado_em_editar').val());
        var titulo_relato_psicologico = $('#titulo_relato_psicologico_editar').val();
        var fk_id_tipo_comportamento = $('#fk_id_tipo_comportamento_editar').val();
        var relato_psicologico = CKEDITOR.instances["relato_psicologico_editar"].getData();
        var desenvolvimento_grupo = CKEDITOR.instances["desenvolvimento_grupo_editar"].getData();

        var id_estudo_psicologico = $('.id_estudo_psicologico_editar').map(function () {
            return this.value;
        }).get();
        var fk_id_fator = $('.fk_id_fator_editar').map(function () {
            return this.value;
        }).get();
        var condicoes_percebidas = $('.condicoes_percebidas_editar').map(function () {
            return this.value;
        }).get();
        var acoes_desenvolvidas = $('.acoes_desenvolvidas_editar').map(function () {
            return this.value;
        }).get();
        var id_avaliacao_processual = $('.id_avaliacao_processual_editar').map(function () {
            return this.value;
        }).get();
        var fk_id_tipo_avaliacao_processual = $('.fk_id_tipo_avaliacao_processual_editar').map(function () {
            return this.value;
        }).get();
        var descricao_avaliacao_processual = $('.descricao_avaliacao_processual_editar').map(function () {
            return this.value;
        }).get();
    } else {
        location.reload();
    }

    event.preventDefault();
    if (sameDay(cadastrado_em, dataHoje)) {
        if (relato_psicologico.length == 0 || desenvolvimento_grupo.length == 0) {
            Swal.fire({
                icon: "warning",
                title: "Relato Vazio!",
                text: 'O Campo de Descrição do Relato deve estar Preenchido!',

            })
        } else {

            Swal.fire({
                title: "Deseja realmente enviar este relato?",
                text: "Você apenas poderá editar esse relato no mesmo dia em que foi criado!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sim, enviar!"
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: url + 'admin/prontuario/cadastrarRelatoPsicologico',
                        data: {
                            acolhimento_id: acolhimento_id,
                            pessoa_id: pessoa_id,
                            id: id_relato_psicologico,
                            titulo_relato_psicologico: titulo_relato_psicologico,
                            fk_id_tipo_comportamento: fk_id_tipo_comportamento,
                            relato_psicologico: relato_psicologico,
                            desenvolvimento_grupo: desenvolvimento_grupo,
                            id_estudo_psicologico: id_estudo_psicologico,
                            fk_id_fator: fk_id_fator,
                            condicoes_percebidas: condicoes_percebidas,
                            acoes_desenvolvidas: acoes_desenvolvidas,
                            id_avaliacao_processual: id_avaliacao_processual,
                            fk_id_tipo_avaliacao_processual: fk_id_tipo_avaliacao_processual,
                            descricao_avaliacao_processual: descricao_avaliacao_processual,
                        },
                        success: function (data) {

                            if (data == true) {
                                Swal.fire({
                                    icon: "success",
                                    title: "Sucesso!",
                                    text: 'Relato salvo com sucesso!',

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
        }
    } else {
        Swal.fire({
            icon: "error",
            title: "Período de Edição Esgotado!",
            text: 'Não é possível editar relatos de dias anteriores, crie um novo relato se necessário!',

        }).then(() => {
            location.reload();
        })
    }

});

// CADASTRO DE RELATO PEDAGOGICO

$('#cadastrarRelatoPedagogico').on("submit", function (event) {
    var url = $('#url').val();

    var acolhimento_id = $('#acolhimento_id').val();
    var pessoa_id = $('#pessoa_id').val();
    var relato_pedagogico = CKEDITOR.instances["relato_pedagogico"].getData();
    var titulo_relato_pedagogico = $('#titulo_relato_pedagogico').val();
    event.preventDefault();
    if (relato_pedagogico.length == 0) {
        Swal.fire({
            icon: "warning",
            title: "Relato Vazio!",
            text: 'O Campo de Descrição do Relato deve estar Preenchido!',

        })
    } else {

        Swal.fire({
            title: "Deseja realmente enviar este relato?",
            text: "Você apenas poderá editar esse relato no mesmo dia em que foi criado!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, enviar!"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: url + 'admin/prontuario/cadastrarRelatoPedagogico',
                    data: {
                        acolhimento_id: acolhimento_id,
                        pessoa_id: pessoa_id,
                        relato_pedagogico: relato_pedagogico,
                        titulo_relato_pedagogico: titulo_relato_pedagogico,
                    },
                    success: function (data) {

                        if (data == true) {
                            Swal.fire({
                                icon: "success",
                                title: "Sucesso!",
                                text: 'Relato salvo com sucesso!',

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
    }

});

$('#editarRelatoPedagogico').on("submit", function (event) {
    var url = $('#url').val();

    event.preventDefault();
    var relato_pedagogico_id = $('#relato_pedagogico_id').val();
    var relato_pedagogico_editar = CKEDITOR.instances["relato_pedagogico_editar"].getData();
    var titulo_relato_pedagogico_editar = $('#titulo_relato_pedagogico_editar').val();
    var cadastrado_em = new Date($('#cadastrado_em_editar').val());
    var dataHoje = new Date();

    if (sameDay(cadastrado_em, dataHoje)) {
        if (relato_pedagogico_editar.length == 0) {
            Swal.fire({
                icon: "warning",
                title: "Relato Vazio!",
                text: 'O Campo de Descrição do Relato deve estar Preenchido!',

            })
        } else {

            Swal.fire({
                title: "Deseja realmente editar este relato?",
                text: "Você tem até o final do dia para realizar as modificações necessárias!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sim, editar!"
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: url + 'admin/prontuario/editarRelatoPedagogico',
                        data: {
                            relato_pedagogico_id: relato_pedagogico_id,
                            relato_pedagogico_editar: relato_pedagogico_editar,
                            titulo_relato_pedagogico_editar: titulo_relato_pedagogico_editar,
                        },
                        success: function (data) {

                            if (data == true) {
                                Swal.fire({
                                    icon: "success",
                                    title: "Sucesso!",
                                    text: 'Relato salvo com sucesso!',

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
        }
    } else {
        Swal.fire({
            icon: "error",
            title: "Período de Edição Esgotado!",
            text: 'Não é possível editar relatos de dias anteriores, crie um novo relato se necessário!',

        }).then(() => {
            location.reload();
        })
    }


});

// CADASTRO DE RELATO PEDAGOGICO

$('#cadastrarRelatoSaude').on("submit", function (event) {
    var url = $('#url').val();

    var acolhimento_id = $('#acolhimento_id').val();
    var pessoa_id = $('#pessoa_id').val();
    var relato_saude = CKEDITOR.instances["relato_saude"].getData();
    var titulo_relato_saude = $('#titulo_relato_saude').val();
    event.preventDefault();
    if (relato_saude.length == 0) {
        Swal.fire({
            icon: "warning",
            title: "Relato Vazio!",
            text: 'O Campo de Descrição do Relato deve estar Preenchido!',

        })
    } else {

        Swal.fire({
            title: "Deseja realmente enviar este relato?",
            text: "Você apenas poderá editar esse relato no mesmo dia em que foi criado!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, enviar!"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: url + 'admin/prontuario/cadastrarRelatoSaude',
                    data: {
                        acolhimento_id: acolhimento_id,
                        pessoa_id: pessoa_id,
                        relato_saude: relato_saude,
                        titulo_relato_saude: titulo_relato_saude,
                    },
                    success: function (data) {

                        if (data == true) {
                            Swal.fire({
                                icon: "success",
                                title: "Sucesso!",
                                text: 'Relato salvo com sucesso!',

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
    }

});

$('#editarRelatoSaude').on("submit", function (event) {
    var url = $('#url').val();

    event.preventDefault();
    var relato_saude_id = $('#relato_saude_id').val();
    var relato_saude_editar = CKEDITOR.instances["relato_saude_editar"].getData();
    var titulo_relato_saude_editar = $('#titulo_relato_saude_editar').val();
    var cadastrado_em = new Date($('#cadastrado_em_editar').val());
    var dataHoje = new Date();

    if (sameDay(cadastrado_em, dataHoje)) {
        if (relato_saude_editar.length == 0) {
            Swal.fire({
                icon: "warning",
                title: "Relato Vazio!",
                text: 'O Campo de Descrição do Relato deve estar Preenchido!',

            })
        } else {

            Swal.fire({
                title: "Deseja realmente editar este relato?",
                text: "Você tem até o final do dia para realizar as modificações necessárias!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sim, editar!"
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: url + 'admin/prontuario/editarRelatoSaude',
                        data: {
                            relato_saude_id: relato_saude_id,
                            relato_saude_editar: relato_saude_editar,
                            titulo_relato_saude_editar: titulo_relato_saude_editar,
                        },
                        success: function (data) {

                            if (data == true) {
                                Swal.fire({
                                    icon: "success",
                                    title: "Sucesso!",
                                    text: 'Relato salvo com sucesso!',

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
        }
    } else {
        Swal.fire({
            icon: "error",
            title: "Período de Edição Esgotado!",
            text: 'Não é possível editar relatos de dias anteriores, crie um novo relato se necessário!',

        }).then(() => {
            location.reload();
        })
    }


});

// CADASTRO DE ESTRATEGIAS E AÇÕES SOCIAIS

$('#cadastrarEstrategiaAcaoSocial').on("submit", function (event) {
    var url = $('#url').val();

    var acolhimento_id = $('#acolhimento_id').val();
    var pessoa_id = $('#pessoa_id').val();
    var data_atendimento_planejamento_social = $('#data_atendimento_planejamento_social').val();
    var fk_id_tipo_acao_social = $('#fk_id_tipo_acao_social').val();
    var descricao_social = $('#descricao_social').val();
    var fk_id_tipo_avaliacao_social = $('#fk_id_tipo_avaliacao_social').val();
    var descricao_avaliacao_social = $('#descricao_avaliacao_social').val();
    event.preventDefault();


    Swal.fire({
        title: "Deseja realmente cadastrar essa ação/estratégia?",
        text: "Você poderá editar esse registro apenas no mesmo dia do cadastro, mas poderá avalia-lo futuramente conforme necessário!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, cadastrar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: url + 'admin/prontuario/cadastrarEstrategiaAcaoSocial',
                data: {
                    acolhimento_id: acolhimento_id,
                    pessoa_id: pessoa_id,
                    data_atendimento_planejamento_social: data_atendimento_planejamento_social,
                    fk_id_tipo_acao_social: fk_id_tipo_acao_social,
                    descricao_social: descricao_social,
                    fk_id_tipo_avaliacao_social: fk_id_tipo_avaliacao_social,
                    descricao_avaliacao_social: descricao_avaliacao_social,
                },
                success: function (data) {

                    if (data == true) {
                        Swal.fire({
                            icon: "success",
                            title: "Sucesso!",
                            text: 'Registro salvo com sucesso!',

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


});

// CADASTRO DE ESTRATEGIAS E AÇÕES PSICOLOGICA

$('#cadastrarEstrategiaAcaoPsicologica').on("submit", function (event) {
    var url = $('#url').val();

    var acolhimento_id = $('#acolhimento_id').val();
    var pessoa_id = $('#pessoa_id').val();
    var data_atendimento_planejamento_psicologica = $('#data_atendimento_planejamento_psicologica').val();
    var fk_id_tipo_acao_psicologica = $('#fk_id_tipo_acao_psicologica').val();
    var descricao_psicologica = $('#descricao_psicologica').val();
    var fk_id_tipo_avaliacao_psicologica = $('#fk_id_tipo_avaliacao_psicologica').val();
    var descricao_avaliacao_psicologica = $('#descricao_avaliacao_psicologica').val();

    event.preventDefault();

    Swal.fire({
        title: "Deseja realmente cadastrar essa ação/estratégia?",
        text: "Você poderá editar esse registro apenas no mesmo dia do cadastro, mas poderá avalia-lo futuramente conforme necessário!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, cadastrar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: url + 'admin/prontuario/cadastrarEstrategiaAcaoPsicologica',
                data: {
                    acolhimento_id: acolhimento_id,
                    pessoa_id: pessoa_id,
                    data_atendimento_planejamento_psicologica: data_atendimento_planejamento_psicologica,
                    fk_id_tipo_acao_psicologica: fk_id_tipo_acao_psicologica,
                    descricao_psicologica: descricao_psicologica,
                    fk_id_tipo_avaliacao_psicologica: fk_id_tipo_avaliacao_psicologica,
                    descricao_avaliacao_psicologica: descricao_avaliacao_psicologica,
                },
                success: function (data) {

                    if (data == true) {
                        Swal.fire({
                            icon: "success",
                            title: "Sucesso!",
                            text: 'Registro salvo com sucesso!',

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


});

// CADASTRO DE ESTRATEGIAS E AÇÕES PEDAGÓGICA

$('#cadastrarEstrategiaAcaoPedagogica').on("submit", function (event) {
    var url = $('#url').val();

    var acolhimento_id = $('#acolhimento_id').val();
    var pessoa_id = $('#pessoa_id').val();
    var data_atendimento_planejamento_pedagogica = $('#data_atendimento_planejamento_pedagogica').val();
    var fk_id_tipo_acao_pedagogica = $('#fk_id_tipo_acao_pedagogica').val();
    var descricao_pedagogica = $('#descricao_pedagogica').val();
    var fk_id_tipo_avaliacao_pedagogica = $('#fk_id_tipo_avaliacao_pedagogica').val();
    var descricao_avaliacao_pedagogica = $('#descricao_avaliacao_pedagogica').val();

    event.preventDefault();

    Swal.fire({
        title: "Deseja realmente cadastrar essa ação/estratégia?",
        text: "Você poderá editar esse registro apenas no mesmo dia do cadastro, mas poderá avalia-lo futuramente conforme necessário!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, cadastrar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: url + 'admin/prontuario/cadastrarEstrategiaAcaoPedagogica',
                data: {
                    acolhimento_id: acolhimento_id,
                    pessoa_id: pessoa_id,
                    data_atendimento_planejamento_pedagogica: data_atendimento_planejamento_pedagogica,
                    fk_id_tipo_acao_pedagogica: fk_id_tipo_acao_pedagogica,
                    descricao_pedagogica: descricao_pedagogica,
                    fk_id_tipo_avaliacao_pedagogica: fk_id_tipo_avaliacao_pedagogica,
                    descricao_avaliacao_pedagogica: descricao_avaliacao_pedagogica,
                },
                success: function (data) {

                    if (data == true) {
                        Swal.fire({
                            icon: "success",
                            title: "Sucesso!",
                            text: 'Registro salvo com sucesso!',

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


});

// CADASTRO DE ESTRATEGIAS E AÇÕES SAÚDE

$('#cadastrarEstrategiaAcaoSaude').on("submit", function (event) {
    var url = $('#url').val();

    var acolhimento_id = $('#acolhimento_id').val();
    var pessoa_id = $('#pessoa_id').val();
    var data_atendimento_planejamento_saude = $('#data_atendimento_planejamento_saude').val();
    var fk_id_tipo_acao_saude = $('#fk_id_tipo_acao_saude').val();
    var descricao_saude = $('#descricao_saude').val();
    var fk_id_tipo_avaliacao_saude = $('#fk_id_tipo_avaliacao_saude').val();
    var descricao_avaliacao_saude = $('#descricao_avaliacao_saude').val();

    event.preventDefault();

    Swal.fire({
        title: "Deseja realmente cadastrar essa ação/estratégia?",
        text: "Você poderá editar esse registro apenas no mesmo dia do cadastro, mas poderá avalia-lo futuramente conforme necessário!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, cadastrar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: url + 'admin/prontuario/cadastrarEstrategiaAcaoSaude',
                data: {
                    acolhimento_id: acolhimento_id,
                    pessoa_id: pessoa_id,
                    data_atendimento_planejamento_saude: data_atendimento_planejamento_saude,
                    fk_id_tipo_acao_saude: fk_id_tipo_acao_saude,
                    descricao_saude: descricao_saude,
                    fk_id_tipo_avaliacao_saude: fk_id_tipo_avaliacao_saude,
                    descricao_avaliacao_saude: descricao_avaliacao_saude,
                },
                success: function (data) {

                    if (data == true) {
                        Swal.fire({
                            icon: "success",
                            title: "Sucesso!",
                            text: 'Registro salvo com sucesso!',

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


});

// CADASTRO DE AVALIAÇÕES SOCIAIS

$('.cadastrarAvaliacaoSocial').on("click", function (event) {
    $('#fk_id_estrategias_relato_social').val($(this).attr('data-id'));
})

$('#cadastrarAvaliacaoSocial').on("submit", function (event) {
    var url = $('#url').val();

    var acolhimento_id = $('#acolhimento_id').val();
    var fk_id_estrategias_relato_social = $('#fk_id_estrategias_relato_social').val();
    var fk_id_tipo_avaliacao_social = $('#fk_id_tipo_avaliacao_social_novo').val();
    var descricao_avaliacao_social = $('#descricao_avaliacao_social_novo').val();

    event.preventDefault();


    Swal.fire({
        title: "Deseja Realmente Cadastrar essa Avaliação?",
        text: "Caso o status da avaliação seja completa, essa ação/estratégia será finalizada!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, cadastrar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: url + 'admin/prontuario/cadastrarAvaliacaoSocial',
                data: {
                    acolhimento_id: acolhimento_id,
                    fk_id_estrategias_relato_social: fk_id_estrategias_relato_social,
                    fk_id_tipo_avaliacao_social: fk_id_tipo_avaliacao_social,
                    descricao_avaliacao_social: descricao_avaliacao_social,
                },
                success: function (data) {

                    if (data == true) {
                        Swal.fire({
                            icon: "success",
                            title: "Sucesso!",
                            text: 'Avaliação salva com sucesso!',

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


});

// CADASTRO DE AVALIAÇÕES PSICOLÓGICAS

$('.cadastrarAvaliacaoPsicologica').on("click", function (event) {
    $('#fk_id_estrategias_relato_psicologico').val($(this).attr('data-id'));
})

$('#cadastrarAvaliacaoPsicologica').on("submit", function (event) {
    var url = $('#url').val();

    var acolhimento_id = $('#acolhimento_id').val();
    var fk_id_estrategias_relato_psicologico = $('#fk_id_estrategias_relato_psicologico').val();
    var fk_id_tipo_avaliacao_psicologica = $('#fk_id_tipo_avaliacao_psicologica_novo').val();
    var descricao_avaliacao_psicologica = $('#descricao_avaliacao_psicologica_novo').val();

    event.preventDefault();


    Swal.fire({
        title: "Deseja Realmente Cadastrar essa Avaliação?",
        text: "Caso o status da avaliação seja completa, essa ação/estratégia será finalizada!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, cadastrar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: url + 'admin/prontuario/cadastrarAvaliacaoPsicologica',
                data: {
                    acolhimento_id: acolhimento_id,
                    fk_id_estrategias_relato_psicologico: fk_id_estrategias_relato_psicologico,
                    fk_id_tipo_avaliacao_psicologica: fk_id_tipo_avaliacao_psicologica,
                    descricao_avaliacao_psicologica: descricao_avaliacao_psicologica,
                },
                success: function (data) {

                    if (data == true) {
                        Swal.fire({
                            icon: "success",
                            title: "Sucesso!",
                            text: 'Avaliação salva com sucesso!',

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


});

// CADASTRO DE AVALIAÇÕES PEDAGÓGICAS

$('.cadastrarAvaliacaoPedagogica').on("click", function (event) {
    $('#fk_id_estrategias_relato_pedagogico').val($(this).attr('data-id'));
})

$('#cadastrarAvaliacaoPedagogica').on("submit", function (event) {
    var url = $('#url').val();

    var acolhimento_id = $('#acolhimento_id').val();
    var fk_id_estrategias_relato_pedagogico = $('#fk_id_estrategias_relato_pedagogico').val();
    var fk_id_tipo_avaliacao_pedagogica = $('#fk_id_tipo_avaliacao_pedagogica_novo').val();
    var descricao_avaliacao_pedagogica = $('#descricao_avaliacao_pedagogica_novo').val();

    event.preventDefault();


    Swal.fire({
        title: "Deseja Realmente Cadastrar essa Avaliação?",
        text: "Caso o status da avaliação seja completa, essa ação/estratégia será finalizada!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, cadastrar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: url + 'admin/prontuario/cadastrarAvaliacaoPedagogica',
                data: {
                    acolhimento_id: acolhimento_id,
                    fk_id_estrategias_relato_pedagogico: fk_id_estrategias_relato_pedagogico,
                    fk_id_tipo_avaliacao_pedagogica: fk_id_tipo_avaliacao_pedagogica,
                    descricao_avaliacao_pedagogica: descricao_avaliacao_pedagogica,
                },
                success: function (data) {

                    if (data == true) {
                        Swal.fire({
                            icon: "success",
                            title: "Sucesso!",
                            text: 'Avaliação salva com sucesso!',

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


});

// CADASTRO DE AVALIAÇÕES SAÚDE

$('.cadastrarAvaliacaoSaude').on("click", function (event) {
    $('#fk_id_estrategias_relato_saude').val($(this).attr('data-id'));
})

$('#cadastrarAvaliacaoSaude').on("submit", function (event) {
    var url = $('#url').val();

    var acolhimento_id = $('#acolhimento_id').val();
    var fk_id_estrategias_relato_saude = $('#fk_id_estrategias_relato_saude').val();
    var fk_id_tipo_avaliacao_saude = $('#fk_id_tipo_avaliacao_saude_novo').val();
    var descricao_avaliacao_saude = $('#descricao_avaliacao_saude_novo').val();

    event.preventDefault();


    Swal.fire({
        title: "Deseja Realmente Cadastrar essa Avaliação?",
        text: "Caso o status da avaliação seja completa, essa ação/estratégia será finalizada!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, cadastrar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: url + 'admin/prontuario/cadastrarAvaliacaoSaude',
                data: {
                    acolhimento_id: acolhimento_id,
                    fk_id_estrategias_relato_saude: fk_id_estrategias_relato_saude,
                    fk_id_tipo_avaliacao_saude: fk_id_tipo_avaliacao_saude,
                    descricao_avaliacao_saude: descricao_avaliacao_saude,
                },
                success: function (data) {

                    if (data == true) {
                        Swal.fire({
                            icon: "success",
                            title: "Sucesso!",
                            text: 'Avaliação salva com sucesso!',

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


});

$('.descricaoRelatoSocial').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')
    $.ajax({
        type: "POST",
        dataType: "html",
        url: url + 'admin/prontuario/descricaoRelatoSocial',
        data: { id: id },
        success: function (data) {
            $('.descricao_relato_social').children().remove();
            $('.descricao_relato_social').append(data)
        }
    })
})

$('.descricaoRelatoPedagogico').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')
    $.ajax({
        type: "POST",
        dataType: "html",
        url: url + 'admin/prontuario/descricaoRelatoPedagogico',
        data: { id: id },
        success: function (data) {
            $('.descricao_relato_pedagogico').children().remove();
            $('.descricao_relato_pedagogico').append(data)
        }
    })
})

$('.descricaoRelatoSaude').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')
    $.ajax({
        type: "POST",
        dataType: "html",
        url: url + 'admin/prontuario/descricaoRelatoSaude',
        data: { id: id },
        success: function (data) {
            $('.descricao_relato_saude').children().remove();
            $('.descricao_relato_saude').append(data)
        }
    })
})

$('.descricaoRelatoPsicologico').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')
    $.ajax({
        type: "POST",
        dataType: "json",
        url: url + 'admin/prontuario/descricaoRelatoPsicologico',
        data: { id: id },
        success: function (data) {
            var dados = JSON.parse(data.relato);
            var html_estudo_psicologico = ``;
            var html_avaliacao_processual = ``;
            $('#titulo_relato_psicologico_descricao').val(dados[0][0].titulo_relato_psicologico);
            $('.relato_psicologico').children().remove();
            $('.relato_psicologico').append(dados[0][0].relato_psicologico);

            $('.desenvolvimento_grupo').children().remove();
            $('.desenvolvimento_grupo').append(dados[0][0].desenvolvimento_grupo)

            $.each(dados[1], function (key, value) {
                html_estudo_psicologico += `<tr>
                                                <td colspan="1" scope="col">`+ moment(value.cadastrado_em).format('DD/MM/YYYY hh:mm') + `</td>
                                                <td colspan="1" scope="col">`+ value.fatores + `</td>
                                                <td colspan="1" scope="col">`+ value.condicoes_percebidas + `</td>
                                                <td colspan="1" scope="col">`+ value.acoes_desenvolvidas + `</td>
                                            </tr>`;
            })
            $.each(dados[2], function (key, value) {
                html_avaliacao_processual += `<tr>
                                                <td colspan="1" scope="col">`+ moment(value.cadastrado_em).format('DD/MM/YYYY hh:mm') + `</td>
                                                <td colspan="1" scope="col">`+ value.tipo_avaliacao_processual + `</td>
                                                <td colspan="1" scope="col">`+ value.descricao_avaliacao_processual + `</td>
                                            </tr>`;
            })
            $('.tbody_estudo_psicologico').children().remove();
            $('.tbody_estudo_psicologico').append(html_estudo_psicologico)

            $('.tbody_avaliacao_processual').children().remove();
            $('.tbody_avaliacao_processual').append(html_avaliacao_processual)
        }
    })
})

//VALORIZAR RELATO SOCIAL

$('.valorizarRelatoSocial').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/prontuario/valorizarRelatoSocial',
        data: { id: id },
        dataType: 'json',

        success: function (data) {
            console.log(data)
            console.log(data[0].relato_social)
            $('#relato_social_id').val(data[0]['id'])
            $('#principais_demandas_editar').val(data[0]['principais_demandas'])
            $('#cadastrado_em_editar').val(data[0]['cadastrado_em'])
            // CKEDITOR.instances.relato_social.setData('algo')
            if (CKEDITOR.instances['relato_social_editar']) {
                CKEDITOR.instances['relato_social_editar'].destroy();
            }
            CKEDITOR.replace('relato_social_editar')
            CKEDITOR.instances['relato_social_editar'].setData(data[0]['relato_social']);

        }
    })
})

//VALORIZAR RELATO PEDAGOGICO

$('.valorizarRelatoPedagogico').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/prontuario/valorizarRelatoPedagogico',
        data: { id: id },
        dataType: 'json',

        success: function (data) {

            $('#relato_pedagogico_id').val(data[0]['id'])
            $('#titulo_relato_pedagogico_editar').val(data[0]['titulo_relato_pedagogico'])
            $('#cadastrado_em_editar').val(data[0]['cadastrado_em'])
            // CKEDITOR.instances.relato_pedagogico.setData('algo')
            if (CKEDITOR.instances['relato_pedagogico_editar']) {
                CKEDITOR.instances['relato_pedagogico_editar'].destroy();
            }
            CKEDITOR.replace('relato_pedagogico_editar')
            CKEDITOR.instances['relato_pedagogico_editar'].setData(data[0]['relato_pedagogico']);

        }
    })
})


//VALORIZAR RELATO SAÚDE

$('.valorizarRelatoSaude').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/prontuario/valorizarRelatoSaude',
        data: { id: id },
        dataType: 'json',

        success: function (data) {

            $('#relato_saude_id').val(data[0]['id'])
            $('#titulo_relato_saude_editar').val(data[0]['titulo_relato_saude'])
            $('#cadastrado_em_editar').val(data[0]['cadastrado_em'])
            // CKEDITOR.instances.relato_saude.setData('algo')
            if (CKEDITOR.instances['relato_saude_editar']) {
                CKEDITOR.instances['relato_saude_editar'].destroy();
            }
            CKEDITOR.replace('relato_saude_editar')
            CKEDITOR.instances['relato_saude_editar'].setData(data[0]['relato_saude']);

        }
    })
})

//VALORIZAR ESTRATÉGIAS E AÇÕES SOCIAIS

$('.valorizarEstrategiaAcaoSocial').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/prontuario/valorizarEstrategiaAcaoSocial',
        data: { id: id },
        dataType: 'json',

        success: function (data) {

            $('#estrategia_acao_social_id').val(data[0]['id'])
            $('#data_atendimento_planejamento_social_editar').val(data[0]['data_atendimento_planejamento_social'])
            $('#fk_id_tipo_acao_social_editar').val(data[0]['fk_id_tipo_acao_social'])
            $('#descricao_social_editar').val(data[0]['descricao_social'])
            $('#cadastrado_em').val(data[0]['cadastrado_em'])

        }
    })
})

//VALORIZAR ESTRATÉGIAS E AÇÕES PSICOLÓGICAS

$('.valorizarEstrategiaAcaoPsicologica').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/prontuario/valorizarEstrategiaAcaoPsicologica',
        data: { id: id },
        dataType: 'json',

        success: function (data) {

            $('#estrategia_acao_psicologica_id').val(data[0]['id'])
            $('#data_atendimento_planejamento_psicologica_editar').val(data[0]['data_atendimento_planejamento_psicologica'])
            $('#fk_id_tipo_acao_psicologica_editar').val(data[0]['fk_id_tipo_acao_psicologica'])
            $('#descricao_psicologica_editar').val(data[0]['descricao_psicologica'])
            $('#cadastrado_em').val(data[0]['cadastrado_em'])

        }
    })
})

//VALORIZAR ESTRATÉGIAS E AÇÕES PEDAGÓGICAS

$('.valorizarEstrategiaAcaoPedagogica').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/prontuario/valorizarEstrategiaAcaoPedagogica',
        data: { id: id },
        dataType: 'json',

        success: function (data) {

            $('#estrategia_acao_pedagogica_id').val(data[0]['id'])
            $('#data_atendimento_planejamento_pedagogica_editar').val(data[0]['data_atendimento_planejamento_pedagogica'])
            $('#fk_id_tipo_acao_pedagogica_editar').val(data[0]['fk_id_tipo_acao_pedagogica'])
            $('#descricao_pedagogica_editar').val(data[0]['descricao_pedagogica'])
            $('#cadastrado_em').val(data[0]['cadastrado_em'])

        }
    })
})

//VALORIZAR ESTRATÉGIAS E AÇÕES SAÚDE

$('.valorizarEstrategiaAcaoSaude').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/prontuario/valorizarEstrategiaAcaoSaude',
        data: { id: id },
        dataType: 'json',

        success: function (data) {

            $('#estrategia_acao_saude_id').val(data[0]['id'])
            $('#data_atendimento_planejamento_saude_editar').val(data[0]['data_atendimento_planejamento_saude'])
            $('#fk_id_tipo_acao_saude_editar').val(data[0]['fk_id_tipo_acao_saude'])
            $('#descricao_saude_editar').val(data[0]['descricao_saude'])
            $('#cadastrado_em').val(data[0]['cadastrado_em'])

        }
    })
})

//VALORIZAR AVALIAÇÕES SOCIAIS

$('.historicoAvaliacaoSocial').on("click", function (event) {
    var url = $('#url').val();
    var id = $(this).attr('data-id')
    event.preventDefault()
    $.ajax({
        type: 'POST',
        url: url + 'admin/prontuario/historicoAvaliacaoSocial',
        data: { id: id },
        dataType: 'json',

        success: function (data) {
            var dados = JSON.parse(data.historicos_avaliacoes_sociais);
            html = ``;
            // console.log(dados)
            $.each(dados, function (key, value) {

                html += `<tr>
                            <td colspan="1" scope="col">`+ moment(value.cadastrado_em).format('DD/MM/YYYY hh:mm') + `</td>
                            <td colspan="1" scope="col">`+ value.tipo_avaliacao + `</td>
                            <td colspan="1" scope="col">`+ value.descricao_avaliacao_social + `</td>
                        </tr>`
            })
            $('.tbody_avaliacao_social').children().remove()
            $('.tbody_avaliacao_social').append(html)

        }
    })
})

//VALORIZAR AVALIAÇÕES PSICOLÓGICAS

$('.historicoAvaliacaoPsicologica').on("click", function (event) {
    var url = $('#url').val();
    var id = $(this).attr('data-id')
    event.preventDefault()
    $.ajax({
        type: 'POST',
        url: url + 'admin/prontuario/historicoAvaliacaoPsicologica',
        data: { id: id },
        dataType: 'json',

        success: function (data) {
            var dados = JSON.parse(data.historicos_avaliacoes_psicologicas);
            html = ``;
            // console.log(dados)
            $.each(dados, function (key, value) {

                html += `<tr>
                            <td colspan="1" scope="col">`+ moment(value.cadastrado_em).format('DD/MM/YYYY hh:mm') + `</td>
                            <td colspan="1" scope="col">`+ value.tipo_avaliacao + `</td>
                            <td colspan="1" scope="col">`+ value.descricao_avaliacao_psicologica + `</td>
                        </tr>`
            })
            $('.tbody_avaliacao_psicologica').children().remove()
            $('.tbody_avaliacao_psicologica').append(html)

        }
    })
})

//VALORIZAR AVALIAÇÕES PEDAGÓGICAS

$('.historicoAvaliacaoPedagogica').on("click", function (event) {
    var url = $('#url').val();
    var id = $(this).attr('data-id')
    event.preventDefault()
    $.ajax({
        type: 'POST',
        url: url + 'admin/prontuario/historicoAvaliacaoPedagogica',
        data: { id: id },
        dataType: 'json',

        success: function (data) {
            var dados = JSON.parse(data.historicos_avaliacoes_pedagogicas);
            html = ``;
            // console.log(dados)
            $.each(dados, function (key, value) {

                html += `<tr>
                            <td colspan="1" scope="col">`+ moment(value.cadastrado_em).format('DD/MM/YYYY hh:mm') + `</td>
                            <td colspan="1" scope="col">`+ value.tipo_avaliacao + `</td>
                            <td colspan="1" scope="col">`+ value.descricao_avaliacao_pedagogica + `</td>
                        </tr>`
            })
            $('.tbody_avaliacao_pedagogica').children().remove()
            $('.tbody_avaliacao_pedagogica').append(html)

        }
    })
})

//VALORIZAR AVALIAÇÕES PEDAGÓGICAS

$('.historicoAvaliacaoSaude').on("click", function (event) {
    var url = $('#url').val();
    var id = $(this).attr('data-id')
    event.preventDefault()
    $.ajax({
        type: 'POST',
        url: url + 'admin/prontuario/historicoAvaliacaoSaude',
        data: { id: id },
        dataType: 'json',

        success: function (data) {
            var dados = JSON.parse(data.historicos_avaliacoes_saude);
            html = ``;
            // console.log(dados)
            $.each(dados, function (key, value) {

                html += `<tr>
                            <td colspan="1" scope="col">`+ moment(value.cadastrado_em).format('DD/MM/YYYY hh:mm') + `</td>
                            <td colspan="1" scope="col">`+ value.tipo_avaliacao + `</td>
                            <td colspan="1" scope="col">`+ value.descricao_avaliacao_saude + `</td>
                        </tr>`
            })
            $('.tbody_avaliacao_saude').children().remove()
            $('.tbody_avaliacao_saude').append(html)

        }
    })
})

//EDITAR ESTRATÉGIAS E AÇÕES SOCIAIS

$('#editarEstrategiaAcaoSocial').on("submit", function (event) {
    var url = $('#url').val();

    event.preventDefault();
    var estrategia_acao_social_id = $('#estrategia_acao_social_id').val();
    var data_atendimento_planejamento_social_editar = $('#data_atendimento_planejamento_social_editar').val();
    // var fk_id_tipo_acao_social_editar = $('#fk_id_tipo_acao_social_editar').val();
    var descricao_social_editar = $('#descricao_social_editar').val();
    var cadastrado_em = new Date($('#cadastrado_em').val());
    var dataHoje = new Date();

    if (sameDay(cadastrado_em, dataHoje)) {


        Swal.fire({
            title: "Deseja realmente editar este estratégia/ações?",
            text: "Você tem até o final do dia para realizar as modificações necessárias!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, editar!"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: url + 'admin/prontuario/editarEstrategiaAcaoSocial',
                    data: {
                        estrategia_acao_social_id: estrategia_acao_social_id,
                        data_atendimento_planejamento_social_editar: data_atendimento_planejamento_social_editar,
                        // fk_id_tipo_acao_social_editar: fk_id_tipo_acao_social_editar,
                        descricao_social_editar: descricao_social_editar,
                    },
                    success: function (data) {

                        if (data == true) {
                            Swal.fire({
                                icon: "success",
                                title: "Sucesso!",
                                text: 'Estratégia/Ação salva com sucesso!',

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

    } else {
        Swal.fire({
            icon: "error",
            title: "Período de Edição Esgotado!",
            text: 'Não é possível editar estratégia/ações de dias anteriores, crie uma nova estratégia/ações se necessário!',

        }).then(() => {
            location.reload();
        })
    }


});

//EDITAR ESTRATÉGIAS E AÇÕES PSICOLÓGICAS

$('#editarEstrategiaAcaoPsicologica').on("submit", function (event) {
    var url = $('#url').val();

    event.preventDefault();
    var estrategia_acao_psicologica_id = $('#estrategia_acao_psicologica_id').val();
    var data_atendimento_planejamento_psicologica_editar = $('#data_atendimento_planejamento_psicologica_editar').val();
    // var fk_id_tipo_acao_psicologica_editar = $('#fk_id_tipo_acao_psicologica_editar').val();
    var descricao_psicologica_editar = $('#descricao_psicologica_editar').val();
    var cadastrado_em = new Date($('#cadastrado_em').val());
    var dataHoje = new Date();

    if (sameDay(cadastrado_em, dataHoje)) {


        Swal.fire({
            title: "Deseja realmente editar este estratégia/ações?",
            text: "Você tem até o final do dia para realizar as modificações necessárias!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, editar!"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: url + 'admin/prontuario/editarEstrategiaAcaoPsicologica',
                    data: {
                        estrategia_acao_psicologica_id: estrategia_acao_psicologica_id,
                        data_atendimento_planejamento_psicologica_editar: data_atendimento_planejamento_psicologica_editar,
                        // fk_id_tipo_acao_psicologica_editar: fk_id_tipo_acao_psicologica_editar,
                        descricao_psicologica_editar: descricao_psicologica_editar,
                    },
                    success: function (data) {

                        if (data == true) {
                            Swal.fire({
                                icon: "success",
                                title: "Sucesso!",
                                text: 'Estratégia/Ação salva com sucesso!',

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

    } else {
        Swal.fire({
            icon: "error",
            title: "Período de Edição Esgotado!",
            text: 'Não é possível editar estratégia/ações de dias anteriores, crie uma nova estratégia/ações se necessário!',

        }).then(() => {
            location.reload();
        })
    }


});

//EDITAR ESTRATÉGIAS E AÇÕES PEDAGÓGICAS

$('#editarEstrategiaAcaoPedagogica').on("submit", function (event) {
    var url = $('#url').val();

    event.preventDefault();
    var estrategia_acao_pedagogica_id = $('#estrategia_acao_pedagogica_id').val();
    var data_atendimento_planejamento_pedagogica_editar = $('#data_atendimento_planejamento_pedagogica_editar').val();
    // var fk_id_tipo_acao_pedagogica_editar = $('#fk_id_tipo_acao_pedagogica_editar').val();
    var descricao_pedagogica_editar = $('#descricao_pedagogica_editar').val();
    var cadastrado_em = new Date($('#cadastrado_em').val());
    var dataHoje = new Date();

    if (sameDay(cadastrado_em, dataHoje)) {


        Swal.fire({
            title: "Deseja realmente editar este estratégia/ações?",
            text: "Você tem até o final do dia para realizar as modificações necessárias!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, editar!"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: url + 'admin/prontuario/editarEstrategiaAcaoPedagogica',
                    data: {
                        estrategia_acao_pedagogica_id: estrategia_acao_pedagogica_id,
                        data_atendimento_planejamento_pedagogica_editar: data_atendimento_planejamento_pedagogica_editar,
                        // fk_id_tipo_acao_pedagogica_editar: fk_id_tipo_acao_pedagogica_editar,
                        descricao_pedagogica_editar: descricao_pedagogica_editar,
                    },
                    success: function (data) {

                        if (data == true) {
                            Swal.fire({
                                icon: "success",
                                title: "Sucesso!",
                                text: 'Estratégia/Ação salva com sucesso!',

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

    } else {
        Swal.fire({
            icon: "error",
            title: "Período de Edição Esgotado!",
            text: 'Não é possível editar estratégia/ações de dias anteriores, crie uma nova estratégia/ações se necessário!',

        }).then(() => {
            location.reload();
        })
    }


});

//EDITAR ESTRATÉGIAS E AÇÕES SAÚDE

$('#editarEstrategiaAcaoSaude').on("submit", function (event) {
    var url = $('#url').val();

    event.preventDefault();
    var estrategia_acao_saude_id = $('#estrategia_acao_saude_id').val();
    var data_atendimento_planejamento_saude_editar = $('#data_atendimento_planejamento_saude_editar').val();
    // var fk_id_tipo_acao_saude_editar = $('#fk_id_tipo_acao_saude_editar').val();
    var descricao_saude_editar = $('#descricao_saude_editar').val();
    var cadastrado_em = new Date($('#cadastrado_em').val());
    var dataHoje = new Date();

    if (sameDay(cadastrado_em, dataHoje)) {


        Swal.fire({
            title: "Deseja realmente editar este estratégia/ações?",
            text: "Você tem até o final do dia para realizar as modificações necessárias!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, editar!"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: url + 'admin/prontuario/editarEstrategiaAcaoSaude',
                    data: {
                        estrategia_acao_saude_id: estrategia_acao_saude_id,
                        data_atendimento_planejamento_saude_editar: data_atendimento_planejamento_saude_editar,
                        // fk_id_tipo_acao_saude_editar: fk_id_tipo_acao_saude_editar,
                        descricao_saude_editar: descricao_saude_editar,
                    },
                    success: function (data) {

                        if (data == true) {
                            Swal.fire({
                                icon: "success",
                                title: "Sucesso!",
                                text: 'Estratégia/Ação salva com sucesso!',

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

    } else {
        Swal.fire({
            icon: "error",
            title: "Período de Edição Esgotado!",
            text: 'Não é possível editar estratégia/ações de dias anteriores, crie uma nova estratégia/ações se necessário!',

        }).then(() => {
            location.reload();
        })
    }


});

// CADASTRO DE ANÁLISES DO ANO LETIVO

$('#cadastrarAnaliseAnoLetivo').on("submit", function (event) {
    var url = $('#url').val();

    var acolhimento_id = $('#acolhimento_id').val();
    var pessoa_id = $('#pessoa_id').val();
    var data_analise_ano_letivo = $('#data_analise_ano_letivo').val();
    var fk_id_tipo_analise_ano_letivo = $('#fk_id_tipo_analise_ano_letivo').val();
    var fk_id_tipo_avaliacao_ano_letivo = $('#fk_id_tipo_avaliacao_ano_letivo').val();
    var descricao_analise_ano_letivo = $('#descricao_analise_ano_letivo').val();

    event.preventDefault();

    Swal.fire({
        title: "Deseja realmente cadastrar essa análise?",
        text: "Você poderá editar esse registro apenas no mesmo dia do cadastro!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, cadastrar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: url + 'admin/prontuario/cadastrarAnaliseAnoLetivo',
                data: {
                    acolhimento_id: acolhimento_id,
                    pessoa_id: pessoa_id,
                    data_analise_ano_letivo: data_analise_ano_letivo,
                    fk_id_tipo_analise_ano_letivo: fk_id_tipo_analise_ano_letivo,
                    descricao_analise_ano_letivo: descricao_analise_ano_letivo,
                    fk_id_tipo_avaliacao_ano_letivo: fk_id_tipo_avaliacao_ano_letivo,
                },
                success: function (data) {

                    if (data == true) {
                        Swal.fire({
                            icon: "success",
                            title: "Sucesso!",
                            text: 'Registro salvo com sucesso!',

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

});

//EDITAR ESTRATÉGIAS E AÇÕES PEDAGÓGICAS

$('#editarAnaliseAnoLetivo').on("submit", function (event) {
    var url = $('#url').val();

    event.preventDefault();
    var analise_ano_letivo_id = $('#analise_ano_letivo_id').val();
    var data_analise_ano_letivo_editar = $('#data_analise_ano_letivo_editar').val();
    var fk_id_tipo_analise_ano_letivo_editar = $('#fk_id_tipo_analise_ano_letivo_editar').val();
    var fk_id_tipo_avaliacao_ano_letivo_editar = $('#fk_id_tipo_avaliacao_ano_letivo_editar').val();
    var descricao_analise_ano_letivo_editar = $('#descricao_analise_ano_letivo_editar').val();
    var cadastrado_em = new Date($('#cadastrado_em').val());
    var dataHoje = new Date();

    if (sameDay(cadastrado_em, dataHoje)) {


        Swal.fire({
            title: "Deseja realmente editar essa Análise?",
            text: "Você tem até o final do dia para realizar as modificações necessárias!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, editar!"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: url + 'admin/prontuario/editarAnaliseAnoLetivo',
                    data: {
                        analise_ano_letivo_id: analise_ano_letivo_id,
                        data_analise_ano_letivo_editar: data_analise_ano_letivo_editar,
                        fk_id_tipo_analise_ano_letivo_editar: fk_id_tipo_analise_ano_letivo_editar,
                        fk_id_tipo_avaliacao_ano_letivo_editar: fk_id_tipo_avaliacao_ano_letivo_editar,
                        descricao_analise_ano_letivo_editar: descricao_analise_ano_letivo_editar,
                    },
                    success: function (data) {

                        if (data == true) {
                            Swal.fire({
                                icon: "success",
                                title: "Sucesso!",
                                text: 'Análise salva com sucesso!',

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

    } else {
        Swal.fire({
            icon: "error",
            title: "Período de Edição Esgotado!",
            text: 'Não é possível editar análises de dias anteriores, crie uma nova análise se necessário!',

        }).then(() => {
            location.reload();
        })
    }


});

//VALORIZAR ANÁLISES DO ANO LETIVO

$('.valorizarAnaliseAnoLetivo').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/prontuario/valorizarAnaliseAnoLetivo',
        data: { id: id },
        dataType: 'json',

        success: function (data) {

            $('#analise_ano_letivo_id').val(data[0]['id'])
            $('#data_analise_ano_letivo_editar').val(data[0]['data_analise_ano_letivo'])
            $('#fk_id_tipo_analise_ano_letivo_editar').val(data[0]['fk_id_tipo_analise_ano_letivo'])
            $('#fk_id_tipo_avaliacao_ano_letivo_editar').val(data[0]['fk_id_tipo_avaliacao_ano_letivo'])
            $('#descricao_analise_ano_letivo_editar').val(data[0]['descricao_analise_ano_letivo'])
            $('#cadastrado_em').val(data[0]['cadastrado_em'])

        }
    })
})

// CADASTRO DE ORIENTAÇÃO AO GRUPO FAMILIAR

$('#cadastrarOrientacaoGrupoFamiliar').on("submit", function (event) {
    var url = $('#url').val();

    var acolhimento_id = $('#acolhimento_id').val();
    var pessoa_id = $('#pessoa_id').val();
    var fk_id_servico_socioassistencial = $('#fk_id_servico_socioassistencial').val();
    var nome_tecnico = $('#nome_tecnico').val();
    var email_tecnico = $('#email_tecnico').val();
    var telefone_tecnico = $('#telefone_tecnico').val();
    var descricao_orientacao_tecnica = $('#descricao_orientacao_tecnica').val();

    event.preventDefault();

    Swal.fire({
        title: "Deseja realmente cadastrar essa orientação?",
        text: "Você apenas poderá editar essa orientação no mesmo dia em que foi criada!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, cadastrar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: url + 'admin/prontuario/cadastrarOrientacaoGrupoFamiliar',
                data: {
                    acolhimento_id: acolhimento_id,
                    pessoa_id: pessoa_id,
                    fk_id_servico_socioassistencial: fk_id_servico_socioassistencial,
                    nome_tecnico: nome_tecnico,
                    email_tecnico: email_tecnico,
                    telefone_tecnico: telefone_tecnico,
                    descricao_orientacao_tecnica: descricao_orientacao_tecnica,
                },
                success: function (data) {

                    if (data == true) {
                        Swal.fire({
                            icon: "success",
                            title: "Sucesso!",
                            text: 'Orientação salva com sucesso!',

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


});

$('#editarOrientacaoGrupoFamiliar').on("submit", function (event) {
    var url = $('#url').val();

    event.preventDefault();
    var orientacao_grupo_familiar_id = $('#orientacao_grupo_familiar_id').val();
    var fk_id_servico_socioassistencial_editar = $('#fk_id_servico_socioassistencial_editar').val();
    var nome_tecnico_editar = $('#nome_tecnico_editar').val();
    var email_tecnico_editar = $('#email_tecnico_editar').val();
    var telefone_tecnico_editar = $('#telefone_tecnico_editar').val();
    var descricao_orientacao_tecnica_editar = $('#descricao_orientacao_tecnica_editar').val();
    var cadastrado_em = new Date($('#cadastrado_em_editar').val());
    var dataHoje = new Date();

    if (sameDay(cadastrado_em, dataHoje)) {

        Swal.fire({
            title: "Deseja realmente editar essa orientação?",
            text: "Você tem até o final do dia para realizar as modificações necessárias!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, editar!"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: url + 'admin/prontuario/editarOrientacaoGrupoFamiliar',
                    data: {
                        orientacao_grupo_familiar_id: orientacao_grupo_familiar_id,
                        fk_id_servico_socioassistencial_editar: fk_id_servico_socioassistencial_editar,
                        nome_tecnico_editar: nome_tecnico_editar,
                        email_tecnico_editar: email_tecnico_editar,
                        telefone_tecnico_editar: telefone_tecnico_editar,
                        descricao_orientacao_tecnica_editar: descricao_orientacao_tecnica_editar,
                    },
                    success: function (data) {

                        if (data == true) {
                            Swal.fire({
                                icon: "success",
                                title: "Sucesso!",
                                text: 'Orientação salva com sucesso!',

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
    } else {
        Swal.fire({
            icon: "error",
            title: "Período de Edição Esgotado!",
            text: 'Não é possível editar orientações de dias anteriores, crie uma nova orientação se necessário!',
        }).then(() => {
            location.reload();
        })
    }
});

//VALORIZAR ORIENTAÇÃO GRUPO FAMILIAR

$('.valorizarOrientacaoGrupoFamiliar').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/prontuario/valorizarOrientacaoGrupoFamiliar',
        data: { id: id },
        dataType: 'json',

        success: function (data) {

            $('#orientacao_grupo_familiar_id').val(data[0]['id'])
            $('#fk_id_servico_socioassistencial_editar').val(data[0]['fk_id_servico_socioassistencial'])
            $('#nome_tecnico_editar').val(data[0]['nome_tecnico'])
            $('#email_tecnico_editar').val(data[0]['email_tecnico'])
            $('#telefone_tecnico_editar').val(data[0]['telefone_tecnico'])
            $('#descricao_orientacao_tecnica_editar').val(data[0]['descricao_orientacao_tecnica'])
            $('#cadastrado_em_editar').val(data[0]['cadastrado_em'])

        }
    })
})

// CADASTRO PROCESSOS JURIDICOS

$('.cadastrarProcessoJudicial').on("click", function (event) {
    var url = $('#url').val();

    event.preventDefault();

    Swal.fire({
        title: "Deseja realmente cadastrar esse processo?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, cadastrar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $('#cadastrarProcessoJudicial').submit()

        }
    });


});

// DESCRIÇÃO PROCESSOS JURIDICOS

$('.descricaoProcessoJudicial').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')
    $.ajax({
        type: "POST",
        dataType: "json",
        url: url + 'admin/prontuario/descricaoProcessoJudicial',
        data: { id: id },
        success: function (data) {
            var dados = JSON.parse(data.processo);

            var html_anexos_processo = ``;
            var html_anexos_proibicao = ``;
            var html_audiencias_processo = ``;
            $('#numero_processo').val(dados[0][0].numero_processo);
            $('#forum_regional').val(dados[0][0].forum_regional);
            $('#numero_idea').val(dados[0][0].numero_idea);
            $('#nome_promotor').val(dados[0][0].nome_promotor);
            $('#descricao_processo').val(dados[0][0].descricao_processo);
            $('#proibicao_visita_descricao').val(dados[0][0].proibicao_visita);
            $('#fk_id_proibicao_judicial').val(dados[0][0].proibicao_judicial);
            $('#fk_id_situacao_poder_familiar').val(dados[0][0].situacao_poder_familiar);

            $.each(dados[1], function (key, value) {
                html_anexos_processo += `<div>
                                        <div class="row">
                                            <div class="col-sm-12">
                                                <button type="button" class="btn btn-warning w-100 visualizarAnexosProcessoJuridico" data-id_imagem="`+ value.id + `"><i class="fa-solid fa-image"></i> Ver
                                                </button>
                                            </div>
                                        </div>
                                        <br>
                                      </div>`;
            });

            $.each(dados[2], function (key, value) {
                html_anexos_proibicao += `<div>
                                        <div class="row">
                                            <div class="col-sm-12">
                                                <button type="button" class="btn btn-warning w-100 visualizarAnexosProcessoJuridico" data-id_imagem="`+ value.id + `"><i class="fa-solid fa-image"></i> Ver
                                                </button>
                                            </div>
                                        </div>
                                        <br>
                                      </div>`;
            });

            $.each(dados[3], function (key, value) {
                html_audiencias_processo += `<tr>
                                                <td colspan="1" scope="col">`+ moment(value.cadastrado_em).format('DD/MM/YYYY hh:mm') + `</td>
                                                <td colspan="1" scope="col">`+ moment(value.data_audiencia).format('DD/MM/YYYY') + `</td>
                                                <td colspan="1" scope="col"><button type="button"
                                                class="btn btn-info descricaoAudienciaProcesso me-3" data-id="`+ value.id + `">
                                                <i class="fa-solid fa-file-lines"></i> Abrir Descrição
                                            </button></td>
                                            </tr>`;
            })

            $('.anexos_processo_existente').children().remove();
            $('.anexos_processo_existente').append(html_anexos_processo)

            $('.anexos_proibicao_existente').children().remove();
            $('.anexos_proibicao_existente').append(html_anexos_proibicao)

            $('.tbody_audiencia_processo').children().remove();
            $('.tbody_audiencia_processo').append(html_audiencias_processo)

        }
    })
})

$('.tbody_audiencia_processo').on("click", '.descricaoAudienciaProcesso', function (event) {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/prontuario/descricaoAudienciaProcesso',
        data: { id: id },
        dataType: 'html',

        success: function (data) {
            // console.log(data)

            Swal.fire({
                width: '80%',
                html: data
            });

        }
    });
})

$('.anexos_processo_existente, .anexos_proibicao_existente, .anexos_processo_editar_existente, .anexos_proibicao_editar_existente').on("click", '.visualizarAnexosProcessoJuridico', function (event) {
    var url = $('#url').val();
    var id = $(this).attr('data-id_imagem')

    $.ajax({
        type: 'POST',
        url: url + 'admin/prontuario/visualizarAnexosProcessoJuridico',
        data: { id: id },
        dataType: 'html',

        success: function (data) {
            // console.log(data)
            if (data.match(/([^\.]+$)/g).toString() == 'pdf') {
                Swal.fire({
                    html: `<embed src="` + url + data + `#toolbar=0" type="application/pdf" width="100%" height="500px" />`
                });
            } else {

                Swal.fire({
                    imageUrl: url + data,
                    imageHeight: 500,
                    imageAlt: "A tall image"
                });
            }
        }
    });

})

// CADASTRAR AUDIENCIAS

$('.cadastrarAudienciaProcesso').on("click", function (event) {
    $('#fk_id_processo_juridico').val($(this).attr('data-id'));
})

$('#cadastrarAudienciaProcesso').on("submit", function (event) {
    var url = $('#url').val();

    var acolhimento_id = $('#acolhimento_id').val();
    var fk_id_processo_juridico = $('#fk_id_processo_juridico').val();
    var data_audiencia = $('#data_audiencia').val();
    var descricao_audiencia = CKEDITOR.instances["descricao_audiencia"].getData();

    event.preventDefault();

    if (descricao_audiencia.length == 0) {
        Swal.fire({
            icon: "warning",
            title: "Descrição Vazia!",
            text: 'O Campo de Descrição da Audiência deve estar Preenchida!',

        })
    } else {
        Swal.fire({
            title: "Deseja Realmente Cadastrar essa Audiência?",
            // text: "Caso o status da avaliação seja completa, essa ação/estratégia será finalizada!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, cadastrar!"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: url + 'admin/prontuario/cadastrarAudienciaProcesso',
                    data: {
                        acolhimento_id: acolhimento_id,
                        fk_id_processo_juridico: fk_id_processo_juridico,
                        data_audiencia: data_audiencia,
                        descricao_audiencia: descricao_audiencia,
                    },
                    success: function (data) {

                        if (data == true) {
                            Swal.fire({
                                icon: "success",
                                title: "Sucesso!",
                                text: 'Audiência salva com sucesso!',

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
    }


});

// VALORIZAR PROCESSOS JURIDICOS

$('.valorizarProcessoJudicial').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')
    $.ajax({
        type: "POST",
        dataType: "json",
        url: url + 'admin/prontuario/descricaoProcessoJudicial',
        data: { id: id },
        success: function (data) {
            var dados = JSON.parse(data.processo);

            var html_anexos_processo = ``;
            var html_anexos_proibicao = ``;
            $('#processo_judicial_id').val(dados[0][0].id);
            $('#numero_processo_editar').val(dados[0][0].numero_processo);
            $('#forum_regional_editar').val(dados[0][0].forum_regional);
            $('#numero_idea_editar').val(dados[0][0].numero_idea);
            $('#nome_promotor_editar').val(dados[0][0].nome_promotor);
            $('#descricao_processo_editar').val(dados[0][0].descricao_processo);
            $('#proibicao_visita_editar').val(dados[0][0].proibicao_visita);
            $('#fk_id_proibicao_judicial_editar').val(dados[0][0].fk_id_proibicao_judicial);
            $('#fk_id_situacao_poder_familiar_editar').val(dados[0][0].fk_id_situacao_poder_familiar);

            $.each(dados[1], function (key, value) {
                html_anexos_processo += `<div>
                                        <div class="row">
                                            <div class="col-sm-12">
                                                <button type="button" class="btn btn-warning w-100 visualizarAnexosProcessoJuridico" data-id_imagem="`+ value.id + `"><i class="fa-solid fa-image"></i> Ver
                                                </button>
                                            </div>
                                        </div>
                                        <br>
                                      </div>`;
            });

            $.each(dados[2], function (key, value) {
                html_anexos_proibicao += `<div>
                                        <div class="row">
                                            <div class="col-sm-12">
                                                <button type="button" class="btn btn-warning w-100 visualizarAnexosProcessoJuridico" data-id_imagem="`+ value.id + `"><i class="fa-solid fa-image"></i> Ver
                                                </button>
                                            </div>
                                        </div>
                                        <br>
                                      </div>`;
            });

            $('.anexos_processo_editar_existente').children().remove();
            $('.anexos_processo_editar_existente').append(html_anexos_processo)

            $('.anexos_proibicao_editar_existente').children().remove();
            $('.anexos_proibicao_editar_existente').append(html_anexos_proibicao)

        }
    })
})

$('.editarProcessoJudicial').on("click", function (event) {
    var url = $('#url').val();

    event.preventDefault();

    Swal.fire({
        title: "Deseja realmente editar esse processo?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, editar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $('#editarProcessoJudicial').submit()

        }
    });


});
