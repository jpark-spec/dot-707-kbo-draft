# .707 — KBO 드래프트 게임

[144-0 — KBO 올타임 드래프트](https://github.com/DrunkJin/kbo-144-0)(DrunkJin)와 82-0 같은 무패 시즌 드래프트 게임에서 영감을 받은 독립 프로젝트입니다. 시즌 기록은 같은 저장소가 정리한 Kaggle KBO Player Dataset을 사용했습니다.

빌드 과정이 없는 정적 사이트입니다. `index.html` 한 파일에 게임 코드·선수 데이터·픽셀 폰트(Galmuri14, SIL OFL 1.1)가 모두 들어 있고, 외부 요청은 Google Fonts(Black Han Sans, IBM Plex Sans KR)뿐입니다.

## 파일
- `index.html` — 게임 전체 (약 1.8MB, gzip 전송 시 훨씬 작아짐)
- `vercel.json` — 보안 헤더, HTML 캐시 정책
- `robots.txt`

## Vercel 배포

### A. CLI
```bash
npm i -g vercel
cd 707-vercel
vercel          # 첫 배포(프리뷰). 프로젝트 이름·스코프를 물어봄
vercel --prod   # 프로덕션 배포
```
Framework Preset은 **Other**, Build Command·Output Directory는 비워 둡니다.

### B. GitHub 연동
1. 이 폴더 내용을 새 저장소 루트에 올립니다.
2. Vercel 대시보드 → Add New… → Project → 저장소 Import
3. Framework Preset **Other**, Root Directory는 저장소 루트, 빌드 설정 없음 → Deploy

이후 `index.html`을 교체해 push하면 자동 재배포됩니다.

## 업데이트
게임 데이터나 가격을 고치면 `index.html`만 바꾸면 됩니다. 브라우저 저장(localStorage)은 같은 도메인에서 유지되므로, 도메인을 바꾸면 이전 기록은 이어지지 않습니다.
