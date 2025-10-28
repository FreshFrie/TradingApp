// Simple CSV loader and Chart.js plot for EUR/USD close price
(function () {
  const csvPath = '/market-chart/data/EURUSD_1m.csv';
  const ctx = document.getElementById('priceChart').getContext('2d');

  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    const header = lines.shift().split(',').map(h => h.trim());
    const rows = lines.map(line => {
      const cols = line.split(',').map(c => c.trim());
      const obj = {};
      header.forEach((h, i) => (obj[h] = cols[i]));
      return obj;
    });
    return rows;
  }

  function loadCSV(url) {
    return fetch(url).then(res => {
      if (!res.ok) throw new Error('Failed to load CSV: ' + res.status);
      return res.text();
    }).then(parseCSV);
  }

  function formatLabels(rows) {
    // Shorten timestamps for labels (HH:MM)
    return rows.map(r => r.timestamp.replace(/^\d{4}-\d{2}-\d{2}\s*/, ''));
  }

  function toNumbers(rows, field) {
    return rows.map(r => Number(r[field]));
  }

  loadCSV(csvPath).then(rows => {
    const labels = formatLabels(rows);
    const closes = toNumbers(rows, 'close');

    // Create Chart.js line chart
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Close',
          data: closes,
          borderColor: '#2b8cbe',
          backgroundColor: 'rgba(43,140,190,0.08)',
          tension: 0.15,
          pointRadius: 2,
          pointHoverRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { display: true, title: { display: true, text: 'Time (HH:MM)' } },
          y: { display: true, title: { display: true, text: 'Price (EUR/USD)' } }
        }
      }
    });
  }).catch(err => {
    console.error(err);
    const p = document.createElement('p');
    p.textContent = 'Error loading chart data: ' + err.message;
    p.style.color = 'crimson';
    document.querySelector('.container').appendChild(p);
  });

})();
