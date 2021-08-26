import * as PIXI from 'pixi.js'

class BoxGraphics extends PIXI.Container {
    constructor(state) {
        super()
        this.nid = state.nid
        this.x = state.x
        this.y = state.y
        this.width = state.width
        this.height = state.height
        this.color = state.color    
        this.radius = state.radius

        this.color = PIXI.utils.string2hex(this.color);
        
        this.body = new PIXI.Graphics()
        this.body.beginFill(this.color)
        this.body.drawRect(-state.width/2, -state.height/2, state.width, state.height)
        this.body.endFill()
        
        this.addChild(this.body)
        
    }

    updateColor(color) {
        console.log(color)
        if(typeof color == "undefined" ) {
            let updateColor = PIXI.utils.string2hex("#FFFFFF");
            this.body.beginFill(updateColor)
            this.body.drawRect(-this.width/2, -this.height/2, this.width, this.height)
            this.body.endFill()
        } else {
            let updateColor = PIXI.utils.string2hex(color);
            this.body.beginFill(updateColor)
            this.body.drawRect(-this.width/2, -this.height/2, this.width, this.height)
            this.body.endFill()
        }
    }

    update(delta) {

    }
}

export default BoxGraphics