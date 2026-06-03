import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useCreateAgent } from '../hooks/useAgents';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const DeveloperPortal = () => {
  const { isConnected } = useWallet();
  const createAgent = useCreateAgent();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      await createAgent.mutateAsync({
        ...formData,
        price: parseFloat(formData.price) || 0,
      });
      alert('Agent created successfully!');
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
      });
    } catch (error) {
      alert('Error creating agent: ' + error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Developer Portal
        </h1>
        <p className="text-xl text-gray-600">
          Publish and manage your AI agents on the blockchain
        </p>
      </div>

      {!isConnected && (
        <Card className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-yellow-900 mb-1">Wallet Not Connected</h3>
              <p className="text-yellow-800">
                Please connect your wallet to publish agents on the marketplace.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="border-0 shadow-xl">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">Publish New Agent</h2>
            <p className="text-gray-600">Create and list your AI agent on the blockchain marketplace</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Agent Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter a descriptive name for your agent"
              required
            />
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe what your agent does, its capabilities, and use cases..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md resize-none"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Price (USD)"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md bg-[#FAFAFA] font-medium"
                  required
                >
                  <option value="">Select category</option>
                  <option value="assistant">Assistant</option>
                  <option value="analytics">Analytics</option>
                  <option value="automation">Automation</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <Input
              label="Image URL (optional)"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />

            <Button
              type="submit"
              size="lg"
              disabled={!isConnected || createAgent.isPending}
              className="w-full mt-8"
            >
              {createAgent.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </span>
              ) : (
                'Publish Agent'
              )}
            </Button>
          </form>
        </div>
      </Card>

      {/* My Agents Section */}
      <Card className="mt-8 border-0 shadow-xl">
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">My Agents</h2>
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">Your published agents will appear here</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DeveloperPortal;

