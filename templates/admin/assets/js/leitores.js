$('.cadastrarLeitor').on("click", function (event) {

    event.preventDefault();

    Swal.fire({
        title: "Deseja finalizar o cadastro desse leitor?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, cadastrar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $('#cadastrarLeitor').submit()
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
        console.log('algo')
        var cep = $(this).val().replace(/[^0-9]/g, '');
        cep = cep.replace(/[0-9]{9}$/, cep.slice(0, -1));
        if (cep.length != 8) {

        } else {

            let url = 'http://viacep.com.br/ws/' + cep + '/json/';

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