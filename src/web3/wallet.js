import { ethers } from "ethers";

/**
 * Blockchain Configuration for Ethereum Sepolia Testnet
 * 
 * Sepolia Testnet Details:
 * - Chain ID: 11155111 (decimal) or 0xaa36a7 (hex)
 * - Used for testing without spending real ETH
 * - Get test ETH: https://www.alchemy.com/faucets/ethereum-sepolia
 * - Block Explorer: https://sepolia.etherscan.io
 */
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // Hex for 11155111

/**
 * Admin wallet address that receives job posting fees
 * 
 * This is where 0.001 Sepolia ETH payments are sent from job posters
 * Use for testing only - replace with your actual address
 * 
 * Format: 0x followed by 40 hexadecimal characters
 */
const ADMIN_WALLET = "0xbD56074D4C319B6c77E1Cabc393784bBEc79188a";

/**
 * Connects user's wallet via MetaMask browser extension
 * 
 * Process:
 * 1. Check if MetaMask extension is installed
 * 2. Get current blockchain network ID
 * 3. If not on Sepolia, prompt user to switch
 * 4. Request user permission to access wallet
 * 5. Return wallet provider, signer, and address
 * 
 * @returns {Promise<Object>} { provider, signer, address }
 * @throws {Error} If MetaMask not installed, user rejects, or chain switch fails
 * 
 * @example
 * const { address, signer } = await connectWallet();
 * console.log("Connected wallet:", address);
 */
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

/**
 * Processes blockchain payment for job posting
 * 
 * Complete Flow:
 * 1. Validate ADMIN_WALLET is properly configured
 * 2. Connect to user's MetaMask wallet
 * 3. Create Ethereum transaction:
 *    - Send 0.001 Sepolia ETH to ADMIN_WALLET
 *    - User approves transaction in MetaMask popup
 * 4. Transaction broadcasted to Ethereum network
 * 5. Wait for confirmation (transaction included in block)
 * 6. Return transaction hash as proof of payment
 * 
 * Transaction Details:
 * - Amount: 0.001 ETH (Sepolia testnet)
 * - Recipient: ADMIN_WALLET (job posting fee receiver)
 * - Gas: Automatically estimated by MetaMask
 * - Confirmation Time: ~12-15 seconds on Sepolia
 * 
 * @returns {Promise<string>} Transaction hash (0x followed by 64 hex characters)
 *                             Used as payment_tx_hash in job creation
 * @throws {Error} If wallet not connected, user rejects, or transaction fails
 * 
 * @example
 * try {
 *   const txHash = await payPlatformFee();
 *   // txHash = "0x1a2b3c4d5e6f7g8h..."
 *   // Now create the job with this hash as proof
 *   await API.post("/jobs", { title, description, payment_tx_hash: txHash });
 * } catch (err) {
 *   console.error("Payment failed:", err.message);
 * }
 */
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
