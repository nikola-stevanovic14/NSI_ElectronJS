const {getPlayerById} = require('../dbService')

exports.provideRankingModel = (data) => {
    const model = {
        id: data.Id,
        tournamentId: data.TournamentId,
        playerId: data.PlayerId,
        startingPosition:data.StartingPosition,
        startingElo: data.StartingElo,
        startingTitle: data.StartingTitle,
        points: data.Points,
        medianBucholz: data.MedianBucholz,
        bucholz: data.Bucholz,
        wins: data.Wins,
        blackWins: data.BlackWins,
        sonnebornBerger: data.SonnebornBerger,
        eloPerformance: data.EloPerformance,
        luck: data.Luck,
    }
    getPlayerById(model.playerId)
    .then((player) => {
        model.player = player.firstName + ' ' + player.lastName
        return model
    })
    .catch((err) => {
        console.error(err);
    })
}

exports.provideRankingModels = (data) => {
    const models = []
    data.forEach(element => {
        models.push(this.provideRankingModel(element))
    });
    return models
}