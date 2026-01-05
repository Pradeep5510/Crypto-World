const exchangesContainer = document.getElementById("exchanges");
const API_URL = "https://api.coingecko.com/api/v3/exchanges?per_page=50&page=1";

async function fetchExchanges() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    renderExchanges(data);
  } catch (error) {
    console.error("Failed to load exchanges:", error);
    exchangesContainer.innerHTML = "<p>Error loading exchanges</p>";
  }
}

function renderExchanges(exchanges) {
  exchangesContainer.innerHTML = "";

  exchanges.forEach(exchange => {
    const card = document.createElement("div");
    card.className = "exchange-card";

    card.innerHTML = `
      <img src="${exchange.image}" alt="${exchange.name}" />
      <h3>${exchange.name}</h3>
      <p>🌍 ${exchange.country || "Global"}</p>
      <p>⭐ Trust Score: ${exchange.trust_score ?? "N/A"}</p>
      <p>📊 24h Volume: ${exchange.trade_volume_24h_btc?.toFixed(2) || "N/A"} BTC</p>
      <a href="${exchange.url}" target="_blank">Visit Exchange</a>
    `;

    exchangesContainer.appendChild(card);
  });
}

fetchExchanges();
