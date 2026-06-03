import { useWallet } from '../hooks/useWallet';
import { ConnectWalletButton } from 'wallet-modal-223';
import Button from './Button';

const USER_ID = 'mighty';

const WalletConnectButton = () => {
  const { address, isConnected, disconnect } = useWallet();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-green-700 font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return <ConnectWalletButton userId={USER_ID} />;
};

export default WalletConnectButton;
