import { useEffect, useState, useCallback, useRef } from 'react';
import { StockItem, inventarioApiService } from '../services/inventario-api.service';

interface UseStockPollingOptions {
  pollingInterval?: number;
  enabled?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: (data: StockItem[]) => void;
}

/**
 * Hook personalizado para polling de stock en tiempo real
 * Usa setInterval para hacer polling cada X segundos (por defecto 10 segundos)
 */
export const useStockPolling = (options: UseStockPollingOptions = {}) => {
  const {
    pollingInterval = 10000, // 10 segundos
    enabled = true,
    onError,
    onSuccess,
  } = options;

  const [data, setData] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStock = useCallback(async () => {
    try {
      setError(null);
      const stockData = await inventarioApiService.getStockActual();
      setData(stockData);
      onSuccess?.(stockData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [onError, onSuccess]);

  // Carga inicial
  useEffect(() => {
    if (enabled) {
      fetchStock();
    }
  }, [enabled, fetchStock]);

  // Setup polling
  useEffect(() => {
    if (!enabled) {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      return;
    }

    // Configurar el intervalo de polling
    intervalIdRef.current = setInterval(fetchStock, pollingInterval);

    // Cleanup
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [enabled, pollingInterval, fetchStock]);

  // Función manual para refrescar
  const mutate = useCallback(async () => {
    await fetchStock();
  }, [fetchStock]);

  return {
    data,
    isLoading,
    error,
    mutate,
    refetch: fetchStock,
  };
};

/**
 * Hook para obtener productos con stock bajo
 */
export const useStockBajo = (threshold: number = 10) => {
  const [data, setData] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stockBajoData = await inventarioApiService.getStockBajo(threshold);
      setData(stockBajoData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [threshold]);

  // Carga inicial
  useEffect(() => {
    fetch();
  }, [fetch]);

  // Setup polling cada 10 segundos
  useEffect(() => {
    intervalIdRef.current = setInterval(fetch, 10000);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [fetch]);

  return {
    data,
    isLoading,
    error,
    refetch: fetch,
  };
};

/**
 * Hook para obtener estadísticas del inventario
 */
export const useInventarioStats = () => {
  const [stats, setStats] = useState({
    totalProductos: 0,
    productosStockBajo: 0,
    productosAgotados: 0,
    valorTotalInventario: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await inventarioApiService.getEstadisticas();
      setStats(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    fetch();
  }, [fetch]);

  // Setup polling cada 10 segundos
  useEffect(() => {
    intervalIdRef.current = setInterval(fetch, 10000);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [fetch]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetch,
  };
};
