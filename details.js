const API_KEY = 'ac7dee355a3747db899753f65e48987f'; // Replace with your RAWG.io API key
const API_URL = 'https://api.rawg.io/api/games';

document.getElementById('back-button').addEventListener('click', () => {
    window.location.href = 'index.html';
});

(async function fetchGameDetails() {
    const gameId = localStorage.getItem('gameId');
    if (!gameId) {
        document.getElementById('details-content').innerHTML = '<p>No game details found.</p>';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${gameId}?key=${API_KEY}`);
        const game = await response.json();

        // Extract PC-specific system requirements
        const pcRequirements = game.platforms
            .find(platform => platform.platform.name.toLowerCase() === 'pc')
            ?.requirements;

        // Parse minimum and recommended strings into objects
        const minRequirements = pcRequirements?.minimum
            ? parseRequirementsString(pcRequirements.minimum)
            : null;
        const recRequirements = pcRequirements?.recommended
            ? parseRequirementsString(pcRequirements.recommended)
            : null;

        document.getElementById('details-content').innerHTML = `
            <h2>${game.name}</h2>
            <img src="${game.background_image}" alt="${game.name}" />
            <p><strong>Description:</strong> ${game.description_raw}</p>
            <p><strong>Released:</strong> ${game.released}</p>
            <p><strong>Rating:</strong> ${game.rating} (${game.ratings_count} ratings)</p>
            <p><strong>Genres:</strong> ${game.genres.map(genre => genre.name).join(', ')}</p>

            <h3>System Requirements (PC)</h3>
            <div class="requirements">
                ${minRequirements ? createTable('Minimum', minRequirements) : '<p>No minimum requirements available.</p>'}
                ${recRequirements ? createTable('Recommended', recRequirements) : '<p>No recommended requirements available.</p>'}
            </div>
        `;
    } catch (error) {
        console.error(error);
        document.getElementById('details-content').innerHTML = '<p>Failed to fetch game details. Please try again later.</p>';
    }
})();

/**
 * Parse a requirements string into an object.
 */
function parseRequirementsString(requirements) {
    const lines = requirements.split(/(?=OS:|Processor:|Memory:|Graphics:|Storage:|Sound Card:)/g);
    const requirementsObj = {};

    lines.forEach(line => {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();
        if (key && value) {
            requirementsObj[key.trim()] = value;
        }
    });

    return requirementsObj;
}

/**
 * Create a table for requirements.
 */
function createTable(title, data) {
    const rows = Object.entries(data)
        .map(([key, value]) => `<tr><td>${key}</td><td>${value}</td></tr>`)
        .join('');

    return `
        <h4>${title}</h4>
        <table class="requirements-table">
            <thead>
                <tr>
                    <th>Specification</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;
}
