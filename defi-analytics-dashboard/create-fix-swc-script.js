// Create scripts directory if it doesn't exist
const fs = require('fs');
const path = require('path');

const scriptsDir = path.join(__dirname, 'scripts');
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

// Create the fix-swc.js script
const fixSwcScript = `
const fs = require('fs');
const path = require('path');
const os = require('os');

// Determine the correct SWC package based on the platform and architecture
function getSwcPackage() {
  const platform = os.platform();
  const arch = os.arch();

  if (platform === 'darwin') {
    return arch === 'arm64' ? '@next/swc-darwin-arm64' : '@next/swc-darwin-x64';
  } else if (platform === 'linux') {
    if (arch === 'arm64') {
      // Check for musl or gnu
      const isMusl = fs.existsSync('/lib/libc.musl-x86_64.so.1');
      return isMusl ? '@next/swc-linux-arm64-musl' : '@next/swc-linux-arm64-gnu';
    } else {
      // Check for musl or gnu
      const isMusl = fs.existsSync('/lib/libc.musl-x86_64.so.1');
      return isMusl ? '@next/swc-linux-x64-musl' : '@next/swc-linux-x64-gnu';
    }
  } else if (platform === 'win32') {
    if (arch === 'arm64') {
      return '@next/swc-win32-arm64-msvc';
    } else if (arch === 'ia32') {
      return '@next/swc-win32-ia32-msvc';
    } else {
      return '@next/swc-win32-x64-msvc';
    }
  }

  throw new Error(\`Unsupported platform: \${platform} \${arch}\`);
}

// Get the correct SWC package
const swcPackage = getSwcPackage();
console.log(\`Detected platform requires: \${swcPackage}\`);

// Check if package.json exists
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('package.json not found');
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Check if the SWC package is already in dependencies
if (packageJson.dependencies && packageJson.dependencies[swcPackage]) {
  console.log(\`\${swcPackage} is already in dependencies\`);
  process.exit(0);
}

// Add the SWC package to dependencies
if (!packageJson.dependencies) {
  packageJson.dependencies = {};
}

// Get the Next.js version
const nextVersion = packageJson.dependencies.next.replace('^', '').replace('~', '');
packageJson.dependencies[swcPackage] = \`^\${nextVersion}\`;

// Write the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log(\`Added \${swcPackage}@\${nextVersion} to dependencies\`);

console.log('SWC dependencies fixed successfully!');
`;

fs.writeFileSync(path.join(scriptsDir, 'fix-swc.js'), fixSwcScript);
console.log('Created fix-swc.js script');