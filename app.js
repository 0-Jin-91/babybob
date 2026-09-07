/*========== 상수 ==========*/
var NK=['kcal','p','fe','ca','zn'];
var NL={kcal:['열량','kcal','#FFC861'],p:['단백질','g','#7ED0B8'],fe:['철분','mg','#EF6A4C'],ca:['칼슘','mg','#7FA8D9'],zn:['아연','mg','#A9A0E0']};
var MILK={f:{n:'분유',v:[67,1.4,.8,55,.5],vc:9,ab:.10},b:{n:'모유',v:[65,1.0,.03,32,.15],vc:4,ab:.50}};
var PCG={'달걀':50,'달걀노른자':17};
var IDS=['ready','early','mid','late','final'];
var TY={p:'🍲 죽',t:'🧊 토핑',f:'✋ 핑거',m:'🍚 유아식'};
var GN={w:['몸무게','kg'],h:['키','cm'],c:['머리둘레','cm']};
function sT(k){return '<span class="tg v" style="cursor:pointer" onclick="openSrc(\''+k+'\')">📎 '+SRC[k].t+'</span>'}

/*========== 영양 계산 ==========*/
function gOf(x){var q=+x[1]||0,u=x[2],k=x[3];
if(u==='개')return q*(x[4]?+x[4]:(PCG[k]||10));
if(u==='방울')return q*.5;
if(u==='ml')return NUT[k]?q:0;return q}
function absFe(hm,nh,vc,meat){var f=.05*(1+Math.min(2,vc/25));if(meat>15)f*=1.3;f=Math.min(.18,f);return hm*.25+nh*f}
function nutOf(r,ml){ml=ml||1;var t={kcal:0,p:0,fe:0,ca:0,zn:0,vc:0},hm=0,nh=0,meat=0,d=[],ms=[],sv=r.sv||1;
(r.g||[]).forEach(function(x){var v=NUT[x[3]];if(!v){if(x[2]!=='ml')ms.push(x[0]);return}
var gr=gOf(x)*ml/sv,o={n:x[0],g:gr};
NK.forEach(function(k,i){o[k]=v[i]*gr/100;t[k]+=o[k]});
o.vc=v[5]*gr/100;t.vc+=o.vc;var fe=v[2]*gr/100;o.ty=v[6];
if(v[6]==='h'){hm+=fe*.4;nh+=fe*.6;meat+=gr}else nh+=fe;d.push(o)});
t.feAb=absFe(hm,nh,t.vc,meat);return{t:t,d:d,ms:ms,hm:hm,nh:nh,meat:meat}}
function milkNut(v,tp){var M=MILK[tp]||MILK.f,o={};NK.forEach(function(k,i){o[k]=M.v[i]*v/100});o.vc=M.vc*v/100;o.feAb=o.fe*M.ab;return o}
function DRI(m){if(m<6)return{kcal:500,p:10,fe:.3,ca:250,zn:2,lb:'0~5개월',ekg:95,pkg:1.4};
if(m<12)return{kcal:600,p:15,fe:6,ca:300,zn:3,lb:'6~11개월',ekg:80,pkg:1.2};
if(m<24)return{kcal:900,p:20,fe:6,ca:500,zn:3,lb:'12~23개월',ekg:82,pkg:1.1};
return{kcal:1400,p:25,fe:7,ca:600,zn:4,lb:'만 3~5세',ekg:75,pkg:1.05}}

/*========== 성장 유틸 ==========*/
function gArr(kind,sx){var D=GD[kind][sx];
if(kind==='c')return{p3:D.p50.map(function(v){return Math.round((v-2.6)*10)/10}),p50:D.p50,p97:D.p50.map(function(v){return Math.round((v+2.6)*10)/10})};
return D}
function ncdf(z){var t=1/(1+.2316419*Math.abs(z)),d=.3989423*Math.exp(-z*z/2);
var p=1-d*t*(1.330274*Math.pow(t,4)-1.821256*Math.pow(t,3)+1.781478*t*t-.356538*t+.319381);return z>0?p:1-p}
function pctOf(v,p3,p50,p97){var z;if(v<p50)z=-1.881*(p50-v)/Math.max(.01,p50-p3);else z=1.881*(v-p50)/Math.max(.01,p97-p50);
return Math.max(.1,Math.min(99.9,ncdf(z)*100))}
function ipol(a,m){var i=Math.floor(m);if(i>=a.length-1)return a[a.length-1];if(i<0)return a[0];return a[i]+(a[i+1]-a[i])*(m-i)}

/*========== 3D 일러스트 ==========*/
function ART(t){var S={
soak:'<path d="M22 34h56l-6 26a6 6 0 0 1-6 5H34a6 6 0 0 1-6-5z" fill="url(#gW)"/><ellipse cx="50" cy="34" rx="28" ry="7" fill="#EDE3DA"/><ellipse cx="50" cy="35" rx="24" ry="5.5" fill="url(#gB)"/><ellipse cx="44" cy="35" rx="2.6" ry="1.5" fill="#fff"/><ellipse cx="53" cy="37" rx="2.6" ry="1.5" fill="#fff"/>',
blend:'<path d="M34 18h32l-4 42a7 7 0 0 1-7 6H45a7 7 0 0 1-7-6z" fill="url(#gS)"/><path d="M38 40h24l-2 20a7 7 0 0 1-7 6H47a7 7 0 0 1-7-6z" fill="url(#gY)"/><rect x="32" y="13" width="36" height="6" rx="3" fill="url(#gK)"/><circle cx="50" cy="49" r="3" fill="#6B6663"/>',
boil:'<path d="M20 32h60l-5 28a8 8 0 0 1-8 7H33a8 8 0 0 1-8-7z" fill="url(#gK)"/><ellipse cx="50" cy="32" rx="30" ry="7" fill="#5C5754"/><ellipse cx="50" cy="33" rx="25" ry="5.5" fill="url(#gY)"/><path d="M40 22q4-7 0-13M50 20q5-8 0-15M60 22q4-7 0-13" stroke="#CFC6BF" stroke-width="2.6" fill="none" stroke-linecap="round"/>',
sieve:'<ellipse cx="50" cy="28" rx="28" ry="8" fill="url(#gS)"/><path d="M22 28q28 26 56 0" fill="none" stroke="#B4BAC4" stroke-width="3"/><path d="M28 32h44M34 39h32M40 46h20" stroke="#C9CFD8" stroke-width="1.6"/><path d="M46 52v10M53 54v8" stroke="url(#gY)" stroke-width="3" stroke-linecap="round"/>',
chop:'<rect x="14" y="34" width="72" height="26" rx="5" fill="url(#gD)"/><path d="M30 24l34 6-2 5-34-6z" fill="url(#gS)"/><rect x="24" y="46" width="7" height="5" rx="1.5" fill="#68AE49"/><rect x="34" y="49" width="7" height="5" rx="1.5" fill="#EFAA3D"/><rect x="44" y="46" width="7" height="5" rx="1.5" fill="#EE7A52"/><rect x="54" y="49" width="7" height="5" rx="1.5" fill="#68AE49"/>',
steam:'<path d="M42 18q4-7 0-13M50 16q5-8 0-14M58 18q4-7 0-13" stroke="#CFC6BF" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M24 34h52l-4 24a7 7 0 0 1-7 6H35a7 7 0 0 1-7-6z" fill="url(#gW)"/><ellipse cx="50" cy="34" rx="26" ry="7" fill="#E6DBD2"/><ellipse cx="42" cy="36" rx="6" ry="4" fill="url(#gY)"/><ellipse cx="57" cy="37" rx="6" ry="4" fill="url(#gG)"/>',
cube:'<rect x="14" y="26" width="72" height="40" rx="7" fill="url(#gS)"/><rect x="19" y="31" width="14" height="14" rx="3" fill="url(#gP)"/><rect x="36" y="31" width="14" height="14" rx="3" fill="url(#gG)"/><rect x="53" y="31" width="14" height="14" rx="3" fill="url(#gY)"/><rect x="19" y="48" width="14" height="14" rx="3" fill="url(#gM)"/><rect x="36" y="48" width="14" height="14" rx="3" fill="url(#gY)"/><rect x="53" y="48" width="14" height="14" rx="3" fill="url(#gP)"/>',
fry:'<ellipse cx="46" cy="46" rx="30" ry="12" fill="url(#gK)"/><ellipse cx="46" cy="43" rx="26" ry="9.5" fill="#4A4643"/><ellipse cx="44" cy="42" rx="9" ry="4" fill="url(#gD)"/><ellipse cx="56" cy="44" rx="7" ry="3.4" fill="url(#gP)"/><rect x="72" y="38" width="20" height="6" rx="3" fill="url(#gD)"/>',
mash:'<path d="M24 36h52l-5 24a7 7 0 0 1-7 6H36a7 7 0 0 1-7-6z" fill="url(#gW)"/><ellipse cx="50" cy="36" rx="26" ry="7" fill="#EDE3DA"/><ellipse cx="50" cy="37" rx="22" ry="5" fill="url(#gY)"/><rect x="56" y="6" width="6" height="26" rx="3" fill="url(#gD)"/><rect x="46" y="30" width="26" height="7" rx="3.5" fill="url(#gS)"/>',
bone:'<path d="M20 44q16-16 40-10 12 3 20 10-8 7-20 10-24 6-40-10z" fill="url(#gB)"/><circle cx="34" cy="41" r="2.6" fill="#3E3A38"/><path d="M54 26l14-12" stroke="url(#gS)" stroke-width="3" stroke-linecap="round"/>',
wash:'<ellipse cx="50" cy="46" rx="22" ry="16" fill="url(#gG)"/><ellipse cx="44" cy="40" rx="8" ry="6" fill="#fff" opacity=".35"/><path d="M62 26q4 6 0 10M70 32q4 5 0 9M34 24q4 6 0 10" stroke="url(#gB)" stroke-width="3" fill="none" stroke-linecap="round"/>',
cool:'<path d="M24 34h52l-5 26a7 7 0 0 1-7 6H36a7 7 0 0 1-7-6z" fill="url(#gW)"/><ellipse cx="50" cy="34" rx="26" ry="7" fill="#EDE3DA"/><ellipse cx="50" cy="35" rx="22" ry="5.4" fill="url(#gY)"/><g stroke="url(#gB)" stroke-width="2.4" stroke-linecap="round"><path d="M76 12v14M69 15l14 8M83 15l-14 8"/></g>',
egg:'<ellipse cx="50" cy="44" rx="20" ry="24" fill="url(#gW)"/><ellipse cx="50" cy="46" rx="11" ry="12" fill="url(#gY)"/><ellipse cx="45" cy="40" rx="4" ry="3" fill="#fff" opacity=".5"/>',
mix:'<path d="M22 34h56l-6 26a7 7 0 0 1-7 6H35a7 7 0 0 1-7-6z" fill="url(#gW)"/><ellipse cx="50" cy="34" rx="28" ry="7.4" fill="#EDE3DA"/><ellipse cx="50" cy="35" rx="24" ry="5.8" fill="url(#gY)"/><rect x="58" y="8" width="5" height="28" rx="2.5" transform="rotate(16 58 8)" fill="url(#gD)"/>',
serve:'<path d="M18 34h64l-6 26a8 8 0 0 1-8 6H32a8 8 0 0 1-8-6z" fill="url(#gW)"/><ellipse cx="50" cy="34" rx="32" ry="8" fill="#EDE3DA"/><ellipse cx="50" cy="35" rx="27" ry="6.4" fill="#FFF3E2"/><ellipse cx="40" cy="34" rx="7" ry="3.6" fill="url(#gP)"/><ellipse cx="53" cy="36" rx="7" ry="3.6" fill="url(#gG)"/><ellipse cx="63" cy="33" rx="6" ry="3.2" fill="url(#gY)"/>'};
return '<svg viewBox="0 0 100 76" preserveAspectRatio="xMidYMid slice"><rect width="100" height="76" fill="#FBF6F2"/><ellipse cx="50" cy="66" rx="30" ry="4" fill="#000" opacity=".07"/>'+(S[t]||S.serve)+'<rect width="100" height="76" fill="url(#gL)" opacity=".3"/></svg>'}
function kOf(s){var K=[['불려|불린|담가','soak'],['갈아|믹서|갑니다','blend'],['체에|걸러','sieve'],['끓|졸입','boil'],['찝니다|찜기|삶|데쳐|데칩|익힙','steam'],['다집|다져|썰|썹','chop'],['큐브|트레이|냉동|지퍼백','cube'],['볶|팬에|굽습','fry'],['으깨|으깹|부숩|빚','mash'],['가시','bone'],['씻|헹궈','wash'],['식혀|식힌','cool'],['달걀|노른자','egg'],['섞|풀어','mix'],['담고|담아|올립|먹입|쥐게','serve']];
for(var i=0;i<K.length;i++)if(new RegExp(K[i][0]).test(s))return K[i][1];return 'serve'}

