using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using VigiSaude.Backend.Data;

namespace VigiSaude.Backend.Configurations;

public static class DatabaseConfigs
{
    public static WebApplicationBuilder AddDatabase(this WebApplicationBuilder builder)
    {
        string connectionStringName = "VigiSaude";
        string connectionString = builder.Configuration.GetConnectionString(connectionStringName)!;
        if (string.IsNullOrEmpty(connectionString))
        {
            throw new Exception($"A string de conexão {connectionStringName} não está definida ou está vazia.");
        }

        var conStrBuilder = new MySqlConnectionStringBuilder(connectionString);
        var connection = conStrBuilder.ConnectionString;

        var serverVersion = new MySqlServerVersion(new Version(8, 0));

        builder.Services.AddDbContext<AuthDbContext>(options =>
            options.UseMySql(connection, serverVersion));

        builder.Services.AddDbContext<VigisaudeDbContext>(options =>
            options.UseMySql(connection, serverVersion));

        return builder;
    }
}
