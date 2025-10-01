async function loadCryptoNews() {
  try {
    // Ideally call your backend route like /api/news that proxies a news API
    const res = await fetch('/api/crypto-news');
    const articles = await res.json();

    const container = document.querySelector('.crypto-news');
    container.innerHTML = '';

    if (!articles.length) {
      container.innerHTML = '<p>No news available.</p>';
      return;
    }

    const ul = document.createElement('ul');
    articles.forEach(article => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = article.url;
      a.textContent = article.title;
      a.target = '_blank';
      li.appendChild(a);
      ul.appendChild(li);
    });
    container.appendChild(ul);
  } catch (err) {
    console.error('Error loading news:', err);
    document.querySelector('.crypto-news').innerHTML = '<p>Failed to fetch news.</p>';
  }
}

// Initial load and auto-refresh every 5 minutes
loadCryptoNews();
setInterval(loadCryptoNews, 5 * 60 * 10);