/*========== 상태 ==========*/
var KY={b:'b6.baby',l:'b6.log',f:'b6.food',m:'b6.my',c:'b6.cube',o:'b6.ov',p:'b6.ph',w:'b6.plan',a:'b6.obs',s:'b6.shop',t:'b6.today',v:'b6.fav',g:'b6.grow'};
function LS(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v===null?d:v}catch(e){return d}}
var baby=LS(KY.b,null),logs=LS(KY.l,[]),tried=LS(KY.f,{}),myR=LS(KY.m,[]),cubes=LS(KY.c,[]),ov=LS(KY.o,{}),ph=LS(KY.p,{}),plan=LS(KY.w,null),obs=LS(KY.a,[]),shopChk=LS(KY.s,{}),todaySel=LS(KY.t,null),fav=LS(KY.v,{}),grow=LS(KY.g,[]);
function save(){localStorage.setItem(KY.b,JSON.stringify(baby));localStorage.setItem(KY.l,JSON.stringify(logs));localStorage.setItem(KY.f,JSON.stringify(tried));
localStorage.setItem(KY.m,JSON.stringify(myR));localStorage.setItem(KY.c,JSON.stringify(cubes));localStorage.setItem(KY.o,JSON.stringify(ov));
localStorage.setItem(KY.w,JSON.stringify(plan));localStorage.setItem(KY.a,JSON.stringify(obs));localStorage.setItem(KY.s,JSON.stringify(shopChk));
localStorage.setItem(KY.t,JSON.stringify(todaySel));localStorage.setItem(KY.v,JSON.stringify(fav));localStorage.setItem(KY.g,JSON.stringify(grow));
try{localStorage.setItem(KY.p,JSON.stringify(ph))}catch(e){alert('사진 저장 공간이 부족합니다.')}}
function RCP(){return BASE.map(function(r){var o=ov[r.i];if(!o)return r;var c={};for(var k in r)c[k]=r[k];for(var k2 in o)c[k2]=o[k2];c.ed=1;return c}).concat(myR)}
function getR(id){var a=RCP();for(var i=0;i<a.length;i++)if(a[i].i===id)return a[i];return null}
var tab='home',selS=null,selT='p',qty=1,curR=null,fCat='전체',lRx='😋',mTab='s',ME=null,phT=null,pTab='w',srch='',gK='w';

