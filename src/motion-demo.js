// 원본 UI 사전의 두 데모만 보강한다. 다른 UI 데모는 유지한다.
function motionDemo(e,stagger){
 e.innerHTML=`<style>
 .motion-demo{height:190px;display:flex;flex-direction:column;padding:7px 8px;box-sizing:border-box;font-family:system-ui,sans-serif;color:#34533f;font-size:10px;gap:5px}
 .motion-options{display:grid;grid-template-columns:1fr 1fr;gap:3px 8px}
 .motion-demo label{display:flex;align-items:center;gap:4px;margin:0;font-size:9px;color:#64785c;min-width:0}
 .motion-demo output{margin-left:auto;font-variant-numeric:tabular-nums;color:#315c3c;white-space:nowrap}
 .motion-demo input[type=range]{width:100%;margin:1px 0;accent-color:#17685b;height:14px}
 .motion-option{min-width:0}
 .motion-demo select{font:9px system-ui;border:1px solid #ccd9c5;border-radius:4px;background:white;color:#34533f;max-width:100%;padding:2px}
 .motion-lane{position:relative;height:40px;background:#edf4e7;border:1px solid #d6e3cb;border-radius:6px;overflow:hidden;margin-top:1px}
 .motion-dot{position:absolute;left:6px;top:7px;width:24px;height:24px;background:#17685b;border-radius:6px;transition-property:transform;transition-duration:var(--duration,400ms);transition-delay:var(--delay,0ms);transition-timing-function:var(--easing,ease-out)}
 .motion-dot.to-end{transform:translateX(var(--distance,160px))}
 .motion-tiles{display:grid;grid-template-columns:repeat(6,1fr);gap:4px;padding:5px;min-height:40px;box-sizing:border-box;background:#edf4e7;border:1px solid #d6e3cb;border-radius:6px}
 .motion-tile{display:grid;place-items:center;border:1px solid #ccddbf;border-radius:5px;background:#fff;color:#36614a;height:28px;opacity:0;animation:motion-enter var(--duration,400ms) var(--easing,ease-out) forwards}
 .motion-bottom{display:flex;align-items:center;justify-content:space-between;gap:5px;margin-top:auto}
 .motion-demo button{min-height:25px;border:0;background:#17685b;color:white;border-radius:5px;font:10px system-ui;padding:4px 9px;cursor:pointer;white-space:nowrap}
 .motion-demo .reduced{font-size:9px;color:#7f7952;line-height:1.3}
 .motion-demo .motion-status{font-size:9px;color:#6b7f61;line-height:1.4}
 @keyframes motion-enter{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
 @media(prefers-reduced-motion:reduce){.motion-dot{transition:none!important}.motion-tile{animation:none!important;opacity:1;transform:none}}
 </style><div class="motion-demo">
 <div class="motion-options">
 <div class="motion-option"><label for="duration">동작 시간 <output id="duration-value">400ms</output></label><input id="duration" aria-label="동작 시간" type="range" min="100" max="1200" step="100" value="400"></div>
 <div class="motion-option"><label for="delay">시작 지연 <output id="delay-value">0ms</output></label><input id="delay" aria-label="시작 지연" type="range" min="0" max="1000" step="100" value="0"></div>
 ${stagger?'<div class="motion-option"><label for="gap">카드 간격 <output id="gap-value">100ms</output></label><input id="gap" aria-label="카드 사이 시간 간격" type="range" min="0" max="400" step="50" value="100"></div>':''}
 <div class="motion-option"><label for="easing">가속감</label><select id="easing" aria-label="가속감"><option value="ease-out">끝에서 천천히</option><option value="linear">일정하게</option><option value="ease-in-out">처음·끝 천천히</option></select></div>
 </div>
 ${stagger?'<div class="motion-tiles" aria-label="카드 순서대로 등장 예제"></div>':'<div class="motion-lane"><div class="motion-dot" aria-label="이동하는 요소"></div></div>'}
 <div class="motion-bottom"><span class="motion-status" role="status">설정을 바꾸고 눌러 보세요.</span><button type="button" class="motion-play">${stagger?'다시 재생':'이동하기'}</button></div>
 </div>`;
 const box=e.querySelector('.motion-demo'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function update(){for(const key of ['duration','delay','gap']){const input=e.querySelector('#'+key);if(!input)continue;e.querySelector('#'+key+'-value').textContent=input.value+'ms';box.style.setProperty('--'+key,input.value+'ms');}box.style.setProperty('--easing',e.querySelector('#easing').value);}
 function play(){update();const status=e.querySelector('.motion-status');if(stagger){const gap=Number(e.querySelector('#gap').value),delay=Number(e.querySelector('#delay').value);e.querySelector('.motion-tiles').innerHTML=Array.from({length:6},(_,i)=>`<span class="motion-tile" style="animation-delay:${delay+i*gap}ms">${i+1}</span>`).join('');}else{const dot=e.querySelector('.motion-dot'),lane=e.querySelector('.motion-lane');box.style.setProperty('--distance',Math.max(0,lane.clientWidth-38)+'px');dot.classList.toggle('to-end');e.querySelector('.motion-play').textContent=dot.classList.contains('to-end')?'돌아오기':'이동하기';}status.textContent=reduced.matches?'동작 줄이기 설정 · 즉시 표시':stagger?'등장 시간과 카드 간격을 비교해 보세요.':'이동 시간·지연·가속감을 비교해 보세요.';}
 e.querySelectorAll('input,select').forEach(input=>input.addEventListener('input',update));
 e.querySelector('.motion-play').addEventListener('click',play);update();if(stagger)play();
}
D.transition=e=>motionDemo(e,false);
D.stagger=e=>motionDemo(e,true);
