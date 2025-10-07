using Microsoft.AspNetCore.Authorization;
using VigiSaude.Backend.Configurations;
using VigiSaude.Backend.Data;
using VigiSaude.Backend.Models;
using VigiSaude.Backend.Repositories.UnitOfWork;

var builder = WebApplication.CreateBuilder(args);

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

builder.AddGlobalErrorHandling();

builder.AddDatabase();

builder.Services.AddAuthorization();

builder.Services
    .AddIdentityApiEndpoints<User>()
    .AddEntityFrameworkStores<AuthDbContext>();

builder.AddServiceConfigs();

var app = builder.Build();

app.UseExceptionHandler();

app.MapIdentityApi<User>();

app.UseCors(CorsPolicy);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
