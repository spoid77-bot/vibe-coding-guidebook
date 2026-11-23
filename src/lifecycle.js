let journeyActive=false;
function journeyHash(id){history.replaceState(null,'','#journey'+(id?'-'+id:''));}
function showJourney(id){
 course=-1;renderCourse();
 journeyActive=true;$('#journey-panel').hidden=false;$('#journey-launch').hidden=true;
 if($('#nav-dialog').open)$('#nav-dialog').close();
 $('#journey-content').innerHTML=JOURNEY.map((s,i)=>`<article class="journey-card" id="journey-${s.id}"><div class="journey-card-heading"><span class="journey-number">0${i+1}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.question)}</p></div><button class="term-detail has-tip" data-journey-detail="${s.id}" aria-haspopup="dialog" aria-label="${esc(s.title)} 상세와 요청문" data-tooltip="상세와 요청문"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 4h5l2 2 2-2h5v12h-5l-2 1-2-1H3zM10 6v11M5 8h2M13 8h2M5 11h2M13 11h2"/></svg></button></div><p class="journey-summary">${esc(s.summary)}</p><figure class="journey-figure">${s.svg}</figure><div class="journey-output"><span>남길 결과물</span><b>${esc(s.artifact)}</b></div><details><summary>해야 할 일 ${s.tasks.length}가지</summary><ul>${s.tasks.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></details><p class="journey-gate"><b>다음 단계로 가기 전</b>${esc(s.gate)}</p></article>`).join('');
 const target=id?$('#journey-'+id):$('#journey-panel');
 journeyHash(id);target?.scrollIntoView({block:'start',behavior:'instant'});
}
function closeJourney(){journeyActive=false;$('#journey-panel').hidden=true;$('#journey-launch').hidden=false;if(location.hash.startsWith('#journey'))history.replaceState(null,'',location.pathname+location.search);}
function journeyDetail(id){
 const s=JOURNEY.find(s=>s.id===id);if(!s)return;
 activeItem=null;
 const related=s.related.map(id=>ITEMS.find(t=>t.id===id)).filter(Boolean);
 openDrawer(s.title+' · '+s.question,'처음부터 배포까지 / 가상 예제',`<p>${esc(s.summary)}</p><figure class="journey-large">${s.svg}</figure><p class="journey-caption">${esc(s.diagram)}</p><h3>해야 할 일</h3><ol>${s.tasks.map(t=>`<li>${esc(t)}</li>`).join('')}</ol><h3>예시 결과물 · ${esc(s.artifact)}</h3><div class="field">${esc(s.example)}</div><h3>완료 기준</h3><p>${esc(s.gate)}</p><div class="notice">${esc(s.risk)}</div>${promptBlock('Codex에 요청하기',s.prompt,'journey')}<h3>흐름도를 다시 만들고 싶다면</h3><p>diagram-design은 흐름도·화면 연결도·배포 구성도를 만드는 스킬입니다. 사용할 환경에 설치되어 있어야 하며 이 가이드북은 스킬을 실행하지 않습니다.</p>${promptBlock('흐름도 만들기 요청문',`diagram-design 스킬로 시험 일정 관리 웹사이트의 ${s.title} 흐름도를 만들어줘. ${s.diagram} 한글과 연결 방향을 분명히 하고, 기존 가이드북의 녹색 계열과 시스템 글꼴로 표현해줘. 상세 설명은 그림 밖에 두고 글자 잘림·겹침을 확인해줘. 수정할 HTML과 웹에서 볼 SVG를 제공해줘.`,'diagram')}<h3>관련 용어·스킬</h3><div class="journey-related">${related.map(t=>`<button data-journey-term="${t.id}">${esc(t.title)} ↗</button>`).join('')}</div><h3>참고 자료</h3><p><a href="${esc(s.source)}" target="_blank" rel="noopener noreferrer">단계 구성 참고 원문 ↗</a></p><p><a href="https://github.com/cathrynlavery/diagram-design" target="_blank" rel="noopener noreferrer">diagram-design 공식 저장소 ↗</a></p><p class="source-tag">단계·예시는 초보자용 제안입니다. 실제 회사 자료·작업 결과가 아닙니다. 웹 자료 확인: 2026.11.23.</p><div class="tools"><button data-journey-link="${s.id}">이 단계 링크 복사</button></div>`);
 $('#drawer-body').querySelector('[data-copy="journey"]').dataset.journeyText=s.prompt;
 $('#drawer-body').querySelectorAll('svg [id]').forEach(el=>{el.id+='-detail';});
 const svg=$('#drawer-body').querySelector('svg');svg.setAttribute('aria-labelledby',svg.getAttribute('aria-labelledby').split(' ').map(id=>id+'-detail').join(' '));
 svg.querySelectorAll('[marker-end]').forEach(el=>el.setAttribute('marker-end',el.getAttribute('marker-end').replace('-arrow)','-arrow-detail)')));
 $('#drawer-body').querySelector('[data-copy="diagram"]').dataset.journeyText=$('#drawer-body').querySelector('[data-copy="diagram"]').textContent;
}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-start-journey'))showJourney();
 if(b.hasAttribute('data-journey-jump'))showJourney(b.dataset.journeyJump);
 if(b.hasAttribute('data-journey-detail'))journeyDetail(b.dataset.journeyDetail);
 if(b.hasAttribute('data-close-journey'))closeJourney();
 if(b.hasAttribute('data-journey-term')){closeDrawer();detail(b.dataset.journeyTerm);}
 if(b.hasAttribute('data-journey-text'))copyText(b.dataset.journeyText);
 if(b.hasAttribute('data-journey-link'))copyText(location.href.split('#')[0]+'#journey-'+b.dataset.journeyLink);
});
function readJourneyHash(){if(location.hash==='#journey')showJourney();else if(location.hash.startsWith('#journey-')){const id=location.hash.slice(9);if(JOURNEY.some(s=>s.id===id))showJourney(id);}}
window.addEventListener('hashchange',readJourneyHash);
readJourneyHash();
