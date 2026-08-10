class Action {
    constructor(name, duration) {
        this.name = name
        this.walkTime = name == "walk" ? duration : 0;
        this.foodTime = name == "food" ? duration : 0;
        this.woodTIme = name == "wood" ? duration : 0;
    }
}

export { Action };