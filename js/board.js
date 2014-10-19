// javascript for bs_sch.html manipulation
"use strict";

var teapot = teapot||{};
teapot.name = "teapot";

var width,height;

//this can be wrapped in a single file as a library "u"
(function(a){
    var root = a;
    var previousU = root.u;

    var u = function(obj){
	if(obj instanceof u) return obj;
	if(!(this instanceof u)) return new u(obj);
	this._wrapped = obj;// Why like this?
    };

    // I won't care the module export case here
    root.u = u;
    
    u.version="1";
    u.readname = "u library";

    u.Controller = function(){
	var scene = function(name){
	    var section = $("#" + name);
	    section.addClass('center').siblings().removeClass("center");
	    //return undefined;
	};
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

	return {
	    set_content:_set_content,
	    POS:_POS,
	    init:function(name){
		var obj = $("#"+name);
		var sectionList=[
		    '<section class='+ '\"west-north\">' + '</section>',
		    '<section class='+ '\"north\">' + '</section>',
		    '<section class='+ '\"east-north\">' + '</section>',
		    '<section class='+ '\"west\">' + '</section>',
		    '<section class='+ '\"center\">' + '</section>',
		    '<section class='+ '\"east\">' + '</section>',
		    '<section class='+ '\"west-south\">' + '</section>',
		    '<section class='+ '\"south\">' + '</section>',
		    '<section class='+ '\"east-south\">' + '</section>'
		];

		for(var i=0;i<9;i++){
		    var e=$(sectionList[i]);
		    e.attr("id","section"+ i);
		    obj.append(e);
		}
		for(i=0;i<9;i++){
		    var div = $("#s" + i);
		    if(div.html()){
			_set_content("section" + i, div.html());
			div.empty();
		    }
		}
	    },
	    show:function(path){
		if(path == "/")
		    console.log("It should never happen.");
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
	    set_pos:_set_pos
	};
    }();
})(this);// actually "this" means window


$(document).ready(function() {
    console.log("begin new board function");
    //console.log(document.URL);
    width = window.innerWidth;
    height = window.innerHeight;
    console.log(u.version);
    console.log(u.readname);


    u.Controller.init("pages");//init the sections

    $(window).bind("hashchange", function(){
	console.log(location.hash);
	u.Controller.show(!location.hash?"/":location.hash.replace('#!',''));
    });

    // Wait before enabling transition to not do transition for the first load
    setTimeout(function(){
	$('#pages').addClass('enableTransition');
    }, 500);
    //u.Controller.show("/");

    // u.Controller.set_pos("sch-editor","center");
    // u.Controller.set_pos("symbol-lib", "west");
    // u.Controller.set_pos("symbol-editor","east");

    console.log("hello");


});










