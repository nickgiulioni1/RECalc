const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..', 'src');
const buildDir = path.resolve(__dirname, '..', 'build');

const copyRecursive = (from, to) => {
  const stats = fs.statSync(from);
  if (stats.isDirectory()) {
    fs.mkdirSync(to, { recursive: true });
    for (const entry of fs.readdirSync(from)) {
      copyRecursive(path.join(from, entry), path.join(to, entry));
    }
  } else {
    fs.copyFileSync(from, to);
  }
};

const cleanBuild = () => {
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
    return;
  }

  for (const entry of fs.readdirSync(buildDir)) {
    fs.rmSync(path.join(buildDir, entry), { recursive: true, force: true });
  }
};

const writeReadme = () => {
  const readmePath = path.join(buildDir, 'README.md');
  const contents = `# Build Output\n\nThis folder contains static build artifacts for the Real Estate Investment Calculator.\n\n- Generated on ${new Date().toISOString()}\n- Source: \`src/\`\n- Script: \`npm run build\`\n`;
  fs.writeFileSync(readmePath, contents);
};

const main = () => {
  cleanBuild();
  copyRecursive(srcDir, buildDir);
  writeReadme();
  console.log('Build complete. Files emitted to /build');
};

main();
