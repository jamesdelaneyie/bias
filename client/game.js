import nengi from 'nengi'
import nengiConfig from '../common/nengiConfig.js'
import InputSystem from './InputSystem.js'
import PIXIRenderer from './graphics/PIXIRenderer.js'
import clientHookAPI from './clientHookAPI.js'
import createHooks from './hooks/createHooks.js'
import handleInput from './handleInput.js'
import drawHitscan from './graphics/drawHitscan.js'
import reconcilePlayer from './reconcilePlayer.js'
import shouldIgnore from './shouldIgnore.js'
import addMessage from './graphics/addMessage.js'


const create = () => {
    const client = new nengi.Client(nengiConfig, 100)
    
    const renderer = new PIXIRenderer()
    const input = new InputSystem(renderer)

    const state = {
        myRawId: null,
        mySmoothId: null,
        obstacles: new Map(),
        boxes: new Map(),
        floors: new Map()
    }

    clientHookAPI( // API EXTENSION
        client,
        createHooks(state, renderer)
    )

    client.entityUpdateFilter = (update) => {
        return shouldIgnore(state.myRawId, update)
    }

    client.on('message::Identity', message => {
        state.myRawId = message.rawId
        state.mySmoothId = message.smoothId
    })

    client.on('message::WeaponFired', message => {
        if (message.sourceId === state.mySmoothEntity.nid) {
            return
        }
        const { x, y, tx, ty } = message
        drawHitscan(renderer.middleground, x, y, tx, ty, 0xff0000)
    })

    client.on('message::Notification', message => {
        //console.log('Notification', message)
        if(message.type == "notification") {
            message.x = 0
            message.y = 0
            addMessage(renderer.foreground, message);
        }
        if(message.type == "text") {
            addMessage(renderer.middleground, message);
        }
        if(message.type == "talk") {
            addMessage(renderer.middleground, message);
        }
        
    })
    

    //messages to clients / local for view // spacial structure
    //channel is list of entities / 

    client.on('predictionErrorFrame', predictionErrorFrame => {
        reconcilePlayer(predictionErrorFrame, client, state.myRawEntity, state.obstacles, state.boxes)
    })

    client.on('connected', res => { console.log('connection?:', res) })
    client.on('disconnected', () => { console.log('connection closed') })

    client.connect('ws://localhost:8079')
    //client.connect('ws://185.92.221.225:8079')


    const update = (delta, tick, now) => {
        client.readNetworkAndEmit()
        handleInput(input, state, client, renderer, delta)
        renderer.update(delta)
        client.update()
    }

    return update
}

export default create
