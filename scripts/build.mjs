import fs from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve('dist');
const siteOrigin = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(output, { recursive: true });

// The archived reference includes the runtime chunks and supporting media the
// invitation uses. The groom document and its client module replace the
// original route so this project serves the groom card at /.
await fs.cp('reference', output, { recursive: true });
await fs.writeFile(
  path.join(output, 'index.html'),
  (await fs.readFile('src/index.html', 'utf8')).replaceAll('__SITE_ORIGIN__', siteOrigin),
);
await fs.copyFile(
  'src/invitation.js',
  path.join(output, '_next/static/chunks/app/groom-page.js'),
);
await fs.writeFile(
  path.join(output, '_next/static/css/groom.css'),
  `${await fs.readFile('src/styles.css', 'utf8')}\n${await fs.readFile('src/groom-styles.css', 'utf8')}`,
);
await fs.cp('src/assets', path.join(output, 'assets'), { recursive: true });

console.log('Built standalone groom invitation in dist/.');
