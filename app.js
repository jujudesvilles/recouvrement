// ═══════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════
const DEFAULT_CFG = {
  team_name:'Matera', team_sub:'· Recouvrement',
  from_email:'bonjour@matera.eu',
  front_inbox:'Recouvrement - impayés matera',
  front_inbox_id:'inb_5zds6',
  stale_days:5,
  current_user:'Julien Leclere',
  members:[
    {name:'Julien Leclere',email:'julien.leclere@matera.eu',initials:'JL',role:'admin'},
    {name:'Sophie Carouge',email:'sophie.carouge@matera.eu',initials:'SC',role:'juriste'},
    {name:'Thomas Remi',email:'thomas.remi@matera.eu',initials:'TR',role:'juriste'},
    {name:'Léa Martin',email:'lea.martin@matera.eu',initials:'LM',role:'juriste'},
    {name:'Antoine Brun',email:'antoine.brun@matera.eu',initials:'AB',role:'juriste'},
    {name:'Chloé Faure',email:'chloe.faure@matera.eu',initials:'CF',role:'juriste'},
    {name:'Nadia Osei',email:'nadia.osei@matera.eu',initials:'NO',role:'juriste'},
  ],
  cabinets:[
    {name:'Guérin & Associés',email:'contact@guerin-avocats.fr',avocat:'Me Guérin'},
    {name:'Cabinet Wolff',email:'wolff@cabinet-wolff.fr',avocat:'Me Wolff'},
    {name:'Cabinet Dulac',email:'dulac@cabinet-dulac.fr',avocat:'Me Dulac'},
    {name:'Cabinet Letu',email:'letu@cabinet-letu.fr',avocat:'Me Letu'},
  ],
};
function getCFG(){try{const s=localStorage.getItem('mtr_cfg');return s?{...DEFAULT_CFG,...JSON.parse(s)}:DEFAULT_CFG}catch{return DEFAULT_CFG}}
function saveCFG(){localStorage.setItem('mtr_cfg',JSON.stringify(CFG))}
let CFG=getCFG();

// ═══════════════════════════════════════════════════════════════════
// COLUMNS  (emailOnEnter = email triggered when card enters this col)
// ═══════════════════════════════════════════════════════════════════
const COLS=[
  {id:'avocat_a_saisir', label:'Avocat à saisir',    dot:'#A2A1AF', emailOnEnter:null},
  {id:'devis_attendu',   label:'Devis attendu',      dot:'#955804', emailOnEnter:'demande_devis'},
  {id:'devis_recu',      label:'Devis reçu',         dot:'#206E92', emailOnEnter:null},
  {id:'validation_cs',   label:'Validation CS',      dot:'#4E49FC', emailOnEnter:'validation_devis'},
  {id:'pieces_a_envoyer',label:'Pièces à envoyer',   dot:'#13762C', emailOnEnter:'devis_valide_pcs'},
  {id:'procedure_cours', label:'Procédure en cours', dot:'#206E92', emailOnEnter:'pieces_avocat'},
  {id:'assignation',     label:'Assignation',        dot:'#4E49FC', emailOnEnter:'assignation'},
  {id:'decision',        label:'Décision rendue',    dot:'#13762C', emailOnEnter:'decision'},
  {id:'clos',            label:'Clôturé',            dot:'#A2A1AF', emailOnEnter:'cloture'},
];

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════
let DOSSIERS=JSON.parse(localStorage.getItem('mtr_dos')||'null')||[
  {id:1,copro:'SDC 15 bd Mazarine',debiteur:'M. Martin Boninot',pcs_nom:'M. Dupont',pcs_email:'dupont@sdc-mazarine.fr',cabinet:'Guérin & Associés',avocat:'Me Guérin',cab_email:'contact@guerin-avocats.fr',procedure:'Action au fond',dette:3840,frais:150,devis:850,col:'devis_recu',juriste:'Sophie Carouge',conv_id:'cnv_fucfldy',age:5,
   pieces:['PV AG 2024','Appels de fonds × 6','MeD LRAR 15/02','MeD avocat 10/03'],
   tl:[{d:'14/03',t:'Dossier créé',ok:true,a:'Sys.'},{d:'18/03',t:'Transmis à Me Guérin',ok:true,a:'SC'},{d:'22/03',t:'Devis reçu : 850 € HT',ok:true,a:'Me Guérin'},{d:'En attente',t:'Envoyer au CS pour validation',ok:false}],
   j:[{ts:'14/03 09h',a:'Sys.',txt:'Dossier créé + email PCS',em:true,et:'ouverture'},{ts:'22/03 14h',a:'Me Guérin',txt:'Devis 850€ soumis portail',em:false}]},
  {id:2,copro:'SDC Résidence les Oiseaux',debiteur:'M. Jean Delorme',pcs_nom:'Mme Petit',pcs_email:'petit@res-oiseaux.fr',cabinet:'Cabinet Wolff',avocat:'Me Wolff',cab_email:'wolff@cabinet-wolff.fr',procedure:'Référé 19-2',dette:5200,frais:150,devis:1200,col:'procedure_cours',juriste:'Sophie Carouge',conv_id:'',age:2,
   pieces:['PV AG 2023','PV AG 2024','Appels de fonds × 8','MeD LRAR','MeD avocat','PV conciliation'],
   tl:[{d:'02/03',t:'Dossier créé',ok:true,a:'SC'},{d:'10/03',t:'Devis validé CS 1 200€',ok:true,a:'CS Petit'},{d:'15/03',t:'Pièces + conf. avocat',ok:true,a:'SC'},{d:'28/03',t:'Assignation TJ Paris',ok:true,a:'Me Wolff'},{d:'~10/05',t:'Audience',ok:false}],
   j:[{ts:'02/03',a:'SC',txt:'Dossier créé + email PCS',em:true,et:'ouverture'},{ts:'10/03',a:'CS Petit',txt:'Devis validé via lien',em:true,et:'devis_valide_pcs'},{ts:'15/03',a:'SC',txt:'Pièces envoyées + email PCS',em:true,et:'pieces_avocat'},{ts:'28/03',a:'Me Wolff',txt:'Assignation déposée',em:true,et:'assignation'}]},
  {id:3,copro:'SDC Lavilla',debiteur:'SCI DUPONT',pcs_nom:'M. Lara',pcs_email:'lara@sdc-lavilla.fr',cabinet:'',avocat:'',cab_email:'',procedure:'Injonction de payer',dette:1750,frais:150,devis:null,col:'avocat_a_saisir',juriste:'Thomas Remi',conv_id:'',age:8,
   pieces:['PV AG 2024','Appels de fonds × 3','MeD LRAR 20/02'],
   tl:[{d:'20/03',t:'Dossier créé',ok:true,a:'TR'},{d:'En attente',t:'Choisir un cabinet',ok:false}],
   j:[{ts:'20/03',a:'TR',txt:'Dossier créé + email PCS',em:true,et:'ouverture'}]},
  {id:4,copro:'SDC 9 av. Tolbiac',debiteur:'SCI Mouquets',pcs_nom:'M. Bernard',pcs_email:'bernard@sdc-tolbiac.fr',cabinet:'Cabinet Dulac',avocat:'Me Dulac',cab_email:'dulac@cabinet-dulac.fr',procedure:'Saisie bancaire',dette:8900,frais:150,devis:1800,col:'assignation',juriste:'Léa Martin',conv_id:'',age:3,
   pieces:['Titre exécutoire','PV AG 2022-2024','Appels de fonds × 12','MeD × 3'],
   tl:[{d:'15/01',t:'Assignation déposée',ok:true,a:'Me Dulac'},{d:'12/04',t:'Audience validation',ok:false}],
   j:[{ts:'10/01',a:'LM',txt:'Dossier créé',em:true,et:'ouverture'},{ts:'28/01',a:'CS Bernard',txt:'Devis validé',em:true,et:'devis_valide_pcs'}]},
  {id:5,copro:'SDC 143 rue des Écoles',debiteur:'Indivision Lebrun',pcs_nom:'Mme Choi',pcs_email:'choi@sdc-ecoles.fr',cabinet:'Guérin & Associés',avocat:'Me Guérin',cab_email:'contact@guerin-avocats.fr',procedure:'Action au fond',dette:2300,frais:150,devis:null,col:'devis_attendu',juriste:'Sophie Carouge',conv_id:'',age:6,
   pieces:['PV AG 2024','Appels de fonds × 4','MeD LRAR 01/03'],
   tl:[{d:'25/03',t:'Dossier créé + devis demandé',ok:true,a:'SC'},{d:'En attente',t:'Réception devis avocat',ok:false}],
   j:[{ts:'25/03',a:'SC',txt:'Dossier créé + email PCS + email avocat devis',em:true,et:'ouverture'}]},
  {id:6,copro:'SDC Parisdedans',debiteur:'Indivision Linat',pcs_nom:'M. Faure',pcs_email:'faure@sdc-paris.fr',cabinet:'Cabinet Wolff',avocat:'Me Wolff',cab_email:'wolff@cabinet-wolff.fr',procedure:'Action au fond',dette:4100,frais:150,devis:950,col:'validation_cs',juriste:'Thomas Remi',conv_id:'',age:3,
   pieces:['PV AG 2023','PV AG 2024','Appels de fonds × 7','MeD LRAR','MeD avocat'],
   tl:[{d:'01/03',t:'Dossier créé',ok:true,a:'TR'},{d:'08/03',t:'Devis reçu 950€',ok:true,a:'Me Wolff'},{d:'09/03',t:'Lien validation envoyé CS',ok:true,a:'Sys.'},{d:'En attente',t:'Validation CS',ok:false}],
   j:[{ts:'01/03',a:'TR',txt:'Dossier créé + email PCS',em:true,et:'ouverture'},{ts:'09/03',a:'Sys.',txt:'Lien validation devis → CS',em:true,et:'validation_devis'}]},
];
function saveD(){localStorage.setItem('mtr_dos',JSON.stringify(DOSSIERS))}

