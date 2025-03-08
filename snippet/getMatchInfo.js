// Snippet of how lobby scouter works

let x = {
    "version": 78,
    "region": "as",
    "zones": [
        "as"
    ],
    "playerCount": 1,
    "autoFill": true,
    "gameModeIdx": 0,
}

let xhr = new XMLHttpRequest();
xhr.open('POST', 'https://zurviv.io/api/find_game');
xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
xhr.onload = function() {
    console.log(xhr.responseText);
};
xhr.send(JSON.stringify(x));
