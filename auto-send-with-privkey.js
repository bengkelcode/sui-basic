import * as fs from 'node:fs/promises';
import {getFullnodeUrl, SuiClient} from '@mysten/sui.js/client';
import {TransactionBlock} from '@mysten/sui.js/transactions';
import {decodeSuiPrivateKey} from '@mysten/sui.js/cryptography';
import {Ed25519Keypair} from '@mysten/sui.js/keypairs/ed25519';

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

// Fungsi delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Load wallet.json
const wallets = JSON.parse(await fs.readFile('wallets.json', 'utf8'));

// Dekode private key sender
const amount = wallets.amount;
const senderKey = decodeSuiPrivateKey(wallets.sender);
const senderKeypair = Ed25519Keypair.fromSecretKey(senderKey.secretKey);

// Fungsi kirim SUI ke satu receiver
async function sendToReceiver(receiverPrivateKeyHex, index) {
    try {
        const receiverKey = decodeSuiPrivateKey(receiverPrivateKeyHex);
        const receiverAddress = Ed25519Keypair.fromSecretKey(receiverKey.secretKey).toSuiAddress();

        console.log(`📤 Sending to receiver #${index + 1}: ${receiverAddress}`);

        const tx = new TransactionBlock();

         // ← Ubah nilai ini sesuai keinginan
        const microSui = BigInt(amount * 1_000_000_000); // Konversi ke mikro SUI
        const [coin] = tx.splitCoins(tx.gas, [tx.pure(microSui)]);

        tx.transferObjects([coin], tx.pure(receiverAddress));

        const res = await client.signAndExecuteTransactionBlock({
            signer: senderKeypair,
            transactionBlock: tx,
            options: { showEffects: true },
        });

        if (res.effects.status.status === 'success') {
            console.log(`✅ TX Success #${index + 1}: ${res.digest}`);
        } else {
            console.error(`❌ TX Failed #${index + 1}:`, res.effects.status.error);
        }
    } catch (err) {
        console.error(`❌ TX Error #${index + 1}:`, err.message || err);
    }
}


// Loop kirim satu per satu dengan delay
for (let i = 0; i < wallets.receivers.length; i++) {
    await sendToReceiver(wallets.receivers[i], i);
    await delay(3000); // delay 3 detik antar tx
}
