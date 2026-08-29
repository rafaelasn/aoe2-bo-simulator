
class Vil {
    constructor(spawn, id, build, collectedResources) {
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
                collectedResources.food += this.bag;
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
        this.lureBoar = function (boar) {
            let timeNeededToLure = boar.distance / this.walkingSpeed;
            this.workingTime -= timeNeededToLure;
        }
    }
}

export { Vil };
