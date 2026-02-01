#!/usr/bin/env node

/**
 * Lite Test Suite für Save The Date Website
 * Keine externen Dependencies - nur Node.js Standard Library
 * 
 * Verwendung:
 *   node lite-test.js
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

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

async function checkServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:8000', { timeout: 2000 }, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 404);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
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
      name: 'Protected content properly wrapped (2+ instances)',
      test: () => {
        const protectedCount = (content.match(/class="protected-content"/g) || []).length;
        return protectedCount >= 2;
      }
    },
    {
      name: '✓ Gallery is NOT in protected-content',
      test: () => {
        // Find all protected-content divs
        const regex = /<div[^>]*class="protected-content"[^>]*>[\s\S]*?<\/div>/g;
        const protectedSections = content.match(regex) || [];
        // Check that gallery is not inside any protected section
        return !protectedSections.some(s => s.includes('id="gallery"'));
      }
    },
    {
      name: '✓ Timeline is protected',
      test: () => {
        const timelineIdx = content.indexOf('id="timeline"');
        const lastProtected = content.lastIndexOf('class="protected-content"', timelineIdx);
        const nextClose = content.indexOf('</div><!-- Ende protected-content -->', lastProtected);
        return timelineIdx > lastProtected && timelineIdx < nextClose;
      }
    },
    {
      name: '✓ Umfrage is protected',
      test: () => {
        const umfrageIdx = content.indexOf('id="umfrage"');
        const lastProtected = content.lastIndexOf('class="protected-content"', umfrageIdx);
        const nextClose = content.indexOf('</div><!-- Ende protected-content -->', lastProtected);
        return umfrageIdx > lastProtected && umfrageIdx < nextClose;
      }
    },
    {
      name: 'Meta tags present (charset, viewport, description)',
      test: () => {
        return content.includes('charset="UTF-8"') &&
               content.includes('name="viewport"') &&
               content.includes('name="description"');
      }
    },
    {
      name: 'Correct event date (19.09.2026)',
      test: () => content.includes('19.09.2026')
    },
    {
      name: 'CSS file linked',
      test: () => content.includes('styles.css')
    },
    {
      name: 'Main JavaScript file linked',
      test: () => content.includes('scripts.js')
    },
    {
      name: 'Navigation section exists',
      test: () => content.includes('id="navbar"')
    },
    {
      name: 'Background music element exists',
      test: () => content.includes('id="bg-music"')
    },
    {
      name: 'Music controls exist',
      test: () => content.includes('id="music-controls"')
    },
    {
      name: 'Welcome overlay exists',
      test: () => content.includes('id="welcome-overlay"')
    },
    {
      name: 'Survey form exists',
      test: () => content.includes('id="survey-form"')
    },
    {
      name: 'Favicon reference present',
      test: () => content.includes('rel="icon"')
    },
  ];

  let passed = 0;
  for (const check of checks) {
    try {
      if (check.test()) {
        log(COLORS.green, `✓ ${check.name}`);
        passed++;
      } else {
        log(COLORS.red, `✗ ${check.name}`);
      }
    } catch (e) {
      log(COLORS.red, `✗ ${check.name} (Error: ${e.message})`);
    }
  }

  log(COLORS.blue, `\nPassed: ${passed}/${checks.length}`);
  return passed === checks.length;
}

function checkFileIntegrity() {
  logSection('📋 File Integrity Check');

  const requiredFiles = [
    'index.html',
    'styles.css',
    'scripts.js',
    'package.json',
    'playwright.config.js',
  ];

  let allExist = true;
  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const size = fs.statSync(filePath).size;
      log(COLORS.green, `✓ ${file} (${Math.round(size/1024)}KB)`);
    } else {
      log(COLORS.red, `✗ ${file} (missing)`);
      allExist = false;
    }
  }

  return allExist;
}

async function checkServer() {
  logSection('🌐 Server Availability');
  
  const isRunning = await new Promise((resolve) => {
    const req = http.get('http://localhost:8000', { timeout: 2000 }, (res) => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });

  if (isRunning) {
    log(COLORS.green, '✓ Local server running at http://localhost:8000');
    return true;
  } else {
    log(COLORS.yellow, '⚠️  Server not available at http://localhost:8000');
    log(COLORS.yellow, 'Start with: python -m http.server 8000');
    return false;
  }
}

function checkAssets() {
  logSection('🖼️ Assets Check');

  const assetDir = path.join(__dirname, 'assets');
  if (!fs.existsSync(assetDir)) {
    log(COLORS.red, '✗ Assets directory missing');
    return false;
  }

  const requiredAssets = [
    'hochzeit-kathrin-tobi.ics',
    'IWasAlive.mp3',
  ];

  let allExist = true;
  const files = fs.readdirSync(assetDir);
  log(COLORS.cyan, `Found ${files.length} asset files:`);
  
  for (const asset of requiredAssets) {
    if (files.includes(asset)) {
      const size = fs.statSync(path.join(assetDir, asset)).size;
      log(COLORS.green, `  ✓ ${asset} (${Math.round(size/1024/1024*100)/100}MB)`);
    } else {
      log(COLORS.yellow, `  ⚠️  ${asset} (optional)`);
    }
  }

  return true;
}

async function main() {
  console.clear();
  log(COLORS.cyan, '╔═══════════════════════════════════════════════════════╗');
  log(COLORS.cyan, '║     Save The Date - Lite Test Suite (No Dependencies)  ║');
  log(COLORS.cyan, '╚═══════════════════════════════════════════════════════╝');

  let allPassed = true;

  // Run all checks
  if (!checkFileIntegrity()) allPassed = false;
  if (!await checkServer()) allPassed = false;
  if (!checkAssets()) allPassed = false;
  if (!await validateHTML()) allPassed = false;

  // Summary
  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    log(COLORS.green, '✓✓✓ ALL TESTS PASSED ✓✓✓');
    log(COLORS.cyan, 'Website is in a clean, valid state!');
  } else {
    log(COLORS.yellow, '⚠️  Some non-critical items need attention');
    log(COLORS.cyan, 'See details above');
  }
  console.log('='.repeat(60) + '\n');

  process.exit(allPassed ? 0 : 1);
}

main().catch(err => {
  log(COLORS.red, `Fatal error: ${err.message}`);
  process.exit(1);
});
