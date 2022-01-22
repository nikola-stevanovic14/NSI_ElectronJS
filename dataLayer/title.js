exports.provideTitleModel = (data) => {
    const model = {
        id: data.Id,
        title: data.Title,
        fullName: data.FullName,
        fide: data.FIDE,
        prestige: data.Prestinge
    }
    return model
}

exports.provideTitleModels = (data) => {
    const models = []
    data.forEach(element => {
        models.push(this.provideTitleModel(element))
    });
    return models
}