let selId=null, dragId=null, sq='';
const fmt=n=>n!=null?parseInt(n).toLocaleString('fr-FR'):'—';
const now=()=>new Date().toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'})+' '+new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
const ini=name=>name.split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase();
const me=()=>CFG.current_user;
// Ouvre Front en mode composition + copie le corps dans le presse-papier
function sendToFront(to,subj,body,logId,logType){
  // 1. Copier le corps dans le presse-papier
  navigator.clipboard.writeText(body).catch(()=>{});
  // 2. Ouvrir Front compose (URL officielle Front)
  const frontUrl='https://app.frontapp.com/compose?to='+encodeURIComponent(to)+'&subject='+encodeURIComponent(subj);
  window.open(frontUrl,'_blank');
  // 3. Logger si demandé
  if(logId&&logType)logE(logType,logId);
  showToast('Front ouvert · Corps copié dans le presse-papier ✓');
}

// ═══════════════════════════════════════════════════════════════════
// EMAIL TEMPLATES
// ═══════════════════════════════════════════════════════════════════
const SUBJ={
  ouverture:d=>`Ouverture procédure judiciaire — ${d.copro}`,
  demande_devis:d=>`Demande de devis — ${d.copro} / ${d.debiteur}`,
  validation_devis:d=>`✅ Validation requise — Honoraires avocat · ${d.copro}`,
  devis_valide_pcs:d=>`Devis validé — Procédure en cours · ${d.copro}`,
  pieces_avocat:d=>`Dossier complet transmis — ${d.copro} / ${d.debiteur}`,
  assignation:d=>`Assignation déposée · ${d.copro}`,
  decision:d=>`Décision de justice rendue · ${d.copro}`,
  cloture:d=>`Dossier clôturé · ${d.copro}`,
};
const BODY={
  ouverture:d=>`Bonjour ${d.pcs_nom},

Suite aux démarches amiables restées sans effet, Matera a engagé une procédure judiciaire « ${d.procedure} » pour recouvrer les charges impayées de ${d.debiteur}.

• Montant de la dette : ${fmt(d.dette)} €
• Cabinet mandaté : ${d.cabinet||'en cours de sélection'}

Vous recevrez prochainement une convention d'honoraires à valider. Aucune démarche n'est requise de votre part.

Bien cordialement,
${d.juriste} — Équipe juridique Matera
${CFG.from_email}`,

  demande_devis:d=>`Maître,

Nous souhaitons vous mandater pour le dossier suivant :

• Copropriété : ${d.copro}
• Débiteur : ${d.debiteur}
• Montant de la dette : ${fmt(d.dette)} €
• Procédure envisagée : ${d.procedure}
• Pièces disponibles : ${(d.pieces||[]).join(', ')}

Pourriez-vous nous soumettre votre convention d'honoraires ?

Bien cordialement,
${d.juriste} — Matera`,

  validation_devis:d=>{
    const exp=new Date(Date.now()+(15*24*60*60*1000)).toISOString().slice(0,10);
    const token=btoa(d.id+'|'+exp).replace(/=/g,'');
    return `Bonjour ${d.pcs_nom},

Nous avons reçu la convention d'honoraires de ${d.cabinet} pour la procédure concernant ${d.debiteur}.

━━━━━━━━━━━━━━━━━━━━━━━
RÉCAPITULATIF
• Débiteur : ${d.debiteur}
• Procédure : ${d.procedure}
• Dette : ${fmt(d.dette)} €
• Honoraires proposés : ${fmt(d.devis)} € HT
━━━━━━━━━━━━━━━━━━━━━━━

👉 Valider ou refuser (lien valable 15 jours, expire le ${exp}) :
→ https://app.matera.eu/cs/validate/${token}

Bien cordialement,
${d.juriste} — Équipe juridique Matera
${CFG.from_email}`;
  },

  devis_valide_pcs:d=>`Bonjour ${d.pcs_nom},

Votre validation a bien été enregistrée. La convention d'honoraires de ${fmt(d.devis)} € HT avec ${d.cabinet} est confirmée.

Prochaine étape : nous transmettons les pièces à l'avocat pour préparer l'assignation. Nous vous tiendrons informé.

Bien cordialement,
${d.juriste} — Équipe juridique Matera
${CFG.from_email}`,

  pieces_avocat:d=>`Maître,

Suite à la validation de la convention d'honoraires par ${d.pcs_nom}, voici les pièces du dossier.

• Copropriété : ${d.copro}
• Débiteur : ${d.debiteur}
• Dette : ${fmt(d.dette)} €  |  Procédure : ${d.procedure}

PIÈCES JOINTES :
${(d.pieces||[]).map(p=>'• '+p).join('\n')}

Vous pouvez à présent préparer l'assignation.

Bien cordialement,
${d.juriste} — Matera`,

  assignation:d=>`Bonjour ${d.pcs_nom},

L'assignation a été déposée au tribunal par ${d.avocat} dans le dossier ${d.debiteur}.

Une date d'audience sera fixée prochainement. Nous vous la communiquerons dès que possible.

Bien cordialement,
${d.juriste} — Équipe juridique Matera`,

  decision:d=>`Bonjour ${d.pcs_nom},

Le tribunal a rendu sa décision dans l'affaire ${d.debiteur}. Nous vous communiquons les détails et les suites à donner sous peu.

Bien cordialement,
${d.juriste} — Équipe juridique Matera`,

  cloture:d=>`Bonjour ${d.pcs_nom},

Le dossier de recouvrement concernant ${d.debiteur} est clôturé.

• Dette initiale : ${fmt(d.dette)} €
• Frais engagés : ${fmt((d.devis||0)+d.frais)} €

N'hésitez pas à nous contacter.

Bien cordialement,
${d.juriste} — Équipe juridique Matera`,
};

