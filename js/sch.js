// javascript for bs_sch.html manipulation

var teapot = teapot||{};
//store Schematic object, so we can have multiple window in a single page
teapot.window_list = [];

$(window).resize(function(){
    _.map(teapot.window_list,function(c){
	c.resize(window.innerWidth, window.innerHeight);
    });
});

function Commandbar(cmd_toggle_name){
    this.toggle_name = cmd_toggle_name;

}

function Schematic(info){
    this.canvas = info.canvas_name;
    this.DOM = $("#" + this.canvas);
    this.ctx = this.DOM.get(0).getContext("2d");
    // obj.width = obj.ctx.canvas.width;
    // obj.height = obj.ctx.canvas.height;
    this.file = info.file_name || "";
    
    this.gallery_height = info.gallery_height;
    this.commandbar_height = info.commandbar_height;
    this.gallery_class =  info.gallery_class;
    this.commandbar_class = info.commandbar_class;
    this.init(info);

    this.info = info;
}

Schematic.prototype.init = function(info){

    console.log(this.canvas + " init");
    var that = this;

    $("#" + info.cmd_toggle_gallery).click(function(e){
	e.preventDefault();
	console.log("toggle gallery");
	var temp = $("#"+ info.cmd_toggle_gallery 
		     + " span");
	// if it's up then down
	if( !that.gallery_on()){
	    that.show_gallery();
	    temp.removeClass(info.toggle_glyphicon_up);
	    temp.addClass(info.toggle_glyphicon_down);
	}// if it's down
	else {
	    that.hide_gallery();
	    temp.removeClass(info.toggle_glyphicon_down);
	    temp.addClass(info.toggle_glyphicon_up);
	}
    });
};
Schematic.prototype.hide_gallery = function(){
    // slide gallery down
    $("." + this.gallery_class).animate({top:window.innerHeight});
    // move commandbar down
    $("." + this.commandbar_class).animate({top:window.innerHeight - this.commandbar_height});
};
Schematic.prototype.show_gallery = function(){
    // slide gallery up
    $("." + this.gallery_class).animate({top:(window.innerHeight - this.gallery_height)});
    // move commandbar up
        $("." + this.commandbar_class).animate({top:window.innerHeight - this.commandbar_height - this.gallery_height});
};
Schematic.prototype.gallery_on = function(){
    var temp = $("#"+ this.info.cmd_toggle_gallery 
		     + " span");
    if( temp.hasClass(this.info.toggle_glyphicon_up)){
	return false;
    }
    else
	return true;
};
Schematic.prototype.resize = function(w,h){
    this.DOM.attr("width", w);
    this.DOM.attr("height", h);
    if( this.gallery_on()){
	$("div .gallery").css("top", ( h - this.gallery_height ) + "px");
	$("div .commandbar").css("top", ( h- this.gallery_height - this.commandbar_height) + "px");
    }
    else{
	$("div .gallery").css("top", h + "px");
	$("div .commandbar").css("top", ( h- this.commandbar_height) + "px");
    }
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

    // hide the scrollbar on windows
    $('body').css("overflow","hidden");
    
    var sch1 = new Schematic({
	canvas_name:"canvas1",
	gallery_height:100,
	commandbar_height:30,
	gallery_class:"gallery",
	commandbar_class:"commandbar",
	cmd_toggle_gallery:"cmd_toggle_gallery",
	toggle_glyphicon_up:"glyphicon glyphicon-chevron-up",
	toggle_glyphicon_down:"glyphicon glyphicon-chevron-down"
    });
    teapot.window_list.push(sch1);
    sch1.set_bg("white");

    $(window).resize();

});




