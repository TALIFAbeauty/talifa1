"use client";
import { useState } from "react";

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  ink:"#18160f",cream:"#f7f3eb",gold:"#b8922a",goldLight:"#ddb96a",goldBg:"#fdf6e3",
  sage:"#3d5c35",sageBg:"#eef4eb",rust:"#8a3a1a",rustBg:"#fdf0eb",
  slate:"#2b3a4a",slateBg:"#edf1f5",mid:"#6b6459",border:"#e4ddd0",white:"#fff",panel:"#1a1710",
  purple:"#4a3a6a",purpleBg:"#f0edf7",teal:"#1a5c5c",tealBg:"#e8f4f4",
  red:"#8a2020",redBg:"#fde8e8",amber:"#7a5200",amberBg:"#fff3e0",green:"#1e5c1e",greenBg:"#e8f5e8",
};
const font={serif:"Georgia,serif",sans:"'Helvetica Neue',Arial,sans-serif"};
const USD_CAD=1.37;
const fmt=(n,d=2)=>`$${Number(n).toFixed(d)}`;
const pct=(a,b)=>b===0?0:Math.round((a-b)/a*100);
const phaseColor=[null,C.sage,C.gold,C.slate];
const phaseBg=[null,C.sageBg,C.goldBg,C.slateBg];

// ─── INGREDIENTS ─────────────────────────────────────────────────────────────
const INGREDIENTS = [
  {id:"castor",    name:"Castor Oil",          inci:"Ricinus Communis Seed Oil",     products:["MAVKA","PAPI","OTAMAN","BORODA"], caPrice:4.50, srcPrice:1.60, srcCountry:"India 🇮🇳",   supplier:"VedaOils",           moq:"1 kg",  phase:1, category:"base",     priority:1,
   switch:{
     stage1:{label:"Canadian Dist.",minUnits:0,   cashBuffer:200,  moqKg:0.5, costPerUnit:0.54, marginImpact:0},
     stage2:{label:"Hybrid",        minUnits:30,  cashBuffer:400,  moqKg:1,   costPerUnit:0.38, marginImpact:3},
     stage3:{label:"Direct Import", minUnits:80,  cashBuffer:900,  moqKg:5,   costPerUnit:0.22, marginImpact:7},
     readiness:"Ready now — lowest complexity direct import possible.",
   }},
  {id:"jojoba",   name:"Jojoba Oil",           inci:"Simmondsia Chinensis Seed Oil",  products:["MAVKA","PAPI","OTAMAN"],        caPrice:18.00,srcPrice:13.00,srcCountry:"India 🇮🇳",   supplier:"VedaOils",           moq:"1 kg",  phase:1, category:"base",     priority:2,
   switch:{
     stage1:{label:"Canadian Dist.",minUnits:0,  cashBuffer:300,  moqKg:0.5, costPerUnit:2.16, marginImpact:0},
     stage2:{label:"Hybrid",        minUnits:40, cashBuffer:600,  moqKg:1,   costPerUnit:1.90, marginImpact:2},
     stage3:{label:"Direct Import", minUnits:90, cashBuffer:1200, moqKg:5,   costPerUnit:1.43, marginImpact:5},
     readiness:"Combine with castor in same India order. Phase 2 easy win.",
   }},
  {id:"shea",     name:"Shea Butter",          inci:"Butyrospermum Parkii Butter",   products:["NYANGA","PAPI","BORODA"],        caPrice:8.00, srcPrice:5.50, srcCountry:"Ghana 🇬🇭",   supplier:"Baraka Shea Butter", moq:"5 kg",  phase:2, category:"base",     priority:3,
   switch:{
     stage1:{label:"Canadian Dist.",minUnits:0,  cashBuffer:200,  moqKg:1,   costPerUnit:0.96, marginImpact:0},
     stage2:{label:"Hybrid (5kg)",  minUnits:50, cashBuffer:800,  moqKg:5,   costPerUnit:0.76, marginImpact:3},
     stage3:{label:"Direct 25kg+",  minUnits:150,cashBuffer:2000, moqKg:25,  costPerUnit:0.61, marginImpact:6},
     readiness:"Phase 2 priority — biggest volume for NYANGA. Combine with baobab.",
   }},
  {id:"argan",    name:"Argan Oil",            inci:"Argania Spinosa Kernel Oil",    products:["MAVKA","PAPI","BORODA"],         caPrice:38.00,srcPrice:26.00,srcCountry:"Morocco 🇲🇦",  supplier:"Bulk Moroccan Oil",  moq:"1 L",   phase:2, category:"premium",  priority:4,
   switch:{
     stage1:{label:"Canadian Dist.",minUnits:0,  cashBuffer:400,  moqKg:0.1, costPerUnit:4.56, marginImpact:0},
     stage2:{label:"Hybrid (1L)",   minUnits:40, cashBuffer:900,  moqKg:1,   costPerUnit:3.55, marginImpact:4},
     stage3:{label:"Direct 5L+",   minUnits:100, cashBuffer:2500, moqKg:5,   costPerUnit:2.90, marginImpact:8},
     readiness:"Hero ingredient — strong brand story. Switch when hitting 40+/mo units.",
   }},
  {id:"baobab",   name:"Baobab Oil",           inci:"Adansonia Digitata Seed Oil",   products:["MAVKA","NYANGA"],                caPrice:42.00,srcPrice:22.00,srcCountry:"Ghana 🇬🇭",   supplier:"Baraka Shea Butter", moq:"1 L",   phase:2, category:"premium",  priority:5,
   switch:{
     stage1:{label:"Canadian Dist.",minUnits:0,  cashBuffer:400,  moqKg:0.1, costPerUnit:5.04, marginImpact:0},
     stage2:{label:"Hybrid (1L)",   minUnits:35, cashBuffer:900,  moqKg:1,   costPerUnit:3.12, marginImpact:6},
     stage3:{label:"Direct 5L+",   minUnits:90,  cashBuffer:2200, moqKg:5,   costPerUnit:2.64, marginImpact:9},
     readiness:"Combine with shea — same Ghana supplier. 48% saving.",
   }},
  {id:"moringa",  name:"Moringa Oil",          inci:"Moringa Oleifera Seed Oil",     products:["MAVKA","NYANGA"],                caPrice:28.00,srcPrice:11.00,srcCountry:"India 🇮🇳",   supplier:"VedaOils",           moq:"500 g", phase:2, category:"premium",  priority:6,
   switch:{
     stage1:{label:"Canadian Dist.",minUnits:0,  cashBuffer:300,  moqKg:0.1, costPerUnit:3.36, marginImpact:0},
     stage2:{label:"Hybrid (500g)", minUnits:30, cashBuffer:700,  moqKg:0.5, costPerUnit:1.80, marginImpact:5},
     stage3:{label:"Direct 2kg+",  minUnits:80,  cashBuffer:1400, moqKg:2,   costPerUnit:1.44, marginImpact:8},
     readiness:"61% cheaper. Add to India order. Low complexity.",
   }},
  {id:"peppermint",name:"Peppermint EO",       inci:"Mentha Piperita Leaf Oil",      products:["MAVKA","PAPI","OTAMAN","BORODA"],caPrice:48.00,srcPrice:18.00,srcCountry:"India 🇮🇳",   supplier:"AG Organica",        moq:"100 g", phase:2, category:"essential", priority:7,
   switch:{
     stage1:{label:"Canadian Dist.",minUnits:0,  cashBuffer:200,  moqKg:0.05,costPerUnit:1.44, marginImpact:0},
     stage2:{label:"Hybrid (100g)", minUnits:25, cashBuffer:500,  moqKg:0.1, costPerUnit:0.63, marginImpact:4},
     stage3:{label:"Direct 500g+", minUnits:70,  cashBuffer:900,  moqKg:0.5, costPerUnit:0.54, marginImpact:5},
     readiness:"62% saving. Low MOQ. Easy Phase 2 add-on to India order.",
   }},
  {id:"lavender", name:"Lavender EO",          inci:"Lavandula Angustifolia",        products:["BORODA"],                        caPrice:55.00,srcPrice:25.00,srcCountry:"India 🇮🇳",   supplier:"AG Organica",        moq:"100 g", phase:2, category:"essential", priority:8,
   switch:{
     stage1:{label:"Canadian Dist.",minUnits:0,  cashBuffer:200,  moqKg:0.05,costPerUnit:1.65, marginImpact:0},
     stage2:{label:"Hybrid (100g)", minUnits:20, cashBuffer:400,  moqKg:0.1, costPerUnit:0.90, marginImpact:4},
     stage3:{label:"Direct 500g+", minUnits:60,  cashBuffer:800,  moqKg:0.5, costPerUnit:0.75, marginImpact:5},
     readiness:"Combine with peppermint/rosemary — same AG Organica order.",
   }},
  {id:"rosemary", name:"Rosemary EO",          inci:"Rosmarinus Officinalis",        products:["MAVKA"],                         caPrice:65.00,srcPrice:28.00,srcCountry:"India 🇮🇳",   supplier:"AG Organica",        moq:"100 g", phase:2, category:"essential", priority:9,
   switch:{
     stage1:{label:"Canadian Dist.",minUnits:0,  cashBuffer:200,  moqKg:0.05,costPerUnit:1.95, marginImpact:0},
     stage2:{label:"Hybrid (100g)", minUnits:20, cashBuffer:400,  moqKg:0.1, costPerUnit:0.84, marginImpact:5},
     stage3:{label:"Direct 500g+", minUnits:60,  cashBuffer:800,  moqKg:0.5, costPerUnit:0.72, marginImpact:6},
     readiness:"57% saving. Same India order as other EOs.",
   }},
  {id:"babassu",  name:"Babassu / VCO",        inci:"Orbignya Oleifera Seed Oil",    products:["NYANGA","PAPI","BORODA"],        caPrice:16.00,srcPrice:2.50, srcCountry:"Philippines 🇵🇭",supplier:"HLC Trading",        moq:"5 kg",  phase:3, category:"base",     priority:10,
   switch:{
     stage1:{label:"Canadian Dist.",minUnits:0,   cashBuffer:300,  moqKg:1,   costPerUnit:1.92, marginImpact:0},
     stage2:{label:"Hybrid (5kg)",  minUnits:100, cashBuffer:1500, moqKg:5,   costPerUnit:0.48, marginImpact:7},
     stage3:{label:"Direct 25kg+", minUnits:250,  cashBuffer:4000, moqKg:25,  costPerUnit:0.32, marginImpact:9},
     readiness:"Phase 3 only. Philippines complexity too high for early stage.",
   }},
];

// ─── SUPPLIERS ────────────────────────────────────────────────────────────────
const SUPPLIERS = [
  {id:"nda",     name:"New Directions Aromatics", country:"Canada 🇨🇦",  ingredients:["castor","jojoba","shea","aloe","vitE"],
   risk:{quality:1,leadTime:1,logistics:1,moqPressure:1,documentation:1},
   costSavings:"0% (baseline CA)",note:"Phase 1 workhorse. Highest reliability, zero import friction. Use until Phase 2 ready.",
   rec:"Always use as backup. Keep an account open permanently."},
  {id:"pbn",     name:"Pure Blend Naturals",       country:"Canada 🇨🇦",  ingredients:["castor","glycerin","aloe","vitE"],
   risk:{quality:1,leadTime:1,logistics:1,moqPressure:1,documentation:2},
   costSavings:"0% (baseline CA)",note:"Great for small top-ups. Next-day GTA. Slightly less documentation than NDA.",
   rec:"Use for urgent top-ups and very small batches."},
  {id:"veda",    name:"VedaOils India",            country:"India 🇮🇳",   ingredients:["castor","jojoba","moringa","mango","peppermint","lavender","rosemary","vitE"],
   risk:{quality:2,leadTime:2,logistics:2,moqPressure:1,documentation:2},
   costSavings:"40–65%",note:"Best Phase 2 entry. Low MOQ, ISO certified, COA on every order. 8+ ingredients from one supplier.",
   rec:"First direct import. India order = biggest ROI for complexity invested."},
  {id:"baraka",  name:"Baraka Shea Butter",        country:"Ghana 🇬🇭",   ingredients:["shea","baobab"],
   risk:{quality:2,leadTime:3,logistics:3,moqPressure:2,documentation:2},
   costSavings:"35–48%",note:"Women's cooperative. Strong ethical story. Lead times longer — plan 4–6 weeks ahead.",
   rec:"Phase 2 second priority after India. Combine shea + baobab in one order."},
  {id:"bulkmo",  name:"Bulk Moroccan Oil",         country:"Morocco 🇲🇦", ingredients:["argan"],
   risk:{quality:1,leadTime:2,logistics:2,moqPressure:1,documentation:1},
   costSavings:"32%",note:"USDA Organic + Ecocert dual certified. Low MOQ (1L). Excellent documentation.",
   rec:"Best Morocco option. Premium supplier at fair price. Switch argan here in Phase 2."},
  {id:"agorg",   name:"AG Organica India",         country:"India 🇮🇳",   ingredients:["peppermint","lavender","rosemary"],
   risk:{quality:2,leadTime:2,logistics:2,moqPressure:1,documentation:2},
   costSavings:"54–62%",note:"EO specialist. Low MOQ (100g). Combine all 3 EOs in one order from same supplier.",
   rec:"Phase 2 — combine with VedaOils India order or ship separately. Low minimum."},
  {id:"hlc",     name:"HLC Trading Philippines",   country:"Philippines 🇵🇭",ingredients:["babassu"],
   risk:{quality:3,leadTime:3,logistics:4,moqPressure:3,documentation:3},
   costSavings:"83%",note:"Huge saving but highest logistics complexity. Philippines = Phase 3 only.",
   rec:"Do not switch until 250+ units/month and customs broker in place."},
];

