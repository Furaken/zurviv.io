// ==UserScript==
// @name         zurviv.io | Retrieve Player's stats
// @namespace    Furaken
// @version      1.2
// @description  Get player's stats
// @author       sk
// @match        https://zurviv.io/stats/*
// @grant        none
// @require      https://unpkg.com/write-excel-file@1.x/bundle/write-excel-file.min.js
// ==/UserScript==

class ElementCreate {
    constructor(tag) { this.element = document.createElement(tag) }
    attr(attributes) {
        for (const [key, value] of Object.entries(attributes)) this.element.setAttribute(key, value)
        return this
    }
    style(styles) {
        for (const [property, value] of Object.entries(styles)) this.element.style[property] = value
        return this
    }
    content(content) {
        if (typeof content == "string") this.element.innerHTML = content
        else if (content instanceof HTMLElement) this.element.appendChild(content)
        return this
    }
    append(parent) {
        try {
            const parentElement = typeof parent == "string" ? document.querySelector(parent) : parent
            if (!parentElement) throw "Cannot append to null element."
            parentElement.appendChild(this.element)
            return this
        } catch (e) {
            console.error(e)
        }
    }
    get() { return this.element }
}

function getData(matches) {
    let stats = {}
    let requestDone = 0
    let teams = {}

    matches.forEach((gameId, i) => {
        let xhr = new XMLHttpRequest()
        xhr.open('POST', 'https://zurviv.io/api/match_data')
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
        xhr.onload = function () {
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
                console.table(stats)

                const header = ["SLUG", "USERNAME", "NAME", "KNOCKS", "KILLS", "DMG DEALT", "DMG TAKEN", "TIMES KNOCKED", "DEATHS", "GAMES"].map(x => (
                    {
                        value: x,
                        fontWeight: "bold",
                        align: "center",
                        alignVertical: "center",
                        backgroundColor: "#333333",
                        color: "#ffffff",
                        borderColor: "#ffffff"
                    }))

                const data = Object.entries(stats).map(([slug, obj]) => [slug, obj.username, "", "", obj.kills, obj.damageDealt, obj.damageTaken, "", obj.deaths, obj.games].map(x => (
                    {
                        value: x,
                        align: "center",
                        alignVertical: "center",
                        backgroundColor: "#444444",
                        color: "#ffffff",
                        borderColor: "#ffffff"
                    })))

                const columns = [20, 20, 30, 10, 10, 15, 15, 15, 10, 10].map(x => ({ width: x }))

                writeXlsxFile([header, ...data], {
                    columns,
                    fileName: `${document.URL.match(/https:\/\/zurviv.io\/stats\/\?slug=(.+)/)[1]}-${Math.floor(Date.now() / 1000)}.xlsx`,
                    showGridLines: false,
                    stickyRowsCount: 1
                })
            }
        }
        xhr.send(JSON.stringify({ "gameId": gameId }))
    })
}

const queue = []

function updateContent() {
    if (document.querySelector("#matchQueue")) document.querySelector("#matchQueue").innerHTML = `
        <span style="font-size: 20px; font-weight: bold;">${queue.length} matches</span>
        ${queue.map((x, i) => `
            <div style="display: flex; margin-block: 5px">
                <div style="flex-basis: 20%">${i + 1}</div>
                <div>${x}</div>
            </div>
        `).join("")}
        `
    document.querySelectorAll(".add-to-queue").forEach(btn => {
        const gameId = btn.parentNode.parentNode.getAttribute("data-game-id")
        const idx = queue.indexOf(gameId)
        btn.innerHTML = idx !== -1 ? (idx + 1) : ""
    })
}

const buttonState = {
    add: {
        backgroundColor: "#00000080",
        backgroundImage: "url(https://zurviv.io/img/gui/loadout-heal.svg)"
    },
    remove: {
        backgroundColor: "#ED1C2480",
        backgroundImage: "none"
    }
}

function execute() {
    document.querySelectorAll(".match-link-expand").forEach(x => {
        if (!x.nextElementSibling?.classList.contains("add-to-queue")) {
            document.querySelectorAll(".offset-0.col-1.pl-0.pr-0").forEach(el => { el.style.display = "flex" })
            const el = new ElementCreate("div")
                .attr({ class: "add-to-queue" })
                .style(
                    queue.includes(x.parentNode.parentNode.getAttribute("data-game-id")) ? buttonState.remove : buttonState.add
                )
                .style({
                    display: "grid",
                    placeItems: "center",
                    backgroundSize: "60%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    borderRadius: "2px",
                    marginLeft: "1px",
                    width: "50%",
                    height: "100%",
                    fontSize: "20px",
                    fontWeight: "bold"
                })
                .get()

            el.onclick = function (event) {
                event.stopPropagation()
                const gameId = this.parentNode.parentNode.getAttribute("data-game-id")
                if (!queue.includes(gameId)) {
                    Object.assign(this.style, buttonState.remove)
                    queue.push(gameId)
                } else {
                    Object.assign(this.style, buttonState.add)
                    const idx = queue.indexOf(gameId)
                    if (idx != -1) queue.splice(idx, 1)
                }
                updateContent()
            }
            x.parentNode.insertBefore(el, x.nextSibling)
        } else {

        }
    })

    if (!document.querySelector("#selector-extra-matches")?.nextElementSibling) {
        new ElementCreate("div")
            .attr({ id: "matchQueue" })
            .style({
                backgroundColor: "#0006",
                fontSize: "12px",
                color: "#fff",
                padding: "10px"
            })
            .append(document.querySelector("#selector-extra-matches")?.parentNode)
        updateContent()

        const getDataBtn = new ElementCreate("div")
            .attr({ id: "getData", class: "darken" })
            .style({
                backgroundColor: "#fff",
                fontSize: "16px",
                color: "black",
                padding: "3px 10px",
                textAlign: "center",
                fontWeight: "bold",
                borderRadius: "5px",
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
                marginBlock: "20px 10px",
                cursor: "pointer"
            })
            .content("Download Stats")
            .get()

        document.querySelector("#selector-extra-matches")?.parentNode.insertBefore(getDataBtn, document.getElementById("matchQueue"))
        getDataBtn.onclick = () => getData(queue)
    }
}

execute()

const observer = new MutationObserver(execute)
observer.observe(document.body, { childList: true, subtree: true })

new ElementCreate("style")
    .content(`
        .darken {
            transition: all 0.15s
        }
        .darken:hover {
            filter: brightness(0.8)
        }
    `)
    .append(document.head)