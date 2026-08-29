
class Boar {
    constructor(distanceFromTownCenter) {
        this.type = 'boar';
        this.value = 300;
        this.gatherRate = 0.4725;
        this.distance = distanceFromTownCenter;
        this.decayRate = 0.4;
        this.decaying = false;
    };
};

class Deer {
    constructor() {
        this.type = 'deer';
        this.value = 140;
        this.decayRate = 0.25;
        this.decaying = false;
    };
};

export { Boar, Deer };