// ─── PRODUCT META ─────────────────────────────────────────────────────────────
const PRODUCT_META = {
  MAVKA: {type:"Scalp Oil 50ml",        retail:60,ws:30,batchSize:50, defaultIng:{castor:15,jojoba:12,baobab:8,moringa:6,argan:5,rosemary:0.5,peppermint:0.5}},
  NYANGA:{type:"Butter 200ml",          retail:55,ws:27,batchSize:200,defaultIng:{shea:80,mango:40,baobab:30,jojoba:20,babassu:20}},
  PAPI:  {type:"Beard Cream 100ml",     retail:30,ws:15,batchSize:100,defaultIng:{castor:20,jojoba:15,argan:10,shea:10,beeswax:8,peppermint:0.5}},
  OTAMAN:{type:"After Shave 100ml",     retail:35,ws:17,batchSize:100,defaultIng:{aloe:60,glycerin:10,jojoba:8,castor:5,panthenol:1,peppermint:0.3}},
  BORODA:{type:"Beard Cream+Caff 100ml",retail:30,ws:15,batchSize:100,defaultIng:{castor:20,shea:15,mango:12,argan:8,babassu:8,lavender:0.5}},
};
const PRODUCTS=["MAVKA","NYANGA","PAPI","OTAMAN","BORODA"];

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s={
  app:{fontFamily:font.sans,background:C.cream,minHeight:"100vh",color:C.ink},
  hdr:{background:C.panel,padding:"20px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10},
  brand:{fontSize:24,letterSpacing:"0.22em",color:C.cream,fontWeight:"normal",fontFamily:font.serif},
  brandSub:{fontFamily:font.sans,fontSize:8,letterSpacing:"0.3em",color:C.goldLight,textTransform:"uppercase",marginTop:3},
  nav:{background:"#13120d",display:"flex",borderBottom:"1px solid #2a2820",overflowX:"auto"},
  tab:(a)=>({fontFamily:font.sans,fontSize:8,letterSpacing:"0.18em",textTransform:"uppercase",padding:"10px 14px",cursor:"pointer",color:a?C.goldLight:"#6b6459",background:"none",border:"none",borderBottom:`2px solid ${a?C.goldLight:"transparent"}`,whiteSpace:"nowrap"}),
  pg:{padding:"24px 32px",maxWidth:1140},
  ey:{fontFamily:font.sans,fontSize:8,letterSpacing:"0.5em",textTransform:"uppercase",color:C.gold,marginBottom:5},
  h1:{fontSize:20,fontWeight:"normal",marginBottom:5,lineHeight:1.3,fontFamily:font.serif},
  sub:{fontFamily:font.sans,fontSize:11,color:C.mid,marginBottom:20,lineHeight:1.7},
  card:(e={})=>({background:C.white,border:`1px solid ${C.border}`,padding:18,...e}),
  dark:(e={})=>({background:C.panel,padding:16,...e}),
  label:{fontFamily:font.sans,fontSize:8,letterSpacing:"0.35em",textTransform:"uppercase",color:C.gold,paddingBottom:4,borderBottom:`1px solid ${C.border}`,marginBottom:9,display:"block"},
  th:{textAlign:"left",fontSize:8,letterSpacing:"0.18em",textTransform:"uppercase",color:C.mid,padding:"6px 8px",borderBottom:`1px solid ${C.border}`,fontWeight:"normal",fontFamily:font.sans},
  td:(e={})=>({padding:"8px 8px",borderBottom:`1px solid #f0ebe0`,fontFamily:font.sans,fontSize:11,color:C.ink,verticalAlign:"top",...e}),
  badge:(col,bg)=>({display:"inline-block",background:bg||col+"18",color:col,fontFamily:font.sans,fontSize:8,padding:"2px 6px",letterSpacing:"0.06em",border:`1px solid ${col}30`,marginRight:3}),
  pill:(col,bg)=>({display:"inline-block",background:bg,color:col,fontFamily:font.sans,fontSize:8,padding:"2px 7px",border:`1px solid ${col}40`}),
  note:(e={})=>({background:"#faf8f4",border:`1px solid ${C.border}`,padding:"8px 12px",fontFamily:font.sans,fontSize:10,color:C.mid,lineHeight:1.7,...e}),
  inp:{width:"100%",padding:"6px 8px",border:`1px solid ${C.border}`,background:"#faf8f4",fontFamily:font.sans,fontSize:12,color:C.ink,outline:"none",boxSizing:"border-box"},
  inpL:{fontFamily:font.sans,fontSize:9,color:C.mid,display:"block",marginBottom:3},
  kpi:(col,bg)=>({background:bg,border:`1px solid ${col}30`,padding:"12px 14px",flex:1,minWidth:110}),
  kpiN:(col)=>({fontFamily:font.serif,fontSize:22,color:col,lineHeight:1}),
  kpiL:{fontFamily:font.sans,fontSize:8,letterSpacing:"0.18em",textTransform:"uppercase",color:C.mid,marginTop:3},
  btnGold:{fontFamily:font.sans,fontSize:8,letterSpacing:"0.2em",textTransform:"uppercase",padding:"8px 13px",cursor:"pointer",color:C.ink,background:C.goldLight,border:"none"},
  stepNum:(col)=>({width:26,height:26,borderRadius:"50%",background:col,color:C.white,fontFamily:font.sans,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}),
};

const riskLabel=(score)=>score<=8?{l:"Low",col:C.green,bg:C.greenBg}:score<=13?{l:"Medium",col:C.amber,bg:C.amberBg}:{l:"High",col:C.red,bg:C.redBg};
const stageCol=[null,C.sage,C.gold,C.slate];
const stageBg=[null,C.sageBg,C.goldBg,C.slateBg];

// ─── EXPORT ──────────────────────────────────────────────────────────────────
function exportCSV(){
  const rows=[
    ["TALIFA Sourcing Dashboard v3"],
    [new Date().toLocaleDateString()],
    [],
    ["SWITCH CONDITIONS"],
    ["Ingredient","Stage 1 Label","S1 Min Units","S1 Cash Buffer","S1 MOQ kg","S1 Cost/Unit","Stage 2 Label","S2 Min Units","S2 Cash Buffer","S2 MOQ kg","S2 Cost/Unit","S2 Margin Impact","Stage 3 Label","S3 Min Units","S3 Cash Buffer","S3 MOQ kg","S3 Cost/Unit","S3 Margin Impact","Readiness"],
    ...INGREDIENTS.map(i=>[i.name,i.switch.stage1.label,i.switch.stage1.minUnits,i.switch.stage1.cashBuffer,i.switch.stage1.moqKg,i.switch.stage1.costPerUnit,i.switch.stage2.label,i.switch.stage2.minUnits,i.switch.stage2.cashBuffer,i.switch.stage2.moqKg,i.switch.stage2.costPerUnit,i.switch.stage2.marginImpact+"%",i.switch.stage3.label,i.switch.stage3.minUnits,i.switch.stage3.cashBuffer,i.switch.stage3.moqKg,i.switch.stage3.costPerUnit,i.switch.stage3.marginImpact+"%",i.switch.readiness]),
    [],
    ["SUPPLIER RISK SCORES"],
    ["Supplier","Country","Quality","Lead Time","Logistics","MOQ Pressure","Documentation","Total Score","Risk Level","Cost Savings","Recommendation"],
    ...SUPPLIERS.map(sup=>{const t=Object.values(sup.risk).reduce((a,b)=>a+b,0);const r=riskLabel(t);return[sup.name,sup.country,sup.risk.quality,sup.risk.leadTime,sup.risk.logistics,sup.risk.moqPressure,sup.risk.documentation,t,r.l,sup.costSavings,sup.rec];}),
    [],
    ["CASH FLOW ANALYSIS"],
    ["Ingredient","MOQ kg","MOQ Total Cost CAD","Shipping+Duties","Total Upfront CAD","Break-even Units","Notes"],
    ...INGREDIENTS.filter(i=>i.phase>=2).map(i=>{
      const moqCost=i.switch.stage2.moqKg*(i.srcPrice*USD_CAD);
      const ship=moqCost*0.20;
      const total=moqCost+ship;
      const savPerUnit=i.caPrice-i.switch.stage2.costPerUnit;
      const be=savPerUnit>0?Math.ceil(total/savPerUnit*10):999;
      return[i.name,i.switch.stage2.moqKg,moqCost.toFixed(2),ship.toFixed(2),total.toFixed(2),be,i.switch.readiness];
    }),
  ];
  const csv=rows.map(r=>r.map(c=>{const str=String(c??"");return str.includes(",")||str.includes('"')?`"${str.replace(/"/g,'""')}"`:str;}).join(",")).join("\r\n");
  const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download="Talifa_v3.csv";a.style.display="none";
  document.body.appendChild(a);a.click();
  setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);},300);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: SWITCH CONDITIONS