function eTo(type,d){return ['demande_devis','pieces_avocat'].includes(type)?d.cab_email||'avocat@cabinet.fr':d.pcs_email||'pcs@sdc.fr'}
function eToL(type,d){return ['demande_devis','pieces_avocat'].includes(type)?(d.avocat||d.cabinet):(d.pcs_nom)}

// ═══════════════════════════════════════════════════════════════════
// NAV
// ═══════════════════════════════════════════════════════════════════
function goTab(id,el){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));el.classList.add('on');
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));
  document.getElementById('page-'+id).classList.add('on');
  if(id==='settings')renderSettings();
  if(id==='list')renderList();
  if(id==='dashboard')renderDash();
  closeSlide();
}

// ═══════════════════════════════════════════════════════════════════
// KANBAN
// ═══════════════════════════════════════════════════════════════════
function renderBoard(){
  const board=document.getElementById('board');
  const jf=document.getElementById('jur-filter').value;
  let data=DOSSIERS.filter(d=>!sq||(d.copro+d.debiteur+d.cabinet).toLowerCase().includes(sq.toLowerCase()));
  if(jf) data=data.filter(d=>d.juriste===jf);
  const urgent=data.filter(d=>['devis_recu','pieces_a_envoyer','avocat_a_saisir','decision'].includes(d.col)).length;
  const stale=data.filter(d=>d.age>=CFG.stale_days&&d.col!=='clos').length;
  document.getElementById('s-tot').textContent=data.length;
  document.getElementById('s-urg').textContent=urgent;
  document.getElementById('s-stl').textContent=stale;
  board.innerHTML=COLS.map(col=>{
    const cards=data.filter(d=>d.col===col.id);
    return `<div class="col">
      <div class="col-hd"><div class="cdot" style="background:${col.dot}"></div><div class="ctitle">${col.label}</div><div class="ccnt">${cards.length}</div></div>
      <div class="col-body" id="col-${col.id}"
        ondragover="ev.preventDefault()"
        ondragenter="onDE(event,'${col.id}')"
        ondragleave="onDL(event,'${col.id}')"
        ondrop="onDrop(event,'${col.id}')">
        ${cards.map(d=>cardHTML(d)).join('')}
      </div></div>`;
  }).join('');
  // Fix ondragover
  document.querySelectorAll('.col-body').forEach(c=>{
    c.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move'});
  });
}
function doSearch(v){sq=v;renderBoard()}

function cardHTML(d){
  const od=d.age>=CFG.stale_days&&d.col!=='clos';
  const ec=d.j.filter(j=>j.em).length;
  return `<div class="kc${od?' overdue':''}" id="kc-${d.id}" draggable="true"
    ondragstart="onDS(event,${d.id})" ondragend="onDE2(event)"
    onclick="openSlide(${d.id})">
    ${od?`<div class="pbadge">${d.age}</div>`:''}
    <div class="kc-copro">${d.copro}</div>
    <div class="kc-deb">${d.debiteur}</div>
    <div class="kc-row">
      <div class="kc-dette">${fmt(d.dette)} €</div>
      ${d.conv_id?`<div class="tag tag-f" onclick="event.stopPropagation();showToast('Ouverture ${d.conv_id} dans Front…')" title="Voir dans Front"><span class="mdi mdi-open-in-new" style="font-size:10px"></span>Front</div>`:''}
      ${ec?`<div class="tag tag-em"><span class="mdi mdi-email-check-outline" style="font-size:10px"></span>${ec}</div>`:''}
      ${od?`<div class="tag tag-od">${d.age}j</div>`:''}
      <div class="kc-age"><span class="mdi mdi-clock-outline" style="font-size:10px"></span>${d.age}j</div>
      <div class="kc-jur" title="${d.juriste}">${ini(d.juriste)}</div>
    </div></div>`;
}

// ═══════════════════════════════════════════════════════════════════
// DRAG & DROP
// ═══════════════════════════════════════════════════════════════════
function onDS(e,id){
  dragId=id;
  setTimeout(()=>{const el=document.getElementById('kc-'+id);if(el)el.classList.add('dragging')},0);
  e.dataTransfer.effectAllowed='move';
}
function onDE2(){document.querySelectorAll('.kc').forEach(c=>c.classList.remove('dragging'))}
function onDE(e,colId){const el=document.getElementById('col-'+colId);if(el)el.classList.add('dov')}
function onDL(e,colId){
  const el=document.getElementById('col-'+colId);
  if(el&&!el.contains(e.relatedTarget))el.classList.remove('dov');
}
function onDrop(e,colId){
  e.preventDefault();
  document.querySelectorAll('.col-body').forEach(c=>c.classList.remove('dov'));
  if(!dragId)return;
  const d=DOSSIERS.find(x=>x.id===dragId);
  if(!d||d.col===colId){dragId=null;return}
  const prevCol=d.col;
  d.col=colId; d.age=0;
  const col=COLS.find(c=>c.id===colId);
  if(col.emailOnEnter){
    showEmailBanner(d,col.emailOnEnter,prevCol);
  } else {
    d.j.push({ts:now(),a:me(),txt:`Déplacé → "${col.label}"`,em:false});
  }
  saveD();renderBoard();
  if(selId===dragId)openSlide(dragId);
  dragId=null;
}

// ═══════════════════════════════════════════════════════════════════
// EMAIL BANNER (on stage change)
// ═══════════════════════════════════════════════════════════════════
function showEmailBanner(d,type,prevCol){
  const to=eTo(type,d),toL=eToL(type,d);
  const subj=SUBJ[type]?SUBJ[type](d):'',body=BODY[type]?BODY[type](d):'';
  const col=COLS.find(c=>c.id===d.col);
  // Stocker dans globals pour l'onclick du banner
  window._bannerTo=to; window._bannerSubj=subj; window._bannerBody=body;
  window._bannerId=d.id; window._bannerType=type; window._bannerPrev=prevCol;
  d.j.push({ts:now(),a:'Sys.',txt:`Email "${type}" → ${toL}`,em:true,et:type});
  document.getElementById('etb-zone').innerHTML=`<div class="etb">
    <span class="mdi mdi-email-fast-outline"></span>
    <div class="etb-body">
      <div class="etb-t">Email auto déclenché → <em>${col.label}</em></div>
      <div style="font-size:11px;color:var(--sub)">À : <strong>${toL}</strong> · ${subj}</div>
      <div class="etb-acts">
        <button class="mbtn" style="font-size:11px;padding:4px 10px" onclick="sendToFront(window._bannerTo,window._bannerSubj,window._bannerBody);confirmEmail(window._bannerId,window._bannerType)"><span class="mdi mdi-open-in-new"></span>Ouvrir dans Front</button>
        <button class="btn bde bsm" onclick="blockEmail(window._bannerId,window._bannerPrev)"><span class="mdi mdi-cancel"></span>Bloquer</button>
        <button class="btn bgh bsm" onclick="document.getElementById('etb-zone').innerHTML=''"><span class="mdi mdi-close"></span></button>
      </div>
    </div></div>`;
}
function confirmEmail(id,type){
  document.getElementById('etb-zone').innerHTML='';
  const d=DOSSIERS.find(x=>x.id===id);
  if(d){d.j.push({ts:now(),a:me(),txt:'Email envoyé via Front',em:true,et:type});saveD()}
  showToast('Email ouvert dans Front ✓');
}
function blockEmail(id,prevCol){
  const d=DOSSIERS.find(x=>x.id===id);
  if(d){d.col=prevCol;d.j.push({ts:now(),a:me(),txt:'Déplacement annulé + email bloqué',em:false})}
  saveD();renderBoard();document.getElementById('etb-zone').innerHTML='';
  showToast('Email bloqué — dossier remis en place');
}

