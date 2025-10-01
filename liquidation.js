// This function will be globally available
function loadLiquidations() {
  fetch("/api/liquidations")
    .then((res) => res.json())
    .then((data) => {
      const container = document.querySelector(".liquidation");
      container.innerHTML = ""; // Clear old content

      if (!data.length) {
        container.innerHTML = "<p>No liquidation data available.</p>";
        return;
      }

      // Build table
      const table = document.createElement("table");
      table.border = "1";
      table.style.borderCollapse = "collapse";
      table.style.width = "100%";

      // Header row
      const header = document.createElement("tr");
      ["Coin", "24h Longs", "24h Shorts", "24h Total (USD)"].forEach((col) => {
        const th = document.createElement("th");
        th.style.padding = "6px 10px";
        th.textContent = col;
        header.appendChild(th);
      });
      table.appendChild(header);

      // Data rows
      data.forEach((coin) => {
        const row = document.createElement("tr");

        const tdCoin = document.createElement("td");
        tdCoin.textContent = coin.symbol;
        row.appendChild(tdCoin);

        const tdLongs = document.createElement("td");
        tdLongs.textContent = coin.longVolUsd?.toLocaleString() || "-";
        row.appendChild(tdLongs);

        const tdShorts = document.createElement("td");
        tdShorts.textContent = coin.shortVolUsd?.toLocaleString() || "-";
        row.appendChild(tdShorts);

        const tdTotal = document.createElement("td");
        tdTotal.textContent = coin.liqVolUsd?.toLocaleString() || "-";
        row.appendChild(tdTotal);

        table.appendChild(row);
      });

      container.appendChild(table);
    })
    .catch((err) => {
      console.error("Error fetching liquidation data:", err);
      document.querySelector(".liquidation").innerHTML =
        "<p>Failed to load data.</p>";
    });
}
loadLiquidations();
setInterval(loadLiquidations, 6000);