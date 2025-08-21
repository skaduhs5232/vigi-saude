using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using VigiSaude.Backend.Models;

namespace VigiSaude.Backend.Data;

public class AuthDbContext(DbContextOptions<AuthDbContext> options) 
    : IdentityDbContext<User>(options);
