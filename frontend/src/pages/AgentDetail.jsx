import { useParams } from 'react-router-dom';
import { useAgent } from '../hooks/useAgents';
import { useWallet } from '../hooks/useWallet';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const AgentDetail = () => {
  const { id } = useParams();
  const { data: agent, isLoading, error } = useAgent(id);
  const { isConnected } = useWallet();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Agent not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-12 mb-12">
        {/* Agent Image */}
        <div className="relative">
          {agent.imageUrl ? (
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={agent.imageUrl}
                alt={agent.name}
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>
          ) : (
            <div className="w-full h-[600px] bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center shadow-2xl">
              <div className="text-center">
                <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-500 font-medium">No Image Available</span>
              </div>
            </div>
          )}
        </div>

        {/* Agent Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            {agent.category && (
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                {agent.category}
              </span>
            )}
            <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {agent.name}
            </h1>
          </div>
          
          <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
            <p className="text-sm text-gray-600 mb-2 font-semibold uppercase tracking-wide">Price</p>
            <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {agent.price ? `$${agent.price.toFixed(2)}` : 'Free'}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Description</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{agent.description}</p>
          </div>

          {agent.owner && (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-bold mb-3 text-gray-900">Owner</h3>
              <p className="text-gray-600 font-mono text-sm break-all bg-[#FAFAFA] p-3 rounded-lg border border-gray-200">
                {agent.owner.walletAddress}
              </p>
            </div>
          )}

          <div className="flex gap-4 mt-auto">
            <Button
              size="lg"
              disabled={!isConnected}
              className="flex-1"
            >
              {isConnected ? 'Purchase Agent' : 'Connect Wallet to Purchase'}
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <Card className="border-0 shadow-xl">
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Agent Details
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-gradient-to-br from-gray-50 to-[#FAFAFA] rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 mb-2 font-semibold uppercase tracking-wide">Token ID</p>
              <p className="text-xl font-bold text-gray-900 font-mono">{agent.tokenId || 'Not minted'}</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-[#FAFAFA] rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 mb-2 font-semibold uppercase tracking-wide">Created</p>
              <p className="text-xl font-bold text-gray-900">
                {new Date(agent.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AgentDetail;

