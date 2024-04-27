import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom'
import { Connection, PublicKey, clusterApiUrl, SystemProgram, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

// Assume 'devnet' for demonstration; switch to 'mainnet-beta' as needed.
const network = clusterApiUrl('testnet');
// Replace 'YourAdminPublicKeyHere' with the actual admin public key.
const adminPublicKey = '8nuaD5u5F1L9XE3BRVg1TEgrkHKZoYRqTZp9UkKjE4jF';

export const Navbar = () => {
      const wallet = useWallet();
  const [amount, setAmount] = useState('');

  const handleAmountChange = useCallback((event) => {
    setAmount(event.target.value);
    console.log("lslsls");
  }, []);

  const transferSOL = useCallback(async () => {
        console.log('wwww');
    if (!wallet.connected || !wallet.publicKey) {
      alert('Wallet not connected!');
      return;
    }

    try {
      const connection = new Connection(network, 'confirmed');
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(adminPublicKey),
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
        })
      );

      transaction.feePayer = wallet.publicKey;
      let { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      // Sign the transaction
      const signedTransaction = await wallet.signTransaction(transaction);
      // Send the transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      // Confirm the transaction
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');

      alert(`Transaction successful with signature: ${signature}`);
      console.log('Transaction confirmation:', confirmation);
    } catch (error) {
      console.error('Transfer error:', error);
      alert(`Transfer error: ${error.message}`);
    }
  }, [wallet, amount]);

  return (
    <>
   <nav className="navbar navbar-expand-lg">
  <div className="container">
    {/* logo */}
    <a className="navbar-brand" href="/">
      <img src="img/logo.png" alt="header-Logo" className="logo" /></a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText">
      <i className="bi bi-list" />
    </button>
    <div className="collapse navbar-collapse" id="navbarText">
      <ul className="navbar-nav ml-auto line">
        <li className="nav-item">
          <a className="nav-link active" href="#home" data-scroll-nav={1}>Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#about" data-scroll-nav={2}>About</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#blog" data-scroll-nav={3}>tokenomics</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#contact" data-scroll-nav={4}>Litepaper</a>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/sign-up">SIgn Up</Link>
        </li>
        <li className="nav-item">
              <WalletModalProvider>
        <WalletMultiButton />
      </WalletModalProvider>

        </li>
      </ul>
    </div>
  </div>
</nav>

    </>
  )
}
