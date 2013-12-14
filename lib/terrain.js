var PhysicsObject = require('./object');

function Terrain(game, x1, y1, x2, y2) {
    PhysicsObject.apply(this, [game]);
    var line = this.game.space.addShape(
        new cp.SegmentShape(
            this.game.space.staticBody, 
            cp.v(0, 400), cp.v(500, 400), 0)
    );
    line.setElasticity(0);
    line.setFriction(.7);
};

Terrain.prototype = Object.create(PhysicsObject.prototype);

module.exports = Terrain;
