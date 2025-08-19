using VigiSaude.Backend.Exceptions;

namespace VigiSaude.Backend.Configurations;

public static class ErrorHendlingConfigs
{
    public static WebApplicationBuilder AddGlobalErrorHandling(this WebApplicationBuilder builder)
    {
        builder.Services.AddProblemDetails(configure =>
        {
            configure.CustomizeProblemDetails = context =>
            {
                context.ProblemDetails.Extensions.TryAdd("requestId", context.HttpContext.TraceIdentifier);
            };
        });

        // Sempre que precisar adicionar um handler customizado para uma exceção especifica colocar ele antes do handler global
        builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

        return builder;
    }
}
