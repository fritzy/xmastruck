
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
