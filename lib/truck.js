var PhysicsObject = require('./object');
var FileLoader = require('./loader');

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
    this.main = chassis;
    shape.setElasticity(0);
    shape.setFriction(.7);
    shape.group = 1;
    this.shapes.push(shape);

    this.constraints.push(this.game.space.addConstraint(new cp.GrooveJoint(chassis, wheel1, cp.v(-40, 10), cp.v(-40, 20), cp.v(0,0))));
    this.constraints.push(this.game.space.addConstraint(new cp.GrooveJoint(chassis, wheel2, cp.v( 40, 10), cp.v( 40, 20), cp.v(0,0))));
    this.constraints.push(this.game.space.addConstraint(new cp.DampedSpring(chassis, wheel1, cp.v(-40, -10), cp.v(0,0), 100, 10, 10)));
    this.constraints.push(this.game.space.addConstraint(new cp.DampedSpring(chassis, wheel2, cp.v( 40, -10), cp.v(0,0), 100, 10, 10)));

    this.files = new FileLoader(['assets/images/truck-layer-main.png','assets/images/truck-layer-underside.png','assets/images/truck-layer-wheel.png','assets/images/truck-layer-shock.png'],['main','underside','wheel','shock'], function(){},function(){});
    console.log(this.shapes,this.constraints);
};
Truck.prototype = Object.create(PhysicsObject.prototype);

(function(){
    this.render = function(){
        if(this.files.loaded) {
            var pos = this.shapes[2].body.p;
            this.game.renderer.ctx.save();
            this.game.renderer.ctx.translate(pos.x,pos.y);
            this.game.renderer.ctx.scale(0.25,0.25);
            this.game.renderer.ctx.rotate(this.shapes[2].body.a);
            this.game.renderer.ctx.drawImage(this.files.images.main,-360,-200);
            this.game.renderer.ctx.restore();
            pos = this.shapes[0].body.p;
            this.game.renderer.ctx.save();
            this.game.renderer.ctx.translate(pos.x,pos.y);
            this.game.renderer.ctx.scale(0.25,0.25);
            this.game.renderer.ctx.rotate(this.shapes[0].body.a);
            this.game.renderer.ctx.drawImage(this.files.images.wheel,-113,-113);
            this.game.renderer.ctx.restore();
            pos = this.shapes[1].body.p;
            this.game.renderer.ctx.save();
            this.game.renderer.ctx.translate(pos.x,pos.y);
            this.game.renderer.ctx.scale(0.25,0.25);
            this.game.renderer.ctx.rotate(this.shapes[1].body.a);
            this.game.renderer.ctx.drawImage(this.files.images.wheel,-113,-113);
            this.game.renderer.ctx.restore();

        } else {
            //still loading files
        }
        PhysicsObject.prototype.render.apply(this,arguments);
    }
 }).call(Truck.prototype);

module.exports = Truck;
