function Camera(game) {
    this.game = game;
    this.target = this.game.target || {x: 0, y: 0};
    this.frames = [];
}

(function () {
    this.setTarget = function (target) {
        this.target = target;
    }

    this.releaseTarget = function () {
        this.target = null;
    }

    this.move = function (target) {
         this.setTarget(target);
    }

    this.moveOverTime = function (target, duration) {
        this.scaling = true;
        this.oldTarget = this.target;
        this.target = target;
        this.scaleStartTime = Date.now().valueOf();
        this.scaleDuration = duration;
        this.elapsed = 0;
    }

    this.tick = function (dt) {
        if (this.target) {
            this.x = this.target.x;
            this.y = this.target.y;
            
            if (this.scaling) {
                var progress = (this.scaleStartTime + this.elapsed) / this.duration;
                var currentTarget = this.target;
                
                if (progress >= 1) {
                    this.scaling = false;
                    this.x = currentTarget.x;
                    this.y = currentTarget.y;
                    return false;
                }

                this.x = currentTarget.x + (this.oldTarget.x - currentTarget.x) * progress;
                this.y = currentTarget.y + (this.oldTarget.y - currentTarget.y) * progress;
            }
        }
    }

}).call(Camera.prototype);

module.exports = Camera;
