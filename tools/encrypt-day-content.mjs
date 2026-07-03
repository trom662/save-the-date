/**
 * Verschlüsselt das Tagesprogramm (tools/day-content.html) mit AES-256-GCM
 * und schreibt das Ergebnis nach assets/day-content.enc.json.
 *
 * Verwendung:  node tools/encrypt-day-content.mjs <geheimer-code>
 * Beispiel:    node tools/encrypt-day-content.mjs moshpit-1909
 *
 * Der Link für Tagesgäste lautet dann:
 *   https://highwaytoehe.de/#code=<geheimer-code>
 *
 * WICHTIG: tools/day-content.html ist gitignored und darf NICHT committet
 * werden – sonst stünde das Programm im Klartext im (öffentlichen) Repo.
 */
import { webcrypto as crypto } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const secret = process.argv[2];
if (!secret) {
    console.error('Fehler: Bitte geheimen Code angeben.\nVerwendung: node tools/encrypt-day-content.mjs <geheimer-code>');
    process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const plaintext = readFileSync(join(root, 'tools', 'day-content.html'), 'utf8');

// Schlüssel = SHA-256 des Codes (muss zur Logik in scripts.js passen)
const keyBytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['encrypt']);

const iv = crypto.getRandomValues(new Uint8Array(12));
const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext)
);

const out = {
    iv: Buffer.from(iv).toString('base64'),
    data: Buffer.from(ciphertext).toString('base64')
};

writeFileSync(join(root, 'assets', 'day-content.enc.json'), JSON.stringify(out, null, 2) + '\n');
console.log('✓ assets/day-content.enc.json geschrieben.');
console.log(`✓ Link für Tagesgäste: https://highwaytoehe.de/#code=${encodeURIComponent(secret)}`);
