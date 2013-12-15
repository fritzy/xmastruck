var PhysicsObject = require('./object'),
    FileLoader = require('./loader'),
    paperNames = [
        'wrapFancy',
        'wrapSnowflakes',
        'wrapStripes',
        'wrapTrees',
        'wrapWiggles'
    ],
    paperFileNames = [
        'assets/images/wrapping-fancy.png',
        'assets/images/wrapping-snowflakes.png',
        'assets/images/wrapping-stripes.png',
        'assets/images/wrapping-trees.png',
        'assets/images/wrapping-wiggles.png'
    ],
    paperFiles = new FileLoader(paperFileNames, paperNames, function(){}, function(){});

function Present(game) {
    var minH = 30,
        minW = 40,
        maxH = 150,
        maxW = 200,
        box,
        shape;
    
    this.paperName = paperNames[Math.floor(Math.random() * paperNames.length)];
    this.w = Math.floor(Math.random() * (maxW - minW + 1)) + minW;
    this.h = Math.floor(Math.random() * (maxH - minH + 1)) + minH;
    this.xoff = this.w / -2;
    this.yoff = this.h / -2;

    PhysicsObject.apply(this, arguments);
    box = this.game.space.addBody(new cp.Body(0.5, cp.momentForBox(1, this.w, this.h)));
    box.setPos(cp.v(1000 + this.xoff, 100 + this.yoff));
    shape = this.game.space.addShape(new cp.BoxShape(box, this.w, this.h));

    this.main = box;
    shape.setElasticity(0);
    shape.setFriction(0.2);
    shape.layers = 1;
    this.shapes.push(shape);

    this.render = function(){
        if (!paperFiles.loaded) return;// Still loading...
        var pos = this.shapes[0].body.p,
            ctx = this.game.renderer.ctx;

        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(this.shapes[0].body.a);
        ctx.drawImage(paperFiles.images[this.paperName], this.xoff, this.yoff, this.w, this.h);
        // ctx.rect(this.xoff, this.yoff, this.w, this.h);
        // ctx.fillStyle = ctx.createPattern(paperFiles.images[this.paperName], 'repeat');
        // ctx.fill();
        // ctx.strokeStyle = 'black';
        // ctx.stroke();
        ctx.restore();
    };
}
Present.prototype = Object.create(PhysicsObject.prototype);

module.exports = Present;
