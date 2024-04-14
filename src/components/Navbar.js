import logo from "../logo_3.png";
import fullLogo from "../full_logo.png";
import street from "../street.png";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

function Navbar() {
  const [connected, toggleConnect] = useState(false);
  const location = useLocation();
  const [currAddress, updateAddress] = useState("0x");

  async function getAddress() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
  }

  function updateButton() {
    const ethereumButton = document.querySelector(".enableEthereumButton");
    ethereumButton.textContent = "Connected";
    ethereumButton.classList.remove("hover:bg-blue-70");
    ethereumButton.classList.remove("bg-blue-500");
    ethereumButton.classList.add("hover:bg-green-70");
    ethereumButton.classList.add("bg-green-500");
  }

  async function connectWebsite() {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== "0x5") {
      //alert('Incorrect network! Switch your metamask network to Rinkeby');
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }],
      });
    }
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(() => {
        updateButton();
        console.log("here");
        getAddress();
        window.location.replace(location.pathname);
      });
  }

  useEffect(() => {
    if (window.ethereum == undefined) return;
    let val = window.ethereum.isConnected();
    if (val) {
      console.log("here");
      getAddress();
      toggleConnect(val);
      updateButton();
    }

    window.ethereum.on("accountsChanged", function (accounts) {
      window.location.replace(location.pathname);
    });
  });

  return (
    <nav className="fixed top-0 left-0 w-full z-10">
      <div className="flex items-center justify-between py-3 pr-5">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={fullLogo} alt="" className="h-12 mr-2" />
            <img src={street} alt="" className="h-12 ml-2" />
          </Link>
        </div>
        <ul className="flex items-center space-x-4">
          <li>
            <Link
              to="/"
              className={`${
                location.pathname === "/" ? "text-black" : "text-gray-500"
              }`}
            >
              STREET
            </Link>
          </li>
          <li>
            <Link
              to="/sellNFT"
              className={`${
                location.pathname === "/sellNFT"
                  ? "text-black"
                  : "text-gray-500"
              }`}
            >
              List My NFT
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={`${
                location.pathname === "/profile"
                  ? "text-black"
                  : "text-gray-500"
              }`}
            >
              Profile
            </Link>
          </li>
          <li>
            <button
              className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded text-sm"
              onClick={connectWebsite}
            >
              {connected ? "Connected" : "Connect Wallet"}
            </button>
          </li>
        </ul>
      </div>
      <div className="text-black text-bold text-right mr-10 text-sm">
        {currAddress !== "0x"
          ? "Connected to"
          : "Not Connected. Please login to view NFTs"}{" "}
        {currAddress !== "0x" ? currAddress.substring(0, 15) + "..." : ""}
      </div>
    </nav>
  );
}

export default Navbar;
