import React, { useState, useEffect, useMemo } from "react";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFC from "react-fusioncharts";
import { Navbar } from "./Navbar";
import { Header } from "../widgets/Header";
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


Charts(FusionCharts);
export const Home = () => {
  const [stages, setStages] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [dayss, setDayss] = useState([]);

  const [currentPhase, setCurrentPhase] = useState(1);

  const [currentStage, setCurrentStage] = useState(0);
  const [currentPhaseCompletion, setCurrentPhaseCompletion] = useState(10);

  const [checkT, setCheckT] = useState(false);
  const [allowance, setAllowance] = useState(0);
  const [shows, setShows] = useState(false);
  const [amountErr, setAmountErr] = useState("");
    const wallet = useWallet();
  const [amount, setAmount] = useState("");
  const [recivetoken, setrecivetoken] = useState();
  const [amounts, setAmounts] = useState("");
  const [stagepirces , setstageprices] = useState(0);
  const [recivetokens, setrecivetokens] = useState();
    const [ownerBlance, setownerBlanace] = useState();
      const [ownerBlanceusdt, setownerBlanaceusdt] = useState();
  const [price ,setPrice] = useState();
    const [priceusdt ,setPriceUsdt] = useState();

  const [valueinput , setvalueinput] = useState(0);



  const handleAmountChanges = (event) => {
    setAmounts(event.target.value);
    console.log("lslsls",priceusdt);

    const recivetokens = event.target.value / parseFloat(priceusdt);
    setrecivetokens(recivetokens);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
    console.log("lslsls",price);
    const recivetokens = event.target.value / parseFloat(price);
    setrecivetoken(recivetokens);
  };

  const transferSOL = async () => {
    console.log("wwww");
    if (!wallet.connected || !wallet.publicKey) {
      alert("Wallet not connected!");
      return;
    }
    console.log(wallet.publicKey, "senderhereiam");
    console.log(new PublicKey(adminPublicKey), "recihereiam");

    try {
      const connection = new Connection(network, "confirmed");
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(adminPublicKey),
          lamports: parseFloat(valueinput) * LAMPORTS_PER_SOL,
        })
      );
      console.log("hello", wallet.publicKey);
      transaction.feePayer = wallet.publicKey;
      let { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      const signedTransaction = await wallet.signTransaction(transaction);
      // Send the transaction
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );
      // Confirm the transaction
      const confirmation = await connection.confirmTransaction(
        signature,
        "confirmed"
      );
      console.log("helloere");

      await transferTokens(wallet.publicKey,  stagepirces);
      alert(`Transaction successful with signature: ${signature}`);
      console.log("Transaction confirmation:", confirmation);
    } catch (error) {
      console.error("Transfer error:", error);
      alert(`Transfer error: ${error.message}`);
    }
  };

  const transferTokens = async (recipientAddresss, amountTotransfer) => {
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

  async function transferSPLToken() {
    // Ensure the wallet is connected
    if (!wallet || !wallet.connected) {
      console.error("Wallet is not connected");
      return;
    }

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const senderPublicKey = wallet.publicKey;
    const recipientPublicKey = new PublicKey(adminPublicKeyStr);
    const mintPublicKey = new PublicKey("HuhPKS2b3YqtfLNPqkYdyGAtUCcwhLu4AFHqZpYwnLdw");
    const tokenDecimals = 6;
    const amount = amounts * Math.pow(10, tokenDecimals);

    // Find the associated token accounts for the sender and recipient
    const senderTokenAccountAddress = await getAssociatedTokenAddress(
      mintPublicKey,
      senderPublicKey
    );
    const recipientTokenAccountAddress = await getAssociatedTokenAddress(
      mintPublicKey,
      recipientPublicKey
    );

    // Create the transaction to transfer SPL tokens
    const transaction = new Transaction().add(
      createTransferInstruction(
        senderTokenAccountAddress,
        recipientTokenAccountAddress,
        senderPublicKey,
        amount,
        [],
        TOKEN_PROGRAM_ID
      )
    );

    // Sign and send the transaction
    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = senderPublicKey;

    try {
      const signedTransaction = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Transaction confirmed with signature:", signature);
      await transferTokens(senderPublicKey, recivetokens);
    } catch (error) {
      console.error("Failed to send transaction:", error);
    }
  }










async function getSPLTokenBalance() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const userPublicKey = new PublicKey(adminPublicKeyStr);
  const mintPublicKey = new PublicKey(tokenMintAddressStr);
   try {
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintPublicKey,
      userPublicKey,
      false,
      TOKEN_PROGRAM_ID
    );

    const tokenAccountInfo = await connection.getParsedAccountInfo(associatedTokenAddress);

    if (tokenAccountInfo.value === null) {
      setownerBlanace(0);
    } else {
      const balance = tokenAccountInfo.value.data.parsed.info.tokenAmount.uiAmount;
      console.log(`Token Balance: ${balance}`);
      setownerBlanace(balance);
    }
  } catch (error) {
    console.error("Error fetching SPL Token balance:", error);
    setownerBlanace(0); // Handle the error by resetting balance or other means
  }
}


