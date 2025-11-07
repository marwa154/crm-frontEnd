import Router from './navigation/Router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from './context/AuthContext'

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
          {/* <ScrollToTop /> */}
          <Router />
          <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>

  )
}
export default App
