import { cpSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const source = resolve(root, 'site');
const output = resolve(root, 'dist');

execFileSync(process.execPath, [resolve(root, 'scripts/check.mjs')], { stdio: 'inherit' });
if (!existsSync(source)) throw new Error('원본 사이트 폴더가 없습니다.');

// Static files are the original Sites build. Copy byte-for-byte to preserve UI and animation.
rmSync(output, { recursive: true, force: true });
cpSync(source, output, { recursive: true });
console.log('Vercel 정적 배포 폴더 dist/ 생성 완료');
