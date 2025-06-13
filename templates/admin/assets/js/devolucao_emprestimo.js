$('.emprestarLivro').on("click", function (event) {

    event.preventDefault();

    Swal.fire({
        title: "Deseja finalizar o empréstimo desse livro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, emprestar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $('#emprestarLivro').submit()
        }
    });


});

$('.editarLeitor').on("click", function (event) {

    event.preventDefault();

    Swal.fire({
        title: "Deseja finalizar a edição desse leitor?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, editar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $('#editarLeitor').submit()
        }
    });


});

$('#btn_emp_dev').on("click", '#btn_emprestimo', function (event) {
    $("#form_amp_dev").attr('action', "emprestimo");
    $('#form_amp_dev').submit()

});

function executar_pesquisa_leitor(variavel, e) {
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
                    console.log(result)
                    if (result == null) {
                        Swal.fire({
                            title: "CPF não cadastrado, deseja iniciar o cadastro?",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Sim, cadastrar!"
                        }).then((result2) => {
                            if (result2.isConfirmed) {
                                $('#ModalCadastrarLeitor').modal('show');
                                $('#ModalCadastrarLeitor').find('#cpf_leitor').val(novoCpf);
                            } else {
                                $('#pesquisaLeitor').find('#cpf').val('');
                            }
                        });

                    } else {
                        $('#btn_emp_dev').children().remove();
                        html = '';
                        if (result[0]['check'] == 'invalido') {
                            html += `<button type="button" class="btn btn-warning" data-bs-toggle="modal"
                            data-bs-target="#ModalDadosPessoaisCompletos">Realizar Devolução
                            </button>`;
                        } else {
                            html += `<button type="button" class="btn btn-warning" id="btn_emprestimo" data-leitor_id="${result[0]['id']}">Realizar Emprestimo
                            </button>`;
                        }
                        $('#modalPesquisaLeitor').find('#leitor_id').val(result[0]['id']);
                        $('#modalPesquisaLeitor').find('#cpf_leitor_pesquisa').val(result[0]['cpf_leitor']);
                        $('#modalPesquisaLeitor').find('#nome_leitor_pesquisa').val(result[0]['nome_leitor']);
                        $('#modalPesquisaLeitor').find('#telefone_leitor_pesquisa').val(result[0]['telefone_leitor']);
                        $('#modalPesquisaLeitor').find('#data_nascimento_leitor_pesquisa').val(result[0]['data_nascimento_leitor']);
                        $('#modalPesquisaLeitor').find('#email_leitor_pesquisa').val(result[0]['email_leitor']);
                        $('#btn_emp_dev').append(html);
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

$('.valorizarEmprestimo').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-livro_id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/livros/valorizarLivro',
        data: { id: id },
        dataType: 'json',

        success: function (data) {
            var imagem = url + 'uploads/livros/' + data[0]['foto_capa_livro']
            $('#livro_id_emprestimo').val(data[0]['id'])
            $('#foto_capa_livro_emprestimo').attr('src', imagem)
            $('#titulo_livro_emprestimo').val(data[0]['titulo_livro'])
            $('#genero_livro_emprestimo_id').val(data[0]['genero_livro_id'])
            $('#editora_livro_emprestimo').val(data[0]['editora_livro'])
            $('#ano_livro_emprestimo').val(data[0]['ano_livro'])
            $('#pais_livro_emprestimo_id').val(data[0]['pais_livro_id'])
            $('#idioma_livro_emprestimo_id').val(data[0]['idioma_livro_id'])
            $('#autor_livro_emprestimo').val(data[0]['autor_livro'])
            $('#quantidade_livro_emprestimo').val(data[0]['quantidade_livro'])
            $('#tipo_procedencia_livro_emprestimo_id').val(data[0]['tipo_procedencia_livro_id'])
            $('#procedencia_livro_emprestimo').val(data[0]['procedencia_livro'])
            $('#localizacao_livro_emprestimo').val(data[0]['localizacao_livro'])
            $('#sinopse_livro_emprestimo').val(data[0]['sinopse_livro'])
        }
    })
})