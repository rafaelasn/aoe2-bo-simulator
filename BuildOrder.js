class BuildOrder {
    constructor(buildString = "6 food; 4 wood; 2 food") {
        this._buildString = buildString;
        this.vilWorkAttributed = 0;
    }

    get buildOrder() {
        let bo = [];
        let steps = this._buildString.split(";")
        for (let step of steps) {
            let [amount, type] = step.trim().split(" ")

            for (let i = 0; i < amount; i++) {
                bo.push(type)
            }
        }
        return bo;
    } 

    getNextVilWork() {
        let work = this.buildOrder[this.vilWorkAttributed]? this.buildOrder[this.vilWorkAttributed] : "Idle";
        this.vilWorkAttributed++;
        return work;
    }
}

export { BuildOrder };