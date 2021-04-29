import nengi from 'nengi'
import CollisionSystem from '../CollisionSystem.js'
import p2 from 'p2'

class Box {
    constructor(state) {
        this.nid = state.nid
        this.x = state.x
        this.y = state.y
        this.width = state.width
        this.height = state.height
        this.rotation = state.rotation
        this.color = state.color
        this.mass = state.mass
        this.spin = state.spin
        this.material = state.material
        
        this.boxShape = new p2.Box({
            width: state.width, 
            height: state.height
        });
        this.boxShape.material = state.material;
        this.body = new p2.Body({
            mass: state.mass,
            position: [state.x, state.y],
            angularVelocity: state.spin
        });
        this.body.addShape(this.boxShape)

        this.collider = CollisionSystem.createRectangleCollider((state.x - state.width/2), (state.y - state.height/2) , state.width, state.height)    
    }
}

Box.protocol = {
    x: { type: nengi.Number, interp: true },
    y: { type: nengi.Number, interp: true },
    rotation: { type: nengi.RotationFloat32, interp: true },
    mass: { type: nengi.Number, interp: true },
    width: nengi.UInt16,
    height: nengi.UInt16,
}

export default Box
