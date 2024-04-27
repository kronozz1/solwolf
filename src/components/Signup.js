import React, { useState } from "react";
import { Emailpattern } from "../pattern/Pattern";
import { signupUser } from "../services/user";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Navbar } from "./Navbar";
import bs58 from "bs58"; // First, install bs58 with npm install bs58
import {
  Keypair,
  Connection,
  PublicKey,
  clusterApiUrl,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import {
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { Token } from "@solana/spl-token";
import "@solana/wallet-adapter-react-ui/styles.css";
const network = clusterApiUrl("devnet");
// Replace 'YourAdminPublicKeyHere' with the actual admin public key.
const adminPublicKey = "6ND8sqt218mbn8PC8SfZzNytJBfxra1NVWk4wuaRy6PS";
const adminPublicKeyStr = "6ND8sqt218mbn8PC8SfZzNytJBfxra1NVWk4wuaRy6PS";
const tokenMintAddressStr = "D2vmbUsTJnLA4cG1gp9aSpuDCmiWDyg5sTPdMUQKRYiD";



export const Signup = () => {
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
      const wallet = useWallet();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const err = "This field is required";
    const { value } = e.target;

    setEmail(value);

    if (value == "") {
      setEmailErr(err);
    } else {
      if (!Emailpattern.test(value)) {
        setEmailErr("Please enter valid email");
      } else {
        setEmailErr("");
      }
    }
  };
    const transferTokens = async (recipientAddresss, amountTotransfer) => {
          if (!wallet.connected || !wallet.publicKey) {
      alert("Wallet not connected!");
      return;
    }
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const base58PrivateKey =
      "2Q8p2ArsiChGj5uqVLbfvnPgikNoB62VWsLihmwSgh5YgqEWTs4euYaLue3SZqfYoCyUyofSzA6HnUaRApeKo7vY";
    const secretKeyUint8Array = bs58.decode(base58PrivateKey);
    const ownerKeypair = Keypair.fromSecretKey(secretKeyUint8Array);

    const recipientPublicKey = new PublicKey(recipientAddresss);
    const tokenMintAddress = new PublicKey(
      "D2vmbUsTJnLA4cG1gp9aSpuDCmiWDyg5sTPdMUQKRYiD"
    );
    console.log(tokenMintAddress, "senderhereiam");

    const recipientTokenAccountAddress = await getAssociatedTokenAddress(
      tokenMintAddress,
      recipientPublicKey
    );
    const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      ownerKeypair, // The payer of the transaction, who will pay for the creation if it doesn't exist
      tokenMintAddress, // The mint address of the SPL token
      ownerKeypair.publicKey // The owner of the token account; in this case, the same as the payer
    );
    // Get or create the associated token account for the recipient

    // Specify the amount to transfer (in token's smallest unit, e.g., lamports for SOL)
    const tokenDecimals = 6;
    const amount = amountTotransfer * Math.pow(10, tokenDecimals);
    const senderTokenAccountAddress = senderTokenAccount.address; // Extract the address

    // Perform the transfer
    await transfer(
      connection,
      ownerKeypair, // Signer of the transaction
      senderTokenAccountAddress, // Sender's associated token account address
      recipientTokenAccountAddress, // Recipient's associated token account address
      ownerKeypair.publicKey, // Authority (owner of the sender's token account)
      amount, // Amount of tokens to transfer
      [] // Multi-signers, if needed
      // Depending on the API, you may or may not need to explicitly specify signers here
    );

    console.log(`Successfully sent ${amount} tokens to ${recipientPublicKey}`);
      window.location.reload();
  };

  const registerHandler = async () => {
    if (!email) {
      setEmailErr("This field is required");
      return;
    }
    if (!Emailpattern.test(email)) {
      setEmailErr("Please enter valid email");
      return;
    }
          if (!wallet.connected || !wallet.publicKey) {
      alert("Wallet not connected!");
      return;
    }


    let data = {
      email,
      walletAddress: wallet.publicKey,
    };

const amountToTransfer = 1;
await transferTokens(wallet.publicKey , amountToTransfer)






    const result = await signupUser(data);

    
    if (result.status) {








      //   let token = result.token;
      //   localStorage.setItem("jwtToken", token);
      navigate("/", { replace: true });
      //   setTimeout(() => {

      //     setTimeout(() => {
      //       window.scrollTo(0, window.scrollY);
      //     }, 100); // Adjust delay if necessary
      //   }, 2000);

      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };
  return (
    <>
    <Navbar/>
   
      <section className="ex_box p70 crypto_page_bg pt170" id="home">
        <div className="container ">
        <div className="container  banner_content">
         
            <div className="row align-items-center">
          

              <div className="col-md-5 m-auto">
                <div className="login_box irb p-3 p-md-4 bg-white mt-3">
                  <h3 className="text-center mb-md-3">Sign Up</h3>

                  <label className="mb-1">Email </label>
                  <div className="form-group position-relative">
                    <input 
                      type="text"
                      name="email"
                      placeholder="Enter  Email"
                      class="input_item form-control"
                      value={email}
                      onChange={handleChange}
                    />
                    <span className="text-danger">{emailErr}</span>
                  </div>

                  <></>

                  <div class="form-group pt-3">
                    <button className="btn w100" onClick={registerHandler}>
                      Submit
                    </button>
                  </div>
                </div>
              </div>
			     <div className="col-md-4 col-7 m-auto">
                <img
                  src="img/logo-coin.png"
                  alt="token "
                  className="img-fluid token_logo mt-4 mt-md-0"
                />
              </div>  
            </div>
          
        </div>
        </div>
      </section>
   
     
   </>
  );
};
