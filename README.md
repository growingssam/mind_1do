# 오늘도 1도 마음온도 — Vercel 배포본

GPT Sites의 `maeumondo-garden-preview-2026` **14번째 버전**에서 가져온 원본 정적 파일을 그대로 보존한 독립 프로젝트입니다.

- 원본 파일: `site/` (HTML, CSS, JavaScript, 일러스트 PNG, 실제 피아노 MP3)
- 빌드 출력: `dist/`
- 외부 API 및 Firebase 연결 없음. 마음기록은 사용자가 선택한 경우 자신의 브라우저 `localStorage`에 저장됩니다.
- 현재 화면과 동작을 바꾸지 않기 위해 React로 재작성하지 않았습니다.
- 음악 출처와 라이선스 설명: `site/art/acoustic-piano-attribution.txt`

## 로컬 확인

```bash
npm install
npm run check
npm run build
```

## Vercel 설정

GitHub 저장소 이름과 Vercel 프로젝트 이름을 **`mind-1do`**로 지정합니다.

| 설정 | 값 |
| --- | --- |
| Framework Preset | Other |
| Root Directory | `./` |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

이 프로젝트는 정적 사이트이므로 서버 환경변수가 필요하지 않습니다.

## 주의사항

- 원본 GPT Sites 프로젝트는 이 배포본과 별개이며 수정하지 않습니다.
- ZIP을 받은 경우 압축 해제 후 이 프로젝트의 파일 전체를 GitHub 저장소 루트에 업로드하세요.
- `site/` 전체를 업로드해야 음원과 그림이 빠지지 않습니다.
- 공개 배포 시 개인 기록은 기기에 남고 다른 기기로 동기화되지 않습니다. 공용 기기에서는 '저장 안 함'을 이용하세요.