/*========== 날짜 ==========*/
function d0(s){var d=new Date(s);d.setHours(0,0,0,0);return d}
function TD(){var d=new Date();d.setHours(0,0,0,0);return d}
function addM(d,m){var x=new Date(d),g=x.getDate();x.setMonth(x.getMonth()+m);if(x.getDate()<g)x.setDate(0);return x}
function addD(d,n){var x=new Date(d);x.setDate(x.getDate()+n);return x}
function ageMAt(dt){var b=d0(baby.birth),n=d0(dt),m=(n.getFullYear()-b.getFullYear())*12+(n.getMonth()-b.getMonth());if(n.getDate()<b.getDate())m--;return m+Math.floor((n-addM(b,m))/864e5)/30}
function ageM(){return ageMAt(TD())}
function dOld(){return Math.floor((TD()-d0(baby.birth))/864e5)}
function fmt(d){return d.getFullYear()+'.'+('0'+(d.getMonth()+1)).slice(-2)+'.'+('0'+d.getDate()).slice(-2)}
function ymd(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function ageT(){var m=Math.floor(ageM());return '생후 '+dOld()+'일 · 만 '+m+'개월 '+Math.floor((TD()-addM(d0(baby.birth),m))/864e5)+'일'}
function curS(){var m=ageM();for(var i=0;i<STG.length;i++)if(m>=STG[i].f&&m<STG[i].t)return STG[i];return STG[0]}
function nextStage(){var i=IDS.indexOf(curS().id);return i<4?STG[i+1]:null}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function rnd(n){return Math.round(n*10)/10}
function rnd2(n){return Math.round(n*100)/100}
function wkStart(){var d=TD(),w=d.getDay();return addD(d,-((w+6)%7))}

/*========== 목표 · 추천 ==========*/
function MEALS(){return (baby&&baby.meals)||2}
function SLOTS(){var n=MEALS();return n===1?['아침']:n===2?['아침','저녁']:['아침','점심','저녁']}
function MTYPE(){return baby.feed==='b'?'b':'f'}
function lastG(k){var a=grow.filter(function(g){return g[k]!=null&&g[k]!==''}).sort(function(x,y){return x.d<y.d?1:-1});return a.length?a[0]:null}
function curW(){var g=lastG('w');return g?+g.w:null}
function TG(){var m=ageM(),dri=DRI(m),w=curW(),use=(baby.useW!==0)&&w,day={};
NK.forEach(function(k){day[k]=dri[k]});
if(use){day.kcal=Math.round(w*dri.ekg);day.p=rnd(w*dri.pkg)}
var sf=curS().sf,solid={},meal={};
NK.forEach(function(k){solid[k]=day[k]*sf;meal[k]=solid[k]/MEALS()});
return {day:day,solid:solid,meal:meal,dri:dri,sf:sf,w:w,use:!!use,feAb:day.fe*.10,lb:dri.lb}}
function mainKeys(r){var s={};(r.g||[]).forEach(function(x){if(x[3]&&['소고기','닭고기','돼지고기','흰살생선','연어','새우','두부','달걀','달걀노른자'].indexOf(x[3])>=0)s['P'+x[3]]=1;else if(x[3])s[x[3]]=1});return Object.keys(s)}
function score(r,acc,tg,used){var n=nutOf(r),nu=n.t,sc=0,W={kcal:1,p:1.4,fe:1.4,ca:1.2,zn:1.3};
NK.forEach(function(k){var need=Math.max(0,tg[k]-(acc[k]||0));sc+=Math.min(nu[k],need)/Math.max(.01,tg[k])*W[k]});
sc+=Math.min(nu.feAb,Math.max(0,tg.feAb-(acc.feAb||0)))/Math.max(.001,tg.feAb)*1.8;
var mk=mainKeys(r),dup=0;mk.forEach(function(k){if(used[k])dup++});return sc-dup*.45}
function pool(si){return RCP().filter(function(r){return r.s===si&&r.y!=='f'&&(r.g||[]).length&&(r.sv||1)<5})}
function recommend(si,seed,mealN,pre){var P=pool(si);if(!P.length)return [];
var T=TG(),tgt={};NK.forEach(function(k){tgt[k]=T.solid[k]});tgt.feAb=T.feAb*T.sf;
var acc={kcal:0,p:0,fe:0,ca:0,zn:0,feAb:0},used={},out=[];(pre||[]).forEach(function(k){used[k]=1});
for(var s=0;s<mealN;s++){var best=null,bs=-99;
P.forEach(function(r,idx){if(out.filter(function(o){return o.i===r.i}).length)return;
var v=score(r,acc,tgt,used)+((idx+seed*7+s*13)%5)*.012+(fav[r.i]?.15:0);if(v>bs){bs=v;best=r}});
if(!best)break;out.push(best);var nu=nutOf(best).t;NK.forEach(function(k){acc[k]+=nu[k]});acc.feAb+=nu.feAb;mainKeys(best).forEach(function(k){used[k]=1})}
return out}
function altList(si,ex){var P=pool(si),T=TG(),tgt={};NK.forEach(function(k){tgt[k]=T.solid[k]});tgt.feAb=T.feAb*T.sf;
return P.filter(function(r){return ex.indexOf(r.i)<0}).sort(function(a,b){return score(b,{},tgt,{})-score(a,{},tgt,{})})}
function todayRec(){var si=IDS.indexOf(curS().id==='ready'?'early':curS().id),sl=SLOTS(),key=fmt(TD())+'|'+MEALS();
if(todaySel&&todaySel.k===key&&todaySel.ids.length===sl.length){var a=todaySel.ids.map(getR);if(a.indexOf(null)<0)return a}
var rs=recommend(si,dOld(),sl.length);todaySel={k:key,ids:rs.map(function(r){return r.i})};save();return rs}

/*========== 부팅 · 렌더 ==========*/
function saveBaby(){var n=document.getElementById('iN').value.trim(),b=document.getElementById('iB').value;
if(!n)return alert('아기 이름을 입력해 주세요');if(!b)return alert('태어난 날을 선택해 주세요');if(d0(b)>TD())return alert('오늘 이후 날짜는 안 돼요');
baby={name:n,birth:b,sex:document.getElementById('iS').value,feed:document.getElementById('iF').value,meals:+document.getElementById('iM').value,vol:+document.getElementById('iV').value||180,useW:1};
var w=+document.getElementById('iW').value,h=+document.getElementById('iH').value;
if(w||h)grow.push({id:'g'+Date.now(),d:ymd(TD()),w:w||null,h:h||null,c:null});
save();boot()}
function boot(){var B=document.body;
if(!baby){B.classList.add('solo');document.getElementById('ob').classList.remove('hd');document.getElementById('mv').classList.add('hd');document.getElementById('nv').classList.add('hd');return}
B.classList.remove('solo');document.getElementById('ob').classList.add('hd');document.getElementById('mv').classList.remove('hd');document.getElementById('nv').classList.remove('hd');
if(!selS)selS=curS().id==='ready'?'early':curS().id;render();notiCheck()}
function render(){var s=curS(),T=TG();
document.getElementById('hdr').innerHTML='<div class="hg">TODAY · '+fmt(TD())+' · 이유식 '+MEALS()+'끼'+(T.w?' · '+T.w+'kg':'')+'</div><div class="hn">'+esc(baby.name)+' <span style="font-size:13px;font-weight:600;color:var(--sub)">이유식 노트</span></div><div class="ha">'+ageT()+'</div><span class="pl" style="background:'+s.c+'">'+s.n+' · '+s.lb+'</span>';
document.getElementById('vw').innerHTML=({home:vHome,plan:vPlan,menu:vMenu,food:vFood,grow:vGrow,log:vLog,info:vInfo})[tab]();
window.scrollTo(0,0);document.documentElement.scrollTop=0;document.body.scrollTop=0;
var bs=document.querySelectorAll('nav button');for(var i=0;i<bs.length;i++)bs[i].className=bs[i].dataset.t===tab?'on':''}

/*========== 공통 UI ==========*/
function cell(k,v){return '<div style="background:#FBF6F2;border-radius:11px;padding:8px 10px"><div class="mu" style="font-size:10.5px;font-weight:700">'+k+'</div><div style="font-size:13px;font-weight:700">'+v+'</div></div>'}
function thumb(r){var p=ph[r.i+'_0'];return p?'<img src="'+p+'">':ART(kOf((r.st&&r.st[0])||''))}
function rcard(r,x){var n=nutOf(r).t;return '<button class="rc" onclick="openR(\''+r.i+'\')"><div class="th">'+thumb(r)+'</div><div style="flex:1"><div class="nm">'+(fav[r.i]?'⭐ ':'')+esc(r.n)+(r.my?' <span class="tg m">내 메뉴</span>':'')+(r.ed?' <span class="tg p">수정</span>':'')+'</div><div class="ds">⏱ '+(r.tm||'-')+' · 철 '+rnd(n.fe)+'mg(흡수 '+rnd2(n.feAb)+') · 단백 '+rnd(n.p)+'g'+(x||'')+'</div></div><div class="ar">›</div></button>'}
function todayLogs(){return logs.filter(function(l){return l.d===fmt(TD())})}
function todaySum(){var f={kcal:0,p:0,fe:0,ca:0,zn:0,feAb:0},m={kcal:0,p:0,fe:0,ca:0,zn:0,feAb:0},ml=0,cnt=0;
todayLogs().forEach(function(l){if(l.k==='milk'){ml+=+l.ml||0;var n=milkNut(+l.ml||0,l.mt||MTYPE());NK.forEach(function(k){m[k]+=n[k]});m.feAb+=n.feAb}
else{cnt++;NK.forEach(function(k){f[k]+=(l.nu&&l.nu[k])||0});f.feAb+=(l.nu&&l.nu.feAb)||0}});
return {f:f,m:m,ml:ml,cnt:cnt}}
function stackBars(f,m,day){return NK.map(function(k){var L=NL[k],fp=f[k]/day[k]*100,mp=m[k]/day[k]*100,tot=fp+mp;
var w1=Math.min(100,fp),w2=Math.max(0,Math.min(100-w1,mp));
return '<div style="margin-bottom:11px"><div class="rw" style="justify-content:space-between;font-size:13px"><span style="font-weight:800">'+L[0]+'</span><span>'+rnd(f[k]+m[k])+' / '+rnd(day[k])+L[1]+' <b style="color:'+(tot>=95?'#2E9C7D':tot>=70?L[2]:'var(--rd)')+'">'+Math.round(tot)+'%</b></span></div>'
+'<div class="sb2"><i style="width:'+w1+'%;background:'+L[2]+'"></i><i style="width:'+w2+'%;background:'+L[2]+';opacity:.34"></i><u style="left:100%"></u></div>'
+'<div class="mu" style="font-size:10px;margin-top:2px">🍲 이유식 '+Math.round(fp)+'% + 🍼 수유 '+Math.round(mp)+'%</div></div>'}).join('')
+'<div class="lgd"><span><b style="background:var(--pd)"></b>이유식</span><span><b style="background:var(--pd);opacity:.34"></b>수유</span><span>┃ 검은 선 = 하루 목표 100%</span></div>'}
function feCoach(n){var msg=[];
if(n.meat<=0&&n.t.fe>0.3)msg.push('고기·생선이 없어 <b>비헴철</b>만 들어 있습니다(흡수율 낮음). 소고기 10~20g을 더하면 흡수 철분이 크게 늘어요.');
if(n.t.vc<10&&n.nh>0.3)msg.push('비타민C 재료가 적습니다. <b>브로콜리·파프리카·토마토·양배추</b>를 곁들이면 비헴철 흡수가 2~3배 올라갑니다.');
if(n.meat>15&&n.t.vc>=20)msg.push('고기(헴철) + 비타민C 조합으로 <b>철분 흡수 조건이 좋습니다</b> 👍');
return msg.length?'<div class="fe">🩸 <b>철분 흡수 코칭</b><br>'+msg.join('<br>')+'<div class="mu" style="font-size:10px;margin-top:5px">계산 모델: 헴철 25% / 비헴철 5%(비타민C·육류인자로 최대 18%) '+sT('fe')+'</div></div>':''}
function nutBlock(nu,ml){var T=TG();
return '<div class="cd"><b style="font-size:13.5px">🍀 영양 (1회 분량'+(ml>1?' ×'+ml:'')+')</b><div class="mu" style="font-size:10.5px;margin:3px 0 9px">1끼 목표 = '+(T.use?'체중 '+T.w+'kg 기준':'표준('+T.lb+')')+' 하루 목표 × 이유식 '+Math.round(T.sf*100)+'% ÷ '+MEALS()+'끼</div>'
+NK.map(function(k){var per=T.meal[k],pc=nu.t[k]/per*100,L=NL[k];
return '<div style="margin-bottom:9px"><div class="rw" style="justify-content:space-between;font-size:12.5px"><span style="font-weight:700">'+L[0]+'</span><span>'+rnd(nu.t[k])+L[1]+' <b style="color:'+L[2]+'">1끼 목표의 '+Math.round(pc)+'%</b></span></div><div class="sb2" style="height:9px"><i style="width:'+Math.min(100,pc)+'%;background:'+L[2]+'"></i></div><div class="mu" style="font-size:10px">하루 목표 '+rnd(T.day[k])+L[1]+' 대비 '+Math.round(nu.t[k]/T.day[k]*100)+'%</div></div>'}).join('')
+'<div class="hr"></div><div class="rw" style="justify-content:space-between;font-size:12.5px"><span style="font-weight:800;color:var(--rd)">🩸 흡수 추정 철분</span><span><b>'+rnd2(nu.t.feAb)+'mg</b> / 하루 흡수 목표 '+rnd2(T.feAb)+'mg <b style="color:var(--rd)">'+Math.round(nu.t.feAb/T.feAb*100)+'%</b></span></div>'
+'<div class="sb2" style="height:9px"><i style="width:'+Math.min(100,nu.t.feAb/T.feAb*100)+'%;background:var(--rd)"></i></div>'
+'<div class="mu" style="font-size:10px;margin-top:3px">헴철 '+rnd2(nu.hm)+'mg · 비헴철 '+rnd2(nu.nh)+'mg · 비타민C '+rnd(nu.t.vc)+'mg · 고기 '+Math.round(nu.meat)+'g</div>'
+'<div class="hr"></div><b style="font-size:12.5px">재료별 기여도</b><table class="tb" style="margin-top:5px"><tr><th>재료</th><th>g</th><th>kcal</th><th>단백</th><th>철</th><th>칼슘</th><th>비타민C</th></tr>'
+nu.d.map(function(o){return '<tr><td>'+esc(o.n)+(o.ty==='h'?' <span class="tg r" style="padding:0 4px">헴</span>':'')+'</td><td>'+rnd(o.g)+'</td><td>'+Math.round(o.kcal)+'</td><td>'+rnd(o.p)+'</td><td>'+rnd2(o.fe)+'</td><td>'+Math.round(o.ca)+'</td><td>'+rnd(o.vc)+'</td></tr>'}).join('')+'</table>'
+(nu.ms.length?'<div class="mu" style="font-size:10.5px;margin-top:6px">※ 영양 미반영: '+nu.ms.join(', ')+'</div>':'')
+'<div class="mu" style="font-size:10.5px;margin-top:6px">※ 원물 기준 추정치(조리 손실 미반영). '+sT('rda')+sT('kdri')+'</div></div>'+feCoach(nu)}

/*========== 홈 ==========*/
function vHome(){var s=curS(),T=TG(),rec=todayRec(),sl=SLOTS(),D=todaySum();
var pAcc={kcal:0,p:0,fe:0,ca:0,zn:0,feAb:0};rec.forEach(function(r){if(!r)return;var n=nutOf(r).t;NK.forEach(function(k){pAcc[k]+=n[k]});pAcc.feAb+=n.feAb});
var due=obs.filter(function(o){return !o.done&&dObs(o)<=3});
var exp=cubes.filter(function(c){return c.q>0&&dLeft(c)<=2});
var ns=nextStage(),nd=ns?Math.ceil((addM(d0(baby.birth),ns.f)-TD())/864e5):999;
var low=[];NK.forEach(function(k){if((D.f[k]+D.m[k])/T.day[k]<.7)low.push(NL[k][0])});
var feTot=D.f.feAb+D.m.feAb,fePc=feTot/T.feAb*100,dri=T.dri,w=T.w;
return (s.id==='ready'?'<div class="cd" style="background:#FFF6EC"><b>🕒 아직 이유식 시작 전</b><p class="mu" style="margin:5px 0 0">시작 예정일 <b style="color:var(--pd)">'+fmt(addM(d0(baby.birth),6))+'</b> · <b>'+Math.max(0,Math.ceil((addM(d0(baby.birth),6)-TD())/864e5))+'일</b> 남음</p></div>':'')
+(ns&&nd>0&&nd<=14?'<div class="cd" style="background:#F3FAF7"><b>🎉 '+nd+'일 후 '+ns.n+'로 넘어가요</b><p class="mu" style="margin:4px 0 0">'+fmt(addM(d0(baby.birth),ns.f))+'부터 <b>'+ns.ra+'</b> · '+ns.ct+'</p></div>':'')
+(due.length?'<div class="cd" style="background:#FFF6EC"><b>🔔 알레르기 관찰 중 '+due.length+'건</b>'+due.map(function(o){return '<div class="mu" style="margin-top:3px">· '+esc(o.n)+' — '+dObs(o)+'일차</div>'}).join('')+'<button class="btn g s" style="margin-top:8px" onclick="tab=\'food\';render()">관찰 기록</button></div>':'')
+(exp.length?'<div class="cd wn">🧊 유효기간 임박: <b>'+exp.map(function(c){return c.n}).join(', ')+'</b><button class="btn g s" style="margin-top:8px" onclick="tab=\'plan\';pTab=\'c\';render()">큐브 보기</button></div>':'')
+'<div class="cd"><div class="rw" style="justify-content:space-between;align-items:center"><b style="font-size:13.5px">🎯 오늘의 하루 목표 기준</b><button class="mu" style="color:var(--bl);font-weight:700" onclick="tab=\'grow\';render()">📈 성장기록</button></div>'
+'<div class="g2" style="margin-top:8px">'
+'<div style="background:'+(T.use?'#fff':'#FFEDE4')+';border:1.5px solid '+(T.use?'var(--ln)':'var(--pc)')+';border-radius:11px;padding:9px;cursor:pointer" onclick="baby.useW=0;save();render()"><div class="mu" style="font-size:10px;font-weight:800">표준 기준 ('+T.lb+')</div><b style="font-size:13px">'+dri.kcal+'kcal · 단백 '+dri.p+'g</b><div class="mu" style="font-size:10px">2020 섭취기준</div></div>'
+'<div style="background:'+(T.use?'#FFEDE4':'#fff')+';border:1.5px solid '+(T.use?'var(--pc)':'var(--ln)')+';border-radius:11px;padding:9px;cursor:pointer" onclick="if(!'+(w?1:0)+'){alert(\'성장 탭에서 몸무게를 먼저 기록해 주세요\');return}baby.useW=1;save();render()"><div class="mu" style="font-size:10px;font-weight:800">우리 아기 체중 기준</div><b style="font-size:13px">'+(w?Math.round(w*dri.ekg)+'kcal · 단백 '+rnd(w*dri.pkg)+'g':'몸무게 미입력')+'</b><div class="mu" style="font-size:10px">'+(w?w+'kg × '+dri.ekg+'kcal/kg':'성장 탭에서 입력')+'</div></div></div>'
+'<div class="mu" style="font-size:10.5px;margin-top:7px">눌러서 기준을 바꿀 수 있어요. 현재 적용: <b style="color:var(--pd)">'+(T.use?'체중 기준':'표준 기준')+'</b> · 철·칼슘·아연은 체중과 무관하게 표준값을 사용합니다. '+sT('kdri')+'</div></div>'
+'<div class="st">🍼 오늘 수유 입력</div><div class="cd"><div class="rw" style="justify-content:space-between;align-items:baseline;margin-bottom:8px"><b style="font-size:15px">'+D.ml+' ml</b><span class="mu">'+MILK[MTYPE()].n+' · '+todayLogs().filter(function(l){return l.k==='milk'}).length+'회</span></div>'
+'<div class="mlk">'+[100,120,150,180,200,220].map(function(v){return '<button onclick="addMilk('+v+')">+'+v+'</button>'}).join('')
+'<button onclick="addMilkP()" style="background:#F5EFEA;color:var(--sub)">직접</button><button onclick="undoMilk()" style="background:#FDEAE5;color:var(--rd)">↩︎</button></div>'
+'<div class="mu" style="font-size:10.5px;margin-top:8px">'+(MTYPE()==='f'?'분유 100ml당 67kcal·철 0.8mg(흡수율 약 10%)':'모유 100ml당 65kcal·철 0.03mg(흡수율 약 50%)')+' 기준 합산. '+sT('milk')+'</div></div>'
+'<div class="st">📊 오늘의 하루 영양 달성 (이유식 '+D.cnt+'끼 + 수유 '+D.ml+'ml)</div><div class="cd">'+stackBars(D.f,D.m,T.day)
+'<div class="hr"></div><div class="rw" style="justify-content:space-between;font-size:13px"><span style="font-weight:800;color:var(--rd)">🩸 흡수 추정 철분</span><span>'+rnd2(feTot)+' / '+rnd2(T.feAb)+'mg <b style="color:'+(fePc>=95?'#2E9C7D':fePc>=70?'var(--sn)':'var(--rd)')+'">'+Math.round(fePc)+'%</b></span></div>'
+'<div class="sb2"><i style="width:'+Math.min(100,D.f.feAb/T.feAb*100)+'%;background:var(--rd)"></i><i style="width:'+Math.max(0,Math.min(100-D.f.feAb/T.feAb*100,D.m.feAb/T.feAb*100))+'%;background:var(--rd);opacity:.34"></i><u style="left:100%"></u></div>'
+'<div class="mu" style="font-size:10px;margin-top:3px">철 권장량 '+dri.fe+'mg은 흡수율 약 10%를 가정한 값이라, 실제 몸에 흡수되는 목표는 <b>'+rnd2(T.feAb)+'mg</b>입니다. 총 섭취 '+rnd(D.f.fe+D.m.fe)+'mg 중 흡수 추정 '+rnd2(feTot)+'mg</div>'
+'<div class="hr"></div><div class="mu" style="font-size:11.5px">'+(low.length?'<b style="color:var(--rd)">부족: '+low.join(', ')+'</b> — '+(low.indexOf('철분')>=0?'소고기·달걀노른자 + 비타민C 채소(파프리카·브로콜리) 조합을 넣어보세요.':low.indexOf('칼슘')>=0?'두부·아기치즈·미역·요거트가 도움이 됩니다.':'고기·생선·두부를 늘려보세요.'):'<b style="color:#2E9C7D">주요 영양소가 잘 채워졌어요 👍</b>')+'</div></div>'
+'<div class="cd" style="background:#FBF6F2"><b style="font-size:12.5px">추천 '+MEALS()+'끼를 모두 먹으면 (이유식만)</b><div class="g3" style="margin-top:7px">'+NK.map(function(k){return '<div style="text-align:center"><div class="mu" style="font-size:10px">'+NL[k][0]+'</div><b style="color:'+NL[k][2]+';font-size:14px">'+Math.round(pAcc[k]/T.solid[k]*100)+'%</b></div>'}).join('')+'</div><div class="mu" style="font-size:10px;margin-top:5px">이유식 담당 목표 대비 · 흡수철 '+rnd2(pAcc.feAb)+'mg</div></div>'
+'<div class="st">🍽 오늘 '+MEALS()+'끼 추천</div>'
+rec.map(function(r,i){if(!r)return '';return '<div class="cd" style="padding:10px"><div class="rw" style="justify-content:space-between;align-items:center;margin-bottom:6px"><b style="font-size:12.5px;color:var(--pd)">'+sl[i]+'</b><span><button class="mu" style="font-weight:700;color:var(--bl)" onclick="openAlt('+i+')">🔄 대안</button> <button class="mu" style="font-weight:700;color:var(--pd);margin-left:8px" onclick="openEd(\''+r.i+'\')">✏️ 수정</button></span></div>'+rcard(r)+'<div class="rw"><button class="btn g s" onclick="qLog(\''+r.i+'\')">📝 먹었어요</button><button class="btn y s" onclick="toggleFav(\''+r.i+'\')">'+(fav[r.i]?'⭐ 해제':'☆ 즐겨찾기')+'</button></div></div>'}).join('')
+'<button class="btn y s" onclick="reRec()">🎲 추천 다시 받기</button>'
+'<div class="st">'+s.n+' 기준</div><div class="cd"><div class="g2">'+cell('농도',s.ra)+cell('횟수',s.ct)+cell('1회 양',s.am)+cell('입자',s.tx)+'</div><p class="mu" style="margin:10px 0 0">'+s.ds+'</p><div class="hr"></div><ul style="margin:0;padding-left:17px;font-size:13px">'+s.td.map(function(t){return '<li>'+t+'</li>'}).join('')+'</ul><div style="margin-top:8px">'+sT('ppibbo')+'</div></div>'
+'<div class="st">'+esc(baby.name)+'의 로드맵</div><div class="cd"><div class="rm">'+roadmap()+'</div></div>'
+'<p class="mu" style="text-align:center;font-size:10.5px;margin:14px 6px 0">참고 자료입니다. 최종 판단은 담당 소아과와 상의하세요.</p>'}
function addMilk(v){logs.push({id:''+Date.now(),d:fmt(TD()),k:'milk',ml:v,mt:MTYPE(),n:MILK[MTYPE()].n+' '+v+'ml',t:'수유'});save();render()}
function addMilkP(){var v=prompt('수유량(ml)',baby.vol||180);if(v===null)return;v=+v;if(!v)return;addMilk(v)}
function undoMilk(){for(var i=logs.length-1;i>=0;i--)if(logs[i].k==='milk'&&logs[i].d===fmt(TD())){logs.splice(i,1);break}save();render()}
function toggleFav(id){fav[id]=fav[id]?0:1;if(!fav[id])delete fav[id];save();render()}
function reRec(){var si=IDS.indexOf(curS().id==='ready'?'early':curS().id),rs=recommend(si,dOld()+Math.floor(Math.random()*97),SLOTS().length);
todaySel={k:fmt(TD())+'|'+MEALS(),ids:rs.map(function(r){return r.i})};save();render()}
function openAlt(idx){var si=IDS.indexOf(curS().id==='ready'?'early':curS().id),L=altList(si,todaySel.ids),T=TG();
document.getElementById('mb').innerHTML='<div class="mt2">🔄 '+SLOTS()[idx]+' 메뉴 바꾸기</div><p class="mu" style="margin:6px 0 10px">영양 기여가 높은 순 · 1끼 목표 대비 %</p>'
+L.map(function(r){var n=nutOf(r).t;return '<button class="rc" onclick="pickAlt('+idx+',\''+r.i+'\')"><div class="th">'+thumb(r)+'</div><div style="flex:1"><div class="nm">'+esc(r.n)+'</div><div class="ds">흡수철 '+rnd2(n.feAb)+'mg · 단백 '+Math.round(n.p/T.meal.p*100)+'% · 칼슘 '+Math.round(n.ca/T.meal.ca*100)+'% · '+Math.round(n.kcal)+'kcal</div></div><div class="ar">＋</div></button>'}).join('')
+'<button class="btn y" onclick="closeM()">닫기</button>';document.getElementById('md').classList.add('on');document.body.style.overflow='hidden'}
function pickAlt(idx,id){todaySel.ids[idx]=id;save();closeM();render()}
function miles(){var b=d0(baby.birth);return [[4,'이유식 준비 관찰',['목 가누기·앉은 자세 확인','어른 음식에 관심 보이는지 관찰']],
[6,'이유식 시작 · 초기(10배죽)',['쌀미음 1~2숟갈로 시작','1주 안에 소고기 추가','하루 1회, 오전 수유 전']],
[6.5,'초기 2단계 · 하루 2회',['채소 종류 늘리기','1회 60~80g까지','토핑 큐브 만들기']],
[7,'중기 시작(7배죽)',['2~3mm로 다져서','달걀 노른자·두부·생선 도입','하루 2~3회']],
[9,'후기 시작(진밥·핑거푸드)',['하루 3회+간식','0.5cm로 크게','핑거푸드 매일']],
[12,'완료기 · 유아식 전환',['밥과 반찬 중심','생우유 400~500ml','젖병 떼기 완료']]]
.map(function(x){var dt=addM(b,Math.floor(x[0]));if(x[0]%1)dt.setDate(dt.getDate()+15);return {m:x[0],t:x[1],td:x[2],dt:dt,dd:Math.ceil((dt-TD())/864e5)}})}
function roadmap(){var M=miles(),ni=-1;for(var i=0;i<M.length;i++)if(M[i].dd>0){ni=i;break}
return M.map(function(x,i){var c=x.dd<=0?(i===(ni===-1?M.length-1:ni-1)?'nw2':'dn'):'';
return '<div class="ri '+c+'"><div class="dt"></div><div class="wh">만 '+x.m+'개월 · '+fmt(x.dt)+(x.dd>0?' <span style="color:var(--pd)">D-'+x.dd+'</span>':'')+'</div><h4>'+x.t+'</h4><ul>'+x.td.map(function(t){return '<li>'+t+'</li>'}).join('')+'</ul></div>'}).join('')}
/*========== 식단 · 장보기 · 큐브 ==========*/
function genPlan(){var si=IDS.indexOf(curS().id==='ready'?'early':curS().id),ws=wkStart(),n=SLOTS().length,d=[],prev=[];
for(var i=0;i<7;i++){var rs=recommend(si,dOld()+i*3,n,prev);d.push(rs.map(function(r){return r.i}));
prev=[];rs.forEach(function(r){mainKeys(r).forEach(function(k){if(k.charAt(0)==='P')prev.push(k)})})}
plan={ws:ymd(ws),n:n,d:d};shopChk={};save()}
function vPlan(){return '<div class="tt"><button class="'+(pTab==='w'?'on':'')+'" onclick="pTab=\'w\';render()">🗓 주간</button><button class="'+(pTab==='s'?'on':'')+'" onclick="pTab=\'s\';render()">🛒 장보기</button><button class="'+(pTab==='c'?'on':'')+'" onclick="pTab=\'c\';render()">🧊 큐브</button></div>'+(pTab==='w'?vWeek():pTab==='s'?vShop():vCube())}
function vWeek(){if(!plan||plan.ws!==ymd(wkStart())||plan.n!==SLOTS().length)genPlan();
var ws=d0(plan.ws),sl=SLOTS(),DW=['월','화','수','목','금','토','일'],T=TG();
var h='<div class="cd"><div class="rw" style="justify-content:space-between;align-items:center"><b>🗓 '+fmt(ws)+' 주간 식단</b><button class="mu" style="color:var(--bl);font-weight:700" onclick="genPlan();render()">🎲 자동 편성</button></div><p class="mu" style="margin:5px 0 0">단백질 재료가 이어지지 않게 배치했습니다. 칸을 눌러 교체하세요.</p></div>';
h+='<div class="cd" style="padding:8px"><table class="wk"><tr><th></th>'+sl.map(function(s){return '<th>'+s+'</th>'}).join('')+'</tr>';
for(var i=0;i<7;i++){var dt=addD(ws,i),td=ymd(dt)===ymd(TD());
h+='<tr><th>'+DW[i]+'<br><span style="font-weight:400">'+(dt.getMonth()+1)+'/'+dt.getDate()+'</span></th>';
for(var j=0;j<sl.length;j++){var r=getR(plan.d[i][j]);
h+='<td class="'+(td?'tdy':'')+'" onclick="swapPlan('+i+','+j+')">'+(r?'<span class="mn">'+esc(r.n.length>11?r.n.slice(0,11)+'…':r.n)+'</span><span class="mu" style="font-size:9px">흡수철 '+rnd2(nutOf(r).t.feAb)+'</span>':'-')+'</td>'}
h+='</tr>'}h+='</table></div>';
var wk={kcal:0,p:0,fe:0,ca:0,zn:0,feAb:0},cnt=0;
plan.d.forEach(function(day){day.forEach(function(id){var r=getR(id);if(r){var n=nutOf(r).t;NK.forEach(function(k){wk[k]+=n[k]});wk.feAb+=n.feAb;cnt++}})});
h+='<div class="st">주간 평균 (1일 이유식 기준)</div><div class="cd">'+NK.map(function(k){var v=wk[k]/7,pc=v/T.solid[k]*100;
return '<div style="margin-bottom:8px"><div class="rw" style="justify-content:space-between;font-size:12.5px"><span style="font-weight:700">'+NL[k][0]+'</span><span>'+rnd(v)+NL[k][1]+' <b style="color:'+NL[k][2]+'">'+Math.round(pc)+'%</b></span></div><div class="sb2" style="height:9px"><i style="width:'+Math.min(100,pc)+'%;background:'+NL[k][2]+'"></i></div></div>'}).join('')
+'<div class="mu" style="font-size:10.5px;margin-top:5px">총 '+cnt+'끼 · 하루 흡수철 평균 '+rnd2(wk.feAb/7)+'mg (이유식 담당 목표 '+rnd2(T.feAb*T.sf)+'mg)</div></div>'
+'<button class="btn g s" onclick="pTab=\'s\';render()">🛒 장보기 리스트 만들기</button>';return h}
function swapPlan(i,j){var si=IDS.indexOf(curS().id==='ready'?'early':curS().id),L=altList(si,[plan.d[i][j]]);
document.getElementById('mb').innerHTML='<div class="mt2">메뉴 교체</div><p class="mu" style="margin:6px 0 10px">'+['월','화','수','목','금','토','일'][i]+'요일 '+SLOTS()[j]+'</p>'
+L.map(function(r){var n=nutOf(r).t;return '<button class="rc" onclick="doSwap('+i+','+j+',\''+r.i+'\')"><div class="th">'+thumb(r)+'</div><div style="flex:1"><div class="nm">'+esc(r.n)+'</div><div class="ds">흡수철 '+rnd2(n.feAb)+'mg · 단백 '+rnd(n.p)+'g · '+Math.round(n.kcal)+'kcal</div></div><div class="ar">＋</div></button>'}).join('')
+'<button class="btn y" onclick="closeM()">닫기</button>';document.getElementById('md').classList.add('on');document.body.style.overflow='hidden'}
function doSwap(i,j,id){plan.d[i][j]=id;shopChk={};save();closeM();render()}
function shopList(){if(!plan)genPlan();var need={};
plan.d.forEach(function(day){day.forEach(function(id){var r=getR(id);if(!r)return;var sv=r.sv||1;
(r.g||[]).forEach(function(x){var nm=x[3]||x[0];if(!nm||x[0]==='물'||nm==='물')return;var gr=gOf(x)/sv;if(!gr)return;need[nm]=(need[nm]||0)+gr})})});
var have={};cubes.forEach(function(c){if(c.q>0)have[c.n]=(have[c.n]||0)+c.q*c.g});
return Object.keys(need).map(function(k){var n=need[k],h=have[k]||0;return {n:k,need:n,have:h,buy:Math.ceil(Math.max(0,n-h)/10)*10}}).sort(function(a,b){return b.buy-a.buy})}
function vShop(){var L=shopList(),ws=d0(plan.ws);
return '<div class="cd"><b>🛒 장보기 리스트</b><p class="mu" style="margin:5px 0 0">'+fmt(ws)+' 주간 식단('+plan.n+'끼×7일) 총량에서 <b>냉동 큐브 재고 차감</b>. 10g 단위 올림.</p></div>'
+(L.length?'<div class="cd">'+L.map(function(x){var on=shopChk[x.n];
return '<div class="sc '+(on?'on':'')+'" onclick="shopChk[\''+x.n.replace(/'/g,'')+'\']='+(on?'0':'1')+';save();render()"><div class="bx2">'+(on?'✓':'')+'</div><div style="flex:1"><b class="nm2" style="font-size:13.5px">'+esc(x.n)+'</b><div class="mu" style="font-size:10.5px">필요 '+Math.round(x.need)+'g'+(x.have?' · 큐브 '+Math.round(x.have)+'g 보유':'')+'</div></div><b style="color:'+(x.buy?'var(--pd)':'var(--mt)')+'">'+(x.buy?x.buy+'g':'충분')+'</b></div>'}).join('')+'</div>':'<div class="cd mu">식단을 먼저 편성해 주세요.</div>')
+'<button class="btn g s" onclick="copyShop()">📋 텍스트 복사 (카톡 전송용)</button>'
+'<div class="cd" style="background:#F3FAF7;font-size:12px;margin-top:10px"><b>구매 팁</b><ul style="margin:5px 0 0;padding-left:16px;color:var(--sub)"><li>고기는 소분 냉동해 두면 편합니다.</li><li>비타민C 채소(파프리카·브로콜리)는 철분 흡수용으로 늘 준비하세요.</li><li>두부·생선은 조리 당일 구매를 권합니다.</li></ul></div>'}
function copyShop(){var L=shopList().filter(function(x){return x.buy>0});
var t='🛒 '+baby.name+' 이유식 장보기 ('+fmt(d0(plan.ws))+' 주)\n'+L.map(function(x){return '· '+x.n+' '+x.buy+'g'}).join('\n');
if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){alert('복사했어요!')},function(){prompt('복사하세요',t)});else prompt('복사하세요',t)}
function dLeft(c){return 14-Math.floor((TD()-d0(c.dt))/864e5)}
function vCube(){var act=cubes.filter(function(c){return c.q>0});
return '<div class="cd"><b>🧊 냉동 큐브 재고</b><p class="mu" style="margin:5px 0 10px">만든 날 기준 14일까지를 권장 사용기한으로 계산하고 장보기에서 자동 차감합니다.</p>'
+'<div class="rw"><div class="fd" style="flex:1.3;margin:0"><label>재료</label><input id="cN" list="cL" placeholder="소고기"><datalist id="cL">'+Object.keys(NUT).map(function(k){return '<option>'+k+'</option>'}).join('')+'</datalist></div><div class="fd" style="flex:.6;margin:0"><label>개수</label><input id="cQ" type="number" placeholder="7"></div><div class="fd" style="flex:.6;margin:0"><label>1개 g</label><input id="cG" type="number" placeholder="10"></div></div>'
+'<div class="fd" style="margin:10px 0 0"><label>만든 날</label><input id="cD" type="date" value="'+ymd(TD())+'"></div><button class="btn" style="margin-top:10px" onclick="addCube()">＋ 큐브 등록</button></div>'
+'<div class="st">보유 중 ('+act.length+'종)</div>'
+(act.length?'<div class="cd">'+act.map(function(c){var d=dLeft(c);
return '<div class="cb"><div style="flex:0 0 30px;height:30px;border-radius:9px;overflow:hidden">'+ART('cube')+'</div><div style="flex:1"><b style="font-size:13.5px">'+esc(c.n)+'</b><div class="mu" style="font-size:10.5px">'+c.g+'g/개 · 총 '+(c.q*c.g)+'g · '+(d>0?'<b style="color:'+(d<=2?'var(--rd)':'var(--sub)')+'">D-'+d+'</b>':'<b style="color:var(--rd)">기한 초과</b>')+'</div></div><div class="sp"><button onclick="cQ2(\''+c.id+'\',-1)">−</button><b style="width:20px;text-align:center">'+c.q+'</b><button onclick="cQ2(\''+c.id+'\',1)">＋</button><button style="color:var(--sub);padding:0 3px" onclick="cD2(\''+c.id+'\')">✕</button></div></div>'}).join('')
+'<div class="mu" style="font-size:10.5px;margin-top:8px">− 버튼으로 사용한 개수를 차감하세요.</div></div>':'<div class="cd mu">등록된 큐브가 없어요. 메뉴 > 토핑 > [준비] 큐브 만들기를 참고하세요.</div>')
+'<div class="cd" style="background:#F3FAF7;font-size:12px"><b>보관 팁</b><ul style="margin:5px 0 0;padding-left:16px;color:var(--sub)"><li>완전히 식힌 뒤 뚜껑을 덮어 냉동.</li><li>지퍼백에 재료명·날짜를 적어두세요.</li><li>실온 방치·재냉동은 피하세요.</li></ul><div style="margin-top:6px">'+sT('mfds')+'</div></div>'}
function addCube(){var n=document.getElementById('cN').value.trim(),q=+document.getElementById('cQ').value,g=+document.getElementById('cG').value||10,dt=document.getElementById('cD').value;
if(!n)return alert('재료명을 입력해 주세요');if(!q)return alert('개수를 입력해 주세요');cubes.push({id:'c'+Date.now(),n:n,q:q,g:g,dt:dt});save();render()}
function cQ2(id,d){cubes.forEach(function(c){if(c.id===id)c.q=Math.max(0,c.q+d)});save();render()}
function cD2(id){cubes=cubes.filter(function(c){return c.id!==id});save();render()}

