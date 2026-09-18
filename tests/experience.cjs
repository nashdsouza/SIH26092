// Run against the Flask server. BROWSER_CHANNEL=msedge uses an installed Edge.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:5001';
const axePath = require.resolve('axe-core/axe.min.js');
fs.mkdirSync('outputs/ux', { recursive: true });
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  page.setDefaultTimeout(15000);
  const errors = [], accessibility = [];
  page.on('pageerror', error => errors.push(error.message));
  async function audit(name) {
    await page.addScriptTag({ path: axePath });
    const result = await page.evaluate(async () => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa'] } }));
    accessibility.push({ screen: name, violations: result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) });
    await page.screenshot({ path: `outputs/ux/${name}.png`, fullPage: true });
  }
  const next = () => page.locator('.wizard-next').click();
  try {
    await page.goto(baseURL);
    assert.equal(await page.locator('#age').inputValue(), '');
    assert.equal(await page.locator('.goal-card').count(), 3);
    await audit('home');
    await page.locator('#how-it-works>summary').click();
    await audit('how-it-works');
    await page.locator('#how-it-works>summary').click();
    await page.locator('[data-start-goal="new"]').click();
    await page.locator('#age').fill('12');
    await next();
    assert.equal(await page.locator('.wizard-count').textContent(), '1 / 6');
    await page.locator('#age').fill('32');
    await page.locator('#social_category').selectOption('SC');
    await audit('profile');
    await next();
    await page.locator('#state').fill('Maharashtra');
    await page.locator('#location_type').selectOption('urban');
    await page.locator('#annual_family_income_inr').fill('250000');
    await page.locator('#education_level').selectOption('12');
    await next();
    assert.equal(await page.locator('#business_stage').inputValue(), 'new');
    assert.equal(await page.locator('#trade').isVisible(), false);
    await page.locator('#is_artisan_or_craftsperson').check();
    assert.equal(await page.locator('#trade').isVisible(), true);
    await page.locator('#project_sector').selectOption('manufacturing');
    await page.locator('#business_sector').selectOption('textile');
    await page.locator('#ownership_sc_st_pct').fill('100');
    await next();
    await page.reload();
    await page.locator('#resume-journey').click();
    assert.equal(await page.locator('.wizard-count').textContent(), '4 / 6');
    assert.equal(await page.locator('#age').inputValue(), '32');
    await page.locator('#project_cost_inr').fill('600000');
    await page.locator('#requested_loan_amount_inr').fill('500000');
    await page.locator('#has_capital_expenditure').check();
    await page.locator('#has_business_plan').check();
    await next();
    await page.locator('#is_indian_citizen').check();
    await page.locator('#is_self_employed').check();
    await next();
    assert.match(await page.locator('.profile-review').textContent(), /Maharashtra/);
    await audit('review');
    // Recover from a network failure without losing the profile.
    await page.route('**/api/match', route => route.abort());
    await page.locator('#profile-submit').click();
    await page.locator('[data-retry-match]').waitFor();
    assert.equal(await page.locator('#age').inputValue(), '32');
    await audit('error');
    await page.unroute('**/api/match');
    // Slow requests must leave a visible loading state, not an empty screen.
    let release;
    const pending = new Promise(resolve => release = resolve);
    await page.route('**/api/match', async route => { await pending; await route.continue(); });
    await page.locator('[data-retry-match]').click();
    await page.locator('#results .loading').waitFor();
    release();
    await page.locator('.result-card').first().waitFor();
    await page.unroute('**/api/match');
    assert.equal(await page.locator('.result-card:visible').count(), 3);
    await audit('matches');
    const selectedId = await page.locator('[data-prepare-match]').first().getAttribute('data-prepare-match');
    await page.locator('[data-prepare-match]').first().click();
    await page.locator('.passport-checklist').waitFor();
    assert.equal(await page.evaluate(() => passportSession.selectedSchemeId), selectedId);
    assert.equal(await page.locator('.passport-schemes').isVisible(), false);
    await audit('documents');
    await page.locator('.passport-switch').click();
    assert.equal(await page.locator('.passport-schemes').isVisible(), true);
    await page.locator('[data-view="gps"]').click();
    await page.locator('.gps-score-value').waitFor();
    assert.equal(await page.locator('.gps-lab').getAttribute('open'), null);
    await audit('routes');
    await page.locator('.gps-lab>summary').click();
    await page.locator('.gps-compare-panel>summary').click();
    await audit('route-tools');
    await page.locator('#gps-run').click();
    await page.locator('#gps-apply').waitFor();
    await page.keyboard.press('Control+k');
    assert.equal(await page.locator('.command-dialog').isVisible(), true);
    await page.locator('.command-dialog input').fill('Dashboard');
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#dashboard-view').isVisible(), true);
    await page.goBack();
    assert.equal(await page.locator('#gps-view').isVisible(), true);
    for (const width of [360,390,768,820,1024,1440]) {
      await page.setViewportSize({width, height:900});
      for (const view of ['dashboard','matcher','gps','passport']) {
        await page.locator(`[data-view="${view}"]`).click();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${view}: overflow at ${width}`);
      }
    }
    await page.setViewportSize({width:390,height:844});
    await page.locator('[data-view="passport"]').click();
    await audit('mobile-documents');
    await page.locator('[data-view="dashboard"]').click();
    await audit('mobile-home');
    for (const lang of ['hi','kn','mr','en']) {
      await page.locator('#language-selector').selectOption(lang);
      assert.equal(await page.locator('html').getAttribute('lang'),lang);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `language ${lang}: overflow`);
    }
    await page.locator('[data-view="matcher"]').click();
    await page.locator('[data-edit-profile]').click();
    await audit('mobile-profile');
    await page.locator('#assistant-launcher').click();
    await page.locator('#assistant-input').fill('How do I find schemes?');
    await page.locator('#assistant-send').click();
    await page.locator('.assistant-message.typing').waitFor({state:'hidden'});
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#assistant-panel').getAttribute('aria-hidden'),'true');
    // Existing share links and no-match recovery must remain usable.
    const share = await page.evaluate(() => encodeShareData(appSession.matches));
    await page.goto(`${baseURL}/#results=${encodeURIComponent(share)}`);
    await page.reload();
    await page.locator('.result-card').first().waitFor();
    assert.equal(await page.locator('.prepare-match').count(),0,'shared results do not pretend to have a private profile');
    await audit('shared-results');
    await page.locator('[data-edit-profile]').click();
    await page.locator('.profile-step[data-profile-step="5"]').click();
    await page.route('**/api/match', route => route.fulfill({json:{results:[]}}));
    await page.locator('#profile-submit').click();
    await page.locator('#results .feature-empty').waitFor();
    await audit('empty-results');
    await page.unroute('**/api/match');
    assert.deepEqual(errors,[],'No uncaught browser errors');
    fs.writeFileSync('outputs/ux/accessibility.json',JSON.stringify(accessibility,null,2));
    const violations = accessibility.flatMap(screen => screen.violations.map(v => `${screen.screen}: ${v.id} (${v.nodes.length})`));
    console.log('PASS: real profile, conditional fields, validation, review, session restore, failed/slow requests, retry, shortlist, selected documents, GPS scenarios, keyboard search, browser Back, four languages, six widths, assistant.');
    console.log(violations.length ? `Accessibility findings:\n${violations.join('\n')}` : 'PASS: no automated WCAG A/AA violations on audited screens.');
    if(violations.length) process.exitCode=1;
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
