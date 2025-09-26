using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;
using VigiSaude.Backend.Models;

namespace VigiSaude.Backend.Data;

public partial class VigisaudeDbContext : DbContext
{
    public VigisaudeDbContext()
    {
    }

    public VigisaudeDbContext(DbContextOptions<VigisaudeDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CategoriasmedicamentoquedaHasQueda> CategoriasmedicamentoquedaHasQuedas { get; set; }

    public virtual DbSet<Categoriasmedicamentoquedum> Categoriasmedicamentoqueda { get; set; }

    public virtual DbSet<Desfecho> Desfechos { get; set; }

    public virtual DbSet<Errosmedicacao> Errosmedicacaos { get; set; }

    public virtual DbSet<ErrosmedicacaoHasMedicamento> ErrosmedicacaoHasMedicamentos { get; set; }

    public virtual DbSet<Fatoresriscoquedum> Fatoresriscoqueda { get; set; }

    public virtual DbSet<Flebite> Flebites { get; set; }

    public virtual DbSet<FlebitesHasMedicamento> FlebitesHasMedicamentos { get; set; }

    public virtual DbSet<Incidente> Incidentes { get; set; }

    public virtual DbSet<Lesoespressao> Lesoespressaos { get; set; }

    public virtual DbSet<Locaislesao> Locaislesaos { get; set; }

    public virtual DbSet<Locaisquedum> Locaisqueda { get; set; }

    public virtual DbSet<Medicamento> Medicamentos { get; set; }

    public virtual DbSet<Notificadore> Notificadores { get; set; }

    public virtual DbSet<Paciente> Pacientes { get; set; }

    public virtual DbSet<Queda> Quedas { get; set; }

    public virtual DbSet<Ram> Rams { get; set; }

    public virtual DbSet<RamHasMedicamento> RamHasMedicamentos { get; set; }

    public virtual DbSet<Setore> Setores { get; set; }

    public virtual DbSet<Tiposincidente> Tiposincidentes { get; set; }

    public virtual DbSet<Tiposquedum> Tiposqueda { get; set; }

    public virtual DbSet<Viasadm> Viasadms { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;port=3306;database=vigisaude_db;uid=vigi_saude;pwd=Vigisaude@2025", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.41-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<CategoriasmedicamentoquedaHasQueda>(entity =>
        {
            entity.HasKey(e => new { e.CategoriaMedicamentoQuedaIdCategoriaMedicamentoQueda, e.QuedaIdIncidente })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.ToTable("categoriasmedicamentoqueda_has_quedas");

            entity.HasIndex(e => e.CategoriaMedicamentoQuedaIdCategoriaMedicamentoQueda, "fk_MedicamentoQueda_has_Queda_MedicamentoQueda1_idx");

            entity.HasIndex(e => e.QuedaIdIncidente, "fk_MedicamentoQueda_has_Queda_Queda1_idx");

            entity.Property(e => e.CategoriaMedicamentoQuedaIdCategoriaMedicamentoQueda).HasColumnName("CategoriaMedicamentoQueda_idCategoriaMedicamentoQueda");
            entity.Property(e => e.QuedaIdIncidente).HasColumnName("Queda_idIncidente");
            entity.Property(e => e.DescricaoMeds).HasColumnType("text");

            entity.HasOne(d => d.CategoriaMedicamentoQuedaIdCategoriaMedicamentoQuedaNavigation).WithMany(p => p.CategoriasmedicamentoquedaHasQueda)
                .HasForeignKey(d => d.CategoriaMedicamentoQuedaIdCategoriaMedicamentoQueda)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_MedicamentoQueda_has_Queda_MedicamentoQueda1");

            entity.HasOne(d => d.QuedaIdIncidenteNavigation).WithMany(p => p.CategoriasmedicamentoquedaHasQueda)
                .HasForeignKey(d => d.QuedaIdIncidente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_MedicamentoQueda_has_Queda_Queda1");
        });

        modelBuilder.Entity<Categoriasmedicamentoquedum>(entity =>
        {
            entity.HasKey(e => e.IdCategoriaMedicamentoQueda).HasName("PRIMARY");

            entity.ToTable("categoriasmedicamentoqueda");

            entity.HasIndex(e => e.DescricaoCatMedQueda, "DescricaoMedQueda_UNIQUE").IsUnique();

            entity.Property(e => e.IdCategoriaMedicamentoQueda)
                .ValueGeneratedNever()
                .HasColumnName("idCategoriaMedicamentoQueda");
        });

        modelBuilder.Entity<Desfecho>(entity =>
        {
            entity.HasKey(e => e.IdDesfecho).HasName("PRIMARY");

            entity.ToTable("desfechos");

            entity.HasIndex(e => e.DescricaoDesfecho, "DescricaoDesfecho_UNIQUE").IsUnique();

            entity.Property(e => e.IdDesfecho)
                .ValueGeneratedNever()
                .HasColumnName("idDesfecho");
            entity.Property(e => e.DescricaoDesfecho).HasMaxLength(45);
        });

        modelBuilder.Entity<Errosmedicacao>(entity =>
        {
            entity.HasKey(e => e.IdIncidente).HasName("PRIMARY");

            entity.ToTable("errosmedicacao");

            entity.Property(e => e.IdIncidente)
                .ValueGeneratedNever()
                .HasColumnName("idIncidente");

            entity.HasOne(d => d.IdIncidenteNavigation).WithOne(p => p.Errosmedicacao)
                .HasForeignKey<Errosmedicacao>(d => d.IdIncidente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ErroMedicacao_Incidente1");
        });

        modelBuilder.Entity<ErrosmedicacaoHasMedicamento>(entity =>
        {
            entity.HasKey(e => new { e.ErroMedicacaoIdIncidente, e.MedicamentoIdMedicamento })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.ToTable("errosmedicacao_has_medicamentos");

            entity.HasIndex(e => e.DesfechoIdDesfecho, "fk_ErroMedicacao_has_Medicamento_Desfecho1_idx");

            entity.HasIndex(e => e.ErroMedicacaoIdIncidente, "fk_ErroMedicacao_has_Medicamento_ErroMedicacao1_idx");

            entity.HasIndex(e => e.MedicamentoIdMedicamento, "fk_ErroMedicacao_has_Medicamento_Medicamento1_idx");

            entity.HasIndex(e => e.ViaAdmIdViaAdm, "fk_ErroMedicacao_has_Medicamento_ViaAdm1_idx");

            entity.Property(e => e.ErroMedicacaoIdIncidente).HasColumnName("ErroMedicacao_idIncidente");
            entity.Property(e => e.MedicamentoIdMedicamento).HasColumnName("Medicamento_idMedicamento");
            entity.Property(e => e.CausaErro).HasMaxLength(45);
            entity.Property(e => e.DescricaoEfeitoNocivo).HasColumnType("text");
            entity.Property(e => e.DesfechoIdDesfecho).HasColumnName("Desfecho_idDesfecho");
            entity.Property(e => e.Indicacao).HasMaxLength(45);
            entity.Property(e => e.Ocorrencia).HasMaxLength(45);
            entity.Property(e => e.Posologia).HasMaxLength(45);
            entity.Property(e => e.ResultouEfeitoNocivo).HasMaxLength(15);
            entity.Property(e => e.ViaAdmIdViaAdm).HasColumnName("ViaAdm_idViaAdm");

            entity.HasOne(d => d.DesfechoIdDesfechoNavigation).WithMany(p => p.ErrosmedicacaoHasMedicamentos)
                .HasForeignKey(d => d.DesfechoIdDesfecho)
                .HasConstraintName("fk_ErroMedicacao_has_Medicamento_Desfecho1");

            entity.HasOne(d => d.ErroMedicacaoIdIncidenteNavigation).WithMany(p => p.ErrosmedicacaoHasMedicamentos)
                .HasForeignKey(d => d.ErroMedicacaoIdIncidente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ErroMedicacao_has_Medicamento_ErroMedicacao1");

            entity.HasOne(d => d.MedicamentoIdMedicamentoNavigation).WithMany(p => p.ErrosmedicacaoHasMedicamentos)
                .HasForeignKey(d => d.MedicamentoIdMedicamento)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ErroMedicacao_has_Medicamento_Medicamento1");

            entity.HasOne(d => d.ViaAdmIdViaAdmNavigation).WithMany(p => p.ErrosmedicacaoHasMedicamentos)
                .HasForeignKey(d => d.ViaAdmIdViaAdm)
                .HasConstraintName("fk_ErroMedicacao_has_Medicamento_ViaAdm1");
        });

        modelBuilder.Entity<Fatoresriscoquedum>(entity =>
        {
            entity.HasKey(e => e.IdFatorRiscoQueda).HasName("PRIMARY");

            entity.ToTable("fatoresriscoqueda");

            entity.HasIndex(e => e.DescricaoFator, "DescricaoFatores_UNIQUE").IsUnique();

            entity.Property(e => e.IdFatorRiscoQueda)
                .ValueGeneratedNever()
                .HasColumnName("idFatorRiscoQueda");

            entity.HasMany(d => d.QuedaIdIncidentes).WithMany(p => p.FatorRiscoQuedaIdFatorRiscoQueda)
                .UsingEntity<Dictionary<string, object>>(
                    "FatoresriscoquedaHasQueda",
                    r => r.HasOne<Queda>().WithMany()
                        .HasForeignKey("QuedaIdIncidente")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("fk_FatorRiscoQueda_has_Queda_Queda1"),
                    l => l.HasOne<Fatoresriscoquedum>().WithMany()
                        .HasForeignKey("FatorRiscoQuedaIdFatorRiscoQueda")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("fk_FatorRiscoQueda_has_Queda_FatorRiscoQueda1"),
                    j =>
                    {
                        j.HasKey("FatorRiscoQuedaIdFatorRiscoQueda", "QuedaIdIncidente")
                            .HasName("PRIMARY")
                            .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });
                        j.ToTable("fatoresriscoqueda_has_quedas");
                        j.HasIndex(new[] { "FatorRiscoQuedaIdFatorRiscoQueda" }, "fk_FatorRiscoQueda_has_Queda_FatorRiscoQueda1_idx");
                        j.HasIndex(new[] { "QuedaIdIncidente" }, "fk_FatorRiscoQueda_has_Queda_Queda1_idx");
                        j.IndexerProperty<int>("FatorRiscoQuedaIdFatorRiscoQueda").HasColumnName("FatorRiscoQueda_idFatorRiscoQueda");
                        j.IndexerProperty<int>("QuedaIdIncidente").HasColumnName("Queda_idIncidente");
                    });
        });

        modelBuilder.Entity<Flebite>(entity =>
        {
            entity.HasKey(e => e.IdIncidente).HasName("PRIMARY");

            entity.ToTable("flebites");

            entity.Property(e => e.IdIncidente)
                .ValueGeneratedOnAdd()
                .HasColumnName("idIncidente");
            entity.Property(e => e.CalibreCateter).HasMaxLength(15);
            entity.Property(e => e.Diagnóstico).HasColumnType("text");
            entity.Property(e => e.GrauFlebite).HasMaxLength(100);
            entity.Property(e => e.LocalPuncao).HasMaxLength(45);
            entity.Property(e => e.TempoPermanenciaAcesso).HasPrecision(10);
            entity.Property(e => e.TipoCateter).HasMaxLength(45);

            entity.HasOne(d => d.IdIncidenteNavigation).WithOne(p => p.Flebite)
                .HasForeignKey<Flebite>(d => d.IdIncidente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Flebite_Incidente1");
        });

        modelBuilder.Entity<FlebitesHasMedicamento>(entity =>
        {
            entity.HasKey(e => new { e.FlebiteIdIncidente, e.MedicamentoIdMedicamento })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.ToTable("flebites_has_medicamentos");

            entity.HasIndex(e => e.FlebiteIdIncidente, "fk_Flebite_has_Medicamento_Flebite1_idx");

            entity.HasIndex(e => e.MedicamentoIdMedicamento, "fk_Flebite_has_Medicamento_Medicamento1_idx");

            entity.Property(e => e.FlebiteIdIncidente).HasColumnName("Flebite_idIncidente");
            entity.Property(e => e.MedicamentoIdMedicamento).HasColumnName("Medicamento_idMedicamento");
            entity.Property(e => e.Diluente).HasMaxLength(45);
            entity.Property(e => e.ModoInfusao).HasMaxLength(100);

            entity.HasOne(d => d.FlebiteIdIncidenteNavigation).WithMany(p => p.FlebitesHasMedicamentos)
                .HasForeignKey(d => d.FlebiteIdIncidente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Flebite_has_Medicamento_Flebite1");

            entity.HasOne(d => d.MedicamentoIdMedicamentoNavigation).WithMany(p => p.FlebitesHasMedicamentos)
                .HasForeignKey(d => d.MedicamentoIdMedicamento)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Flebite_has_Medicamento_Medicamento1");
        });

        modelBuilder.Entity<Incidente>(entity =>
        {
            entity.HasKey(e => e.IdIncidente).HasName("PRIMARY");

            entity.ToTable("incidentes");

            entity.HasIndex(e => e.NotificadorIdNotificador, "fk_Incidente_Notificador1_idx");

            entity.HasIndex(e => e.PacienteIdPaciente, "fk_Incidente_Paciente1_idx");

            entity.HasIndex(e => e.SetorIdSetor, "fk_Incidente_Setor1_idx");

            entity.HasIndex(e => e.TipoIncidenteIdTipoIncidente, "fk_Incidente_TipoIncidente1_idx");

            entity.Property(e => e.IdIncidente).HasColumnName("idIncidente");
            entity.Property(e => e.ClassificacaoDano).HasMaxLength(45);
            entity.Property(e => e.ClassificacaoIncidente).HasMaxLength(45);
            entity.Property(e => e.Descricao).HasColumnType("text");
            entity.Property(e => e.NotificadorIdNotificador).HasColumnName("Notificador_idNotificador");
            entity.Property(e => e.PacienteIdPaciente).HasColumnName("Paciente_idPaciente");
            entity.Property(e => e.SetorIdSetor).HasColumnName("Setor_idSetor");
            entity.Property(e => e.TipoIncidenteIdTipoIncidente).HasColumnName("TipoIncidente_idTipoIncidente");

            entity.HasOne(d => d.NotificadorIdNotificadorNavigation).WithMany(p => p.Incidentes)
                .HasForeignKey(d => d.NotificadorIdNotificador)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Incidente_Notificador1");

            entity.HasOne(d => d.PacienteIdPacienteNavigation).WithMany(p => p.Incidentes)
                .HasForeignKey(d => d.PacienteIdPaciente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Incidente_Paciente1");

            entity.HasOne(d => d.SetorIdSetorNavigation).WithMany(p => p.Incidentes)
                .HasForeignKey(d => d.SetorIdSetor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Incidente_Setor1");

            entity.HasOne(d => d.TipoIncidenteIdTipoIncidenteNavigation).WithMany(p => p.Incidentes)
                .HasForeignKey(d => d.TipoIncidenteIdTipoIncidente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Incidente_TipoIncidente1");
        });

        modelBuilder.Entity<Lesoespressao>(entity =>
        {
            entity.HasKey(e => e.IdIncidente).HasName("PRIMARY");

            entity.ToTable("lesoespressao");

            entity.HasIndex(e => e.LocalLesaoIdLocalLesao, "fk_LesaoPressao_LocalLesao1_idx");

            entity.Property(e => e.IdIncidente)
                .ValueGeneratedNever()
                .HasColumnName("idIncidente");
            entity.Property(e => e.ClassificacaoBraden).HasMaxLength(45);
            entity.Property(e => e.DescricaoOutro).HasColumnType("text");
            entity.Property(e => e.EstagioLesao).HasMaxLength(15);
            entity.Property(e => e.LocalLesaoIdLocalLesao).HasColumnName("LocalLesao_idLocalLesao");
            entity.Property(e => e.Reavaliacao48h).HasMaxLength(15);
            entity.Property(e => e.RegistroSae)
                .HasMaxLength(15)
                .HasColumnName("RegistroSAE");
            entity.Property(e => e.ResponsávelAvaliacao).HasMaxLength(20);
            entity.Property(e => e.UsoCoberturaAdequada).HasMaxLength(15);

            entity.HasOne(d => d.IdIncidenteNavigation).WithOne(p => p.Lesoespressao)
                .HasForeignKey<Lesoespressao>(d => d.IdIncidente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_LesaoPressao_Incidente1");

            entity.HasOne(d => d.LocalLesaoIdLocalLesaoNavigation).WithMany(p => p.Lesoespressaos)
                .HasForeignKey(d => d.LocalLesaoIdLocalLesao)
                .HasConstraintName("fk_LesaoPressao_LocalLesao1");
        });

        modelBuilder.Entity<Locaislesao>(entity =>
        {
            entity.HasKey(e => e.IdLocalLesao).HasName("PRIMARY");

            entity.ToTable("locaislesao");

            entity.HasIndex(e => e.DescricaoLocal, "DescricaoLocal_UNIQUE").IsUnique();

            entity.Property(e => e.IdLocalLesao)
                .ValueGeneratedNever()
                .HasColumnName("idLocalLesao");
            entity.Property(e => e.DescricaoLocal).HasMaxLength(45);
        });

        modelBuilder.Entity<Locaisquedum>(entity =>
        {
            entity.HasKey(e => e.IdLocalQueda).HasName("PRIMARY");

            entity.ToTable("locaisqueda");

            entity.HasIndex(e => e.DescricaoLocal, "LocalQuedacol_UNIQUE").IsUnique();

            entity.Property(e => e.IdLocalQueda)
                .ValueGeneratedNever()
                .HasColumnName("idLocalQueda");
        });

        modelBuilder.Entity<Medicamento>(entity =>
        {
            entity.HasKey(e => e.IdMedicamento).HasName("PRIMARY");

            entity.ToTable("medicamentos");

            entity.Property(e => e.IdMedicamento).HasColumnName("idMedicamento");
            entity.Property(e => e.Fabricante).HasMaxLength(45);
            entity.Property(e => e.Lote).HasMaxLength(45);
            entity.Property(e => e.NomeGenerico).HasMaxLength(45);
        });

        modelBuilder.Entity<Notificadore>(entity =>
        {
            entity.HasKey(e => e.IdNotificador).HasName("PRIMARY");

            entity.ToTable("notificadores");

            entity.HasIndex(e => e.SetorIdSetor, "fk_Notificador_Setor1_idx");

            entity.Property(e => e.IdNotificador).HasColumnName("idNotificador");
            entity.Property(e => e.CategoriaProfissional).HasMaxLength(45);
            entity.Property(e => e.Email).HasMaxLength(45);
            entity.Property(e => e.Nome).HasMaxLength(45);
            entity.Property(e => e.SetorIdSetor).HasColumnName("Setor_idSetor");
            entity.Property(e => e.Telefone).HasMaxLength(45);

            entity.HasOne(d => d.SetorIdSetorNavigation).WithMany(p => p.Notificadores)
                .HasForeignKey(d => d.SetorIdSetor)
                .HasConstraintName("fk_Notificador_Setor1");
        });

        modelBuilder.Entity<Paciente>(entity =>
        {
            entity.HasKey(e => e.IdPaciente).HasName("PRIMARY");

            entity.ToTable("pacientes");

            entity.Property(e => e.IdPaciente).HasColumnName("idPaciente");
            entity.Property(e => e.HoraNascimento).HasColumnType("time");
            entity.Property(e => e.Leito).HasMaxLength(10);
            entity.Property(e => e.Nome).HasMaxLength(45);
            entity.Property(e => e.Peso).HasPrecision(10);
            entity.Property(e => e.Prontuario).HasMaxLength(45);
            entity.Property(e => e.Sexo).HasMaxLength(15);
        });

        modelBuilder.Entity<Queda>(entity =>
        {
            entity.HasKey(e => e.IdIncidente).HasName("PRIMARY");

            entity.ToTable("quedas");

            entity.HasIndex(e => e.LocalQuedaIdLocalQueda, "fk_Queda_LocalQueda1_idx");

            entity.HasIndex(e => e.TipoQuedaIdTipoQueda, "fk_Queda_TipoQueda1_idx");

            entity.Property(e => e.IdIncidente)
                .ValueGeneratedNever()
                .HasColumnName("idIncidente");
            entity.Property(e => e.Desfecho).HasColumnType("text");
            entity.Property(e => e.Diagnostico).HasColumnType("text");
            entity.Property(e => e.Horario).HasColumnType("time");
            entity.Property(e => e.LocalQuedaIdLocalQueda).HasColumnName("LocalQueda_idLocalQueda");
            entity.Property(e => e.TipoQuedaIdTipoQueda).HasColumnName("TipoQueda_idTipoQueda");
            entity.Property(e => e.Turno).HasMaxLength(15);

            entity.HasOne(d => d.IdIncidenteNavigation).WithOne(p => p.Queda)
                .HasForeignKey<Queda>(d => d.IdIncidente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Queda_Incidente1");

            entity.HasOne(d => d.LocalQuedaIdLocalQuedaNavigation).WithMany(p => p.Queda)
                .HasForeignKey(d => d.LocalQuedaIdLocalQueda)
                .HasConstraintName("fk_Queda_LocalQueda1");

            entity.HasOne(d => d.TipoQuedaIdTipoQuedaNavigation).WithMany(p => p.Queda)
                .HasForeignKey(d => d.TipoQuedaIdTipoQueda)
                .HasConstraintName("fk_Queda_TipoQueda1");
        });

        modelBuilder.Entity<Ram>(entity =>
        {
            entity.HasKey(e => e.IdIncidente).HasName("PRIMARY");

            entity.ToTable("ram");

            entity.Property(e => e.IdIncidente)
                .ValueGeneratedNever()
                .HasColumnName("idIncidente");

            entity.HasOne(d => d.IdIncidenteNavigation).WithOne(p => p.Ram)
                .HasForeignKey<Ram>(d => d.IdIncidente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Ram_Incidente1");
        });

        modelBuilder.Entity<RamHasMedicamento>(entity =>
        {
            entity.HasKey(e => new { e.RamIdIncidente, e.MedicamentoIdMedicamento })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.ToTable("ram_has_medicamentos");

            entity.HasIndex(e => e.DesfechoIdDesfecho, "fk_Ram_has_Medicamento_Desfecho1_idx");

            entity.HasIndex(e => e.MedicamentoIdMedicamento, "fk_Ram_has_Medicamento_Medicamento1_idx");

            entity.HasIndex(e => e.RamIdIncidente, "fk_Ram_has_Medicamento_Ram1_idx");

            entity.HasIndex(e => e.ViaAdmIdViaAdm, "fk_Ram_has_Medicamento_ViaAdm1_idx");

            entity.Property(e => e.RamIdIncidente).HasColumnName("Ram_idIncidente");
            entity.Property(e => e.MedicamentoIdMedicamento).HasColumnName("Medicamento_idMedicamento");
            entity.Property(e => e.AcaoAdotada).HasMaxLength(45);
            entity.Property(e => e.DataFimMed).HasMaxLength(45);
            entity.Property(e => e.DataInicioMed).HasMaxLength(45);
            entity.Property(e => e.DesfechoIdDesfecho).HasColumnName("Desfecho_idDesfecho");
            entity.Property(e => e.Indicacao).HasMaxLength(45);
            entity.Property(e => e.Posologia).HasMaxLength(45);
            entity.Property(e => e.ViaAdmIdViaAdm).HasColumnName("ViaAdm_idViaAdm");

            entity.HasOne(d => d.DesfechoIdDesfechoNavigation).WithMany(p => p.RamHasMedicamentos)
                .HasForeignKey(d => d.DesfechoIdDesfecho)
                .HasConstraintName("fk_Ram_has_Medicamento_Desfecho1");

            entity.HasOne(d => d.MedicamentoIdMedicamentoNavigation).WithMany(p => p.RamHasMedicamentos)
                .HasForeignKey(d => d.MedicamentoIdMedicamento)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Ram_has_Medicamento_Medicamento1");

            entity.HasOne(d => d.RamIdIncidenteNavigation).WithMany(p => p.RamHasMedicamentos)
                .HasForeignKey(d => d.RamIdIncidente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Ram_has_Medicamento_Ram1");

            entity.HasOne(d => d.ViaAdmIdViaAdmNavigation).WithMany(p => p.RamHasMedicamentos)
                .HasForeignKey(d => d.ViaAdmIdViaAdm)
                .HasConstraintName("fk_Ram_has_Medicamento_ViaAdm1");
        });

        modelBuilder.Entity<Setore>(entity =>
        {
            entity.HasKey(e => e.IdSetor).HasName("PRIMARY");

            entity.ToTable("setores");

            entity.HasIndex(e => e.DescricaoSetor, "DescricaoSetor_UNIQUE").IsUnique();

            entity.Property(e => e.IdSetor)
                .ValueGeneratedNever()
                .HasColumnName("idSetor");
            entity.Property(e => e.DescricaoSetor).HasMaxLength(45);
        });

        modelBuilder.Entity<Tiposincidente>(entity =>
        {
            entity.HasKey(e => e.IdTipoIncidente).HasName("PRIMARY");

            entity.ToTable("tiposincidente");

            entity.HasIndex(e => e.DescricaoTipoIncidente, "DescricaoTipoIncidente_UNIQUE").IsUnique();

            entity.Property(e => e.IdTipoIncidente)
                .ValueGeneratedNever()
                .HasColumnName("idTipoIncidente");
            entity.Property(e => e.DescricaoTipoIncidente).HasMaxLength(45);
        });

        modelBuilder.Entity<Tiposquedum>(entity =>
        {
            entity.HasKey(e => e.IdTipoQueda).HasName("PRIMARY");

            entity.ToTable("tiposqueda");

            entity.HasIndex(e => e.DescricaoTipo, "DescricaoTipo_UNIQUE").IsUnique();

            entity.Property(e => e.IdTipoQueda)
                .ValueGeneratedNever()
                .HasColumnName("idTipoQueda");
            entity.Property(e => e.DescricaoTipo).HasMaxLength(45);
        });

        modelBuilder.Entity<Viasadm>(entity =>
        {
            entity.HasKey(e => e.IdViaAdm).HasName("PRIMARY");

            entity.ToTable("viasadm");

            entity.HasIndex(e => e.DescricaoVia, "DescricaoVia_UNIQUE").IsUnique();

            entity.Property(e => e.IdViaAdm)
                .ValueGeneratedNever()
                .HasColumnName("idViaAdm");
            entity.Property(e => e.DescricaoVia).HasMaxLength(45);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
