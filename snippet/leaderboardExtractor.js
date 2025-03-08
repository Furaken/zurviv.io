// The API match_data doesn't exist before Kong's ownership, so this is an alternative way to extract leaderboard from HTML elements

let obj = []

document.querySelectorAll(".ui-stats-row").forEach((x, xi) => {
    if (xi == 0) obj.push(["RANK"].concat(Array.from(x.children).map(x => x.innerHTML)))
    else obj.push(Array.from(x.children).map(x => isNaN(x.innerHTML) == true ? x.innerHTML : Number(x.innerHTML)))
})

console.log(obj)
console.table(obj)
