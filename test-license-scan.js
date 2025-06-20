import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { runLicenseScan } from './License_scanner.js'; // Make sure the path is correct

const tempRepo = path.join('/tmp', 'test-license-repo');

// Step 1: Create a temporary directory for the test project
if (!fs.existsSync(tempRepo)) {
  fs.mkdirSync(tempRepo, { recursive: true });
}

// Step 2: Create a minimal package.json with a risky dependency
fs.writeFileSync(
  path.join(tempRepo, 'package.json'),
  JSON.stringify({
    name: "license-scan-test",
    version: "1.0.0",
    dependencies: {
      "gnuplot": "^0.2.0"
    }
  }, null, 2)
);

// Step 3: Install dependencies (omit dev dependencies, disable audit/scripts)
console.log('[+] Installing dependencies...');
execSync('npm install --omit=dev --ignore-scripts --no-audit --no-fund', {
  cwd: tempRepo,
  stdio: 'inherit',
  env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=512' }
});

// Step 4: Run the license scan
console.log('[+] Running license scan...');
await runLicenseScan(tempRepo, 'test-scan-id-123');
