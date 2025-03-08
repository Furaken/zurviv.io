let result = [],
    registered = []

let rankPoints = {
    "#1": 100,
    "#2": 75,
    "#3": 50,
    "#4": 25
}

let data = {}

function scoring(rp, k, dmg) {
    return rp + (10 * k + dmg / 20) / 2
}

result.forEach(match => {
    match.forEach(player => {
        if (player[1] == "PLAYER" || !registered.includes(player[1])) return
        let thisRp = rankPoints[player[0]]
        let thisScore = scoring(thisRp == true ? thisRp : 0, player[2], player[3])
        if (!data[player[1]]) data[player[1]] = thisScore
        else data[player[1]] += thisScore
    })
})

function generateLeaderboard(data) {
    let sortedData = Object.entries(data).sort((a, b) => b[1] - a[1])
    let table = document.createElement("table")
    table.style.borderCollapse = "collapse"
    table.style.width = "50%"
    table.style.margin = "20px auto"
    table.style.fontFamily = "Arial, sans-serif"
    table.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)"

    let thead = document.createElement("thead");
    thead.innerHTML = `
        <tr style="background: #4CAF50; color: white;">
            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Rank</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Player Name</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Score</th>
        </tr>
    `

    table.appendChild(thead);

    const tbody = document.createElement("tbody")
    let rank = 1

    sortedData.forEach(([player, score]) => {
        const row = document.createElement("tr");
        row.style.background = rank % 2 === 0 ? "#f2f2f2" : "#fff"
        row.style.border = "1px solid #ddd"

        row.innerHTML = `
            <td style="padding: 10px; text-align: center; border: 1px solid #ddd; font-weight: bold;">${rank}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${player}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${score.toFixed(2)}</td>
        `

        tbody.appendChild(row)
        rank++
    })

    table.appendChild(tbody)
    console.log(table)
}

generateLeaderboard(data)
