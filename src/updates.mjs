export const newConcepts=[
 {
  id:'base-agent',title:'AI 에이전트',en:'AI Agent',type:'기초 개념',category:'개발 기초',level:'입문',added:true,
  description:'목표를 받고 필요한 도구를 골라 작업하는 AI. 설명을 받는 것과 실제 실행을 구분해 보세요.',
  tags:'에이전트 agent 채팅 실행 도구 작업 자동화 승인 검증',
  when:'AI가 방법만 설명한 것인지, 도구로 실제 작업한 것인지 헷갈릴 때',
  prompt:'[목표]를 진행해줘. 먼저 사용할 도구와 확인 방법을 알려줘. 실제로 실행한 작업·결과·미확인을 구분해줘. 메일 발송이나 공개 게시처럼 외부에 영향을 주는 작업은 내가 명시적으로 지시한 범위에서만 해줘.',
  caution:'도구·권한·연결이 있어야 실제 작업할 수 있습니다. 이 카드의 버튼은 학습용 예시이며 파일을 만들거나 외부 서비스를 실행하지 않습니다.',
  source:'Anthropic · Building effective agents',sourceUrl:'https://www.anthropic.com/research/building-effective-agents',
  steps:[['목표','일정 목록을 정리할 목표를 받습니다.'],['도구 선택','필요한 도구와 허용 범위를 확인합니다.'],['결과 확인','실행 결과와 미확인을 나눕니다.']],
  experience:{kind:'agent',note:'같은 목표라도 답변과 도구 실행의 결과는 달라요. 예시 상태만 바뀝니다.'}
 },
 {
  id:'base-extensions',title:'스킬·플러그인·MCP',en:'Skill · Plugin · MCP',type:'기초 개념',category:'개발 기초',level:'입문',added:true,
  description:'스킬은 작업 안내서, 플러그인은 기능을 묶은 확장 패키지, MCP는 외부 도구와 연결하는 규약입니다.',
  tags:'스킬 플러그인 plugin MCP 연결 규약 protocol 도구 확장 설치 차이 비교',
  when:'자료에 스킬·플러그인·MCP가 섞여 나와 무엇을 설치하는지 모르겠을 때',
  prompt:'[추가할 기능]에 필요한 것이 스킬·플러그인·MCP 중 무엇인지 쉽게 설명해줘. 지금 사용 중인 도구에서 지원하는지, 이미 연결되어 있는지 먼저 확인해줘. 설치나 설정 변경을 하기 전 필요한 항목과 변경 위치를 보여줘.',
  caution:'플러그인의 구성과 설치 방식은 AI 도구마다 다릅니다. 스킬이나 MCP를 플러그인 없이 따로 사용할 수도 있습니다. 이 카드에서는 설치하지 않습니다.',
  source:'MCP 공식 소개',sourceUrl:'https://modelcontextprotocol.io/docs/getting-started/intro',
  sourceLinks:[{title:'플러그인 구성 예시 · Claude Code 공식 문서',url:'https://code.claude.com/docs/en/plugins'}],
  steps:[['스킬','작업 순서와 확인 기준을 참고합니다.'],['플러그인','여러 확장 요소를 한 묶음으로 배포할 수 있습니다.'],['MCP','허용된 외부 도구를 공통 규약으로 연결합니다.']],
  experience:{kind:'extensions',note:'세 가지는 경쟁 도구가 아니라 역할이 달라요. 지원 방식은 환경마다 확인하세요.'}
 }
];
export function enhanceMotion(items){
 for(const id of ['ui-transition','ui-stagger']){
  const t=items.find(t=>t.id===id);if(!t)throw Error('기존 모션 카드 누락');
  t.tags+=' duration delay easing 속도 시간 지연 가속감';
  t.sourceLinks=[{title:'움직임의 가속감 · MDN',url:'https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function'}];
  t.motionControls=true;
  t.prompt=id==='ui-transition'?'버튼을 누르면 요소가 부드럽게 이동하게 해줘. 이동 시간은 400ms, 시작 지연은 0ms, 가속감은 ease-out으로 해줘. 모바일에서도 누를 수 있게 하고 동작 줄이기 설정을 존중해줘.':'카드 6개가 차례로 나타나게 해줘. 각 카드의 등장 시간은 400ms, 카드 사이 간격은 100ms, 시작 지연은 0ms, 가속감은 ease-out으로 해줘. 다시 재생 버튼을 넣고 동작 줄이기 설정에서는 즉시 표시해줘.';
 }
}
