// ==UserScript==
// @name         survev.io | Killfeed logger & Stats retriever
// @namespace    Furaken
// @version      1.1
// @description  Hm
// @author       sk
// @match        https://zurviv.io/*
// ==/UserScript==

function merge(a, b) {
    const m = Math.min(a.length, b.length)
    for (let i = m; i > 0; i--) {
        if (a.slice(-i).toString() === b.slice(0, i).toString()) return a.concat(b.slice(i))
    }
    return a.concat(b)
}

function downloadString(text, fileType, fileName) {
    var blob = new Blob([text], { type: fileType })
    var a = document.createElement('a')
    a.download = fileName
    a.href = URL.createObjectURL(blob)
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':')
    a.style.display = "none"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(function() { URL.revokeObjectURL(a.href) }, 1500)
}

let killFeed = [],
    gasTimer = [0, 0, 0],
    isNotInGame = true,
    outputObj = {},
    startTime = Date.now()

document.getElementById('play-button-menu').onclick = function() {killFeed = []; startTime = Date.now()}
document.getElementById('btn-start-team').onclick = function() {killFeed = []; startTime = Date.now()}

setInterval(() => {
    if (document.getElementById("ui-gas-timer").innerHTML != "0:00") gasTimer.push(document.getElementById("ui-gas-timer").innerHTML)
    if (gasTimer.length > 3) gasTimer.shift()
    if (gasTimer[0] == gasTimer[2]) {
        if (!isNotInGame) {
            let obj = []
            document.querySelectorAll(".ui-stats-row").forEach((x, xi) => {
                if (xi == 0) obj.push(["RANK"].concat(Array.from(x.children).map(x => x.innerHTML)))
                else obj.push(Array.from(x.children).map(x => isNaN(x.innerHTML) == true ? x.innerHTML : Number(x.innerHTML)))
            })
            console.log(obj)
            console.table(obj)

            outputObj.player = {}
            outputObj.killfeed = killFeed
            outputObj.stats = obj

            obj.forEach((x, xi) => {
                if (xi == 0) return
                /*let i = 1
                let player = x[1],
                    p = player
                /*while (Object.keys(outputObj.damageDealt).includes(player)) {
                    player = `${p} (clone${i})`
                    i++
                }*/

                let player = x[1]
                let regex = /^(?<p1>.+?) (?<action>killed|finally killed|crushed|knocked out) (?<p2>.+?)(?<weapon> with .+)?$/
                let thisPlayerMatch = outputObj.killfeed.filter(j => regex.test(j)).map(j => j.match(regex).groups)
                outputObj.player[player] = {
                    "Damage Dealt": x[3],
                    "Opponents Knocked": thisPlayerMatch.filter(j => j.p1 == player && j.p1 != j.p2 && ["knocked out"].includes(j.action)).length,
                    "Opponents Killed": x[2],
                    "Damage Taken": x[4],
                    "Times Knocked": thisPlayerMatch.filter(j => j.p2 == player && ["knocked out"].includes(j.action)).length,
                    "Times Killed" : thisPlayerMatch.filter(j => j.p2 == player && ["killed", "finally killed", "crushed"].includes(j.action)).length
                }
            })



            downloadString(JSON.stringify(outputObj, null, 4), "data:text/json;charset=utf-8,", `${startTime}.json`)
        }
        isNotInGame = true
    }
    else isNotInGame = false

    if (isNotInGame) return
    let temp = []
    document.querySelectorAll(".killfeed-text").forEach((x, xi) => {
        if (x.innerHTML != "") temp.unshift(x.innerHTML)
    })
    killFeed = merge(killFeed, temp)
}, 1000)
