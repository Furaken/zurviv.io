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
    const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1])

    let tableHTML = `
        <table style="border-collapse: collapse; width: 60%; margin: 20px auto; font-family: Arial, sans-serif; 
                      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); background: white; border-radius: 10px; 
                      overflow: hidden;">
            <thead>
                <tr style="background: #4CAF50; color: white;">
                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Rank</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Player Name</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Score</th>
                </tr>
            </thead>
            <tbody>`;

    let rank = 1
    sortedData.forEach(([player, score]) => {
        const rowColor = rank % 2 === 0 ? "#f2f2f2" : "#ffffff"
        tableHTML += `
            <tr style="background: ${rowColor}; border: 1px solid #ddd;">
                <td style="padding: 12px; text-align: center; border: 1px solid #ddd; font-weight: bold;">${rank}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${player}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${score.toFixed(2)}</td>
            </tr>`
        rank++
    });

    tableHTML += `</tbody></table>`

    console.log(tableHTML)
}

generateLeaderboard(data)
