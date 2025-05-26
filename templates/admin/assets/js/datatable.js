$(document).ready(function () {
    //$.fn.dataTable.moment( 'DD/MM/YYYY HH:mm:ss' );    //Formatação com Hora
    $('[data-toggle="tooltip"]').tooltip();
    var url = $('table').attr('url');

    $.extend($.fn.dataTable.defaults, {
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.3/i18n/pt-BR.json'
        },
        initComplete: function (settings, json) {
            $('[tooltip="tooltip"]').tooltip();
        }
    });

    $('#tabelaCategorias').DataTable({
        paging: false,
        columnDefs: [
            {
                targets: [-1, -2],
                orderable: false
            }
        ],
        order: [[1, 'asc']]
    });

    $('#tabelaListaDisparos').DataTable({
        paging: false,
        searching: false,
        info: false,
        columnDefs: [
            {
                targets: [-1, -2],
                orderable: false
            },
            {
                className: 'dt-center',
                targets: ['_all']
            }
        ],
        order: [[3, 'asc']]
    });

    $('#tab_relato_social').DataTable({
        paging: false,
        searching: false,
        info: false,
        columnDefs: [
            {
                targets: [-1],
                orderable: false
            },
            {
                className: 'dt-center',
                targets: ['_all']
            }
        ],
        order: [[1, 'asc']]
    });

    $('#tab_estrategia_acao_social').DataTable({
        paging: false,
        searching: false,
        info: false,
        columnDefs: [
            {
                targets: [-1],
                orderable: false
            },
            {
                className: 'dt-center',
                targets: ['_all']
            }
        ],
        order: [[1, 'asc']]
    });



    $('#tabelaPessoasAcolhidas').DataTable({
        paging: false,
        columnDefs: [
            {
                targets: [-1, -2],
                orderable: false
            },
            {
                className: 'dt-center',
                targets: ['_all']
            }
        ],
        order: [[1, 'asc']]
    });

    $('#tabelaHistoAcolhimento').DataTable({
        paging: false,
        responsive: true,
        columnDefs: [
            {
                targets: [-1, -2],
                orderable: false
            }
        ],
        order: [[1, 'asc']]
    });

    $('#tabelaHistoParcelasSigebe').DataTable({
        paging: false,
        columnDefs: [
            {
                targets: [-1, -2],
                orderable: false
            }
        ],
        order: [[1, 'asc']]
    });

    $('#tabelaSolicitacaoDeRegulacao').DataTable({
        paging: false,
        columnDefs: [
            {
                targets: [-1, -2],
                orderable: false
            },
            {
                className: 'dt-center',
                targets: ['_all']
            }
        ],
        //columns: [{ type: 'date' },null, null, null, null, null, null],
        order: [[0, 'asc']]
    });

    $('#tabelaSolicitacaoDeRegulacaoFinalizada').DataTable({
        paging: false,
        columnDefs: [
            {
                targets: [-1, -2],
                orderable: false
            },
            {
                className: 'dt-center',
                targets: ['_all']
            }
        ],
        //columns: [{ type: 'date' },null, null, null, null, null, null],
        order: [[0, 'asc']]
    });
    $('#tabelaPessoas').DataTable({
        order: [[0, 'desc']],
        processing: true,
        serverSide: true,
        ajax: {
            url: url + 'admin/pessoas/datatable',
            type: 'POST',
            error: function (xhr, resp, text) {
                console.log(xhr, resp, text);
            }
        },

        columns: [
            null,
            null,
            {
                data: null,
                render: function (data, type, row) {
                    var html = '';
                    //html += ' <a class="btn btn-dark" href="{{ url('admin/prontuario/'~acolhimento.id) }}" tooltip="tooltip" title="Prontuario">Prontuario</a>
                    html += ' <a href=" ' + url + 'admin/pessoas/editar/' + row[0] + ' " tooltip="tooltip" title="Editar"><i class="fa-solid fa-pen m-1"></i></a> ';

                    //html += '<a href=" ' + url + 'admin/pessoas/deletar/' + row[0] + ' "><i class="fa-solid fa-trash m-1" tooltip="tooltip" title="Deletar"></i></a>';

                    return html;
                }
            }
        ],
        columnDefs: [
            {
                className: 'dt-body-left',
                targets: [0, 1]
            },
            {
                className: 'dt-center',
                targets: []
            },
            {
                orderable: false,
                targets: [1, -1]
            }

        ]
    });

    $('#tabelaInstituicao').DataTable({
        order: [[0, 'desc']],
        processing: true,
        serverSide: true,
        responsive: true,
        ajax: {
            url: url + 'admin/instituicao/datatable',
            type: 'POST',
            error: function (xhr, resp, text) {
                console.log(xhr, resp, text);
            }
        },

        columns: [
            null, null, null, null,
            {
                data: null,
                render: function (data, type, row) {
                    if (!row[5]) {
                        return '<i class="fa-solid fa-circle text-success" tooltip="tooltip" title="Ativo"></i>';
                    } else {
                        return '<i class="fa-solid fa-circle text-danger" tooltip="tooltip" title="Inativo"></i>';
                    }
                }
            },
            {
                data: null,
                render: function (data, type, row) {
                    var html = '';

                    html += ' <a href=" ' + url + 'admin/unidades/listar/' + row[0] + ' " tooltip="tooltip" title="Adicionar Unidade">Unidades <i class="fa-solid fa-circle-plus"></i></a> ';

                    html += ' <a href=" ' + url + 'admin/instituicao/editar/' + row[0] + ' " tooltip="tooltip" title="Editar">Editar<i class="fa-solid fa-pen m-1"></i></a> ';


                    return html;
                }
            }
        ],
        columnDefs: [

            {
                className: 'dt-center',
                targets: [0, 1, 2, 3, 4, 5]
            },
            {
                orderable: false,
                targets: [1, -1]
            }

        ]
    });


    //TABELA USUÁRIOS

    $('#tabelaUsuarios').DataTable({

        columnDefs: [
            {
                targets: [-1, -2],
                orderable: false
            },
            {
                className: 'dt-center',
                targets: ['_all']
            }
        ],
        order: [[0, 'asc']]
    });

    //TABELA ENTIDADES

    $('#tabelaEntidades').DataTable({

        columnDefs: [
            {
                targets: [-1, -2],
                orderable: false
            },
            {
                className: 'dt-center',
                targets: ['_all']
            }
        ],
        order: [[0, 'asc']]
    });

    //TABELA ÁREA DE ATUAÇÃO

    $('#tabelaAreaAtuacao').DataTable({

        columnDefs: [
            {
                targets: [-1],
                orderable: false
            },
            {
                className: 'dt-center',
                targets: ['_all']
            }
        ],
        order: [[0, 'asc']]
    });

    //TABELA PROFESSORES

    $('#tabelaProfessores').DataTable({

        columnDefs: [
            {
                targets: [-1, -2],
                orderable: false
            },
            {
                className: 'dt-center',
                targets: ['_all']
            }
        ],
        order: [[0, 'asc']]
    });

    //TABELA ESPAÇOS

    $('#tabelaEspacos').DataTable({

        columnDefs: [
            {
                targets: [-1, -2],
                orderable: false
            },
            {
                className: 'dt-center',
                targets: ['_all']
            }
        ],
        order: [[0, 'asc']]
    });

    var dataTable = $('#tabelaTeste').dataTable({

        columnDefs: [
            {
                targets: [-1, -2],
                orderable: false
            },
            {
                className: 'dt-center',
                targets: ['_all']
            }
        ],
        order: [[0, 'asc']]
    });

    dataTable.on('search.dt', function() {

        $('.dataTables_filter input').unbind().keyup(function(e) {
          var value = $(this).val();
          value = 'true|' + value
          console.log(value);
          dataTable.fnFilter(value, null, true, false, true, true);
          
        })
    
    
      });

      $('table').find('tr').on('change', function(event) {
        // console.log($(this).index());
        //console.log(event.target.checked);
        if (event.target.checked) {
          $(event.target).attr('checked', 'checked');
          $(event.target).parent().append('<div id="true" hidden>true</div>');
        } else {
          $(event.target).removeAttr('checked');
          $(event.target).parent().find('div').remove("#haha");
    
    
        }
        //reload a specific row 
        // dataTable.api().row($(this).index()).invalidate().draw();
        //reload all row
        dataTable.api().rows().invalidate().draw();
        dataTable.fnFilter('', null, true, false, true, true);

    
      })
    

    //TABELA ALUNOS

    $('#tabelaAlunos').DataTable({

        columnDefs: [
            {
                targets: [-1],
                orderable: false
            },
            {
                className: 'dt-center',
                targets: ['_all']
            }
        ],
        order: [[0, 'asc']]
    });

    //TABELA ESPAÇOS

    $('#tabelaCursos').DataTable({

        columnDefs: [
            {
                targets: [-1, -2],
                orderable: false
            },
            {
                className: 'dt-center',
                targets: ['_all']
            }
        ],
        order: [[0, 'asc']],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.12.1/i18n/pt-BR.json"
        }
    });

    $('#tabelaUnidades').DataTable({
        paging: false,
        order: [[0, 'asc']],
        columnDefs: [

            {
                className: 'dt-center',
                targets: [0, 1, 2, 3, 4, 5]
            },

        ],

    });

    $('#tabelaVagasUnidades').DataTable({
        paging: false,
        order: [[0, 'asc']],
        columnDefs: [

            {
                className: 'dt-center',
                targets: [0, 1, 2, 3, 4, 5, 6]
            },

        ],

    });

});