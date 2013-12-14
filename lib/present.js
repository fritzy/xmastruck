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
    var xoff = 0,
        yoff = 0,
        minH = 4,
        minW = 6,
        maxH = 20,
        maxW = 30,
        h = Math.floor(Math.random() * (maxH - minH + 1)) + minH,
        w = Math.floor(Math.random() * (maxW - minW + 1)) + minW,
        box,
        shape;

    PhysicsObject.apply(this, arguments);
    box = this.game.space.addBody(new cp.Body(5, cp.momentForBox(10, 170, 40)));
    box.setPos(cp.v(50 + xoff, 0 + yoff));
    shape = this.game.space.addShape(new cp.BoxShape(box, w, h));

    this.main = box;
    shape.setElasticity(0);
    shape.setFriction(0.7);
    shape.group = 1;
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
            r = Math.floor(Math.random() * wrappingPaper.names.length),
            paperName = wrappingPaper.names[r];

        this.game.renderer.ctx.save();
        this.game.renderer.ctx.translate(pos.x, pos.y);
        this.game.renderer.ctx.drawImage(this.files.images[paperName], 0, 0);
        this.game.renderer.ctx.restore();

        PhysicsObject.prototype.render.apply(this,arguments);
    };
 }).call(Present.prototype);

module.exports = Present;
