var Renderer = require('./render');
var Camera = require('./camera');
var Truck = require('./truck');
var terrain = require('./terrain');

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
            window.setTimeout(callback, 1000 / 60);
    };
})();

function XmasTruck(canvas) {
    this.canvas = canvas;
    this.camera = new Camera(this);
    this.objects = {};
    this.last_tick = Date.now();
    this.keys = {};

    this.renderer = new Renderer(this.canvas, this);
    this.space = new cp.Space();
    this.space.iterations = 10;
    this.space.gravity = cp.v(0,100);
    this.objects.truck = new Truck(this);
    this.terrain = terrain.generate();
    for (var x = 0; x < 600; x++) {
        this.objects['terrain' + x] = new terrain.Terrain(this, x * 40 - 40, this.terrain[x - 1] * 4 || 0, x * 40, this.terrain[x] * 4);
    }
    document.addEventListener('keydown', function(e) {
        this.keys[e.keyCode] = true;
    }.bind(this));
    document.addEventListener('keyup', function(e) {
        this.keys[e.keyCode] = false;
    }.bind(this));
    this.throttle = 30;

}

(function () {

    this.render = function () {
        var game = this;
        this.renderer.ctx.save();
        this.camera.transform();
        Object.keys(this.objects).forEach(function (objname) {
            game.objects[objname].render();
        });
        this.renderer.ctx.restore();
    };

    this.tick = function () {
        var now = Date.now();
        var dt = now - this.last_tick || 0;
        this.last_tick = now;
    
        if (this.keys['38']) {
            //this.objects.truck.motor.rate = -6;
            //this.objects.truck.motor.applyImpulse();
            this.objects.truck.wheel1.applyImpulse(cp.v(0, -20), cp.v(-this.throttle, 0));
            this.objects.truck.wheel1.applyImpulse(cp.v(0, 20), cp.v(this.throttle, 0));
            this.objects.truck.wheel2.applyImpulse(cp.v(0, -20), cp.v(-this.throttle, 0));
            this.objects.truck.wheel2.applyImpulse(cp.v(0, 20), cp.v(this.throttle, 0));
        } else if (this.keys['40']) {
            this.objects.truck.wheel1.applyImpulse(cp.v(0, -20), cp.v(this.throttle, 0));
            this.objects.truck.wheel1.applyImpulse(cp.v(0, 20), cp.v(-this.throttle, 0));
            this.objects.truck.wheel2.applyImpulse(cp.v(0, -20), cp.v(this.throttle, 0));
            this.objects.truck.wheel2.applyImpulse(cp.v(0, 20), cp.v(-this.throttle, 0));
            //this.objects.truck.motor.rate = 6;
        } else {
            //this.objects.truck.motor.rate = 0;
        }

        this.camera.setTarget(this.objects.truck.shapes[1].body.p);
        this.space.step(dt/1000);
        this.camera.tick(dt);
        this.renderer.render(dt);

        window.requestAnimFrame(this.tick.bind(this));
    };

}).call(XmasTruck.prototype);

window.XmasTruck = XmasTruck;