/*========== 메뉴 ==========*/
function menuHead(){return '<div class="tt"><button class="'+(mTab==='s'?'on':'')+'" onclick="mTab=\'s\';render()">📚 단계별</button><button class="'+(mTab==='f'?'on':'')+'" onclick="mTab=\'f\';render()">⭐ 즐겨찾기</button><button class="'+(mTab==='m'?'on':'')+'" onclick="mTab=\'m\';render()">✏️ 나의 메뉴 ('+myR.length+')</button></div>'
+'<div class="cd" style="padding:9px"><input value="'+esc(srch)+'" oninput="srch=this.value;reSearch()" id="sq" placeholder="🔎 메뉴·재료 검색 (예: 소고기, 토핑)" style="width:100%;padding:10px;border:1.5px solid var(--ln);border-radius:11px;outline:none"></div>'}
function vMenu(){return menuHead()+(srch?vSearch():mTab==='s'?vStage():mTab==='f'?vFav():vMy())}
function reSearch(){srch=document.getElementById('sq').value;document.getElementById('vw').innerHTML=vMenu();
var s2=document.getElementById('sq');if(s2){s2.focus();s2.setSelectionRange(s2.value.length,s2.value.length)}}
function vSearch(){var q=srch.toLowerCase(),L=RCP().filter(function(r){
if(r.n.toLowerCase().indexOf(q)>=0)return 1;if(TY[r.y].indexOf(q)>=0)return 1;
return (r.g||[]).filter(function(x){return (x[0]+' '+(x[3]||'')).toLowerCase().indexOf(q)>=0}).length});
return '<div class="st">검색 결과 '+L.length+'개</div>'+(L.length?L.map(function(r){return rcard(r,' · '+STG[r.s].n+' '+TY[r.y])}).join(''):'<div class="cd mu">결과가 없어요.</div>')}
function vFav(){var L=RCP().filter(function(r){return fav[r.i]});
return '<div class="cd" style="background:#FFF6EC;font-size:12px">즐겨찾기한 메뉴는 <b>추천에서 우선 선택</b>됩니다. 메뉴 상세에서 ☆를 눌러 등록하세요.</div>'
+(L.length?L.map(function(r){return rcard(r,' · '+STG[r.s].n)}).join(''):'<div class="cd mu">아직 즐겨찾기가 없어요.</div>')}
function vStage(){var si=IDS.indexOf(selS),st=STG[si],cur=curS().id;
var ty=[['p',TY.p],['t',TY.t]];if(selS==='late')ty.push(['f',TY.f]);if(selS==='final')ty=[['m',TY.m]];
if(!ty.filter(function(x){return x[0]===selT}).length)selT=ty[0][0];
var list=RCP().filter(function(r){return r.s===si&&r.y===selT});
return '<div class="tab">'+STG.slice(1).map(function(s){return '<button class="'+(s.id===selS?'on':'')+'" style="'+(s.id===selS?'background:'+s.c:'')+'" onclick="selS=\''+s.id+'\';render()">'+s.n+(s.id===cur?' ·':'')+'</button>'}).join('')+'</div>'
+'<div class="cd" style="border-left:4px solid '+st.c+'"><b style="font-size:16px">'+st.n+' <span class="mu" style="font-weight:600">'+st.lb+'</span></b>'+(st.id===cur?' <span class="tg p">지금 여기</span>':'')+'<p class="mu" style="margin:7px 0 10px">'+st.ds+'</p><div class="g2">'+cell('농도',st.ra)+cell('횟수',st.ct)+cell('1회 양',st.am)+cell('입자',st.tx)+'</div><div style="margin-top:9px">'+sT('ppibbo')+sT('bboon')+'</div></div>'
+'<div class="tt">'+ty.map(function(t){return '<button class="'+(t[0]===selT?'on':'')+'" onclick="selT=\''+t[0]+'\';render()">'+t[1]+'</button>'}).join('')+'</div>'
+(selT==='t'?'<div class="cd" style="background:#F3FAF7;font-size:12px"><b>🧊 토핑이유식</b> — 기본 죽(밥)에 재료별 큐브를 올려 주는 방식. 먼저 <b>[준비] 큐브 만들기</b>로 큐브를 만들고 아래 조합을 돌려 쓰세요. '+sT('topping')+'</div>':'')
+(selT==='p'?'<div class="cd" style="background:#FFF6EC;font-size:12px"><b>🍲 죽 이유식</b> — 배죽 비율(10→7→5배죽→진밥)에 따라 재료를 함께 끓이는 방식. '+sT('bboon')+'</div>':'')
+(list.length?list.map(function(r){return rcard(r)}).join(''):'<div class="cd mu">메뉴가 없습니다.</div>')}
function vMy(){return '<div class="cd"><b>✏️ 나의 메뉴</b><p class="mu" style="margin:5px 0 10px">재료와 중량을 입력하면 영양소·권장량 %·<b>철분 흡수 추정</b>까지 자동 계산됩니다. <b>기본 메뉴도 메뉴명까지 수정</b> 가능해요.</p><button class="btn" onclick="openEd()">＋ 새 메뉴 만들기</button></div>'
+(myR.length?myR.slice().reverse().map(function(r){return rcard(r,' · '+STG[r.s].n)}).join(''):'<div class="cd mu">아직 등록한 메뉴가 없어요.</div>')}

