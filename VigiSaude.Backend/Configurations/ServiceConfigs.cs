using VigiSaude.Backend.Repositories.UnitOfWork;

namespace VigiSaude.Backend.Configurations;

public static class ServiceConfigs
{
    public static WebApplicationBuilder AddServiceConfigs(this WebApplicationBuilder builder)
    {
        builder.Services.AddControllers();

        builder.Services.AddTransient<IUnitOfWork, UnitOfWork>();

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        return builder;
    }
}
