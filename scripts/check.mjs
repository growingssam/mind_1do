import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = resolve(root, 'site');

// These are the original version-14 files, not recreations of the design.
const essentialFiles = [
  'index.html',
  'garden.css', 'garden.js', 'student.css',
  'ambient-audio.css', 'ambient-audio.js',
  'scene-v4.css', 'scene-v6.css', 'scene-v7.css',
  'scene-v8.css', 'scene-v9.css', 'scene-v10.css',
  'art/gymnopedie-acoustic-piano-v14.mp3',
  'art/acoustic-piano-attribution.txt',
  'art/paper-boat-bean-v6.png',
  'art/paper-plane-bean-v6.png',
  'art/kind-words-tree-v10.png',
  'art/weather-sun-v9.png', 'art/weather-cloud-v9.png',
  'art/weather-rain-v9.png', 'art/weather-storm-v9.png',
  'art/weather-unsure-v9.png'
];

const missing = essentialFiles.filter((file) => !existsSync(resolve(source, file)));
if (missing.length) {
  console.error('배포 필수 파일 누락:', missing.join(', '));
  process.exit(1);
}

const html = readFileSync(resolve(source, 'index.html'), 'utf8');
for (const name of ['garden.js', 'ambient-audio.js', 'ambient-audio.css']) {
  if (!html.includes(name)) {
    console.error(`HTML에서 ${name} 참조를 찾지 못했습니다.`);
    process.exit(1);
  }
}
const audio = readFileSync(resolve(source, 'ambient-audio.js'), 'utf8');
if (!audio.includes('gymnopedie-acoustic-piano-v14.mp3')) {
  console.error('원본 피아노 음원 참조를 찾지 못했습니다.');
  process.exit(1);
}
console.log(`버전 14 파일 검사 완료 (${essentialFiles.length}개 필수 파일, 피아노 ${statSync(resolve(source, 'art/gymnopedie-acoustic-piano-v14.mp3')).size}바이트)`);
