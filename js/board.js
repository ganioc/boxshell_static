// javascript for bs_sch.html manipulation
"use strict";

//this can be wrapped in a single file as a library "u"
(function(a){
    var root = a;
    var previousU = root.u;
    
    // this is definition of the root of 'u'
    var u = function(obj){
	if(obj instanceof u)
	    return obj;
	if(!(this instanceof u))
	    return new u(obj);
	this._wrapped = obj;
    };
    // I won't care the module export case here
    root.u = u;
    u.version="1";
    u.readname = "u library";

    
    // Controller is the object for manipulating page switching
    u.Controller = function(){
	var NUM_SECTION = 9;
	var _set_pos = function(name,pos){
		var section = $("#" + name);
		section.removeClass();
		section.addClass(pos);
	};
	var _set_content = function(name,txt){
	    var section = $("#" + name);
	    section.empty();
	    section.append(txt);
	};
	var _POS = {"west-north":0,
		   "north":1,
		   "east-north":2,
		   "west":3,
		   "center":4,
		   "east":5,
		   "west-south":6,
		   "south":7,
		   "east-south":8};
	var _set_default = function(){
	    for(var i=0;i<NUM_SECTION;i++){
		_set_pos("section" + i, _.keys(_POS)[i]);
	    }
	};
	return {
	    set_content:_set_content,
	    POS:_POS,
	    init:function(name){
		_set_default();
	    },
	    show:function(path){
		if(path == "/"){
		    console.log("It should never happen.");
		    _set_default();
		}
		else if(path =="/sch/lib/"){
		    _set_pos("section0","north");
		    _set_pos("section3","center");
		    
		    _set_pos("section4","east");
		}
		else if(path =="/sch/pcb/"){
		    _set_pos("section2","north");
		    _set_pos("section5","center");
		    _set_pos("section4","west");
		}
		else if(path === "/lib/sch/"){
		    _set_pos("section0","west-north");
		    _set_pos("section3","west");
		    
		    _set_pos("section4","center");
		}
		else if(path === "/pcb/sch/"){
		    _set_pos("section2","east-north");
		    _set_pos("section5","east");
		    _set_pos("section4","center");
		}
	    },
	    set_pos:_set_pos};
    }();

    // Ctl is the object for controls, which is some gadgets over the page, you can click with
    u.Ctl = function(){
	
	return{
	    ctl_setting:function(){

	    },
	    set_btn:function(name,opt){
		var o = $("#"+ name);
		o.hover(
		    function(){
			$(this).children().first().animate({"font-size":'25px'});
		    },
		    function(){
			$(this).children().first().animate({"font-size":"20px"});
		    }
		).click(opt.click);
	    }
	};
   }();

})(this);// actually "this" means window


$(document).ready(function() {
    console.log("begin new board function:");
    console.log(u.version);
    console.log(u.readname);

    //init the sections
    u.Controller.init("pages");

    u.Ctl.set_btn("sch-cmd-setting",{
	click:function(){
	    console.log("setting clicked");
	}
    });
    u.Ctl.set_btn("sch-cmd-symbol",{
	click:function(){
	    console.log("symbol clicked");
	    u.Controller.show("/sch/lib/");
	}
    });
    u.Ctl.set_btn("sym-cmd-sch",{
	click:function(){
	    console.log("back to sch clicked");
	    u.Controller.show("/lib/sch/");
	}
    });

    $(window).bind("hashchange", function(){
	console.log(location.hash);
	u.Controller.show(!location.hash?"/":location.hash.replace('#!',''));
    });

    // Wait before enabling transition to not do transition for the first load
    setTimeout(function(){
	$('#pages').addClass('enableTransition');
    }, 500);

    

});










