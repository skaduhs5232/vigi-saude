using VigiSaude.Backend.Data;

namespace VigiSaude.Backend.Repositories.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly VigiSaudeContext _context;


    public UnitOfWork(VigiSaudeContext context)
    {
        _context = context;
    }

    public void Dispose()
    {
        _context.Dispose();
    }

    public int Save()
    {
        return _context.SaveChanges();
    }

    async Task<int> IUnitOfWork.SaveAsync()
    {
        return await _context.SaveChangesAsync();
    }
}
