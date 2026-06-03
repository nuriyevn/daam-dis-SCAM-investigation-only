import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAgents } from '../hooks/useAgents';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Input from '../components/Input';
import Button from '../components/Button';

const AgentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  
  const { data: agents, isLoading, error } = useAgents({ category });

  const filteredAgents = agents?.filter((agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading agents: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Browse AI Agents
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover powerful AI agents ready to transform your workflow
        </p>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search agents by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-6 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200 bg-[#FAFAFA] font-medium"
          >
            <option value="">All Categories</option>
            <option value="assistant">Assistant</option>
            <option value="analytics">Analytics</option>
            <option value="automation">Automation</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Agent Grid */}
      {filteredAgents.length === 0 ? (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No agents found</h3>
            <p className="text-gray-600 mb-6">Be the first to list an AI agent on the marketplace!</p>
            <Link to="/developer">
              <Button>Publish Your First Agent</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAgents.map((agent) => (
            <Link key={agent.id} to={`/agents/${agent.id}`}>
              <Card className="h-full group">
                <div className="p-0">
                  {agent.imageUrl ? (
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <img
                        src={agent.imageUrl}
                        alt={agent.name}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  ) : (
                    <div className="w-full h-56 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{agent.name}</h3>
                      {agent.category && (
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-semibold rounded-full whitespace-nowrap ml-2">
                          {agent.category}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {agent.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {agent.price ? `$${agent.price.toFixed(2)}` : 'Free'}
                        </span>
                      </div>
                      <span className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform duration-200">
                        View →
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentList;

