
let defaultTimeInterval = 1;
let timestamp = 0;
let vils = [];
let tc = {
    prod: "",
    chooseProd: function(){
        console.log("okay")
    }
} 

function simulateCiv(){
    runTimeCycle(defaultTimeInterval);
    runTimeCycle(defaultTimeInterval);
    console.log(timestamp);
    tc.chooseProd();
}

function runTimeCycle(interval) {
    timestamp += interval;
}

module.exports = {simulateCiv}