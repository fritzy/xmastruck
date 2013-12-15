var PhysicsObject = require('./object'),
    FileLoader = require('./loader'),
    wrappingPaper = {
        files: [
            'assets/images/wrapping-fancy.png',
            'assets/images/wrapping-snowflakes.png',
            'assets/images/wrapping-stripes.png',
            'assets/images/wrapping-trees.png',
            'assets/images/wrapping-wiggles.png'
        ],
        names: [
            'wrapFancy',
            'wrapSnowflakes',
            'wrapStripes',
            'wrapTrees',
            'wrapWiggles'
        ]
    };

function Present(game) {
    var minH = 30,
        minW = 40,
        maxH = 150,
        maxW = 200,
        box,
        shape;

    this.h = Math.floor(Math.random() * (maxH - minH + 1)) + minH;
    this.w = Math.floor(Math.random() * (maxW - minW + 1)) + minW;
    this.xoff = this.w / -2;
    this.yoff = this.h / -2;
    this.paperName = wrappingPaper.names[
        Math.floor(Math.random() * wrappingPaper.names.length)];

    PhysicsObject.apply(this, arguments);
    box = this.game.space.addBody(new cp.Body(.1, cp.momentForBox(.1, this.w, this.h)));
    box.setPos(cp.v(1000 + this.xoff, 1000 + this.yoff));
    shape = this.game.space.addShape(new cp.BoxShape(box, this.w, this.h));

    this.main = box;
    shape.setElasticity(0);
    shape.setFriction(0.7);
    shape.layers = 1;
    this.shapes.push(shape);

    this.files = new FileLoader(
        wrappingPaper.files,
        wrappingPaper.names,
        function(){},
        function(){}
    );
    // console.log(this.shapes, this.constraints);
}
Present.prototype = Object.create(PhysicsObject.prototype);

(function(){
    this.render = function(){
        if (!this.files.loaded) return;// Still loading...
        var pos = this.shapes[0].body.p,
            ctx = this.game.renderer.ctx;

        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(this.shapes[0].body.a);
        ctx.rect(this.xoff, this.yoff, this.w, this.h);
        ctx.fillStyle = ctx.createPattern(
            this.files.images[this.paperName], 'repeat'
        );
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.restore();

        // PhysicsObject.prototype.render.apply(this,arguments);
    };
 }).call(Present.prototype);

module.exports = Present;
