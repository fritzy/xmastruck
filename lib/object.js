function PhysicsObject(game) {
    this.game = game;
    this.shapes = new Array();
    this.constraints = new Array();
    this.sprite = null;
};

(function(){
    this.render = function() {
        if(this.sprite == null) {
            //debug draw
            for(i=0; i<this.shapes.length; i++) {
                this.game.renderer.ctx.fillStyle = this.shapes[i].style();
                this.shapes[i].draw(this.game.renderer.ctx, 1, 
                    function(point) { 
                        return v(point.x * this.game.scale, (this.game.height - point.y) * this.game.scale); 
                    });
            }
            for(i=0; i<this.constraints.length; i++) {
                this.constraints[i].draw(this.game.renderer.ctx, 1,
                    function(point) {
                        return v(point.x * this.game.scale, (this.game.height - point.y) * this.game.scale); 
                    });
            }
        } else {
            //draw the sprite(s) here
        }
    }
}).call(PhysicsObject.prototype);

module.exports = PhysicsObject;
