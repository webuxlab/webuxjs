/**
 * Take a screenshot of the webpage
 * @param {Object} page
 * @param {Boolean} fullPage Default: true
 * @returns { page: Object, screenshot: Buffer, errors: String[] }
 */
export async function takeScreenshot(page, fullPage = true) {
  const errors = [];
  const screenshot = await page.screenshot({ fullPage: fullPage === true }).catch((e) => {
    errors.push(`Failed to take a fullpage screenshot (${e.message || e})`);
  });

  return { page, screenshot, errors };
}