// ═══════════════════════════════════════════════════════════════════════════════
function SwitchTab(){
  const [selected,setSelected]=useState(null);
  const ing=selected?INGREDIENTS.find(i=>i.id===selected):null;

  return(
    <div>
      <div style={{...s.note({marginBottom:16,background:C.goldBg,border:`1px solid ${C.gold}40`})}}>
        <strong>How to read this:</strong> Each ingredient has 3 stages. Stage 1 = buy Canadian now. Stage 2 = switch when you hit the minimum units/month. Stage 3 = full direct import at scale. Click any row to see full detail.
      </div>

      <div style={s.card({marginBottom:16})}>
        <span style={s.label}>Switch Conditions — All Ingredients</span>
        <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:900}}>
          <thead>
            <tr style={{background:"#f5f0e8"}}>
              <th style={s.th}>Ingredient</th>
              <th style={{...s.th,background:C.sageBg,color:C.sage}}>S1 — Buy CA Now</th>
              <th style={{...s.th,background:C.sageBg,color:C.sage}}>S1 Cash Buffer</th>
              <th style={{...s.th,background:C.goldBg,color:C.gold}}>S2 — Switch When</th>
              <th style={{...s.th,background:C.goldBg,color:C.gold}}>S2 Cash Buffer</th>
              <th style={{...s.th,background:C.goldBg,color:C.gold}}>S2 Margin ↑</th>
              <th style={{...s.th,background:C.slateBg,color:C.slate}}>S3 — Scale When</th>
              <th style={{...s.th,background:C.slateBg,color:C.slate}}>S3 Cash Buffer</th>
              <th style={{...s.th,background:C.slateBg,color:C.slate}}>S3 Margin ↑</th>
              <th style={s.th}>Phase</th>
            </tr>
          </thead>
          <tbody>
            {INGREDIENTS.map(ing=>(
              <tr key={ing.id} onClick={()=>setSelected(selected===ing.id?null:ing.id)}
                style={{cursor:"pointer",background:selected===ing.id?C.goldBg:"transparent"}}>
                <td style={s.td({fontFamily:font.serif,fontSize:13})}>{ing.name}</td>
                <td style={s.td({background:C.sageBg+"80",fontSize:10})}>{ing.switch.stage1.costPerUnit.toFixed(2)}/unit</td>
                <td style={s.td({background:C.sageBg+"80"})}><span style={s.badge(C.sage,C.sageBg)}>{fmt(ing.switch.stage1.cashBuffer,0)}</span></td>
                <td style={s.td({background:C.goldBg+"80",fontSize:10})}>{ing.switch.stage2.minUnits}+ units/mo</td>
                <td style={s.td({background:C.goldBg+"80"})}><span style={s.badge(C.gold,C.goldBg)}>{fmt(ing.switch.stage2.cashBuffer,0)}</span></td>
                <td style={s.td({background:C.goldBg+"80",color:C.sage,fontFamily:font.serif,fontSize:13})}>+{ing.switch.stage2.marginImpact}%</td>
                <td style={s.td({background:C.slateBg+"80",fontSize:10})}>{ing.switch.stage3.minUnits}+ units/mo</td>
                <td style={s.td({background:C.slateBg+"80"})}><span style={s.badge(C.slate,C.slateBg)}>{fmt(ing.switch.stage3.cashBuffer,0)}</span></td>
                <td style={s.td({background:C.slateBg+"80",color:C.sage,fontFamily:font.serif,fontSize:13})}>+{ing.switch.stage3.marginImpact}%</td>
                <td style={s.td()}><span style={s.pill(phaseColor[ing.phase],phaseBg[ing.phase])}>P{ing.phase}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {ing&&(
        <div style={{...s.card({borderLeft:`4px solid ${C.gold}`,marginBottom:16})}}>
          <div style={{fontFamily:font.serif,fontSize:18,color:C.ink,marginBottom:4}}>{ing.name} <span style={{fontFamily:font.sans,fontSize:10,color:C.mid}}>— {ing.inci}</span></div>
          <div style={{fontFamily:font.sans,fontSize:10,color:C.mid,marginBottom:14}}>{ing.switch.readiness}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            {[1,2,3].map(sn=>{
              const st=ing.switch[`stage${sn}`];
              return(
                <div key={sn} style={{background:stageBg[sn],border:`1px solid ${stageCol[sn]}30`,padding:"14px 16px"}}>
                  <div style={{fontFamily:font.sans,fontSize:8,letterSpacing:"0.3em",textTransform:"uppercase",color:stageCol[sn],marginBottom:8}}>{st.label}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {[
                      {l:"Min Units/mo",v:sn===1?"Any":st.minUnits+"+"},
                      {l:"Cash Buffer",v:fmt(st.cashBuffer,0)},
                      {l:"MOQ",v:st.moqKg+"kg"},
                      {l:"Cost/Unit",v:fmt(st.costPerUnit)},
                      {l:"Margin Impact",v:sn===1?"Baseline":"+"+st.marginImpact+"%"},
                    ].map(k=>(
                      <div key={k.l}>
                        <div style={{fontFamily:font.sans,fontSize:8,color:C.mid,letterSpacing:"0.1em",textTransform:"uppercase"}}>{k.l}</div>
                        <div style={{fontFamily:font.serif,fontSize:15,color:stageCol[sn]}}>{k.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{...s.card({borderLeft:`4px solid ${C.teal}`})}}>
        <span style={{...s.label,color:C.teal,borderColor:C.teal}}>When Talifa Should Switch from Local to Direct Sourcing</span>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
          {[
            {title:"Switch ONE ingredient",cond:"Selling 30–50 units/month of any product that uses it",action:"Start with castor oil or moringa — lowest risk, highest return on first India order.",col:C.sage,bg:C.sageBg},
            {title:"Switch a whole country",cond:"Hitting 80+ units/month total and have $1,500+ cash buffer",action:"Place first India order (VedaOils): castor + jojoba + moringa + EOs in one shipment.",col:C.gold,bg:C.goldBg},
            {title:"Switch to full direct",cond:"150+ units/month, customs broker engaged, COA system in place",action:"Add Ghana (shea+baobab) and Morocco (argan). Philippines last — only at 250+/mo.",col:C.slate,bg:C.slateBg},
          ].map(item=>(
            <div key={item.title} style={{background:item.bg,border:`1px solid ${item.col}30`,padding:"14px 16px"}}>
              <div style={{fontFamily:font.serif,fontSize:14,color:item.col,marginBottom:6}}>{item.title}</div>
              <div style={{fontFamily:font.sans,fontSize:10,color:C.mid,marginBottom:8}}><strong>When:</strong> {item.cond}</div>
              <div style={{fontFamily:font.sans,fontSize:10,color:C.ink,lineHeight:1.6}}>{item.action}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: SUPPLIER RISK
// ═══════════════════════════════════════════════════════════════════════════════
function RiskTab(){
  const dims=["quality","leadTime","logistics","moqPressure","documentation"];
  const dimLabels=["Quality Consistency","Lead Time Reliability","Logistics Complexity","MOQ Pressure","Documentation (COA/MSDS)"];

  return(
    <div>
      <div style={s.card({marginBottom:16})}>
        <span style={s.label}>Supplier Risk Scores — Visual Comparison</span>
        <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:780}}>
          <thead>
            <tr>
              <th style={s.th}>Supplier</th>
              <th style={s.th}>Country</th>
              {dimLabels.map(d=><th key={d} style={s.th}>{d}</th>)}
              <th style={s.th}>Total /25</th>
              <th style={s.th}>Risk</th>
              <th style={s.th}>Cost Saving</th>
              <th style={s.th}>Best For</th>
            </tr>
          </thead>
          <tbody>
            {SUPPLIERS.map((sup,si)=>{
              const total=Object.values(sup.risk).reduce((a,b)=>a+b,0);
              const r=riskLabel(total);
              return(
                <tr key={sup.id} style={{background:si%2===0?"transparent":"#faf8f4"}}>
                  <td style={s.td({fontFamily:font.serif,fontSize:13})}>{sup.name}</td>
                  <td style={s.td({fontSize:10})}>{sup.country}</td>
                  {dims.map(d=>{
                    const v=sup.risk[d];
                    const dc=v<=1?C.green:v<=2?C.gold:v<=3?C.amber:C.red;
                    return(
                      <td key={d} style={s.td({textAlign:"center"})}>
                        <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"center"}}>
                          {[1,2,3,4,5].map(n=>(
                            <div key={n} style={{width:8,height:8,borderRadius:"50%",background:n<=v?dc:"#e8e0d4"}}/>
                          ))}
                          <span style={{fontFamily:font.sans,fontSize:10,color:dc,marginLeft:2}}>{v}</span>
                        </div>
                      </td>
                    );
                  })}
                  <td style={s.td({fontFamily:font.serif,fontSize:15,color:r.col,textAlign:"center"})}><strong>{total}</strong></td>
                  <td style={s.td({textAlign:"center"})}><span style={{...s.badge(r.col,r.bg),padding:"3px 8px"}}>{r.l}</span></td>
                  <td style={s.td({color:C.sage,fontFamily:font.serif,fontSize:13})}>{sup.costSavings}</td>
                  <td style={s.td({fontSize:10,color:C.mid,maxWidth:160})}>{sup.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
        <div style={s.note({marginTop:12})}>Score per dimension: 1 = Excellent, 2 = Good, 3 = Acceptable, 4 = Risky, 5 = High risk. Total out of 25.</div>
      </div>

      <div style={s.card({marginBottom:16,borderLeft:`4px solid ${C.purple}`})}>
        <span style={{...s.label,color:C.purple,borderColor:C.purple}}>Recommendation Logic — When to Choose Higher Cost but Lower Risk Supplier</span>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[
            {title:"Choose Low Risk (Canadian) when…",items:["You have less than $1,000 cash buffer","You have an urgent production deadline within 2 weeks","It's your first batch of a new product formula","You haven't received or verified COA from the direct supplier yet","The ingredient is used at <1% in formula (EOs, actives) — cost difference is negligible"],col:C.sage,bg:C.sageBg},
            {title:"Choose Higher Saving (Direct) when…",items:["You've tested the supplier sample and approved COA","You have 4+ weeks lead time available before next batch","The ingredient is >10% of formula by weight (shea, castor, jojoba)","You have $800+ cash buffer above your operating minimum","You're reordering — not first-time testing"],col:C.gold,bg:C.goldBg},
          ].map(item=>(
            <div key={item.title} style={{background:item.bg,border:`1px solid ${item.col}30`,padding:"14px 16px"}}>
              <div style={{fontFamily:font.serif,fontSize:13,color:item.col,marginBottom:10}}>{item.title}</div>
              {item.items.map((it,i)=>(
                <div key={i} style={{fontFamily:font.sans,fontSize:11,color:C.ink,padding:"5px 0",borderBottom:`1px solid ${item.col}20`,lineHeight:1.6}}>· {it}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={s.card()}>
        <span style={s.label}>Cost Saving vs Risk Level — Quick View</span>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {SUPPLIERS.map(sup=>{
            const total=Object.values(sup.risk).reduce((a,b)=>a+b,0);
            const r=riskLabel(total);
            return(
              <div key={sup.id} style={{background:r.bg,border:`2px solid ${r.col}40`,padding:"12px 14px",flex:1,minWidth:140}}>
                <div style={{fontFamily:font.serif,fontSize:13,color:C.ink,marginBottom:4}}>{sup.name}</div>
                <div style={{fontFamily:font.sans,fontSize:9,color:C.mid,marginBottom:8}}>{sup.country}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontFamily:font.sans,fontSize:8,color:C.mid,letterSpacing:"0.1em",textTransform:"uppercase"}}>Saving</div>
                    <div style={{fontFamily:font.serif,fontSize:16,color:C.sage}}>{sup.costSavings}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:font.sans,fontSize:8,color:C.mid,letterSpacing:"0.1em",textTransform:"uppercase"}}>Risk</div>
                    <div style={{...s.badge(r.col,r.bg),fontSize:10,padding:"3px 8px"}}>{r.l} ({total}/25)</div>
                  </div>
                </div>
                <div style={{fontFamily:font.sans,fontSize:9,color:C.mid,marginTop:8,lineHeight:1.5}}>{sup.rec}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: CASH FLOW
// ═══════════════════════════════════════════════════════════════════════════════
function CashFlowTab(){
  const [monthlyUnits,setMonthlyUnits]=useState(40);
  const [cashBuffer,setCashBuffer]=useState(1500);
  const [avgRetail,setAvgRetail]=useState(42);

  const p2Ingredients=INGREDIENTS.filter(i=>i.phase===2);

  const rows=p2Ingredients.map(ing=>{
    const moqKg=ing.switch.stage2.moqKg;
    const moqCost=moqKg*(ing.srcPrice*USD_CAD);
    const ship=moqCost*0.20;
    const total=moqCost+ship;
    const savPerUnit=ing.caPrice-ing.switch.stage2.costPerUnit;
    const beUnits=savPerUnit>0?Math.ceil(total/savPerUnit*10):9999;
    const monthsToRecover=savPerUnit>0?Math.ceil(beUnits/Math.max(1,monthlyUnits*0.1)):99;
    const canAfford=cashBuffer>=ing.switch.stage2.cashBuffer;
    const hasVolume=monthlyUnits>=ing.switch.stage2.minUnits;
    return{ing,moqKg,moqCost,ship,total,savPerUnit,beUnits,monthsToRecover,canAfford,hasVolume};
  });

  const totalUpfront=rows.filter(r=>r.canAfford&&r.hasVolume).reduce((a,r)=>a+r.total,0);
  const totalMonthSaving=rows.filter(r=>r.canAfford&&r.hasVolume).reduce((a,r)=>a+r.savPerUnit*monthlyUnits*0.1,0);

  const safeRows=rows.filter(r=>r.canAfford&&r.hasVolume);
  const riskyRows=rows.filter(r=>!r.canAfford||!r.hasVolume);

  return(
    <div>
      <div style={{...s.card({marginBottom:16,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16})}}>
        <div><label style={s.inpL}>Monthly Units Sold (avg. across all products)</label><input style={s.inp} type="number" value={monthlyUnits} onChange={e=>setMonthlyUnits(parseInt(e.target.value)||1)}/></div>
        <div><label style={s.inpL}>Available Cash Buffer (CAD)</label><input style={s.inp} type="number" value={cashBuffer} onChange={e=>setCashBuffer(parseInt(e.target.value)||0)}/></div>
        <div><label style={s.inpL}>Avg. Retail Price per Unit (CAD)</label><input style={s.inp} type="number" value={avgRetail} onChange={e=>setAvgRetail(parseInt(e.target.value)||1)}/></div>
      </div>

      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        {[
          {l:"Affordable Switches Now",v:safeRows.length+" ingredients",col:C.sage,bg:C.sageBg},
          {l:"Total Upfront (safe switches)",v:fmt(totalUpfront,0),col:C.gold,bg:C.goldBg},
          {l:"Est. Monthly Saving After",v:fmt(totalMonthSaving,0)+"/mo",col:C.teal,bg:C.tealBg},
          {l:"Payback Period",v:totalMonthSaving>0?Math.ceil(totalUpfront/totalMonthSaving)+"mo":"n/a",col:C.slate,bg:C.slateBg},
        ].map((k,i)=>(
          <div key={i} style={s.kpi(k.col,k.bg)}>
            <div style={s.kpiN(k.col)}>{k.v}</div>
            <div style={s.kpiL}>{k.l}</div>
          </div>
        ))}
      </div>

      <div style={s.card({marginBottom:16})}>
        <span style={s.label}>Cash Flow Analysis — Phase 2 Ingredients</span>
        <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:760}}>
          <thead>
            <tr>
              {["Ingredient","MOQ kg","MOQ Cost","+ Shipping","Total Upfront","Save/Unit","Break-even Units","Recover in","Can Afford?","Volume Ready?"].map(h=><th key={h} style={s.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.ing.id} style={{background:i%2===0?"transparent":"#faf8f4"}}>
                <td style={s.td({fontFamily:font.serif,fontSize:13})}>{r.ing.name}</td>
                <td style={s.td()}>{r.moqKg} kg</td>
                <td style={s.td({fontFamily:font.serif,fontSize:12})}>{fmt(r.moqCost)}</td>
                <td style={s.td({fontFamily:font.serif,fontSize:12,color:C.mid})}>{fmt(r.ship)}</td>
                <td style={s.td({fontFamily:font.serif,fontSize:14,color:C.gold})}>{fmt(r.total)}</td>
                <td style={s.td({fontFamily:font.serif,fontSize:13,color:C.sage})}>{fmt(r.savPerUnit)}</td>
                <td style={s.td({fontFamily:font.serif,fontSize:13})}>{r.beUnits} units</td>
                <td style={s.td({fontFamily:font.serif,fontSize:13,color:r.monthsToRecover<=3?C.sage:r.monthsToRecover<=6?C.gold:C.red})}>{r.monthsToRecover} mo</td>
                <td style={s.td()}><span style={s.badge(r.canAfford?C.sage:C.red,r.canAfford?C.sageBg:C.redBg)}>{r.canAfford?"✓ Yes":"✗ No"}</span></td>
                <td style={s.td()}><span style={s.badge(r.hasVolume?C.sage:C.amber,r.hasVolume?C.sageBg:C.amberBg)}>{r.hasVolume?"✓ Yes":"Not yet"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={{...s.card({borderLeft:`4px solid ${C.sage}`})}}>
          <div style={{fontFamily:font.serif,fontSize:15,color:C.sage,marginBottom:10}}>✓ Safe Switch Scenario</div>
          <div style={{fontFamily:font.sans,fontSize:11,color:C.mid,marginBottom:10}}>Based on your inputs: {safeRows.length} ingredients ready to switch now.</div>
          {safeRows.length>0?safeRows.map(r=>(
            <div key={r.ing.id} style={{padding:"6px 0",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
              <span style={{fontFamily:font.sans,fontSize:11}}>{r.ing.name}</span>
              <span style={{fontFamily:font.serif,fontSize:13,color:C.sage}}>{fmt(r.total)} upfront → recover in {r.monthsToRecover}mo</span>
            </div>
          )):<div style={{fontFamily:font.sans,fontSize:11,color:C.mid}}>No safe switches at current volume/buffer. Increase monthly units or cash buffer.</div>}
          {safeRows.length>0&&<div style={{marginTop:10,fontFamily:font.serif,fontSize:14,color:C.sage}}>Total: {fmt(totalUpfront,0)} upfront · {fmt(totalMonthSaving,0)}/mo saving</div>}
        </div>
        <div style={{...s.card({borderLeft:`4px solid ${C.amber}`})}}>
          <div style={{fontFamily:font.serif,fontSize:15,color:C.amber,marginBottom:10}}>⚠ Not Ready Yet — {riskyRows.length} ingredients</div>
          <div style={{fontFamily:font.sans,fontSize:11,color:C.mid,marginBottom:10}}>These switches would stretch cash or require more volume.</div>
          {riskyRows.map(r=>(
            <div key={r.ing.id} style={{padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontFamily:font.sans,fontSize:11}}>{r.ing.name}</span>
                <span style={{fontFamily:font.serif,fontSize:12,color:C.amber}}>{fmt(r.total,0)} needed</span>
              </div>
              <div style={{fontFamily:font.sans,fontSize:10,color:C.mid}}>
                {!r.canAfford&&`Needs ${fmt(r.ing.switch.stage2.cashBuffer,0)} buffer (you have ${fmt(cashBuffer,0)}). `}
                {!r.hasVolume&&`Needs ${r.ing.switch.stage2.minUnits}+/mo (you have ${monthlyUnits}).`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: QUALITY VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════
function QualityTab(){
  const initState=()=>Object.fromEntries(SUPPLIERS.filter(s=>s.country!=="Canada 🇨🇦").map(s=>[s.id,{steps:{sample:false,coa:false,sensory:false,smallbatch:false,stability:false},notes:"",decision:"pending"}]));
  const [state,setState]=useState(initState);
  const toggleStep=(supId,step)=>setState(p=>({...p,[supId]:{...p[supId],steps:{...p[supId].steps,[step]:!p[supId].steps[step]}}}));
  const setDecision=(supId,d)=>setState(p=>({...p,[supId]:{...p[supId],decision:d}}));
  const setNote=(supId,v)=>setState(p=>({...p,[supId]:{...p[supId],notes:v}}));

  const steps=[
    {id:"sample",    label:"1. Sample Testing",      desc:"Request sample from supplier. Test appearance, smell, texture. Compare to Canadian equiv."},
    {id:"coa",       label:"2. COA Verification",    desc:"Check Certificate of Analysis: INCI name, purity %, heavy metals, microbial count, peroxide value."},
    {id:"sensory",   label:"3. Sensory Evaluation",  desc:"Smell (rancidity check), texture (viscosity), colour (matches spec). Document observations."},
    {id:"smallbatch",label:"4. Small Batch Test",    desc:"Make a 10–20 unit test batch using this ingredient. Evaluate performance in formula."},
    {id:"stability", label:"5. Stability Check",     desc:"Store finished product at room temp + 40°C for 4 weeks. Check for separation, colour change, odour shift."},
  ];

  const decisionConfig={
    approved:{col:C.green,bg:C.greenBg,label:"✓ Approved"},
    conditional:{col:C.amber,bg:C.amberBg,label:"⚡ Conditional"},
    rejected:{col:C.red,bg:C.redBg,label:"✗ Rejected"},
    pending:{col:C.mid,bg:"#f5f0e8",label:"◯ Pending"},
  };

  const batchFields=["Batch ID","Date Made","Product","Units Made","Ingredient IDs Used","Supplier Names","COA Lot Numbers","Notes / Issues"];

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
        {SUPPLIERS.filter(s=>s.country!=="Canada 🇨🇦").map(sup=>{
          const st=state[sup.id];
          const completedSteps=Object.values(st.steps).filter(Boolean).length;
          const dc=decisionConfig[st.decision];
          return(
            <div key={sup.id} style={{...s.card({borderLeft:`4px solid ${dc.col}`})}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{fontFamily:font.serif,fontSize:15,color:C.ink}}>{sup.name}</div>
                  <div style={{fontFamily:font.sans,fontSize:10,color:C.mid,marginTop:2}}>{sup.country} · {sup.ingredients.map(i=>INGREDIENTS.find(x=>x.id===i)?.name||i).join(", ")}</div>
                </div>
                <span style={{...s.badge(dc.col,dc.bg),fontSize:9,padding:"3px 9px"}}>{dc.label}</span>
              </div>

              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{flex:1,height:4,background:"#e8e0d4",borderRadius:2}}>
                  <div style={{width:`${completedSteps/5*100}%`,height:4,background:dc.col,borderRadius:2,transition:"width 0.3s"}}/>
                </div>
                <span style={{fontFamily:font.sans,fontSize:10,color:C.mid}}>{completedSteps}/5</span>
              </div>

              {steps.map(step=>(
                <div key={step.id} onClick={()=>toggleStep(sup.id,step.id)}
                  style={{display:"flex",gap:8,padding:"6px 0",borderBottom:`1px solid #f0ebe0`,cursor:"pointer",alignItems:"flex-start"}}>
                  <div style={{width:16,height:16,border:`2px solid ${st.steps[step.id]?C.sage:C.border}`,background:st.steps[step.id]?C.sage:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                    {st.steps[step.id]&&<span style={{color:C.white,fontSize:10}}>✓</span>}
                  </div>
                  <div>
                    <div style={{fontFamily:font.sans,fontSize:11,color:st.steps[step.id]?C.mid:C.ink,fontWeight:st.steps[step.id]?"normal":"500"}}>{step.label}</div>
                    <div style={{fontFamily:font.sans,fontSize:9.5,color:C.mid,lineHeight:1.5}}>{step.desc}</div>
                  </div>
                </div>
              ))}

              <div style={{marginTop:10}}>
                <div style={s.inpL}>Notes</div>
                <textarea value={st.notes} onChange={e=>setNote(sup.id,e.target.value)}
                  style={{...s.inp,height:52,resize:"vertical",fontSize:10}} placeholder="Sensory notes, COA issues, batch observations…"/>
              </div>

              <div style={{display:"flex",gap:6,marginTop:10}}>
                {Object.entries(decisionConfig).filter(([k])=>k!=="pending").map(([key,cfg])=>(
                  <button key={key} onClick={()=>setDecision(sup.id,key)}
                    style={{flex:1,fontFamily:font.sans,fontSize:8,letterSpacing:"0.1em",padding:"6px 0",cursor:"pointer",color:st.decision===key?C.white:cfg.col,background:st.decision===key?cfg.col:cfg.bg,border:`1px solid ${cfg.col}40`}}>
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={s.card({borderLeft:`4px solid ${C.teal}`})}>
        <span style={{...s.label,color:C.teal,borderColor:C.teal}}>Batch Tracking Structure — Simple & Scalable</span>
        <div style={{fontFamily:font.sans,fontSize:11,color:C.mid,marginBottom:12}}>Copy this structure into a Google Sheet. One row per production batch. Link COA files in a shared Drive folder named by lot number.</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
          {batchFields.map((f,i)=>(
            <div key={i} style={{background:C.tealBg,border:`1px solid ${C.teal}30`,padding:"8px 12px",fontFamily:font.sans,fontSize:10,color:C.teal}}>
              <span style={{fontFamily:font.sans,fontSize:8,color:C.mid,display:"block",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2}}>Column {i+1}</span>
              {f}
            </div>
          ))}
        </div>
        <div style={s.note()}>
          <strong>Naming convention:</strong> TLF-[PRODUCT]-[YYYYMMDD]-[SEQ] e.g. TLF-MAVKA-20260503-001 · Store COA PDFs in: /COAs/[SupplierName]/[LotNumber].pdf · Review batch records monthly.
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: EXECUTION DASHBOARD (Founder View)
// ═══════════════════════════════════════════════════════════════════════════════
function ExecutionTab(){
  const [monthlyUnits,setMonthlyUnits]=useState(30);
  const [cashBuffer,setCashBuffer]=useState(800);

  const getMode=()=>{
    if(monthlyUnits<30&&cashBuffer<600) return{label:"Early Launch Mode",col:C.sage,bg:C.sageBg,desc:"Buy everything Canadian. Focus 100% on sales and formula refinement. Zero sourcing complexity."};
    if(monthlyUnits<80&&cashBuffer<1500) return{label:"Growth Mode — Phase 2 Prep",col:C.gold,bg:C.goldBg,desc:"Start India order (VedaOils). 1 shipment, 8 ingredients, biggest ROI. Keep Canadian as backup."};
    return{label:"Scale Mode — Full Direct",col:C.slate,bg:C.slateBg,desc:"India running. Add Ghana (shea+baobab) and Morocco (argan). Customs broker engaged."};
  };

  const mode=getMode();

  const nextMoves=[
    {rank:1,title:"India Order — VedaOils",saving:"$180–420/mo",effort:"Low",action:"Email VedaOils for samples: castor, jojoba, moringa, peppermint EO. One order, one shipment, 4 ingredients.",ready:monthlyUnits>=30&&cashBuffer>=800},
    {rank:2,title:"Ghana Order — Baraka",saving:"$120–280/mo",effort:"Medium",action:"Combine shea + baobab in one order. Plan 6 weeks lead time. Request COA and sample first.",ready:monthlyUnits>=50&&cashBuffer>=1200},
    {rank:3,title:"Morocco — Bulk Moroccan Oil",saving:"$60–140/mo",effort:"Low-Medium",action:"Order 1L argan. USDA Organic certified, low MOQ. Works with same Phase 2 customs setup.",ready:monthlyUnits>=40&&cashBuffer>=900},
  ];

  const highImpact=[
    {ing:"Baobab Oil",saving:48,marginUp:"+6–9%",action:"Combine with shea — same Ghana supplier. Biggest % saving on a premium ingredient."},
    {ing:"Moringa Oil",saving:61,marginUp:"+5–8%",action:"Add to India order. Low MOQ (500g). Low risk, high return."},
    {ing:"Argan Oil",saving:32,marginUp:"+4–8%",action:"Morocco switch. Premium brand story (USDA Organic women's cooperative). Hero ingredient."},
  ];

  const doNotTouch=[
    {item:"Philippines (Babassu/VCO)",why:"Logistics too complex. 83% saving not worth the risk until 250+ units/month."},
    {item:"Bulk sea freight",why:"Not economical until ordering 50kg+ per ingredient. Air/courier is better for now."},
    {item:"Multiple suppliers same ingredient",why:"Adds COA complexity and formula inconsistency risk. One supplier per ingredient to start."},
    {item:"Retail (Whole Foods, Shoppers)",why:"Need 6+ months sales history and velocity data. Build DTC and salon channel first."},
  ];

  const thisMonth=monthlyUnits<30?[
    "Finalise product formulas — lock ingredients list per product",
    "Set up Health Canada cosmetic notification (free, takes 30 min)",
    "Create batch record spreadsheet — even 5 columns is enough",
    "Open accounts at NDA Canada and Pure Blend Naturals",
    "Post 3x/week on Instagram and TikTok — organic content only",
  ]:monthlyUnits<80?[
    "Email VedaOils India — request samples + COA for castor, jojoba, moringa",
    "Register CBSA import account (cbsa.gc.ca) — takes 1–3 days, free",
    "Build 1-page wholesale sheet for local barber/salon outreach",
    "Calculate your actual COGS per product — use the Batch Planner tab",
    "Open Shopify store if not yet live",
  ]:[
    "Place first India order (VedaOils) — castor, jojoba, moringa, EOs",
    "Contact Baraka (Ghana) for shea + baobab quote and sample",
    "Engage a customs broker (Livingston or Flexport) for first shipment",
    "Set up GS1 Canada account for UPC barcodes",
    "Pitch 5 local salons/barbers with sample set + wholesale price sheet",
  ];

  const ignoreNow=monthlyUnits<80?[
    "Direct import — you're not there yet",
    "Retail buyers — build DTC and salon volume first",
    "Philippines sourcing — far too complex for this stage",
    "Paid ads — organic content first, ads waste money before product-market fit",
  ]:[
    "Philippines (Babassu) — Phase 3 only, 250+ units needed",
    "National retail (Whole Foods, Shoppers) — need 6 months data first",
    "Multiple suppliers per ingredient — adds COA and formula risk",
  ];

  return(
    <div>
      <div style={{...s.card({marginBottom:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:16})}}>
        <div><label style={s.inpL}>Monthly Units Sold (all products combined)</label><input style={s.inp} type="number" value={monthlyUnits} onChange={e=>setMonthlyUnits(parseInt(e.target.value)||0)}/></div>
        <div><label style={s.inpL}>Available Cash Buffer (CAD)</label><input style={s.inp} type="number" value={cashBuffer} onChange={e=>setCashBuffer(parseInt(e.target.value)||0)}/></div>
      </div>

      <div style={{...s.card({borderLeft:`4px solid ${mode.col}`,marginBottom:16,background:mode.bg})}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
          <div style={{fontFamily:font.sans,fontSize:8,letterSpacing:"0.35em",textTransform:"uppercase",color:mode.col}}>Current Operating Mode</div>
        </div>
        <div style={{fontFamily:font.serif,fontSize:22,color:mode.col,marginBottom:6}}>{mode.label}</div>
        <div style={{fontFamily:font.sans,fontSize:12,color:C.ink,lineHeight:1.7}}>{mode.desc}</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <div style={{...s.card({borderLeft:`4px solid ${C.sage}`})}}>
          <span style={{...s.label,color:C.sage,borderColor:C.sage}}>👁 Founder View — Focus This Month</span>
          {thisMonth.map((item,i)=>(
            <div key={i} style={{display:"flex",gap:8,padding:"7px 0",borderBottom:`1px solid #f0ebe0`}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:C.sageBg,border:`1px solid ${C.sage}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:font.sans,fontSize:9,color:C.sage}}>{i+1}</div>
              <div style={{fontFamily:font.sans,fontSize:11,color:C.ink,lineHeight:1.6,paddingTop:1}}>{item}</div>
            </div>
          ))}
        </div>

        <div style={{...s.card({borderLeft:`4px solid ${C.mid}`})}}>
          <span style={{...s.label,color:C.mid,borderColor:C.mid}}>🚫 Ignore For Now</span>
          {ignoreNow.map((item,i)=>(
            <div key={i} style={{display:"flex",gap:8,padding:"7px 0",borderBottom:`1px solid #f0ebe0`}}>
              <div style={{fontFamily:font.sans,fontSize:14,color:C.mid,flexShrink:0,marginTop:1}}>—</div>
              <div style={{fontFamily:font.sans,fontSize:11,color:C.mid,lineHeight:1.6}}>{item}</div>
            </div>
          ))}
          <div style={s.note({marginTop:12})}>These are not bad ideas — they're just not the right move yet. Revisit when you hit 80+ units/month.</div>
        </div>
      </div>

      <div style={s.card({marginBottom:14})}>
        <span style={s.label}>Next Upgrade Opportunities — Top 3 Cost-Saving Moves</span>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          {nextMoves.map(m=>(
            <div key={m.rank} style={{background:m.ready?C.sageBg:C.amberBg,border:`1px solid ${m.ready?C.sage:C.amber}40`,padding:"14px 15px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontFamily:font.sans,fontSize:8,letterSpacing:"0.2em",textTransform:"uppercase",color:m.ready?C.sage:C.amber}}>#{m.rank} Priority</div>
                <span style={s.badge(m.ready?C.sage:C.amber,m.ready?C.sageBg:C.amberBg)}>{m.ready?"Ready":"Not yet"}</span>
              </div>
              <div style={{fontFamily:font.serif,fontSize:14,color:C.ink,marginBottom:4}}>{m.title}</div>
              <div style={{fontFamily:font.sans,fontSize:11,color:C.sage,marginBottom:8,fontWeight:"bold"}}>{m.saving} saving</div>
              <div style={{fontFamily:font.sans,fontSize:10,color:C.mid,lineHeight:1.6}}>{m.action}</div>
              <div style={{fontFamily:font.sans,fontSize:9,color:C.mid,marginTop:6}}>Effort: {m.effort}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.card({marginBottom:14})}>
        <span style={s.label}>⚡ High Impact Switches — Biggest Margin Improvements</span>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Ingredient","Direct Saving","Margin Impact","What to Do"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>
            {highImpact.map((h,i)=>(
              <tr key={i}>
                <td style={s.td({fontFamily:font.serif,fontSize:13})}>{h.ing}</td>
                <td style={s.td()}><span style={s.badge(C.sage,C.sageBg)}>↓{h.saving}%</span></td>
                <td style={s.td({fontFamily:font.serif,fontSize:14,color:C.sage})}>{h.marginUp}</td>
                <td style={s.td({fontSize:11,color:C.mid,lineHeight:1.6})}>{h.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={s.card({borderLeft:`4px solid ${C.red}`})}>
        <span style={{...s.label,color:C.red,borderColor:C.red}}>🔴 Do Not Touch Yet — Too Early / High Risk</span>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {doNotTouch.map((d,i)=>(
            <div key={i} style={{background:C.redBg,border:`1px solid ${C.red}20`,padding:"10px 12px"}}>
              <div style={{fontFamily:font.sans,fontSize:12,color:C.red,marginBottom:3}}>{d.item}</div>
              <div style={{fontFamily:font.sans,fontSize:10,color:C.mid,lineHeight:1.6}}>{d.why}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: ROADMAP
// ═══════════════════════════════════════════════════════════════════════════════
function RoadmapTab(){
  return(
    <div>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:18}}>
        {[
          {l:"Phase 1 — Buy Now",v:INGREDIENTS.filter(i=>i.phase===1).length+" ingredients",col:C.sage,bg:C.sageBg,s:"Canadian distributors, zero friction"},
          {l:"Phase 2 — Est. Monthly Saving",v:"$180–420/mo",col:C.gold,bg:C.goldBg,s:"After first India + Ghana order"},
          {l:"Time to First Import",v:"3–6 mo",col:C.slate,bg:C.slateBg,s:"No rush — formulate first"},
          {l:"Source Countries",v:"4",col:C.rust,bg:C.rustBg,s:"India · Ghana · Morocco · PH"},
        ].map((k,i)=>(
          <div key={i} style={s.kpi(k.col,k.bg)}>
            <div style={s.kpiN(k.col)}>{k.v}</div>
            <div style={s.kpiL}>{k.l}</div>
            <div style={{fontFamily:font.sans,fontSize:10,color:C.mid,marginTop:3}}>{k.s}</div>
          </div>
        ))}
      </div>
      {[1,2,3].map(ph=>{
        const items=INGREDIENTS.filter(i=>i.phase===ph);
        const labels=["Phase 1 — Buy Canadian Now","Phase 2 — First Switch (India + Ghana)","Phase 3 — Full Direct (Philippines)"];
        const descs=["Zero import. Focus on formula & first sales.","Highest savings, manageable complexity. Start with VedaOils India.","Philippines for babassu/VCO. Only at 250+ units/month."];
        return(
          <div key={ph} style={{...s.card({marginBottom:14,borderLeft:`4px solid ${phaseColor[ph]}`})}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={s.stepNum(phaseColor[ph])}>{ph}</div>
              <div>
                <div style={{fontSize:15,fontFamily:font.serif}}>{labels[ph-1]}</div>
                <div style={{fontFamily:font.sans,fontSize:10,color:C.mid,marginTop:2}}>{descs[ph-1]}</div>
              </div>
            </div>
            <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:560}}>
              <thead><tr>{["Ingredient","Products","CA/kg","Source","Save/kg","Save %","Supplier","MOQ"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {items.map(ing=>{
                  const srcCAD=ing.srcPrice*USD_CAD*1.2;
                  const saving=ing.caPrice-srcCAD;
                  const good=saving>1.5;
                  return(
                    <tr key={ing.id}>
                      <td style={s.td({fontFamily:font.serif,fontSize:13})}>{ing.name}</td>
                      <td style={s.td({fontSize:10})}>{ing.products.map(p=><span key={p} style={s.badge(C.slate,C.slateBg)}>{p}</span>)}</td>
                      <td style={s.td({fontFamily:font.serif,fontSize:12,color:C.mid})}>{fmt(ing.caPrice)}</td>
                      <td style={s.td({fontFamily:font.serif,fontSize:12,color:ph===1?C.mid:C.gold})}>{ph===1?"Buy CA":`${fmt(ing.srcPrice)} USD`}</td>
                      <td style={s.td({fontFamily:font.serif,fontSize:12,color:good?C.sage:C.mid})}>{good?fmt(saving):"—"}</td>
                      <td style={s.td()}>{good?<span style={{...s.badge(C.sage,C.sageBg),fontWeight:"bold"}}>↓{pct(ing.caPrice,srcCAD)}%</span>:"n/a"}</td>
                      <td style={s.td({fontSize:10,color:C.mid})}>{ing.supplier}</td>
                      <td style={s.td({fontSize:11})}>{ing.moq}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: MARGIN CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════════
function CalcTab(){
  const ingDef={MAVKA:[6.50,3.80],NYANGA:[5.80,3.20],PAPI:[3.40,1.90],OTAMAN:[3.20,1.80],BORODA:[3.60,2.00]};
  const pkgDef={MAVKA:2.30,NYANGA:1.65,PAPI:1.30,OTAMAN:1.30,BORODA:1.30};
  const [v,setV]=useState({product:"MAVKA",ingCA:6.50,ingDirect:3.80,useDirect:false,pkg:2.20,labor:2.00,overhead:15,retTarget:60,wsTarget:50,units:30});
  const upd=(k,val)=>setV(p=>({...p,[k]:val}));
  const pm=PRODUCT_META[v.product];
  const ingCost=parseFloat(v.useDirect?v.ingDirect:v.ingCA)||0;
  const pkg=parseFloat(v.pkg)||0;const labor=parseFloat(v.labor)||0;
  const cogs=ingCost+pkg+labor;const ohAmt=cogs*((parseFloat(v.overhead)||0)/100);
  const selfPrice=cogs+ohAmt;
  const sugRet=selfPrice/(1-(parseFloat(v.retTarget)||60)/100);
  const sugWs=selfPrice/(1-(parseFloat(v.wsTarget)||50)/100);
  const curRetM=(pm.retail-selfPrice)/pm.retail*100;
  const curWsM=(pm.ws-selfPrice)/pm.ws*100;
  const units=parseInt(v.units)||30;
  const mH=(p)=>p>=55?{label:"Strong ✓",col:C.sage,bg:C.sageBg}:p>=38?{label:"Acceptable",col:C.gold,bg:C.goldBg}:{label:"Thin ⚠",col:C.red,bg:C.redBg};
  return(
    <div style={s.card()}>
      <span style={s.label}>Select Product</span>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14}}>
        {PRODUCTS.map(p=><button key={p} onClick={()=>setV(prev=>({...prev,product:p,ingCA:ingDef[p][0],ingDirect:ingDef[p][1],pkg:pkgDef[p]}))} style={{fontFamily:font.sans,fontSize:8,letterSpacing:"0.15em",textTransform:"uppercase",padding:"7px 12px",cursor:"pointer",color:v.product===p?C.white:C.mid,background:v.product===p?C.panel:"transparent",border:`1px solid ${v.product===p?C.panel:C.border}`}}>{p}</button>)}
      </div>
      <div style={{fontFamily:font.sans,fontSize:11,color:C.mid,marginBottom:16}}>{pm.type} · Retail <strong style={{color:C.ink}}>${pm.retail}</strong> · Wholesale <strong style={{color:C.ink}}>${pm.ws}</strong></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:22}}>
        <div>
          <span style={s.label}>Pricing Mode</span>
          <div style={{background:"#f5f0e8",border:`1px solid ${C.border}`,padding:"10px 12px",marginBottom:14}}>
            {[false,true].map(d=><label key={String(d)} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontFamily:font.sans,fontSize:11,color:v.useDirect===d?C.ink:C.mid,marginBottom:5}}><input type="radio" checked={v.useDirect===d} onChange={()=>upd("useDirect",d)}/>{d?`Direct (P2) $${v.ingDirect}/unit`:`Canadian (P1) $${v.ingCA}/unit`}</label>)}
          </div>
          <span style={s.label}>Inputs (CAD / unit)</span>
          {[{l:"Ingredient Cost ($)",k:"ingCA",hide:v.useDirect},{l:"Packaging ($)",k:"pkg"},{l:"Labor ($)",k:"labor"},{l:"Overhead (%)",k:"overhead"},{l:"Monthly Units",k:"units"}].filter(f=>!f.hide).map(f=><div key={f.k} style={{marginBottom:9}}><label style={s.inpL}>{f.l}</label><input style={s.inp} type="number" step="0.01" value={v[f.k]} onChange={e=>upd(f.k,e.target.value)}/></div>)}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            {[{l:"Retail Margin %",k:"retTarget"},{l:"Wholesale Margin %",k:"wsTarget"}].map(f=><div key={f.k}><label style={s.inpL}>{f.l}</label><input style={s.inp} type="number" step="1" value={v[f.k]} onChange={e=>upd(f.k,e.target.value)}/></div>)}
          </div>
        </div>
        <div>
          <span style={s.label}>Results</span>
          <div style={s.dark({marginBottom:11})}>
            {[{l:"Ingredients",v:ingCost},{l:"+ Packaging",v:pkg},{l:"+ Labor",v:labor},{l:`+ Overhead (${v.overhead}%)`,v:ohAmt}].map(r=><div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}><span style={{fontFamily:font.sans,fontSize:9,color:"#6b6459",textTransform:"uppercase"}}>{r.l}</span><span style={{fontFamily:font.serif,fontSize:13,color:"#e0d8c8"}}>{fmt(r.v)}</span></div>)}
            <div style={{display:"flex",justifyContent:"space-between",padding:"9px 0 0"}}><span style={{fontFamily:font.sans,fontSize:8,color:C.goldLight,letterSpacing:"0.15em",textTransform:"uppercase"}}>Self Price</span><span style={{fontFamily:font.serif,fontSize:20,color:C.goldLight}}>{fmt(selfPrice)}</span></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:11}}>
            {[{label:"Suggested Retail",sug:sugRet,cur:pm.retail,m:v.retTarget,curM:curRetM},{label:"Suggested Wholesale",sug:sugWs,cur:pm.ws,m:v.wsTarget,curM:curWsM}].map(item=>{const h=mH(item.curM);return(<div key={item.label} style={{background:h.bg,border:`1px solid ${h.col}30`,padding:"11px 12px"}}><div style={{fontFamily:font.sans,fontSize:8,letterSpacing:"0.2em",textTransform:"uppercase",color:C.mid,marginBottom:3}}>{item.label}</div><div style={{fontFamily:font.serif,fontSize:18}}>{fmt(item.sug)}</div><div style={{fontFamily:font.sans,fontSize:9,color:C.mid}}>at {item.m}%</div><span style={{...s.badge(h.col,h.bg),marginTop:6,fontSize:9,padding:"2px 7px"}}>{h.label}</span><div style={{fontFamily:font.sans,fontSize:10,color:C.mid,marginTop:5}}>{fmt(item.cur)} current → <strong>{item.curM.toFixed(1)}%</strong></div></div>);})}
          </div>
          <div style={{...s.dark({display:"grid",gridTemplateColumns:"1fr 1fr"})}}>
            {[{l:`Retail × ${units}`,v:(pm.retail-selfPrice)*units},{l:`Wholesale × ${units}`,v:(pm.ws-selfPrice)*units}].map((k,i)=><div key={i} style={{padding:"10px 13px",borderRight:i===0?"1px solid rgba(255,255,255,0.06)":undefined}}><div style={{fontFamily:font.sans,fontSize:8,color:"#6b6459",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>{k.l}</div><div style={{fontFamily:font.serif,fontSize:18,color:k.v>0?C.goldLight:C.red}}>{fmt(k.v,0)}</div></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: BATCH PLANNER
// ═══════════════════════════════════════════════════════════════════════════════
function BatchTab(){
  const [product,setProduct]=useState("MAVKA");const [units,setUnits]=useState(50);const [useDirect,setUseDirect]=useState(false);const [custom,setCustom]=useState({});
  const pm=PRODUCT_META[product];
  const rows=Object.entries(pm.defaultIng).map(([id])=>{
    const ing=INGREDIENTS.find(i=>i.id===id);
    const g=custom[id]!==undefined?parseFloat(custom[id])||0:(pm.defaultIng[id]||0);
    const totalG=g*units;const totalKg=totalG/1000;
    const price=useDirect?(ing?.srcCountry?.includes("Canada")?ing?.caPrice:(ing?.srcPrice||0)*USD_CAD*1.2):(ing?.caPrice||0);
    const cost=totalKg*price;
    return{id,ing,g,totalG,totalKg,price,cost};
  });
  const totalCost=rows.reduce((a,r)=>a+r.cost,0);const totalG=rows.reduce((a,r)=>a+r.totalG,0);
  return(
    <div>
      <div style={{...s.card({marginBottom:14,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,alignItems:"end"})}}>
        <div><span style={s.label}>Product</span><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{PRODUCTS.map(p=><button key={p} onClick={()=>{setProduct(p);setCustom({});}} style={{fontFamily:font.sans,fontSize:8,letterSpacing:"0.13em",textTransform:"uppercase",padding:"6px 10px",cursor:"pointer",color:product===p?C.white:C.mid,background:product===p?C.panel:"transparent",border:`1px solid ${product===p?C.panel:C.border}`}}>{p}</button>)}</div></div>
        <div><label style={s.inpL}>Units to Make</label><input style={s.inp} type="number" min="1" value={units} onChange={e=>setUnits(Math.max(1,parseInt(e.target.value)||1))}/></div>
        <div><label style={s.inpL}>Pricing</label><div style={{display:"flex"}}>{[{l:"CA",v:false},{l:"Direct",v:true}].map(o=><button key={String(o.v)} onClick={()=>setUseDirect(o.v)} style={{flex:1,fontFamily:font.sans,fontSize:9,padding:"7px",cursor:"pointer",color:useDirect===o.v?C.white:C.mid,background:useDirect===o.v?C.sage:"transparent",border:`1px solid ${C.border}`}}>{o.l}</button>)}</div></div>
      </div>
      <div style={{display:"flex",gap:11,marginBottom:14,flexWrap:"wrap"}}>
        {[{l:"Total Ingredient Cost",v:fmt(totalCost),col:C.gold,bg:C.goldBg},{l:"Cost / Unit",v:fmt(totalCost/units),col:C.slate,bg:C.slateBg},{l:"Batch Weight",v:(totalG/1000).toFixed(2)+" kg",col:C.mid,bg:"#f5f0e8"},{l:`Est. Retail Profit (${units} units)`,v:fmt((pm.retail-totalCost/units-3.5)*units,0),col:C.sage,bg:C.sageBg}].map((k,i)=><div key={i} style={s.kpi(k.col,k.bg)}><div style={s.kpiN(k.col)}>{k.v}</div><div style={s.kpiL}>{k.l}</div></div>)}
      </div>
      <div style={s.card()}>
        <span style={s.label}>{product} — Batch of {units} · {pm.type}</span>
        <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}><thead><tr>{["Ingredient","g/unit","Total g","Total kg","Price/kg","Batch Cost","% of Formula"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead><tbody>
          {rows.map((r,i)=>{
            const pct2=(r.totalG/Math.max(1,totalG)*100).toFixed(1);
            return(<tr key={r.id} style={{background:i%2===0?"transparent":"#faf8f4"}}><td style={s.td({fontFamily:font.serif,fontSize:13})}>{r.ing?.name||r.id}</td><td style={s.td()}><input type="number" step="0.1" min="0" value={custom[r.id]!==undefined?custom[r.id]:r.g} onChange={e=>setCustom(p=>({...p,[r.id]:e.target.value}))} style={{...s.inp,width:65,padding:"3px 6px",fontSize:11}}/></td><td style={s.td({fontFamily:font.serif,fontSize:12})}>{r.totalG.toFixed(1)}</td><td style={s.td({fontFamily:font.serif,fontSize:12,color:C.mid})}>{r.totalKg.toFixed(3)}</td><td style={s.td({fontFamily:font.serif,fontSize:12,color:useDirect?C.sage:C.mid})}>{fmt(r.price)}</td><td style={s.td({fontFamily:font.serif,fontSize:13,color:C.gold})}>{fmt(r.cost)}</td><td style={s.td()}><div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:45,height:5,background:"#eee",borderRadius:2}}><div style={{width:Math.min(100,parseFloat(pct2))+"%",height:5,background:C.gold,borderRadius:2}}/></div><span style={{fontSize:10}}>{pct2}%</span></div></td></tr>);
          })}
          <tfoot><tr style={{background:"#f5f0e8"}}><td style={s.td({fontFamily:font.serif,fontSize:13})}><strong>Total</strong></td><td style={s.td({fontFamily:font.serif,fontSize:12})}>{rows.reduce((a,r)=>a+r.g,0).toFixed(1)}</td><td style={s.td({fontFamily:font.serif,fontSize:12})}>{totalG.toFixed(1)}</td><td style={s.td({fontFamily:font.serif,fontSize:12,color:C.mid})}>{(totalG/1000).toFixed(3)}</td><td/><td style={s.td({fontFamily:font.serif,fontSize:14,color:C.gold})}><strong>{fmt(totalCost)}</strong></td><td style={s.td({fontFamily:font.serif,fontSize:12})}>100%</td></tr></tfoot>
        </tbody></table></div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: COMPLIANCE
// ═══════════════════════════════════════════════════════════════════════════════
function ComplianceTab(){
  const [checked,setChecked]=useState({});
  const toggle=i=>setChecked(p=>({...p,[i]:!p[i]}));
  const steps=[
    {phase:1,label:"Health Canada Cosmetic Notification",when:"Within 10 days of first sale",how:"Canada.ca/health-canada → Cosmetic Notification. Free.",col:C.sage,bg:C.sageBg,priority:"Do Now"},
    {phase:1,label:"Batch Record System",when:"Before first production run",how:"Spreadsheet: date, product, lot #, supplier, COA reference.",col:C.sage,bg:C.sageBg,priority:"Do Now"},
    {phase:1,label:"INCI Names on All Labels",when:"Before selling",how:"Every ingredient in INCI format. Net weight + contact info required.",col:C.sage,bg:C.sageBg,priority:"Do Now"},
    {phase:2,label:"CBSA Import/Export Account",when:"Before first import",how:"CBSA.gc.ca. Free. 1–3 business days. Need your CRA Business Number.",col:C.gold,bg:C.goldBg,priority:"Phase 2 Prep"},
    {phase:2,label:"COA from Every Supplier",when:"Before ordering bulk",how:"Per lot. Purity, INCI, heavy metals, microbial. Non-negotiable.",col:C.gold,bg:C.goldBg,priority:"Phase 2 Prep"},
    {phase:2,label:"HS Code Research",when:"Before first import",how:"Veg oils: 1515.xx | EOs: 3301.xx | Butters: 1516.xx. Duty 0–7%.",col:C.gold,bg:C.goldBg,priority:"Phase 2 Prep"},
    {phase:2,label:"Customs Broker Engaged",when:"Before first formal shipment",how:"Livingston International, Flexport, or UPS Trade Direct.",col:C.gold,bg:C.goldBg,priority:"Phase 2 Prep"},
    {phase:3,label:"GS1 Canada UPC Barcodes",when:"Before Whole Foods / Shoppers pitch",how:"gs1ca.org · ~$150/yr for small brands.",col:C.slate,bg:C.slateBg,priority:"Phase 3"},
    {phase:3,label:"Product Liability Insurance",when:"Before major retail",how:"~$500–$1,200 CAD/yr. Required by major retailers.",col:C.slate,bg:C.slateBg,priority:"Phase 3"},
  ];
  const done=Object.values(checked).filter(Boolean).length;
  return(
    <div>
      <div style={s.dark({display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10})}>
        <div><div style={{fontFamily:font.serif,fontSize:17,color:C.goldLight,marginBottom:3}}>Compliance Progress</div><div style={{fontFamily:font.sans,fontSize:10,color:"#6b6459"}}>{done} of {steps.length} completed</div></div>
        <div style={{display:"flex",alignItems:"center",gap:10,flex:1,maxWidth:240,marginLeft:16}}><div style={{flex:1,height:4,background:"#2a2820",borderRadius:2}}><div style={{background:C.goldLight,height:4,width:`${(done/steps.length)*100}%`,borderRadius:2,transition:"width 0.3s"}}/></div><div style={{fontFamily:font.serif,fontSize:20,color:C.goldLight}}>{Math.round((done/steps.length)*100)}%</div></div>
      </div>
      {steps.map((step,i)=>{const isDone=checked[i];return(<div key={i} onClick={()=>toggle(i)} style={{...s.card({marginBottom:7,cursor:"pointer",opacity:isDone?0.5:1,borderLeft:`3px solid ${isDone?C.sage:step.col}`})}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}><div style={{width:16,height:16,border:`2px solid ${isDone?C.sage:C.border}`,background:isDone?C.sage:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>{isDone&&<span style={{color:C.white,fontSize:10}}>✓</span>}</div><div style={{flex:1}}><div style={{display:"flex",gap:6,alignItems:"center",marginBottom:2,flexWrap:"wrap"}}><div style={{fontFamily:font.serif,fontSize:13,color:isDone?C.mid:C.ink}}>{step.label}</div><span style={s.pill(step.col,step.bg)}>{step.priority}</span><span style={s.pill(phaseColor[step.phase],phaseBg[step.phase])}>Phase {step.phase}</span></div><div style={{fontFamily:font.sans,fontSize:9,color:C.gold,marginBottom:2}}>{step.when}</div><div style={{fontFamily:font.sans,fontSize:11,color:C.mid,lineHeight:1.6}}>{step.how}</div></div></div>
      </div>);})}
      <div style={s.note({marginTop:8})}>Click any item to mark complete.</div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// TAB: ORDERS
// ═══════════════════════════════════════════════════════════════════════════════
function OrdersTab(){
  const [orders,setOrders]=useState([
    {id:"ORD-001",date:"2026-01-14",product:"MAVKA",qty:2, price:60, cust:"Retail",   platform:"Etsy",    status:"Delivered",notes:""},
    {id:"ORD-002",date:"2026-02-22",product:"MAVKA",qty:12,price:30, cust:"Wholesale",platform:"Direct",  status:"Delivered",notes:"Salon — recurring"},
    {id:"ORD-003",date:"2026-03-10",product:"NYANGA",qty:3,price:55, cust:"Retail",   platform:"Website", status:"Delivered",notes:""},
    {id:"ORD-004",date:"2026-04-15",product:"PAPI",  qty:6, price:30,cust:"Wholesale",platform:"Direct",  status:"Shipped",  notes:"New salon account"},
    {id:"ORD-005",date:"2026-04-29",product:"BORODA",qty:4, price:30,cust:"Retail",   platform:"Etsy",    status:"New",      notes:""},
    {id:"ORD-006",date:"2026-05-01",product:"OTAMAN",qty:8, price:17,cust:"Wholesale",platform:"B2B",     status:"Packed",   notes:"Trial"},
  ]);
  const [form,setForm]=useState({id:"",date:"",product:"MAVKA",qty:1,price:60,cust:"Retail",platform:"Etsy",status:"New",notes:""});
  const [showForm,setShowForm]=useState(false);
  const upd=(k,v)=>setForm(p=>({...p,[k]:v}));

  const statusCol={New:C.slate,Packed:C.gold,Shipped:C.amber,Delivered:C.sage};
  const totalRev=orders.reduce((a,o)=>a+o.qty*o.price,0);
  const totalUnits=orders.reduce((a,o)=>a+o.qty,0);

  const addOrder=()=>{
    if(!form.id||!form.date) return;
    setOrders(p=>[...p,{...form,qty:parseInt(form.qty)||1,price:parseFloat(form.price)||0}]);
    setForm({id:"",date:"",product:"MAVKA",qty:1,price:60,cust:"Retail",platform:"Etsy",status:"New",notes:""});
    setShowForm(false);
  };

  const prodCOGS=(prod)=>{
    const pm=PRODUCT_META[prod];
    if(!pm) return 0;
    // rough COGS: ingredient cost from defaultIng weights
    return Object.entries(pm.defaultIng).reduce((sum,[id,g])=>{
      const ing=INGREDIENTS.find(i=>i.id===id);
      return sum+(ing?ing.caPrice*(g/1000):0);
    },0)+2.00; // +packaging approx
  };

  return(
    <div>
      {/* KPIs */}
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        {[
          {l:"Total Orders",v:orders.length,col:C.slate,bg:C.slateBg},
          {l:"Total Revenue",v:fmt(totalRev,0),col:C.gold,bg:C.goldBg},
          {l:"Total Units Sold",v:totalUnits,col:C.sage,bg:C.sageBg},
          {l:"Avg Order Value",v:fmt(orders.length?totalRev/orders.length:0),col:C.teal,bg:C.tealBg},
        ].map((k,i)=>(
          <div key={i} style={s.kpi(k.col,k.bg)}>
            <div style={s.kpiN(k.col)}>{k.v}</div>
            <div style={s.kpiL}>{k.l}</div>
          </div>
        ))}
      </div>

      {/* Add order button */}
      <div style={{marginBottom:14,display:"flex",justifyContent:"flex-end"}}>
        <button onClick={()=>setShowForm(p=>!p)} style={s.btnGold}>{showForm?"✕ Cancel":"+ New Order"}</button>
      </div>

      {/* New order form */}
      {showForm&&(
        <div style={{...s.card({marginBottom:16,borderLeft:`4px solid ${C.gold}`})}}>
          <span style={s.label}>New Order</span>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10,marginBottom:12}}>
            {[
              {l:"Order ID",k:"id",type:"text",placeholder:"ORD-007"},
              {l:"Date",k:"date",type:"date"},
              {l:"Qty",k:"qty",type:"number"},
              {l:"Unit Price ($)",k:"price",type:"number"},
            ].map(f=>(
              <div key={f.k}>
                <label style={s.inpL}>{f.l}</label>
                <input style={s.inp} type={f.type} placeholder={f.placeholder||""} value={form[f.k]} onChange={e=>upd(f.k,e.target.value)}/>
              </div>
            ))}
            <div>
              <label style={s.inpL}>Product</label>
              <select style={s.inp} value={form.product} onChange={e=>upd("product",e.target.value)}>
                {PRODUCTS.map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={s.inpL}>Customer Type</label>
              <select style={s.inp} value={form.cust} onChange={e=>upd("cust",e.target.value)}>
                {["Retail","Wholesale","Salon","Distributor"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={s.inpL}>Platform</label>
              <select style={s.inp} value={form.platform} onChange={e=>upd("platform",e.target.value)}>
                {["Etsy","Website","Direct","B2B","Amazon"].map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={s.inpL}>Status</label>
              <select style={s.inp} value={form.status} onChange={e=>upd("status",e.target.value)}>
                {["New","Packed","Shipped","Delivered"].map(s2=><option key={s2}>{s2}</option>)}
              </select>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={s.inpL}>Notes</label>
              <input style={s.inp} value={form.notes} onChange={e=>upd("notes",e.target.value)} placeholder="Optional notes"/>
            </div>
          </div>
          {form.product&&(
            <div style={{...s.note({marginBottom:10})}}>
              <strong>COGS estimate for {form.product}:</strong> {fmt(prodCOGS(form.product))} · Revenue: {fmt((parseFloat(form.price)||0)*(parseInt(form.qty)||1))} · Est. Profit: {fmt(((parseFloat(form.price)||0)-(prodCOGS(form.product)))*(parseInt(form.qty)||1))}
            </div>
          )}
          <button onClick={addOrder} style={s.btnGold}>Add Order</button>
        </div>
      )}

      {/* Orders table */}
      <div style={s.card()}>
        <span style={s.label}>Order Log</span>
        <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
          <thead><tr style={{background:"#f5f0e8"}}>
            {["Order ID","Date","Product","Qty","Unit Price","Revenue","Est. COGS","Est. Profit","Customer","Platform","Status","Notes"].map(h=>(
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {orders.map((o,i)=>{
              const rev=o.qty*o.price;
              const cogs=prodCOGS(o.product)*o.qty;
              const profit=rev-cogs;
              const sc=statusCol[o.status]||C.mid;
              return(
                <tr key={o.id} style={{background:i%2===0?"transparent":"#faf8f4"}}>
                  <td style={s.td({fontFamily:font.serif,fontSize:13})}>{o.id}</td>
                  <td style={s.td({fontSize:10,color:C.mid})}>{o.date}</td>
                  <td style={s.td()}><span style={s.badge(C.slate,C.slateBg)}>{o.product}</span></td>
                  <td style={s.td({textAlign:"center",fontFamily:font.serif,fontSize:14})}>{o.qty}</td>
                  <td style={s.td({fontFamily:font.serif,fontSize:13,color:C.mid})}>{fmt(o.price)}</td>
                  <td style={s.td({fontFamily:font.serif,fontSize:14,color:C.gold})}>{fmt(rev)}</td>
                  <td style={s.td({fontFamily:font.serif,fontSize:13,color:C.mid})}>{fmt(cogs)}</td>
                  <td style={s.td({fontFamily:font.serif,fontSize:14,color:profit>=0?C.sage:C.red})}>{fmt(profit)}</td>
                  <td style={s.td({fontSize:10})}>{o.cust}</td>
                  <td style={s.td({fontSize:10})}>{o.platform}</td>
                  <td style={s.td()}><span style={s.pill(sc,sc+"18")}>{o.status}</span></td>
                  <td style={s.td({fontSize:10,color:C.mid,maxWidth:120})}>{o.notes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: INVENTORY
// ═══════════════════════════════════════════════════════════════════════════════
function InventoryTab(){
  const initStock=()=>INGREDIENTS.map(ing=>({
    id:ing.id,
    name:ing.name,
    qty:Math.floor(Math.random()*200+20),
    unit:ing.moq.includes("g")?"g":"ml",
    reorder:50,
    supplier:ing.supplier,
    lot:"LOT-2026-"+String(Math.floor(Math.random()*999)).padStart(3,"0"),
    caPrice:ing.caPrice,
  }));

  const [stock,setStock]=useState(()=>[
    {id:"castor",    name:"Castor Oil",         qty:0,   unit:"ml", reorder:100,supplier:"NDA Canada",    lot:"CA-2026-001",caPrice:4.50},
    {id:"jojoba",    name:"Jojoba Oil",          qty:340, unit:"ml", reorder:150,supplier:"NDA Canada",    lot:"CA-2026-002",caPrice:18.00},
    {id:"shea",      name:"Shea Butter",         qty:820, unit:"g",  reorder:400,supplier:"NDA Canada",    lot:"CA-2026-003",caPrice:8.00},
    {id:"argan",     name:"Argan Oil",           qty:85,  unit:"ml", reorder:50, supplier:"NDA Canada",    lot:"CA-2026-004",caPrice:38.00},
    {id:"baobab",    name:"Baobab Oil",           qty:45,  unit:"ml", reorder:50, supplier:"NDA Canada",    lot:"CA-2026-005",caPrice:42.00},
    {id:"moringa",   name:"Moringa Oil",          qty:120, unit:"ml", reorder:60, supplier:"NDA Canada",    lot:"CA-2026-006",caPrice:28.00},
    {id:"peppermint",name:"Peppermint EO",        qty:28,  unit:"ml", reorder:20, supplier:"NDA Canada",    lot:"CA-2026-007",caPrice:48.00},
    {id:"lavender",  name:"Lavender EO",          qty:32,  unit:"ml", reorder:20, supplier:"NDA Canada",    lot:"CA-2026-008",caPrice:55.00},
    {id:"rosemary",  name:"Rosemary EO",          qty:18,  unit:"ml", reorder:15, supplier:"NDA Canada",    lot:"CA-2026-009",caPrice:65.00},
    {id:"babassu",   name:"Babassu / VCO",        qty:200, unit:"ml", reorder:100,supplier:"NDA Canada",    lot:"CA-2026-010",caPrice:16.00},
  ]);
  const [editId,setEditId]=useState(null);
  const [editQty,setEditQty]=useState("");
  const [editReorder,setEditReorder]=useState("");

  const outItems=stock.filter(s=>s.qty===0);
  const lowItems=stock.filter(s=>s.qty>0&&s.qty<=s.reorder);
  const totalValue=stock.reduce((a,s)=>a+s.qty*(s.caPrice/1000),0);

  const saveEdit=(id)=>{
    setStock(p=>p.map(s=>s.id===id?{...s,qty:parseInt(editQty)||s.qty,reorder:parseInt(editReorder)||s.reorder}:s));
    setEditId(null);
  };

  // Production capacity: how many units of each product can be made
  const capacity=PRODUCTS.map(prod=>{
    const pm=PRODUCT_META[prod];
    const limits=Object.entries(pm.defaultIng).map(([id,gPerUnit])=>{
      const s=stock.find(s=>s.id===id);
      if(!s) return Infinity;
      return Math.floor(s.qty/gPerUnit);
    });
    const maxUnits=Math.min(...limits);
    const limitingId=Object.keys(pm.defaultIng)[limits.indexOf(Math.min(...limits))];
    const limitingIng=INGREDIENTS.find(i=>i.id===limitingId);
    return{prod,maxUnits:isFinite(maxUnits)?maxUnits:0,limitingIng:limitingIng?.name||limitingId};
  });

  return(
    <div>
      {/* Alerts */}
      {outItems.length>0&&(
        <div style={{background:C.redBg,border:`1px solid ${C.red}30`,padding:"10px 14px",marginBottom:12,fontFamily:font.sans,fontSize:11,color:C.red}}>
          ⚠ OUT OF STOCK: {outItems.map(i=>i.name).join(", ")}
        </div>
      )}
      {lowItems.length>0&&(
        <div style={{background:C.amberBg,border:`1px solid ${C.amber}30`,padding:"10px 14px",marginBottom:12,fontFamily:font.sans,fontSize:11,color:C.amber}}>
          ⚠ LOW STOCK: {lowItems.map(i=>`${i.name} (${i.qty}${i.unit})`).join(", ")}
        </div>
      )}

      {/* KPIs */}
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        {[
          {l:"Out of Stock",v:outItems.length,col:C.red,bg:C.redBg},
          {l:"Low Stock",v:lowItems.length,col:C.amber,bg:C.amberBg},
          {l:"In Stock",v:stock.filter(s=>s.qty>s.reorder).length,col:C.sage,bg:C.sageBg},
          {l:"Est. Inventory Value",v:fmt(totalValue),col:C.gold,bg:C.goldBg},
        ].map((k,i)=>(
          <div key={i} style={s.kpi(k.col,k.bg)}>
            <div style={s.kpiN(k.col)}>{k.v}</div>
            <div style={s.kpiL}>{k.l}</div>
          </div>
        ))}
      </div>

      {/* Stock table */}
      <div style={{...s.card({marginBottom:16})}}>
        <span style={s.label}>Raw Materials Stock — Click any row to update quantity</span>
        <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
          <thead><tr style={{background:"#f5f0e8"}}>
            {["Ingredient","Current Stock","Unit","Reorder Level","Status","Supplier","Lot #","CA Price/kg","Actions"].map(h=>(
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {stock.map((item,i)=>{
              const isOut=item.qty===0;
              const isLow=!isOut&&item.qty<=item.reorder;
              const statCol=isOut?C.red:isLow?C.amber:C.sage;
              const statLabel=isOut?"Out of Stock":isLow?"Low":"In Stock";
              const isEditing=editId===item.id;
              return(
                <tr key={item.id} style={{background:isOut?C.redBg+"60":isLow?C.amberBg+"60":i%2===0?"transparent":"#faf8f4"}}>
                  <td style={s.td({fontFamily:font.serif,fontSize:13})}>{item.name}</td>
                  <td style={s.td({fontFamily:font.serif,fontSize:15,color:statCol})}>
                    {isEditing
                      ?<input style={{...s.inp,width:80,padding:"3px 6px"}} type="number" value={editQty} onChange={e=>setEditQty(e.target.value)} autoFocus/>
                      :item.qty
                    }
                  </td>
                  <td style={s.td({fontSize:11,color:C.mid})}>{item.unit}</td>
                  <td style={s.td()}>
                    {isEditing
                      ?<input style={{...s.inp,width:70,padding:"3px 6px"}} type="number" value={editReorder} onChange={e=>setEditReorder(e.target.value)}/>
                      :item.reorder
                    }
                  </td>
                  <td style={s.td()}><span style={s.pill(statCol,statCol+"18")}>{statLabel}</span></td>
                  <td style={s.td({fontSize:10,color:C.mid})}>{item.supplier}</td>
                  <td style={s.td({fontSize:10,color:C.mid})}>{item.lot}</td>
                  <td style={s.td({fontFamily:font.serif,fontSize:12,color:C.mid})}>{fmt(item.caPrice)}</td>
                  <td style={s.td()}>
                    {isEditing
                      ?<><button onClick={()=>saveEdit(item.id)} style={{...s.btnGold,padding:"3px 8px",fontSize:8,marginRight:4}}>Save</button><button onClick={()=>setEditId(null)} style={{fontFamily:font.sans,fontSize:8,padding:"3px 8px",cursor:"pointer",border:`1px solid ${C.border}`,background:"transparent"}}>Cancel</button></>
                      :<button onClick={()=>{setEditId(item.id);setEditQty(String(item.qty));setEditReorder(String(item.reorder));}} style={{fontFamily:font.sans,fontSize:8,padding:"3px 8px",cursor:"pointer",border:`1px solid ${C.border}`,background:"transparent",letterSpacing:"0.1em"}}>Edit</button>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {/* Production capacity */}
      <div style={s.card()}>
        <span style={s.label}>Production Capacity — Units Producible from Current Stock</span>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {capacity.map(c=>{
            const col=c.maxUnits===0?C.red:c.maxUnits<10?C.amber:C.sage;
            const bg=c.maxUnits===0?C.redBg:c.maxUnits<10?C.amberBg:C.sageBg;
            return(
              <div key={c.prod} style={{background:bg,border:`1px solid ${col}30`,padding:"14px 16px",flex:1,minWidth:150}}>
                <div style={{fontFamily:font.sans,fontSize:8,letterSpacing:"0.2em",textTransform:"uppercase",color:col,marginBottom:4}}>{c.prod}</div>
                <div style={{fontFamily:font.serif,fontSize:28,color:col,lineHeight:1,marginBottom:4}}>{c.maxUnits}</div>
                <div style={{fontFamily:font.sans,fontSize:9,color:C.mid}}>units possible</div>
                <div style={{fontFamily:font.sans,fontSize:9,color:col,marginTop:6}}>Limiting: {c.limitingIng}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App(){
  const [tab,setTab]=useState("dashboard");
  const tabs=[
    {key:"dashboard", label:"🎯 Dashboard"},
    {key:"switch",    label:"⚡ Switch Conditions"},
    {key:"risk",      label:"🔍 Supplier Risk"},
    {key:"cashflow",  label:"💰 Cash Flow"},
    {key:"quality",   label:"✓ Quality Validation"},
    {key:"roadmap",   label:"Sourcing Roadmap"},
    {key:"calculator",label:"Margin Calculator"},
    {key:"batch",     label:"Batch Planner"},
    {key:"compliance",label:"Compliance"},
    {key:"orders",    label:"📦 Orders"},
    {key:"inventory",  label:"📊 Inventory"},
  ];
  const meta={
    dashboard: {ey:"Founder View · Decision-Oriented",h1:"Execution Dashboard — What to Do Right Now."},
    switch:    {ey:"Transition Intelligence",          h1:"Switch Conditions — When to Move Each Ingredient."},
    risk:      {ey:"Supplier Intelligence",            h1:"Risk Scoring — Choose the Right Supplier."},
    cashflow:  {ey:"Financial Planning",               h1:"Cash Flow — Can Talifa Afford This Switch?"},
    quality:   {ey:"Quality Control",                  h1:"Supplier Validation — Approve Before You Buy Bulk."},
    roadmap:   {ey:"Phase-by-Phase",                   h1:"Sourcing Roadmap — Start Simple, Scale Smart."},
    calculator:{ey:"Margin Tool",                      h1:"Know Your Numbers Before You Price."},
    batch:     {ey:"Production Planning",              h1:"Batch Planner — Exact Grams to Order."},
    compliance:{ey:"Regulatory · Clickable",           h1:"Stay Legal. Stay Ready."},
    orders:    {ey:"Sales Tracking",                    h1:"Orders — Revenue, Profit & Fulfillment."},
    inventory: {ey:"Stock Management",                  h1:"Inventory — Raw Materials & Production Capacity."},
  };
  return(
    <div style={s.app}>
      <div style={s.hdr}>
        <div><div style={s.brand}>TALIFA</div><div style={s.brandSub}>Full Execution System · 2026</div></div>
        <button onClick={exportCSV} style={s.btnGold}>↓ Export to Excel</button>
      </div>
      <div style={s.nav}>{tabs.map(t=><button key={t.key} style={s.tab(tab===t.key)} onClick={()=>setTab(t.key)}>{t.label}</button>)}</div>
      <div style={s.pg}>
        <div style={s.ey}>{meta[tab].ey}</div>
        <h1 style={s.h1}><em style={{fontStyle:"italic",color:C.mid}}>{meta[tab].h1}</em></h1>
        {tab==="dashboard"  &&<><p style={s.sub}>Enter your current monthly units and cash buffer. The dashboard updates to show your operating mode, what to focus on this month, and what to ignore.</p><ExecutionTab/></>}
        {tab==="switch"     &&<><p style={s.sub}>Three-stage switch condition for every ingredient. Click any row for full detail — min units, cash buffer, MOQ, cost per unit, and margin impact at each stage.</p><SwitchTab/></>}
        {tab==="risk"       &&<><p style={s.sub}>Every supplier scored across 5 risk dimensions. Visual comparison table with recommendation logic for when to choose safety over savings.</p><RiskTab/></>}
        {tab==="cashflow"   &&<><p style={s.sub}>Enter your monthly volume and cash buffer to see which sourcing switches you can actually afford right now — and which to defer.</p><CashFlowTab/></>}
        {tab==="quality"    &&<><p style={s.sub}>5-step validation checklist for every direct supplier. Track sample testing, COA verification, sensory evaluation, and batch testing. Approve, conditionally approve, or reject.</p><QualityTab/></>}
        {tab==="roadmap"    &&<><p style={s.sub}>Phase-by-phase ingredient sourcing plan. Buy Canadian now, switch to direct sourcing as volume and cash buffer grow.</p><RoadmapTab/></>}
        {tab==="calculator" &&<><p style={s.sub}>Toggle Phase 1 vs Phase 2 pricing. See margin impact instantly.</p><CalcTab/></>}
        {tab==="batch"      &&<><p style={s.sub}>Enter batch size → get exact grams to order. Edit any amount live.</p><BatchTab/></>}
        {tab==="compliance" &&<><p style={s.sub}>Only what you need, when you need it. Click to track.</p><ComplianceTab/></>
        }
        {tab==="orders"     &&<><p style={s.sub}>Track every sale, estimate profit per order based on real COGS from your formulas.</p><OrdersTab/></>
        }
        {tab==="inventory"  &&<><p style={s.sub}>Current raw material stock levels. Edit quantities, see low-stock alerts, and check production capacity per product.</p><InventoryTab/></>
        }
      </div>
    </div>
  );
}
