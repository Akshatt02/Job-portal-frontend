import { ethers } from "ethers";

const SEPOLIA_CHAIN_ID = "0xaa36a7"; // Hex for 11155111

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed. Please install MetaMask to continue.");
  }

  try {
    // Ensure user is on Sepolia
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (currentChainId !== SEPOLIA_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          // Network not added to MetaMask
          throw new Error("Please add Sepolia Testnet to MetaMask and try again.");
        }
        throw new Error("Please switch to Sepolia Testnet in MetaMask");
      }
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    return { provider, signer, address };
  } catch (error) {
    throw new Error(`Wallet connection failed: ${error.message}`);
  }
}

const ADMIN_WALLET = "0xbD56074D4C319B6c77E1Cabc393784bBEc79188a"; // IMPORTANT: Replace this!

export async function payPlatformFee() {
  if (!ADMIN_WALLET.startsWith("0x")) {
    throw new Error("ADMIN_WALLET not configured. Please set a valid Sepolia address in wallet.js");
  }

  const walletInfo = await connectWallet();
  if (!walletInfo || !walletInfo.signer) {
    throw new Error("Wallet connection failed");
  }

  const { signer } = walletInfo;

  try {
    const tx = await signer.sendTransaction({
      to: ADMIN_WALLET,
      value: ethers.parseEther("0.001") // 0.001 Sepolia ETH
    });

    console.log("Transaction sent:", tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    
    if (!receipt) {
      throw new Error("Transaction failed - no receipt received");
    }

    console.log("Transaction confirmed:", receipt.hash);
    
    // Return the transaction hash
    return receipt.hash;
  } catch (error) {
    if (error.code === "ACTION_REJECTED") {
      throw new Error("Payment cancelled by user");
    }
    throw new Error(`Transaction failed: ${error.message}`);
  }
}
