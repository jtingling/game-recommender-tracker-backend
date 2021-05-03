const getGameNames = (json) => {
    return (
        json.map((game) => {
            return game.name
        })
    )
}
const getPlatform = (json) => {
    return (
        json.map((game) => {
            return game.platform
        })
    )
}
const getSummary = (json) => {
    return (
        json.map((game) => {
            return game.summary
        })
    )
}
const getCategory = (json) => {
    return (
        json.map((game) => {
            return game.category
        })
    )
}

const getGameData = (json) => {
    getGameNames(json)
}

exports.getGameNames = getGameNames;