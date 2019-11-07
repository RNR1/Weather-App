const tempManager = new TempManager()
const renderer = new Renderer()
const input = $('#city-input')
HandlebarsIntl.registerWith(Handlebars);

const loadPage = async () => {
    const now = new Date().getHours()
    await tempManager.getDataFromDB()
    tempManager.cityData.forEach(c => { 
        let lastUpdate = new Date(c.updatedAt).getHours()
        if (now - lastUpdate >= 3) {
            tempManager.updateCity(c.name)
        }
    })
    if (tempManager.cityData.length > 0) {
        $("#form").hide()
    }
    renderer.renderData(tempManager.cityData)
    renderer.renderBackgroundPhoto()
}

const handleSearch = async () => {
    
    let cityName = input.val()
    input.val("")
    cityName = tempManager.capitalizeCity(cityName)
    if (cityName === "") { return }
    try { await tempManager.getCityData(cityName) }
    catch(err) { return }
    renderer.renderData(tempManager.cityData)
    renderer.renderBackgroundPhoto()
}

const save = (cityName) => {
    tempManager.saveCity(cityName)
}

const remove = (cityName) => {
    tempManager.removeCity(cityName)
    renderer.renderData(tempManager.cityData)
    renderer.renderBackgroundPhoto()
}

const update = (cityName) => {
    tempManager.updateCity(cityName)
    renderer.renderData(tempManager.cityData)
    renderer.renderBackgroundPhoto()
}

const toggleSearch = () => {
    $('#form').slideToggle()
}

loadPage()