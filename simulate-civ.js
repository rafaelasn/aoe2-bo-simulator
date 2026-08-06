import { entityUtils } from './utils.js'
import EventEmitter from 'node:events'
import Resources from './Resources.js'

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
            if (type == "food") {resources.food = this.bag};
            if (type == "wood") {resources.wood = this.bag};

            this.bag = 0;
        }
        this.addToBag = function (amount, resources, isHunt = false) {
            this.bag += amount;
            if (isHunt){
                if (this.bag >= this.maxCarry.hunt) {
                    this.dropOffFood(resources)
                }
            } else {
                if (this.bag >= this.maxCarry.default) {
                    this.dropOffFood(resources)
                }
            }
        }
    }
}

class Sheep {
    constructor() {
        this.type = 'sheep';
        this.value = 150;
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
        let interval = 1;
        timestamp += interval
        myEmitter.emit(events.timestampChange, interval)
    }

    console.log(tc)
    console.log(entities)
    console.log(tc.foodUnderTc)
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

    tc.foodUnderTc.forEach(foodSource => {
        if (foodSource.decaying) {
            foodSource.value -= foodSource.decayRate * interval;
        };
    });

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

function deductWorktimeToMakeVil() {
    tc.currentworktime -= vilCreationTime;
    vilCount += 1;
    entities.push(new Vil(timestamp - tc.currentworktime, vilCount));
    tc.onGoingProd = false;
    tc.chooseProd()
}

myEmitter.on("notification", (message) => {
    console.log(message)
})

myEmitter.on(events.timestampChange, (interval) => {
    if (timestamp > 600) continueSimulation = false;
    tcWorkflow(interval)
})
simulateCiv()
