using VigiSaude.Backend.Repositories.UnitOfWork;

namespace VigiSaude.Backend.Configurations;

public static class ServiceConfigs
{
    public static WebApplicationBuilder AddServiceConfigs(this WebApplicationBuilder builder)
    {
        var CorsPolicy = "CorsPolicy";
        builder.Services.AddCors(options =>
        {
            options.AddPolicy(name: CorsPolicy, builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            });
        });

        builder.Services.AddControllers();

        builder.Services.AddTransient<IUnitOfWork, UnitOfWork>();

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        return builder;
    }
}
