;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Camera(game) {
    this.game = game;
    this.target = this.game.target || {x: 0, y: 0};
    this.frames = [];
}

(function () {
    this.setTarget = function (target) {
        this.target = target;
    }

    this.releaseTarget = function () {
        this.target = null;
    }

    this.move = function (target) {
         this.setTarget(target);
    }

    this.transform = function() {
        this.game.renderer.ctx.scale(.3,.3);
        this.game.renderer.ctx.translate(this.game.canvas.width/2-this.x+200,this.game.canvas.height/2-this.y+1000);
    }

    this.moveOverTime = function (target, duration) {
        this.scaling = true;
        this.oldTarget = this.target;
        this.target = target;
        this.scaleStartTime = Date.now().valueOf();
        this.scaleDuration = duration;
        this.elapsed = 0;
    }

    this.tick = function (dt) {
        if (this.target) {
            this.x = this.target.x;
            this.y = this.target.y;
            
            if (this.scaling) {
                var progress = (this.scaleStartTime + this.elapsed) / this.duration;
                var currentTarget = this.target;
                
                if (progress >= 1) {
                    this.scaling = false;
                    this.x = currentTarget.x;
                    this.y = currentTarget.y;
                    return false;
                }

                this.x = currentTarget.x + (this.oldTarget.x - currentTarget.x) * progress;
                this.y = currentTarget.y + (this.oldTarget.y - currentTarget.y) * progress;
                this.elapsed += dt;
            }
        }
    }

}).call(Camera.prototype);

module.exports = Camera;

},{}],2:[function(require,module,exports){
var Renderer = require('./render');
var Camera = require('./camera');
var Truck = require('./truck');
var Present = require('./present');
var terrain = require('./terrain');

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
            window.setTimeout(callback, 1000 / 60);
    };
})();

function XmasTruck(canvas) {
    this.canvas = canvas;
    this.camera = new Camera(this);
    this.objects = {};
    this.presents = [];
    this.last_tick = Date.now();
    this.keys = {};

    this.renderer = new Renderer(this.canvas, this);
    this.space = new cp.Space();
    this.space.iterations = 10;
    this.space.gravity = cp.v(0,1000);
    this.objects.truck = new Truck(this);
    for (var p = 0; p < 20; p++) {
        this.presents.push(new Present(this));
    }
    this.terrain = terrain.generate();
    for (var x = 0; x < 6000; x++) {
        this.objects['terrain' + x] = new terrain.Terrain(this, x * 40 - 40, this.terrain[x - 1] * 4 || 0, x * 40, this.terrain[x] * 4);
    }
    document.addEventListener('keydown', function(e) {
        this.keys[e.keyCode] = true;
    }.bind(this));
    document.addEventListener('keyup', function(e) {
        this.keys[e.keyCode] = false;
    }.bind(this));
    this.throttle = 10;

}

