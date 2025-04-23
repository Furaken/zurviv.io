// ==UserScript==
// @name         survev.io | Killfeed logger & Stats retriever
// @namespace    Furaken
// @version      1.0.0
// @description  Hm
// @author       sk
// @match        https://zurviv.io/*
// @grant        unsafeWindow
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

let url,
    killFeed = [],
    gasTimer = [0, 0, 0],
    isNotInGame = true,
    outputObj = {}

const nativeWebSocket = unsafeWindow.WebSocket
unsafeWindow.WebSocket = function(...args) {
    const socket = new nativeWebSocket(...args)
    gasTimer = [0, 0, 0]
    url = socket.url
    return socket
}

let urlArray = []
setInterval(() => {
    urlArray.push(url.match(/play\?gameId=([0-9a-z]+)/)[1])
    if (urlArray.length > 2) urlArray.shift()
    if (urlArray[0] != urlArray[urlArray.length - 1]) {
        killFeed = []
        //console.log(`\n%c${urlArray[urlArray.length - 1]}`, "font-size: 24px;")
    }

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

            outputObj.kill = {}
            outputObj.damageDealt = {}
            outputObj.killfeed = killFeed
            outputObj.stats = obj

            obj.forEach((x, xi) => {
                if (xi == 0) return
                let i = 1
                let player = x[1],
                    p = player
                while (Object.keys(outputObj.damageDealt).includes(player)) {
                    player = `${p} (clone${i})`
                    i++
                }
                outputObj.kill[player] = x[2]
                outputObj.damageDealt[player] = x[3]
            })

            downloadString(JSON.stringify(outputObj, null, 4), "data:text/json;charset=utf-8,", `${urlArray[urlArray.length - 1]}.json`)
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
    /*killFeed.filter(x => !temp.includes(x)).forEach(x => {
        console.log(x)
    })*/
}, 1000)
