var PhysicsObject = require('./object');
var FileLoader = require('./loader');

function Truck(game) {
    var center = { x:360, y:246 };
    this.center = center;
    var xoff = 1000;
    var yoff = 1200;
    PhysicsObject.apply(this, arguments);
    //wheel 1
    var wheel1  = this.game.space.addBody(new cp.Body(2, cp.momentForCircle(5,0,113,cp.v(0,0))));
    wheel1.setPos(cp.v(180+xoff-center.x,380+yoff-center.y));
    wheel1.setAngle(0);
    var shape = this.game.space.addShape(new cp.CircleShape(wheel1, 113, cp.v(0,0)));
    shape.setElasticity(0);
    shape.setFriction(1);
    shape.group = 1;
    shape.layers = 2;
    this.shapes.push(shape);
    this.wheel1 = wheel1;

    var wheel2 = this.game.space.addBody(new cp.Body(2, cp.momentForCircle(5,0,113,cp.v(0,0))));
    wheel2.setPos(cp.v(600+xoff-center.x,380+yoff-center.y));
    wheel2.setAngle(0);
    var shape = this.game.space.addShape(new cp.CircleShape(wheel2, 113, cp.v(0,0)));
    shape.setElasticity(0);
    shape.setFriction(1);
    shape.group = 1;
    shape.layers = 2;
    this.shapes.push(shape);
    this.wheel2 = wheel2;

    var chassis = this.game.space.addBody(new cp.Body(5, cp.momentForBox(5, 720, 300)));
    chassis.setPos(cp.v(0+xoff, 0+yoff));
    var bed = [ [ 20-center.x,160-center.y, 20-center.x,320-center.y, 30-center.x,320-center.y, 30-center.x,160-center.y ],
                [ 20-center.x,320-center.y, 300-center.x,320-center.y, 300-center.x,310-center.y, 20-center.x,310-center.y ],
                [ 300-center.x,320-center.y, 300-center.x,80-center.y, 290-center.x,80-center.y,  290-center.x,320-center.y ] ];
    var front = [ 315-center.x,165-center.y, 325-center.x,340-center.y, 715-center.x,325-center.y, 720-center.x,268-center.y, 708-center.x,207-center.y, 700-center.x,188-center.y, 440-center.x,95-center.y, 330-center.x,80-center.y ];
    for( var i = 0; i<bed.length; i++) {
        var shape = this.game.space.addShape(new cp.PolyShape(chassis, bed[i], cp.v(0,0)));
        shape.setElasticity(0);
        shape.setFriction(.7);
        shape.group = 1;
        this.shapes.push(shape);
    }
    var shape = this.game.space.addShape(new cp.PolyShape(chassis, front, cp.v(0,0)));
    shape.setElasticity(0);
    shape.setFriction(0.7);
    shape.group=1;
    this.shapes.push(shape);
    
    this.main = chassis;

    this.constraints.push(this.game.space.addConstraint(new cp.GrooveJoint(chassis, wheel1, cp.v(180-center.x, 280-center.y), cp.v(180-center.x, 380-center.y), cp.v(0,0))));
    this.constraints.push(this.game.space.addConstraint(new cp.GrooveJoint(chassis, wheel2, cp.v(600-center.x, 280-center.y), cp.v(600-center.x, 380-center.y), cp.v(0,0))));
    this.constraints.push(this.game.space.addConstraint(new cp.DampedSpring(chassis, wheel1, cp.v(180-center.x, 240-center.y), cp.v(0,0), 200, 50, 20)));
    this.constraints.push(this.game.space.addConstraint(new cp.DampedSpring(chassis, wheel2, cp.v(600-center.x, 240-center.y), cp.v(0,0), 200, 50, 20)));
    //this.constraints.push(this.game.space.addConstraint(new cp.DampedSpring(chassis, wheel1, cp.v(125, 205), cp.v(0,0), 100, 20, 5)));
    //this.constraints.push(this.game.space.addConstraint(new cp.DampedSpring(chassis, wheel1, cp.v(315, 250), cp.v(0,0), 100, 20, 5)));
    //this.constraints.push(this.game.space.addConstraint(new cp.DampedSpring(chassis, wheel2, cp.v(475, 285), cp.v(0,0), 100, 20, 5)));
    //this.constraints.push(this.game.space.addConstraint(new cp.DampedSpring(chassis, wheel2, cp.v(655, 220), cp.v(0,0), 100, 20, 5)));

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
            //this.game.renderer.ctx.scale(0.25,0.25);
            this.game.renderer.ctx.rotate(this.shapes[2].body.a);
            this.game.renderer.ctx.drawImage(this.files.images.main,-this.center.x,-this.center.y);
            this.game.renderer.ctx.restore();
            pos = this.shapes[0].body.p;
            this.game.renderer.ctx.save();
            this.game.renderer.ctx.translate(pos.x,pos.y);
            //this.game.renderer.ctx.scale(0.25,0.25);
            this.game.renderer.ctx.rotate(this.shapes[0].body.a);
            this.game.renderer.ctx.drawImage(this.files.images.wheel,-113,-113);
            this.game.renderer.ctx.restore();
            pos = this.shapes[1].body.p;
            this.game.renderer.ctx.save();
            this.game.renderer.ctx.translate(pos.x,pos.y);
            //this.game.renderer.ctx.scale(0.25,0.25);
            this.game.renderer.ctx.rotate(this.shapes[1].body.a);
            this.game.renderer.ctx.drawImage(this.files.images.wheel,-113,-113);
            this.game.renderer.ctx.restore();

        } else {
            //still loading files
        }
        //PhysicsObject.prototype.render.apply(this,arguments);
    }
 }).call(Truck.prototype);

module.exports = Truck;
