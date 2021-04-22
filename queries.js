const query = {
    "cover": `game,height,width,image_id,url;`,
    "company": `name,logo,description,published,websites,updated_at;`,
    "game": `name,platforms,category,cover,rating,rating_count,release_dates,summary,screenshots.url,videos;`
}

const uris = {
    "cover": "v4/cover",
    "company": "v4/company",
    "game": "v4/games"
}

const searchGames = (gameName) => {
    let search = "search " + `"${gameName}"` + "; " + "fields " + query.game;
    
    return search;
}
exports.getUris = uris;
exports.createQuery = searchGames;