(function () {

    this.render = function () {
        var game = this;
        this.renderer.ctx.save();
        this.camera.transform();
        this.presents.forEach(function (p) {
            p.render();
        });
        Object.keys(this.objects).forEach(function (objname) {
            game.objects[objname].render();
        });
        this.renderer.ctx.restore();
    };

    this.tick = function () {
        var now = Date.now();
        var dt = now - this.last_tick || 0;
        this.last_tick = now;
            
        var w1av = this.objects.truck.wheel1.getAngVel();
        var w2av = this.objects.truck.wheel2.getAngVel();
    
        if (this.keys['38']) {
            if (w1av < 0) this.objects.truck.wheel1.setAngVel(0);
            if (w2av < 0) this.objects.truck.wheel2.setAngVel(0);
            if (w1av < 24) {
                this.objects.truck.wheel1.applyImpulse(cp.v(0, -20), cp.v(-this.throttle * dt, 0));
                this.objects.truck.wheel1.applyImpulse(cp.v(0, 20), cp.v(this.throttle * dt, 0));
            }
            if (w2av < 24) {
                this.objects.truck.wheel2.applyImpulse(cp.v(0, -20), cp.v(-this.throttle * dt, 0));
                this.objects.truck.wheel2.applyImpulse(cp.v(0, 20), cp.v(this.throttle * dt, 0));
            }
        } else if (this.keys['40']) {
            if (w1av > 0) this.objects.truck.wheel1.setAngVel(0);
            if (w2av > 0) this.objects.truck.wheel2.setAngVel(0);
            if (w1av > -12 && w2av > -12) {
                this.objects.truck.wheel1.applyImpulse(cp.v(0, -20), cp.v(this.throttle * dt * .3, 0));
                this.objects.truck.wheel1.applyImpulse(cp.v(0, 20), cp.v(-this.throttle * dt * .3, 0));
                this.objects.truck.wheel2.applyImpulse(cp.v(0, -20), cp.v(this.throttle * dt * .3, 0));
                this.objects.truck.wheel2.applyImpulse(cp.v(0, 20), cp.v(-this.throttle * dt * .3, 0));
            }
            //this.objects.truck.motor.rate = 6;
        } else {
            //this.objects.truck.motor.rate = 0;
        }

        this.camera.setTarget(this.objects.truck.shapes[1].body.p);
        this.space.step(dt/1000);
        this.camera.tick(dt);
        this.renderer.render(dt);

        window.requestAnimFrame(this.tick.bind(this));
    };

}).call(XmasTruck.prototype);

window.XmasTruck = XmasTruck;


},{"./camera":1,"./present":6,"./render":7,"./terrain":8,"./truck":9}],3:[function(require,module,exports){

/* new FileLoader
 * args:
 *   paths: Array of http paths to GET files.
 *   names: Array of names to reference each file.
 *   update_cb: function(name, step, total)
 *   finish_cb: function()
 *
 *   this.images[name] = Image()
 *   this.txts[name] = ""
 *   this.jsons[name] = Object()
 */
var FileLoader = function(paths, names, update_cb, finish_cb) {
    this.paths = paths;
    this.names = names;
    this.total = 0;
    this.current = 0;
    this.images = {};
    this.txts = {};
    this.jsons = {};
    this.update_cb = update_cb;
    this.finish_cb = finish_cb;
    this._load_init_images();
    this.loaded = false;
    this.image_cbs = {};
    this.file_cbs = {};
};

(function() {

    this.on_load = function(name) {
        this.current += 1;
        this.update_cb(name, this.current, this.total);
        if(this.current == this.total) {
            this.loaded = true;
            this.finish_cb();
        }
    };

    this.register_image_callback = function(name, cb) {

    };

    this.is_loaded = function(name) {
        return this.images.hasOwnProperty(name);
    };

    this._load_init_images = function() {
        console.log(this);
        var pathidx, ext;
        this.paths.forEach(function(path, idx, paths) {
        //for(pathidx in this.paths) {
            console.log(path);
            ext = path.substring(path.length - 4);
            if(ext == '.png' || ext ==  '.jpg') {
                this.add_image(path, this.names[idx]);
            } else if (ext == 'json') {
                this.add_text(path, this.names[idx], 'application/json');
            } else {
                this.add_text(path, this.names[idx]);
            }
        //}
        }.bind(this));
    };

    this.add_image = function(path, name, cb) {
        console.log("added an image");
        this.total += 1;
        this.images[name] = new Image();
        this.images[name].onload = function() {
            this.on_load(name);
            if(cb !== undefined) {
                cb(name);
            }
        }.bind(this);
        this.images[name].src = path;
    };

    this.add_text = function(path, name, mimetype, cb) {
        console.log("added a text");
        this.total += 1;
        var client = new XMLHttpRequest();
        client.open('GET', path);
        client.onreadystatechange = function() {
            if(client.readyState == 4) {
                if(mimetype == 'application/json') {
                    this.jsons[name] = JSON.parse(client.response);
                } else {
                    this.txts[name] = client.responseText;
                }
                if(cb !== undefined) {
                    cb(name);
                }
                this.on_load(name);
            }
        }.bind(this);
        client.overrideMimeType(mimetype || 'text/plain');
        client.send();
    };

}).call(FileLoader.prototype);

module.exports = FileLoader;

},{}],4:[function(require,module,exports){
function PhysicsObject(game, x, y) {
    this.game = game;
    this.shapes = new Array();
    this.constraints = new Array();
    this.sprite = null;
    this.x = x || 0; 
    this.y = y || 0;
    this.main = null;
};

(function(){
    this.render = function() {
        if (this.main != null) {
            var pos = this.main.getPos();
            this.x = pos.x;
            this.y = pos.y
        }
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
                if(this.constraints[i].draw) {
                    this.constraints[i].draw(this.game.renderer.ctx, 1,
                        function(point) {
                            return v(point.x * this.game.scale, (this.game.height - point.y) * this.game.scale); 
                        });
                }
            }
        } else {
            //draw the sprite(s) here
        }
    }
}).call(PhysicsObject.prototype);