async function getSPLTokenBalanceusdt() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const userPublicKey = new PublicKey(adminPublicKeyStr);
  const mintPublicKey = new PublicKey("HuhPKS2b3YqtfLNPqkYdyGAtUCcwhLu4AFHqZpYwnLdw");
   try {
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintPublicKey,
      userPublicKey,
      false,
      TOKEN_PROGRAM_ID
    );

    const tokenAccountInfo = await connection.getParsedAccountInfo(associatedTokenAddress);

    if (tokenAccountInfo.value === null) {
      setownerBlanaceusdt(0);
    } else {
      const balance = tokenAccountInfo.value.data.parsed.info.tokenAmount.uiAmount;
      console.log(`Token Balance: ${balance}`);
      setownerBlanaceusdt(balance);
    }
  } catch (error) {
    console.error("Error fetching SPL Token balance:", error);
    setownerBlanaceusdt(0); // Handle the error by resetting balance or other means
  }
}







  // ==========use for progress bar =================//

  // ==========use for progress bar =================//



 React.useEffect(() => {
getSPLTokenBalance();
   getSPLTokenBalanceusdt();

   
}, [adminPublicKeyStr, tokenMintAddressStr]);


  useEffect(() => {
    const newStages = [];
    const totalStages = 4;

    for (let i = 1; i < totalStages; i++) {
      let progressWidth = "45%";

      if (i < currentPhase) {
        progressWidth = "100%";
      } else if (i === currentPhase - 1) {
        progressWidth = " 0%";
      }

      newStages.push(
        <div key={i}>
          <label>Stage {i}</label>
          <div className="progress">
            <div className="progress-bar" style={{ width: progressWidth }} />
          </div>
        </div>
      );
    }
    setStages(newStages);
  }, [currentPhase, currentPhaseCompletion]);
