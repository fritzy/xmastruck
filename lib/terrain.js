var PhysicsObject = require('./object');

function Terrain(game, x1, y1, x2, y2) {
    PhysicsObject.apply(this, [game]);
    console.log(x1, y1, x2, y2);
    var shape = new cp.SegmentShape(
            this.game.space.staticBody, 
            cp.v(x1, y1), cp.v(x2, y2), 0);
    var line = this.game.space.addShape(shape);
    line.setElasticity(0);
    line.setFriction(.7);
    this.shapes.push(shape);
};

Terrain.prototype = Object.create(PhysicsObject.prototype);

module.exports = Terrain;
