namespace VigiSaude.Backend.Repositories.UnitOfWork;

public interface IUnitOfWork : IDisposable
{
    int Save();
    Task<int> SaveAsync();
}
