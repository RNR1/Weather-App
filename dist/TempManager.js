class TempManager {
	constructor() {
		this.cityData = []
	}

	async getDataFromDB() {
		const data = await $.get('/cities')
		this.cityData = data
	}

	async getCityData(cityName) {
		const data = await $.get(`/city/${cityName}`)
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
			type: 'json',
			success: () => console.log(`${cityName} removed from DB`),
			error: () => console.log(`${cityName} does not exist in database`)
		})
	}
}
