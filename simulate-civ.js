import { entityUtils } from './utils.js'
import EventEmitter from 'node:events'
import Resources from './Resources.js'

let collectedFood = 0;
let decayedFood = 0;

class Action {
    constructor(name, duration) {
        this.name = name
        this.walkTime = name == "walk" ? duration : 0;
        this.foodTime = name == "food" ? duration : 0;
        this.woodTIme = name == "wood" ? duration : 0;
    }
}

class Vil {
    constructor(spawn, id) {
        this.id = id;
        this.spawn = spawn;
        this.work = "idle";
        this.actionsQueue = []
        this.bag = 0;
        this.maxCarry = {
            default: 10,
            hunt: 35

        }
        this.findWork = function () {
            return "food";
        }
        this.dropOffFood = function (type, resources) {
            if (type == "food") { resources.food += this.bag };
            //if (type == "wood") {resources.wood += this.bag};

            collectedFood += this.bag;
            console.log("bag being droppedOff: " + this.bag);

            this.bag = 0;
        }
        this.addToBag = function (amount, resources, isHunt = false) {
            this.bag += amount;
            if (isHunt) {
                if (this.bag >= this.maxCarry.hunt) {
                    this.dropOffFood("food", resources)
                }
            } else {
                if (this.bag >= this.maxCarry.default) {
                    this.dropOffFood("food", resources)
                }
            }
        }
    }
}

class Sheep {
    constructor() {
        this.type = 'sheep';
        this.value = 100;
        this.decayRate = 0.25;
        this.decaying = false
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
let interval = 1;
let timestamp = 0;
let vils = [];

let entities = [
    new Vil(0, 1),
    new Vil(0, 2),
    new Vil(0, 3)
];

let tc = {
    prod: "Vil",
    currentworktime: 0,
    onGoingProd: false,
    foodUnderTc: [new Sheep(), new Sheep(), new Sheep(), new Sheep()],
    gatheringFood: [entities[0], entities[1], entities[2]],
    chooseProd: function () {
        myEmitter.emit(events.notification, "Ciclo concluído; Food atual: " + resources.food + "; timestamp: " + timestamp);
    }
}

let continueSimulation = true
function simulateCiv() {
    console.log(tc);
    
    while (continueSimulation) {
        timestamp += interval
        myEmitter.emit(events.timestampChange, interval)
    }

    console.log(entities)
    console.log("food under tc:")
    console.log(tc.foodUnderTc)
    console.log("encerrado em: " + timestamp)
    console.log("food atual: " + resources.food)
    console.log("vilcount: " + vilCount)

    let vilFoodBag = 0;
    entities.forEach(vil => {
        vilFoodBag += vil.bag;
    })

    console.log("collected food: " + collectedFood)
    console.log("decayed food: " + decayedFood)
    console.log("actual created food: " + (decayedFood + collectedFood + vilFoodBag + 200))
}

let vilCost = 50;
function tcWorkflow(interval) {
    tc.currentworktime += interval;

    gatherFoodUnderTc(interval)

    let enoughFoodToMakeVil = (resources.food >= vilCost)
    if (!(tc.onGoingProd)) {
        if (tc.prod == "Vil") {
            if (enoughFoodToMakeVil) {
                resources.food -= vilCost
                tc.onGoingProd = true
            } else continueSimulation = false;
        }
    }

    if (tc.prod == "Vil" && tc.onGoingProd) {
        if (tc.currentworktime >= vilCreationTime) {
            deductWorktimeToMakeVil();
        }
    }
}

function gatherFoodUnderTc(interval) {
    let vilsGatheringCount = tc.gatheringFood.length;
    let sheepGatherRate = 0.33;

    if (tc.foodUnderTc.length == 0) { return }

    decayFromFoodSources()

    tc.gatheringFood.forEach(foodVil => {
        if (tc.foodUnderTc.length == 0) { return }
        let foodSource = tc.foodUnderTc[0];
        if (foodSource.value >= 0) {
            if (!(foodSource.decaying)) { foodSource.decaying = true };

            let foodAmount = sheepGatherRate * interval;
            foodVil.addToBag(foodAmount, resources);
            foodSource.value -= foodAmount;
        } else { tc.foodUnderTc.shift() }
    })


}

function decayFromFoodSources() {
    tc.foodUnderTc.forEach(foodSource => {
        if (foodSource.decaying) {
            let lastFood = foodSource.value
            foodSource.value -= foodSource.decayRate * interval;
            decayedFood += lastFood - foodSource.value;
        };
    });
}

function deductWorktimeToMakeVil() {
    tc.currentworktime -= vilCreationTime;
    vilCount += 1;
    addNewVil(timestamp - tc.currentworktime, vilCount);
    tc.onGoingProd = false;
    tc.chooseProd()
}

function addNewVil(spawnTime, id) {
    let newVil = new Vil(spawnTime, id);
    entities.push(newVil)

    myEmitter.emit("newVil", newVil)
}

myEmitter.on("newVil", (newVil) => {
    newVil.work = "food"

    if (newVil.work == "food") {
        tc.gatheringFood.push(newVil)
    }
})

myEmitter.on("notification", (message) => {
    console.log(message)
})

myEmitter.on(events.timestampChange, (interval) => {
    if (timestamp > 600) continueSimulation = false;
    tcWorkflow(interval)
})

simulateCiv()
