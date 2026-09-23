window.ZIPTO_DATA = null;
fetch('./data/dashboardData.json').then(r=>r.json()).then(d=>{window.ZIPTO_DATA=d; window.dispatchEvent(new Event('zipto-data-ready'));}).catch(()=>{window.ZIPTO_DATA={};window.dispatchEvent(new Event('zipto-data-ready'));});