// ═══════════════════════════════════════════════════════════════════
// SLIDE PANEL
// ═══════════════════════════════════════════════════════════════════
function openSlide(id){
  selId=id;
  const d=DOSSIERS.find(x=>x.id===id);if(!d)return;
  document.getElementById('slide').classList.add('open');
  document.getElementById('sl-title').textContent=d.copro;
  document.getElementById('sl-sub').textContent=d.debiteur+' · '+d.procedure;
  const col=COLS.find(c=>c.id===d.col);
  const pct=Math.round(d.tl.filter(t=>t.ok).length/d.tl.length*100);
  document.getElementById('sl-body').innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px">
      <span style="display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;background:${col.dot}18;color:${col.dot}">${col.label}</span>
      <span style="font-size:11px;color:var(--sub)">${pct}% · ${d.age}j dans l'étape</span>
    </div>
    <div class="pb"><div class="pf" style="width:${pct}%"></div></div>
    <div class="slsec">
      <div class="slst"><span class="mdi mdi-information-outline"></span>Dossier</div>
      <div class="ir"><span class="il">PCS</span><span class="iv">${d.pcs_nom}</span></div>
      <div class="ir"><span class="il">Email PCS</span><span class="iv" style="font-size:11px"><a href="mailto:${d.pcs_email}" style="color:var(--info)">${d.pcs_email}</a></span></div>
      <div class="ir"><span class="il">Dette</span><span class="iv" style="color:var(--err)">${fmt(d.dette)} €</span></div>
      ${d.devis?`<div class="ir"><span class="il">Honoraires</span><span class="iv">${fmt(d.devis)} € HT</span></div>`:''}
      <div class="ir"><span class="il">Cabinet</span><span class="iv">${d.cabinet||'—'}</span></div>
      <div class="ir"><span class="il">Juriste</span><span class="iv">${d.juriste}</span></div>
      ${d.conv_id?`<div class="ir"><span class="il">Front</span><span class="iv"><a href="#" onclick="showToast('Ouverture ${d.conv_id}…')" style="color:var(--info)">${d.conv_id}</a></span></div>`:''}
    </div>
    <div class="slsec">
      <div class="slst"><span class="mdi mdi-timeline-outline"></span>Étapes</div>
      <div style="display:flex;flex-direction:column">
        ${d.tl.map((t,i)=>`<div class="tli">
          <div class="tll"><div class="tld ${t.ok?'dn':'pd'}"></div>${i<d.tl.length-1?'<div class="tlc"></div>':''}</div>
          <div class="tlco"><div class="tlda">${t.d||''}${t.a?' · '+t.a:''}</div><div class="tltx">${t.t}</div></div>
        </div>`).join('')}
      </div>
    </div>
    <div class="slsec">
      <div class="slst"><span class="mdi mdi-email-check-outline"></span>Journal <span style="margin-left:auto;font-size:10px;background:var(--bgi);color:var(--info);padding:1px 6px;border-radius:10px;font-weight:600">${d.j.filter(j=>j.em).length} emails</span></div>
      ${d.j.map(j=>`<div class="ji"><div class="jd">${j.ts}</div><div><strong>${j.a}</strong> — <span style="color:var(--sub)">${j.txt}</span>${j.em?`<span class="etag"><span class="mdi mdi-email-outline" style="font-size:10px"></span>email</span>`:''}</div></div>`).join('')}
    </div>
    <div class="slsec">
      <div class="slst"><span class="mdi mdi-paperclip"></span>Pièces</div>
      ${(d.pieces||[]).map(p=>`<div style="display:flex;align-items:center;gap:6px;padding:4px 7px;background:var(--bg);border-radius:7px;border:1px solid var(--bo);font-size:11px;margin-bottom:4px"><span class="mdi mdi-file-check-outline" style="color:var(--suc)"></span>${p}<span style="margin-left:auto;font-size:9px;color:var(--dis)">Matera</span></div>`).join('')}
    </div>`;
  // Actions
  const a=[];
  if(d.col==='avocat_a_saisir')a.push(`<div class="ac" onclick="openEM('demande_devis',${id})"><span class="mdi mdi-email-send-outline" style="color:var(--brand)"></span>Demander devis</div>`);
  if(d.col==='devis_recu')a.push(`<div class="ac" onclick="openEM('validation_devis',${id})"><span class="mdi mdi-check-circle-outline" style="color:var(--warn)"></span>Envoyer au CS</div>`);
  if(d.col==='pieces_a_envoyer')a.push(`<div class="ac" onclick="openEM('pieces_avocat',${id})"><span class="mdi mdi-upload-outline" style="color:var(--suc)"></span>Envoyer pièces</div>`);
  if(['procedure_cours','assignation'].includes(d.col))a.push(`<div class="ac" onclick="openAvancer(${id})"><span class="mdi mdi-flag-outline" style="color:var(--info)"></span>Avancer étape</div>`);
  a.push(`<div class="ac" onclick="openLastEmail(${id})"><span class="mdi mdi-eye-outline" style="color:var(--sub)"></span>Dernier email</div>`);
  a.push(`<div class="ac" onclick="openConvId(${id})"><span class="mdi mdi-link-variant" style="color:var(--info)"></span>Lier à Front</div>`);
  a.push(`<div class="ac full note" onclick="openNote(${id})"><span class="mdi mdi-text-box-check-outline"></span>Générer note PCS</div>`);
  document.getElementById('sl-acts').innerHTML=`<div class="saft">Actions</div><div class="ag">${a.join('')}</div>`;
}
function closeSlide(){selId=null;document.getElementById('slide').classList.remove('open')}

// ═══════════════════════════════════════════════════════════════════
// EMAIL MODAL
// ═══════════════════════════════════════════════════════════════════
function openEM(type,id){
  const d=DOSSIERS.find(x=>x.id===id);if(!d)return;
  const to=eTo(type,d),toL=eToL(type,d);
  const subj=SUBJ[type]?SUBJ[type](d):'',body=BODY[type]?BODY[type](d):'';

  // PEDAGOGICAL BOX for validation_devis
  let peda='';
  if(type==='validation_devis'){
    peda=`<div class="peda">
      <div class="peda-hd">
        <span class="mdi mdi-school-outline"></span>
        <div class="peda-htx">
          <div class="title">Ce que signifie cette démarche pour votre copropriété</div>
          <div class="sub">Guide simple à transmettre avec l'email de validation</div>
        </div>
      </div>
      <div class="peda-body">
        <div class="peda-step">
          <div class="peda-num">1</div>
          <div class="peda-txt"><strong>Pourquoi un avocat intervient-il ?</strong><br>
          <em>Les relances amiables (lettres recommandées, appels téléphoniques) n'ont pas abouti. La seule façon de forcer le paiement est désormais de passer par le tribunal. L'avocat rédige et dépose l'assignation en votre nom.</em></div>
        </div>
        <div class="peda-step">
          <div class="peda-num">2</div>
          <div class="peda-txt"><strong>À quoi correspondent ces ${fmt(d.devis)} € HT ?</strong><br>
          <em>Ces honoraires couvrent la rédaction de l'assignation, la représentation devant le tribunal et le suivi de la procédure. <strong>Bonne nouvelle : ces frais sont récupérables sur le débiteur</strong> si le tribunal statue en votre faveur (article 700 du Code de procédure civile).</em></div>
        </div>
        <div class="peda-step">
          <div class="peda-num">3</div>
          <div class="peda-txt"><strong>Quelle est la durée de la procédure ?</strong><br>
          <em>Entre 4 et 12 mois selon le tribunal et la procédure choisie. Le référé 19-2 est plus rapide (3-6 mois). Matera assure le suivi et vous informe à chaque étape clé.</em></div>
        </div>
        <div class="peda-step">
          <div class="peda-num">4</div>
          <div class="peda-txt"><strong>Quel est votre rôle en tant que Président du CS ?</strong><br>
          <em>Valider ce devis autorise Matera à mandater l'avocat. <strong>Vous n'avez pas à vous rendre au tribunal.</strong> Notre équipe juridique gère tout en lien direct avec le cabinet d'avocats.</em></div>
        </div>
        <div class="peda-div"></div>
        <div class="peda-note">
          <span class="mdi mdi-shield-check-outline" style="font-size:16px;flex-shrink:0;margin-top:1px"></span>
          <span><strong>En résumé :</strong> en cliquant "Valider", vous autorisez le lancement d'une procédure judiciaire. Les frais d'avocat (${fmt(d.devis)} € HT) avancés par la copropriété seront remboursés par le débiteur en cas de succès. Sans votre accord, la procédure ne peut pas démarrer.</span>
        </div>
      </div>
    </div>`;
  }

  // Stocker body dans var globale pour que closeModal() ne le détruise pas
  window._pendingEmailBody = body;
  window._pendingEmailTo = to;
  window._pendingEmailSubj = subj;

  openModal(`Email → ${toL}`,`
    <div class="al ali"><span class="mdi mdi-information-outline"></span><span>Prévisualisez l'email. "Ouvrir dans Front" copie le corps et ouvre Front.</span></div>
    ${peda}
    <div class="ep">
      <div class="eph"><div style="font-size:11px;color:var(--sub);margin-bottom:2px"><strong>${CFG.from_email}</strong> → ${to} (${toL})</div><div class="eps">${subj}</div></div>
      <div class="epb" id="ep-b">${body}</div>
    </div>`,`
    <span class="cc" id="cc-em"><span class="mdi mdi-check"></span>Copié</span>
    <button class="btn bsm" onclick="copyEl('ep-b','cc-em')"><span class="mdi mdi-content-copy"></span>Copier le corps</button>
    <div class="sp"></div>
    <button class="btn bde bsm" onclick="closeModal()"><span class="mdi mdi-cancel"></span>Annuler</button>
    <button class="mbtn" style="font-size:12px;padding:6px 13px" onclick="sendToFront(window._pendingEmailTo,window._pendingEmailSubj,window._pendingEmailBody,${id},'${type}');closeModal()"><span class="mdi mdi-open-in-new"></span>Ouvrir dans Front</button>`);
}

function openLastEmail(id){
  const d=DOSSIERS.find(x=>x.id===id);
  const last=d.j.filter(j=>j.em&&j.et&&BODY[j.et]).slice(-1)[0];
  if(!last){showToast('Aucun email envoyé');return}
  const subj=SUBJ[last.et]?SUBJ[last.et](d):'—',body=BODY[last.et]?BODY[last.et](d):'—';
  const to=eTo(last.et,d);
  openModal('Dernier email envoyé',`
    <div class="al ali"><span class="mdi mdi-clock-outline"></span><span>Envoyé le ${last.ts} par ${last.a}</span></div>
    <div class="ep"><div class="eph"><div style="font-size:11px;color:var(--sub);margin-bottom:2px">${CFG.from_email} → ${to}</div><div class="eps">${subj}</div></div><div class="epb">${body}</div></div>`,`
    <div class="sp"></div><button class="btn" onclick="closeModal()">Fermer</button>
    <button class="mbtn" style="font-size:12px;padding:6px 13px" onclick="closeModal();sendToFront('${to}','${subj.replace(/'/g,"\\'")}',document.querySelector('.epb')?.innerText||'')"><span class="mdi mdi-refresh"></span>Renvoyer</button>`);
}

