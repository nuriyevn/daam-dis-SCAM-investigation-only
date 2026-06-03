import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import backgroundImage from '../img/background.jpg';

const Home = () => {
  return (
    <div>
      {/* Hero Section with Background Image */}
      <section 
        className="relative min-h-screen flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-indigo-900/80"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-20">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl">
            Decentralized AI Agent
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Marketplace
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Discover, purchase, and monetize autonomous AI agents on the blockchain.
            Trustless, transparent, and built for the future of AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/agents">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
                Browse Agents
              </Button>
            </Link>
            <Link to="/developer">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Publish Agent
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 container">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
            Why Choose Our Marketplace?
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Built on cutting-edge blockchain technology for the next generation of AI
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-xl">
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Blockchain Native</h3>
                <p className="text-gray-600 leading-relaxed">
                  All agents are tokenized as NFTs, ensuring true ownership and transferability on the blockchain.
                </p>
              </div>
            </Card>
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-xl">
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Revenue Sharing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Built-in revenue distribution to creators, developers, and stakeholders automatically.
                </p>
              </div>
            </Card>
            <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-xl">
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Trustless</h3>
                <p className="text-gray-600 leading-relaxed">
                  Smart contracts handle all transactions automatically, no intermediaries needed.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 container">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-6xl font-extrabold text-white mb-3 drop-shadow-lg">0</div>
              <div className="text-xl text-blue-100 font-medium">Agents Listed</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-6xl font-extrabold text-white mb-3 drop-shadow-lg">0</div>
              <div className="text-xl text-blue-100 font-medium">Total Sales</div>
            </div>
            <div className="transform hover:scale-110 transition-transform duration-300">
              <div className="text-6xl font-extrabold text-white mb-3 drop-shadow-lg">0</div>
              <div className="text-xl text-blue-100 font-medium">Active Developers</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

