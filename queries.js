const query = {
    "cover": `image_id,url;`,
    "company": `name,logo,description,published,websites,updated_at;`,
    "game": `
        id,
        name,
        platforms,
        screenshots.*,
        franchise.games,
        game_modes.name,
        genres.name,
        cover,
        ports,
        remakes,
        remasters,
        similar_games,
        status,
        rating,
        rating_count,
        release_dates,
        summary,
        videos;`
}

const igdbUris = {
    "cover": "v4/covers",
    "company": "v4/company",
    "game": "v4/games",
}

const youtubeDomain = {
    search: "https://youtube.googleapis.com/youtube/v3/search",
    video: "https://youtube.googleapis.com/youtube/v3/videos"
}

const searchGames = (gameName) => {
    let search = "search " + `"${gameName}"` + "; " + "fields " + query.game + " limit 20;";
    return search;
}

const searchByGameId = (gameId) => {
    let id = `where id = (${gameId}); fields ${query.game};`;
    return id;
}
const getCoverQuery = (gameId) => {
    let coverQuery;
    if (gameId != undefined) {
        coverQuery = `fields ${query.cover} where id=${gameId};` + " limit 20;";
    } else {
        coverQuery = [{image_id: gameId}]
        return coverQuery
    }
    return coverQuery;
}

exports.getUris = igdbUris;
exports.getTrailers = youtubeDomain;
exports.createQuery = searchGames;
exports.searchOneById = searchByGameId;
exports.getCoverByGameId = getCoverQuery;