function openConvId(id){
  const d=DOSSIERS.find(x=>x.id===id);
  openModal('Lier à une conversation Front',`
    <div class="al ali"><span class="mdi mdi-information-outline"></span><span>Collez l'ID de conversation Front (ex: <code>cnv_abc123</code>). L'outil y postera les notes automatiquement.</span></div>
    <div class="fg"><label class="fl">Conversation ID</label><input class="fi" id="cid" value="${d.conv_id||''}" placeholder="cnv_abc123"></div>`,`
    <div class="sp"></div><button class="btn" onclick="closeModal()">Annuler</button>
    <button class="btn bp" onclick="saveConvId(${id})"><span class="mdi mdi-check"></span>Enregistrer</button>`);
}
function saveConvId(id){
  const v=document.getElementById('cid').value.trim();
  const d=DOSSIERS.find(x=>x.id===id);d.conv_id=v;
  closeModal();saveD();renderBoard();openSlide(id);showToast(v?'Front lié ✓':'Lien supprimé');
}

function openAvancer(id){
  const d=DOSSIERS.find(x=>x.id===id);
  openModal('Avancer le dossier',`
    <div class="fg"><label class="fl">Nouvelle étape</label>
      <select class="fsel" id="nstep">
        ${d.col==='procedure_cours'?`<option value="assignation">Assignation déposée</option>`:''}
        <option value="decision">Décision de justice rendue</option>
        <option value="clos">Clôturer le dossier</option>
      </select></div>
    <div class="fg"><label class="fl">Note interne (optionnel)</label><textarea class="fi" rows="2" placeholder="Ex : audience fixée au 12/04/2026…"></textarea></div>
    <div class="al alw"><span class="mdi mdi-email-fast-outline"></span><span>Un email sera automatiquement envoyé au PCS.</span></div>`,`
    <div class="sp"></div><button class="btn" onclick="closeModal()">Annuler</button>
    <button class="btn bp" onclick="doAvancer(${id})"><span class="mdi mdi-check"></span>Valider</button>`);
}
function doAvancer(id){
  const ns=document.getElementById('nstep').value;
  const d=DOSSIERS.find(x=>x.id===id);
  const labels={assignation:'Assignation déposée',decision:'Décision rendue',clos:'Dossier clôturé'};
  d.col=ns;d.age=0;
  d.tl.push({d:now().split(' ')[0],t:labels[ns],ok:true,a:ini(me())});
  d.j.push({ts:now(),a:me(),txt:labels[ns]+' + email PCS',em:true,et:ns});
  closeModal();saveD();renderBoard();closeSlide();showToast(labels[ns]+' · Email PCS envoyé ✓');
}

function openNote(id){
  const d=DOSSIERS.find(x=>x.id===id);
  const today=new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});
  const done=d.tl.filter(t=>t.ok),next=d.tl.find(t=>!t.ok);
  const note=`SUIVI RECOUVREMENT — ${d.copro}
Mise à jour : ${today}

Monsieur le Président,

Voici un point sur la procédure de recouvrement pour les charges impayées de ${d.debiteur}.

SITUATION FINANCIÈRE
• Charges impayées : ${fmt(d.dette)} €
• Frais de relance amiable : ${fmt(d.frais)} €${d.devis?'\n• Honoraires avocat ('+d.cabinet+') : '+fmt(d.devis)+' € HT':''}
• Total engagé : ${fmt((d.devis||0)+d.frais)} € (récupérable sur le débiteur)

ACTIONS RÉALISÉES
${done.map(t=>`• ${t.d} — ${t.t}${t.a?' ('+t.a+')':''}`).join('\n')}

PROCHAINE ÉTAPE
${next?'→ '+next.t+'\n  Délai estimé : '+next.d:'→ Procédure en cours de finalisation.'}

Bien cordialement,
${d.juriste} — Équipe juridique Matera
${CFG.from_email}`;
  openModal('Note de suivi — PCS',`
    <div class="al ali"><span class="mdi mdi-information-outline"></span><span>Générée automatiquement · Copiez dans la plateforme Matera.</span></div>
    <div class="np" id="note-txt">${note}</div>`,`
    <span class="cc" id="cc-note"><span class="mdi mdi-check"></span>Copié !</span><div class="sp"></div>
    <button class="btn" onclick="closeModal()">Fermer</button>
    <button class="btn bp" onclick="copyEl('note-txt','cc-note')"><span class="mdi mdi-content-copy"></span>Copier</button>`);
}

