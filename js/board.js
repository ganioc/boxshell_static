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
	    section.addClass('current').siblings().removeClass("current");
	    //return undefined;
	};
	return {
	    init:function(){},
	    show:function(path){
		if(path == "/")
		    scene("menu");
		else if(path =="/game/")
		    scene("game");
		else if(path === "/help/")
		    scene("help");
	    }
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

    $(window).bind("hashchange", function(){
	console.log(location.hash);
	u.Controller.show(!location.hash?"/":location.hash.replace('#!',''));
    });

    // Wait before enabling transition to not do transition for the first load
    setTimeout(function(){
	$('#pages').addClass('enableTransition');
    }, 500);
    u.Controller.show("/");

});













