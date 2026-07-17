
class Vil {
    constructor(spawn, id) {
        this.id = id;
        this.spawn = spawn;
        this.work = "idle";
        this.bag = 0;
        this.findWork = function() {
        }
        this.dropOff = function() {
        }
    }
}

let defaultTimeInterval = 1;
let timestamp = 0;
let vils = [];
let tc = {
    prod: "",
    chooseProd: function(){
        console.log("okay")
    }
} 

let entities = [
    new Vil(1, 1),
    new Vil(15, 2)
]

function simulateCiv(){
    runTimeCycle(defaultTimeInterval);
    runTimeCycle(defaultTimeInterval);
    console.log(timestamp);
    tc.chooseProd();
    entities.forEach((entity) => {
        console.log(entity);
        if (entity.constructor.name == "Vil") {console.log("é vil")}
    })
}

function runTimeCycle(interval) {
    timestamp += interval;
}

simulateCiv()

module.exports = {simulateCiv}