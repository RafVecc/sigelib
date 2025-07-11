
$('#lista_emp_dev').on("click", ".btn_emp, .btn_dev", function (event) {
    if ($(this).hasClass('btn_emp')) {
        var title = 'Deseja finalizar o empréstimo desse livro?'
        var data_emprestimo = $('#data_emprestimo').val()
        var data_prevista = $('#data_prevista').val()
        $("#form_emp_dev").attr('action', "cadastrar");
    } else if ($(this).hasClass('btn_dev')) {
        var title = 'Deseja finalizar a devolução desse livro?'
        $("#form_emp_dev").attr('action', "editar");
    }

    $("#emp_dev_id").val($(this).attr('data-id'));

    event.preventDefault();

    var emptyCount = 0;
    $("#form_emp_dev").find('input[required], select[required], textarea[required]').each(function (index, element) {
        var element = $(element);

        if (element.val() === '') {
            emptyCount++;
            element.addClass('is-invalid');
            $("#modalPesquisaLeitor").scrollTo('.is-invalid');
        } else {

            if (!validarCampos(element)) {
                emptyCount++;
            } else {
                element.removeClass('is-invalid');
            }
        }
    });
    if (emptyCount == 0) {
        if ($(this).hasClass('btn_dev')) {
            Swal.fire({
                title: title,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sim",
                cancelButtonText: "Não",
            }).then((result) => {
                if (result.isConfirmed) {
                    $('#form_emp_dev').submit()
                }
            });
        } else if ($(this).hasClass('btn_emp')) {

            Swal.fire({
                title: title,
                icon: "warning",
                html: `<label for="data_emprestimo" class="form-label">Data Empréstimo: ${moment(data_emprestimo).format('DD/MM/YYYY')}</label>` +
                    `<label for="data_prevista" class="form-label">Data Previsão de Devolução: ${moment(data_prevista).format('DD/MM/YYYY')}</label>` +
                    '<h4 class="swal2-title" id="swal2-title" style="display: block;">Observação de Empréstimo <span class="text-danger">*</span></h4>' +
                    '<textarea id="swal2-textarea" placeholder="Observação..." name="restricoes" class="swal2-textarea" style="width: 80%; display: flex;"></textarea>',
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sim",
                cancelButtonText: "Não",
                preConfirm: () => {
                    var texto = document.getElementsByClassName("swal2-textarea");
                    var valor = texto[0].value;
                    if (valor.length != 0) {
                        $('#observacao_emprestimo').val(valor)
                    } else {
                        Swal.showValidationMessage('Preencha os campos acima!')
                    }
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    $('#form_emp_dev').submit()
                }
            });
        }
    }
});