/*========== 레시피 상세 ==========*/
function openR(id){curR=getR(id);qty=1;document.getElementById('mb').innerHTML=rBody();document.getElementById('md').classList.add('on');document.body.style.overflow='hidden'}
function rBody(){var r=curR,st=STG[r.s],nu=nutOf(r,qty);
return '<div class="rw" style="justify-content:space-between;align-items:center"><span></span><button style="font-size:20px" onclick="toggleFav(\''+r.i+'\');document.getElementById(\'mb\').innerHTML=rBody()">'+(fav[r.i]?'⭐':'☆')+'</button></div>'
+'<div class="mt2" style="text-align:center;margin-bottom:4px">'+esc(r.n)+'</div><div style="text-align:center;margin-bottom:12px"><span class="tg" style="background:'+st.c+'22;color:'+(st.c==='#FFC861'?'#B07C13':st.c)+'">'+st.n+'</span><span class="tg">'+TY[r.y]+'</span><span class="tg">⏱ '+(r.tm||'-')+'</span>'+(r.tag?'<span class="tg p">'+r.tag+'</span>':'')+(r.sv>1?'<span class="tg">'+r.sv+'회분</span>':'')+(r.ed?'<span class="tg p">내가 수정</span>':'')+'</div>'
+'<div class="qb"><b style="flex:1;font-size:13.5px">분량 ×'+qty+'</b><button onclick="setQ(-1)">−</button><b style="width:22px;text-align:center">'+qty+'</b><button onclick="setQ(1)">＋</button></div>'
+'<div class="cd"><div class="rw" style="justify-content:space-between"><b style="font-size:13.5px">🧾 재료</b><button class="mu" style="font-weight:700;color:var(--pd)" onclick="openEd(\''+r.i+'\')">✏️ 이름·재료·중량 수정</button></div><div style="margin-top:6px">'
+r.g.map(function(x){return '<div class="ir"><span>'+esc(x[0])+'</span><b>'+rnd((+x[1]||0)*qty)+x[2]+'</b></div>'}).join('')+'</div><div class="mu" style="font-size:10.5px;margin-top:6px">기준: '+st.ra+' · 1회 '+st.am+'</div></div>'
+nutBlock(nu,qty)
+'<div class="cd"><b style="font-size:13.5px">👩‍🍳 만드는 순서</b><div class="mu" style="font-size:10.5px;margin:2px 0 8px">기본 그림이 표시됩니다. 📷로 직접 찍은 사진으로 바꿀 수 있어요.</div><ul class="sl">'
+r.st.map(function(s,x){var k=r.i+'_'+x,p=ph[k];
return '<li><div class="no">'+(x+1)+'</div><div class="ar2"><div class="bx">'+(p?'<img src="'+p+'">':ART(kOf(s)))+'</div><div class="p2"><button onclick="pickPh(\''+k+'\')">📷 '+(p?'변경':'내 사진')+'</button>'+(p?'<button class="d" onclick="delPh(\''+k+'\')">↺</button>':'')+'</div></div><div class="tx">'+esc(s)+'</div></li>'}).join('')
+'</ul><button class="btn y s" onclick="ytSearch()">▶ 유튜브 조리영상 찾기</button></div>'
+(r.tip?'<div class="tp" style="margin-bottom:9px">💡 <b>TIP</b> '+esc(r.tip)+'</div>':'')
+(r.wn?'<div class="wn" style="margin-bottom:9px">⚠️ <b>주의</b> '+esc(r.wn)+'</div>':'')
+'<div class="sb" style="margin-bottom:11px"><b>📎 참고 출처</b><ul style="margin:6px 0 0;padding-left:16px">'+(r.sr||['ppibbo']).map(function(k){return '<li><a href="'+SRC[k].u+'" target="_blank" rel="noopener">'+SRC[k].n+'</a></li>'}).join('')
+'<li><a href="'+SRC.rda.u+'" target="_blank" rel="noopener">'+SRC.rda.n+'</a> (영양)</li><li><a href="'+SRC.kdri.u+'" target="_blank" rel="noopener">'+SRC.kdri.n+'</a> (권장량)</li></ul><div class="mu" style="font-size:10.5px;margin-top:6px">위 자료의 원칙·방식을 참고해 재구성했으며 원문을 그대로 옮긴 것이 아닙니다.</div></div>'
+'<button class="btn" onclick="qLog(\''+r.i+'\')">📝 오늘 먹은 기록에 추가</button>'
+'<button class="btn g" style="margin-top:8px" onclick="openEd(\''+r.i+'\')">✏️ 이 레시피 수정</button>'
+(ov[r.i]?'<button class="btn y" style="margin-top:8px" onclick="resetOv(\''+r.i+'\')">↩️ 기본값 복원</button>':'')
+'<button class="btn y" style="margin-top:8px" onclick="closeM()">닫기</button>'}
function ytSearch(){window.open('https://www.youtube.com/results?search_query='+encodeURIComponent(curR.n+' 이유식 만들기'),'_blank')}
function setQ(d){qty=Math.max(1,Math.min(10,qty+d));document.getElementById('mb').innerHTML=rBody()}
function closeM(){document.getElementById('md').classList.remove('on');document.body.style.overflow=''}
function openSrc(k){var s=SRC[k];document.getElementById('mb').innerHTML='<div class="mt2">📎 출처</div><div class="cd" style="margin-top:10px"><span class="tg v">'+s.t+'</span><b style="display:block;margin:6px 0">'+s.n+'</b><p class="mu" style="margin:0">'+s.d+'</p><div class="hr"></div><a href="'+s.u+'" target="_blank" rel="noopener">'+s.u+'</a></div><button class="btn y" onclick="closeM()">닫기</button>';
document.getElementById('md').classList.add('on');document.body.style.overflow='hidden'}

/*========== 사진 ==========*/
function pickPh(k){phT=k;document.getElementById('fi').click()}
function delPh(k){delete ph[k];save();document.getElementById('mb').innerHTML=rBody();render()}