// ═══════════════════════════════════════════════════════════════════
// NEW DOSSIER WIZARD
// ═══════════════════════════════════════════════════════════════════
let WD={},wizS=1;
function openNewDossier(){wizS=1;WD={};renderWiz()}
function renderWiz(){
  const steps=['Dossier','Débiteur','Cabinet','Résumé'];
  const sh=steps.map((s,i)=>`<div style="display:flex;align-items:center;gap:5px;font-size:11px;font-weight:500;color:${wizS===i+1?'var(--brand)':wizS>i+1?'var(--suc)':'var(--dis)'}"><div style="width:19px;height:19px;border-radius:50%;border:1.5px solid currentColor;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;flex-shrink:0">${wizS>i+1?'✓':i+1}</div>${s}</div>${i<3?'<div style="flex:1;height:1px;background:var(--bo);margin:0 4px"></div>':''}`).join('');
  const jOpts=CFG.members.filter(m=>m.role!=='viewer').map(m=>`<option${m.name===me()?' selected':''}>${m.name}</option>`).join('');
  const cOpts=CFG.cabinets.map(c=>`<option value="${c.name}|||${c.email}|||${c.avocat}">${c.name}</option>`).join('');
  let body='';
  if(wizS===1) body=`<div style="display:flex;gap:0;margin-bottom:14px">${sh}</div>
    <div class="al ali" style="margin-bottom:2px"><span class="mdi mdi-link-variant"></span><span>Collez un ID Front pour pré-remplir automatiquement (fonctionnel en prod avec l'API Front).</span></div>
    <div class="fg"><label class="fl">Conv. Front ID (optionnel)</label><div style="display:flex;gap:6px"><input class="fi" id="w-conv" value="${WD.conv_id||''}" placeholder="cnv_abc123" style="flex:1"><button class="btn bp bsm" onclick="prefill()"><span class="mdi mdi-download-outline"></span>Récupérer</button></div></div>
    <div class="fg"><label class="fl">Copropriété *</label><input class="fi" id="w-copro" value="${WD.copro||''}" placeholder="SDC 15 bd Mazarine"></div>
    <div class="fg2"><div class="fg"><label class="fl">Nom du PCS *</label><input class="fi" id="w-pcs-n" value="${WD.pcs_nom||''}" placeholder="M. Dupont"></div>
    <div class="fg"><label class="fl">Email PCS *</label><input class="fi" id="w-pcs-e" value="${WD.pcs_email||''}" type="email" placeholder="pcs@sdc.fr"></div></div>
    <div class="fg2"><div class="fg"><label class="fl">Procédure *</label><select class="fsel" id="w-proc"><option>Action au fond</option><option>Injonction de payer</option><option>Référé 19-2</option><option>Saisie bancaire</option></select></div>
    <div class="fg"><label class="fl">Juriste *</label><select class="fsel" id="w-jur">${jOpts}</select></div></div>`;
  else if(wizS===2) body=`<div style="display:flex;gap:0;margin-bottom:14px">${sh}</div>
    <div class="fg"><label class="fl">Débiteur *</label><input class="fi" id="w-deb" value="${WD.debiteur||''}" placeholder="M. Martin Boninot"></div>
    <div class="fg2"><div class="fg"><label class="fl">Dette (€) *</label><input class="fi" id="w-dette" type="number" value="${WD.dette||''}"></div>
    <div class="fg"><label class="fl">Frais relance (€)</label><input class="fi" id="w-frais" type="number" value="${WD.frais||150}"></div></div>
    <div class="fg"><label class="fl">Pièces disponibles</label><div style="display:flex;flex-direction:column;gap:3px" id="pck">
    ${['PV AG (dernière année)','PV AG (n-1)','Appels de fonds','MeD LRAR','MeD avocat','Grands livres'].map(p=>`<label style="display:flex;align-items:center;gap:7px;padding:5px 8px;background:var(--bgn);border-radius:7px;font-size:12px;cursor:pointer"><input type="checkbox" checked value="${p}"> ${p}</label>`).join('')}
    </div></div>`;
  else if(wizS===3) body=`<div style="display:flex;gap:0;margin-bottom:14px">${sh}</div>
    <div class="fg"><label class="fl">Cabinet *</label><select class="fsel" id="w-cab"><option value="">— Sélectionner (optionnel) —</option>${cOpts}</select></div>
    <div class="al ali"><span class="mdi mdi-email-send-outline"></span><span>Dès la création : email d'ouverture au PCS + demande de devis au cabinet.</span></div>`;
  else body=`<div style="display:flex;gap:0;margin-bottom:14px">${sh}</div>
    <div class="al als"><span class="mdi mdi-check-circle-outline"></span><span>Dossier prêt à créer.</span></div>
    <div style="background:var(--bgn);border-radius:8px;padding:12px;font-size:12px;display:flex;flex-direction:column;gap:5px">
      <div class="ir"><span class="il">Copropriété</span><span class="iv">${WD.copro}</span></div>
      <div class="ir"><span class="il">PCS</span><span class="iv">${WD.pcs_nom}</span></div>
      <div class="ir"><span class="il">Débiteur</span><span class="iv">${WD.debiteur}</span></div>
      <div class="ir"><span class="il">Dette</span><span class="iv" style="color:var(--err)">${fmt(WD.dette)} €</span></div>
      <div class="ir"><span class="il">Cabinet</span><span class="iv">${WD.cabinet||'Non assigné'}</span></div>
      <div class="ir"><span class="il">Juriste</span><span class="iv">${WD.juriste}</span></div>
    </div>
    <div class="al als" style="font-size:12px"><span class="mdi mdi-email-check-outline"></span><strong>Email PCS</strong> — Ouverture procédure</div>
    ${WD.cabinet?`<div class="al ali" style="font-size:12px"><span class="mdi mdi-email-send-outline"></span><strong>Email avocat</strong> — Demande de devis</div>`:''}`;

  openModal('Nouveau dossier',body,`
    ${wizS>1?'<button class="btn bsm" onclick="wizBack()"><span class="mdi mdi-arrow-left"></span>Retour</button>':''}
    <div class="sp"></div>
    <button class="btn" onclick="closeModal()">Annuler</button>
    ${wizS<4?`<button class="btn bp" onclick="wizNext()">Suivant <span class="mdi mdi-arrow-right"></span></button>`:`<button class="btn bp" onclick="wizCreate()"><span class="mdi mdi-check"></span>Créer</button>`}`);
}
function wizSave(){
  if(wizS===1){WD.conv_id=v('w-conv');WD.copro=v('w-copro');WD.pcs_nom=v('w-pcs-n');WD.pcs_email=v('w-pcs-e');WD.proc=v('w-proc');WD.juriste=v('w-jur')}
  if(wizS===2){WD.debiteur=v('w-deb');WD.dette=v('w-dette');WD.frais=v('w-frais');WD.pieces=[...document.querySelectorAll('#pck input:checked')].map(i=>i.value)}
  if(wizS===3){const raw=v('w-cab')||'';const p=raw.split('|||');WD.cabinet=p[0];WD.cab_email=p[1]||'';WD.avocat=p[2]||''}
}
function v(id){const el=document.getElementById(id);return el?el.value:''}
function wizNext(){wizSave();wizS++;closeModal();renderWiz()}
function wizBack(){wizS--;closeModal();renderWiz()}
function prefill(){showToast('Récupération Front disponible en production')}
function wizCreate(){
  closeModal();
  const nd={
    id:Date.now(),copro:WD.copro||'Nouvelle SDC',debiteur:WD.debiteur||'Débiteur',
    pcs_nom:WD.pcs_nom||'PCS',pcs_email:WD.pcs_email||'pcs@sdc.fr',
    cabinet:WD.cabinet||'',avocat:WD.avocat||'',cab_email:WD.cab_email||'',
    procedure:WD.proc||'Action au fond',dette:parseInt(WD.dette)||0,
    frais:parseInt(WD.frais)||150,devis:null,
    col:WD.cabinet?'devis_attendu':'avocat_a_saisir',
    juriste:WD.juriste||me(),conv_id:WD.conv_id||'',age:0,
    pieces:WD.pieces||['PV AG','Appels de fonds','MeD'],
    tl:[{d:now().split(' ')[0],t:'Dossier créé',ok:true,a:ini(WD.juriste||me())},{d:'En attente',t:WD.cabinet?'Devis attendu':'Choisir un cabinet',ok:false}],
    j:[{ts:now(),a:me(),txt:'Dossier créé + email PCS',em:true,et:'ouverture'}],
  };
  DOSSIERS.unshift(nd);saveD();renderBoard();showToast('Dossier créé · Emails envoyés ✓');
}

