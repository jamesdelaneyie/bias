import nengi from 'nengi'
import CollisionSystem from '../CollisionSystem.js'
import p2 from 'p2'

class PlayerCharacter {
    constructor() {
        // x & y are getters
        //this.x = 0
        //this.y = 0
        this.rotation = 0
        this.hitpoints = 100
        this.isAlive = true
        this.speed = 600
        this.size = 25
        this.mass = 5
        this.material = new p2.Material();

        this.circleShape = new p2.Circle({
            radius: this.size / 2
        });
        this.circleShape.material = this.material;
        this.body = new p2.Body({
            mass: 20,
            position: [0, 0]
        });
        this.body.addShape(this.circleShape)

        // weapon cooldown!
        // example of a plain data-only component
        this.weapon = {
            onCooldown: false,
            cooldown: 0.5,
            acc: 0
        }

        // collider!
        // example of a component that involves fancy stuff from another libary
        this.collider = CollisionSystem.createCircleCollider(0, 0, 0)
        
    }

    get x() {
        return this.collider.x
    }
    set x(value) {
        this.collider.x = value
    }

    get y() {
        return this.collider.y
    }
    set y(value) {
        this.collider.y = value
    }
}

PlayerCharacter.protocol = {
    x: { type: nengi.Float32, interp: true },
    y: { type: nengi.Float32, interp: true },
    rotation: { type: nengi.RotationFloat32, interp: true },
    delta: nengi.Number,
    isAlive: nengi.Boolean,
    hitpoints: nengi.UInt8
}

export default PlayerCharacter
