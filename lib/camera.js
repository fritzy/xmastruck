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

    this.move = function (x, y) {
         this.setTarget(x, y);
         // move the camera
    }

    this.moveOverTime = function (x, y, duration) {
        var distance = Math.sqrt((Math.pow(2 - 7, 2)) + (Math.pow(4 - 20, 2)));
        var quotient = 1 / distance;
        var speed = 20;

        for (i = 0; i <= 1; quotient++) {
            setTimeout(function () {
                this.move();
            });
        }
    }

    this.tick = function () {
        if (this.target) {
            this.x = this.target.x;
            this.y = this.target.y;
        } else if (this.frames.length > 0) {
            for (i = 0; i < this.frames.length; i++) {
                this.move(this.frames[i].x, this.frames[i].y);
            }
        }
    }

}).call(Camera.prototype);

module.exports = Camera;