// ═══════════════════════════════════════════════════════════════════
// LIST VIEW
// ═══════════════════════════════════════════════════════════════════
function renderList(){
  document.getElementById('list-view').innerHTML=`
    <div style="display:grid;grid-template-columns:2fr 1.2fr 1fr 0.9fr 0.8fr 1.1fr 0.9fr 0.5fr;padding:8px 14px;background:var(--bgn);border-bottom:1px solid var(--bo);font-size:10px;font-weight:700;color:var(--sub);text-transform:uppercase;letter-spacing:.5px">
      <div>Copropriété</div><div>Débiteur</div><div>Cabinet</div><div>Procédure</div><div>Dette</div><div>Étape</div><div>Juriste</div><div>Âge</div></div>
    ${DOSSIERS.map(d=>{const col=COLS.find(c=>c.id===d.col);const od=d.age>=CFG.stale_days&&d.col!=='clos';return`<div style="display:grid;grid-template-columns:2fr 1.2fr 1fr 0.9fr 0.8fr 1.1fr 0.9fr 0.5fr;padding:10px 14px;border-bottom:1px solid var(--bo);font-size:12px;align-items:center;cursor:pointer" onmouseenter="this.style.background='var(--bgn)'" onmouseleave="this.style.background=''">
      <div style="font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d.copro}</div>
      <div style="color:var(--sub);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d.debiteur}</div>
      <div style="font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d.cabinet||'—'}</div>
      <div style="font-size:11px">${d.procedure}</div>
      <div style="font-weight:600">${fmt(d.dette)} €</div>
      <div><span style="display:inline-flex;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600;background:${col.dot}18;color:${col.dot}">${col.label}</span></div>
      <div style="font-size:11px">${d.juriste.split(' ')[0]}</div>
      <div style="font-size:11px;color:${od?'var(--err)':'var(--sub)'};font-weight:${od?'600':'400'}">${d.age}j</div>
    </div>`}).join('')}`;
}

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════
function renderDash(){
  const total=DOSSIERS.length||1;
  const byCol=COLS.map(c=>({...c,n:DOSSIERS.filter(d=>d.col===c.id).length}));
  const byJur=[...new Set(DOSSIERS.map(d=>d.juriste))].map(j=>({name:j,n:DOSSIERS.filter(d=>d.juriste===j).length}));
  const emTotal=DOSSIERS.reduce((a,d)=>a+d.j.filter(j=>j.em).length,0);
  document.getElementById('dash-view').innerHTML=`
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px">
      <div style="background:var(--bg);border:1px solid var(--bo);border-radius:12px;padding:14px 16px"><div style="font-size:10px;color:var(--sub);font-weight:700;text-transform:uppercase;margin-bottom:4px">Dossiers</div><div style="font-size:22px;font-weight:700">${DOSSIERS.length}</div></div>
      <div style="background:var(--bg);border:1px solid var(--bo);border-radius:12px;padding:14px 16px"><div style="font-size:10px;color:var(--sub);font-weight:700;text-transform:uppercase;margin-bottom:4px">Emails auto</div><div style="font-size:22px;font-weight:700;color:var(--info)">${emTotal}</div><div style="font-size:11px;color:var(--suc)">0 rédigé manuellement</div></div>
      <div style="background:var(--bg);border:1px solid var(--bo);border-radius:12px;padding:14px 16px"><div style="font-size:10px;color:var(--sub);font-weight:700;text-transform:uppercase;margin-bottom:4px">Sans action ${CFG.stale_days}j+</div><div style="font-size:22px;font-weight:700;color:var(--warn)">${DOSSIERS.filter(d=>d.age>=CFG.stale_days&&d.col!=='clos').length}</div></div>
      <div style="background:var(--bg);border:1px solid var(--bo);border-radius:12px;padding:14px 16px"><div style="font-size:10px;color:var(--sub);font-weight:700;text-transform:uppercase;margin-bottom:4px">Dette totale</div><div style="font-size:22px;font-weight:700;color:var(--err)">${fmt(DOSSIERS.reduce((a,d)=>a+d.dette,0))} €</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div style="background:var(--bg);border:1px solid var(--bo);border-radius:12px;padding:16px">
        <div style="font-size:13px;font-weight:700;margin-bottom:12px">Répartition par étape</div>
        ${byCol.filter(c=>c.n>0).map(c=>`<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><div style="width:7px;height:7px;border-radius:50%;background:${c.dot};flex-shrink:0"></div><div style="font-size:11px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.label}</div><div style="flex:1;height:4px;background:var(--bo);border-radius:2px;overflow:hidden"><div style="height:100%;background:${c.dot};width:${c.n/total*100}%"></div></div><div style="font-size:11px;font-weight:600;width:18px;text-align:right">${c.n}</div></div>`).join('')}
      </div>
      <div style="background:var(--bg);border:1px solid var(--bo);border-radius:12px;padding:16px">
        <div style="font-size:13px;font-weight:700;margin-bottom:12px">Par juriste</div>
        ${byJur.map(j=>`<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><div style="width:20px;height:20px;border-radius:50%;background:var(--brand);color:white;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${ini(j.name)}</div><div style="font-size:11px;flex:1">${j.name.split(' ')[0]}</div><div style="flex:1;height:4px;background:var(--bo);border-radius:2px;overflow:hidden"><div style="height:100%;background:var(--brand);width:${j.n/total*100}%"></div></div><div style="font-size:11px;font-weight:600;width:18px;text-align:right">${j.n}</div></div>`).join('')}
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════
function renderSettings(){
  document.getElementById('sview').innerHTML=`
  <h2 style="font-size:20px;font-weight:700;margin-bottom:16px">Paramètres</h2>

  <div class="ssec">
    <div class="ssec-t">Identité de l'équipe</div>
    <div class="ssec-s">Ces informations apparaissent dans l'interface et dans tous les emails automatiques.</div>
    <div class="fg2" style="margin-bottom:10px">
      <div class="fg"><label class="fl">Nom de l'équipe</label><input class="fi" id="c-name" value="${CFG.team_name}"></div>
      <div class="fg"><label class="fl">Sous-titre</label><input class="fi" id="c-sub" value="${CFG.team_sub}"></div>
    </div>
    <div class="fg2" style="margin-bottom:10px">
      <div class="fg"><label class="fl">Email d'expédition</label><input class="fi" id="c-from" value="${CFG.from_email}"><span class="fh">Expéditeur de tous les emails automatiques</span></div>
      <div class="fg"><label class="fl">Alerte sans action (jours)</label><input class="fi" id="c-stale" type="number" value="${CFG.stale_days}" min="1" max="30"></div>
    </div>
    <div class="fg2">
      <div class="fg"><label class="fl">Inbox Front</label><input class="fi" id="c-inbox" value="${CFG.front_inbox}"><span class="fh">ID actuel : ${CFG.front_inbox_id}</span></div>
      <div class="fg"><label class="fl">Utilisateur courant</label><select class="fsel" id="c-user">${CFG.members.map(m=>`<option${m.name===CFG.current_user?' selected':''}>${m.name}</option>`).join('')}</select></div>
    </div>
    <div style="margin-top:12px;display:flex;justify-content:flex-end">
      <button class="btn bp" onclick="saveTeam()"><span class="mdi mdi-check"></span>Enregistrer</button>
    </div>
  </div>

  <div class="ssec">
    <div class="ssec-t">Membres & accès</div>
    <div class="ssec-s">Admin : accès complet. Juriste : créer/modifier des dossiers. Lecteur : lecture seule.</div>
    <div id="mlist">
      ${CFG.members.map((m,i)=>`<div class="tm-row">
        <div class="tm-av">${m.initials}</div>
        <div style="flex:1"><div style="font-size:13px;font-weight:500">${m.name}</div><div style="font-size:11px;color:var(--sub)">${m.email}</div></div>
        <select class="fsel" style="width:105px;font-size:11px;padding:4px 8px" onchange="updRole(${i},this.value)">
          <option${m.role==='admin'?' selected':''} value="admin">Admin</option>
          <option${m.role==='juriste'?' selected':''} value="juriste">Juriste</option>
          <option${m.role==='viewer'?' selected':''} value="viewer">Lecteur</option>
        </select>
        <button class="btn bde bsm" onclick="rmMember(${i})"><span class="mdi mdi-delete-outline"></span></button>
      </div>`).join('')}
    </div>
    <div class="sdiv"></div>
    <div style="display:flex;gap:7px;align-items:flex-end">
      <div class="fg" style="flex:1"><label class="fl">Nom</label><input class="fi" id="nm-n" placeholder="Prénom Nom"></div>
      <div class="fg" style="flex:2"><label class="fl">Email</label><input class="fi" id="nm-e" placeholder="prenom.nom@matera.eu"></div>
      <div class="fg"><label class="fl">Rôle</label><select class="fsel" id="nm-r"><option value="juriste">Juriste</option><option value="admin">Admin</option><option value="viewer">Lecteur</option></select></div>
      <button class="btn bp" onclick="addMember()"><span class="mdi mdi-plus"></span>Ajouter</button>
    </div>
  </div>

  <div class="ssec">
    <div class="ssec-t">Cabinets d'avocats partenaires</div>
    <div class="ssec-s">Disponibles lors de la création de dossiers.</div>
    ${CFG.cabinets.map((c,i)=>`<div class="cab-row">
      <div style="flex:1"><div style="font-size:13px;font-weight:500">${c.name}</div><div style="font-size:11px;color:var(--sub)">${c.avocat} · ${c.email}</div></div>
      <button class="btn bde bsm" onclick="rmCab(${i})"><span class="mdi mdi-delete-outline"></span></button>
    </div>`).join('')}
    <div class="sdiv"></div>
    <div style="display:flex;gap:7px;align-items:flex-end">
      <div class="fg" style="flex:1"><label class="fl">Cabinet</label><input class="fi" id="nc-n" placeholder="Cabinet X"></div>
      <div class="fg" style="flex:1"><label class="fl">Avocat référent</label><input class="fi" id="nc-av" placeholder="Me Dupont"></div>
      <div class="fg" style="flex:2"><label class="fl">Email</label><input class="fi" id="nc-e" placeholder="contact@cabinet.fr"></div>
      <button class="btn bp" onclick="addCab()"><span class="mdi mdi-plus"></span>Ajouter</button>
    </div>
  </div>

  <div class="ssec">
    <div class="ssec-t">Connexion Front</div>
    <div class="ssec-s">Connecté à votre instance Front via le connecteur MCP Matera.</div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="display:inline-flex;align-items:center;gap:5px;padding:5px 10px;background:var(--bgi);border:1px solid #b3d6e8;border-radius:8px;font-size:12px;color:var(--info);font-weight:500"><span class="mdi mdi-email-outline" style="font-size:14px"></span>${CFG.front_inbox}</div>
      <span style="font-size:11px;color:var(--suc);display:flex;align-items:center;gap:3px"><span class="mdi mdi-check-circle-outline"></span>Connecté</span>
    </div>
    <div class="al ali" style="font-size:12px"><span class="mdi mdi-information-outline"></span><span>Les emails s'ouvrent dans Front via liens mailto:. Pour l'envoi direct API (sans clic), une clé API Front est requise.</span></div>
  </div>

  <div class="ssec" style="border-color:var(--bge)">
    <div class="ssec-t" style="color:var(--err)">Zone dangereuse</div>
    <div class="ssec-s">Actions irréversibles.</div>
    <div style="display:flex;gap:8px">
      <button class="btn bde" onclick="if(confirm('Réinitialiser les paramètres ?')){localStorage.removeItem('mtr_cfg');CFG=getCFG();applyUI();renderSettings();showToast('Réinitialisé')}"><span class="mdi mdi-refresh"></span>Réinitialiser paramètres</button>
      <button class="btn bde" onclick="if(confirm('Supprimer tous les dossiers ?')){localStorage.removeItem('mtr_dos');DOSSIERS=[];saveD();renderBoard();showToast('Dossiers supprimés')}"><span class="mdi mdi-delete-outline"></span>Vider les dossiers</button>
    </div>
  </div>`;
}

function saveTeam(){
  CFG.team_name=v('c-name');CFG.team_sub=v('c-sub');CFG.from_email=v('c-from');
  CFG.stale_days=parseInt(v('c-stale'))||5;CFG.front_inbox=v('c-inbox');CFG.current_user=v('c-user');
  saveCFG();applyUI();showToast('Paramètres enregistrés ✓');
}
function updRole(i,r){CFG.members[i].role=r;saveCFG();showToast('Rôle mis à jour')}
function rmMember(i){if(!confirm('Retirer ce membre ?'))return;CFG.members.splice(i,1);saveCFG();renderSettings();showToast('Membre retiré')}
function addMember(){
  const n=v('nm-n').trim(),e=v('nm-e').trim(),r=v('nm-r');
  if(!n||!e){showToast('Nom et email requis');return}
  CFG.members.push({name:n,email:e,initials:ini(n),role:r});
  saveCFG();renderSettings();showToast(n+' ajouté ✓');
}
function rmCab(i){if(!confirm('Retirer ce cabinet ?'))return;CFG.cabinets.splice(i,1);saveCFG();renderSettings();showToast('Cabinet retiré')}
function addCab(){
  const n=v('nc-n').trim(),av=v('nc-av').trim(),e=v('nc-e').trim();
  if(!n||!e){showToast('Nom et email requis');return}
  CFG.cabinets.push({name:n,avocat:av,email:e});
  saveCFG();renderSettings();showToast(n+' ajouté ✓');
}

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════
function logE(type,id){const d=DOSSIERS.find(x=>x.id===id);if(d){d.j.push({ts:now(),a:me(),txt:'Email envoyé via Front',em:true,et:type});saveD()}}
function copyEl(srcId,ccId){
  const t=document.getElementById(srcId)?.innerText;
  if(t)navigator.clipboard.writeText(t).then(()=>{const c=document.getElementById(ccId);if(c){c.classList.add('show');setTimeout(()=>c.classList.remove('show'),2000)}});
}
function openModal(title,body,footer){
  const ex=document.getElementById('ov');if(ex)ex.remove();
  const el=document.createElement('div');el.className='overlay';el.id='ov';
  el.innerHTML=`<div class="modal"><div class="mh"><div><div class="mt">${title}</div></div><button class="mc" onclick="closeModal()">×</button></div><div class="mb">${body}</div><div class="mf">${footer}</div></div>`;
  el.addEventListener('click',e=>{if(e.target===el)closeModal()});
  document.body.appendChild(el);
}
function closeModal(){const m=document.getElementById('ov');if(m)m.remove()}
function showToast(msg){const t=document.getElementById('toast');t.innerHTML=`<span class="mdi mdi-check-circle-outline"></span>${msg}`;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),3500)}
function applyUI(){
  document.getElementById('team-name').textContent=CFG.team_name;
  document.getElementById('team-sub').textContent=CFG.team_sub;
  document.getElementById('cur-av').textContent=ini(CFG.current_user);
  document.getElementById('cur-av').title=CFG.current_user;
  const jf=document.getElementById('jur-filter');
  if(jf)jf.innerHTML='<option value="">Tous les juristes</option>'+CFG.members.filter(m=>m.role!=='viewer').map(m=>`<option>${m.name}</option>`).join('');
}

// ═══════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════
applyUI();
renderBoard();
