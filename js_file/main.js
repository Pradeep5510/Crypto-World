let coinList = [];

// Fetch all coins when page loads
window.onload = async () => {
    try {
        const res = await fetch("https://api.coingecko.com/api/v3/coins/list");
        coinList = await res.json(); // Array of { id, symbol, name }
    } catch (error) {
        console.error("Error fetching coin list:", error);
    }
};

function showSuggestions() {
    const input = document.getElementById('coin').value.trim().toLowerCase();
    const suggestionsBox = document.getElementById('suggestions');
    suggestionsBox.innerHTML = "";

    if (!input) return;

    // Filter coins that match input
    const matches = coinList.filter(
        coin => coin.name.toLowerCase().includes(input) || coin.id.toLowerCase().includes(input)
    ).slice(0, 10); // limit to top 10 suggestions

    matches.forEach(coin => {
        const li = document.createElement('li');
        li.textContent = `${coin.name} (${coin.id})`;
        li.onclick = () => {
            document.getElementById('coin').value = coin.id;
            suggestionsBox.innerHTML = "";
        };
        suggestionsBox.appendChild(li);
    });
}

async function getPrice() {
    const coinInput = document.getElementById('coin').value.trim().toLowerCase();
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinInput}&vs_currencies=usd`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data[coinInput]) {
            document.getElementById('price').innerText =
                `${coinInput.toUpperCase()} Price: $${data[coinInput].usd}`;
        } else {
            document.getElementById('price').innerText = 'Coin not found. Try another name.';
        }
    } catch (error) {
        document.getElementById('price').innerText = 'Error fetching price';
    }
}



