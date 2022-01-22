const {getTitleById} = require('../dbService')

exports.providePlayerModel = (data) => {
    const model = {
        id: data.Id,
        firstName: data.FirstName,
        lastName: data.LirstName,
        fideId: data.Fide_Id,
        eloRating: data.EloRating,
        coefficient: data.Coefficient,
        titleId: data.Title,
        country: data.Country,
        sex: data.Sex,
        birth: data.Birth,
    }

    getTitleById(title)
    .then((title) => {
        model.title = title.Title
        return model
    })
    .catch((err) => {
        console.error(err);
    })
}

exports.providePlayerModels = (data) => {
    const models = []
    data.forEach(element => {
        models.push(this.providePlayerModel(element))
    });
    return models
}