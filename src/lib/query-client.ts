import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos - datos considerados frescos
      gcTime: 10 * 60 * 1000, // 10 minutos - tiempo en caché antes de garbage collection
      retry: 1, // Reintentar una vez en caso de error
      refetchOnWindowFocus: false, // No refetch automático al cambiar de ventana
    },
  },
});
