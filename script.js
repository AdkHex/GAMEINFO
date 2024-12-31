const API_KEY = 'ac7dee355a3747db899753f65e48987f'; // Replace with your RAWG.io API key
const API_URL = 'https://api.rawg.io/api/games';

document.getElementById('fetch-button').addEventListener('click', fetchGames);
document.getElementById('game-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') fetchGames();
});

async function fetchGames() {
    const gameInput = document.getElementById('game-input').value;
    const gameInfoContainer = document.getElementById('game-info');
    gameInfoContainer.innerHTML = ''; // Clear previous results

    if (!gameInput) {
        gameInfoContainer.innerHTML = '<p>Please enter a game name.</p>';
        return;
    }

    try {
        const response = await fetch(`${API_URL}?search=${gameInput}&key=${API_KEY}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            data.results.forEach(game => {
                const gameCard = document.createElement('div');
                gameCard.classList.add('game-card');
                gameCard.innerHTML = `
                    <img src="${game.background_image}" alt="${game.name}" />
                    <h3>${game.name}</h3>
                `;
                gameCard.addEventListener('click', () => {
                    localStorage.setItem('gameId', game.id);
                    window.location.href = 'details.html';
                });
                gameInfoContainer.appendChild(gameCard);
            });
        } else {
            gameInfoContainer.innerHTML = '<p>No games found. Try a different name.</p>';
        }
    } catch (error) {
        console.error(error);
        gameInfoContainer.innerHTML = '<p>Failed to fetch game info. Please try again later.</p>';
    }
}
