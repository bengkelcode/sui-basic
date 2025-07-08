import * as fs from 'node:fs/promises';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

// Jumlah wallet yang ingin dibuat
const TOTAL_WALLET = 10;

const hasil = [];

for (let i = 0; i < TOTAL_WALLET; i++) {
    const keypair = new Ed25519Keypair();
    const publicKey = keypair.getPublicKey().toSuiAddress();
    const secretKey = keypair.getSecretKey();

    hasil.push(`${publicKey}|${secretKey}`);
}

await fs.writeFile('dompet_management.txt', hasil.join('\n'), 'utf8');
console.log(`✅ Berhasil generate ${TOTAL_WALLET} wallet ke dompet_management.txt`);
