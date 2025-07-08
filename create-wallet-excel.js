import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import * as XLSX from 'xlsx';

// Jumlah wallet yang ingin dibuat
const TOTAL_WALLET = 10;

// Data array untuk file Excel
const data = [];

for (let i = 0; i < TOTAL_WALLET; i++) {
    const keypair = new Ed25519Keypair();

    const address = keypair.getPublicKey().toSuiAddress();
    const secretKey = keypair.getSecretKey();

    data.push({ address, privateKey: secretKey });
}

// Buat worksheet dan workbook Excel
const worksheet = XLSX.utils.json_to_sheet(data);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Wallets');

// Simpan ke file Excel
XLSX.writeFile(workbook, 'dompet_management.xlsx');

console.log(`✅ Berhasil generate ${TOTAL_WALLET} wallet ke dompet_management.xlsx`);
