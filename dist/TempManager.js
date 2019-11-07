class TempManager {
	constructor() {
		this.cityData = []
	}

	async getDataFromDB() {
		const data = await $.get('/cities')
		if(!data) {
			console.error(data)
			return
		}
		this.cityData = data
	}

	async getCityData(cityName) {
		let data
		let alreadyExists = this.cityData.find(c => c.name === cityName)
		if (alreadyExists) { return }
		try { 
			data = await $.get(`/city/${cityName}`)
			if (data.error) {
				throw new Error("city not found")
			}
		}
		catch(err) { return }
		this.cityData.push({...data})
	}

	async updateCity(cityName) {
		const updatedData = await $.ajax({
			method: 'PUT',
            url: `/city/${cityName}`,
			type: 'json'
        })
        let cityIndex = this.cityData.findIndex(c => c.name === cityName)
        this.cityData[cityIndex] = { ...updatedData }
	}

	saveCity(cityName) {
		const city = this.cityData.find(c => c.name === cityName)
		$.post(`/city/`, city)
	}

	removeCity(cityName) {
		let cityIndex = this.cityData.findIndex(c => c.name === cityName)
		this.cityData.splice(cityIndex, 1)
		$.ajax({
			method: 'DELETE',
			url: `/city/${cityName}`,
			type: 'json'
		})
	}

	capitalizeCity(cityName) {
		return cityName
		.split(" ")
		.map(w => w = w[0].toUpperCase() + w.substring(1).toLowerCase())
		.join(" ")
	}
}
