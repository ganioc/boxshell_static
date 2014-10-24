// javascript for bs_sch.html manipulation
"use strict";

//this can be wrapped in a single file as a library "u"
(function(a){
    var _root = a;
    var previousU = _root.u;
    
    // this is definition of the root of 'u'
    var u = function(obj){
	if(obj instanceof u)
	    return obj;
	if(!(this instanceof u))
	    return new u(obj);
	this._wrapped = obj;
    };
    // I won't care the module export case here
    _root.u = u;
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

    // Svg handle d3.js data display
    u.Svg = function(){
	var instance;

	var _init = function(opt){
	    var svg_DOM,
		svg_height,
		svg_width,
		svg_margin;

	    
	    svg_DOM = "#"+ opt.name;
	    svg_width = opt.width;
	    svg_height = opt.height;
	    svg_margin = opt.margin || 20;

	    console.log("stop here for a rest");

	    var color_low_end = "#FE2E2E";
	    var color_hi_end = "#AAAA39";
	    var color = d3.scale.linear()
		    .domain([0,5])
		    .range([color_low_end,color_hi_end ])
		    .interpolate(d3.interpolateRgb);

	    var pack = d3.layout.pack()
		    .padding(2)
		    .size([svg_width- svg_margin,svg_height- svg_margin])
		    .value(function(d) { return d.size; });

	    console.log(svg_DOM);
	    var svg = d3.select(svg_DOM)
		    .attr("width",svg_width)
		    .attr("height",svg_height)
		    .append("g")
		    .attr("transform","translate(" + svg_width/2 + "," + svg_height/2 + ")");

	    console.log("can't find the DOM");

	    var svg_root;
	    var focus ,  // this is the original form root
		nodes ,// root is initialized here
		view, 
		circle, 
		text, 
		node;

	    console.log("end of init");

	    var _zoom = function(d){
		var focus0 = focus;
		focus = d;

		var transition = d3.transition()
			.duration(d3.event.altKey?7500:750)
			.tween("zoom", function(d){
			    var i = d3.interpolateZoom(view,[focus.x,focus.y,focus.r*2 + svg_margin]);
			    return function(t){
				_zoomTo( i(t) );
			    };
			});
		transition.selectAll("text")
		    .filter(function(d){ 
			return d.parent === focus || this.style.display === "inline";
		    })
		    .style("fill-opacity",function(d){
			return d.parent === focus? 1: 0;
		    })
		    .each("start", function(d){
			if(d.parent === focus) this.style.display = "inline";
		    })
		    .each("end", function(d){
			if(d.parent !== focus) this.style.display = "none";
		    });
	    };

	    var _zoomTo = function(v){
		var k = svg_width/ v[2];
		view = v;
		node.attr("transform", function(d){
		    return "translate(" + (d.x - v[0]) * k + "," + (d.y-v[1])*k + ")";
		});
		circle.attr("r",function(d){ return d.r*k; });
	    };

	    var _update_data = function(data){
		console.log("enter into _update_data");

		svg_root = _.clone(data);
		focus = svg_root;  // this is the original form root
		nodes = pack.nodes(svg_root);// root is initialized here
	
		circle = svg.selectAll("circle")
		    .data(nodes)
		    .enter().append("circle")
		    .attr("class",function(d){
			return d.parent?d.children?"node":"node node--leaf":"node node--root";
		    })
		    .style("fill",function(d){
			return d.children?color(d.depth):"#FFF5EE";
			//return color(d.depth);
		    })
		    .style("stroke","black")
		    .on("click",function(d){
			if(focus !== d)
			    _zoom(d);
			d3.event.stopPropagation();
		    });

		text = svg.selectAll("text")
 		    .data(nodes)
		    .enter().append("text")
		    .attr("class","label")
		    .style("fill-opacity",function(d){
			return d.parent === svg_root? 1:0;
		    })
		    .style("display", function(d){
			return d.parent === svg_root?null:"none";
		    })
		    .text(function(d) { return d.name; });
		
		node = svg.selectAll("circle, text");

		d3.select("#sym-board")
		    .on("click", function(){ _zoom(svg_root);});

		_zoomTo([svg_root.x, svg_root.y, svg_root.r*2 + svg_margin]);

		d3.select(self.frameElement).style("height", svg_height + "px");
		console.log("out of update_data");
	    };
	    
	    return{
		// interface for graph manipulation
		update_data:_update_data
	    };
	};
	return{
	    init:function(opt,data){
		if(!instance){

		    instance = _init(opt);
		    if(data){
		    	instance.update_data(data);
		    }
		    else
		    	console.log("no data in");
		    console.log("no instance");
		    
		}
		else{
		    console.log("already init Svg");
		    // initialize it
		    
		}
	    },
	    get_instance:function(){
		return instance;
	    }
	};
    }();

})(this);// actually "this" means window

var data_root = {
    "name":"symbol",
    "children":[
	{
	    "name":"abstract_symbol",
	    "children":[
		{"name":"gnd", "size":1200},
		{"name":"power", "size":1200},
		{"name":"offpage", "size":1200},
		{"name":"Resistor", "size":1200},
		{"name":"Capacitor", "size":1200},
		{"name":"Inductor", "size":1200}
	    ]
	},
	{
	    "name":"concrete_symbol",
	    "children":[
		{"name":"inductor", 
		 "children":[
		     {"name":"0201",size:1200},
		     {"name":"0402",size:1200},
		     {"name":"0603",size:1200}
		 ]
		},
		{"name":"capacitor", "size":1200},
		{"name":"resistor", "size":1200},
		{"name":"analog_device", "size":1200}
	    ]
	},
	{
	    "name":"murata_symbol",
	    "children":[
		{"name":"inductor", "size":1200},
		{"name":"capacitor", "size":1200}
	    ]
	}
    ]
};

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
	    u.Svg.init({
	    name:"sym-svg",
	    width:700,
	    height:700}, data_root);
	    //u.Svg.get_instance().update_data();
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
    
    // disable mouse wheel, 
    window.onwheel = function(){ return false; };
    

});