module.exports = PhysicsObject;

},{}],5:[function(require,module,exports){
var thingy = {};
(function(global){
  var module = global.noise = {};

  function Grad(x, y, z) {
    this.x = x; this.y = y; this.z = z;
  }
  
  Grad.prototype.dot2 = function(x, y) {
    return this.x*x + this.y*y;
  };

  Grad.prototype.dot3 = function(x, y, z) {
    return this.x*x + this.y*y + this.z*z;
  };

  var grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
               new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
               new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];

  var p = [151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
  // To remove the need for index wrapping, double the permutation table length
  var perm = new Array(512);
  var gradP = new Array(512);

  // This isn't a very good seeding function, but it works ok. It supports 2^16
  // different seed values. Write something better if you need more seeds.
  module.seed = function(seed) {
    if(seed > 0 && seed < 1) {
      // Scale the seed out
      seed *= 65536;
    }

    seed = Math.floor(seed);
    if(seed < 256) {
      seed |= seed << 8;
    }

    for(var i = 0; i < 256; i++) {
      var v;
      if (i & 1) {
        v = p[i] ^ (seed & 255);
      } else {
        v = p[i] ^ ((seed>>8) & 255);
      }

      perm[i] = perm[i + 256] = v;
      gradP[i] = gradP[i + 256] = grad3[v % 12];
    }
  };

  module.seed(0);

  /*
for(var i=0; i<256; i++) {
perm[i] = perm[i + 256] = p[i];
gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
}*/

  // Skewing and unskewing factors for 2, 3, and 4 dimensions
  var F2 = 0.5*(Math.sqrt(3)-1);
  var G2 = (3-Math.sqrt(3))/6;

  var F3 = 1/3;
  var G3 = 1/6;

  // 2D simplex noise
  module.simplex2 = function(xin, yin) {
    var n0, n1, n2; // Noise contributions from the three corners
    // Skew the input space to determine which simplex cell we're in
    var s = (xin+yin)*F2; // Hairy factor for 2D
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var t = (i+j)*G2;
    var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
    var y0 = yin-j+t;
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if(x0>y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
      i1=1; j1=0;
    } else { // upper triangle, YX order: (0,0)->(0,1)->(1,1)
      i1=0; j1=1;
    }
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6
    var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
    var y2 = y0 - 1 + 2 * G2;
    // Work out the hashed gradient indices of the three simplex corners
    i &= 255;
    j &= 255;
    var gi0 = gradP[i+perm[j]];
    var gi1 = gradP[i+i1+perm[j+j1]];
    var gi2 = gradP[i+1+perm[j+1]];
    // Calculate the contribution from the three corners
    var t0 = 0.5 - x0*x0-y0*y0;
    if(t0<0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot2(x0, y0); // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.5 - x1*x1-y1*y1;
    if(t1<0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot2(x1, y1);
    }
    var t2 = 0.5 - x2*x2-y2*y2;
    if(t2<0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot2(x2, y2);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 70 * (n0 + n1 + n2);
  };

  // 3D simplex noise
  module.simplex3 = function(xin, yin, zin) {
    var n0, n1, n2, n3; // Noise contributions from the four corners

    // Skew the input space to determine which simplex cell we're in
    var s = (xin+yin+zin)*F3; // Hairy factor for 2D
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var k = Math.floor(zin+s);

    var t = (i+j+k)*G3;
    var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
    var y0 = yin-j+t;
    var z0 = zin-k+t;

    // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
    // Determine which simplex we are in.
    var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
    var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
    if(x0 >= y0) {
      if(y0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
      else if(x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
      else { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
    } else {
      if(y0 < z0) { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
      else if(x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
      else { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
    }
    // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
    // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
    // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
    // c = 1/6.
    var x1 = x0 - i1 + G3; // Offsets for second corner
    var y1 = y0 - j1 + G3;
    var z1 = z0 - k1 + G3;

    var x2 = x0 - i2 + 2 * G3; // Offsets for third corner
    var y2 = y0 - j2 + 2 * G3;
    var z2 = z0 - k2 + 2 * G3;

    var x3 = x0 - 1 + 3 * G3; // Offsets for fourth corner
    var y3 = y0 - 1 + 3 * G3;
    var z3 = z0 - 1 + 3 * G3;

    // Work out the hashed gradient indices of the four simplex corners
    i &= 255;
    j &= 255;
    k &= 255;
    var gi0 = gradP[i+ perm[j+ perm[k ]]];
    var gi1 = gradP[i+i1+perm[j+j1+perm[k+k1]]];
    var gi2 = gradP[i+i2+perm[j+j2+perm[k+k2]]];
    var gi3 = gradP[i+ 1+perm[j+ 1+perm[k+ 1]]];

    // Calculate the contribution from the four corners
    var t0 = 0.5 - x0*x0-y0*y0-z0*z0;
    if(t0<0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot3(x0, y0, z0); // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.5 - x1*x1-y1*y1-z1*z1;
    if(t1<0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
    }
    var t2 = 0.5 - x2*x2-y2*y2-z2*z2;
    if(t2<0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
    }
    var t3 = 0.5 - x3*x3-y3*y3-z3*z3;
    if(t3<0) {
      n3 = 0;
    } else {
      t3 *= t3;
      n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 32 * (n0 + n1 + n2 + n3);

  };

  // ##### Perlin noise stuff

  function fade(t) {
    return t*t*t*(t*(t*6-15)+10);
  }

  function lerp(a, b, t) {
    return (1-t)*a + t*b;
  }

  // 2D Perlin Noise
  module.perlin2 = function(x, y) {
    // Find unit grid cell containing point
    var X = Math.floor(x), Y = Math.floor(y);
    // Get relative xy coordinates of point within that cell
    x = x - X; y = y - Y;
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255; Y = Y & 255;

    // Calculate noise contributions from each of the four corners
    var n00 = gradP[X+perm[Y]].dot2(x, y);
    var n01 = gradP[X+perm[Y+1]].dot2(x, y-1);
    var n10 = gradP[X+1+perm[Y]].dot2(x-1, y);
    var n11 = gradP[X+1+perm[Y+1]].dot2(x-1, y-1);

    // Compute the fade curve value for x
    var u = fade(x);

    // Interpolate the four results
    return lerp(
        lerp(n00, n10, u),
        lerp(n01, n11, u),
       fade(y));
  };

  // 3D Perlin Noise
  module.perlin3 = function(x, y, z) {
    // Find unit grid cell containing point
    var X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
    // Get relative xyz coordinates of point within that cell
    x = x - X; y = y - Y; z = z - Z;
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255; Y = Y & 255; Z = Z & 255;

    // Calculate noise contributions from each of the eight corners
    var n000 = gradP[X+ perm[Y+ perm[Z ]]].dot3(x, y, z);
    var n001 = gradP[X+ perm[Y+ perm[Z+1]]].dot3(x, y, z-1);
    var n010 = gradP[X+ perm[Y+1+perm[Z ]]].dot3(x, y-1, z);
    var n011 = gradP[X+ perm[Y+1+perm[Z+1]]].dot3(x, y-1, z-1);
    var n100 = gradP[X+1+perm[Y+ perm[Z ]]].dot3(x-1, y, z);
    var n101 = gradP[X+1+perm[Y+ perm[Z+1]]].dot3(x-1, y, z-1);
    var n110 = gradP[X+1+perm[Y+1+perm[Z ]]].dot3(x-1, y-1, z);
    var n111 = gradP[X+1+perm[Y+1+perm[Z+1]]].dot3(x-1, y-1, z-1);

    // Compute the fade curve value for x, y, z
    var u = fade(x);
    var v = fade(y);
    var w = fade(z);

    // Interpolate
    return lerp(
        lerp(
          lerp(n000, n100, u),
          lerp(n001, n101, u), w),
        lerp(
          lerp(n010, n110, u),
          lerp(n011, n111, u), w),
       v);
  };

})(thingy);

console.log(thingy.noise);

module.exports = thingy.noise;

},{}],6:[function(require,module,exports){
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
    box = this.game.space.addBody(new cp.Body(.1, cp.momentForBox(.1, this.w, this.h)));
    box.setPos(cp.v(1000 + this.xoff, 200 + this.yoff));
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

},{"./loader":3,"./object":4}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
var PhysicsObject = require('./object');
var noise = require('./perlin2');

function generate() {
    var points = [];
    noise.seed(Math.random());
    var y = 0;
    var ly = 400;
    for (var x = 0; x < 30; x++) {
        points.push(400);
    }
    for (var x = 30; x < 6000; x++) {
        points.push(noise.simplex2((x-30)/400, 0)*600 + 400);
        ly = y;
    }
    noise.seed(Math.random());
    for (var x = 30; x < 6000; x++) {
        points[x] += noise.simplex2((x-30)/30, 0)*30;
    }
    return points;
}

function Terrain(game, x1, y1, x2, y2) {
    PhysicsObject.apply(this, [game]);
    var shape = new cp.SegmentShape(
            this.game.space.staticBody, 
            cp.v(x1, y1), cp.v(x2, y2), 0);
    var line = this.game.space.addShape(shape);
    line.setElasticity(0);
    line.setFriction(.7);
    this.shapes.push(shape);
};

Terrain.prototype = Object.create(PhysicsObject.prototype);

module.exports = {
    Terrain: Terrain,
    generate: generate,
};

},{"./object":4,"./perlin2":5}],9:[function(require,module,exports){
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
    
    this.head = this.game.space.addBody(new cp.Body(1, cp.momentForCircle(1, 0, 50, cp.v(0, 0))));
    this.head.setPos(cp.v(300+xoff-center.x, 100+yoff-center.y));
    var shape = this.game.space.addShape(new cp.CircleShape(this.head, 50, cp.v(0,0)));
    shape.group = 1;
    shape.layers = 2;
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
    this.constraints.push(this.game.space.addConstraint(new cp.DampedSpring(chassis, this.head, cp.v(370-center.x, 150-center.y), cp.v(0,0), 1, 500, 20)));

    this.files = new FileLoader(['assets/images/truck-layer-main.png','assets/images/truck-layer-underside.png','assets/images/truck-layer-wheel.png','assets/images/truck-layer-shock.png', 'assets/images/santa-head.png'],['main','underside','wheel','shock', 'head'], function(){},function(){});
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
            pos = this.shapes[6].body.p;
            this.game.renderer.ctx.save();
            this.game.renderer.ctx.translate(pos.x,pos.y);
            this.game.renderer.ctx.rotate(this.shapes[6].body.a);
            this.game.renderer.ctx.drawImage(this.files.images.head,-75,-75);
            this.game.renderer.ctx.restore();

        } else {
            //still loading files
        }
        //PhysicsObject.prototype.render.apply(this,arguments);
    }
 }).call(Truck.prototype);

module.exports = Truck;

},{"./loader":3,"./object":4}]},{},[2])
;