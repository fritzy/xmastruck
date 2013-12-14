function Renderer(canvas, game) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.game = game;
}

(function () {

    this.render = function (dt) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.game.render();
    };

}).call(Renderer.prototype);

module.exports = Renderer;
