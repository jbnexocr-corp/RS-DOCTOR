import { randomBytes, scryptSync } from 'node:crypto';

const readHidden = () => new Promise((resolve) => {
  if (!process.stdin.isTTY) {
    let value = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { value += chunk; });
    process.stdin.on('end', () => resolve(value.trimEnd()));
    return;
  }

  let value = '';
  process.stdout.write('Contraseña nueva (entrada oculta): ');
  process.stdin.setRawMode(true);
  process.stdin.setEncoding('utf8');
  process.stdin.resume();
  const finish = () => {
    process.stdin.setRawMode(false);
    process.stdin.pause();
    process.stdout.write('\n');
    resolve(value);
  };
  process.stdin.on('data', (key) => {
    if (key === '\u0003') process.exit(130);
    if (key === '\r' || key === '\n') return finish();
    if (key === '\u007f' || key === '\b') { value = value.slice(0, -1); return; }
    value += key;
  });
});

const password = await readHidden();

if (password.length < 16) {
  console.error('La contraseña debe tener al menos 16 caracteres.');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
console.log(`\nADMIN_PASSWORD_HASH=scrypt:${salt.toString('base64url')}:${hash.toString('base64url')}`);
