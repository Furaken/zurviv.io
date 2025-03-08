let lastHP = 0,
    health = document.createElement("span")

health.style = "display:block;position:fixed;z-index: 2;margin:6px 0 0 0;right: 15px;mix-blend-mode: difference;font-weight: bold;font-size:large;"
document.querySelector("#ui-health-container").appendChild(health)

var adr = document.createElement("span")
adr.style = "display:block;position:fixed;z-index: 2;margin:6px 0 0 0;left: 15px;mix-blend-mode: difference;font-weight: bold;font-size:large;"
document.querySelector("#ui-health-container").appendChild(adr)

setInterval(() => {
    let hp = document.getElementById("ui-health-actual").style.width.slice(0,-1)
    if (lastHP !== hp) {
        lastHP = hp
        health.innerHTML = Math.round(hp)
    }

    let boost0 = document.getElementById("ui-boost-counter-0").querySelector(".ui-bar-inner").style.width.slice(0,-1),
        boost1 = document.getElementById("ui-boost-counter-1").querySelector(".ui-bar-inner").style.width.slice(0,-1),
        boost2 = document.getElementById("ui-boost-counter-2").querySelector(".ui-bar-inner").style.width.slice(0,-1),
        boost3 = document.getElementById("ui-boost-counter-3").querySelector(".ui-bar-inner").style.width.slice(0,-1),
        adr0 = boost0 * 0.25 + boost1 * 0.25 + boost2 * 0.375 + boost3 * 0.125

    adr.innerHTML = Math.round(adr0)
})
