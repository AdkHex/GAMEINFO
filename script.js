const API_KEY = 'YOUR API KEY';
const API_URL = 'https://api.rawg.io/api/games';

document.getElementById('fetch-button').addEventListener('click', fetchGames);
document.getElementById('game-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') fetchGames();
});

async function fetchGames() {
    const gameInput = document.getElementById('game-input').value;
    const gameInfo = document.getElementById('game-info');
    gameInfo.innerHTML = '';

    if (!gameInput) {
        gameInfo.innerHTML = '<p>Please enter a game name.</p>';
        return;
    }

    try {
        const response = await fetch(`${API_URL}?search=${gameInput}&key=${API_KEY}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            data.results.forEach(game => {
                const gameCard = createGameCard(game);
                gameInfo.appendChild(gameCard);
            });
        } else {
            gameInfo.innerHTML = '<p>No games found. Try a different name.</p>';
        }
    } catch (error) {
        console.error(error);
        gameInfo.innerHTML = '<p>Failed to fetch games. Please try again later.</p>';
    }
}

function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    const platforms = game.parent_platforms?.map(p => p.platform.name).join(', ') || '';
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${game.background_image}" alt="${game.name}">
        </div>
        <div class="card-content">
            <div class="platform-icons">
                ${getPlatformIcons(game.parent_platforms)}
            </div>
            <h3>${game.name}</h3>
            <div class="rating">${game.rating || 'N/A'}</div>
        </div>
        <div class="hover-card">
            <p>Release date: ${game.released || 'TBA'}</p>
            <p>Available on: ${platforms}</p>
            <button onclick="viewGameDetails(${game.id})">More Info</button>
        </div>
    `;
    
    return card;
}

function getPlatformIcons(platforms) {
    const iconMap = {
        pc: 'windows',
        playstation: 'playstation',
        xbox: 'xbox',
        nintendo: 'nintendo',
    };
    
    return platforms?.map(p => {
        const platform = p.platform.slug;
        const iconClass = iconMap[platform] || platform;
        return `<span class="platform-icon ${iconClass}"></span>`;
    }).join('') || '';
}

function viewGameDetails(gameId) {
    localStorage.setItem('gameId', gameId);
    window.location.href = 'details.html';
}

// View toggle functionality
document.getElementById('grid-view').addEventListener('click', () => {
    document.getElementById('game-info').className = 'game-grid';
    document.getElementById('grid-view').classList.add('active');
    document.getElementById('list-view').classList.remove('active');
});

document.getElementById('list-view').addEventListener('click', () => {
    document.getElementById('game-info').className = 'game-list';
    document.getElementById('list-view').classList.add('active');
    document.getElementById('grid-view').classList.remove('active');
});