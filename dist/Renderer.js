class Renderer {
    constructor() {
        this.template = $('#cities-template').html()
        this.container = $('#cities')
    }
    
    renderData(allCityData) {
        const source = this.template
        const template = Handlebars.compile(source)
        
        const html = template({allCityData})
        this.container.html(html)
    }

    renderBackgroundPhoto() {
        $('.city').each(function() {
            let temp = parseInt($(this).find('.temp').text())
            if (temp > 20) {
                $(this).css('background-image', `url("good-weather.jpg")`)
            } else {
                $(this).css('background-image', `url("bad-weather.jpg")`)
            }
        })
    }
}