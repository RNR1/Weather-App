const tempManager = new TempManager()
const renderer = new Renderer()
const input = $('#city-input')
HandlebarsIntl.registerWith(Handlebars)

Handlebars.registerHelper('capitalizeFirst', (str) => {
    return str[0].toUpperCase() + str.substring(1).toLowerCase()
})

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
		$('#form').hide()
	}
	renderer.renderData(tempManager.cityData)
	renderer.renderBackgroundPhoto()
}

const handleSearch = async () => {
	let cityName = input.val()
	input.val('')
	try {
    if (cityName === '' || !cityName) { throw new Error("name is not valid") }
	cityName = tempManager.capitalizeCity(cityName)
		await tempManager.getCityData(cityName)
	} catch (err) {
		return
	}
	renderer.renderData(tempManager.cityData)
	renderer.renderBackgroundPhoto()
}

const save = cityName => {
	tempManager.saveCity(cityName)
}

const remove = cityName => {
	tempManager.removeCity(cityName)
	renderer.renderData(tempManager.cityData)
	renderer.renderBackgroundPhoto()
}

const update = cityName => {
	tempManager.updateCity(cityName)
	renderer.renderData(tempManager.cityData)
	renderer.renderBackgroundPhoto()
}

const toggleSearch = () => {
    $('#form').slideToggle()
    input.focus()
}

$(document).keypress(function(e) {
	if (e.which == 13) {
		handleSearch()
	}
})

loadPage()
