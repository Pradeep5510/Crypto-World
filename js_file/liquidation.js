const tbody = document.getElementById("liq-body");

if (!tbody) {
  console.error("❌ liq-body not found in DOM");
}

let liquidations = [];

const ws = new WebSocket("wss://fstream.binance.com/ws/!forceOrder@arr");

ws.onopen = () => {
  console.log("✅ Binance liquidation WebSocket connected");
};

ws.onmessage = (event) => {
  const payload = JSON.parse(event.data);

  payload.forEach(({ o }) => {
    const price = Number(o.p);
    const qty = Number(o.q);
    const usd = price * qty;

    liquidations.unshift({
      symbol: o.s.replace("USDT", ""),
      side: o.S === "SELL" ? "LONG" : "SHORT",
      price: price.toFixed(2),
      usd,
      time: new Date(o.T).toLocaleTimeString()
    });
  });

  liquidations = liquidations
    .sort((a, b) => b.usd - a.usd)
    .slice(0, 10);

  render();
};

ws.onerror = (e) => {
  console.error("❌ WebSocket error", e);
};

function render() {
  tbody.innerHTML = "";

  liquidations.forEach(l => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${l.symbol}</td>
      <td style="color:${l.side === "LONG" ? "red" : "green"}">${l.side}</td>
      <td>$${l.price}</td>
      <td>$${Math.round(l.usd).toLocaleString()}</td>
      <td>${l.time}</td>
    `;

    tbody.appendChild(tr);
  });
}
