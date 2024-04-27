import React from "react";

export const Header = () => {
  return (
    <>
      {" "}
      <header
        className="home position-relitive"
        id="home"
        data-scroll-index={1}
      >
        <div className="banner_content">
          <div className="container">
            <div className="row">
              <div className="col-md-6 order-lg-2">
                <img
                  className="img-fluid"
                  src="img/logo-coin.png"
                  alt="logo-coin"
                />
              </div>
              <div className="col-md-6 order-lg-1">
                <h3>
                  Welcome to
                  <br /> the Future of Memes
                  <br />
                  <span className="g_txt">SolDogWof </span>
                </h3>
                <p>
                  Join the revolution of decentralized meme coins with SolDogWof
                  Cars. Embrace the excitement of the next big thing on the
                  Binance Smart Chain. No gimmicks, just pure decentralized fun.
                  Secure your spot in the future of crypto today!
                </p>
                <div className="w-full space-y-3">
                  <a
                    href="#"
                    className="brn2 w100     align-items-center d-flex"
                    target="_blank"
                  >
                    <span className="h4 fw600 mb-0">
                      Subscribe for free 1000 SDWC Tokens{" "}
                    </span>
                    <img src="img/logo.png" className="h-8 w-8 ml-2" />
                  </a>
                  <div className="text-xl font-semibold fw600 mt-3 mb-2 h5">
                    Contract Address
                  </div>
                  <div className="  mb-3 row justify-content-center">
                    <div className=" col-md-8 col-lg-9">
                      {/* <div className="brn2 w100  wbba   align-items-center d-flex fw600  ">
                    0x7f3fd4d04990798b6b7be4a3e9cf3b7e8955a7b7
                  </div> */}
                      <div className="desktop-none">
                        <div className="note_img">
                          <p>
                            {" "}
                            <span>
                              {" "}
                              Can send SOL to this <br /> address{" "}
                            </span>{" "}
                            <br></br>
                            <b className="wallet_address">
                              {" "}
                              0x7f3fd4d04990798b6b7be4a3e9cf3b7e8955a7b7
                            </b>{" "}
                            <br></br> from your decentralized wallet.
                            <br></br>  & we will airdrop <b>SolDog Wof Cars</b> to you.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
