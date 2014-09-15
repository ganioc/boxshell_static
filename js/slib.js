// javascript for bs_sch.html manipulation

var teapot = teapot||{};
//store Schematic object, so we can have multiple window in a single page
teapot.window_list = [];

$(window).resize(function(){
    _.map(teapot.window_list,function(c){
	c.resize(window.innerWidth, window.innerHeight);
    });
});

// this is to store options, preference of a certain schematic file, working environment
function Option(){
    var background = {
	"wallet_notebook":"url(/static/images/sch/notebook_texture2459.jpg)",
	"wallet_oldpaper":"url(/static/images/sch/paper_texture_dirt.jpg)",
	"wallet_whitepaper":"url(/static/images/sch/notebook_texture2463.jpg)",
	"wallet_bluepaper":"url(/static/images/sch/paper_blue.gif)",
	"wallet_yellowpaper":"url(/static/images/sch/paper_yellow.jpg)",
	"white":"white",
	"yellow":"yellow",
	"blue":"blue",
	"gray":"gray",
	"green":"green"
    };
    var select_control = "";
    var current_bg = "white";
    var grid_size = 20;
    var current_block = "";
    var current_device_color = "black";

    var set_block_color = function(name){
	$("#"+current_block).css("background",background[name]);
    };
    var set_control_option = function(name){
	teapot.set_select_control(select_control,name);
    };
    var set_control_name = function(name){
	select_control = name;
    };
    
    
    return {
	fun_set_block_color:set_block_color,
	
	get_control_name : function(){
	    return select_control;
	},
	get_bg_value:function(value){
	    return background[value];
	},
	get_current_bg:function(){
	    return current_bg;
	},
	set_current_bg:function(name){
	    current_bg = name;
	    set_block_color(name);
	    set_control_option(name);
	},
	translate_bg:function(name){
	    return background[name];
	},
	init:function(select_name, color, block_name){
	    var temp = $("#" + select_name);
	    set_control_name(select_name);
	    temp.empty();
	    for(var k in background){
		temp.append("<option>" + k + "</option>");
	    }
	    current_bg = color ||'white';
	    current_block = block_name;
	    set_block_color(current_bg);
	}
    };
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
    this.option = {};
}
Schematic.prototype.add_option = function(opt){
    this.option = _.clone(opt);
    return this;
};
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
    // if color is a jpg
    // if(color.slice(0,6) == "wallet"){
    // 	this.DOM.css("background",color);
    // }
    // //else
    // else {
    this.DOM.css("background", color);
    return this;
};

Schematic.prototype.get_bg = function(){
    return this.option.get_bg_value(this.option.get_current_bg());
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
	gallery_height:120,
	commandbar_height:50,
	gallery_class:"gallery",
	commandbar_class:"commandbar",
	cmd_toggle_gallery:"cmd_toggle_gallery",
	toggle_glyphicon_up:"glyphicon glyphicon-chevron-up",
	toggle_glyphicon_down:"glyphicon glyphicon-chevron-down"
    });
    teapot.window_list.push(sch1);

    var temp_option = new Option();
    temp_option.init("select_bg", "wallet_notebook","lib_background");
    sch1.add_option(temp_option);
    sch1.set_bg(sch1.get_bg());



    $(window).resize();
    $("#input_device").val("");

    $("#cmd_setting").hover(
	function(){
	    $(this).children().first().animate({"font-size":'25px'});
	    },
	function(){
	    $(this).children().first().animate({"font-size":"20px"});
	}).click(function(e){
	console.log("click setting");
	// get default color from option
	var temp = sch1.option;
	temp.set_current_bg(temp.get_current_bg());
	$("#setting_dlg").modal("show");
    });

    // console.log("print out control name");
    // console.log(sch1.option.get_control_name());
    
    $("#select_bg").change(function(){
	
    	console.log("changed");
    	console.log(sch1.option.get_control_name());
    	sch1.option.fun_set_block_color(
    	    teapot.get_select_control(sch1.option.get_control_name())	);
	
    });
    $("#option_save").click(function(e){
	e.preventDefault();
	if(true){
	    //save then quit
	    sch1.option.set_current_bg(teapot.get_select_control(sch1.option.get_control_name()));
	    sch1.set_bg(sch1.get_bg());
	    console.log(sch1.get_bg());
	    $("#setting_dlg").modal("hide");
	}
	else{
	    //display error message
	}
    });

});




