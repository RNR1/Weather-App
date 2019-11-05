const express = require('express')
const router = express.Router()
const requestPromise = require('request-promise')
const parseString = require('xml2js').parseString
const moment = require('moment')
const async = require('async')
const City = require('../models/City')
const apiKey = API_KEY || 'e96383a889984517f335db9fb46f0361'

router.get('/city/:cityName', async (req, res) => {
	const cityName = req.params.cityName
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&mode=xml&appid=${apiKey}`
	let cityData = await requestPromise(url)
    parseString(cityData, (err, result) => {
		data = result.current
		cityData = {
			name: data.city[0].$.name,
			temperature: parseInt(data.temperature[0].$.value),
			condition: data.weather[0].$.value,
			conditionPic: data.weather[0].$.icon,
			updatedAt: moment(data.lastupdate[0].$.value).format('LLLL')
		}
		res.send(cityData)
	})
})

router.get('/cities', async (req, res) => {
	let cities = await City.find({}, { __v: 0 })
	const citiesData = []
	async.forEach(cities, (c, err) => {
		citiesData.push({
			name: c.name,
			temperature: parseInt(c.temperature),
			condition: c.condition,
			conditionPic: c.conditionPic,
			updatedAt: moment(c.updatedAt).format('LLLL')
		})
	})
	res.send(citiesData)
})

router.post('/city', async (req, res) => {
    let city = req.body
	City.find({ name: city.name }, async (err, inDb) => {
        if (inDb.length === 0) {
            city = new City({ ...city })
			city = await city.save()
            res.send('OK')
		} else {
            res.end()
		}
	})
})

router.put('/city/:cityName', async (req, res) => {
	let cityName = req.params.cityName
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&mode=xml&appid=${apiKey}`
	let cityData = await requestPromise(url)
	let inDb = await City.find({ name: cityName })
	parseString(cityData, async (err, result) => {
		data = result.current
		cityData = {
			name: data.city[0].$.name,
			temperature: parseInt(data.temperature[0].$.value),
			condition: data.weather[0].$.value,
			conditionPic: data.weather[0].$.icon,
			updatedAt: moment(data.lastupdate[0].$.value).format('LLLL')
        }
        if (inDb) {
            await City.findOneAndUpdate(
                { name: cityName },
                { $set: { ...cityData } },
                { new: true }
            )
        }
        res.send(cityData)
    })
    
})

router.delete('/city/:cityName', async (req, res) => {
	let cityName = req.params.cityName
	await City.findOneAndRemove({ name: cityName }, { __v: 0 })
	res.send('OK')
})

module.exports = router
