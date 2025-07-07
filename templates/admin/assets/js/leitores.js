$('.cadastrarLeitor').on("click", function (event) {

    event.preventDefault();

    var emptyCount = 0;
    $("#cadastrarLeitor").find('input[required], select[required], textarea[required]').each(function (index, element) {
        var element = $(element);

        if (element.val() === '') {
            emptyCount++;
            element.addClass('is-invalid');
            $("#ModalCadastrarLeitor").scrollTo('.is-invalid');
        } else {

            if (!validarCampos(element)) {
                emptyCount++;
            } else {
                element.removeClass('is-invalid');
            }
        }
    });
    if (emptyCount == 0) {

        Swal.fire({
            title: "Deseja finalizar o cadastro desse leitor?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim",
            cancelButtonText: "Não"
        }).then((result) => {
            if (result.isConfirmed) {
                $('#cadastrarLeitor').submit()
            }
        });
    }

});

$('.editarLeitor').on("click", function (event) {

    event.preventDefault();

    Swal.fire({
        title: "Deseja finalizar a edição desse leitor?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
    }).then((result) => {
        if (result.isConfirmed) {
            $('#editarLeitor').submit()
        }
    });


});

$('.btnFichaLeitor').on("click", function (event) {

    // $('.formFichaLeitor').submit()
    $(this).closest('.formFichaLeitor').submit()

});

$('.valorizarLeitor').on("click", function () {
    var url = $('#url').val();
    var id = $(this).attr('data-id')

    $.ajax({
        type: 'POST',
        url: url + 'admin/leitores/valorizarLeitor',
        data: { id: id },
        dataType: 'json',

        success: function (data) {
            var imagem = url + 'uploads/leitores/' + data[0]['foto_leitor']
            $('#leitor_id').val(data[0]['id'])
            $('#imagem_leitor_editar').attr('src', imagem)
            $('#cpf_leitor_editar').val(data[0]['cpf_leitor'])
            $('#nome_leitor_editar').val(data[0]['nome_leitor'])
            $('#data_nascimento_leitor_editar').val(data[0]['data_nascimento_leitor'])
            $('#telefone_leitor_editar').val(data[0]['telefone_leitor'])
            $('#sexo_leitor_editar_id').val(data[0]['sexo_leitor_id'])
            $('#cor_leitor_editar_id').val(data[0]['cor_leitor_id'])
            $('#escolaridade_leitor_editar_id').val(data[0]['escolaridade_leitor_id'])
            $('#email_leitor_editar').val(data[0]['email_leitor'])
            $('#rede_social_leitor_editar').val(data[0]['rede_social_leitor'])
            $('#cep_leitor_editar').val(data[0]['cep_leitor'])
            $('#rua_leitor_editar').val(data[0]['rua_leitor'])
            $('#bairro_leitor_editar').val(data[0]['bairro_leitor'])
            $('#numero_leitor_editar').val(data[0]['numero_leitor'])
            $('#ponto_de_referencia_leitor_editar').val(data[0]['ponto_de_referencia_leitor'])

        }
    })
})

$(document).ready(function () {

    $("#ModalCadastrarLeitor").find('#cep_leitor').on("input", function (e) {

        var cep = $(this).val().replace(/[^0-9]/g, '');
        cep = cep.replace(/[0-9]{9}$/, cep.slice(0, -1));
        if (cep.length != 8) {

        } else {

            let url = 'https://viacep.com.br/ws/' + cep + '/json/';

            let xmlHttp = new XMLHttpRequest();

            xmlHttp.open('GET', url);


            xmlHttp.onreadystatechange = () => {

                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {

                    let dadosJSONtext = xmlHttp.responseText;
                    let dadosJSONObs = JSON.parse(dadosJSONtext);
                    console.log(dadosJSONObs)
                    $("#ModalCadastrarLeitor").find('#rua_leitor').val(dadosJSONObs.logradouro);
                    $("#ModalCadastrarLeitor").find('#bairro_leitor').val(dadosJSONObs.bairro);

                }
            }
            xmlHttp.send();
        }

    });
});

$("#cadastrarLeitor").find("#cpf_leitor").on("input", function (e) {
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
                $("#cadastrarLeitor").find("#cpf_leitor").val('')
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
                        $("#cadastrarLeitor").find("#cpf_leitor").val('')
                    })
                }
            }
        }
        if (contador == 0) {
            $.ajax({
                type: "POST",
                url: "checarCpf",
                data: { cpf: cpf },
                success: function (result) {
                    if (result.trim() == '') {

                    } else {
                        Swal.fire({
                            title: "CPF Encontrado!",
                            text: "CPF não pode ser repetido!",
                            icon: "warning",
                            showConfirmButton: true
                        }).then((resposta) => {
                            $("#cadastrarLeitor").find("#cpf_leitor").val('');
                        });
                    }
                }
            });

            e.preventDefault();
        }
    }

}
);


$(document).ready(function () {
    $('#cpf_leitor').mask('000.000.000-00', {reverse: false});
    $('#telefone_leitor').mask('(00) 00000-0000', {reverse: false});
    $('#cep_leitor').mask('00000-000', {reverse: false});
});
