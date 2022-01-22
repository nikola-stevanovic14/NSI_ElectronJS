exports.provideTournamentModel = (data) => {
    const model = {
        name: data.Name,
        pairingSystem: data.PairingSystem,
        startDate: data.StartDate.toLocaleDateString("en-US"),
        endDate: new Date(data.EndDate).toLocaleDateString("en-US"),
        roundsNum: data.NumberOfRounds,
        status: data.Open ? 'Open' : data.Closed? 'Closed' : 'Finished'
    }
    return model
}

exports.provideTournamentModels = (data) => {
    const models = []
    data.forEach(element => {
        models.push(this.provideTournamentModel(element))
    });
    return models
}