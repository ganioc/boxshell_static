// javascript for bs_sch.html manipulation

var teapot = teapot||{};
//store Schematic object, so we can have multiple window in a single page
teapot.window_list = [];

$(window).resize(function(){
    _.map(teapot.window_list,function(c){
	c.resize(window.innerWidth, window.innerHeight);
    });
});

function Schematic(canvas_name, file_name){
    this.canvas = canvas_name;
    this.DOM = $("#" + this.canvas);
    this.ctx = this.DOM.get(0).getContext("2d");
    // obj.width = obj.ctx.canvas.width;
    // obj.height = obj.ctx.canvas.height;
    this.file = file_name || "";

    this.init();
}

Schematic.prototype.init = function(){
    console.log(this.canvas + " init");
};

Schematic.prototype.resize = function(w,h){
    this.DOM.attr("width", w);
    this.DOM.attr("height", h);
    $("div .gallery").css("top", ( h - 100 ) + "px");
};
Schematic.prototype.set_bg = function(color){
    this.DOM.css("background", color);
};

function Preference(){


}
function Plate(){
    

}

function Panel(){

}

$(document).ready(function() {
    console.log("begin schematic function");
    //console.log(document.URL);
    
    var sch1 = new Schematic("canvas1");
    teapot.window_list.push(sch1);
    sch1.set_bg("white");

    $(window).resize();

});




