// Load Global Stats
async function loadGlobalStats() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/global");
    const data = await res.json();
    const stats = data.data;

    // const coins = stats.active_cryptocurrencies.toLocaleString();
    // const exchanges = stats.markets.toLocaleString();
    const marketCap = `$${(stats.total_market_cap.usd / 1e12).toFixed(3)}T`;
    const marketCapChange = stats.market_cap_change_percentage_24h_usd.toFixed(2);
    const volume = `$${(stats.total_volume.usd / 1e9).toFixed(3)}B`;
    const btcDom = stats.market_cap_percentage.btc.toFixed(1);
    const ethDom = stats.market_cap_percentage.eth.toFixed(1);

    document.getElementById("globalStats").innerHTML = `
      Market Cap: <b>${marketCap}</b> 
      <span style="color:${marketCapChange >= 0 ? "green" : "red"}">
        ${marketCapChange >= 0 ? "▲" : "▼"} ${marketCapChange}%
      </span> &nbsp;&nbsp;
      24h Vol: <b>${volume}</b> &nbsp;&nbsp;
      Dominance: <b>BTC ${btcDom}%</b> &nbsp; <b>ETH ${ethDom}%</b>
    `;
  } catch (error) {
    console.error("Error loading global stats:", error);
  }
}

// Load Coins Table (with sparkline)
async function loadCoins() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true"
    );
    const data = await res.json();

    const tableBody = document.querySelector("#coinTable tbody");
    tableBody.innerHTML = "";

    data.forEach((coin, index) => {
      const row = document.createElement("tr");
      const chartId = `chart-${coin.id}`;

      row.innerHTML = `
        <td>${index + 1}</td>
        <td><img src="${coin.image}" width="20" style="vertical-align:middle;"> 
            ${coin.name} (${coin.symbol.toUpperCase()})</td>
        <td>$${coin.current_price.toLocaleString()}</td>
        <td class="${coin.price_change_percentage_24h >= 0 ? "green" : "red"}">
          ${coin.price_change_percentage_24h?.toFixed(2)}%
        </td>
        <td>$${coin.market_cap.toLocaleString()}</td>
        <td><canvas id="${chartId}"></canvas></td>
      `;

      tableBody.appendChild(row);

      const ctx = document.getElementById(chartId).getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: coin.sparkline_in_7d.price.map((_, i) => i),
          datasets: [
            {
              data: coin.sparkline_in_7d.price,
              borderColor: coin.price_change_percentage_24h >= 0 ? "green" : "red",
              borderWidth: 1,
              pointRadius: 0,
              fill: false,
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { display: false } }
        }
      });
    });
  } catch (error) {
    console.error("Error loading coins:", error);
  }
}
async function loadFearGreed() {
  try {
    const res = await fetch("https://api.alternative.me/fng/?limit=1");
    const data = await res.json();
    const index = data.data[0];

    const fgDiv = document.getElementById("fearGreed");
    fgDiv.innerHTML = `
      Fear & Greed Index: <b>${index.value}</b> 
      (<span style="color:${index.value < 30 ? "red" : index.value > 70 ? "green" : "orange"}">
        ${index.value_classification}
      </span>)
    `;
  } catch (error) {
    console.error("Error loading Fear & Greed Index:", error);
  }
}

// Call function
loadFearGreed();
// Refresh every 60 mins
setInterval(loadFearGreed, 3600000);

// Initial load
loadGlobalStats();
loadCoins();

// Refresh every 60 seconds
setInterval(() => {
  loadGlobalStats();
  loadCoins();
}, 60000);
