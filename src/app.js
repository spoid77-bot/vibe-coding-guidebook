const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s).toLowerCase().replace(/[\s/?·!.,\-]/g,'');
const KEY='vibe-guidebook-v1', ids=new Set(ITEMS.map(t=>t.id));
let storageAvailable=true, record={favorites:[],completed:[],last:null}, tab='전체', category='전체', situation='', course=-1, activeItem=null, returnFocus=null;
function validRecord(x){return x&&Array.isArray(x.favorites)&&Array.isArray(x.completed)&&x.favorites.every(y=>typeof y==='string')&&x.completed.every(y=>typeof y==='string')&&(x.last===null||typeof x.last==='string');}
try{const raw=localStorage.getItem(KEY);if(raw){const x=JSON.parse(raw);if(validRecord(x))record={favorites:x.favorites.filter(id=>ids.has(id)),completed:x.completed.filter(id=>ids.has(id)),last:ids.has(x.last)?x.last:null};}localStorage.setItem(KEY,JSON.stringify(record));}catch{storageAvailable=false;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(record));}catch{storageAvailable=false;toast('기록을 저장하지 못했습니다. 기록 관리에서 파일로 보관해 주세요.');}updateProgress();}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),2800);}
const tabs=['전체','기초 개념','UI 용어','스킬','즐겨찾기'];
const situations=[
 ['어디서 시작하지?',['base-vibe','base-prompt','skill-grill-me','skill-to-spec','skill-prototype']],
 ['원하는 화면을 설명하고 싶어',['ui-responsive','ui-card','ui-modal','ui-drawer','ui-tabs','ui-stagger','skill-frontend-design']],
 ['오류가 안 고쳐져',['base-debug','skill-diagnosing-bugs','skill-systematic-debugging','skill-tdd']],
 ['다 됐다는데 안 돼',['base-test','skill-verification','extra-webapp','extra-guidelines']],
 ['저장·서버가 헷갈려',['base-frontend','base-backend','base-api','base-javascript']],
 ['기록하고 배포하고 싶어',['base-git','base-branch','base-github','base-deploy','skill-pr','skill-finishing']],
 ['대화가 길어졌어',['base-context','skill-handoff','skill-retro','skill-wait-what']]
];
function counts(t){return t==='전체'?ITEMS.length:t==='즐겨찾기'?record.favorites.length:ITEMS.filter(i=>i.type===t).length;}
function renderControls(){
 $('#tabs').innerHTML=tabs.map(t=>`<button class="${tab===t?'on':''}" data-tab="${t}" aria-pressed="${tab===t}">${t}<span class="tab-count">${counts(t)}</span></button>`).join('');
 $('#situations').innerHTML=situations.map(([s])=>`<button class="chip situation ${situation===s?'on':''}" data-situation="${s}" aria-pressed="${situation===s}">${s}</button>`).join('');
 const cats=['전체',...new Set(ITEMS.filter(i=>tab==='전체'||tab==='즐겨찾기'||i.type===tab).map(i=>i.category))];
 if(!cats.includes(category))category='전체';
 $('#categories').innerHTML=cats.map(c=>`<button class="chip ${category===c?'on':''}" data-category="${c}" aria-pressed="${category===c}">${c}</button>`).join('');
}
function svgFlow(t,step){const steps=t.steps||[],n=steps.length,w=300,gap=9,node=(w-gap*(n-1))/n;return `<svg viewBox="0 0 300 48" role="img" aria-label="${esc(steps.map((s,i)=>`${i+1}단계 ${s[0]}`).join(', '))}">${steps.map((s,i)=>{const x=i*(node+gap);return `${i?`<path d="M ${x-8} 23 h6 m-3 -3 3 3 -3 3" stroke="#8ba894" fill="none"/>`:''}<rect x="${x}" y="4" width="${node}" height="38" rx="7" fill="${i===step?'#17685b':i<step?'#dbeadd':'#fff'}" stroke="${i===step?'#17685b':'#d7e1d5'}"/><text x="${x+node/2}" y="27" text-anchor="middle" fill="${i===step?'#fff':'#4b6554'}" font-size="10" font-family="system-ui,sans-serif">${esc(s[0])}</text>`;}).join('')}</svg>`;}
function simulation(t){return `<div class="sim" data-sim="${t.id}" data-step="0" data-mode="success">${t.id==='base-api'?'<div class="sim-mode"><button class="on" data-mode="success" aria-pressed="true">성공 응답</button><button data-mode="error" aria-pressed="false">오류 응답</button></div>':''}<div class="sim-flow">${svgFlow(t,0)}</div><div class="sim-title">${esc(t.steps[0][0])}</div><p class="sim-text">${esc(t.steps[0][1])}</p><div class="sim-controls"><button data-step-change="-1" disabled aria-label="이전 단계">이전</button><span>1 / ${t.steps.length}</span><button data-step-change="1" aria-label="다음 단계">다음 단계</button></div></div>`;}
function card(t){const fav=record.favorites.includes(t.id),done=record.completed.includes(t.id);return `<article class="card ${done?'completed':''}" id="${t.id}" data-card="${t.id}"><div class="card-top"><div class="meta"><div class="badges"><span class="badge ${t.type==='스킬'?'skill':t.type==='기초 개념'?'basic':''}">${esc(t.category)}</span>${t.added?'<span class="new-badge">추가</span>':''}</div><button class="favorite" data-favorite="${t.id}" aria-label="${esc(t.title)} 즐겨찾기" aria-pressed="${fav}" title="즐겨찾기">${fav?'★':'☆'}</button></div><h3>${esc(t.title)}<span class="en">${esc(t.en)}</span></h3><p class="description">${esc(t.description)}</p></div><div class="preview-label">${t.demo?'직접 눌러 보세요 · UI 체험':'학습용 시뮬레이션 · AI 실행 아님'}</div><div class="preview">${t.demo?`<iframe loading="lazy" sandbox="allow-scripts" title="${esc(t.title)} 동작 체험" data-demo="${t.demo}"></iframe>`:simulation(t)}</div><div class="card-bottom"><label class="done"><input type="checkbox" data-complete="${t.id}" ${done?'checked':''}>학습 완료</label><button class="details-button" data-detail="${t.id}" aria-haspopup="dialog">요청문·자세히 <span aria-hidden="true">↗</span></button></div></article>`;}
function render(){
 renderControls();const words=$('#q').value.trim().split(/\s+/).filter(Boolean).map(norm), sit=situations.find(x=>x[0]===situation),querySit=situations.find(x=>norm(x[0])===norm($('#q').value)),courseIds=course>=0?COURSES[course].ids:null;
 let list=ITEMS.filter(t=>(tab==='전체'||(tab==='즐겨찾기'?record.favorites.includes(t.id):t.type===tab))&&(category==='전체'||t.category===category)&&(!sit||sit[1].includes(t.id))&&(!courseIds||courseIds.includes(t.id))&&(querySit?querySit[1].includes(t.id):words.every(w=>norm([t.title,t.en,t.tags,t.description,t.category,t.source,t.keywords,t.id==='ui-drawer'?'옆에서 나오는 메뉴':''].join(' ')).includes(w))));
 if(courseIds)list.sort((a,b)=>courseIds.indexOf(a.id)-courseIds.indexOf(b.id));
 if($('#sort').value==='name')list.sort((a,b)=>a.title.localeCompare(b.title,'ko'));
 if($('#sort').value==='unfinished')list.sort((a,b)=>Number(record.completed.includes(a.id))-Number(record.completed.includes(b.id)));
 $('#list-title').textContent=course>=0?COURSES[course].title:situation||((tab==='전체'?'전체':tab)+' 가이드');$('#count').textContent=`${list.length}개 / 전체 ${ITEMS.length}개`;
 $('#clear').hidden=!(words.length||category!=='전체'||situation||course>=0||tab!=='전체');
 $('#context-note').textContent=tab==='스킬'?'스킬의 사용 조건·출처·요청문은 상세에서 확인하세요. 설치되어 있어야 사용할 수 있으며, 체험은 실제 실행이 아닙니다.':'';
 $('#main').innerHTML=list.map(card).join('')||`<div class="empty"><h3>${tab==='즐겨찾기'?'아직 즐겨찾은 카드가 없어요.':'조건에 맞는 카드가 없어요.'}</h3><p>${tab==='즐겨찾기'?'카드 오른쪽의 별을 눌러 모아 보세요.':'검색어를 줄이거나 분류·상황 조건을 초기화해 보세요.'}</p><button data-reset>전체 카드 보기</button></div>`;
 $('#main').querySelectorAll('iframe[data-demo]').forEach(f=>{f.srcdoc=DEMO_DOC.replace('const id=DEMO_ID;',`const id=${JSON.stringify(f.dataset.demo)};`);});
 updateProgress();renderCourse();
}
function updateProgress(){const total=new Set(COURSES.flatMap(c=>c.ids)),n=[...total].filter(id=>record.completed.includes(id)).length;$('#course-total').textContent=`입문 코스 ${n} / ${total.size}개 완료`;}
function renderCourse(){
 $('#course-panel').hidden=course<0;$('#welcome').hidden=course>=0;
 if(course<0)return;
 $('#course-list').innerHTML=COURSES.map((c,i)=>`<button class="course-step ${i===course?'on':''}" data-course="${i}" aria-pressed="${i===course}"><b>${esc(c.title)}</b><small>${esc(c.desc)} · ${c.ids.filter(id=>record.completed.includes(id)).length}/${c.ids.length}</small></button>`).join('');
 $('#course-guidance').innerHTML=`화면의 체험을 조작한 뒤 이해한 카드에 ‘학습 완료’를 표시하세요. ${course<COURSES.length-1?'<button data-next-course>다음 단계 보기</button>':'<span>마지막 단계입니다. 필요한 카드는 즐겨찾기로 모아 두세요.</span>'}`;
}
function reset(){tab='전체';category='전체';situation='';course=-1;$('#q').value='';$('#sort').value='default';render();}
function startCourse(n){tab='전체';category='전체';situation='';$('#q').value='';course=n;render();$('#course-panel').scrollIntoView({block:'start',behavior:'instant'});}
function openDrawer(title,badge,content){returnFocus=document.activeElement;$('#drawer-badge').textContent=badge;$('#drawer-body').innerHTML=`<h2 id="drawer-title">${esc(title)}</h2>${content}`;$('#drawer').showModal();$('#drawer').scrollTop=0;}
function closeDrawer(){$('#drawer').close();activeItem=null;if(returnFocus?.isConnected)returnFocus.focus();}
function promptBlock(title,text,key){return `<div class="copy-row"><h3>${title}</h3><button data-copy="${key}">복사</button></div><div class="field">${esc(text)}</div>`;}
function detail(id){const t=ITEMS.find(x=>x.id===id);if(!t)return;activeItem=t;record.last=id;save();
 const prompt=t.prompt.replace(/^成功/,'성공');
 let body=`<span class="en">${esc(t.en)} · ${esc(t.level)}</span><p>${esc(t.description)}</p>${t.when?`<h3>언제 쓰나요?</h3><p>${esc(t.when)}</p>`:''}`;
 if(t.type==='스킬')body+=`<div class="notice">${t.verified?'GitHub 스킬 원문 확인 · 2026.10.27':'기존 사전 수록 · 개별 스킬의 최신 원문·설치 절차는 재확인 필요'}<br>스킬 설치·도구 연결은 이 가이드북이 실행하지 않습니다. Codex에서는 설치된 스킬을 이름으로 요청하거나 $로 선택할 수 있습니다. 다른 도구에서는 호출 방식이 다를 수 있습니다.</div>`;
 body+=promptBlock(t.demo?'만들기 요청문':'실전에 쓸 요청문',prompt,'prompt');
 if(t.edit)body+=promptBlock('수정 요청문',t.edit,'edit');
 if(t.keywords)body+=`<h3>코드에서 찾을 단어</h3><p>편집기에서 Ctrl+F로 검색할 때 참고하세요.</p><code>${esc(t.keywords)}</code>`;
 if(t.caution)body+=`<h3>사용 조건·주의할 점</h3><p>${esc(t.caution)}</p>`;
 if(t.steps)body+=`<h3>체험을 실제 작업에 연결하기</h3><p>이 카드의 단계 표시는 이해를 돕기 위한 요약입니다. 실제 스킬의 전체 절차나 실행 결과를 대신하지 않습니다.</p>`;
 body+=`<h3>출처</h3><p>${t.sourceUrl?`<a href="${esc(t.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(t.source)} ↗</a>`:esc(t.source)}</p>`;
 if(t.type==='스킬')body+=`<p class="source-tag">저장소의 인기는 개별 스킬의 품질을 보장하지 않습니다. 수록 항목을 모두 설치할 필요는 없습니다.</p>`;
 if(t.originalInstall)body+=`<details><summary>기존 사전의 설치 참고 내용</summary><p>원문 보존용입니다. 현재 환경에서 검증한 설치 명령이 아닙니다. 공식 저장소의 최신 안내와 변경 내용을 먼저 확인하세요.</p><code>${esc(t.originalInstall)}</code></details>`;
 body+=`<div class="tools"><button data-related="${esc(t.type)}">같은 종류 더 보기</button></div>`;openDrawer(t.title,t.type+' / '+t.category,body);
}
async function copyText(text){try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(text);else{const a=document.createElement('textarea');a.value=text;a.style.cssText='position:fixed;left:0;top:0;opacity:0';$('#drawer-body').append(a);a.select();if(!document.execCommand('copy'))throw Error('copy');a.remove();}toast('요청문을 복사했어요. 필요한 항목을 바꿔 사용하세요.');}catch{const area=document.createElement('textarea');area.value=text;area.readOnly=true;$('#drawer-body').append(area);area.focus();area.select();toast('자동 복사가 제한됩니다. 선택한 내용을 직접 복사해 주세요.');}}
function manage(){openDrawer('내 학습 기록','THIS BROWSER',`<p>즐겨찾기 ${record.favorites.length}개 · 학습 완료 ${record.completed.length}개</p><div class="notice">이 브라우저에만 저장합니다. PC·휴대폰 자동 동기화는 제공하지 않습니다. 브라우저 데이터 삭제·시크릿 모드·다른 주소에서는 기록이 유지되지 않을 수 있습니다.${storageAvailable?'':' 현재 브라우저에서 저장을 사용할 수 없습니다.'}</div><h3>기기를 바꿀 때</h3><p>기록 파일을 내보내 다른 기기로 옮긴 뒤 가져오세요. 기존 기록과 합쳐집니다. 파일에는 카드 번호와 최근 위치만 들어갑니다.</p><div class="tools"><button data-export class="primary">기록 내보내기</button><label class="file-label">기록 가져오기<input type="file" id="import-file" accept="application/json,.json"></label></div>${record.last?`<h3>최근 본 카드</h3><button data-resume="${record.last}">${esc(ITEMS.find(t=>t.id===record.last)?.title)}</button>`:''}`);}
function about(){openDrawer('보고, 눌러 보고, 요청하기','ABOUT THIS GUIDE',`<p>원본 UI 사전의 검색·분류·카드와 동작 체험을 유지하고, 요청문과 자세한 설명을 드로어로 분리했습니다.</p><h3>자료 구성</h3><p>사용자 제공 UI 용어 24개, 기존 스킬 35개, 기초 개념 16개, 추가 스킬 3개로 총 78개입니다. 기존 항목의 설명과 설치 참고 내용은 보존했습니다.</p><h3>자료의 확인 상태</h3><p>추가 스킬 3개와 기존 스킬 5개의 SKILL.md는 2026년 10월 27일 확인했습니다. 나머지 기존 항목은 최신 원문 재확인이 필요한 것으로 표시합니다. 별점 수치를 품질 순위로 표시하지 않습니다.</p><p><a href="https://learn.chatgpt.com/docs/build-skills" target="_blank" rel="noopener">OpenAI 공식 스킬 안내</a><br><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website" target="_blank" rel="noopener">MDN 웹 개발 입문</a><br><a href="https://git-scm.com/docs/gittutorial" target="_blank" rel="noopener">Git 공식 입문</a></p><h3>회사에서 사용하기</h3><p>로그인과 AI 연결 없이 열립니다. 외부 글꼴·분석 서비스·CDN을 사용하지 않습니다. 출처 링크를 누르면 외부 사이트로 이동합니다. 회사망·휴대폰 실제 기기 접근은 별도 확인이 필요합니다.</p><h3>체험과 실제 작업의 차이</h3><p>UI 체험은 이 화면 안에서만 작동합니다. 개발 개념·스킬 체험은 학습용 예시이며 실제 도구 실행이나 성능 측정값이 아닙니다. 학습 완료는 본인의 확인 표시입니다.</p>`);}
function stepSim(el,delta){const t=ITEMS.find(x=>x.id===el.dataset.sim),step=Math.max(0,Math.min(t.steps.length-1,Number(el.dataset.step)+delta));el.dataset.step=step;const error=el.dataset.mode==='error';el.classList.toggle('error',error);el.querySelector('.sim-flow').innerHTML=svgFlow(t,step);el.querySelector('.sim-title').textContent=error&&step===2?'오류 응답':t.steps[step][0];el.querySelector('.sim-text').textContent=error&&step===2?'예시: 서버에서 요청을 처리하지 못했습니다. 성공 메시지 대신 재시도 안내를 보여줍니다.':t.steps[step][1];el.querySelector('.sim-controls span').textContent=`${step+1} / ${t.steps.length}`;el.querySelector('[data-step-change="-1"]').disabled=step===0;el.querySelector('[data-step-change="1"]').disabled=step===t.steps.length-1;}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-tab')){tab=b.dataset.tab;category='전체';situation='';course=-1;render();}
 if(b.hasAttribute('data-category')){category=b.dataset.category;render();}
 if(b.hasAttribute('data-situation')){situation=situation===b.dataset.situation?'':b.dataset.situation;tab='전체';category='전체';course=-1;$('#q').value='';render();}
 if(b.hasAttribute('data-favorite')){const id=b.dataset.favorite;record.favorites=record.favorites.includes(id)?record.favorites.filter(x=>x!==id):[...record.favorites,id];save();if(tab==='즐겨찾기')render();else{b.textContent=record.favorites.includes(id)?'★':'☆';b.setAttribute('aria-pressed',record.favorites.includes(id));renderControls();}toast(record.favorites.includes(id)?'즐겨찾기에 추가했어요.':'즐겨찾기에서 제외했어요.');}
 if(b.hasAttribute('data-detail'))detail(b.dataset.detail);
 if(b.hasAttribute('data-copy')&&activeItem)copyText(activeItem[b.dataset.copy]);
 if(b.hasAttribute('data-course'))startCourse(Number(b.dataset.course));
 if(b.hasAttribute('data-next-course'))startCourse(course+1);
 if(b.hasAttribute('data-reset'))reset();
 if(b.hasAttribute('data-step-change'))stepSim(b.closest('.sim'),Number(b.dataset.stepChange));
 if(b.hasAttribute('data-mode')){const el=b.closest('.sim');el.dataset.mode=b.dataset.mode;el.querySelectorAll('[data-mode]').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b);});stepSim(el,0);}
 if(b.hasAttribute('data-export')){const url=URL.createObjectURL(new Blob([JSON.stringify({version:1,...record},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='vibe-guidebook-records.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('학습 기록 파일을 내보냈어요.');}
 if(b.hasAttribute('data-resume')){const id=b.dataset.resume;closeDrawer();detail(id);}
 if(b.hasAttribute('data-related')){tab=b.dataset.related;category='전체';situation='';course=-1;$('#q').value='';closeDrawer();render();}
});
document.addEventListener('change',async e=>{
 if(e.target.matches('[data-complete]')){const id=e.target.dataset.complete;record.completed=e.target.checked?[...new Set([...record.completed,id])]:record.completed.filter(x=>x!==id);record.last=id;save();e.target.closest('.card').classList.toggle('completed',e.target.checked);renderCourse();if($('#sort').value==='unfinished')render();}
 if(e.target.id==='import-file'){try{const file=e.target.files[0];if(!file)return;if(file.size>100000)throw Error('size');const x=JSON.parse(await file.text());if(x.version!==1||!validRecord(x))throw Error('format');record.favorites=[...new Set([...record.favorites,...x.favorites.filter(id=>ids.has(id))])];record.completed=[...new Set([...record.completed,...x.completed.filter(id=>ids.has(id))])];if(ids.has(x.last))record.last=x.last;save();render();closeDrawer();toast('기존 기록과 합쳐서 가져왔어요.');}catch{toast('가이드북에서 내보낸 올바른 기록 파일인지 확인해 주세요.');e.target.value='';}}
});
$('#q').addEventListener('input',()=>{clearTimeout(render.timer);render.timer=setTimeout(render,140);});$('#sort').onchange=render;$('#clear').onclick=reset;$('#start-course').onclick=()=>startCourse(0);$('#exit-course').onclick=reset;$('#records').onclick=manage;$('#about').onclick=about;$('#close-drawer').onclick=closeDrawer;
$('.brand').onclick=e=>{e.preventDefault();reset();window.scrollTo({top:0,behavior:'instant'});};
$('#drawer').addEventListener('click',e=>{if(e.target===$('#drawer')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientY<r.top||e.clientX>r.right||e.clientY>r.bottom)closeDrawer();}});
$('#drawer').addEventListener('cancel',e=>{e.preventDefault();closeDrawer();});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!$('#drawer').open&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();$('#q').focus();}});
window.addEventListener('storage',e=>{if(e.key===KEY&&e.newValue){try{const x=JSON.parse(e.newValue);if(validRecord(x)){record={favorites:x.favorites.filter(id=>ids.has(id)),completed:x.completed.filter(id=>ids.has(id)),last:ids.has(x.last)?x.last:null};render();}}catch{}}});
render();if(!storageAvailable)toast('기록 저장이 제한됩니다. 내보내기를 이용해 주세요.');
