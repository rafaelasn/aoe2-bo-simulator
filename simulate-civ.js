import {entityUtils} from './utils.js'

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

let vilCount = 3
let vilCreationTime = 25;
let defaultTimeInterval = 1;
let timestamp = 0;
let vils = [];
let tc = {
    prod: "Vil",
    currentworktime: 0,
    chooseProd: function(){
        console.log("ciclo completo!")
    }
} 

let entities = [
    new Vil(0, 1),
    new Vil(0, 2),
    new Vil(0, 3)
]

function simulateCiv(){
    while(timestamp < 53) {
        runTimeCycle(defaultTimeInterval);
    }
    console.log(entities)
}

function tcWorkflow(interval) {
    tc.currentworktime += 1;
    if (tc.prod == "Vil") {
        if (tc.currentworktime >= vilCreationTime) {
            tc.currentworktime -= vilCreationTime;
            vilCount += 1;
            entities.push(new Vil(timestamp - tc.currentworktime, vilCount))

            tc.chooseProd()
        }
    }
}

function runTimeCycle(interval) {
    timestamp += interval;
    tcWorkflow(interval)
}

simulateCiv()
