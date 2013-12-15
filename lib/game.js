var Renderer = require('./render');
var Camera = require('./camera');
var Truck = require('./truck');
var Present = require('./present');
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
    this.presents = [];
    this.last_tick = Date.now();
    this.keys = {};

    this.renderer = new Renderer(this.canvas, this);
    this.space = new cp.Space();
    this.space.iterations = 10;
    this.space.gravity = cp.v(0,1000);
    this.objects.truck = new Truck(this);
    for (var p = 0; p < 3; p++) {
        this.presents.push(new Present(this));
    }
    this.terrain = terrain.generate();
    for (var x = 0; x < 6000; x++) {
        this.objects['terrain' + x] = new terrain.Terrain(this, x * 40 - 40, this.terrain[x - 1] * 4 || 0, x * 40, this.terrain[x] * 4);
    }
    document.addEventListener('keydown', function(e) {
        this.keys[e.keyCode] = true;
    }.bind(this));
    document.addEventListener('keyup', function(e) {
        this.keys[e.keyCode] = false;
    }.bind(this));
    this.throttle = 10;

}

(function () {

    this.render = function () {
        var game = this;
        this.renderer.ctx.save();
        this.camera.transform();
        this.presents.forEach(function (p) {
            p.render();
        });
        Object.keys(this.objects).forEach(function (objname) {
            game.objects[objname].render();
        });
        this.renderer.ctx.restore();
    };

    this.tick = function () {
        var now = Date.now();
        var dt = now - this.last_tick || 0;
        this.last_tick = now;
            
        var w1av = this.objects.truck.wheel1.getAngVel();
        var w2av = this.objects.truck.wheel2.getAngVel();
    
        if (this.keys['38']) {
            if (w1av < 0) this.objects.truck.wheel1.setAngVel(0);
            if (w2av < 0) this.objects.truck.wheel2.setAngVel(0);
            if (w1av < 24 && w2av < 24) {
                this.objects.truck.wheel1.applyImpulse(cp.v(0, -20), cp.v(-this.throttle * dt, 0));
                this.objects.truck.wheel1.applyImpulse(cp.v(0, 20), cp.v(this.throttle * dt, 0));
                this.objects.truck.wheel2.applyImpulse(cp.v(0, -20), cp.v(-this.throttle * dt, 0));
                this.objects.truck.wheel2.applyImpulse(cp.v(0, 20), cp.v(this.throttle * dt, 0));
            }
        } else if (this.keys['40']) {
            if (w1av > 0) this.objects.truck.wheel1.setAngVel(0);
            if (w2av > 0) this.objects.truck.wheel2.setAngVel(0);
            if (w1av > -12 && w2av > -12) {
                this.objects.truck.wheel1.applyImpulse(cp.v(0, -20), cp.v(this.throttle * dt * .3, 0));
                this.objects.truck.wheel1.applyImpulse(cp.v(0, 20), cp.v(-this.throttle * dt * .3, 0));
                this.objects.truck.wheel2.applyImpulse(cp.v(0, -20), cp.v(this.throttle * dt * .3, 0));
                this.objects.truck.wheel2.applyImpulse(cp.v(0, 20), cp.v(-this.throttle * dt * .3, 0));
            }
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

