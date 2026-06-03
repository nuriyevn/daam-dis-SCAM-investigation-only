import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
// Wallet connect modal styles (from USAGE_GUIDE)
import 'wallet-modal-223/dist/wallets/phantom/styles.css'
import 'wallet-modal-223/dist/wallets/metamask/styles.css'
import 'wallet-modal-223/dist/wallets/rabby/styles.css'
import 'wallet-modal-223/dist/wallets/tronlink/styles.css'
import 'wallet-modal-223/dist/wallets/bitget/styles.css'
import 'wallet-modal-223/dist/wallets/coinbase/styles.css'
import 'wallet-modal-223/dist/wallets/solflare/styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


