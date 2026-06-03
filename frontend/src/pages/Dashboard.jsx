import { useWallet } from '../hooks/useWallet';
import Card from '../components/Card';

const Dashboard = () => {
  const { address, isConnected } = useWallet();

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 text-lg">Please connect your wallet to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-xl text-gray-600">Manage your agents, purchases, and transactions</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600">
          <div className="p-6 text-white">
            <p className="text-blue-100 mb-2 font-semibold">Total Agents</p>
            <p className="text-4xl font-extrabold">0</p>
          </div>
        </Card>
        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600">
          <div className="p-6 text-white">
            <p className="text-purple-100 mb-2 font-semibold">Purchased</p>
            <p className="text-4xl font-extrabold">0</p>
          </div>
        </Card>
        <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-500 to-indigo-600">
          <div className="p-6 text-white">
            <p className="text-indigo-100 mb-2 font-semibold">Revenue</p>
            <p className="text-4xl font-extrabold">$0</p>
          </div>
        </Card>
      </div>

      {/* User Info */}
      <Card className="mb-8 border-0 shadow-xl">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Profile</h2>
          <div className="p-6 bg-gradient-to-br from-gray-50 to-[#FAFAFA] rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600 mb-2 font-semibold uppercase tracking-wide">Wallet Address</p>
            <p className="font-mono text-base break-all bg-[#FAFAFA] p-4 rounded-lg border border-gray-200 text-gray-900">{address}</p>
          </div>
        </div>
      </Card>

      {/* Purchased Agents */}
      <Card className="mb-8 border-0 shadow-xl">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Purchased Agents</h2>
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">You haven&apos;t purchased any agents yet.</p>
          </div>
        </div>
      </Card>

      {/* Transaction History */}
      <Card className="border-0 shadow-xl">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Transaction History</h2>
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">No transactions yet.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

