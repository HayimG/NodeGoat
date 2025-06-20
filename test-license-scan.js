import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { runLicenseScan } from './License_scanner.js'; // Make sure the path is correct

const tempRepo = path.join('/tmp', 'test-license-repo');

(async () => {
  try {
    // Create temporary project directory
    if (!fs.existsSync(tempRepo)) fs.mkdirSync(tempRepo, { recursive: true });

    // Write a minimal package.json with a known GPL-licensed dependency
    fs.writeFileSync(
      path.join(tempRepo, 'package.json'),
      JSON.stringify({
        name: "license-scan-test",
        version: "1.0.0",
        dependencies: {
          "gnuplot": "^0.2.0" // known GPL license
        }
      }, null, 2)
    );

    // Install dependencies (production only, skip audit and scripts)
    console.log('[+] Installing test dependencies...');
    execSync('npm install --omit=dev --ignore-scripts --no-audit --no-fund', {
      cwd: tempRepo,
      stdio: 'inherit',
      env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=512' }
    });

    // Run the license scanner with a test scan ID
    console.log('[+] Running test license scan...');
    await runLicenseScan(tempRepo, 'test-scan-id-123');

    console.log('[✔] Test license scan completed.');
  } catch (err) {
    console.error('[!] Test scan failed:', err);
  }
})();