const stage1Price = 0.0001;
const stage2Price = 0.001;
const stage3Price = 0.01;
const currentstageset = 1; // change stage here

  const handleChange = (e) => {
    // checkapproval();
    const { value } = e.target;
    setvalueinput(value);
if(currentstageset == 1){
    setstageprices(value / stage1Price); // 

}else if (currentstageset == 2){
    setstageprices(value / stage2Price); // 

} else if  (currentstageset == 3){
    setstageprices(value / stage3Price); // 

}

    if (value === "") {
      setAmountErr("This field is required");
    } else {
      setAmountErr("");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const stages = dayss;
      let nextStage = currentPhase;
      const startIndex = currentPhase - 1;
      const endIndex = currentPhase == 4 ? startIndex : startIndex + 1;
      const startTime = 1714023167 * 1000;
      const endTime = stages[endIndex] * 1000;

      setCurrentStage(nextStage);

      let t;
      if (now < startTime) {
        t = startTime - now;
      } else if (now < endTime) {
        t = endTime - now;
      } else {
        setCheckT(!checkT);
        t = 0;
      }

      const days = Math.floor(t / (1000 * 60 * 60 * 24));
      const hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((t % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPhase, currentStage]);

  const intervalRef = React.useRef();

  // useEffect(() => {
  //   intervalRef.current = setInterval(() => {
  //     setTimeLeft(calculateTimeLeft());
  //   }, 1000);

  //   return () => clearInterval(intervalRef.current);
  // }, []);

  const memoizedTimeLeft = useMemo(() => {
    return timeLeft;
  }, [timeLeft]);

  const chartConfigs = {
    type: "line",
    width: "80%",
    height: "500",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Stages Chart",
        xAxisName: "Stage",
        yAxisName: "Price",
        reverseAxis: "0.05",
        theme: "Candy",
        yAxisMaxValue: "0.000005",
        yAxisMinValue: "0.00000007000",
        paletteColors: "#0000FF",
        bgColor: "#90EE90",
        canvasBgColor: "#90EE90",

        divLineColor: "#999999",
        // creditLabel:"",
        bgAlpha: "50",
        borderAlpha: 0,
        baseFont: "Pacifico, cursive",
        baseFontSize: "12",
        outCnvBaseFontColor: "364599",
        canvasBorderAlpha: 0,
      },
      data: [
        { label: "stage1", value: stage1Price },
        { label: "stage2", value: stage2Price },
        { label: "stage3", value: stage3Price },
      ],
    },
  };
  function isValidAmount(amount) {
    return !isNaN(Number(amount)) && Number(amount) >= 0;
  }

  function calculatePiratesAmount(amount, currentPhase) {
    switch (currentPhase) {
      case 1:
        return Number(amount) / 0.0007;
      case 2:
        return Number(amount) / 0.005;
      case 3:
        return Number(amount) / 0.038;

      default:
        return Number(amount) / 0.00000005;
    }
  }

  return (
    <>
      <Navbar />

      <Header />
      {/* ====== END HEADER ======  */}
      {/* Scroll to Top */}
      <div
        className="buy_token p60 bg_light     position-relative"
        data-scroll-index={2}
      >
        <div className="container">
          <h2 className=" hadding mb-3 text-center">Buy Now $SDWC</h2>

          <div className="row">
            <div className="col-md-6 m-auto">
              <div className="banner_form irb p-3 p-md-4 bg-white">
                <div className="banner_form_in">
                  <div className="timer d-inline-flex " role="timer">
                    <div className="t_box">
                      <div className="box">
                        <ReactFC {...chartConfigs} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5 m-auto">
              <div className="banner_form irb p-3 p-md-4 bg-white">
                <div className="banner_form_in">
                  <div className="timer d-inline-flex " role="timer">
    
                  </div>

                  <h5 className="g_text m-0 mt-2">
                    <b>BUY NOW BEFORE PRICE INCREASES!</b>
                  </h5>
                </div>
                <h4 className="mt-3 fw600 text-center">
                  Current Stage Price = $
        ${currentstageset === 1 ? stage1Price : currentstageset === 2 ? stage2Price : stage3Price}

                </h4>
                <h4 className="mt-3 fw600 text-center">
                  Next Stage Price = $
        ${currentstageset === 1 ? stage2Price : currentstageset === 2 ? stage2Price : stage3Price}
                </h4>
                <div className="pro_man mt-2 mt-md-4 d-flex">{stages}</div>
                <div className="mb-3">
                  <div className="form-group">
                    <label className="text-left w100 fw600">
                      Amount in SOLANA You Pay:{" "}
                    </label>
                    <div className="input_amunt">
                      <input
                        className="form-control"
                        name="amount"
                        placeholder="Enter Amount"
                        onChange={handleChange}
                      />

                      <img
                        className="input_icon"
                        src="img/solana.png"
                        alt="coin"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="text-left w100 fw600">
                      Amount in SDWC You Receive
                    </label>
                    <div className="input_amunt">
                      <input
                        type="number"
                        disabled
                        className="form-control"
                        name="amount"
                       value={stagepirces} 
                      />
                      <img
                        className="input_icon"
                        src="img/logo.png"
                        alt="coin"
                      />
                    </div>
                  </div>
                </div>
                <div className="mx-auto mt-4">
                  <button onClick={transferSOL} className="btn w-100">
    Swap
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wallet_outer mobile-none">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className="note_img">
                <p>
                  
                  <span> Can send SOL to this address : </span> <br></br>
                  <b className="wallet_address">
                   
                    
                    0x7f3fd4d04990798b6b7be4a3e9cf3b7e8955a7b7
                  </b> <br></br> from your decentralized wallet
                  <br></br>  & we will airdrop <b>SolDog Wof Cars</b> to you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="about p60" data-scroll-index={2}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 ">
              <h2 className=" hadding mb-0">ABOUT</h2>
              <h5 className="fw600 mb-4">Redefining Meme Coins </h5>
              <ul className="list">
                <li>
                  <div className="dot-gradient" />
                  SolDogWof is more than just a meme coin; it's a
                  community-driven project built on the principles of fairness
                  and decentralization.
                </li>
                <li>
                  <div className="dot-gradient" />
                  Just like doge but better equipped to live luxurious
                </li>
                <li>
                  <div className="dot-gradient" />
                  Join us on the journey to redefine what it means to be a meme
                  coin in the world of cryptocurrency.
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <img src="img/dog1.jpg" className=" img-fluid irb" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg_light story_section p60" data-scroll-index={2}>
        <div className="container">
          <h2 className=" hadding mb-3 text-center">STORY OF SOLDOGWOF </h2>
          <div className="row">
            <div className="col-md-8 m-auto">
              <div className="owl-carousel owl-theme">
                <div className="item">
                  <div className="story_box">
                    <img className="m-auto" src="img/logo.png" />
                    <p className="mt-4">
                      {" "}
                      In the heart of the bustling Doge district of Shiba City,
                      a young pup named Wooferton dreamed of escaping the
                      ordinary. Unlike his Shiba brethren chasing tennis balls
                      in the park, Wooferton craved the finer things in life.
                      He’d spend hours gazing at glossy magazines featuring
                      gleaming Bugatti Veyrons and roaring Ferraris.
                    </p>
                  </div>
                </div>
                <div className="item">
                  <div className="story_box">
                    <img className="m-auto" src="img/logo.png" />
                    <p className="mt-4">
                      One fateful day, while rummaging through his grandpa’s
                      attic, Wooferton stumbled upon a dusty box filled with old
                      Doge racing trophies. Inspiration struck! Wooferton would
                      combine his love for Shibas, luxury cars, and a touch of
                      canine sophistication. Thus, the idea for SOL DOG WOF CARS
                      (SDWC) was born.
                    </p>
                  </div>
                </div>
                <div className="item">
                  <div className="story_box">
                    <img className="m-auto" src="img/logo.png" />
                    <p className="mt-4">
                      News of the SDWC spread like wildfire. Shiba pups
                      everywhere were captivated by the image of their kin
                      living the high life. The SDWC coin became a symbol of
                      achieving the impossible dream, a reminder that even a
                      Shiba Inu can ride in style.
                    </p>
                  </div>
                </div>
                <div className="item">
                  <div className="story_box">
                    <img className="m-auto" src="img/logo.png" />
                    <p className="mt-4">
                      {" "}
                      Wooferton knew Shibas weren't exactly built for Formula
                      One, so he focused on a different kind of race – the
                      Dogecoin Millionaire Mile. He assembled a crew of fellow
                      Shibas, each with an impeccable sense of style. They
                      donned top hats and bowties, climbed behind the wheels of
                      their dream cars (acquired through some clever
                      Doge-dealing, of course), and roared down the streets of
                      Shiba City, leaving a trail of awestruck pups in their
                      wake.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="become_millionaire pt-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="become_img">
                <img src="img/10.jpg" class=" img-fluid irb" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="become_text">
                <ul class="list">
                  <li>
                    <div class="dot-gradient"></div>
                    Invest $100 in pre-stage sales and potentially become a
                    millionaire over time.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="token_distribution p60" id="token" data-scroll-index={3}>
        <div className="container">
          <h2 className="text-center hadding mb-3">TOKENOMICS</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="tk1">
                <div className="tk2">
                  <h4>Total Supply:</h4>
                  <ul className="list">
                    <li>
                      <div className="dot-gradient" />
                      Name: SolDogWof (CDOGE)
                    </li>
                    <li>
                      <div className="dot-gradient" />
                      Total Supply: Infinite laughter supply, but let's keep it
                      real – 142.53 Billion
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="tk1">
                <div className="tk2">
                  <h4>Fair Distribution: </h4>
                  <ul className="list">
                    <li>
                      <div className="dot-gradient" />
                      15% for ‘Spacedrop’ - gifts from the cosmos
                    </li>
                    <li>
                      <div className="dot-gradient" />
                      25% for Initial liquidity pools
                    </li>
                    <li>
                      <div className="dot-gradient" />
                      50% Burned for Rocket fuel
                    </li>
                    <li>
                      <div className="dot-gradient" />
                      5% for PR, Marketing and celestial Exchange Listings
                    </li>
                    <li>
                      <div className="dot-gradient" />
                      5% for Seeding the dreams of tomorrow through the seed
                      round
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="tk1">
                <div className="tk2">
                  <h4>Transparency and Security: </h4>
                  <ul className="list">
                    <li>
                      <div className="dot-gradient" /> Liquidity Locked &amp; No
                      minting function
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" p60 bg_light" data-scroll-index={3}>
        <div className="container">
          <h2 className="text-center hadding mb-3">ROADMAP</h2>
          <div className="row roabmap">
            <div className="col-md-6 pr-md-5 mb-4">
              <div className="roadmap_box">
                <h4>Q1 2024: The Odyssey Begins </h4>
                <ul className="list">
                  <li>
                    <div className="dot-gradient" />
                    02-02-2024: SolDogWof launches from Elon’s SpaceX pad,
                    destination: the galaxy.
                  </li>
                  <li>
                    <div className="dot-gradient" />
                    500,000 Holders: Half a million pioneers joined the mission.
                  </li>
                  <li>
                    <div className="dot-gradient" />
                    Tier 3 Exchange Listings: SolDogWof goes live on multiple
                    exchanges.
                  </li>
                  <li>
                    <div className="dot-gradient" />
                    Meme Contests: Unleashing the creativity of the SolDogWof
                    community.
                  </li>
                  <li>
                    <div className="dot-gradient" />
                    Strategic Partnerships: Aligning with major cosmic entities.
                  </li>
                  <li>
                    <div className="dot-gradient" /> Moon Landing: A monumental
                    feat celebrated across the cosmos..
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-6 pl-md-5  mb-4">
              <div className="roadmap_box">
                <h4>Q2 - Q3 2024: Expanding the Frontier </h4>
                <ul className="list">
                  <li>
                    <div className="dot-gradient" />1 Million+ Holders: The
                    SolDogWof community doubles in size.
                  </li>
                  <li>
                    <div className="dot-gradient" /> Buybacks and Burns:
                    Ensuring the integrity of the SolDogWof economy.
                  </li>
                  <li>
                    <div className="dot-gradient" />
                    Tier 2 Exchange Listings: Upping the ante with higher-tier
                    exchanges.
                  </li>
                  <li>
                    <div className="dot-gradient" /> NFT Drop &amp; Exclusive
                    Merch: Limited edition collectibles and apparel.
                  </li>
                  <li>
                    <div className="dot-gradient" />
                    SolDogWof vs Shiba Showdown: The ultimate meme face-off.
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-6 pr-md-5  mb-4 mb-md-0">
              <div className="roadmap_box">
                <h4>Q4 2024 &amp; Beyond: Galactic Domination</h4>
                <ul className="list">
                  <li>
                    <div className="dot-gradient" />2 Million+ Holders: Forming
                    a colossal community.
                  </li>
                  <li>
                    <div className="dot-gradient" />
                    Top Meme Movement Globally: Dominating the meme universe.
                  </li>
                  <li>
                    <div className="dot-gradient" />
                    Tier 1 Exchange Listings: Joining the elite trading
                    platforms.
                  </li>
                  <li>
                    <div className="dot-gradient" /> Cydoge Swap: Launching a
                    bespoke decentralized trading platform.
                  </li>
                  <li>
                    <div className="dot-gradient" /> CydogeVerse: Venturing into
                    the vast virtual reality frontier.
                  </li>
                  <li>
                    <div className="dot-gradient" />
                    Internet-Breaking Giveaway: A historic event for the
                    community.
                  </li>
                  <li>
                    <div className="dot-gradient" /> SolDogWof Soiree: An
                    exclusive gathering for the elite fleet.
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-6 pl-md-5">
              <div className="roadmap_box">
                <h4>The Next Chapter</h4>
                <ul className="list">
                  <li>
                    <div className="dot-gradient" />
                    To Another Galaxy: SolDogWof ventures beyond Pluto in search
                    of new worlds.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="stap p60" id="token" data-scroll-index={4}>
        <div className="container">
          <h2 className="text-center hadding">How to Buy </h2>
          <h3 className="text-center fw600 mb-md-4 mb-3">
            Get Your SWDC Tokens Today{" "}
          </h3>
          <div className="row mb-4">
            <div className="col-md-5 order-md-2">
              <img src="img/stap1.jpg" className=" img-fluid irb" />
            </div>
            <div className="col-md-7 order-md-1">
              <div className="stap_box bg_light">
                <div className="d-flex">
                  <div className="dot-gradient" />
                  <div className=" ">
                    <h4>Step 1: Set Up a Crypto Wallet </h4>
                    <p>
                      1) Create a Wallet: Start by setting up a digital wallet
                      that supports Binance Smart Chain (BSC) tokens. Popular
                      choices include Trust Wallet and MetaMask.
                    </p>
                    <p>
                      2) Secure Your Wallet: Make sure to securely store your
                      wallet's recovery phrases or private keys.
                    </p>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="dot-gradient" />
                  <div className=" ">
                    <h4>Step 2: Add Binance Smart Chain to Your Wallet</h4>
                    <p>
                      {" "}
                      Configure Network Settings: Add Binance Smart Chain to
                      your wallet. This usually involves entering network
                      details like the RPC URL and Chain ID, which can be found
                      on Binance's official website or community guides
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-5 ">
              <img src="img/stap2.jpg" className=" img-fluid irb" />
            </div>
            <div className="col-md-7 ">
              <div className="stap_box bg_light">
                <div className="d-flex">
                  <div className="dot-gradient" />
                  <div className=" ">
                    <h4>Step 3: Buy SOLDOGWOF CARS (SDWC) Token</h4>
                    <p>
                      1) To integrate your wallet with the SDWC website,
                      navigate to the settings section and locate the option to
                      connect your wallet securely.
                    </p>
                    <p>
                      2) Input the desired amount in USDT that you wish to
                      exchange for SDWC coins.
                    </p>
                    <p>
                      3) Once the transaction is initialized, the SDWC coin
                      conversion process will commence automatically.
                    </p>
                    <p>
                      4) Verify the transaction details and approve the transfer
                      of SDWC coins to your designated wallet address.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <section
          className="contact bg_light footer"
          id="contact"
          data-scroll-index={6}
        >
          <div className="row align-items-center">
            <div className="col-md-3">
              <img src="img/logo.png" alt="header-Logo" className="logo" />
              <p></p>
            </div>
            <div className="col-md-9">
              <div className="foot_manu">
                <a className=" " href="#home" data-scroll-nav={1}>
                  Home
                </a>
                <a className href="#about" data-scroll-nav={2}>
                  About
                </a>
                <a className href="#blog" data-scroll-nav={3}>
                  tokenomics
                </a>
                <a className href="#contact" data-scroll-nav={4}>
                  Litepaper
                </a>
                <a className href="#faq">
                  SIgn Up
                </a>
                <a className href="#contact">
                  login
                </a>
              </div>
            </div>
          </div>
          <h3 className="fw600 mt-3">
            Join the SOLDOGWOF community today and embark on a journey to the
            moon! Explore the future of meme coins on the Binance Smart Chain
          </h3>
          <div className="row align-items-center mt-4 mb-4">
            <div className="col-auto ml-auto order-md-2">
              <a className="btn" href="#" target="_blank">
                <i className="bi bi-send" />
              </a>
              <a className="btn" href="#" target="_blank">
                <i className="bi bi-twitter-x" />
              </a>
            </div>
            <div className="col-md-6 order-md-1">
              <div className="copyright h5 fw600 mb-0">
                © 2024 SOLDOGWOF. All Rights Reserved
              </div>
            </div>
          </div>
          <p className="op06">
            Disclaimer: The "SolDogWof" coin (hereafter referred to as
            "SolDogWof") is a digital token classified as a meme coin. It is
            intended solely for entertainment purposes and should not be
            considered as an investment, asset, security, or any form of
            financial instrument. The creators and community of SolDogWof do not
            promote it as anything other than a means of entertainment.
          </p>
          <p className="op06">
            {" "}
            Contact US :{" "}
            <a href="mailto:info@m.SolDogWof.com">info@m.SolDogWof.com</a>
          </p>
        </section>
      </div>
    </>
  );
};
