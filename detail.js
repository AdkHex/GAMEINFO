const API_KEY = 'YOUR API KEY HERE';
const API_URL = 'https://api.rawg.io/api/games';

document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = 'index.html';
});

async function fetchGameDetails() {
    const gameId = localStorage.getItem('gameId');
    if (!gameId) {
        document.getElementById('details-content').innerHTML = '<p>No game details found.</p>';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${gameId}?key=${API_KEY}`);
        const game = await response.json();

        // Set banner image
        document.querySelector('.game-banner').innerHTML = `
            <img src="${game.background_image}" alt="${game.name}">
        `;

        // Set game title and platforms
        document.querySelector('.game-title').textContent = game.name;
        document.querySelector('.release-date').textContent = game.released;
        document.querySelector('.genres').innerHTML = game.genres.map((genre)=>genre.name)
        document.querySelector('.publisher').innerHTML = game.publishers.map((publisher)=>publisher.name)

        document.querySelector('.platforms').innerHTML = game.parent_platforms.map((platform)=>platform.platform.name).join(", ")
        
        document.getElementById('.game-description').innerHTML = game.description_raw || 'No description available';
        // Set rankings
        const releaseYear = new Date(game.released).getFullYear();
        document.querySelector('.genre-rank').textContent = `#1 ${game.genres[0]?.name || 'Action'}`;
        document.querySelector('.year-rank').textContent = `#1 TOP ${releaseYear}`;

        // Set ratings
        const ratingStats = calculateRatingStats(game.ratings);
        document.querySelector('.exceptional .count').textContent = ratingStats.exceptional;
        document.querySelector('.recommended .count').textContent = ratingStats.recommended;
        document.querySelector('.meh .count').textContent = ratingStats.meh;

        // Set description

        // Set system requirements
        const pcPlatform = game.platforms?.find(p => p.platform.slug === 'pc');
        const pcRequirements = pcPlatform?.requirements; 
        
        if (pcRequirements) {
          document.querySelector('.requirements').innerHTML = `
            <div class="minimum">
              <h3>Minimum Requirements</h3>
              <p>${formatRequirements(pcRequirements.minimum)}</p>
            </div>
            <div class="recommended">
              <h3>Recommended Requirements</h3>
              <p>${formatRequirements(pcRequirements.recommended)}</p>
            </div>
          `;
        } else {
          document.querySelector('.requirements').innerHTML = '<p>System requirements not available.</p>';
        }
    } catch (error) {
        console.error(error);
        document.getElementById('details-content').innerHTML = '<p>Failed to fetch game details.</p>';
    }
}

function calculateRatingStats(ratings) {
    const stats = {
        exceptional: 0,
        recommended: 0,
        meh: 0
    };
    
    ratings?.forEach(rating => {
        if (rating.title === 'exceptional') stats.exceptional = rating.count;
        if (rating.title === 'recommended') stats.recommended = rating.count;
        if (rating.title === 'meh') stats.meh = rating.count;
    });
    
    return stats;
}

function formatRequirements(reqString) {
    if (!reqString) return 'Not specified';
    return reqString.replace(/Minimum:|Recommended:/i, '').trim();
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

// Initialize page
fetchGameDetails();