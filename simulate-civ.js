import {entityUtils} from './utils.js'
import EventEmitter from 'node:events'
import Resources from './Resources.js'

class Action {
    constructor(name, duration){
        this.name = name
        this.walkTime = name == "walk"? duration: 0;
        this.foodTime = name == "food"? duration: 0;
        this.woodTIme = name == "wood"? duration: 0;
    }
}

class Vil {
    constructor(spawn, id) {
        this.id = id;
        this.spawn = spawn;
        this.work = "idle";
        this.actionsQueue = []
        this.bag = 0;
        this.findWork = function() {
        }
        this.dropOffFood = function() {
        }
    }
}

let resources = new Resources();

let events = {
    timestampChange: "timestampChange",
    notification: "notification"
}

const myEmitter = new EventEmitter;

let vilCount = 3
let vilCreationTime = 25;
let defaultTimeInterval = 1;
let timestamp = 0;
let vils = [];
let tc = {
    prod: "Vil",
    currentworktime: 0,
    onGoingProd: false,
    chooseProd: function(){
        myEmitter.emit(events.notification, "Ciclo concluído; Food atual: " + resources.food + "; timestamp: " + timestamp);
    }
} 

let entities = [
    new Vil(0, 1),
    new Vil(0, 2),
    new Vil(0, 3)
]

let continueSimulation = true
function simulateCiv(){
    while(continueSimulation) {
        let interval = 1;
        timestamp += interval
        myEmitter.emit(events.timestampChange, interval)
    }
    //console.log(entities)
}

let vilCost = 50;
function tcWorkflow(interval) {
    tc.currentworktime += interval;

    if (!(tc.onGoingProd)) {
        if (tc.prod == "Vil") {
            if(resources.food >= vilCost) {
                resources.food -= vilCost
                tc.onGoingProd = true
            } else continueSimulation = false;
        }
    }

    if (tc.prod == "Vil" && tc.onGoingProd) {
        if (tc.currentworktime >= vilCreationTime) {
            tc.currentworktime -= vilCreationTime;
            vilCount += 1;
            entities.push(new Vil(timestamp - tc.currentworktime, vilCount))
            tc.onGoingProd = false;
            tc.chooseProd()
        }
    }
}

myEmitter.on("notification", (message) => {
    console.log(message)
})

myEmitter.on(events.timestampChange, (interval) => {
    if (timestamp > 600) continueSimulation = false;
    tcWorkflow(interval)
}) 
simulateCiv()