/*========== 편집 ==========*/
function openEd(id){var r=id?getR(id):null;
ME=r?JSON.parse(JSON.stringify(r)):{i:'my'+Date.now(),my:1,n:'',s:IDS.indexOf(curS().id==='ready'?'early':curS().id),y:'p',tm:'',g:[],st:[''],tip:'',sv:1,sr:['ppibbo']};
ME.orig=(id&&r&&!r.my)?id:null;drawEd();document.getElementById('md').classList.add('on');document.body.style.overflow='hidden'}
function drawEd(){var nu=nutOf(ME),T=TG(),ks=Object.keys(NUT);
document.getElementById('mb').innerHTML='<div class="mt2" style="margin-bottom:4px">'+(ME.orig?'✏️ 레시피 수정':(ME.n?'✏️ 내 메뉴 수정':'＋ 나의 메뉴 만들기'))+'</div>'
+(ME.orig?'<p class="mu" style="margin:0 0 10px">메뉴명·재료·중량 모두 수정 가능. 이 기기에만 저장되고 원본은 보존됩니다.</p>':'')
+'<div class="cd"><div class="fd"><label>메뉴 이름</label><input type="text" value="'+esc(ME.n)+'" oninput="ME.n=this.value"></div>'
+'<div class="rw"><div class="fd" style="flex:1"><label>단계</label><select onchange="ME.s=+this.value">'+STG.slice(1).map(function(s,i){return '<option value="'+(i+1)+'" '+(ME.s===i+1?'selected':'')+'>'+s.n+'</option>'}).join('')+'</select></div>'
+'<div class="fd" style="flex:1"><label>분류</label><select onchange="ME.y=this.value">'+[['p','죽'],['t','토핑'],['f','핑거푸드'],['m','유아식']].map(function(x){return '<option value="'+x[0]+'" '+(ME.y===x[0]?'selected':'')+'>'+x[1]+'</option>'}).join('')+'</select></div></div>'
+'<div class="rw"><div class="fd" style="flex:1;margin:0"><label>조리시간</label><input type="text" value="'+esc(ME.tm||'')+'" oninput="ME.tm=this.value" placeholder="25분"></div><div class="fd" style="flex:1;margin:0"><label>몇 회분?</label><input type="number" min="1" value="'+(ME.sv||1)+'" oninput="ME.sv=Math.max(1,+this.value||1);drawEd()"></div></div></div>'
+'<div class="st">재료 · 중량 (숫자를 바꾸면 아래 영양이 즉시 재계산)</div><div class="cd">'
+(ME.g.length?ME.g.map(function(x,i){return '<div class="ei"><input style="flex:1.4" value="'+esc(x[0])+'" oninput="ME.g['+i+'][0]=this.value"><input style="flex:.62" type="number" step="0.1" value="'+x[1]+'" oninput="ME.g['+i+'][1]=+this.value;drawEd()"><select style="flex:.52" onchange="ME.g['+i+'][2]=this.value;drawEd()">'+['g','ml','개','방울'].map(function(u){return '<option '+(x[2]===u?'selected':'')+'>'+u+'</option>'}).join('')+'</select><select style="flex:1" onchange="ME.g['+i+'][3]=this.value;drawEd()"><option value="">영양 미반영</option>'+ks.map(function(k){return '<option '+(x[3]===k?'selected':'')+'>'+k+'</option>'}).join('')+'</select><button style="color:var(--sub)" onclick="ME.g.splice('+i+',1);drawEd()">✕</button></div>'}).join(''):'<div class="mu">재료를 추가해 주세요.</div>')
+'<div class="hr"></div><div class="fd" style="margin-bottom:8px"><label>기본 재료 선택 (영양 자동 계산)</label><select id="eK" onchange="document.getElementById(\'eN\').value=this.value"><option value="">— 직접 입력 —</option>'+ks.map(function(k){return '<option>'+k+'</option>'}).join('')+'</select></div>'
+'<div class="ei"><input id="eN" style="flex:1.4" placeholder="재료명"><input id="eQ" style="flex:.62" type="number" placeholder="20"><select id="eU" style="flex:.52"><option>g</option><option>ml</option><option>개</option><option>방울</option></select></div>'
+'<button class="btn g s" onclick="addIng()">＋ 재료 추가</button></div>'
+'<div class="cd"><b style="font-size:13px">🍀 자동 계산 영양 (1회분)</b><div class="mu" style="font-size:10.5px;margin:3px 0 8px">1끼 목표 = '+(T.use?'체중 '+T.w+'kg':'표준')+' 하루 목표 × 이유식 '+Math.round(T.sf*100)+'% ÷ '+MEALS()+'끼</div>'
+NK.map(function(k){var pc=nu.t[k]/T.meal[k]*100;
return '<div style="margin-bottom:8px"><div class="rw" style="justify-content:space-between;font-size:12px"><span style="font-weight:700">'+NL[k][0]+'</span><span>'+rnd(nu.t[k])+NL[k][1]+' <b style="color:'+NL[k][2]+'">1끼 '+Math.round(pc)+'%</b> · 하루 '+Math.round(nu.t[k]/T.day[k]*100)+'%</span></div><div class="sb2" style="height:9px"><i style="width:'+Math.min(100,pc)+'%;background:'+NL[k][2]+'"></i></div></div>'}).join('')
+'<div class="rw" style="justify-content:space-between;font-size:12px"><span style="font-weight:800;color:var(--rd)">🩸 흡수 추정 철분</span><span>'+rnd2(nu.t.feAb)+'mg · 하루 흡수목표의 '+Math.round(nu.t.feAb/T.feAb*100)+'%</span></div><div class="sb2" style="height:9px"><i style="width:'+Math.min(100,nu.t.feAb/T.feAb*100)+'%;background:var(--rd)"></i></div>'
+'<div class="mu" style="font-size:10px;margin-top:4px">헴철 '+rnd2(nu.hm)+' · 비헴철 '+rnd2(nu.nh)+' · 비타민C '+rnd(nu.t.vc)+'mg</div></div>'
+feCoach(nu)
+'<div class="st">만드는 순서 (그림 자동 매칭)</div><div class="cd">'
+ME.st.map(function(s,i){return '<div class="rw" style="margin-bottom:6px;align-items:center"><div style="flex:0 0 40px;height:31px;border-radius:8px;overflow:hidden;border:1px solid var(--ln)">'+ART(kOf(s))+'</div><input value="'+esc(s)+'" oninput="ME.st['+i+']=this.value" onblur="drawEd()" placeholder="'+(i+1)+'단계" style="flex:1;padding:10px;border:1.5px solid var(--ln);border-radius:11px"><button style="color:var(--sub);padding:0 4px" onclick="ME.st.splice('+i+',1);drawEd()">✕</button></div>'}).join('')
+'<button class="btn g s" onclick="ME.st.push(\'\');drawEd()">＋ 단계 추가</button></div>'
+'<div class="cd"><div class="fd" style="margin:0"><label>메모 / TIP</label><textarea rows="3" oninput="ME.tip=this.value">'+esc(ME.tip||'')+'</textarea></div></div>'
+'<button class="btn" onclick="saveEd()">저장하기</button>'
+(ME.my&&myR.filter(function(r){return r.i===ME.i}).length?'<button class="btn y" style="margin-top:8px" onclick="delMy(\''+ME.i+'\')">삭제</button>':'')
+'<button class="btn y" style="margin-top:8px" onclick="closeM()">취소</button>'}
function addIng(){var k=document.getElementById('eK').value,n=document.getElementById('eN').value.trim()||k,q=+document.getElementById('eQ').value,u=document.getElementById('eU').value;
if(!n)return alert('재료명을 입력해 주세요');if(!q)return alert('양을 입력해 주세요');ME.g.push([n,q,u,k||'']);drawEd()}
function saveEd(){if(!(ME.n||'').trim())return alert('메뉴 이름을 입력해 주세요');
ME.st=ME.st.filter(function(x){return x.trim()});if(!ME.st.length)ME.st=['—'];
if(ME.orig){var id=ME.orig;ov[id]={n:ME.n,g:ME.g,st:ME.st,tm:ME.tm,sv:ME.sv,tip:ME.tip,s:ME.s,y:ME.y};save();closeM();curR=getR(id);openR(id);render();return}
ME.my=1;ME.tag='내 레시피';delete ME.orig;var i=-1;myR.forEach(function(r,x){if(r.i===ME.i)i=x});if(i>=0)myR[i]=ME;else myR.push(ME);
save();closeM();mTab='m';tab='menu';srch='';render()}
function resetOv(id){if(!confirm('기본 레시피로 되돌릴까요?'))return;delete ov[id];save();curR=getR(id);document.getElementById('mb').innerHTML=rBody();render()}
function delMy(id){if(!confirm('삭제할까요?'))return;myR=myR.filter(function(r){return r.i!==id});save();closeM();render()}

/*========== 재료 · 관찰 ==========*/
function dObs(o){return Math.floor((TD()-d0(o.dt))/864e5)+1}
function vFood(){var m=ageM(),cats=['전체','곡류','육류','어패류','채소','과일','콩·유제품','기타'];
var list=FD.filter(function(f){return fCat==='전체'||f[2]===fCat}).sort(function(a,b){return a[3]-b[3]});
var act=obs.filter(function(o){return !o.done});
return '<div class="cd" style="background:#FFF6EC"><b>🔔 알레르기 3일 관찰 타이머</b><p class="mu" style="margin:5px 0 8px">새 재료는 <b>오전에 소량</b>으로 먹이고 3일간 지켜봅니다.</p>'
+'<div class="rw"><div class="fd" style="flex:1.4;margin:0"><label>새 재료</label><input id="oN" list="oL" placeholder="예: 달걀 노른자"><datalist id="oL">'+FD.map(function(f){return '<option>'+f[0]+'</option>'}).join('')+'</datalist></div><div class="fd" style="flex:1;margin:0"><label>시작일</label><input id="oD" type="date" value="'+ymd(TD())+'"></div></div>'
+'<button class="btn" style="margin-top:9px" onclick="addObs()">＋ 관찰 시작</button><button class="btn y s" style="margin-top:7px" onclick="askNoti()">🔔 브라우저 알림 허용</button></div>'
+(act.length?act.map(function(o,i){var d=dObs(o);
return '<div class="cd" style="border-left:4px solid '+(d<=3?'var(--sn)':'var(--mt)')+'"><div class="rw" style="justify-content:space-between"><b>'+esc(o.n)+'</b><span class="mu">'+o.dt+' · '+d+'일차</span></div>'
+'<div class="ch" style="margin-top:8px">'+[0,1,2].map(function(x){return '<button class="'+(o.c[x]?'on':'')+'" onclick="obsChk('+i+','+x+')">D+'+x+' '+(o.c[x]?'✓':'확인')+'</button>'}).join('')+'</div>'
+'<div class="fd" style="margin:9px 0 0"><label>증상 메모</label><input type="text" value="'+esc(o.m||'')+'" oninput="obsMemo('+i+',this.value)" placeholder="발진·설사·보챔 등"></div>'
+'<div class="rw" style="margin-top:9px"><button class="btn g s" onclick="obsDone('+i+',1)">😊 안전 확인</button><button class="btn y s" onclick="obsDone('+i+',0)">😖 반응 있었음</button></div>'
+(d>=3&&o.c[0]&&o.c[1]&&o.c[2]?'<div class="tp" style="margin-top:8px">3일 관찰이 끝났어요. 이상이 없으면 안전 확인을 눌러주세요.</div>':'')+'</div>'}).join(''):'<div class="cd mu">관찰 중인 재료가 없어요.</div>')
+'<div class="st">🥕 재료 도감 (만 '+Math.floor(m)+'개월 기준)</div>'
+'<div class="cd" style="font-size:12px"><p class="mu" style="margin:0">흐린 재료는 아직 이른 시기. 시기는 일반적 기준이며 아기마다 다릅니다. '+sT('ppibbo')+sT('niaid')+'</p></div>'
+'<div class="tab">'+cats.map(function(c){return '<button class="'+(c===fCat?'on':'')+'" onclick="fCat=\''+c+'\';render()">'+c+'</button>'}).join('')+'</div>'
+'<div class="g4">'+list.map(function(f){var lk=m<f[3],t=tried[f[0]],nv=NUT[f[4]];
return '<button class="ig '+(lk?'lk':'')+'" onclick="openF(\''+f[0]+'\')"><div class="e">'+f[1]+'</div><div class="n">'+f[0]+'</div><div class="m">'+f[3]+'개월+</div>'+(nv&&nv[6]==='h'?'<div class="ok" style="color:var(--rd)">헴철</div>':nv&&nv[5]>=30?'<div class="ok" style="color:#B07C13">비타민C</div>':'')+(t==='ok'?'<div class="ok">✓ 확인</div>':'')+(t==='bad'?'<div class="ok" style="color:#E0563C">⚠ 반응</div>':'')+'</button>'}).join('')+'</div>'}
function addObs(){var n=document.getElementById('oN').value.trim(),dt=document.getElementById('oD').value;
if(!n)return alert('재료명을 입력해 주세요');obs.push({id:'o'+Date.now(),n:n,dt:dt,c:[0,0,0],m:'',done:0});save();askNoti();render()}
function obsChk(i,x){var a=obs.filter(function(o){return !o.done})[i];a.c[x]=a.c[x]?0:1;save();render()}
function obsMemo(i,v){var a=obs.filter(function(o){return !o.done})[i];a.m=v;save()}
function obsDone(i,ok){var a=obs.filter(function(o){return !o.done})[i];a.done=1;a.ok=ok;tried[a.n]=ok?'ok':'bad';save();
alert(ok?a.n+' — 안전 재료로 기록했어요!':a.n+' — 반응으로 기록했어요. 증상이 심하면 소아과에 문의하세요.');render()}
function askNoti(){if(!('Notification' in window))return alert('이 브라우저는 알림을 지원하지 않아요.');
Notification.requestPermission().then(function(p){if(p==='granted')new Notification('알림이 설정되었어요',{body:'관찰 기간 동안 앱을 열면 알려드립니다.'})})}
function notiCheck(){var due=obs.filter(function(o){return !o.done&&dObs(o)<=3&&!o.c[dObs(o)-1]});
if(due.length&&'Notification' in window&&Notification.permission==='granted')
new Notification('🔔 알레르기 관찰 '+due.length+'건',{body:due.map(function(o){return o.n+' '+dObs(o)+'일차'}).join(', ')})}
function openF(n){var f=null;FD.forEach(function(x){if(x[0]===n)f=x});var m=ageM(),t=tried[n],nv=NUT[f[4]],T=TG();
var rs=RCP().filter(function(r){return (r.g||[]).filter(function(x){return x[3]===f[4]}).length});
document.getElementById('mb').innerHTML='<div style="font-size:40px;text-align:center">'+f[1]+'</div><div class="mt2" style="text-align:center">'+f[0]+'</div>'
+'<div style="text-align:center;margin:6px 0 12px"><span class="tg m">'+f[2]+'</span><span class="tg '+(m>=f[3]?'p':'')+'">'+f[3]+'개월부터</span>'+(nv&&nv[6]==='h'?'<span class="tg r">헴철(흡수율 높음)</span>':'')+(nv&&nv[5]>=30?'<span class="tg" style="background:#FFF6EC;color:#B07C13">비타민C 풍부</span>':'')+(f[6]===1?'<span class="tg v">알레르기 주의</span>':'')+(f[6]===2?'<span class="tg r">특별 주의</span>':'')+'</div>'
+'<div class="cd">'+f[5]+'</div>'
+(nv?'<div class="cd"><b style="font-size:13px">100g당 영양 · 하루 목표 대비</b><table class="tb" style="margin-top:5px"><tr><th></th><th>열량</th><th>단백질</th><th>철분</th><th>칼슘</th><th>아연</th><th>비타민C</th></tr><tr><td>100g</td><td>'+nv[0]+'</td><td>'+nv[1]+'</td><td>'+nv[2]+'</td><td>'+nv[3]+'</td><td>'+nv[4]+'</td><td>'+nv[5]+'</td></tr><tr><td>하루%</td>'+NK.map(function(k,i){return '<td><b style="color:'+NL[k][2]+'">'+Math.round(nv[i]/T.day[k]*100)+'%</b></td>'}).join('')+'<td>-</td></tr></table>'
+'<div class="mu" style="font-size:10.5px;margin-top:5px">철분 종류: <b>'+(nv[6]==='h'?'헴철 — 흡수율 약 20~25%':'비헴철 — 흡수율 약 5%, 비타민C와 함께 먹으면 2~3배 상승')+'</b></div></div>':'')
+(m<f[3]?'<div class="wn">아직 이른 재료예요. <b>'+fmt(addM(d0(baby.birth),f[3]))+'</b>(만 '+f[3]+'개월) 이후에 시도해 보세요.</div>':'')
+'<div class="st">관찰 · 반응</div><div class="cd"><button class="btn g s" onclick="startObs(\''+n+'\')">🔔 이 재료로 3일 관찰 시작</button><div class="ch" style="margin-top:9px">'+[['ok','😊 잘 먹었어요'],['watch','😐 관찰 중'],['bad','😖 반응 있었어요']].map(function(x){return '<button class="'+(t===x[0]?'on':'')+'" onclick="setF(\''+n+'\',\''+x[0]+'\')">'+x[1]+'</button>'}).join('')+'</div>'
+(t==='bad'?'<div class="wn" style="margin-top:9px">호흡 곤란·얼굴 부기·심한 구토가 있으면 즉시 병원에 가세요.</div>':'')+'</div>'
+(rs.length?'<div class="st">이 재료로 만드는 메뉴</div>'+rs.map(function(r){return rcard(r)}).join(''):'')
+'<button class="btn y" onclick="closeM()">닫기</button>';
document.getElementById('md').classList.add('on');document.body.style.overflow='hidden'}
function startObs(n){obs.push({id:'o'+Date.now(),n:n,dt:ymd(TD()),c:[0,0,0],m:'',done:0});save();askNoti();closeM();tab='food';render()}
function setF(n,s){tried[n]=tried[n]===s?null:s;if(!tried[n])delete tried[n];save();openF(n);render()}

