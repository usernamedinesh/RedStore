import { QueryClient } from "@tanstack/react-query";

/* creae an client */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;
