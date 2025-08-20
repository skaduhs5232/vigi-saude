using Microsoft.EntityFrameworkCore;
using VigiSaude.Backend.Models;

namespace VigiSaude.Backend.Data;

public partial class VigiSaudeContext : DbContext
{
    public VigiSaudeContext()
    {
    }

    public VigiSaudeContext(DbContextOptions<VigiSaudeContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
