import { spawnSync } from 'node:child_process';

const files = process.argv.slice(2);
const targets = files.length ? files : ['js/game.js'];
let failed = false;

for (const file of targets) {
  const result = spawnSync(process.execPath, ['--check', file], {
    stdio: 'inherit'
  });

  if (result.status !== 0) {
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}
