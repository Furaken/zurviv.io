let stats = {}
let matches = Array.from(document.querySelectorAll(".match-link")).map(x => x.getAttribute("data-game-id"))
let requestDone = 0
console.log(matches)

matches.forEach((gameId, i) => {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://zurviv.io/api/match_data')
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
    xhr.onload = function() {
        matchData = JSON.parse(xhr.responseText)

        matchData.forEach(player => {
            if (!stats[player.slug]) {
                stats[player.slug] = {
                    username: player.username,
                    kills: 0,
                    damageDealt: 0,
                    damageTaken: 0,
                    deaths: 0,
                    games: 0
                }
            }

            stats[player.slug].kills += player.kills
            stats[player.slug].damageDealt += player.damage_dealt
            stats[player.slug].damageTaken += player.damage_taken
            stats[player.slug].deaths += player.died ? 1 : 0
            stats[player.slug].games += 1
        })

        requestDone++
        if (matches.length == requestDone) {
            console.log(stats)
            console.table(stats)
        }
    }
    xhr.send(JSON.stringify({ "gameId": gameId }))
})