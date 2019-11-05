

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
}