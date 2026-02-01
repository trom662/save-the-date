#!/usr/bin/env node

/**
 * Pre-Commit Test Suite für Save The Date Website
 * 
 * Dieses Script führt automatisiert umfassende Tests durch
 * um sicherzustellen, dass jeder Commit einen stabilen Zustand hat.
 * 
 * Verwendung:
 *   node pre-commit-test.js
 *   npm run pretest
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(COLORS.cyan, `  ${title}`);
  console.log('='.repeat(60) + '\n');
}

async function runCommand(cmd, args = []) {
  return new Promise((resolve, reject) => {
    const process = spawn(cmd, args, { stdio: 'inherit', shell: true });
    process.on('close', (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  });
}

async function checkPrerequisites() {
  logSection('🔍 Checking Prerequisites');

  // Check if Node modules exist
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    log(COLORS.yellow, 'Playwright modules not found. Installing...');
    try {
      await runCommand('npm', ['install']);
      log(COLORS.green, '✓ Dependencies installed');
    } catch (e) {
      log(COLORS.red, '✗ Failed to install dependencies');
      return false;
    }
  } else {
    log(COLORS.green, '✓ Dependencies already installed');
  }

  return true;
}

async function validateHTML() {
  logSection('📄 HTML Validation');

  const indexPath = path.join(__dirname, 'index.html');
  const content = fs.readFileSync(indexPath, 'utf-8');

  const checks = [
    {
      name: 'Has DOCTYPE',
      test: () => content.includes('<!DOCTYPE html>')
    },
    {
      name: 'Has <html> tag',
      test: () => content.includes('<html')
    },
    {
      name: 'Has <head> section',
      test: () => content.includes('<head>')
    },
    {
      name: 'Has <body> section',
      test: () => /\<body[^>]*\>/.test(content)
    },
    {
      name: 'All sections present (hero, location, gallery, etc)',
      test: () => {
        const sections = ['id="hero"', 'id="location"', 'id="gallery"', 'id="umfrage"'];
        return sections.every(s => content.includes(s));
      }
    },
    {
      name: 'Protected content properly wrapped',
      test: () => {
        const protectedCount = (content.match(/class="protected-content"/g) || []).length;
        return protectedCount >= 2; // Should have at least 2 protected sections
      }
    },
    {
      name: 'Gallery is NOT in protected-content',
      test: () => {
        const protectedSection = content.match(/<div[^>]*class="protected-content"[^>]*>[\s\S]*?<\/div>/g);
        if (!protectedSection) return false;
        return !protectedSection.some(s => s.includes('id="gallery"'));
      }
    }
  ];

  let passed = 0;
  for (const check of checks) {
    if (check.test()) {
      log(COLORS.green, `✓ ${check.name}`);
      passed++;
    } else {
      log(COLORS.red, `✗ ${check.name}`);
    }
  }

  log(COLORS.blue, `\nPassed: ${passed}/${checks.length}`);
  return passed === checks.length;
}

async function runPlaywrightTests() {
  logSection('🧪 Running Playwright Tests');

  try {
    // Check if local server is running
    const response = await fetch('http://localhost:8000', { method: 'HEAD' });
    if (!response.ok && response.status !== 200) {
      log(COLORS.yellow, '⚠️  Local server not accessible at http://localhost:8000');
      log(COLORS.yellow, 'Please start the server with: python -m http.server 8000');
      return false;
    }
  } catch (e) {
    log(COLORS.yellow, '⚠️  Could not connect to local server at http://localhost:8000');
    log(COLORS.yellow, 'Please start the server with: python -m http.server 8000');
    return false;
  }

  try {
    await runCommand('npx', ['playwright', 'test', '--reporter=line']);
    log(COLORS.green, '\n✓ All Playwright tests passed');
    return true;
  } catch (e) {
    log(COLORS.red, '\n✗ Playwright tests failed');
    return false;
  }
}

async function checkFileIntegrity() {
  logSection('📋 File Integrity Check');

  const requiredFiles = [
    'index.html',
    'styles.css',
    'scripts.js',
    'package.json',
    'assets/hochzeit-kathrin-tobi.ics',
  ];

  let allExist = true;
  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      log(COLORS.green, `✓ ${file}`);
    } else {
      log(COLORS.red, `✗ ${file} (missing)`);
      allExist = false;
    }
  }

  return allExist;
}

async function main() {
  console.clear();
  log(COLORS.cyan, '╔═══════════════════════════════════════════════════════╗');
  log(COLORS.cyan, '║       Save The Date - Pre-Commit Test Suite            ║');
  log(COLORS.cyan, '╚═══════════════════════════════════════════════════════╝');

  let allPassed = true;

  // Run all checks
  if (!await checkPrerequisites()) allPassed = false;
  if (!await checkFileIntegrity()) allPassed = false;
  if (!await validateHTML()) allPassed = false;
  if (!await runPlaywrightTests()) allPassed = false;

  // Summary
  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    log(COLORS.green, '✓✓✓ ALL TESTS PASSED - READY TO COMMIT ✓✓✓');
  } else {
    log(COLORS.red, '✗✗✗ SOME TESTS FAILED - FIX ISSUES BEFORE COMMITTING ✗✗✗');
  }
  console.log('='.repeat(60) + '\n');

  process.exit(allPassed ? 0 : 1);
}

main().catch(err => {
  log(COLORS.red, `Fatal error: ${err}`);
  process.exit(1);
});
