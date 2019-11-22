const {filterData} = require('../utils')

module.exports.search = async (req, res, next) => {
    const {Event, TradingEquipment, Article, User} = req.models
    
    const terms = req.query.q.split(' ')

    let usersData = User.find().select('name surname location').lean()
    let eventsData = Event.find().select('Country CalendarId Date Catogory').lean()
    let tradingEqData = TradingEquipment.find().select('code name').lean()
    let articlesData = Article.find().select('text title').lean()


    usersData = await usersData
    eventsData = await eventsData
    tradingEqData = await tradingEqData
    articlesData = await articlesData

    const users = terms.flatMap(term => filterData(usersData, ['name', 'surname', 'location'], term))
    const events = terms.flatMap(term => filterData(eventsData, ['Country', 'Catogory'], term))
    const tradingEq = terms.flatMap(term => filterData(tradingEqData, ['code', 'name'], term))
    const articles = terms.flatMap(term => filterData(articlesData, ['text', 'title'], term))

    return res.json({
        users,
        events,
        'trading-equipments': tradingEq,
        articles,
    })
}