/*========== 성장곡선 ==========*/
function vGrow(){var sx=baby.sex||'f',A=gArr(gK,sx),recs=grow.filter(function(g){return g[gK]!=null&&g[gK]!==''}).sort(function(a,b){return a.d<b.d?-1:1});
var last=recs.length?recs[recs.length-1]:null,prev=recs.length>1?recs[recs.length-2]:null,pc=null;
if(last){var m=Math.min(24,Math.max(0,ageMAt(last.d)));pc=pctOf(+last[gK],ipol(A.p3,m),ipol(A.p50,m),ipol(A.p97,m))}
return '<div class="cd"><b>📈 성장 기록</b><p class="mu" style="margin:5px 0 10px">몸무게를 기록하면 <b>체중 기반 영양 목표</b>가 자동 계산되고, WHO 성장곡선 위에 백분위가 표시됩니다.</p>'
+'<div class="fd" style="margin:0"><label>날짜</label><input id="grD" type="date" value="'+ymd(TD())+'"></div>'
+'<div class="rw" style="margin-top:8px"><div class="fd" style="flex:1;margin:0"><label>몸무게 kg</label><input id="grW" type="number" step="0.01" placeholder="8.2"></div><div class="fd" style="flex:1;margin:0"><label>키 cm</label><input id="grH" type="number" step="0.1" placeholder="70.5"></div><div class="fd" style="flex:1;margin:0"><label>머리둘레</label><input id="grC" type="number" step="0.1" placeholder="44"></div></div>'
+'<button class="btn" style="margin-top:10px" onclick="addGrow()">＋ 측정 기록 저장</button></div>'
+'<div class="tt">'+['w','h','c'].map(function(k){return '<button class="'+(gK===k?'on':'')+'" onclick="gK=\''+k+'\';render()">'+GN[k][0]+'</button>'}).join('')+'</div>'
+(last?'<div class="cd"><div class="rw" style="justify-content:space-between;align-items:center"><div><b style="font-size:19px">'+last[gK]+GN[gK][1]+'</b> <span class="mu">'+last.d+'</span>'
+(prev?'<div class="mu" style="font-size:11px">지난 기록('+prev.d+') 대비 <b style="color:'+(+last[gK]>=+prev[gK]?'#2E9C7D':'var(--rd)')+'">'+(+last[gK]-+prev[gK]>=0?'+':'')+rnd2(+last[gK]-+prev[gK])+GN[gK][1]+'</b></div>':'')+'</div>'
+'<div style="text-align:right"><span class="pill2" style="background:'+(pc<3||pc>97?'#FDEAE5':pc<15||pc>85?'#FFF6EC':'#E4F6F0')+';color:'+(pc<3||pc>97?'var(--rd)':pc<15||pc>85?'#B07C13':'#2E9C7D')+'">추정 '+(pc<1?'<1':pc>99?'>99':Math.round(pc))+' 백분위</span><div class="mu" style="font-size:10px;margin-top:3px">만 '+Math.floor(ageMAt(last.d))+'개월 · '+(sx==='m'?'남아':'여아')+'</div></div></div>'
+'<div class="mu" style="font-size:11px;margin-top:8px">'+(pc<3?'⚠️ 3 백분위 미만입니다. 성장 속도와 함께 소아과에서 확인해 보세요.':pc>97?'⚠️ 97 백분위를 넘습니다. 소아과에서 확인해 보세요.':pc<15?'하위 구간이지만 정상 범위입니다. 곡선을 따라 꾸준히 올라가는지가 더 중요해요.':pc>85?'상위 구간이지만 정상 범위입니다.':'정상 범위(3~97 백분위)에서 잘 자라고 있어요 👍')+'</div></div>':'<div class="cd mu">아직 '+GN[gK][0]+' 기록이 없어요.</div>')
+'<div class="cd" style="padding:10px">'+gChart(gK,sx)+'<div class="lgd" style="justify-content:center"><span><b style="background:#DCE9F7"></b>3~97 백분위</span><span><b style="background:#6E9FD4"></b>50 백분위</span><span><b style="background:var(--pd)"></b>우리 아기</span></div></div>'
+(recs.length?'<div class="st">측정 이력</div><div class="cd">'+recs.slice().reverse().map(function(g){var m2=Math.min(24,Math.max(0,ageMAt(g.d))),p=pctOf(+g[gK],ipol(A.p3,m2),ipol(A.p50,m2),ipol(A.p97,m2));
return '<div class="cb"><div style="flex:1"><b style="font-size:13.5px">'+g[gK]+GN[gK][1]+'</b> <span class="mu">'+g.d+' · 만 '+Math.floor(m2)+'개월</span></div><span class="mu">'+Math.round(p)+'%ile</span><button class="mu" style="font-size:15px;padding:0 4px" onclick="delGrow(\''+g.id+'\')">✕</button></div>'}).join('')+'</div>':'')
+'<div class="cd" style="background:#F3F6FA;font-size:11.5px"><b>성장곡선 읽는 법</b><ul style="margin:5px 0 0;padding-left:16px;color:var(--sub)"><li>한 시점의 백분위보다 <b>곡선을 따라 꾸준히 자라는지</b>가 중요합니다.</li><li>2개 이상의 백분위 구간을 급하게 벗어나면 소아과 상담을 권합니다.</li><li>모유수유아는 6개월 이후 체중 증가가 완만해지는 것이 자연스럽습니다.</li></ul><div style="margin-top:7px">'+sT('who')+sT('kdca')+'</div><div class="mu" style="font-size:10px;margin-top:5px">※ WHO 기준의 월별 근사값이며 머리둘레는 P50±2.6cm로 근사했습니다.</div></div>'}
function gChart(k,sx){var A=gArr(k,sx),W=320,H=210,L=34,R=8,Tp=10,B=24,recs=grow.filter(function(g){return g[k]!=null&&g[k]!==''});
var lo=A.p3[0],hi=A.p97[24];recs.forEach(function(g){var v=+g[k];if(v<lo)lo=v;if(v>hi)hi=v});
lo=Math.floor(lo-1);hi=Math.ceil(hi+1);
function X(m){return L+(W-L-R)*m/24}function Y(v){return Tp+(H-Tp-B)*(1-(v-lo)/(hi-lo))}
function line(a){return a.map(function(v,i){return (i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1)}).join(' ')}
var band=line(A.p97)+' '+A.p3.slice().reverse().map(function(v,i){return 'L'+X(24-i).toFixed(1)+' '+Y(v).toFixed(1)}).join(' ')+' Z';
var g='<svg class="gc" viewBox="0 0 '+W+' '+H+'"><rect width="'+W+'" height="'+H+'" fill="#fff"/>';
for(var t=0;t<=4;t++){var v=lo+(hi-lo)*t/4;g+='<line x1="'+L+'" y1="'+Y(v)+'" x2="'+(W-R)+'" y2="'+Y(v)+'" stroke="#F0E6DF"/><text x="'+(L-4)+'" y="'+(Y(v)+3.5)+'" font-size="8" fill="#8C8480" text-anchor="end">'+rnd(v)+'</text>'}
for(var mm=0;mm<=24;mm+=6){g+='<line x1="'+X(mm)+'" y1="'+Tp+'" x2="'+X(mm)+'" y2="'+(H-B)+'" stroke="#F7F1EC"/><text x="'+X(mm)+'" y="'+(H-B+13)+'" font-size="8" fill="#8C8480" text-anchor="middle">'+mm+'개월</text>'}
g+='<path d="'+band+'" fill="#DCE9F7" opacity=".55"/><path d="'+line(A.p50)+'" fill="none" stroke="#6E9FD4" stroke-width="1.8"/>';
g+='<path d="'+line(A.p3)+'" fill="none" stroke="#A9C4E0" stroke-width="1" stroke-dasharray="3 2"/><path d="'+line(A.p97)+'" fill="none" stroke="#A9C4E0" stroke-width="1" stroke-dasharray="3 2"/>';
var pts=recs.map(function(r){return {x:X(Math.min(24,Math.max(0,ageMAt(r.d)))),y:Y(+r[k])}}).sort(function(a,b){return a.x-b.x});
if(pts.length>1)g+='<path d="'+pts.map(function(p,i){return (i?'L':'M')+p.x.toFixed(1)+' '+p.y.toFixed(1)}).join(' ')+'" fill="none" stroke="#F2734B" stroke-width="2"/>';
pts.forEach(function(p){g+='<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="3.4" fill="#F2734B" stroke="#fff" stroke-width="1.4"/>'});
g+='<text x="'+(L+2)+'" y="'+(Tp+9)+'" font-size="9" font-weight="bold" fill="#3E3A38">'+GN[k][0]+' ('+GN[k][1]+') · '+(sx==='m'?'남아':'여아')+'</text></svg>';return g}
function addGrow(){var d=document.getElementById('grD').value,w=document.getElementById('grW').value,h=document.getElementById('grH').value,c=document.getElementById('grC').value;
if(!d)return alert('날짜를 선택해 주세요');if(!w&&!h&&!c)return alert('측정값을 하나 이상 입력해 주세요');
grow.push({id:'g'+Date.now(),d:d,w:w||null,h:h||null,c:c||null});save();render()}
function delGrow(id){if(!confirm('이 기록을 삭제할까요?'))return;grow=grow.filter(function(g){return g.id!==id});save();render()}

