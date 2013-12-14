var PhysicsObject = require('./object');

function Terrain(game, x1, y1, x2, y2) {
    PhysicsObject.apply(this, [game]);
    var shape = new cp.SegmentShape(
            this.game.space.staticBody, 
            cp.v(0, 400), cp.v(500, 400), 0);
    var line = this.game.space.addShape(shape);
    line.setElasticity(0);
    line.setFriction(.7);
    this.shapes.push(shape);
};

Terrain.prototype = Object.create(PhysicsObject.prototype);

module.exports = Terrain;
