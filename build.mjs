import fs from 'node:fs';
import vm from 'node:vm';
import { basics, additions, workflows, skillSteps, courses } from './src/content.mjs';
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const ui=read('references/ui_dictionary.html'), sk=read('references/skill-dictionary.html');
const array=s=>vm.runInNewContext('('+s.match(/const RAW=(\[[\s\S]*?\n\]);/)[1]+')',{}, {timeout:1000});
const repos=vm.runInNewContext('('+sk.match(/const REPO=(\{[\s\S]*?\n\});/)[1]+')',{}, {timeout:1000});
const uiItems=array(ui).map(([id,category,en,title,tags,description,prompt,edit,keywords])=>({id:'ui-'+id,demo:id,type:'UI 용어',category,en,title,tags,description,prompt,edit,keywords,source:'사용자 제공 ui_dictionary.html',sourceUrl:'',level:'입문'}));
const skillItems=array(sk).map(([id,category,repo,en,title,tags,description,when,prompt,caution,install])=>({id:'skill-'+id,type:'스킬',category,en,title,tags,description,when,prompt,caution,originalInstall:install||repos[repo].i,source:repos[repo].n,sourceUrl:'https://github.com/'+repos[repo].n,level:['rea','mcp-builder','implement-spec'].includes(id)?'심화':'실전',verified:false}));
const specific={
 'grill-me':'https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md',
 'prototype':'https://github.com/mattpocock/skills/blob/main/skills/engineering/prototype/SKILL.md',
 'systematic-debugging':'https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/SKILL.md',
 'verification':'https://github.com/obra/superpowers/blob/main/skills/verification-before-completion/SKILL.md',
 'frontend-design':'https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md'
};
for(const t of skillItems){if(specific[t.id.slice(6)]){t.verified=true;t.sourceUrl=specific[t.id.slice(6)];}t.steps=skillSteps[t.id.slice(6)]||workflows[t.category];}
const items=[...basics,...uiItems,...skillItems,...additions];
if(items.length!==new Set(items.map(t=>t.id)).size)throw Error('중복 ID');
if(uiItems.length!==24||skillItems.length!==35)throw Error('원본 항목 누락');
for(const t of items){if(!t.demo&&(!t.steps||t.steps.some(s=>s.length!==2)))throw Error('체험 단계 누락: '+t.id);}
for(const c of courses){if(c.ids.some(id=>!items.some(t=>t.id===id)))throw Error('코스 항목 누락');}
const demoCss=ui.match(/<style>([\s\S]*?)<\/style>/)[1];
const demoScript=ui.match(/const rep=[\s\S]*?(?=\/\/ ---- 검색)/)[0];
const demoDoc=`<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${demoCss}\nbody{background:#f7f9fc;font-family:system-ui,sans-serif;font-size:14px}#root{height:190px;position:relative;overflow:hidden}button{min-height:36px}button:focus-visible,[tabindex]:focus-visible{outline:3px solid #167669;outline-offset:2px}.tip:focus::after,.tip:active::after{content:attr(data-tip);position:absolute;bottom:110%;left:50%;transform:translateX(-50%);background:#333;color:#fff;font-size:12px;padding:4px 8px;border-radius:4px;white-space:nowrap}.hov:active{transform:translateY(-4px);box-shadow:0 8px 16px #0002}@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}.st,.rv{opacity:1;transform:none}}</style><div id="root"></div><script>${demoScript}\nconst id=DEMO_ID;D[id](document.getElementById('root'));document.querySelectorAll('button').forEach(b=>{b.type='button';if(b.textContent==='‹')b.setAttribute('aria-label','이전 슬라이드');if(b.textContent==='›')b.setAttribute('aria-label','다음 슬라이드')});document.querySelectorAll('.tip').forEach(t=>{t.tabIndex=0;t.setAttribute('role','button');t.setAttribute('aria-label',t.dataset.tip)});document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.open').forEach(x=>x.classList.remove('open'))});<\/script></html>`;
const json=x=>JSON.stringify(x).replace(/</g,'\\u003c');
const data=`const ITEMS=${json(items)};const COURSES=${json(courses)};const DEMO_DOC=${json(demoDoc)};`;
const html=read('src/shell.html').replace('/*APP_CSS*/',read('src/style.css')+'\n'+read('src/responsive.css')).replace('/*APP_DATA*/',data).replace('/*APP_JS*/',read('src/app.js'));
fs.mkdirSync(new URL('dist/',import.meta.url),{recursive:true});
fs.writeFileSync(new URL('dist/index.html',import.meta.url),html);
fs.writeFileSync(new URL('dist/.nojekyll',import.meta.url),'');
fs.mkdirSync(new URL('docs/',import.meta.url),{recursive:true});
fs.writeFileSync(new URL('docs/index.html',import.meta.url),html);
fs.writeFileSync(new URL('docs/.nojekyll',import.meta.url),'');
console.log(JSON.stringify({items:items.length,ui:uiItems.length,originalSkills:skillItems.length,newSkills:additions.length,basics:basics.length,bytes:Buffer.byteLength(html)}));
