import { useState, useEffect } from 'react';

export function useDynamicOptions<T>(
  shouldLoad: boolean,
  loadFunction: () => Promise<T[]>,
  dependencies: unknown[] = []
): [T[], boolean, Error | null] {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!shouldLoad) {
      console.log('Condição não atendida, pulando carregamento de opções dinâmicas');
      return;
    }

    let isMounted = true;
    
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Carregando opções dinâmicas...');
        const result = await loadFunction();
        
        if (isMounted) {
          setData(result);
          console.log(`Opções dinâmicas carregadas: ${result.length} itens`);
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error('Erro desconhecido');
          setError(error);
          console.error('Erro ao carregar opções dinâmicas:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldLoad, ...dependencies]);

  return [data, loading, error];
}
