(function(){
const $=s=>document.querySelector(s), fmt=n=>new Intl.NumberFormat('en-IN',{maximumFractionDigits:0}).format(n), money=n=>'₹'+new Intl.NumberFormat('en-IN',{maximumFractionDigits:0}).format(Math.round(n)), pct=n=>`${Number(n).toFixed(2)}%`, compact=n=>{n=Number(n);if(Math.abs(n)>=1e7)return '₹'+(n/1e7).toFixed(2)+'Cr';if(Math.abs(n)>=1e6)return '₹'+(n/1e6).toFixed(2)+'M';if(Math.abs(n)>=1e5)return '₹'+(n/1e5).toFixed(2)+'L';if(Math.abs(n)>=1e3)return (n/1e3).toFixed(1)+'K';return String(Math.round(n))};
let DATA=null, current='home', storeFilter='ALL', categoryFilter='ALL', promoFilter='ALL';
window.addEventListener('zipto-data-ready',()=>{DATA=window.ZIPTO_DATA; render()});
function esc(x){return String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function svgBar(data,{key,labelKey='label',horizontal=false,color='#4f8cff',format=v=>v,zero=false,xTitle='Category',yTitle='Value',showValues=true}={}){
  const W=1000,H=400,pad=horizontal?{l:180,r:78,t:42,b:92}:{l:92,r:42,t:42,b:105};
  const vals=data.map(d=>Number(d[key])||0), max=Math.max(...vals,0), min=zero?0:Math.min(...vals,0);
  const span=(max-min)||1, plotW=W-pad.l-pad.r, plotH=H-pad.t-pad.b;
  let s=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img">`;
  if(horizontal){
    // Horizontal bars: numeric scale belongs on the X axis; category names belong on Y.
    for(let i=0;i<5;i++){
      const x=pad.l+plotW*i/4;
      const v=min+span*i/4;
      s+=`<line class="gridline" x1="${x}" x2="${x}" y1="${pad.t}" y2="${pad.t+plotH}"/>`;
      s+=`<text class="axis-text axis-tick" x="${x}" y="${H-55}" text-anchor="middle">${esc(format(v))}</text>`;
    }
    const rowH=plotH/Math.max(1,data.length);
    data.forEach((d,i)=>{
      const y=pad.t+i*rowH+rowH*.16;
      const h=rowH*.68;
      const v=Number(d[key])||0;
      const baseX=pad.l+plotW*(min<0?(-min/span):0);
      const w=Math.abs(plotW*(v-min)/span);
      const x=v>=0?baseX:baseX-w;
      s+=`<text class="axis-text axis-tick category-label" x="${pad.l-18}" y="${y+h/2+5}" text-anchor="end">${esc(d[labelKey])}</text>`;
      s+=`<rect class="bar" x="${x}" y="${y}" width="${Math.max(2,w)}" height="${h}" rx="5" fill="${color}" data-tip="${esc(d[labelKey])}: ${esc(format(v))}"/>`;
      if(showValues){
        const tx=v>=0?x+w+10:x-10, anchor=v>=0?'start':'end';
        s+=`<text class="value-label" x="${tx}" y="${y+h/2+5}" text-anchor="${anchor}">${esc(format(v))}</text>`;
      }
    });
  } else {
    for(let i=0;i<5;i++){
      const y=pad.t+plotH*i/4,v=max-span*i/4;
      s+=`<line class="gridline" x1="${pad.l}" x2="${W-pad.r}" y1="${y}" y2="${y}"/><text class="axis-text axis-tick" x="${pad.l-14}" y="${y+5}" text-anchor="end">${esc(format(v))}</text>`
    }
    const bw=Math.min(56,plotW/Math.max(1,data.length)*.58),baseY=pad.t+(max/span)*plotH;
    data.forEach((d,i)=>{const v=Number(d[key])||0,x=pad.l+(i+.5)*plotW/data.length-bw/2,y=v>=0?pad.t+(max-v)/span*plotH:baseY,h=Math.abs(v/span*plotH),label=String(d[labelKey]??'');
      s+=`<rect class="bar" x="${x}" y="${y}" width="${bw}" height="${Math.max(1,h)}" rx="5" fill="${color}" data-tip="${esc(label)}: ${esc(format(v))}"/><text class="axis-text x-label" x="${x+bw/2}" y="${H-58}" text-anchor="middle">${esc(label)}</text>`;
      if(showValues){const ty=v>=0?Math.max(18,y-9):Math.min(H-72,y+h+18);s+=`<text class="value-label" x="${x+bw/2}" y="${ty}" text-anchor="middle">${esc(format(v))}</text>`}
    });
  }
  if(xTitle)s+=`<text class="axis-title" x="${pad.l+plotW/2}" y="${H-18}" text-anchor="middle">${esc(xTitle)}</text>`;
  if(yTitle)s+=`<text class="axis-title" transform="translate(22 ${pad.t+plotH/2}) rotate(-90)" text-anchor="middle">${esc(yTitle)}</text>`;
  s+='</svg>';return s;
}
function svgLine(data,{xKey='date',yKey='value',color='#4f8cff',format=v=>v,xTitle='Date',yTitle='Value'}={}){
  const W=1000,H=390,pad={l:92,r:42,t:42,b:105},vals=data.map(d=>Number(d[yKey])||0),min=Math.min(...vals),max=Math.max(...vals),span=(max-min)||1,plotW=W-pad.l-pad.r,plotH=H-pad.t-pad.b;
  const pts=data.map((d,i)=>[pad.l+i*(plotW/(Math.max(1,data.length-1))),pad.t+(max-d[yKey])/span*plotH]);let s='<svg viewBox="0 0 1000 390" preserveAspectRatio="none">';
  for(let i=0;i<5;i++){let y=pad.t+plotH*i/4,v=max-span*i/4;s+=`<line class="gridline" x1="${pad.l}" x2="${W-pad.r}" y1="${y}" y2="${y}"/><text class="axis-text axis-tick" x="${pad.l-14}" y="${y+5}" text-anchor="end">${esc(format(v))}</text>`}
  s+=`<polyline class="line" points="${pts.map(p=>p.join(',')).join(' ')}"/>`;pts.forEach((p,i)=>{if(i%Math.ceil(data.length/14)===0||i===data.length-1)s+=`<circle class="dot" cx="${p[0]}" cy="${p[1]}" r="5" data-tip="${esc(data[i][xKey])}: ${esc(format(data[i][yKey]))}"/>`});
  if(xTitle)s+=`<text class="axis-title" x="${pad.l+plotW/2}" y="${H-15}" text-anchor="middle">${esc(xTitle)}</text>`;if(yTitle)s+=`<text class="axis-title" transform="translate(18 ${pad.t+plotH/2}) rotate(-90)" text-anchor="middle">${esc(yTitle)}</text>`;s+='</svg>';return s
}
function svgDonut(data){const total=data.reduce((a,d)=>a+Number(d.value),0)||1,cx=430,cy=170,r=112,ri=62;let angle=-Math.PI/2,s='<svg viewBox="0 0 900 330" preserveAspectRatio="none">';const colors=['#4f8cff','#f5bd3f','#36d399','#8b5cf6','#38c9ff','#ff8c5a','#ff6b7a'];data.forEach((d,i)=>{const a=Number(d.value)/total*Math.PI*2,a2=angle+a,x1=cx+r*Math.cos(angle),y1=cy+r*Math.sin(angle),x2=cx+r*Math.cos(a2),y2=cy+r*Math.sin(a2),ix1=cx+ri*Math.cos(a2),iy1=cy+ri*Math.sin(a2),ix2=cx+ri*Math.cos(angle),iy2=cy+ri*Math.sin(angle),large=a>Math.PI?1:0; s+=`<path d="M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${ri} ${ri} 0 ${large} 0 ${ix2} ${iy2} Z" fill="${colors[i%colors.length]}" data-tip="${esc(d.label)}: ${pct(d.value/total*100)}"/>`;angle=a2});s+=`<circle cx="${cx}" cy="${cy}" r="${ri-2}" fill="#0a1728"/><text x="${cx}" y="${cy-2}" text-anchor="middle" fill="#fff" font-size="28" font-weight="800">${fmt(total)}</text><text x="${cx}" y="${cy+22}" text-anchor="middle" class="axis-text">total trips</text>`;data.forEach((d,i)=>s+=`<rect x="760" y="${55+i*34}" width="13" height="13" rx="2" fill="${colors[i%colors.length]}"/><text class="axis-text" x="782" y="${67+i*34}">${esc(d.label)}</text>`);return s+'</svg>'}
function bindTips(){let tip=$('#tooltip');document.querySelectorAll('[data-tip]').forEach(el=>{el.addEventListener('mousemove',e=>{tip.textContent=el.getAttribute('data-tip');tip.style.display='block';tip.style.left=(e.clientX+12)+'px';tip.style.top=(e.clientY+12)+'px'});el.addEventListener('mouseleave',()=>tip.style.display='none')})}
function layout(title,eyebrow,desc,actions,body){return `<div class="topbar"><div class="topbar-inner"><div class="brand"><div class="brand-mark">Z</div><div><h1>ZIPTO ANALYTICS</h1><span>Dark store intelligence platform</span></div></div><nav class="nav">${[['home','Home'],['overall','Overall Analysis'],['store','Store Performance'],['delivery','Delivery & Fulfilment'],['product','Product & Promotions']].map(([id,n])=>`<button class="${current===id?'active':''}" onclick="window.setDash('${id}')">${n}</button>`).join('')}</nav></div></div><main class="main ${current}-page"><section class="hero"><div><div class="eyebrow">${eyebrow}</div><h2>${title}</h2><p>${desc}</p></div><div class="hero-actions">${actions}</div></section>${body}<footer class="footer"><span>ZIPTO • Hackathon Analytics Experience</span><span>Interactive web recreation of the submitted Excel dashboards</span></footer></main><div id="tooltip" class="tooltip"></div>`}
function overallFixCard(row,avgRevenue,avgOrders,avgReturn){const aov=Number(row.gross_revenue)/Number(row.orders),opportunity=Math.max(0,avgRevenue-Number(row.gross_revenue));return `<article class="overall-fix-card"><div class="overall-fix-head"><div><div class="eyebrow">Fix priority</div><h3>${esc(row.store_id)}</h3></div><span class="overall-risk">Bottom 2</span></div><div class="overall-metric-grid"><div><small>Revenue / order</small><strong>${money(aov)}</strong><span>Average order value</span></div><div><small>Orders</small><strong>${fmt(row.orders)}</strong><span>Network avg ${fmt(avgOrders)}</span></div><div><small>Return rate</small><strong>${pct(Number(row.return_rate)*100)}</strong><span>Store avg ${pct(avgReturn)}</span></div><div><small>Cost pressure</small><strong>${money(Number(row.discounts)+Number(row.rent)*Number(row.months))}</strong><span>Discounts + rent</span></div></div><p><b>What is broken:</b> ${row.store_id==='S07'?'Return rate is the worst supplied store metric, with heavy discount and rent pressure.':'Return rate is materially above the store average, while contribution does not cover fixed rent.'}</p><p><b>Fix action:</b> ${row.store_id==='S07'?'Reduce returns first, then audit discount leakage.':'Reduce returns and improve contribution conversion against fixed rent.'}</p><p><b>Revenue opportunity:</b> ${money(opportunity)} <span class="formula-inline">= (${money(avgRevenue)} average top-3 revenue - ${money(row.gross_revenue)} current revenue) × 1 analysis period</span></p></article>`}
function overallPage(){const sourceRows=DATA.store.rows,rows=[...sourceRows].sort((a,b)=>Number(b.pnl)-Number(a.pnl)),bottom=rows.slice(-2),top3=rows.slice(0,3),avgRevenue=top3.reduce((sum,row)=>sum+Number(row.gross_revenue),0)/3,avgOrders=sourceRows.reduce((sum,row)=>sum+Number(row.orders),0)/sourceRows.length,avgReturn=sourceRows.reduce((sum,row)=>sum+Number(row.return_rate)*100,0)/sourceRows.length,totalRevenue=sourceRows.reduce((sum,row)=>sum+Number(row.gross_revenue),0),table=rows.map((row,index)=>{const isBottom=bottom.includes(row),margin=Number(row.pnl)/Number(row.gross_revenue)*100;return `<tr class="${isBottom?'overall-bottom-row':''}"><td><strong>${index+1}</strong></td><td><strong>${esc(row.store_id)}</strong></td><td>${money(row.gross_revenue)}</td><td class="${row.pnl<0?'negative-profit':'positive-profit'}">${money(row.pnl)}</td><td>${pct(margin)}</td><td>${isBottom?'<span class="overall-risk">Bottom 2</span>':'<span class="overall-status">'+esc(row.status)+'</span>'}</td></tr>`}).join(''),categories=DATA.product.categories,promos=DATA.product.promos,totalUnits=categories.reduce((sum,row)=>sum+Number(row.units_sold),0),totalDiscount=promos.reduce((sum,row)=>sum+Number(row.total_discount_given),0),topCategories=[...categories].sort((a,b)=>b.revenue-a.revenue).slice(0,3).map(row=>row.category).join(', '),bestPromo=[...promos].sort((a,b)=>b.contribution-a.contribution)[0],worstPromo=[...promos].sort((a,b)=>a.contribution-b.contribution)[0];return layout('Overall Analysis','04 / Network overview','A data-backed operating view of store economics, delivery fulfilment, and product promotion performance.','',`<section class="overall-summary"><div class="card"><div class="eyebrow">Ranking basis</div><h3>Stores ranked by net profit</h3><p>Descending order using store P&amp;L. Profit margin is net profit divided by total revenue.</p></div><div class="card overall-alert"><div class="eyebrow">Priority watchlist</div><strong>Bottom 2 stores highlighted</strong><span>${esc(bottom[0].store_id)} and ${esc(bottom[1].store_id)}</span></div></section><div class="card overall-table-card"><div class="card-head"><div><div class="card-title">Store profitability ranking</div><div class="card-sub">Highest net profit to lowest net profit</div></div><span class="overall-count">${rows.length} stores</span></div><div class="table-wrap"><table class="table overall-table"><thead><tr><th>Rank</th><th>Store ID</th><th>Total revenue</th><th>Total profit</th><th>Profit margin</th><th>Signal</th></tr></thead><tbody>${table}</tbody></table></div></div><section class="overall-question"><div class="eyebrow">Fix decision</div><h3>Which two stores do I fix first, what exactly is broken, and what is fixing it worth?</h3><div class="overall-fix-grid">${bottom.map(row=>overallFixCard(row,avgRevenue,avgOrders,avgReturn)).join('')}</div></section><section class="overall-question"><div class="eyebrow">Lane 1 / Store Performance</div><h3>Which stores make money, and which lose it?</h3><p class="overall-answer">${DATA.store.kpis.profitable_stores} stores are profitable and ${DATA.store.kpis.loss_making_stores} are loss-making. ${esc(rows[0].store_id)} is the top performer at ${money(rows[0].pnl)} net profit; ${esc(rows[rows.length-1].store_id)} is the weakest at ${money(rows[rows.length-1].pnl)}. Combined revenue is ${money(totalRevenue)}. Month-wise trend data is not present in the supplied rows.</p></section><section class="overall-question"><div class="eyebrow">Lane 2 / Delivery &amp; Fulfilment</div><h3>Are we delivering what we say we deliver?</h3><p class="overall-answer">Delivery performance is mixed: ${pct(DATA.delivery.kpis.on_time_delivery_pct)} of deliveries are on time, with ${fmt(DATA.delivery.kpis.delivered_orders)} delivered orders, ${fmt(DATA.delivery.kpis.late_deliveries)} late deliveries, and ${pct(DATA.delivery.kpis.return_rate)} returns. The deeper delivery data also allows partner-level investigation: the lowest-performing partners in the reviewed set are around 21–22% on-time with roughly 3.4–3.7 minutes of average delay. At network level, average actual delivery time is almost exactly the 15-minute promise, so the main issue is concentrated performance rather than simply a higher network-wide average. S03 and S07 remain the key stores to investigate alongside their delivery partners.</p></section><section class="overall-question"><div class="eyebrow">Lane 3 / Product &amp; Promotions</div><h3>What are we selling, and what are the discounts costing us?</h3><p class="overall-answer">The category data records ${fmt(totalUnits)} units across ${DATA.product.kpis.total_category} categories. Top revenue categories are ${esc(topCategories)}. Total promo discount cost is ${money(totalDiscount)}. ${esc(bestPromo.promo_code)} has the strongest positive contribution at ${money(bestPromo.contribution)}; ${esc(worstPromo.promo_code)} is the most negative at ${money(worstPromo.contribution)}. Product-level top/bottom-five rankings are unavailable because the supplied data is category-level.</p><div class="overall-chart-grid"><div class="card"><div class="card-title">Revenue by category</div><div class="card-sub">Hover bars for exact revenue</div><div class="chart overall-chart">${svgBar(categories.map(row=>({label:row.category,value:row.revenue})),{key:'value',color:'#f5bd3f',format:money,xTitle:'Category',yTitle:'Revenue (INR)'})}</div></div><div class="card"><div class="card-title">Discount cost by promo</div><div class="card-sub">Hover bars for exact discount cost</div><div class="chart overall-chart">${svgBar(promos.map(row=>({label:row.promo_code,value:row.total_discount_given})),{key:'value',horizontal:true,color:'#ff8a3d',format:money,xTitle:'Discount cost (INR)',yTitle:'Promo code'})}</div></div></div></section><section class="overall-final"><div class="eyebrow">Final Overall Analysis</div><p>ZIPTO generated ${money(DATA.product.kpis.total_gross_revenue)} in gross revenue across ${fmt(DATA.store.kpis.total_orders)} orders. ${DATA.store.kpis.profitable_stores} stores are profitable and ${DATA.store.kpis.loss_making_stores} are loss-making; ${esc(rows[0].store_id)} leads profit while ${esc(rows[rows.length-1].store_id)} is the largest loss. Delivery is ${pct(DATA.delivery.kpis.on_time_delivery_pct)} on time with ${fmt(DATA.delivery.kpis.late_deliveries)} late deliveries. Product data records ${fmt(totalUnits)} units and ${money(totalDiscount)} in promo discount cost, with ${esc(worstPromo.promo_code)} most negative. Fix ${esc(bottom[1].store_id)} and ${esc(bottom[0].store_id)} first for revenue gaps of ${money(Math.max(0,avgRevenue-bottom[1].gross_revenue))} and ${money(Math.max(0,avgRevenue-bottom[0].gross_revenue))}.</p></section>`)}
function storePage(){const d=DATA.store, rows=d.rows.filter(r=>storeFilter==='ALL'||r.store_id===storeFilter), all=d.rows;return layout('Store Performance','01 / Store economics','Which stores make money, which stores leak contribution, and where operational fixes can change the economics.',`<a class="btn primary" href="./data/store_performance_dataset_clean.xlsx" download>↓ Download source Excel</a>`, `<div class="dashboard-shell"><div class="kpis">${[['🏪','Profitable Stores',d.kpis.profitable_stores,'stores'],['🏬','Total Stores',d.kpis.total_stores,'network'],['🛒','Total Orders',fmt(d.kpis.total_orders),'orders'],['₹','Total Contribution',money(d.kpis.total_contribution),'contribution'],['⚠️','Loss-Making Stores',d.kpis.loss_making_stores,'needs attention']].map(x=>`<div class="kpi"><div class="kpi-top"><span class="kpi-icon">${x[0]}</span><div class="label">${x[1]}</div></div><div class="value">${x[2]}</div><div class="hint">${x[3]}</div></div>`).join('')}</div><div class="card"><div class="card-head"><div><div class="card-title">Store focus</div><div class="card-sub">Use the filter to inspect one store while keeping the dashboard structure intact.</div></div><select class="filter" onchange="window.storeFilter=this.value;render()"><option value="ALL">All stores</option>${all.map(r=>`<option ${storeFilter===r.store_id?'selected':''}>${r.store_id}</option>`).join('')}</select></div></div><div class="grid-2"><div class="card"><div class="card-head"><div><div class="card-title">Orders by Store</div><div class="card-sub">Order volume across the dark-store network</div></div></div><div class="chart">${svgBar(rows.map(r=>({label:r.store_id,orders:r.orders})),{key:'orders',color:'#7f68b3',format:fmt,xTitle:'Store ID',yTitle:'Orders'})}</div></div><div class="card"><div class="card-head"><div><div class="card-title">Store P&L by Store</div><div class="card-sub">Contribution less estimated rent over the analysis period</div></div></div><div class="chart">${svgBar(rows.map(r=>({label:r.store_id,pnl:r.pnl})),{key:'pnl',color:'#8d6db5',format:money,xTitle:'Store ID',yTitle:'P&L (₹)'})}</div></div><div class="card"><div class="card-head"><div><div class="card-title">Contribution by Store</div><div class="card-sub">Contribution generated by orders</div></div></div><div class="chart">${svgBar(rows.map(r=>({label:r.store_id,contribution:r.contribution})),{key:'contribution',color:'#9a70b8',format:money,xTitle:'Store ID',yTitle:'Contribution (₹)'})}</div></div><div class="card"><div class="card-head"><div><div class="card-title">Return Rate by Store</div><div class="card-sub">Returned orders as a share of total orders</div></div></div><div class="chart">${svgBar(rows.map(r=>({label:r.store_id,return_rate:r.return_rate*100})),{key:'return_rate',color:'#4f8cff',format:pct,xTitle:'Store ID',yTitle:'Return Rate (%)'})}</div></div></div><div class="insight product-insights dashboard-insights"><h3>INSIGHTS</h3>
<div class="insight-block fix"><h4>Recommendation:</h4><ul>
<li><strong>S07:</strong> Investigate high returns and the resulting contribution drag.</li>
<li><strong>S03:</strong> Improve contribution relative to fixed rent over the analysis period.</li>
</ul></div>
<div class="insight-block value"><h4>Key insights:</h4><ul>
<li>${esc(d.insights[0])}</li>
<li>${esc(d.insights[1])}</li>
</ul></div>
<div class="insight-block categories"><h4>What would make us wrong?</h4><ul>
<li>Temporary operational/data issues or missing costs could change the conclusion.</li>
<li>The conclusion could also shift if returns are temporary or if relevant store-level costs/revenues are missing.</li>
</ul></div>
<div class="insight-block discount"><h4>Action:</h4><ul>
<li>Investigate S07's return drivers first and review S03's contribution generation versus fixed rent.</li>
</ul></div>
</div><div class="card"><div class="card-head"><div><div class="card-title">Store detail</div><div class="card-sub">Same source data, now accessible and readable on the web.</div></div></div>${storeTable(rows)}</div></div>`)}
function storeTable(rows){return `<div class="table-wrap"><table class="table"><thead><tr><th>Store</th><th>Orders</th><th>Contribution</th><th>P&L</th><th>Return rate</th><th>Status</th></tr></thead><tbody>${rows.map(r=>`<tr><td><strong>${r.store_id}</strong></td><td>${fmt(r.orders)}</td><td>${money(r.contribution)}</td><td>${money(r.pnl)}</td><td>${pct(r.return_rate*100)}</td><td><span class="pill ${r.status==='Profitable'?'good':'bad'}">${r.status}</span></td></tr>`).join('')}</tbody></table></div>`}
function deliveryPage(){
  const d=DATA.delivery,
    rows=d.store_rows.filter(r=>storeFilter==='ALL'||r.store_id===storeFilter);

  /*
   * Detailed delivery analysis from the supplied order / trip / partner files.
   * Kept local to the Delivery dashboard so the Store and Product dashboards
   * remain unchanged.
   */
  const partnerRows=[
    {id:'P0079',orders:397,onTime:21.41,delay:3.60,rating:3.9,vehicle:'EV Scooter'},
    {id:'P0027',orders:444,onTime:21.62,delay:3.39,rating:3.4,vehicle:'Bicycle'},
    {id:'P0081',orders:403,onTime:22.08,delay:3.64,rating:4.8,vehicle:'Bicycle'},
    {id:'P0082',orders:399,onTime:22.31,delay:3.54,rating:4.2,vehicle:'Petrol Scooter'},
    {id:'P0077',orders:405,onTime:22.47,delay:3.68,rating:4.5,vehicle:'Bicycle'}
  ];
  const promiseStats={
    delivered:48510,
    onTime:54.09,
    avgActual:14.99,
    avgPromised:15.00,
    avgDelay:-0.01
  };

  return layout(
    'Delivery & Fulfilment',
    '02 / Service quality',
    'Are we delivering what we say we deliver? Track on-time performance, returns, late deliveries and recovery opportunities.',
    `<a class="btn primary" href="./data/Delivery_and_fulfilment.xlsx" download>↓ Download source Excel</a>`,
    `<div class="dashboard-shell">
      <div class="kpis">${[
        ['📦','Delivered Orders',fmt(d.kpis.delivered_orders),'trips delivered'],
        ['⏱️','On-Time Delivery',pct(d.kpis.on_time_delivery_pct),'network average'],
        ['🚨','Late Deliveries',fmt(d.kpis.late_deliveries),'late trips'],
        ['↩️','Return Rate',pct(d.kpis.return_rate),'returned orders'],
        ['🚚','Avg. Delivery Time','10.84 min','pickup to delivery']
      ].map(x=>`<div class="kpi"><div class="kpi-top"><span class="kpi-icon">${x[0]}</span><div class="label">${x[1]}</div></div><div class="value">${x[2]}</div><div class="hint">${x[3]}</div></div>`).join('')}</div>

      <div class="card filter-card">
        <div class="card-head">
          <div>
            <div class="card-title">Store filter</div>
            <div class="card-sub">Filter the store-level delivery charts just like the other dashboards.</div>
          </div>
          <select class="filter" onchange="window.storeFilter=this.value;render()">
            <option value="ALL">All stores</option>
            ${d.store_rows.map(r=>`<option ${storeFilter===r.store_id?'selected':''}>${r.store_id}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-head"><div><div class="card-title">On-Time Delivery % by Store</div><div class="card-sub">S03 and S07 are visibly below the network cluster</div></div></div>
          <div class="chart">${svgBar(rows.map(r=>({label:r.store_id,value:r.on_time_pct})),{key:'value',color:'#3f87b2',format:pct,xTitle:'Store ID',yTitle:'On-Time Delivery (%)'})}</div>
        </div>
        <div class="card">
          <div class="card-head"><div><div class="card-title">Return Rate by Store</div><div class="card-sub">Returned trips as a percentage of store volume</div></div></div>
          <div class="chart">${svgBar(rows.map(r=>({label:r.store_id,value:r.return_rate})),{key:'value',horizontal:true,color:'#3f87b2',format:pct,xTitle:'Return Rate (%)',yTitle:'Store ID'})}</div>
        </div>
        <div class="card">
          <div class="card-head"><div><div class="card-title">Average Pickup-to-Delivery Time</div><div class="card-sub">Minutes from pickup to delivery</div></div></div>
          <div class="chart">${svgBar(rows.map(r=>({label:r.store_id,value:r.avg_delivery_min})),{key:'value',color:'#3f87b2',format:v=>Number(v).toFixed(1)+' min',xTitle:'Store ID',yTitle:'Average Delivery Time (min)'})}</div>
        </div>
        <div class="card">
          <div class="card-head"><div><div class="card-title">Trip Status Distribution</div><div class="card-sub">Delivered, returned and unresolved trip records</div></div></div>
          <div class="chart">${svgDonut(d.status.map(x=>({label:x.trip_status==='NULL'?'unresolved':x.trip_status,value:x.count})))}</div>
        </div>
        <div class="card">
          <div class="card-head"><div><div class="card-title">Late Deliveries by Store</div><div class="card-sub">Absolute late-trip volume</div></div></div>
          <div class="chart">${svgBar(rows.map(r=>({label:r.store_id,value:r.late_deliveries})),{key:'value',horizontal:true,color:'#38a6c8',format:fmt,xTitle:'Late Deliveries',yTitle:'Store ID'})}</div>
        </div>
        <div class="card">
          <div class="card-head"><div><div class="card-title">Daily On-Time Delivery Trend</div><div class="card-sub">Daily network service-level movement</div></div></div>
          <div class="chart">${svgLine(d.trend.map(x=>({date:x.date,value:Number(x.on_time_pct)*100})),{yKey:'value',format:pct,xTitle:'Date',yTitle:'On-Time Delivery (%)'})}</div>
        </div>
      </div>

      <section class="delivery-deep-dive">
        <div class="section-title">Delivery Deep Dive</div>
        <div class="delivery-analysis-grid">
          <div class="card delivery-promise-card">
            <div class="card-head">
              <div>
                <div class="card-title">Promised vs Actual Delivery</div>
                <div class="card-sub">Calculated from delivered orders using order time → delivered time.</div>
              </div>
            </div>
            <div class="promise-metrics">
              <div><span>Avg promised</span><strong>${promiseStats.avgPromised.toFixed(2)} min</strong></div>
              <div><span>Avg actual</span><strong>${promiseStats.avgActual.toFixed(2)} min</strong></div>
              <div><span>Avg delay</span><strong>${promiseStats.avgDelay.toFixed(2)} min</strong></div>
              <div><span>On-time</span><strong>${promiseStats.onTime.toFixed(2)}%</strong></div>
            </div>
            <div class="delivery-callout">
              <strong>What this means:</strong>
              The network average is almost exactly at the promised 15-minute level, but only 54.09% of delivered orders meet the individual promise. The store and partner outliers therefore matter more than the network average alone.
            </div>
          </div>

          <div class="card">
            <div class="card-head">
              <div>
                <div class="card-title">Partner Performance</div>
                <div class="card-sub">Lowest on-time performers among partners with 100+ delivered orders.</div>
              </div>
            </div>
            <div class="table-wrap delivery-partner-table-wrap">
              <table class="table delivery-partner-table">
                <thead><tr><th>Partner</th><th>Orders</th><th>On-Time</th><th>Avg Delay</th><th>Rating</th><th>Vehicle</th></tr></thead>
                <tbody>${partnerRows.map(r=>`<tr>
                  <td><strong>${r.id}</strong></td>
                  <td>${fmt(r.orders)}</td>
                  <td class="negative-profit">${r.onTime.toFixed(2)}%</td>
                  <td class="negative-profit">+${r.delay.toFixed(2)} min</td>
                  <td>${r.rating.toFixed(1)} ★</td>
                  <td>${esc(r.vehicle)}</td>
                </tr>`).join('')}</tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <div class="card partner-chart-card">
        <div class="card-head">
          <div>
            <div class="card-title">Partner On-Time Performance</div>
            <div class="card-sub">Lowest on-time performers among partners with 100+ delivered orders.</div>
          </div>
        </div>
        <div class="chart partner-performance-chart">${svgBar(partnerRows.map(r=>({label:r.id,value:r.onTime})),{key:'value',horizontal:true,color:'#3f87b2',format:pct,xTitle:'On-Time Delivery (%)',yTitle:'Delivery Partner'})}</div>
      </div>

      <div class="insight product-insights dashboard-insights">
        <h3>INSIGHTS</h3>
        <div class="insight-block fix"><h4>Delivery performance:</h4><ul>${d.findings.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
        <div class="insight-block value"><h4>Partner & promise analysis:</h4><ul>
          <li><strong>S03 and S07:</strong> their weak store-level delivery performance is also visible at partner level; S03's lowest-performing partners include P0027 at 21.62% on-time, while S07 includes P0079 at 21.41% on-time.</li>
          <li><strong>Promised vs actual:</strong> detailed order data averages 14.99 minutes actual against a 15.00-minute promise, but only 54.09% of delivered orders meet the promise.</li>
          <li><strong>Partner investigation:</strong> the lowest-performing partners combine roughly 21–22% on-time delivery with around 3.4–3.7 minutes average delay, making them useful first candidates for operational review.</li>
        </ul></div>
        <div class="insight-block value"><h4>Potential contribution recovery:</h4><ul>
          <li><strong>How it is calculated:</strong> Excess returns = actual store returns − returns expected at the observed network baseline of <strong>3.15%</strong>.</li>
          <li>Potential recovery estimates the contribution recovered if those excess returns are reduced toward that baseline.</li>
        </ul>
        <div class="formula">Excess Returns = Actual Returns − (Orders × 3.15%)<br>Potential Recovery = Excess Returns × Estimated Contribution Loss per Return</div></div>
        <div class="insight-block categories"><h4>Store recovery:</h4><ul>${d.recovery.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      </div>

      <div class="card">
        <div class="card-head"><div><div class="card-title">Delivery detail</div><div class="card-sub">Store-level service metrics from the same source data, presented in a readable web table.</div></div></div>
        <div class="table-wrap"><table class="table"><thead><tr><th>Store</th><th>On-Time Delivery</th><th>Avg. Delivery Time</th><th>Return Rate</th><th>Late Deliveries</th><th>Status</th></tr></thead><tbody>${rows.map(r=>`<tr><td><strong>${r.store_id}</strong></td><td>${pct(r.on_time_pct)}</td><td>${Number(r.avg_delivery_min).toFixed(1)} min</td><td>${pct(r.return_rate)}</td><td>${fmt(r.late_deliveries)}</td><td><span class="pill ${r.on_time_pct>=50&&r.return_rate<5?'good':'bad'}">${r.on_time_pct>=50&&r.return_rate<5?'Healthy':'Needs attention'}</span></td></tr>`).join('')}</tbody></table></div>
      </div>
    </div>`
  );
}

function productPage(){const d=DATA.product;let cats=d.categories.filter(x=>categoryFilter==='ALL'||x.category===categoryFilter), promos=d.promos.filter(x=>promoFilter==='ALL'||x.promo_code===promoFilter), stores=d.store_rows.filter(x=>storeFilter==='ALL'||x.store_id===storeFilter);return layout('Product & Promotions','03 / Commercial mix','What are we selling, and which discounts are costing us? Explore store economics, category mix and promo-code impact.',`<a class="btn primary" href="./data/Product_and_Promotions.xlsx" download>↓ Download source Excel</a>`, `<div class="dashboard-shell"><div class="kpis">${[['🛒','Total Orders',fmt(d.kpis.total_orders),'network'],['₹','Total Gross Revenue',compact(d.kpis.total_gross_revenue),'gross sales'],['📦','Total Categories',d.kpis.total_category,'active categories'],['🏷️','Avg Discount Cost',money(d.kpis.avg_discount_cost),'per promo order'],['🏬','Total Stores',d.kpis.total_stores,'network']].map(x=>`<div class="kpi"><div class="kpi-top"><span class="kpi-icon">${x[0]}</span><div class="label">${x[1]}</div></div><div class="value">${x[2]}</div><div class="hint">${x[3]}</div></div>`).join('')}</div><div class="card"><div class="card-head"><div><div class="card-title">Dashboard filters</div><div class="card-sub">Interactive filters replace the Excel slicers while keeping the same analysis flow.</div></div><div class="filters"><select class="filter" onchange="window.storeFilter=this.value;render()"><option value="ALL">All stores</option>${d.store_rows.map(r=>`<option ${storeFilter===r.store_id?'selected':''}>${r.store_id}</option>`).join('')}</select><select class="filter" onchange="window.categoryFilter=this.value;render()"><option value="ALL">All categories</option>${d.categories.map(r=>`<option ${categoryFilter===r.category?'selected':''}>${esc(r.category)}</option>`).join('')}</select><select class="filter" onchange="window.promoFilter=this.value;render()"><option value="ALL">All promo codes</option>${d.promos.map(r=>`<option ${promoFilter===r.promo_code?'selected':''}>${r.promo_code}</option>`).join('')}</select></div></div></div><section><div class="section-title">Store Analysis</div><div class="grid-3"><div class="card"><div class="card-title">Store with Total Orders</div><div class="chart">${svgBar(stores.map(r=>({label:r.store_id,value:r.total_orders})),{key:'value',color:'#f5bd3f',format:fmt,xTitle:'Store ID',yTitle:'Total Orders'})}</div></div><div class="card"><div class="card-title">Store with Gross Revenue</div><div class="chart">${svgBar(stores.map(r=>({label:r.store_id,value:r.gross_revenue})),{key:'value',color:'#ff8a3d',format:compact,xTitle:'Store ID',yTitle:'Gross Revenue (₹)'})}</div></div><div class="card"><div class="card-title">Store Share in Profits</div><div class="chart">${svgDonut(stores.map(r=>({label:r.store_id,value:Math.max(0,r.profit)})))}</div></div><div class="card"><div class="card-title">Store with Delivery Percentage</div><div class="chart">${svgBar(stores.map(r=>({label:r.store_id,value:r.delivery_pct*100})),{key:'value',color:'#4f80d5',format:pct,xTitle:'Store ID',yTitle:'On-Time Delivery (%)'})}</div></div><div class="card"><div class="card-title">Store with Total Return Orders</div><div class="chart">${svgBar(stores.map(r=>({label:r.store_id,value:r.return_pct*100})),{key:'value',color:'#f5bd3f',format:pct,xTitle:'Store ID',yTitle:'Return Rate (%)'})}</div></div><div class="card"><div class="card-title">Store with Cancel Percentage</div><div class="chart">${svgBar(stores.map(r=>({label:r.store_id,value:r.cancel_pct})),{key:'value',color:'#f5bd3f',format:v=>Number(v).toFixed(2)+'%',xTitle:'Store ID',yTitle:'Cancel Percentage (%)'})}</div></div></div><div class="insight product-insights" style="margin-top:18px"><h3>INSIGHTS</h3>
<div class="insight-block fix"><h4>Fix S07 &amp; S03:</h4><ul>
<li>S07 has 14.0% returns + 83.8% delivery;</li>
<li>S03 has 7.9% returns + ₹2.78L discounts.</li>
</ul></div>
<div class="insight-block value"><h4>Value:</h4><ul>
<li>Bringing them to the median store contribution margin could recover roughly ₹6.34L (S07) + ₹3.42L (S03) = ₹9.76L.</li>
</ul></div>
<div class="insight-block categories"><h4>Categories:</h4><ul>
<li>Bakery Beverages</li>
<li>Dairy &amp; Eggs</li>
<li>Fruits &amp; Vegetables</li>
<li>Household</li>
<li>Meat &amp; Seafood</li>
<li>Personal Care</li>
<li>Snacks &amp; Packaged</li>
</ul></div>
<div class="insight-block discount"><h4>Discount cost:</h4><ul>
<li>₹15.61L total; FRESH50 alone costs ₹5.07L and contributes less gross revenue.</li>
</ul></div>
</div></section><section><div class="section-title">Category Analysis</div><div class="grid-3"><div class="card"><div class="card-title">Category with Units Sold</div><div class="chart">${svgBar(cats.map(r=>({label:r.category,value:r.units_sold})),{key:'value',color:'#ff8a3d',format:fmt,xTitle:'Category',yTitle:'Units Sold'})}</div></div><div class="card"><div class="card-title">Category with Gross Revenue</div><div class="chart">${svgBar(cats.map(r=>({label:r.category,value:r.revenue})),{key:'value',color:'#f5bd3f',format:compact,xTitle:'Category',yTitle:'Gross Revenue (₹)'})}</div></div><div class="card"><div class="card-title">Category with Profit Margin %</div><div class="chart">${svgBar(cats.map(r=>({label:r.category,value:r['Profit Margin Percentage']*100})),{key:'value',color:'#f5bd3f',format:pct,xTitle:'Category',yTitle:'Profit Margin (%)'})}</div></div></div></section><section><div class="section-title">Promo Code Analysis</div><div class="grid-3"><div class="card"><div class="card-title">Promo Code with No. of Orders</div><div class="chart">${svgBar(promos.map(r=>({label:r.promo_code,value:r.orders_used})),{key:'value',horizontal:true,color:'#4f80d5',format:fmt,xTitle:'Orders',yTitle:'Promo Code'})}</div></div><div class="card"><div class="card-title">Promo Code with Total Discount Cost</div><div class="chart">${svgBar(promos.map(r=>({label:r.promo_code,value:r.total_discount_given})),{key:'value',horizontal:true,color:'#ff8a3d',format:compact,xTitle:'Discount Cost (₹)',yTitle:'Promo Code'})}</div></div><div class="card"><div class="card-title">Promo Code with Gross Revenue</div><div class="chart">${svgBar(promos.map(r=>({label:r.promo_code,value:r.gross_revenue})),{key:'value',horizontal:true,color:'#4f80d5',format:compact,xTitle:'Gross Revenue (₹)',yTitle:'Promo Code'})}</div></div></div><div class="card" style="margin-top:18px"><div class="card-head"><div><div class="card-title">Promotion detail</div><div class="card-sub">Discount cost and contribution make promo efficiency visible.</div></div></div><div class="table-wrap"><table class="table"><thead><tr><th>Promo</th><th>Orders</th><th>Gross revenue</th><th>Discount cost</th><th>Avg discount</th><th>Contribution</th></tr></thead><tbody>${promos.map(r=>`<tr><td><strong>${r.promo_code}</strong></td><td>${fmt(r.orders_used)}</td><td>${money(r.gross_revenue)}</td><td>${money(r.total_discount_given)}</td><td>${money(r.avg_discount)}</td><td><span class="pill ${r.contribution>=0?'good':'bad'}">${money(r.contribution)}</span></td></tr>`).join('')}</tbody></table></div></div></section></div>`)}
function home(){return layout('Business Analytics','ZIPTO / Hackathon Analytics','Turning dark-store operations data into clear, decision-ready insights through three connected analytical views.',`<button class="btn primary" onclick="window.setDash('store')">Explore dashboards →</button>`, `<div class="home-hero"><div class="home-copy"><div class="home-badge">ACCIOJOB HACKATHON • BUSINESS ANALYTICS</div><h3>From raw data to <span>business decisions.</span></h3><p>ZIPTO brings store economics, delivery performance, and product & promotion analysis together in one interactive analytics experience.</p><div class="home-actions"><button class="btn primary" onclick="window.setDash('store')">Start exploring →</button><a class="btn" href="https://github.com/AryanChoudhary2005/ZIPTO-Business-Analytics" target="_blank">View GitHub ↗</a></div></div><div class="home-visual"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="home-z">Z</div><div class="home-visual-label">DARK-STORE<br><strong>INTELLIGENCE</strong></div></div></div><div class="home-section-head"><div><div class="eyebrow">EXPLORE THE ANALYSIS</div><h3>Three dashboards. One business story.</h3></div><p>Each view answers a different operational question while sharing the same visual language and navigation.</p></div><div class="home-dash-grid"><button class="home-dash-card" onclick="window.setDash('store')"><span class="home-card-number">01</span><span class="home-card-icon">🏪</span><strong>Store Performance</strong><span>Profitability, contribution, P&amp;L, orders and returns.</span><em>Explore →</em></button><button class="home-dash-card" onclick="window.setDash('delivery')"><span class="home-card-number">02</span><span class="home-card-icon">🚚</span><strong>Delivery &amp; Fulfilment</strong><span>On-time delivery, delays, returns and recovery opportunities.</span><em>Explore →</em></button><button class="home-dash-card" onclick="window.setDash('product')"><span class="home-card-number">03</span><span class="home-card-icon">🛒</span><strong>Product &amp; Promotions</strong><span>Categories, revenue, margins and promotional discount costs.</span><em>Explore →</em></button></div><div class="home-bottom"><div class="home-panel"><div class="eyebrow">THE ANALYTICS FLOW</div><h3>Data → Analysis → Insight → Decision</h3><p>Cleaned business data is transformed into KPIs, interactive visualisations and focused business insights.</p><div class="flow"><span>Raw Data</span><i>→</i><span>Analysis</span><i>→</i><span>Visualisation</span><i>→</i><span>Insight</span></div></div><div class="home-panel team-panel"><div class="eyebrow">PROJECT TEAM</div><h3>Built together.</h3><div class="team-list"><div><span class="avatar">A</span><span><strong>Aryan Choudhary</strong><small>Team Member</small></span></div><div><span class="avatar">R</span><span><strong>Rinky Kumari</strong><small>Team Member</small></span></div><div><span class="avatar">D</span><span><strong>Deepak Kumar</strong><small>Team Member</small></span></div></div></div></div>`)}
function render(){if(!DATA){$('#app').innerHTML='<div class="empty">Loading ZIPTO analytics…</div>';return}let html=current==='home'?home():current==='overall'?overallPage():current==='store'?storePage():current==='delivery'?deliveryPage():productPage();$('#app').innerHTML=html;bindTips();}
window.setDash=id=>{current=id;window.scrollTo({top:0,behavior:'smooth'});render()};window.storeFilter='ALL';Object.defineProperty(window,'storeFilter',{get(){return storeFilter},set(v){storeFilter=v}});Object.defineProperty(window,'categoryFilter',{get(){return categoryFilter},set(v){categoryFilter=v}});Object.defineProperty(window,'promoFilter',{get(){return promoFilter},set(v){promoFilter=v}});window.render=render;
render();
})();
