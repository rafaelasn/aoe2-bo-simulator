
class Task {
    constructor(vil, duration, callback) {
        this.vil = vil;
        this.duration = duration;
        this.callback = callback;
        this.isCompleted = false;

        this.developTask = function (interval) {
            this.duration -= interval;
            this.vil.workingTime -= interval;
            if (this.duration <= 0) {
                callback();
                this.vil.workingTime -= duration;
                this.isCompleted = true;
            }
        }
    }
}

export {Task};