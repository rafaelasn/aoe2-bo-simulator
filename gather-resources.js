
function gatherResources(vil, world) {
    switch (vil.work) {
        case "food":
            break;
        case "wood":
            gatherWood(vil, world);
            break;
    }
}

function gatherWood(vil, world) {

}

class Lumbercamp {
    constructor() {
        this.workers = [];
        this._maxWorkers = 8;
        this._woodDistance = 0;
        this._collectedSinceLastRenewal = 0;

        this.updateCollected = function (amount) {
            this._collectedSinceLastRenewal += amount;
            if (this._collectedSinceLastRenewal >= 2400) {
                this._woodDistance = 3;
                //rebuildCamp();
            } else if (this._collectedSinceLastRenewal >= 1200) {
                this._woodDistance = 2;
            } else if (this._collectedSinceLastRenewal >= 400) {
                this._woodDistance = 1;
            }
        }

        this.#rebuildCamp = function () {
            
        }
    }

    collectWood() {
        this.workers.forEach(vil => {
            if (vil.work == "wood" && vil.status == "gathering") {
                let addToBag = vil.worktime * vil.gatheringRate.wood;
                vil.workingTime = 0;
                vil.addToBag(addToBag, world.resources);
            }
        })
    }
}
