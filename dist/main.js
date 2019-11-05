const tempManager = new TempManager()
const renderer = new Renderer()
const input = $('#city-input')
HandlebarsIntl.registerWith(Handlebars);

getBackgroundPhoto = () => {
    $('.city').each(function() {
        let temp = parseInt($(this).find('.temp').text())
        if (temp > 20) {
            $(this).css('background-image', `url("good-weather.jpg")`)
        } else {
            $(this).css('background-image', `url("bad-weather.jpg")`)
        }
    })
}

const loadPage = async () => {
    const now = new Date().getHours()
    await tempManager.getDataFromDB()
    tempManager.cityData.forEach(c => { 
        let lastUpdate = new Date(c.updatedAt).getHours()
        if (now - lastUpdate >= 3) {
            tempManager.updateCity(c.name)
        }
    })
    renderer.renderData(tempManager.cityData)
    getBackgroundPhoto()
}

const handleSearch = async () => {
    
    let cityName = input.val()
    input.val("")
    let inDoc = tempManager.cityData.find(c => c.name === cityName)
    if (inDoc || cityName === "") { return }
    await tempManager.getCityData(cityName)
    renderer.renderData(tempManager.cityData)
    getBackgroundPhoto()
}

const save = (cityName) => {
    tempManager.saveCity(cityName)
}

const remove = (cityName) => {
    tempManager.removeCity(cityName)
    renderer.renderData(tempManager.cityData)
    getBackgroundPhoto()
}

const update = (cityName) => {
    tempManager.updateCity(cityName)
    renderer.renderData(tempManager.cityData)
    getBackgroundPhoto()
}

const toggleSearch = () => {
    $('#form').slideToggle()
}

loadPage()