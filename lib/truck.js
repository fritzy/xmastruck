var PhysicsObject = require('./object');
function Truck(game) {
    PhysicsObject.apply(this, arguments);
    //wheel 1
    var wheel1  = this.game.space.addBody(new cp.Body(1, cp.momentForCircle(1,0,15,cp.v(0,0))));
    wheel1.setPos(cp.v(20,50));
    wheel1.setAngle(0);
    var shape = this.game.space.addShape(new cp.CircleShape(wheel1, 15, cp.v(0,0)));
    shape.setElasticity(0);
    shape.setFriction(1);
    shape.group = 1;
    this.shapes.push(shape);

    var wheel2 = this.game.space.addBody(new cp.Body(1, cp.momentForCircle(1,0,15,cp.v(0,0))));
    wheel2.setPos(cp.v(80,50));
    wheel2.setAngle(0);
    var shape = this.game.space.addShape(new cp.CircleShape(wheel2, 15, cp.v(0,0)));
    shape.setElasticity(0);
    shape.setFriction(1);
    shape.group = 1;
    this.shapes.push(shape);

    var chassis = this.game.space.addBody(new cp.Body(5, cp.momentForBox(10, 130, 30)));
    chassis.setPos(cp.v(50, 0));
    var shape = this.game.space.addShape(new cp.BoxShape(chassis, 130, 30));
    shape.setElasticity(0);
    shape.setFriction(.7);
    shape.group = 1;
    this.shapes.push(shape);

    this.constraints.push(this.game.space.addConstraint(new cp.GrooveJoint(chassis, wheel1, cp.v(-40, 10), cp.v(-40, 20), cp.v(0,0))));
    this.constraints.push(this.game.space.addConstraint(new cp.GrooveJoint(chassis, wheel2, cp.v( 40, 10), cp.v( 40, 20), cp.v(0,0))));
    this.constraints.push(this.game.space.addConstraint(new cp.DampedSpring(chassis, wheel1, cp.v(-40, -10), cp.v(0,0), 100, 10, 10)));
    this.constraints.push(this.game.space.addConstraint(new cp.DampedSpring(chassis, wheel2, cp.v( 40, -10), cp.v(0,0), 100, 10, 10)));
    console.log(this.shapes, this.constraints);
};
Truck.prototype = Object.create(PhysicsObject.prototype);

module.exports = Truck;
