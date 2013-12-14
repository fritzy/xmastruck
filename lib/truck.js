var PhysicsObject = require('./object');
var FileLoader = require('./loader');

function Truck(game) {
    var center = { x:360, y:246 };
    var xoff = 50;
    var yoff = 200;
    PhysicsObject.apply(this, arguments);
    //wheel 1
    var wheel1  = this.game.space.addBody(new cp.Body(5, cp.momentForCircle(5,0,113,cp.v(0,0))));
    wheel1.setPos(cp.v(180+xoff,380+yoff));
    wheel1.setAngle(0);
    var shape = this.game.space.addShape(new cp.CircleShape(wheel1, 113, cp.v(0,0)));
    shape.setElasticity(0);
    shape.setFriction(10);
    shape.group = 1;
    this.shapes.push(shape);

    var wheel2 = this.game.space.addBody(new cp.Body(5, cp.momentForCircle(5,0,113,cp.v(0,0))));
    wheel2.setPos(cp.v(600+xoff,380+yoff));
    wheel2.setAngle(0);
    var shape = this.game.space.addShape(new cp.CircleShape(wheel2, 113, cp.v(0,0)));
    shape.setElasticity(0);
    shape.setFriction(10);
    shape.group = 1;
    this.shapes.push(shape);

    var chassis = this.game.space.addBody(new cp.Body(5, cp.momentForBox(5, 170, 40)));
    chassis.setPos(cp.v(0+xoff, 0+yoff));
    var bed = [ cp.v(20,160), cp.v(20,320), cp.v(300,320), cp.v(300,80) ];
    var front = [ 315,165, 325,340, 715,325, 720,268, 708,207, 700,188, 440,95, 330,80 ];
    for( var i = 0; i<bed.length-1; i++) {
        var shape = this.game.space.addShape(new cp.SegmentShape(chassis, bed[i], bed[i+1]), 5);
        shape.setElasticity(0);
        shape.setFriction(.7);
        shape.group = 1;
        this.shapes.push(shape);
    }
    var shape = this.game.space.addShape(new cp.PolyShape(chassis, front, cp.v(0,0)));
    shape.setElasticity(0);
    shape.setFriction(0.7);
    this.shapes.push(shape);
    /*var shape = this.game.space.addShape(new cp.BoxShape(chassis, 170, 20, cp.v());
    shape.setElasticity(0);
    shape.setFriction(.7);
    shape.group = 1;
    this.shapes.push(shape);*/
    
    this.main = chassis;

    //this.constraints.push(this.game.space.addConstraint(new cp.GrooveJoint(chassis, wheel1, cp.v(-40, 10), cp.v(-40, 40), cp.v(0,0))));
    //this.constraints.push(this.game.space.addConstraint(new cp.GrooveJoint(chassis, wheel2, cp.v( 60, 10), cp.v( 60, 40), cp.v(0,0))));
    this.constraints.push(this.game.space.addConstraint(new cp.DampedSpring(chassis, wheel1, cp.v(125, 205), cp.v(0,0), 100, 20, 5)));
    this.constraints.push(this.game.space.addConstraint(new cp.DampedSpring(chassis, wheel1, cp.v(315, 250), cp.v(0,0), 100, 20, 5)));
    this.constraints.push(this.game.space.addConstraint(new cp.DampedSpring(chassis, wheel2, cp.v(475, 285), cp.v(0,0), 100, 20, 5)));
    this.constraints.push(this.game.space.addConstraint(new cp.DampedSpring(chassis, wheel2, cp.v(655, 220), cp.v(0,0), 100, 20, 5)));
    this.constraints.push(this.game.space.addConstraint(new cp.SimpleMotor( wheel1, chassis, 1)));

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
            this.game.renderer.ctx.drawImage(this.files.images.main,0,0);
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
        PhysicsObject.prototype.render.apply(this,arguments);
    }
 }).call(Truck.prototype);

module.exports = Truck;