function executar_pesquisa_leitor(variavel, e) {
    var url = $('#url').val();
    var cpf = variavel.val().replace(/[^0-9]/g, '');
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
                variavel.val('')
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
                        variavel.val('')
                    })
                }
            }
        }
        if (contador == 0) {

            $.ajax({
                type: "POST",
                url: "checarCpf",
                data: { cpf: novoCpf },
                dataType: 'json',
                success: function (result) {

                    if (result == null) {
                        Swal.fire({
                            title: "CPF não cadastrado, deseja iniciar o cadastro?",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Sim",
                            cancelButtonText: "Não"
                        }).then((result2) => {
                            if (result2.isConfirmed) {
                                $('#ModalCadastrarLeitor').modal('show');
                                $('#ModalCadastrarLeitor').find('#cpf_leitor').val(novoCpf).trigger("input");
                                $('#ModalCadastrarLeitor').find('#cpf_leitor').attr('readonly', true)
                            } else {
                                $('#pesquisaLeitor').find('#cpf').val('');
                            }
                        });

                    } else {

                        $('#lista_emp_dev').children().remove();
                        html = '';
                        if (result[0]['check'] == 'invalido') {
                            $("#info_emp").addClass('d-none');
                            $(".label_emp_dev").html('Informações Devolução')
                            var data_efetiva = moment(new Date()); //todays date
                            var data_prevista = moment(result[0]['data_prevista']);

                            var dias = data_efetiva.diff(data_prevista, 'days');


                            if (dias > 0) {
                                var label_dias = `<label for="label_aviso_atraso" class="form-label text-danger">A devolução está com ${dias} dias de atraso!</label>`;
                            } else {
                                var label_dias = `<label for="label_aviso_atraso" class="form-label text-success">A devolução está no prazo!</label>`;
                            }

                            html += `<div class="row mb-3">
                                        <div class="col-lg-12 card border-2 shadow-sm">
                                            <div class="card-body">
                                                <div class="row">
                                                    <input type="hidden" name="dev_check" value="1" required>
                                                    <div class="col-lg-3 card border-2 shadow-sm mb-2 ms-2">
                                                        <div class="card-body">
                                                        <div class="row">
                                                            <div class="col-lg-12 card border-2 shadow-sm mb-3">
                                                            <div class="card-body">
                                                                <img src='${url + 'uploads/livros/' + result[0]['foto_capa_livro']}' alt="" id="imagem_devolucao_livro">
                                                            </div>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-8 card border-2 shadow-sm mb-2 ms-2">
                                                        <div class="card-body d-flex flex-column justify-content-between">
                                                        <div>
                                                            <div class="row">
                                                                <div class="col-sm-9">
                                                                    <div class="mb-3">
                                                                    <label for="titulo_devolucao_livro" class="form-label">Título</label>
                                                                    <input class="form-control" id="titulo_devolucao_livro" type="text" value="${result[0]['titulo_livro']}"
                                                                        readonly>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-sm-4">
                                                                    <div class="mb-3">
                                                                    <label for="data_emprestimo_devolucao_livro" class="form-label">Data Empréstimo</label>
                                                                    <input class="form-control" type="date" id="data_emprestimo_devolucao_livro" value="${result[0]['data_emprestimo']}" readonly>
                                                                    </div>
                                                                </div>
                                                                <div class="col-sm-4">
                                                                    <div class="mb-3">
                                                                    <label for="data_prevista_devolucao_livro" class="form-label">Data Prevista</label>
                                                                    <input class="form-control" type="date" id="data_prevista_devolucao_livro" value="${result[0]['data_prevista']}" readonly>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-sm-5">
                                                                    <div class="mb-3">
                                                                    <label for="data_efetiva_devolucao_livro" class="form-label">Data Efetiva</label>
                                                                    <input class="form-control" type="date" id="data_efetiva_devolucao_livro" name="data_efetiva_devolucao_livro" value="${moment().format("YYYY-MM-DD")}" readonly>
                                                                    </div>
                                                                </div>
                                                                <div class="col-sm-5">
                                                                    <div class="my-4 ms-5">
                                                                    ${label_dias}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-lg-12 card border-2 shadow-sm">
                                                        <div class="card-body d-flex flex-column justify-content-between">
                                                        <div>
                                                            <div class="row">
                                                                <div class="col-sm-12">
                                                                    <div class="mb-3">
                                                                    <label for="observacao_emprestimo_devolucao_livro" class="form-label">Observação de
                                                                        Empréstimo</label>
                                                                    <textarea class="form-control" readonly>${result[0]['observacao_emprestimo']}</textarea>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-sm-12">
                                                                    <div class="mb-3">
                                                                    <label for="observacao_devolucao_livro" class="form-label">Observação de
                                                                        Devolução <span class="text-danger">*</span></label>
                                                                    <textarea name="observacao_devolucao_livro" class="form-control" required></textarea>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="mb-3">
                                            <button type="button" class="btn btn-success btn_dev me-2" data-id="${result[0]['controle_id']}">
                                            Concluir
                                        </button><button
                                        type="button" class="btn btn-warning" onClick="window.location.reload();">
                                        Cancelar </button>
                                        </div>
                                    </div>`;
                        } else {
                            $("#info_emp").removeClass('d-none');
                            $(".label_emp_dev").html('Informações Empréstimo')
                            html_emp_dev = '';
                            $.each(result[0]['emp_dev'], function (key, value) {
                                if (value['quantidade_livro'] - value['total_emp'] <= 0) {
                                    var html_btn = `
                                                <button type="button" class="btn btn-secondary" disable>
                                                    Selecionar
                                                </button>
                                                `;
                                } else {

                                    var html_btn = `
                                                <button type="button" class="btn btn-success btn_emp" data-id="${value['id']}">
                                                    Selecionar
                                                </button>
                                                `;
                                }

                                html_emp_dev += `
                                <tr>
                                    <td>${value['titulo_livro']}</td>
                                    <td>${value['autor_livro']}</td>
                                    <td>${value['localizacao_livro']}</td>
                                    <td>${value['quantidade_livro']}</td>
                                    <td>${value['total_emp']}</td>
                                    <td>${value['quantidade_livro'] - value['total_emp']}</td>
                                    <td>${value['ano_livro']}</td>
                                    <td>${value['idioma_livro']}</td>
                                    <td>
                                        ${html_btn}
                                    </td>
                                </tr>`;
                            });
                            html += `
                            <div class="card-body">
                                <input type="hidden" name="emp_check" value="1" required>
                                <div class="table-responsive">
                                    <table id="tabelaLivros" url="{{url()}}" class="table table-striped" style="width:100%">
                                    <thead>
                                        <tr>
                                        <th>Titulo</th>
                                        <th>Autor</th>
                                        <th>Prateleira</th>
                                        <th>QTD</th>
                                        <th>EMP</th>
                                        <th>Saldo</th>
                                        <th>Ano</th>
                                        <th>Idioma</th>
                                        <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>`+
                                html_emp_dev
                                + `</tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="row">
                                <div class="mb-3">
                                <button
                                type="button" class="btn btn-warning" onClick="window.location.reload();">
                                Cancelar </button>
                                </div>
                            </div>
                            `;
                        }
                        var imagem = url + 'uploads/leitores/' + result[0]['foto_leitor'];
                        $('#modalPesquisaLeitor').find('#leitor_id').val(result[0]['id']);
                        $('#modalPesquisaLeitor').find('#foto_leitor_pesquisa').attr('src', imagem);
                        $('#modalPesquisaLeitor').find('#cpf_leitor_pesquisa').val(result[0]['cpf_leitor']).trigger("input");
                        $('#modalPesquisaLeitor').find('#nome_leitor_pesquisa').val(result[0]['nome_leitor']);
                        // $('#modalPesquisaLeitor').find('#telefone_leitor_pesquisa').val(result[0]['telefone_leitor']);
                        // $('#modalPesquisaLeitor').find('#data_nascimento_leitor_pesquisa').val(result[0]['data_nascimento_leitor']);
                        // $('#modalPesquisaLeitor').find('#email_leitor_pesquisa').val(result[0]['email_leitor']);
                        $('#lista_emp_dev').append(html);

                        $('#tabelaLivros').DataTable({

                            columnDefs: [
                                {
                                    targets: [-1],
                                    className: 'dt-center',
                                    orderable: false
                                },
                                {
                                    className: 'dt-head-center dt-body-left',
                                    targets: ['_all']
                                }

                            ],
                            order: [[0, 'asc']],
                            "language": {
                                "url": "https://cdn.datatables.net/plug-ins/1.12.1/i18n/pt-BR.json"
                            }
                        });

                        $('#modalPesquisaLeitor').modal('show');
                    }
                }
            });

            e.preventDefault();
        }
    }

}

$("#pesquisaLeitor").find('#cpf').on("input", function (e) {
    var variavel = $(this)
    executar_pesquisa_leitor(variavel, e)
}
);

$(".pesquisaLeitor").on("click", function (e) {
    var variavel = $("#pesquisaLeitor").find('#cpf')
    executar_pesquisa_leitor(variavel, e)
}
);
