// Inicializa thirdweb SDK
const { ThirdwebSDK } = window.thirdweb;
const { InjectedWallet, WalletConnect } = window.thirdwebWallets;

// Configura el SDK para la red Solana (Moonshot)
const sdk = ThirdwebSDK.fromNetwork("solana");

// Lista de wallets permitidas
const allowedWallets = [
    "coinbaseWallet", // Coinbase Wallet
    "bitgetWallet",   // Bitget Wallet
    "phantom",        // Phantom Wallet
    "trustWallet"     // Trust Wallet
];

const connectButton = document.getElementById('connect-wallet');
const walletAddress = document.getElementById('wallet-address');

connectButton.addEventListener('click', async () => {
    try {
        // Verifica si window.ethereum o window.solana están disponibles
        if (!window.ethereum && !window.solana) {
            walletAddress.textContent = 'Instala una wallet compatible (Coinbase, Bitget, Phantom o Trust).';
            return;
        }

        let wallet;
        let provider;

        // Detecta la wallet instalada
        if (window.ethereum) {
            const walletName = window.ethereum.isCoinbaseWallet ? "coinbaseWallet" :
                              window.ethereum.isBitgetWallet ? "bitgetWallet" :
                              window.ethereum.isTrust ? "trustWallet" : null;
            if (!walletName || !allowedWallets.includes(walletName)) {
                throw new Error('Solo Coinbase, Bitget, Phantom o Trust son compatibles.');
            }
            wallet = new InjectedWallet({ walletId: walletName });
            provider = new ethers.providers.Web3Provider(window.ethereum);
        } else if (window.solana) {
            if (window.solana.isPhantom) {
                wallet = new InjectedWallet({ walletId: "phantom" });
                provider = window.solana;
            } else {
                throw new Error('Solo Phantom es compatible para Solana nativo.');
            }
        }

        if (!wallet) {
            throw new Error('Wallet no detectada o no compatible.');
        }

        // Conecta la wallet
        const address = await wallet.connect();
        walletAddress.textContent = `Wallet conectada: ${address}`;
        connectButton.textContent = 'Wallet Conectada';
        console.log('Wallet conectada:', address);

        // Opcional: Verifica red Solana
        const network = await provider.getNetwork();
        if (network.chainId !== 0x1a) { // Chain ID de Solana Mainnet (ajusta si usas Testnet)
            walletAddress.textContent = 'Conéctate a la red Solana.';
            await wallet.disconnect();
            return;
        }

    } catch (error) {
        console.error('Error conectando wallet:', error);
        walletAddress.textContent = error.message || 'Error: Intenta de nuevo con una wallet compatible.';
    }
});
