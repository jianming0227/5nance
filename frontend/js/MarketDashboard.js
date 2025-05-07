const dropdown = document.getElementById('watchlist-dropdown');
const groups = {
    stock: document.getElementById('stock-group'),
    etf: document.getElementById('etf-group'),
    crypto: document.getElementById('crypto-group')
};

dropdown.addEventListener('change', function () {
    const selected = this.value;
    Object.keys(groups).forEach((key) => {
        groups[key].classList.toggle('d-none', key !== selected);
    });
});

