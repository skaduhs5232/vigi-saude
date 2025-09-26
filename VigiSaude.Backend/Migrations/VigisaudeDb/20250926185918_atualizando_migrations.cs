using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VigiSaude.Backend.Migrations.VigisaudeDb
{
    /// <inheritdoc />
    public partial class atualizando_migrations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.AlterDatabase()
            //    .Annotation("MySql:CharSet", "utf8mb4");

            //migrationBuilder.CreateTable(
            //    name: "categoriasmedicamentoqueda",
            //    columns: table => new
            //    {
            //        idCategoriaMedicamentoQueda = table.Column<int>(type: "int", nullable: false),
            //        DescricaoCatMedQueda = table.Column<string>(type: "varchar(255)", nullable: false, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => x.idCategoriaMedicamentoQueda);
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "desfechos",
            //    columns: table => new
            //    {
            //        idDesfecho = table.Column<int>(type: "int", nullable: false),
            //        DescricaoDesfecho = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => x.idDesfecho);
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "fatoresriscoqueda",
            //    columns: table => new
            //    {
            //        idFatorRiscoQueda = table.Column<int>(type: "int", nullable: false),
            //        DescricaoFator = table.Column<string>(type: "varchar(255)", nullable: false, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => x.idFatorRiscoQueda);
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "locaislesao",
            //    columns: table => new
            //    {
            //        idLocalLesao = table.Column<int>(type: "int", nullable: false),
            //        DescricaoLocal = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => x.idLocalLesao);
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "locaisqueda",
            //    columns: table => new
            //    {
            //        idLocalQueda = table.Column<int>(type: "int", nullable: false),
            //        DescricaoLocal = table.Column<string>(type: "varchar(255)", nullable: false, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => x.idLocalQueda);
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "medicamentos",
            //    columns: table => new
            //    {
            //        idMedicamento = table.Column<int>(type: "int", nullable: false)
            //            .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
            //        NomeGenerico = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        Fabricante = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        Lote = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        Validade = table.Column<DateOnly>(type: "date", nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => x.idMedicamento);
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "pacientes",
            //    columns: table => new
            //    {
            //        idPaciente = table.Column<int>(type: "int", nullable: false)
            //            .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
            //        Nome = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        Prontuario = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        Leito = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        Sexo = table.Column<string>(type: "varchar(15)", maxLength: 15, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        Peso = table.Column<decimal>(type: "decimal(10)", precision: 10, nullable: true),
            //        DataNascimento = table.Column<DateOnly>(type: "date", nullable: false),
            //        HoraNascimento = table.Column<TimeOnly>(type: "time", nullable: true),
            //        DataAdmissao = table.Column<DateOnly>(type: "date", nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => x.idPaciente);
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "setores",
            //    columns: table => new
            //    {
            //        idSetor = table.Column<int>(type: "int", nullable: false),
            //        DescricaoSetor = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => x.idSetor);
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "tiposincidente",
            //    columns: table => new
            //    {
            //        idTipoIncidente = table.Column<int>(type: "int", nullable: false),
            //        DescricaoTipoIncidente = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => x.idTipoIncidente);
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "tiposqueda",
            //    columns: table => new
            //    {
            //        idTipoQueda = table.Column<int>(type: "int", nullable: false),
            //        DescricaoTipo = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => x.idTipoQueda);
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "viasadm",
            //    columns: table => new
            //    {
            //        idViaAdm = table.Column<int>(type: "int", nullable: false),
            //        DescricaoVia = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: false, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => x.idViaAdm);
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "notificadores",
            //    columns: table => new
            //    {
            //        idNotificador = table.Column<int>(type: "int", nullable: false)
            //            .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
            //        Nome = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        CategoriaProfissional = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        Telefone = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        Email = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        Setor_idSetor = table.Column<int>(type: "int", nullable: true),
            //        FuncionarioGerenciaRisco = table.Column<bool>(type: "tinyint(1)", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => x.idNotificador);
            //        table.ForeignKey(
            //            name: "fk_Notificador_Setor1",
            //            column: x => x.Setor_idSetor,
            //            principalTable: "setores",
            //            principalColumn: "idSetor");
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "incidentes",
            //    columns: table => new
            //    {
            //        idIncidente = table.Column<int>(type: "int", nullable: false)
            //            .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
            //        Paciente_idPaciente = table.Column<int>(type: "int", nullable: false),
            //        Setor_idSetor = table.Column<int>(type: "int", nullable: false),
            //        TipoIncidente_idTipoIncidente = table.Column<int>(type: "int", nullable: false),
            //        Notificador_idNotificador = table.Column<int>(type: "int", nullable: false),
            //        DataInicio = table.Column<DateOnly>(type: "date", nullable: false),
            //        DataFim = table.Column<DateOnly>(type: "date", nullable: true),
            //        Descricao = table.Column<string>(type: "text", nullable: false, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        DataNotificacao = table.Column<DateOnly>(type: "date", nullable: true),
            //        ClassificacaoIncidente = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        ClassificacaoDano = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => x.idIncidente);
            //        table.ForeignKey(
            //            name: "fk_Incidente_Notificador1",
            //            column: x => x.Notificador_idNotificador,
            //            principalTable: "notificadores",
            //            principalColumn: "idNotificador");
            //        table.ForeignKey(
            //            name: "fk_Incidente_Paciente1",
            //            column: x => x.Paciente_idPaciente,
            //            principalTable: "pacientes",
            //            principalColumn: "idPaciente");
            //        table.ForeignKey(
            //            name: "fk_Incidente_Setor1",
            //            column: x => x.Setor_idSetor,
            //            principalTable: "setores",
            //            principalColumn: "idSetor");
            //        table.ForeignKey(
            //            name: "fk_Incidente_TipoIncidente1",
            //            column: x => x.TipoIncidente_idTipoIncidente,
            //            principalTable: "tiposincidente",
            //            principalColumn: "idTipoIncidente");
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "errosmedicacao",
            //    columns: table => new
            //    {
            //        idIncidente = table.Column<int>(type: "int", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => x.idIncidente);
            //        table.ForeignKey(
            //            name: "fk_ErroMedicacao_Incidente1",
            //            column: x => x.idIncidente,
            //            principalTable: "incidentes",
            //            principalColumn: "idIncidente");
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "flebites",
            //    columns: table => new
            //    {
            //        idIncidente = table.Column<int>(type: "int", nullable: false),
            //        Diagnóstico = table.Column<string>(type: "text", nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        GrauFlebite = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        LocalPuncao = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        QtdPuncoesAteIncidente = table.Column<int>(type: "int", nullable: true),
            //        TipoCateter = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        CalibreCateter = table.Column<string>(type: "varchar(15)", maxLength: 15, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        NumCateteresInseridos = table.Column<int>(type: "int", nullable: true),
            //        TempoPermanenciaAcesso = table.Column<decimal>(type: "decimal(10)", precision: 10, nullable: true),
            //        QtdMedVesicanteIrritante = table.Column<int>(type: "int", nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => x.idIncidente);
            //        table.ForeignKey(
            //            name: "fk_Flebite_Incidente1",
            //            column: x => x.idIncidente,
            //            principalTable: "incidentes",
            //            principalColumn: "idIncidente");
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "lesoespressao",
            //    columns: table => new
            //    {
            //        idIncidente = table.Column<int>(type: "int", nullable: false),
            //        DataPrimeiraAvaliacao = table.Column<DateOnly>(type: "date", nullable: true),
            //        ClassificacaoBraden = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        EscoreBraden = table.Column<int>(type: "int", nullable: true),
            //        Reavaliacao48h = table.Column<string>(type: "varchar(15)", maxLength: 15, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        MobilidadePrejudicada = table.Column<bool>(type: "tinyint(1)", nullable: true),
            //        ResponsávelAvaliacao = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        RegistroSAE = table.Column<string>(type: "varchar(15)", maxLength: 15, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        MudancaDecubito = table.Column<bool>(type: "tinyint(1)", nullable: true),
            //        IntervaloMudanca = table.Column<int>(type: "int", nullable: true),
            //        TempoInternacaoAteLesao = table.Column<int>(type: "int", nullable: true),
            //        LocalLesao_idLocalLesao = table.Column<int>(type: "int", nullable: true),
            //        DescricaoOutro = table.Column<string>(type: "text", nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        EstagioLesao = table.Column<string>(type: "varchar(15)", maxLength: 15, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        SuperficieDinamicaApoio = table.Column<bool>(type: "tinyint(1)", nullable: true),
            //        SolicitacaoAvaliacaoNutri = table.Column<bool>(type: "tinyint(1)", nullable: true),
            //        RegistroAvaliacaoNutri = table.Column<bool>(type: "tinyint(1)", nullable: true),
            //        RegistroAvaliacaoFisio = table.Column<bool>(type: "tinyint(1)", nullable: true),
            //        RegistroEnfermagem = table.Column<bool>(type: "tinyint(1)", nullable: true),
            //        UsoCoberturaAdequada = table.Column<string>(type: "varchar(15)", maxLength: 15, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => x.idIncidente);
            //        table.ForeignKey(
            //            name: "fk_LesaoPressao_Incidente1",
            //            column: x => x.idIncidente,
            //            principalTable: "incidentes",
            //            principalColumn: "idIncidente");
            //        table.ForeignKey(
            //            name: "fk_LesaoPressao_LocalLesao1",
            //            column: x => x.LocalLesao_idLocalLesao,
            //            principalTable: "locaislesao",
            //            principalColumn: "idLocalLesao");
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "quedas",
            //    columns: table => new
            //    {
            //        idIncidente = table.Column<int>(type: "int", nullable: false),
            //        Diagnostico = table.Column<string>(type: "text", nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        AvaliacaoRiscoAdmissao = table.Column<bool>(type: "tinyint(1)", nullable: true),
            //        RegistroOrientacaoProntuario = table.Column<bool>(type: "tinyint(1)", nullable: true),
            //        RiscoIdentificadoAdmissao = table.Column<bool>(type: "tinyint(1)", nullable: true),
            //        PacienteComAcompanhante = table.Column<bool>(type: "tinyint(1)", nullable: true),
            //        QtdMedBaixoRisco = table.Column<int>(type: "int", nullable: true),
            //        QtdMedMedioRisco = table.Column<int>(type: "int", nullable: true),
            //        QtdMedAltoRisco = table.Column<int>(type: "int", nullable: true),
            //        TipoQueda_idTipoQueda = table.Column<int>(type: "int", nullable: true),
            //        LocalQueda_idLocalQueda = table.Column<int>(type: "int", nullable: true),
            //        Horario = table.Column<TimeOnly>(type: "time", nullable: true),
            //        Turno = table.Column<string>(type: "varchar(15)", maxLength: 15, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        Desfecho = table.Column<string>(type: "text", nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => x.idIncidente);
            //        table.ForeignKey(
            //            name: "fk_Queda_Incidente1",
            //            column: x => x.idIncidente,
            //            principalTable: "incidentes",
            //            principalColumn: "idIncidente");
            //        table.ForeignKey(
            //            name: "fk_Queda_LocalQueda1",
            //            column: x => x.LocalQueda_idLocalQueda,
            //            principalTable: "locaisqueda",
            //            principalColumn: "idLocalQueda");
            //        table.ForeignKey(
            //            name: "fk_Queda_TipoQueda1",
            //            column: x => x.TipoQueda_idTipoQueda,
            //            principalTable: "tiposqueda",
            //            principalColumn: "idTipoQueda");
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "ram",
            //    columns: table => new
            //    {
            //        idIncidente = table.Column<int>(type: "int", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => x.idIncidente);
            //        table.ForeignKey(
            //            name: "fk_Ram_Incidente1",
            //            column: x => x.idIncidente,
            //            principalTable: "incidentes",
            //            principalColumn: "idIncidente");
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "errosmedicacao_has_medicamentos",
            //    columns: table => new
            //    {
            //        ErroMedicacao_idIncidente = table.Column<int>(type: "int", nullable: false),
            //        Medicamento_idMedicamento = table.Column<int>(type: "int", nullable: false),
            //        Ocorrencia = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        ResultouEfeitoNocivo = table.Column<string>(type: "varchar(15)", maxLength: 15, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        DescricaoEfeitoNocivo = table.Column<string>(type: "text", nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        CausaErro = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        Desfecho_idDesfecho = table.Column<int>(type: "int", nullable: true),
            //        ViaAdm_idViaAdm = table.Column<int>(type: "int", nullable: true),
            //        Posologia = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        DataInicioMed = table.Column<DateOnly>(type: "date", nullable: true),
            //        DataFimMed = table.Column<DateOnly>(type: "date", nullable: true),
            //        Indicacao = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => new { x.ErroMedicacao_idIncidente, x.Medicamento_idMedicamento })
            //            .Annotation("MySql:IndexPrefixLength", new[] { 0, 0 });
            //        table.ForeignKey(
            //            name: "fk_ErroMedicacao_has_Medicamento_Desfecho1",
            //            column: x => x.Desfecho_idDesfecho,
            //            principalTable: "desfechos",
            //            principalColumn: "idDesfecho");
            //        table.ForeignKey(
            //            name: "fk_ErroMedicacao_has_Medicamento_ErroMedicacao1",
            //            column: x => x.ErroMedicacao_idIncidente,
            //            principalTable: "errosmedicacao",
            //            principalColumn: "idIncidente");
            //        table.ForeignKey(
            //            name: "fk_ErroMedicacao_has_Medicamento_Medicamento1",
            //            column: x => x.Medicamento_idMedicamento,
            //            principalTable: "medicamentos",
            //            principalColumn: "idMedicamento");
            //        table.ForeignKey(
            //            name: "fk_ErroMedicacao_has_Medicamento_ViaAdm1",
            //            column: x => x.ViaAdm_idViaAdm,
            //            principalTable: "viasadm",
            //            principalColumn: "idViaAdm");
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "flebites_has_medicamentos",
            //    columns: table => new
            //    {
            //        Flebite_idIncidente = table.Column<int>(type: "int", nullable: false),
            //        Medicamento_idMedicamento = table.Column<int>(type: "int", nullable: false),
            //        Diluente = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        ModoInfusao = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => new { x.Flebite_idIncidente, x.Medicamento_idMedicamento })
            //            .Annotation("MySql:IndexPrefixLength", new[] { 0, 0 });
            //        table.ForeignKey(
            //            name: "fk_Flebite_has_Medicamento_Flebite1",
            //            column: x => x.Flebite_idIncidente,
            //            principalTable: "flebites",
            //            principalColumn: "idIncidente");
            //        table.ForeignKey(
            //            name: "fk_Flebite_has_Medicamento_Medicamento1",
            //            column: x => x.Medicamento_idMedicamento,
            //            principalTable: "medicamentos",
            //            principalColumn: "idMedicamento");
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "categoriasmedicamentoqueda_has_quedas",
            //    columns: table => new
            //    {
            //        CategoriaMedicamentoQueda_idCategoriaMedicamentoQueda = table.Column<int>(type: "int", nullable: false),
            //        Queda_idIncidente = table.Column<int>(type: "int", nullable: false),
            //        DescricaoMeds = table.Column<string>(type: "text", nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => new { x.CategoriaMedicamentoQueda_idCategoriaMedicamentoQueda, x.Queda_idIncidente })
            //            .Annotation("MySql:IndexPrefixLength", new[] { 0, 0 });
            //        table.ForeignKey(
            //            name: "fk_MedicamentoQueda_has_Queda_MedicamentoQueda1",
            //            column: x => x.CategoriaMedicamentoQueda_idCategoriaMedicamentoQueda,
            //            principalTable: "categoriasmedicamentoqueda",
            //            principalColumn: "idCategoriaMedicamentoQueda");
            //        table.ForeignKey(
            //            name: "fk_MedicamentoQueda_has_Queda_Queda1",
            //            column: x => x.Queda_idIncidente,
            //            principalTable: "quedas",
            //            principalColumn: "idIncidente");
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "fatoresriscoqueda_has_quedas",
            //    columns: table => new
            //    {
            //        FatorRiscoQueda_idFatorRiscoQueda = table.Column<int>(type: "int", nullable: false),
            //        Queda_idIncidente = table.Column<int>(type: "int", nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => new { x.FatorRiscoQueda_idFatorRiscoQueda, x.Queda_idIncidente })
            //            .Annotation("MySql:IndexPrefixLength", new[] { 0, 0 });
            //        table.ForeignKey(
            //            name: "fk_FatorRiscoQueda_has_Queda_FatorRiscoQueda1",
            //            column: x => x.FatorRiscoQueda_idFatorRiscoQueda,
            //            principalTable: "fatoresriscoqueda",
            //            principalColumn: "idFatorRiscoQueda");
            //        table.ForeignKey(
            //            name: "fk_FatorRiscoQueda_has_Queda_Queda1",
            //            column: x => x.Queda_idIncidente,
            //            principalTable: "quedas",
            //            principalColumn: "idIncidente");
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateTable(
            //    name: "ram_has_medicamentos",
            //    columns: table => new
            //    {
            //        Ram_idIncidente = table.Column<int>(type: "int", nullable: false),
            //        Medicamento_idMedicamento = table.Column<int>(type: "int", nullable: false),
            //        ViaAdm_idViaAdm = table.Column<int>(type: "int", nullable: true),
            //        Desfecho_idDesfecho = table.Column<int>(type: "int", nullable: true),
            //        AcaoAdotada = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        MedProvavelCausador = table.Column<bool>(type: "tinyint(1)", nullable: true),
            //        Posologia = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        Indicacao = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        DataInicioMed = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4"),
            //        DataFimMed = table.Column<string>(type: "varchar(45)", maxLength: 45, nullable: true, collation: "utf8mb4_0900_ai_ci")
            //            .Annotation("MySql:CharSet", "utf8mb4")
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PRIMARY", x => new { x.Ram_idIncidente, x.Medicamento_idMedicamento })
            //            .Annotation("MySql:IndexPrefixLength", new[] { 0, 0 });
            //        table.ForeignKey(
            //            name: "fk_Ram_has_Medicamento_Desfecho1",
            //            column: x => x.Desfecho_idDesfecho,
            //            principalTable: "desfechos",
            //            principalColumn: "idDesfecho");
            //        table.ForeignKey(
            //            name: "fk_Ram_has_Medicamento_Medicamento1",
            //            column: x => x.Medicamento_idMedicamento,
            //            principalTable: "medicamentos",
            //            principalColumn: "idMedicamento");
            //        table.ForeignKey(
            //            name: "fk_Ram_has_Medicamento_Ram1",
            //            column: x => x.Ram_idIncidente,
            //            principalTable: "ram",
            //            principalColumn: "idIncidente");
            //        table.ForeignKey(
            //            name: "fk_Ram_has_Medicamento_ViaAdm1",
            //            column: x => x.ViaAdm_idViaAdm,
            //            principalTable: "viasadm",
            //            principalColumn: "idViaAdm");
            //    })
            //    .Annotation("MySql:CharSet", "utf8mb4")
            //    .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateIndex(
            //    name: "DescricaoMedQueda_UNIQUE",
            //    table: "categoriasmedicamentoqueda",
            //    column: "DescricaoCatMedQueda",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "fk_MedicamentoQueda_has_Queda_MedicamentoQueda1_idx",
            //    table: "categoriasmedicamentoqueda_has_quedas",
            //    column: "CategoriaMedicamentoQueda_idCategoriaMedicamentoQueda");

            //migrationBuilder.CreateIndex(
            //    name: "fk_MedicamentoQueda_has_Queda_Queda1_idx",
            //    table: "categoriasmedicamentoqueda_has_quedas",
            //    column: "Queda_idIncidente");

            //migrationBuilder.CreateIndex(
            //    name: "DescricaoDesfecho_UNIQUE",
            //    table: "desfechos",
            //    column: "DescricaoDesfecho",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "fk_ErroMedicacao_has_Medicamento_Desfecho1_idx",
            //    table: "errosmedicacao_has_medicamentos",
            //    column: "Desfecho_idDesfecho");

            //migrationBuilder.CreateIndex(
            //    name: "fk_ErroMedicacao_has_Medicamento_ErroMedicacao1_idx",
            //    table: "errosmedicacao_has_medicamentos",
            //    column: "ErroMedicacao_idIncidente");

            //migrationBuilder.CreateIndex(
            //    name: "fk_ErroMedicacao_has_Medicamento_Medicamento1_idx",
            //    table: "errosmedicacao_has_medicamentos",
            //    column: "Medicamento_idMedicamento");

            //migrationBuilder.CreateIndex(
            //    name: "fk_ErroMedicacao_has_Medicamento_ViaAdm1_idx",
            //    table: "errosmedicacao_has_medicamentos",
            //    column: "ViaAdm_idViaAdm");

            //migrationBuilder.CreateIndex(
            //    name: "DescricaoFatores_UNIQUE",
            //    table: "fatoresriscoqueda",
            //    column: "DescricaoFator",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "fk_FatorRiscoQueda_has_Queda_FatorRiscoQueda1_idx",
            //    table: "fatoresriscoqueda_has_quedas",
            //    column: "FatorRiscoQueda_idFatorRiscoQueda");

            //migrationBuilder.CreateIndex(
            //    name: "fk_FatorRiscoQueda_has_Queda_Queda1_idx",
            //    table: "fatoresriscoqueda_has_quedas",
            //    column: "Queda_idIncidente");

            //migrationBuilder.CreateIndex(
            //    name: "fk_Flebite_has_Medicamento_Flebite1_idx",
            //    table: "flebites_has_medicamentos",
            //    column: "Flebite_idIncidente");

            //migrationBuilder.CreateIndex(
            //    name: "fk_Flebite_has_Medicamento_Medicamento1_idx",
            //    table: "flebites_has_medicamentos",
            //    column: "Medicamento_idMedicamento");

            //migrationBuilder.CreateIndex(
            //    name: "fk_Incidente_Notificador1_idx",
            //    table: "incidentes",
            //    column: "Notificador_idNotificador");

            //migrationBuilder.CreateIndex(
            //    name: "fk_Incidente_Paciente1_idx",
            //    table: "incidentes",
            //    column: "Paciente_idPaciente");

            //migrationBuilder.CreateIndex(
            //    name: "fk_Incidente_Setor1_idx",
            //    table: "incidentes",
            //    column: "Setor_idSetor");

            //migrationBuilder.CreateIndex(
            //    name: "fk_Incidente_TipoIncidente1_idx",
            //    table: "incidentes",
            //    column: "TipoIncidente_idTipoIncidente");

            //migrationBuilder.CreateIndex(
            //    name: "fk_LesaoPressao_LocalLesao1_idx",
            //    table: "lesoespressao",
            //    column: "LocalLesao_idLocalLesao");

            //migrationBuilder.CreateIndex(
            //    name: "DescricaoLocal_UNIQUE",
            //    table: "locaislesao",
            //    column: "DescricaoLocal",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "LocalQuedacol_UNIQUE",
            //    table: "locaisqueda",
            //    column: "DescricaoLocal",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "fk_Notificador_Setor1_idx",
            //    table: "notificadores",
            //    column: "Setor_idSetor");

            //migrationBuilder.CreateIndex(
            //    name: "fk_Queda_LocalQueda1_idx",
            //    table: "quedas",
            //    column: "LocalQueda_idLocalQueda");

            //migrationBuilder.CreateIndex(
            //    name: "fk_Queda_TipoQueda1_idx",
            //    table: "quedas",
            //    column: "TipoQueda_idTipoQueda");

            //migrationBuilder.CreateIndex(
            //    name: "fk_Ram_has_Medicamento_Desfecho1_idx",
            //    table: "ram_has_medicamentos",
            //    column: "Desfecho_idDesfecho");

            //migrationBuilder.CreateIndex(
            //    name: "fk_Ram_has_Medicamento_Medicamento1_idx",
            //    table: "ram_has_medicamentos",
            //    column: "Medicamento_idMedicamento");

            //migrationBuilder.CreateIndex(
            //    name: "fk_Ram_has_Medicamento_Ram1_idx",
            //    table: "ram_has_medicamentos",
            //    column: "Ram_idIncidente");

            //migrationBuilder.CreateIndex(
            //    name: "fk_Ram_has_Medicamento_ViaAdm1_idx",
            //    table: "ram_has_medicamentos",
            //    column: "ViaAdm_idViaAdm");

            //migrationBuilder.CreateIndex(
            //    name: "DescricaoSetor_UNIQUE",
            //    table: "setores",
            //    column: "DescricaoSetor",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "DescricaoTipoIncidente_UNIQUE",
            //    table: "tiposincidente",
            //    column: "DescricaoTipoIncidente",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "DescricaoTipo_UNIQUE",
            //    table: "tiposqueda",
            //    column: "DescricaoTipo",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "DescricaoVia_UNIQUE",
            //    table: "viasadm",
            //    column: "DescricaoVia",
            //    unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropTable(
            //    name: "categoriasmedicamentoqueda_has_quedas");

            //migrationBuilder.DropTable(
            //    name: "errosmedicacao_has_medicamentos");

            //migrationBuilder.DropTable(
            //    name: "fatoresriscoqueda_has_quedas");

            //migrationBuilder.DropTable(
            //    name: "flebites_has_medicamentos");

            //migrationBuilder.DropTable(
            //    name: "lesoespressao");

            //migrationBuilder.DropTable(
            //    name: "ram_has_medicamentos");

            //migrationBuilder.DropTable(
            //    name: "categoriasmedicamentoqueda");

            //migrationBuilder.DropTable(
            //    name: "errosmedicacao");

            //migrationBuilder.DropTable(
            //    name: "fatoresriscoqueda");

            //migrationBuilder.DropTable(
            //    name: "quedas");

            //migrationBuilder.DropTable(
            //    name: "flebites");

            //migrationBuilder.DropTable(
            //    name: "locaislesao");

            //migrationBuilder.DropTable(
            //    name: "desfechos");

            //migrationBuilder.DropTable(
            //    name: "medicamentos");

            //migrationBuilder.DropTable(
            //    name: "ram");

            //migrationBuilder.DropTable(
            //    name: "viasadm");

            //migrationBuilder.DropTable(
            //    name: "locaisqueda");

            //migrationBuilder.DropTable(
            //    name: "tiposqueda");

            //migrationBuilder.DropTable(
            //    name: "incidentes");

            //migrationBuilder.DropTable(
            //    name: "notificadores");

            //migrationBuilder.DropTable(
            //    name: "pacientes");

            //migrationBuilder.DropTable(
            //    name: "tiposincidente");

            //migrationBuilder.DropTable(
            //    name: "setores");
        }
    }
}
