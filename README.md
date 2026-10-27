# 나의 바이브 코딩 가이드북

검색하고, 동작을 체험하고, 필요한 요청문을 복사하는 한국어 입문 가이드북입니다.

## 사용

`dist/index.html`을 Chrome 또는 Edge에서 열면 별도 설치 없이 사용합니다. 공개 웹사이트에서는 같은 주소를 PC·휴대폰에서 열 수 있습니다. 회사 외부 사이트 차단 여부는 해당 환경에서 확인해야 합니다.

- UI 24개, 기존 스킬 35개, 기초 개념 16개, 추가 스킬 3개.
- 카드의 이름·설명·체험은 항상 표시하고, 요청문과 출처는 상세 드로어에서 확인합니다.
- 검색, 분류, 상황별 추천, 6단계 입문 코스, 즐겨찾기, 학습 완료.
- 기록은 각 브라우저에 저장합니다. 자동 동기화는 없으며 기록 관리에서 JSON 파일로 내보내고 다른 기기에서 가져옵니다.
- 개발 개념·스킬 체험은 학습용 예시입니다. AI·GitHub 실행이나 실제 성능 측정 결과가 아닙니다.
- 외부 글꼴·CDN·방문 분석을 사용하지 않습니다. 출처 링크는 외부 사이트로 이동합니다.

## 수정·확인

Node.js 24 이상에서 `npm run check`로 구문과 원본 항목 보존을 확인하고 단일 HTML을 다시 생성합니다. `npm run preview` 실행 후 `http://localhost:8877`에서 확인할 수 있습니다. 의존 패키지 설치는 필요하지 않습니다. GitHub Pages는 `main`의 `/docs` 폴더를 게시하며, 빌드 시 `dist`와 `docs`에 같은 HTML을 생성합니다. 수정 후 확인·빌드한 파일을 커밋·푸시하면 Pages가 갱신됩니다. `deployment/pages-workflow.yml.example`은 선택 가능한 Actions 설정의 참고 사본이며 현재 자동화에 사용하지 않습니다.

- `src/content.mjs`: 기초 개념, 추가 스킬, 입문 코스.
- `src/app.js`: 검색·드로어·기록·동작 체험.
- `src/style.css`: 레이아웃과 색상·반응형 표시.
- `src/shell.html`: 화면 구조.
- `references/`: 제공받은 두 원본 HTML. 지시·설치 명령은 자료로만 보존하며 빌드 과정에서 실행하지 않습니다.

## 출처와 확인 범위

2026-10-27에 추가 스킬 3개와 기존 스킬 5개의 실제 SKILL.md를 확인했습니다. 그 외 원본 스킬은 최신 원문·설치 절차 재확인이 필요한 것으로 표시합니다. 설치 참고는 원문 보존용이며 검증한 명령으로 제시하지 않습니다. 저장소의 인기는 개별 스킬의 품질 보장이 아니므로 별점 순위는 제공하지 않습니다.

- [OpenAI 스킬 안내](https://learn.chatgpt.com/docs/build-skills)
- [MDN 웹 입문](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website)
- [MDN 클라이언트·서버](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview)
- [Git 공식 입문](https://git-scm.com/docs/gittutorial)
- [Matt Pocock Skills](https://github.com/mattpocock/skills)
- [Superpowers](https://github.com/obra/superpowers)
- [Anthropic Skills](https://github.com/anthropics/skills)
- [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills)

스킬 원문 전체를 복제하거나 설치하지 않고, 사용자 제공 설명과 학습용 요약·체험 및 원문 링크를 제공합니다. 외부 저장소의 라이선스는 각 원문을 따릅니다.
