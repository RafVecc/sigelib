$(document).ready(function () {

	$('select[readonly]').on("keydown", function () {
		return false;
	});

	var url = $('#url').val();

	$("#addComposicaoFamiliar").on("click", function () {
		alert("Handler for `click` called.");
	});
	$(".btnAdicionarComposicaoFamilar").on("click", function () {
		var id_pessoa = this.getAttribute("valor");
		$("#pessoa_id").val(id_pessoa);
	});

	$(".anexarTermos").on("click", function () {
		var id_acolhimento = $(this).val();
		var servico_solicitante = $(this).attr('data-servico_solicitante');
		$("#id_acolhimento").val(id_acolhimento);
		$("#numero_guia").children().remove()
		if (['4', '5', '9'].includes(servico_solicitante)) {

			var html = `<div class="row">
							<div class="col-sm-12">
							<div class="mb-3">
								<label for="numero_guia_acolhimento" class="form-label">Número Guia de Acolhimento</label>
								<input type="text" name="numero_guia_acolhimento" class="form-control" required></input>
							</div>
							</div>
						</div>`
			$('#numero_guia').append(html);
		}

	});

	$(".removerPessoaSolicitacao").on("click", function () {
		var id_acolhimento = $(this).val();
		var id_solicitacao = $(this).attr('data-solicitacao');
		var id_pessoa = $(this).attr('data-id');
		var url = $('#url').val();

		Swal.fire({
			title: "Deseja remover essa pessoa desta Solicitação?",
			text: "A pessoa será removida da solicitação, mas o cadastro da mesma não será excluido!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Sim, Remover!"
		}).then((result) => {
			if (result.isConfirmed) {
				$.ajax({
					type: 'POST',
					url: url + 'admin/solicitacaoRegulacao/removerPessoaSolicitacao',
					data: {
						id: id_acolhimento,
						id_solicitacao: id_solicitacao,
						id_pessoa: id_pessoa
					},
					dataType: 'html',
					success: function (data) {
						if (data == 'solicitacao_true') {

							window.location.href = url + 'admin/solicitacaoRegulacao/adicionarSolicitacaoRegulacao';
						} else if (data == 'pessoa_true') {

							location.reload();
						}
					}
				})

			}
		})



	});
	$(".cancelarPessoaSolicitacao").on("click", function () {
		var id_acolhimento = $(this).val();
		var id_solicitacao = $(this).attr('data-solicitacao');
		var url = $('#url').val();

		Swal.fire({
			title: "Deseja cancelar essa pessoa desta Solicitação?",
			text: "A pessoa será cancelada da solicitação, mas o cadastro da mesma não será excluido!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Sim, Cancelar!"
		}).then((result) => {
			if (result.isConfirmed) {
				$.ajax({
					type: 'POST',
					url: url + 'admin/solicitacaoRegulacao/cancelarRegulacaoPessoa',
					data: { id_acolhimento: id_acolhimento, id_solicitacao: id_solicitacao },
					dataType: 'html',
					success: function (data) {
						location.reload();
						/*
						if (data.sucesso == "1") {
							alert(data.sucesso);
							//window.location.href = url + 'admin/solicitacaoRegulacao/adicionarSolicitacaoRegulacao';
						} else if (data.sucesso == "0") {
							alert(data.sucesso);
						}
							*/
					}
				})

			}
		})



	});


	$(".btnAdicionarSolicitacaoRegulacao").on("click", function () {
		var id_pessoa = this.getAttribute("valor");
		$("#pessoa_id").val(id_pessoa);
		$('select[readonly]').on("keydown", function () {
			return false;
		});
		$.ajax({
			type: 'POST',
			url: url + 'admin/pessoas/pessoaAjax',
			data: { id: id_pessoa },
			dataType: 'json',
			success: function (data) {
				if (data.erro) {
					Swal.fire({
						icon: "error",
						title: "Erro",
						text: data.erro,
					});

				} else {
					$.each(data[0], function (key, value) {
						if ($("#" + key).parents('#dadosComplementares').length > 0) {

						} else {
							$("#" + key).val(value);
							if (value) {
								if (key == 'pcd' && value == 2) {

								} else {
									$("#" + key).attr('readonly', true);

								}
							}
						}

					});
					$('#imgPhoto').attr('src', url + 'uploads/pessoas/' + data[0]['matricula'] + "/" + data[0]['foto']);

					var fk_id_tipo_pcd = [];
					$.each(data[2], function (key, value) {
						$.each(value, function (chave, valor) {
							if (chave == "fk_id_tipo_pcd") {
								fk_id_tipo_pcd.push(valor);
							}
						})
					});

					var html = ``;
					$.each(data[5], function (key, value) {

						html += `<div>
									<div class="row">
						  				<div class="col-sm-8">
											<input type="text" name="" class="form-control" value="`+ value.tipo_anexo_documento + `" readonly></input>
						  				</div>
										<div class="col-sm-4">
											<button type="button" class="btn btn-warning visualizarDocumento" data-id_imagem="`+ value.id + `"><i class="fa-solid fa-image"></i> Ver
											</button>
										</div>
									</div>
									<br>
					 			</div>`;
					});

					$("#documentos_pessoa_existentes").children().remove()
					$("#documentos_pessoa_existentes").append(html)

					$("#fk_id_tipo_pcd").val(fk_id_tipo_pcd);
					$("#fk_id_tipo_pcd").trigger('change');
				}
			}
		});
	});

	//DOCUMENTOS PESSOAIS

	$('#documentos_pessoa_existentes').on("click", '.visualizarDocumento', function (event) {
		var url = $('#url').val();
		var id = $(this).attr('data-id_imagem')

		$.ajax({
			type: 'POST',
			url: url + 'admin/solicitacaoRegulacao/visualizarDocumentoPessoa',
			data: { id: id },
			dataType: 'html',

			success: function (data) {
				// console.log(data.match(/([^\.]+$)/g).toString())
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

	$('.visualizarDocumento').on("click", function (event) {
		var url = $('#url').val();
		var id = $(this).attr('data-id_imagem')

		$.ajax({
			type: 'POST',
			url: url + 'admin/solicitacaoRegulacao/visualizarDocumentoPessoa',
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

	$('.visualizarTermos').on("click", function (event) {
		var url = $('#url').val();
		var id = $(this).attr('data-id_imagem')

		$.ajax({
			type: 'POST',
			url: url + 'admin/prontuario/visualizarTermos',
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

	$('.visualizarDocumentoRecusa').on("click", function (event) {
		var url = $('#url').val();
		var id = $(this).attr('data-id_imagem')

		$.ajax({
			type: 'POST',
			url: url + 'admin/solicitacaoAcolhimento/visualizarDocumentoRecusa',
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

	//LAUDOS MEDICOS

	$('#laudo_medico_existentes').on("click", '.visualizarLaudoMedico', function (event) {
		var url = $('#url').val();
		var id = $(this).attr('data-id_imagem')

		$.ajax({
			type: 'POST',
			url: url + 'admin/solicitacaoRegulacao/visualizarLaudoMedico',
			data: { id: id },
			dataType: 'html',

			success: function (data) {
				// console.log(data.match(/([^\.]+$)/g).toString())
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

	$('.visualizarLaudoMedico').on("click", function (event) {
		var url = $('#url').val();
		var id = $(this).attr('data-id_imagem')

		$.ajax({
			type: 'POST',
			url: url + 'admin/solicitacaoRegulacao/visualizarLaudoMedico',
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

	//RECEITAS MEDICAS

	$('#receita_medica_existentes').on("click", '.visualizarReceitaMedica', function (event) {
		var url = $('#url').val();
		var id = $(this).attr('data-id_imagem')

		$.ajax({
			type: 'POST',
			url: url + 'admin/solicitacaoRegulacao/visualizarReceitaMedica',
			data: { id: id },
			dataType: 'html',

			success: function (data) {
				// console.log(data.match(/([^\.]+$)/g).toString())
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

	$('.visualizarReceitaMedica').on("click", function (event) {
		var url = $('#url').val();
		var id = $(this).attr('data-id_imagem')

		$.ajax({
			type: 'POST',
			url: url + 'admin/solicitacaoRegulacao/visualizarReceitaMedica',
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

	//ANEXOS ADICIONAIS

	$('#anexos_adicionais_existentes').on("click", '.visualizarAnexoAdicional', function (event) {
		var url = $('#url').val();
		var id = $(this).attr('data-id_imagem')

		$.ajax({
			type: 'POST',
			url: url + 'admin/solicitacaoRegulacao/visualizarAnexoAdicional',
			data: { id: id },
			dataType: 'html',

			success: function (data) {
				// console.log(data.match(/([^\.]+$)/g).toString())
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

	$('.visualizarAnexoAdicional').on("click", function (event) {
		var url = $('#url').val();
		var id = $(this).attr('data-id_imagem')

		$.ajax({
			type: 'POST',
			url: url + 'admin/solicitacaoRegulacao/visualizarAnexoAdicional',
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

	$(".btnProntuarioPessoa").on("click", function () {
		var id_pessoa = this.getAttribute("value");
		var id_acolhimento = $(this).attr('data-id_acolhimento');

		$("#pessoa_id").val(id_pessoa);

		$('select[readonly]').on("keydown", function () {
			return false;
		});

		$.ajax({
			type: 'POST',
			url: url + 'admin/pessoas/pessoaAjax',
			data: {
				id: id_pessoa,
				id_acolhimento: id_acolhimento
			},
			dataType: 'json',
			beforeSend: function () {

			},

			success: function (data) {

				if (data.erro) {
					Swal.fire({
						icon: "error",
						title: "Erro",
						text: data.erro,
					});

				} else {
					console.log(data)


					$.each(data[0], function (key, value) {
						if ($("#" + key).parents('#dadosComplementaresProntuario').length > 0) {

						} else {
							$("#" + key).val(value);
						}
					});

					$.each(data[8], function (key, value) {
						if ($("#" + key).parents('#dadosComplementaresProntuario').length > 0) {
							$("#" + key).val(value);

						}
					});

					$('#imgPhoto').attr('src', url + 'uploads/pessoas/' + data[0]['matricula'] + "/" + data[0]['foto']);
					var tipo_spa = [];
					$.each(data[1], function (key, value) {
						$.each(value, function (chave, valor) {
							if (chave == "tipo_spa") {
								tipo_spa.push(valor);
							}
						})
					});

					var tipo_pcd = [];
					$.each(data[2], function (key, value) {
						$.each(value, function (chave, valor) {
							if (chave == "tipo_pcd") {
								tipo_pcd.push(valor);
							}
						})
					});

					var tipo_beneficio = [];
					$.each(data[3], function (key, value) {
						$.each(value, function (chave, valor) {
							if (chave == "tipo_beneficio") {
								tipo_beneficio.push(valor);
							}
						})
					});

					var tipo_motivo_de_rua = [];
					$.each(data[4], function (key, value) {
						$.each(value, function (chave, valor) {
							if (chave == "tipo_motivo_de_rua") {
								tipo_motivo_de_rua.push(valor);
							}
						})
					});

					var html_documento_pessoa = ``;
					$.each(data[5], function (key, value) {
						html_documento_pessoa += `<div>
									<div class="row">
						  				<div class="col-sm-8">
											<input type="text" name="" class="form-control" value="`+ value.tipo_anexo_documento + `" readonly></input>
						  				</div>
										<div class="col-sm-4">
											<button type="button" class="btn btn-warning visualizarDocumento" data-id_imagem="`+ value.id + `"><i class="fa-solid fa-image"></i> Ver
											</button>
										</div>
									</div>
									<br>
					 			</div>`;
					});

					var html_laudo_medico = ``;
					$.each(data[6], function (key, value) {
						html_laudo_medico += `<div>
												<div class="row">
													<div class="col-sm-12">
														<button type="button" class="btn btn-warning w-100 visualizarLaudoMedico" data-id_imagem="`+ value.id + `"><i class="fa-solid fa-image"></i> Ver
														</button>
													</div>
												</div>
												<br>
					 						</div>`;
					});

					var html_receita_medica = ``;
					$.each(data[7], function (key, value) {
						html_receita_medica += `<div>
													<div class="row">
														<div class="col-sm-12">
															<button type="button" class="btn btn-warning w-100 visualizarReceitaMedica" data-id_imagem="`+ value.id + `"><i class="fa-solid fa-image"></i> Ver
															</button>
														</div>
													</div>
													<br>
					 							</div>`;
					});

					var html_anexo_adicional = ``;
					$.each(data[9], function (key, value) {
						html_anexo_adicional += `<div>
													<div class="row">
														<div class="col-sm-12">
															<button type="button" class="btn btn-warning w-100 visualizarAnexoAdicional" data-id_imagem="`+ value.id + `"><i class="fa-solid fa-image"></i> Ver
															</button>
														</div>
													</div>
													<br>
					 							</div>`;
					});

					$("#documentos_pessoa_existentes").children().remove()
					$("#documentos_pessoa_existentes").append(html_documento_pessoa)

					$("#laudo_medico_existentes").children().remove()
					$("#laudo_medico_existentes").append(html_laudo_medico)

					$("#receita_medica_existentes").children().remove()
					$("#receita_medica_existentes").append(html_receita_medica)

					$("#anexos_adicionais_existentes").children().remove()
					$("#anexos_adicionais_existentes").append(html_anexo_adicional)

					$("#tipo_spa").val(tipo_spa.join());
					$("#tipo_spa").trigger('change');

					$("#tipo_pcd").val(tipo_pcd.join());
					$("#tipo_pcd").trigger('change');

					$("#tipo_beneficio").val(tipo_beneficio.join());
					$("#tipo_beneficio").trigger('change');

					$("#tipo_motivo_de_rua").val(tipo_motivo_de_rua.join());
					$("#tipo_motivo_de_rua").trigger('change');
				}
			}
		});
	});

	// $("#cpf").on("blur", function () {
	// 	if ($("#cpf").val()) {

	// 		if (validaCPF($("#cpf").val())) {
	// 			//var url = $('table').attr('url');
	// 			//alert("CPF Válido!");
	// 			$("#cpf").css("background-color", "");
	// 			// verifica_cpf_sigebe_ajax($("#cpf").val());

	// 		} else {
	// 			Swal.fire({
	// 				icon: "error",
	// 				title: "Erro no CPF",
	// 				text: "Verifique os números do CPF!",

	// 				//footer: '<a href="#">Why do I have this issue?</a>'
	// 			});
	// 			//$("#cpf").focus();
	// 			$("#cpf").css({ backgroundColor: 'NavajoWhite' });
	// 			$('#cpf').val('');
	// 		}
	// 	} else {
	// 		$("#cpf").css("background-color", "");
	// 	}
	// });

	$("#nascimento").on("blur", function () {

		var birthDate = Math.floor((new Date() - new Date($("#nascimento").val()).getTime() - 86400000) / 3.15576e+10)
		if (birthDate) {
			$("#idade").val(birthDate)
			$("#idade").attr("readonly", true)
		} else {
			$("#idade").attr("readonly", false)
			$("#idade").val('')
		}

	});

	// if ($('#tipo_de_usuario_id').val() == 3) {
	// 	$("#label_unidade_id").html("Unidade*");
	// 	$('#unidade_id').attr("required", "required");
	// 	$('#unidade_id').prop('disabled', false);
	// } else {
	// 	$("#unidade_id").val("");
	// 	$("#label_unidade_id").html("Unidade");
	// 	$('#unidade_id').prop('disabled', true);
	// 	$('#unidade_id').removeAttr("required");

	// }
});



function verifica_cpf_sigebe_ajax(cpf) {
	var url = $('#url').val();
	$.ajax({
		type: 'POST',
		url: url + 'admin/pessoas/pessoaBeneficoAtivoSigebeAjax',
		//url: "/acolher/admin/pessoas/pessoaBeneficoAtivoSigebeAjax",
		///url: "{{url('admin/pessoas/editar')}}"+id_pessoa,
		data: { cpf: cpf },
		//data:JSON.stringify(data),
		dataType: 'json',
		beforeSend: function () {
			//carregando.show().fadeIn(200);
			//botao.prop('disable', false).addClass('disabled');
		},

		success: function (data) {
			if (data.beneficios_ativos) {
				var dados = JSON.parse(data.beneficios_ativos);
				var texto = "";
				for (i = 0; i < dados.length; i++) {
					texto = texto + dados[i].nome + "<br>BE: " + dados[i].intervencao + " Status: " + dados[i].status + "<hr><br>";
				}

				Swal.fire({
					//icon: "error",
					title: "Atenção",
					html: texto,
					//footer: '<a href="#">Why do I have this issue?</a>'
				});

			} else if (data.message) {
				// Swal.fire({

				// 	title: "Atenção",
				// 	text: data.message,

				// });

			}
		}
	});

}

// $("#tipo_de_usuario_id").change(function () {
// 	if (this.value == 3) {
// 		$("#label_unidade_id").html("Unidade*");
// 		$('#unidade_id').attr("required", "required");
// 		$('#unidade_id').prop('disabled', false);
// 	} else {
// 		$("#unidade_id").val("");
// 		$("#label_unidade_id").html("Unidade");
// 		$('#unidade_id').prop('disabled', true);
// 		$('#unidade_id').removeAttr("required");

// 	}
// });

$('#cadastrar_regulacao').click(function () {
	Swal.fire({
		title: "Nenhuma pessoa encontrada!",
		text: "A pesquisa realizada não encontrou ninguém! Deseja cadastrar uma nova pessoa?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		allowOutsideClick: false,
		allowEscapeKey: false,
		cancelButtonColor: "#d33",
		confirmButtonText: "Sim, cadastrar!"
	}).then((result) => {
		if (result.isConfirmed) {
			$('#ModalCadastrarEditarPessoaSolicitacao').modal('show');
		}
	})
});


$('#ModalCadastrarEditarPessoaSolicitacao').on('shown.bs.modal', function (e) {

	var inputs = $(".select_hidden");
	$.each(inputs, function (chave, valor) {
		if ($(valor).val() == 2) {
			$('.' + $(valor).attr('id') + '_hidden').addClass('d-none');
		} else {
			$('.' + $(valor).attr('id') + '_hidden').removeClass('d-none');
		}
	});

	$('select').on("change", function (event) {
		if ($(this).hasClass('select_hidden')) {

			if ($(this).val() == 2) {
				$('.' + $(this).attr('id') + '_hidden').find('.form-control').val("").trigger("change");
				$('.' + $(this).attr('id') + '_div').children().remove();
				$('.' + $(this).attr('id') + '_hidden').addClass('d-none');
			} else {
				$('.' + $(this).attr('id') + '_hidden').removeClass('d-none');
			}
		}
	})
})

$('#ModalCadastrarAtendimentoSubsequentePedagogico').on('shown.bs.modal', function (e) {

	var inputs = $(".select_hidden");
	$.each(inputs, function (chave, valor) {
		if ($(valor).val() == 2) {
			$('.' + $(valor).attr('id') + '_hidden1').addClass('d-none');
			$('.' + $(valor).attr('id') + '_hidden1').find('.form-control').val("").trigger("change");
			$('.' + $(valor).attr('id') + '_hidden2').removeClass('d-none');
		} else {
			$('.' + $(valor).attr('id') + '_hidden2').addClass('d-none');
			$('.' + $(valor).attr('id') + '_hidden2').find('.form-control').val("").trigger("change");
			$('.' + $(valor).attr('id') + '_hidden1').removeClass('d-none');
		}
	});

	$('select').on("change", function (event) {
		if ($(this).hasClass('select_hidden')) {

			if ($(this).val() == 2) {
				$('.' + $(this).attr('id') + '_hidden1').addClass('d-none');
				$('.' + $(this).attr('id') + '_hidden1').find('.form-control').val("").trigger("change");
				$('.' + $(this).attr('id') + '_hidden2').removeClass('d-none');
			} else {
				$('.' + $(this).attr('id') + '_hidden2').addClass('d-none');
				$('.' + $(this).attr('id') + '_hidden2').find('.form-control').val("").trigger("change");
				$('.' + $(this).attr('id') + '_hidden1').removeClass('d-none');
			}
		}
	})
})

//DIAGNOSTICO FAMILIAR

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

$('#ModalCadastrarDiagnosticoFamiliar').on('shown.bs.modal', function (e) {

	var inputs = $(".select_hidden");
	$.each(inputs, function (chave, valor) {
		if ($(valor).val() == 2) {
			$('.' + $(valor).attr('id') + '_hidden').addClass('d-none');
		} else {
			$('.' + $(valor).attr('id') + '_hidden').removeClass('d-none');
		}
	});

	$('select').on("change", function (event) {
		if ($(this).hasClass('select_hidden')) {
			if ($(this).val() == 2) {
				$('.' + $(this).attr('id') + '_hidden').find('.form-control').val("").trigger("change");
				$('.' + $(this).attr('id') + '_hidden').find('.form-control').removeAttr('required')
				$('.' + $(this).attr('id') + '_div').children().remove();
				$('.' + $(this).attr('id') + '_hidden').addClass('d-none');
			} else {
				$('.' + $(this).attr('id') + '_hidden').find('.form-control').attr('required', 'required')
				$('.' + $(this).attr('id') + '_hidden').removeClass('d-none');
			}
		}
	})

	var title_first = "Deseja realmente remover esse familiar?"
	var title_second = "Removido!"
	var text_first = "Esse familiar será removido!"
	var text_second = "Familiar removido com sucesso."
	var icon_first = "warning"
	var icon_second = "success"

	$('#composicao_filhos').on("click", '.remover_filho', function (event) {
		var elemento = this
		removerElementos(elemento, event, title_first, text_first, icon_first, title_second, text_second, icon_second)
	})

	$('.remover_filho').on("click", function (event) {
		var elemento = this
		removerElementos(elemento, event, title_first, text_first, icon_first, title_second, text_second, icon_second)
	})
})

$('#ModalEntrevistaAcolhimentoDocumentacao').on('shown.bs.modal', function (e) {

	var title_first = "Deseja realmente remover essa pendência?"
	var title_second = "Removida!"
	var text_first = "Essa pendência será removida!"
	var text_second = "Pendência removida com sucesso."
	var icon_first = "warning"
	var icon_second = "success"

	$('#documentos_pendentes').on("click", '.remover_documento_pendente', function (event) {
		var elemento = this
		removerElementos(elemento, event, title_first, text_first, icon_first, title_second, text_second, icon_second)
	})

	$('.remover_documento_pendente').on("click", function (event) {
		var elemento = this
		removerElementos(elemento, event, title_first, text_first, icon_first, title_second, text_second, icon_second)
	})
})

$('#ModalCadastrarProcessoJudicial, #ModalEditarProcessoJudicial').on('shown.bs.modal', function (e) {

	var inputs = $(".select_hidden");
	$.each(inputs, function (chave, valor) {
		if ($(valor).val() == 2) {
			$('.' + $(valor).attr('id') + '_hidden').addClass('d-none');
		} else {
			$('.' + $(valor).attr('id') + '_hidden').removeClass('d-none');
		}
	});

	$('select').on("change", function (event) {
		if ($(this).hasClass('select_hidden')) {
			if ($(this).val() == 2) {
				$('.' + $(this).attr('id') + '_hidden').find('.form-control').val("").trigger("change");
				// $('.' + $(this).attr('id') + '_hidden').find('.form-control').removeAttr('required')
				$('.' + $(this).attr('id') + '_div').children().remove();
				$('.' + $(this).attr('id') + '_hidden').addClass('d-none');
			} else {
				// $('.' + $(this).attr('id') + '_hidden').find('.form-control').attr('required', 'required')
				$('.' + $(this).attr('id') + '_hidden').removeClass('d-none');
			}
		}
	})

})


//RELATO PSICOLOGICO

$('#ModalCadastrarRelatoPsicologico').on('shown.bs.modal', function (e) {

	// var inputs = $(".select_hidden");
	// $.each(inputs, function (chave, valor) {
	// 	if ($(valor).val() == 2) {
	// 		$('.' + $(valor).attr('id') + '_hidden').addClass('d-none');
	// 	} else {
	// 		$('.' + $(valor).attr('id') + '_hidden').removeClass('d-none');
	// 	}
	// });

	// $('select').on("change", function (event) {
	// 	if ($(this).hasClass('select_hidden')) {
	// 		if ($(this).val() == 2) {
	// 			$('.' + $(this).attr('id') + '_hidden').find('.form-control').val("").trigger("change");
	// 			$('.' + $(this).attr('id') + '_hidden').find('.form-control').removeAttr('required')
	// 			$('.' + $(this).attr('id') + '_div').children().remove();
	// 			$('.' + $(this).attr('id') + '_hidden').addClass('d-none');
	// 		} else {
	// 			$('.' + $(this).attr('id') + '_hidden').find('.form-control').attr('required', 'required')
	// 			$('.' + $(this).attr('id') + '_hidden').removeClass('d-none');
	// 		}
	// 	}
	// })

	//ESTUDOS PSICOLOGICOS

	var title_first_estudo_psicologico = "Deseja realmente remover esse estudo?"
	var title_second_estudo_psicologico = "Removido!"
	var text_first_estudo_psicologico = "Esse estudo será removido!"
	var text_second_estudo_psicologico = "Estudo removido com sucesso."
	var icon_first_estudo_psicologico = "warning"
	var icon_second_estudo_psicologico = "success"

	$('#estudos_psicologicos').on("click", '.remover_estudo_psicologico', function (event) {
		var elemento = this
		removerElementos(
			elemento,
			event,
			title_first_estudo_psicologico,
			text_first_estudo_psicologico,
			icon_first_estudo_psicologico,
			title_second_estudo_psicologico,
			text_second_estudo_psicologico,
			icon_second_estudo_psicologico
		)
	})

	$('.remover_estudo_psicologico').on("click", function (event) {
		var elemento = this
		removerElementos(
			elemento,
			event,
			title_first_estudo_psicologico,
			text_first_estudo_psicologico,
			icon_first_estudo_psicologico,
			title_second_estudo_psicologico,
			text_second_estudo_psicologico,
			icon_second_estudo_psicologico
		)
	})

	//AVALIACAO PROCESSUAL

	var title_first_avaliacao_processual = "Deseja realmente remover essa avaliação?"
	var title_second_avaliacao_processual = "Removida!"
	var text_first_avaliacao_processual = "Essa avaliação será removida!"
	var text_second_avaliacao_processual = "Avaliação removida com sucesso."
	var icon_first_avaliacao_processual = "warning"
	var icon_second_avaliacao_processual = "success"

	$('#avaliacao_processual').on("click", '.remover_avaliacao_processual', function (event) {
		var elemento = this
		removerElementos(
			elemento,
			event,
			title_first_avaliacao_processual,
			text_first_avaliacao_processual,
			icon_first_avaliacao_processual,
			title_second_avaliacao_processual,
			text_second_avaliacao_processual,
			icon_second_avaliacao_processual
		)
	})

	$('.remover_avaliacao_processual').on("click", function (event) {
		var elemento = this
		removerElementos(
			elemento,
			event,
			title_first_avaliacao_processual,
			text_first_avaliacao_processual,
			icon_first_avaliacao_processual,
			title_second_avaliacao_processual,
			text_second_avaliacao_processual,
			icon_second_avaliacao_processual
		)
	})
})

$('#ModalEditarRelatoPsicologico').on('shown.bs.modal', function (e) {

	//ESTUDOS PSICOLOGICOS

	var title_first_estudo_psicologico = "Deseja realmente remover esse estudo?"
	var title_second_estudo_psicologico = "Removido!"
	var text_first_estudo_psicologico = "Esse estudo será removido!"
	var text_second_estudo_psicologico = "Estudo removido com sucesso."
	var icon_first_estudo_psicologico = "warning"
	var icon_second_estudo_psicologico = "success"

	$('#estudos_psicologicos_editar').on("click", '.remover_estudo_psicologico', function (event) {
		var elemento = this
		removerElementos(
			elemento,
			event,
			title_first_estudo_psicologico,
			text_first_estudo_psicologico,
			icon_first_estudo_psicologico,
			title_second_estudo_psicologico,
			text_second_estudo_psicologico,
			icon_second_estudo_psicologico
		)
	})

	$('.remover_estudo_psicologico').on("click", function (event) {
		var elemento = this
		removerElementos(
			elemento,
			event,
			title_first_estudo_psicologico,
			text_first_estudo_psicologico,
			icon_first_estudo_psicologico,
			title_second_estudo_psicologico,
			text_second_estudo_psicologico,
			icon_second_estudo_psicologico
		)
	})

	//AVALIACAO PROCESSUAL

	var title_first_avaliacao_processual = "Deseja realmente remover essa avaliação?"
	var title_second_avaliacao_processual = "Removida!"
	var text_first_avaliacao_processual = "Essa avaliação será removida!"
	var text_second_avaliacao_processual = "Avaliação removida com sucesso."
	var icon_first_avaliacao_processual = "warning"
	var icon_second_avaliacao_processual = "success"

	$('#avaliacao_processual_editar').on("click", '.remover_avaliacao_processual', function (event) {
		var elemento = this
		removerElementos(
			elemento,
			event,
			title_first_avaliacao_processual,
			text_first_avaliacao_processual,
			icon_first_avaliacao_processual,
			title_second_avaliacao_processual,
			text_second_avaliacao_processual,
			icon_second_avaliacao_processual
		)
	})

	$('.remover_avaliacao_processual').on("click", function (event) {
		var elemento = this
		removerElementos(
			elemento,
			event,
			title_first_avaliacao_processual,
			text_first_avaliacao_processual,
			icon_first_avaliacao_processual,
			title_second_avaliacao_processual,
			text_second_avaliacao_processual,
			icon_second_avaliacao_processual
		)
	})
})

$('#cadastrarNovaPessoa').on("click", function (event) {
	$("#cadastrarPessoa").trigger('reset');
})

$('#ModalCadastrarEditarPessoaSolicitacao').on('hidden.bs.modal', function () {
	$(this).find('form').find('input[required], select[required], textarea[required]').each(function (index, element) {
		var $element = $(element);
		$element.removeClass('is-invalid');
	});
})

$(".cadastrarPessoaSolicitacao").on("click", function (event) {
	var emptyCount = 0;
	$("#cadastrarPessoa").find('input[required], select[required], textarea[required]').each(function (index, element) {
		var $element = $(element);

		if ($element.val() === '') {
			emptyCount++;
			$element.addClass('is-invalid');
			$("#ModalCadastrarEditarPessoaSolicitacao").scrollTo('.is-invalid');
		} else {
			$element.removeClass('is-invalid');
		}
	});
	if (emptyCount == 0) {
		if (!$('#cpf').val()) {
			Swal.fire({
				title: "Campo CPF vazio!",
				text: "O campo CPF não foi preenchido, tem certeza que deseja continuar?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Sim, continuar!"
			}).then((result) => {
				if (result.isConfirmed) {
					$("#cadastrarPessoa").submit();
				} else {

				}
			})
		} else {
			$("#cadastrarPessoa").submit();
		}
	}
});



