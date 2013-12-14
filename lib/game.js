var Renderer = require('./render');
var Camera = require('./camera');
var Truck = require('./truck');

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

    this.renderer = new Renderer(this.canvas, this);
    this.space = new cp.Space();
    this.space.iterations = 10;
    this.space.gravity = cp.v(0,100);
    this.objects.truck = new Truck(this);
}

(function () {

    this.render = function () {
        var game = this;
        Object.keys(this.objects).forEach(function (objname) {
            game.objects[objname].render();
        });
    };

    this.tick = function () {
        var now = Date.now();
        var dt = now - this.last_tick;
        this.last_tick = now;

        this.renderer.render(dt);
        this.camera.tick(dt);

        window.requestAnimFrame(this.tick.bind(this));
    };

}).call(XmasTruck.prototype);

window.XmasTruck = XmasTruck;

