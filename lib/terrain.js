var PhysicsObject = require('./object');
var noise = require('./perlin2');

function generate() {
    var points = [];
    noise.seed(Math.random());
    var y = 0;
    var ly = 400;
    for (var x = 0; x < 30; x++) {
        points.push(400);
    }
    for (var x = 30; x < 6000; x++) {
        points.push(noise.simplex2((x-30)/400, 0)*600 + 400);
        ly = y;
    }
    noise.seed(Math.random());
    for (var x = 30; x < 6000; x++) {
        points[x] += noise.simplex2((x-30)/30, 0)*30;
    }
    noise.seed(Math.random());
    for (var x = 30; x < 6000; x++) {
        points[x] += noise.simplex2((x-30)/12, 0)*5;
    }
    return points;
}

function Terrain(game, x1, y1, x2, y2) {
    PhysicsObject.apply(this, [game]);
    var shape = new cp.SegmentShape(
            this.game.space.staticBody, 
            cp.v(x1, y1), cp.v(x2, y2), 0);
    var line = this.game.space.addShape(shape);
    line.setElasticity(0);
    line.setFriction(.7);
    this.shapes.push(shape);
};

Terrain.prototype = Object.create(PhysicsObject.prototype);

module.exports = {
    Terrain: Terrain,
    generate: generate,
};
