const generateRounds = function (players, tournamentId) {
    let matches = [];
  
    indices = Array.apply(null, Array(players.length)).map(function (x, i) { return i; })
    let fixedPlayer = indices[0];
    let otherPlayers = indices.slice(1, players.length - 1);
    if ((otherPlayers.length % 2) === 0){
        otherPlayers.push({Id: 'bye'});
    }

    let firstWhite = true;
    for (let i = 0; i < players.length - 1; i++) {
        // generate round matches
        for (let k = 0; k < players.length / 2; k++) {
            let l = (players.length - 1) - k; // oponent index
            let match = {};
            let white, black;
            if (k === 0){
                
                white = firstWhite ? players[fixedPlayer] : players[otherPlayers[l]];
                black = firstWhite ? players[otherPlayers[l]] : players[fixedPlayer];

                match.RoundNumber = i + 1;
                match.whiteId = white.Id;
                match.blackId = black.Id;
                match.whiteTitle = white.Title;
                match.blackTitle = black.Title;
            }
            else{
                white = firstWhite ? players[otherPlayers[k]] : players[otherPlayers[l]];
                black = firstWhite ? players[otherPlayers[l]] : players[otherPlayers[k]];

                match.RoundNumber = i + 1;
                match.whiteId = white.Id;
                match.blackId = black.Id;
                match.whiteTitle = white.Title;
                match.blackTitle = black.Title;
            }

            if (!(white.Id === 'bye' || black.Id === 'bye')){
                matches.push(match);
            }
        }
    }
}