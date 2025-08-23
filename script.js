// Inicializa thirdweb SDK
const { ThirdwebSDK } = window.thirdweb;
const { InjectedWallet } = window.thirdwebWallets;

// Configura el SDK (usa cadena Solana para Moonshot)
const sdk = ThirdwebSDK.fromNetwork("solana");

// Botón de conectar wallet
const connectButton = document.getElementById('connect-wallet');
const walletAddress = document.getElementById('wallet-address');

connectButton.addEventListener('click', async () => {
    try {
        // Crea wallet connector (soporta MetaMask, WalletConnect, etc.)
        const wallet = new InjectedWallet();
        const address = await wallet.connect();
        walletAddress.textContent = `Wallet conectada: ${address}`;
        connectButton.textContent = 'Wallet Conectada';
        console.log('Wallet conectada:', address);
        // Aquí puedes agregar lógica post-conexión, como mostrar balance o swap
    } catch (error) {
        console.error('Error conectando wallet:', error);
        walletAddress.textContent = 'Error: Intenta de nuevo.';
    }
});
