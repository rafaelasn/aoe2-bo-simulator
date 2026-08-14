import { entityUtils } from './utils.js'
import EventEmitter from 'node:events'
import { Bank } from './Bank.js'
import { Action } from './Actions.js'
import { BuildOrder } from './BuildOrder.js'

let collectedFood = 0;
let decayedFood = 0;
let build = new BuildOrder("6 food; 4 wood; 4 food")

class Vil {
    constructor(spawn, id, build) {
        this.id = id;
        this.spawn = spawn;
        this.work = "idle";
        this.status = "idle";
        this.workingTime = 0;
        this.walkingSpeed = 0.8;
        this.gatheringCamp = null;
        this.gatheringRate = {
            wood: 0.388
        }
        this.actionsQueue = []
        this.bag = 0;
        this.maxCarry = {
            default: 10,
            hunt: 35

        }
        this.findWork = function () {
            return build.getNextVilWork();
        }

        this.dropOffFood = function (type, bank) {
            if (type == "food") {
                bank.food += this.bag
                collectedFood += this.bag;
                console.log("bag being droppedOff: " + this.bag);
                this.bag = 0;
            };
            if (type == "wood") {
                this.status = "walking";
                this.workingTime -= this.gatheringCamp._woodDistance / this.walkingSpeed;
            };


        }
        this.addToBag = function (amount, bank, isHunt = false) {
            this.bag += amount;
            if (isHunt) {
                if (this.bag >= this.maxCarry.hunt) {
                    this.dropOffFood("food", bank)
                }
            } else {
                if (this.bag >= this.maxCarry.default) {
                    this.dropOffFood("food", bank)
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

// ~~~~~~~~~~~~~~~~~~ Main ~~~~~~~~~~~~~~~~~~~~~

let world = {
    bank: new Bank(),
};

let bank = new Bank();

let events = {
    timestampChange: "timestampChange",
    notification: "notification"
}

const myEmitter = new EventEmitter;

let vilCount = 3
let vilCreationTime = 25;
let defaultTimeInterval = 1;
let forceDropoffCount = 0;
const maxForceDropoffCount = 2;
const interval = 1;
let timestamp = 0;
let villagers = [
    new Vil(0, 1, build),
    new Vil(0, 2, build),
    new Vil(0, 3, build)
];

villagers.forEach(vil => {
    vil.work = build.getNextVilWork()
})

let tc = {
    prod: "Vil",
    currentworktime: 0,
    onGoingProd: false,
    foodUnderTc: [new Sheep(), new Sheep(), new Sheep(), new Sheep()],
    gatheringFood: [villagers[0], villagers[1], villagers[2]],
    chooseProd: function () {
        myEmitter.emit(events.notification, "Ciclo concluído; Food atual: " + world.bank.food + "; timestamp: " + timestamp);
    }
}

let continueSimulation = true
function simulateCiv() {

    while (continueSimulation) {
        timestamp += interval
        myEmitter.emit(events.timestampChange, interval)
    }

    console.log(villagers)
    console.log("food under tc:")
    console.log(tc.foodUnderTc)
    console.log("encerrado em: " + timestamp)
    console.log("food atual: " + world.bank.food)
    console.log("vilcount: " + vilCount)

    let vilFoodBag = 0;
    villagers.forEach(vil => {
        vilFoodBag += vil.bag;
    })

    console.log("collected food: " + collectedFood)
    console.log("decayed food: " + decayedFood)
    console.log("actual created food: " + (decayedFood + collectedFood + vilFoodBag + 200))
    console.log(build.buildOrder)
    console.log("vil work attributed: " + build._vilWorkAttributed)
}

let vilCost = 50;
function tcWorkflow(interval) {
    tc.currentworktime += interval;

    gatherFoodUnderTc(interval)

    let enoughFoodToMakeVil = (world.bank.food >= vilCost)
    if (tc.onGoingProd == false) {
        if (tc.prod == "Vil") {
            if (enoughFoodToMakeVil) {
                world.bank.food -= vilCost
                tc.onGoingProd = true
            } else {
                let gatheringFoodBag = 0;
                tc.gatheringFood.forEach(vil => {
                    gatheringFoodBag += vil.bag;
                });

                if (gatheringFoodBag + world.bank.food < vilCost) {
                    myEmitter.emit(events.notification, "Não há comida suficiente para criar um vil. Food atual: " + world.bank.food + "; timestamp: " + timestamp);
                    continueSimulation = false;
                } else {
                    verifyMaxForceDropoffCount()
                    forceDropoffFood();
                }
            }
        }
    }
    continueVilProduction();
}

function continueVilProduction() {
    if (tc.prod == "Vil" && tc.onGoingProd) {
        if (tc.currentworktime >= vilCreationTime) {
            deductWorktimeToMakeVil();
        }
    }
}

function verifyMaxForceDropoffCount() {
    if (forceDropoffCount >= maxForceDropoffCount) {
        myEmitter.emit(events.notification, "Máximo de dropoffs atingido. Food atual: " + world.bank.food + "; timestamp: " + timestamp);
        continueSimulation = false;
    }
}

function forceDropoffFood() {
    tc.gatheringFood.forEach(vil => {
        vil.dropOffFood("food", world.bank);
        forceDropoffCount += 1;
    })
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
            foodVil.addToBag(foodAmount, world.bank);
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
    let newVil = new Vil(spawnTime, id, build);
    villagers.push(newVil)

    myEmitter.emit("newVil", newVil)
}

myEmitter.on("newVil", (newVil) => {
    newVil.work = build.getNextVilWork();

    if (newVil.work == "food") {
        tc.gatheringFood.push(newVil)
    }
})

myEmitter.on("notification", (message) => {
    console.log(message)
})

myEmitter.on(events.timestampChange, (interval) => {
    if (timestamp > 600) continueSimulation = false;

    villagers.forEach(vil => {
        vil.workingTime += interval;
    });

    world.buildings.lumbercamps.forEach(camp => {
        camp.collectWood();
    });

    tcWorkflow(interval);

});

simulateCiv();