/*========== 기록 ==========*/
function vLog(){var by={};logs.slice().reverse().forEach(function(l){(by[l.d]=by[l.d]||[]).push(l)});
var si=IDS.indexOf(curS().id==='ready'?'early':curS().id),op=RCP().filter(function(r){return r.s===si}),D=todaySum(),T=TG();
return '<div class="cd" style="background:#FBF6F2"><b>오늘 요약</b><div class="rw" style="margin-top:6px"><div style="flex:1;text-align:center"><div class="mu" style="font-size:10px">이유식</div><b>'+D.cnt+'끼</b></div><div style="flex:1;text-align:center"><div class="mu" style="font-size:10px">수유</div><b>'+D.ml+'ml</b></div><div style="flex:1;text-align:center"><div class="mu" style="font-size:10px">열량</div><b>'+Math.round(D.f.kcal+D.m.kcal)+'</b></div><div style="flex:1;text-align:center"><div class="mu" style="font-size:10px">흡수철</div><b>'+rnd2(D.f.feAb+D.m.feAb)+'mg</b></div></div></div>'
+'<div class="cd"><b style="font-size:15px">📝 이유식 기록</b>'
+'<div class="fd" style="margin:12px 0 10px"><label>메뉴</label><input id="gN" list="gL" placeholder="메뉴명 입력 또는 선택"><datalist id="gL">'+op.map(function(r){return '<option>'+esc(r.n)+'</option>'}).join('')+'</datalist></div>'
+'<div class="rw"><div class="fd" style="flex:1;margin:0"><label>먹은 양(g)</label><input id="gA" type="number" placeholder="80"></div><div class="fd" style="flex:1;margin:0"><label>시간</label><select id="gT">'+SLOTS().concat(['간식']).map(function(s){return '<option>'+s+'</option>'}).join('')+'</select></div></div>'
+'<div class="fd" style="margin:12px 0 10px"><label>반응</label><div class="ch">'+['😋','😐','😖'].map(function(x){return '<button class="'+(lRx===x?'on':'')+'" onclick="lRx=\''+x+'\';render()">'+x+'</button>'}).join('')+'</div></div>'
+'<button class="btn" onclick="addLog()">이유식 기록 저장</button>'
+'<div class="hr"></div><div class="rw"><div class="fd" style="flex:1;margin:0"><label>🍼 수유(ml)</label><input id="mV" type="number" value="'+(baby.vol||180)+'"></div><div class="fd" style="flex:1;margin:0"><label>종류</label><select id="mT"><option value="f" '+(MTYPE()==='f'?'selected':'')+'>분유</option><option value="b" '+(MTYPE()==='b'?'selected':'')+'>모유</option></select></div></div>'
+'<button class="btn g s" style="margin-top:9px" onclick="addMilk2()">＋ 수유 기록 추가</button></div>'
+'<div class="st">지난 기록 '+(logs.length?'('+logs.length+')':'')+'</div>'
+(logs.length?Object.keys(by).map(function(d){var s={kcal:0,p:0,fe:0,ca:0,zn:0,feAb:0},ml=0;
by[d].forEach(function(l){if(l.k==='milk'){ml+=+l.ml||0;var n=milkNut(+l.ml||0,l.mt||MTYPE());NK.forEach(function(k){s[k]+=n[k]});s.feAb+=n.feAb}else{NK.forEach(function(k){s[k]+=(l.nu&&l.nu[k])||0});s.feAb+=(l.nu&&l.nu.feAb)||0}});
return '<div class="cd"><div class="rw" style="justify-content:space-between"><b style="font-size:13px;color:var(--pd)">'+d+'</b><span class="mu" style="font-size:10px">'+Math.round(s.kcal)+'kcal('+Math.round(s.kcal/T.day.kcal*100)+'%) · 흡수철 '+rnd2(s.feAb)+'mg · 수유 '+ml+'ml</span></div>'+by[d].map(function(l){
return '<div class="lg2"><div style="font-size:19px">'+(l.k==='milk'?'🍼':l.rx||'🍲')+'</div><div style="flex:1"><b style="font-size:13.5px">'+esc(l.n)+'</b><div class="mu" style="font-size:10px">'+(l.t||'')+(l.a?' · '+l.a+'g':'')+(l.nu?' · 흡수철 '+rnd2(l.nu.feAb||0)+'mg':'')+'</div></div><button class="mu" style="font-size:16px;padding:2px 6px" onclick="delLog(\''+l.id+'\')">✕</button></div>'}).join('')+'</div>'}).join('')
:'<div class="cd mu">아직 기록이 없어요.</div>')
+(logs.length?'<button class="btn y s" onclick="csv()">CSV로 내보내기</button>':'')}
function addMilk2(){var v=+document.getElementById('mV').value,t=document.getElementById('mT').value;if(!v)return alert('수유량을 입력해 주세요');
logs.push({id:''+Date.now(),d:fmt(TD()),k:'milk',ml:v,mt:t,n:MILK[t].n+' '+v+'ml',t:'수유'});save();render()}
function addLog(){var n=document.getElementById('gN').value.trim();if(!n)return alert('메뉴명을 입력해 주세요');
var r=null;RCP().forEach(function(x){if(x.n===n)r=x});var amt=document.getElementById('gA').value,nu=r?nutOf(r).t:null;
if(nu&&amt){var base=0;(r.g||[]).forEach(function(x){base+=gOf(x)});base=base/(r.sv||1);
if(base>0){var f=amt/base,n2={};NK.forEach(function(k){n2[k]=nu[k]*f});n2.feAb=nu.feAb*f;n2.vc=nu.vc*f;nu=n2}}
logs.push({id:''+Date.now(),d:fmt(TD()),n:n,a:amt,t:document.getElementById('gT').value,rx:lRx,nu:nu});save();render()}
function qLog(id){var r=getR(id);logs.push({id:''+Date.now(),d:fmt(TD()),n:r.n,a:'',t:'식사',rx:'😋',nu:nutOf(r).t});save();closeM();tab='home';render()}
function delLog(id){logs=logs.filter(function(l){return l.id!==id});save();render()}
function csv(){var s='날짜,구분,시간,메뉴,양,반응,열량,단백질,철,흡수철,칼슘,아연\n'+logs.map(function(l){var n=l.nu||(l.k==='milk'?milkNut(+l.ml||0,l.mt||'f'):{});
return [l.d,(l.k==='milk'?'수유':'이유식'),l.t||'','"'+l.n+'"',(l.k==='milk'?l.ml+'ml':(l.a||'')+'g'),l.rx||'',rnd(n.kcal||0),rnd(n.p||0),rnd(n.fe||0),rnd2(n.feAb||0),rnd(n.ca||0),rnd(n.zn||0)].join(',')}).join('\n');
var g='\n\n날짜,몸무게kg,키cm,머리둘레cm\n'+grow.map(function(x){return [x.d,x.w||'',x.h||'',x.c||''].join(',')}).join('\n');
dl(new Blob(['\ufeff'+s+g],{type:'text/csv'}),baby.name+'_이유식_성장기록.csv')}
function dl(b,fn){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=fn;a.click()}

/*========== 정보 ==========*/
function vInfo(){var T=TG(),dri=T.dri;
return '<div class="cd"><b>⚙️ 식사·수유 설정</b>'
+'<div class="fd" style="margin:10px 0 0"><label>하루 이유식 끼니 수</label><select onchange="baby.meals=+this.value;todaySel=null;plan=null;save();render()">'+[1,2,3].map(function(n){return '<option value="'+n+'" '+(MEALS()===n?'selected':'')+'>'+n+'끼</option>'}).join('')+'</select></div>'
+'<div class="fd" style="margin:10px 0 0"><label>수유 방식 (영양 계산 기준)</label><select onchange="baby.feed=this.value;save();render()">'+[['f','분유 위주'],['b','모유 위주'],['m','혼합']].map(function(x){return '<option value="'+x[0]+'" '+(baby.feed===x[0]?'selected':'')+'>'+x[1]+'</option>'}).join('')+'</select></div>'
+'<div class="fd" style="margin:10px 0 0"><label>성별 (성장곡선)</label><select onchange="baby.sex=this.value;save();render()">'+[['f','여아'],['m','남아']].map(function(x){return '<option value="'+x[0]+'" '+(baby.sex===x[0]?'selected':'')+'>'+x[1]+'</option>'}).join('')+'</select></div>'
+'<div class="fd" style="margin:10px 0 0"><label>기본 1회 수유량 (ml)</label><input type="number" value="'+(baby.vol||180)+'" oninput="baby.vol=+this.value;save()"></div>'
+'<div class="fd" style="margin:10px 0 0"><label>영양 목표 기준</label><select onchange="baby.useW=+this.value;save();render()"><option value="1" '+(baby.useW!==0?'selected':'')+'>우리 아기 체중 기준(권장)</option><option value="0" '+(baby.useW===0?'selected':'')+'>표준 기준</option></select></div></div>'
+'<div class="cd" style="background:#F3F6FA"><b>🧮 지금 적용 중인 영양 계산 기준</b>'
+'<table class="tb" style="margin-top:7px"><tr><th></th><th>열량</th><th>단백질</th><th>철</th><th>칼슘</th><th>아연</th></tr>'
+'<tr><td>표준('+dri.lb+')</td><td>'+dri.kcal+'</td><td>'+dri.p+'</td><td>'+dri.fe+'</td><td>'+dri.ca+'</td><td>'+dri.zn+'</td></tr>'
+'<tr><td>적용 목표</td><td><b>'+Math.round(T.day.kcal)+'</b></td><td><b>'+rnd(T.day.p)+'</b></td><td><b>'+T.day.fe+'</b></td><td><b>'+T.day.ca+'</b></td><td><b>'+T.day.zn+'</b></td></tr>'
+'<tr><td>이유식 담당('+Math.round(T.sf*100)+'%)</td><td>'+Math.round(T.solid.kcal)+'</td><td>'+rnd(T.solid.p)+'</td><td>'+rnd(T.solid.fe)+'</td><td>'+Math.round(T.solid.ca)+'</td><td>'+rnd(T.solid.zn)+'</td></tr></table>'
+'<div class="mu" style="font-size:11px;margin-top:7px">'+(T.use?'몸무게 <b>'+T.w+'kg × '+dri.ekg+'kcal/kg</b>으로 열량, <b>× '+dri.pkg+'g/kg</b>으로 단백질을 계산했습니다.':'몸무게 미입력 또는 표준 기준 선택 상태입니다.')+' 철·칼슘·아연은 체중과 무관하게 표준값을 사용합니다.</div>'
+'<div class="mu" style="font-size:11px;margin-top:5px"><b>철분 흡수 목표 '+rnd2(T.feAb)+'mg</b> — 권장량 '+T.day.fe+'mg은 흡수율 약 10%를 가정한 값이므로, 실제 흡수되어야 하는 양은 그 10%입니다.</div>'
+'<div style="margin-top:7px">'+sT('kdri')+sT('fe')+'</div></div>'
+'<div class="cd" style="background:#FFF6EC"><b>📖 이유식 기본 원칙</b><p class="mu" style="margin:6px 0 0;font-size:11px">널리 알려진 소아과적 원칙과 공공 지침을 정리한 내용입니다. 책 문장을 그대로 옮긴 것이 아니므로 원서와 담당 소아과에서 확인해 주세요.</p></div>'
+RL.map(function(r,i){return '<div class="cd"><b style="font-size:14px">'+(i+1)+'. '+r[0]+'</b><p class="mu" style="margin:5px 0 7px">'+r[2]+'</p>'+r[1].map(sT).join('')+'</div>'}).join('')
+'<div class="st">단계별 요약</div><div class="cd" style="font-size:12.5px">'+STG.slice(1).map(function(s){return '<div style="padding:8px 0;border-bottom:1px solid var(--ln)"><b style="color:'+(s.c==='#FFC861'?'#B07C13':s.c)+'">'+s.n+' · '+s.lb+'</b><div class="mu" style="font-size:11.5px">'+s.ra+' · '+s.ct+' · '+s.am+' · 이유식이 하루 영양의 약 '+Math.round(s.sf*100)+'% 담당</div></div>'}).join('')+'<div class="mu" style="font-size:10.5px;margin-top:6px">※ 담당 비중은 일반적 수유량을 감안한 앱의 계산 기준입니다.</div></div>'
+'<div class="st">전체 출처</div><div class="cd">'+Object.keys(SRC).map(function(k){return '<div style="padding:8px 0;border-bottom:1px solid var(--ln)"><span class="tg v">'+SRC[k].t+'</span><b style="display:block;font-size:13px;margin:3px 0">'+SRC[k].n+'</b><div class="mu" style="font-size:11.5px">'+SRC[k].d+'</div><a style="font-size:11px" href="'+SRC[k].u+'" target="_blank" rel="noopener">'+SRC[k].u+'</a></div>'}).join('')+'</div>'
+'<div class="st">백업 · 아빠 폰 공유</div><div class="cd"><p class="mu" style="margin:0 0 10px">백업 파일을 카톡으로 보내고 상대 폰에서 불러오면 모든 데이터(성장기록 포함)가 옮겨집니다.</p><button class="btn g s" onclick="expJ()">⬇ 백업 내보내기 (.json)</button><button class="btn g s" style="margin-top:8px" onclick="document.getElementById(\'fj\').click()">⬆ 백업 불러오기</button></div>'
+'<div class="st">아기 정보</div><div class="cd"><div class="ir"><span>이름</span><b>'+esc(baby.name)+'</b></div><div class="ir"><span>생일</span><b>'+fmt(d0(baby.birth))+'</b></div><div class="ir"><span>나이</span><b>'+ageT()+'</b></div><div class="ir"><span>최근 체중</span><b>'+(T.w?T.w+'kg':'미입력')+'</b></div>'
+'<button class="btn g s" style="margin-top:12px" onclick="editBaby()">아기 정보 수정</button><button class="btn y s" style="margin-top:8px" onclick="resetAll()">전체 초기화</button></div>'
+'<p class="mu" style="text-align:center;font-size:10.5px;margin:14px 6px 0">본 앱은 의료 행위를 대체하지 않습니다. 영양·알레르기·성장 판단은 담당 소아과와 상의하세요.</p>'}
function expJ(){dl(new Blob([JSON.stringify({v:6,baby:baby,logs:logs,tried:tried,my:myR,cubes:cubes,ov:ov,ph:ph,plan:plan,obs:obs,fav:fav,grow:grow})],{type:'application/json'}),baby.name+'_이유식노트_백업.json')}
function editBaby(){var n=prompt('아기 이름',baby.name);if(n===null)return;var b=prompt('생년월일 (YYYY-MM-DD)',baby.birth);if(b===null)return;
if(isNaN(d0(b)))return alert('날짜 형식 오류');baby.name=n.trim()||baby.name;baby.birth=b;todaySel=null;plan=null;save();render()}
function resetAll(){if(!confirm('모든 데이터가 삭제됩니다. 계속할까요?'))return;for(var k in KY)localStorage.removeItem(KY[k]);location.reload()}

/*========== 이벤트 · 시작 ==========*/
document.getElementById('nv').addEventListener('click',function(e){var b=e.target.closest('button');if(b&&b.dataset.t){tab=b.dataset.t;render()}});
document.getElementById('fi').addEventListener('change',function(e){var f=e.target.files[0];if(!f)return;var rd=new FileReader();
rd.onload=function(ev){var im=new Image();im.onload=function(){var W=340,sc=W/im.width,cv=document.createElement('canvas');
cv.width=W;cv.height=Math.round(im.height*sc);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);
ph[phT]=cv.toDataURL('image/jpeg',.6);save();if(curR)document.getElementById('mb').innerHTML=rBody();render()};im.src=ev.target.result};
rd.readAsDataURL(f);e.target.value=''});
document.getElementById('fj').addEventListener('change',function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();
r.onload=function(ev){try{var d=JSON.parse(ev.target.result);if(!confirm('현재 데이터를 덮어씁니다. 계속할까요?'))return;
baby=d.baby||baby;logs=d.logs||[];tried=d.tried||{};myR=d.my||[];cubes=d.cubes||[];ov=d.ov||{};ph=d.ph||{};plan=d.plan||null;obs=d.obs||[];fav=d.fav||{};grow=d.grow||[];
save();alert('불러오기 완료!');boot()}catch(err){alert('파일을 읽을 수 없습니다.')}};r.readAsText(f);e.target.value=''});
boot();
