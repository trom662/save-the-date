/**
 * Verschlüsselt die Gästegruppen-Inhalte (tools/content-*.json) mit AES-256-GCM
 * und schreibt die Ergebnisse nach assets/*-content.enc.json.
 *
 * Verwendung:
 *   node tools/encrypt-content.mjs <code-abend> <code-tag> <code-innerer-kreis>
 *
 * Beispiel:
 *   node tools/encrypt-content.mjs moshpit-2100 highway-vollgas-1909 backstage-1230
 *
 * Links für die Gäste:
 *   Abendgäste:     https://highwaytoehe.de/#code=<code-abend>
 *   Tagesgäste:     https://highwaytoehe.de/#code=<code-tag>
 *   Engster Kreis:  https://highwaytoehe.de/#code=<code-innerer-kreis>
 *
 * WICHTIG: Die tools/content-*.json sind gitignored und dürfen NICHT
 * committet werden – sonst stünde das Programm im Klartext im Repo.
 */
import { webcrypto as crypto } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const [codeEvening, codeDay, codeInner] = process.argv.slice(2);
if (!codeEvening || !codeDay || !codeInner) {
    console.error('Fehler: Bitte drei Codes angeben.\nVerwendung: node tools/encrypt-content.mjs <code-abend> <code-tag> <code-innerer-kreis>');
    process.exit(1);
}

const codes = new Set([codeEvening, codeDay, codeInner]);
if (codes.size !== 3) {
    console.error('Fehler: Die drei Codes müssen unterschiedlich sein.');
    process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const tiers = [
    { name: 'Abendgäste',    code: codeEvening, source: 'content-evening.json', target: 'evening-content.enc.json' },
    { name: 'Tagesgäste',    code: codeDay,     source: 'content-day.json',     target: 'day-content.enc.json' },
    { name: 'Engster Kreis', code: codeInner,   source: 'content-inner.json',   target: 'inner-content.enc.json' }
];

for (const tier of tiers) {
    const plaintext = readFileSync(join(root, 'tools', tier.source), 'utf8');
    // Validierung: muss gültiges JSON sein
    JSON.parse(plaintext);

    // Schlüssel = SHA-256 des Codes (muss zur Logik in scripts.js passen)
    const keyBytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(tier.code));
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

    writeFileSync(join(root, 'assets', tier.target), JSON.stringify(out, null, 2) + '\n');
    console.log(`✓ ${tier.name}: assets/${tier.target}`);
    console.log(`  Link: https://highwaytoehe.de/#code=${encodeURIComponent(tier.code)}`);
}
