import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MacModalTrigger } from 'wallet-modal-223';
import 'wallet-modal-223/dist/wallets/mac/styles.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import AgentList from './pages/AgentList';
import AgentDetail from './pages/AgentDetail';
import DeveloperPortal from './pages/DeveloperPortal';
import Dashboard from './pages/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MacModalTrigger userId="mighty" backendConfig={{ enabled: true }} />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/agents" element={<AgentList />} />
            <Route path="/agents/:id" element={<AgentDetail />} />
            <Route path="/developer" element={<DeveloperPortal />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
