const newsContainer = document.getElementById("trending");

async function fetchTrending() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/search/trending"
    );
    const data = await res.json();

    renderTrending(data.coins);
  } catch (err) {
    console.error(err);
    newsContainer.innerHTML = "<p>Failed to load trending data</p>";
  }
}

function renderTrending(coins) {
  newsContainer.innerHTML = "<h3>🔥 Trending Cryptos (24h)</h3>";

  coins.forEach(item => {
    const coin = item.item;

    const card = document.createElement("div");
    card.className = "news-card";

    card.innerHTML = `
      <h3>${coin.name} (${coin.symbol})</h3>
      <p>Market Cap Rank: #${coin.market_cap_rank}</p>
      <img src="${coin.small}" />
      <a href="https://www.coingecko.com/en/coins/${coin.id}" target="_blank">
        View Details →
      </a>
    `;

    newsContainer.appendChild(card);
  });
}

fetchTrending();
