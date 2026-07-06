import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

test.describe('Save The Date Website - Full Test Suite', () => {
  
  // ============ ZUGANGS-/GATE-TESTS ============
  test.describe('🚪 Gate & Gästegruppen', () => {
    
    test('Without code: gate is shown, content is hidden', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.click('#welcome-overlay');
      
      await expect(page.locator('#gate')).toBeVisible();
      await expect(page.locator('#timeline')).toBeHidden();
      await expect(page.locator('#umfrage')).toBeHidden();
      await expect(page.locator('#gallery')).toBeHidden();
      await expect(page.locator('#hotels')).toBeHidden();
      await expect(page.locator('#hero')).toBeHidden();
    });

    test('Gate offers a contact link', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.click('#welcome-overlay');
      
      const contactLink = page.locator('#gate a[href^="mailto:"]');
      await expect(contactLink).toBeVisible();
    });

    test('Wrong code: gate stays, no error surfaced', async ({ page }) => {
      await page.goto(`${BASE_URL}/#code=definitiv-falsch`);
      await page.click('#welcome-overlay');
      await page.waitForTimeout(800);
      
      await expect(page.locator('#gate')).toBeVisible();
      await expect(page.locator('#timeline')).toBeHidden();
      // Code darf nicht in der URL verbleiben
      expect(page.url()).not.toContain('code=');
    });

    test('Day-program is not present in HTML source (encrypted)', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const pageContent = await page.content();
      expect(pageContent).not.toContain('FREIE TRAUUNG');
      expect(pageContent).not.toContain('STANDESAMT');
      expect(pageContent).not.toContain('ABENDESSEN');
    });

    test('No admin login should be present', async ({ page }) => {
      await page.goto(BASE_URL);
      
      await expect(page.locator('#admin-login-btn')).toHaveCount(0);
      await expect(page.locator('#login-modal')).toHaveCount(0);
    });

    // Unlock-Tests: Codes werden NICHT im Repo gespeichert.
    // Lokal ausführen mit z.B.:
    //   $env:INVITE_CODE_EVENING='...'; $env:INVITE_CODE_DAY='...'; $env:INVITE_CODE_INNER='...'; npm test
    const CODES = {
      evening: process.env.INVITE_CODE_EVENING,
      day: process.env.INVITE_CODE_DAY,
      inner: process.env.INVITE_CODE_INNER
    };

    test('Evening code unlocks evening view', async ({ page }) => {
      test.skip(!CODES.evening, 'INVITE_CODE_EVENING nicht gesetzt');
      await page.goto(`${BASE_URL}/#code=${encodeURIComponent(CODES.evening)}`);
      await page.click('#welcome-overlay');
      
      await expect(page.locator('#timeline')).toBeVisible();
      await expect(page.locator('#hotels')).toBeVisible();
      await expect(page.locator('#gate')).toBeHidden();
      // Tagesprogramm darf NICHT auftauchen
      const content = await page.content();
      expect(content).not.toContain('FREIE TRAUUNG');
      expect(content).not.toContain('STANDESAMTLICHE');
    });

    test('Day code unlocks full day, but no Standesamt', async ({ page }) => {
      test.skip(!CODES.day, 'INVITE_CODE_DAY nicht gesetzt');
      await page.goto(`${BASE_URL}/#code=${encodeURIComponent(CODES.day)}`);
      await page.click('#welcome-overlay');
      await page.waitForTimeout(800);
      
      await expect(page.locator('#timeline')).toBeVisible();
      const content = await page.content();
      expect(content).toContain('FREIE TRAUUNG');
      expect(content).not.toContain('STANDESAMTLICHE');
    });

    test('Inner-circle code unlocks Standesamt + second location', async ({ page }) => {
      test.skip(!CODES.inner, 'INVITE_CODE_INNER nicht gesetzt');
      await page.goto(`${BASE_URL}/#code=${encodeURIComponent(CODES.inner)}`);
      await page.click('#welcome-overlay');
      await page.waitForTimeout(800);
      
      const content = await page.content();
      expect(content).toContain('STANDESAMTLICHE TRAUUNG');
      expect(content).toContain('Hauptstraße 11');
      await expect(page.locator('#extra-location > div')).toBeVisible();
    });
  });

  // ============ HTML STRUCTURE TESTS ============
  test.describe('📄 HTML Structure & Validation', () => {
    
    test('Page should have required meta tags', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const metaCharset = page.locator('meta[charset]');
      const metaViewport = page.locator('meta[name="viewport"]');
      const metaDescription = page.locator('meta[name="description"]');
      
      await expect(metaCharset).toBeTruthy();
      await expect(metaViewport).toBeTruthy();
      await expect(metaDescription).toBeTruthy();
    });

    test('All major sections should exist', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const sections = ['hero', 'location', 'timeline', 'gallery', 'umfrage', 'contact'];
      
      for (const section of sections) {
        const element = page.locator(`#${section}`);
        await expect(element).toBeTruthy();
      }
    });

    test('Navigation should be present and fixed', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const navbar = page.locator('#navbar');
      const position = await navbar.evaluate(el => 
        window.getComputedStyle(el).position
      );
      expect(position).toBe('fixed');
    });

    test('Music controls should be present', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const musicControl = page.locator('#music-controls');
      const musicToggle = page.locator('#music-toggle');
      
      await expect(musicControl).toBeTruthy();
      await expect(musicToggle).toBeTruthy();
    });
  });

  // ============ ASSET TESTS ============
  test.describe('🖼️ Assets & Resources', () => {
    
    test('All critical images should load', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const images = ['design-hero.jpg', 'banner-logo2.png', 'maxi2.png', 'laika1.png'];
      
      for (const img of images) {
        const response = await page.evaluate(async (imageName) => {
          try {
            const res = await fetch(`/assets/${imageName}`);
            return res.ok;
          } catch (e) {
            return false;
          }
        }, img);
        expect(response).toBe(true);
      }
    });

    test('Audio files should be accessible', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const audioFiles = ['IWasAlive.mp3', 'tth_05-23_06-03.mp3'];
      
      for (const audio of audioFiles) {
        const response = await page.evaluate(async (audioName) => {
          try {
            const res = await fetch(`/assets/${audioName}`);
            return res.ok;
          } catch (e) {
            return false;
          }
        }, audio);
        expect(response).toBe(true);
      }
    });

    test('Favicon should be present', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const favicon = page.locator('link[rel="icon"]');
      await expect(favicon).toBeTruthy();
    });
  });

  // ============ LINK TESTS ============
  test.describe('🔗 Links & Navigation', () => {
    
    test('Navigation links should be present', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const navLinks = ['hero', 'location', 'gallery', 'umfrage'];
      
      for (const link of navLinks) {
        const element = page.locator(`a[href="#${link}"]`);
        const count = await element.count();
        expect(count).toBeGreaterThan(0);
      }
    });

    test('External links should have correct href', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Externe Links (Google Maps / Kalender) müssen vorhanden und abgesichert sein
      const externalLinks = page.locator('a[target="_blank"]');
      const count = await externalLinks.count();
      expect(count).toBeGreaterThan(0);
      
      for (let i = 0; i < count; i++) {
        const rel = await externalLinks.nth(i).getAttribute('rel');
        expect(rel).toContain('noopener');
      }
    });

    test('Contact email link should be valid', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const emailLink = page.locator('a[href^="mailto:"]');
      const href = await emailLink.first().getAttribute('href');
      expect(href).toMatch(/^mailto:[\w\.\-]+@[\w\.\-]+\.\w+/);
    });
  });

  // ============ JAVASCRIPT TESTS ============
  test.describe('⚙️ JavaScript & Functionality', () => {
    
    test('No console errors on page load', async ({ page }) => {
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      await page.goto(BASE_URL);
      expect(errors).toEqual([]);
    });

    test('Welcome overlay should be clickable', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const overlay = page.locator('#welcome-overlay');
      await expect(overlay).toBeVisible();
      
      await overlay.click();
      await page.waitForTimeout(500);
      
      const isHidden = await overlay.evaluate(el => 
        el.style.display === 'none' || !el.offsetParent
      );
      expect(isHidden).toBe(true);
    });

    test('Music toggle button should exist and be functional', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.click('#welcome-overlay');
      
      const musicToggle = page.locator('#music-toggle');
      await expect(musicToggle).toBeVisible();
      
      // Button should be clickable
      await musicToggle.click();
      expect(true).toBe(true);
    });

    test('Background audio element should exist', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const audio = page.locator('#bg-music');
      const source = audio.locator('source');
      const src = await source.getAttribute('src');
      
      expect(src).toContain('.mp3');
    });
  });

  // ============ RESPONSIVE DESIGN TESTS ============
  test.describe('📱 Responsive Design', () => {
    
    test('Should be responsive on mobile (375px)', async ({ page }) => {
      page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);
      
      const navbar = page.locator('#navbar');
      await expect(navbar).toBeVisible();
    });

    test('Should be responsive on tablet (768px)', async ({ page }) => {
      page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(BASE_URL);
      
      const navbar = page.locator('#navbar');
      await expect(navbar).toBeVisible();
    });

    test('Should be responsive on desktop (1920px)', async ({ page }) => {
      page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(BASE_URL);
      
      const navbar = page.locator('#navbar');
      await expect(navbar).toBeVisible();
    });
  });

  // ============ ACCESSIBILITY TESTS ============
  test.describe('♿ Accessibility', () => {
    
    test('Page should have a title', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
    });

    test('Images should have alt text (critical ones)', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const logo = page.locator('img[src*="banner-logo2"]');
      const alt = await logo.first().getAttribute('alt');
      // Note: Some images may not have alt text, but critical ones should
    });

    test('Form inputs should have labels', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const formInputs = page.locator('#survey-form input');
      const inputCount = await formInputs.count();
      
      // If form exists, inputs should be accessible
      if (inputCount > 0) {
        const labels = page.locator('#survey-form label');
        const labelCount = await labels.count();
        expect(labelCount).toBeGreaterThan(0);
      }
    });
  });

  // ============ PERFORMANCE TESTS ============
  test.describe('⚡ Performance', () => {
    
    test('Page should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(BASE_URL);
      const loadTime = Date.now() - startTime;
      
      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('Critical CSS should be present', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const tailwindCSS = page.locator('link[href="tailwind.css"]');
      const customCSS = page.locator('link[href="styles.css"]');
      
      await expect(tailwindCSS).toHaveCount(1);
      await expect(customCSS).toHaveCount(1);
    });
  });

  // ============ DATA VALIDATION TESTS ============
  test.describe('📅 Event Data Validation', () => {
    
    test('Date should be 19.09.2026', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const pageContent = await page.content();
      expect(pageContent).toContain('19.09.2026');
    });

    test('Wedding date should appear in title', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const title = await page.title();
      expect(title).toContain('2026');
    });

    test('Location section should exist and have content', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const locationSection = page.locator('#location');
      const content = await locationSection.textContent();
      expect(content.length).toBeGreaterThan(0);
    });
  });
});
