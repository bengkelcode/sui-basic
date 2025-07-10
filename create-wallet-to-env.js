import * as fs from 'node:fs/promises';
import * as XLSX from 'xlsx';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';

const TOTAL_WALLET = 10;

const linesPrivateOnly = [];
const linesFull = [];
const dataForExcel = [];

for (let i = 0; i < TOTAL_WALLET; i++) {
    const keypair = new Ed25519Keypair();
    const publicKey = keypair.getPublicKey().toSuiAddress();
    const secretKey = keypair.getSecretKey();

    linesPrivateOnly.push(`PRIVATE_KEY_${i + 1}=${secretKey}`);
    linesFull.push(`${publicKey}|${secretKey}`);
    dataForExcel.push({ Address: publicKey, PrivateKey: secretKey });
}

// Tulis ke private_keys.txt
await fs.writeFile('private_keys.txt', linesPrivateOnly.join('\n'), 'utf8');

// Tulis ke wallets.txt
await fs.writeFile('wallets.txt', linesFull.join('\n'), 'utf8');

// Tulis ke wallets.xlsx
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
XLSX.utils.book_append_sheet(workbook, worksheet, 'Wallets');
XLSX.writeFile(workbook, 'wallets.xlsx');

console.log(`✅ Berhasil generate ${TOTAL_WALLET} wallet ke:
📁 private_keys.txt
📁 wallets.txt
📁 wallets.xlsx`);
