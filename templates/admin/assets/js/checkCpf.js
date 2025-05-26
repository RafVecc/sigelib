
// $("#cpf").on("input", function (e) {
//     var cpf = $(this).val().replace(/[^0-9]/g, '');
//     cpf = cpf.replace(/[0-9]{12}$/, cpf.slice(0, -1));
//     if (cpf.length != 11) {

//     } else {
//         $.ajax({
//             type: "POST",
//             url: "checarCpf",
//             data: { cpf: cpf },
//             success: function (result) {
//                 console.log(result)
//                 if (result.trim() == '') {

//                 } else {
//                     Swal.fire({
//                         title: "CPF Encontrado!",
//                         text: "Você será redirecionado para a ficha de cadastro!",
//                         icon: "warning",
//                         timer: 3000,
//                         showConfirmButton: false
//                     }).then((resposta) => {
//                         if (resposta.dismiss === swal.DismissReason.timer) {
//                             window.location.href = "../prontuario/"+result.trim();
//                           }
//                     });
//                 }
//             }
//         });

//         e.preventDefault();
//     }

// }
// );