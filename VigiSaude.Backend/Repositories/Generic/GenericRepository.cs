using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using VigiSaude.Backend.Data;

namespace VigiSaude.Backend.Repositories.Generic;

public class GenericRepository<T>(VigisaudeDbContext context) : IGenericRepository<T> where T : class
{

    public void Add(T entity)
    {
        context.Set<T>().Add(entity);
    }

    public void AddRange(IEnumerable<T> entities)
    {
        context.Set<T>().AddRange(entities);
    }

    public IEnumerable<T> Find(Expression<Func<T, bool>> predicate)
    {
        return context.Set<T>().Where(predicate);
    }

    public IEnumerable<T> GetAll()
    {
        return context.Set<T>().ToList();
    }

    public IEnumerable<T> GetAllIncluding(params Expression<Func<T, object>>[] includeProperties)
    {
        IQueryable<T> queryable = context.Set<T>();
        foreach (Expression<Func<T, object>> includeProperty in includeProperties)
        {
            queryable = queryable.Include(includeProperty);
        }
        return queryable.ToList();
    }

    public T? GetById(int id)
    {
        return context.Set<T>().Find(id);
    }

    public void Remove(T entity)
    {
        context.Set<T>().Remove(entity);
    }

    public void RemoveRange(IEnumerable<T> entities)
    {
        context.Set<T>().RemoveRange(entities);
    }

    public void Update(T entity)
    {
        context.Set<T>().Update(entity);
    }
}
