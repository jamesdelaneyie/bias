import * as PIXI from 'pixi.js'
import BackgroundGrid from './BackgroundGrid.js'
import { Joystick }  from './Joystick.js'
import p2 from 'p2'
import {CRTFilter} from '@pixi/filter-crt';


class PIXIRenderer {

    constructor() {
        this.canvas = document.getElementById('main-canvas')
        this.entities = new Map()
        this.world = new p2.World({gravity: [0, 9.82]});
        this.collection = []

        this.renderer = PIXI.autoDetectRenderer({
            width: window.innerWidth, 
            height: window.innerHeight, 
            view: this.canvas,
            antialias: true,
            transparent: false,
            resolution: 2
        })

    

        this.stage = new PIXI.Container()
        this.camera = new PIXI.Container()
        this.background = new PIXI.Container()
        this.middleground = new PIXI.Container()

        const blurFilter1 = new CRTFilter(10);
        //this.middleground.filters = [blurFilter1];

        this.foreground = new PIXI.Container()

        this.camera.addChild(this.background)
        this.camera.addChild(this.middleground)
        this.camera.addChild(this.foreground)
        this.stage.addChild(this.camera)

        this.background.addChild(new BackgroundGrid())

        /*var wallMaterial = new p2.Material();
        
        function createWall(world, middleground, x, y, w, h, rotation) {
          var shape = new p2.Box({
              width: w, 
              height: h,
          });
          var body = new p2.Body({
              mass: 0,
              position: [x, y],
              angle: -rotation
          });
          body.addShape(shape);
          world.addBody(body);
          
          shape.material = wallMaterial;
          
          var graphic = new PIXI.Graphics();
          graphic.beginFill(0x666666);
          graphic.drawRect(-w/2, -h/2, w, h);
          graphic.endFill();
          graphic.pivot.set(0.5, 0.5);
          graphic.x = x;
          graphic.y = y;
          graphic.rotation = -rotation;
          middleground.addChild(graphic);
          graphic.body = body;
          graphic.shape = shape;

        }

        createWall(this.world, this.middleground, 500, 200, 500, 20, 0.1)
        createWall(this.world, this.background, 500, 1000, 1020, 20, 0)

        var circleMaterial = new p2.Material();

        function createBall(world, location, collection, color, radius, mass, x, y, velX, velY) {
            var circleShape = new p2.Circle({ radius: radius });
            circleShape.material = circleMaterial;
            var circleBody = new p2.Body({
                mass: mass,
                position: [x, y],
                velocity: [velX, velY],
            });
            circleBody.addShape(circleShape);
            world.addBody(circleBody);
            var circleGraphic = new PIXI.Graphics();
            circleGraphic.beginFill(color);
            circleGraphic.drawCircle(0, 0, radius/2);
            circleGraphic.pivot.set(0.5, 0.5);
            circleGraphic.endFill();
            location.addChild(circleGraphic)
            circleGraphic.body = circleBody;
            circleGraphic.shape = circleShape;
            collection.push(circleGraphic);
        }

        createBall(this.world, this.middleground, this.collection, '0x00ff00', 60, 5, 500, 0,0,0);
        
        
        var boxVsBall = new p2.ContactMaterial(circleMaterial, wallMaterial, {
            friction: 0,
            restitution: 1
        });
        this.world.addContactMaterial(boxVsBall);*/

        const style = new PIXI.TextStyle({
            fontSize: 60,
            fontWeight: 100,
            fontFamily: "Helvetica, sans-serif",
            fill: "black",
            lineJoin: "round",
            stroke: "#37ff00",
            strokeThickness: 4
        });
        const text = new PIXI.Text('I installed and restarted on my own!', style);
        this.middleground.addChild(text);
        text.anchor.x = 0;
        text.anchor.y = 0;
        text.x = 50;
        text.y = 50;


        window.addEventListener('resize', () => {
            this.resize()
        })

        this.resize()
    }


    resize() {
        this.renderer.resize(window.innerWidth, window.innerHeight)
    }
 
    centerCamera(entity) {
        this.camera.x = -entity.x + 0.5 * window.innerWidth
        this.camera.y = -entity.y + 0.5 * window.innerHeight
    }

    followSmoothlyWithCamera(entity, delta) {
        const cameraSpeed = 5
        const targetX = -entity.x + 0.5 * window.innerWidth
        const targetY = -entity.y + 0.5 * window.innerHeight
        const dx = targetX - this.camera.x
        const dy = targetY - this.camera.y
        this.camera.x += dx * cameraSpeed * delta
        this.camera.y += dy * cameraSpeed * delta
    }

    toWorldCoordinates(mouseX, mouseY) {
        return {
            x: -this.camera.x + mouseX,
            y: -this.camera.y + mouseY
        }
    }

    update(delta) {
        this.entities.forEach(entity => {
            entity.update(delta)
        })

        // Move physics bodies forward in time
        this.world.step(1/20);

        for (var i = this.collection.length - 1; i >= 0; i--) {
            var graphic = this.collection[i];
            if (graphic.body.world && graphic.shape.type == p2.Shape.CIRCLE) {
                var x = this.world.bodies[i+2].position[0];
                var y = this.world.bodies[i+2].position[1];
                graphic.position.set(x,y)
            }
        }

        this.renderer.render(this.stage)
    }
}

export default PIXIRenderer
