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

	    console.log("into Svg _init()");

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

	    var svg_root,orig_focus;
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
			//.duration(d3.event.altKey?7500:750)
		        .duration(750)
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
		orig_focus = _.clone(data);
		focus = svg_root;  // this is the original form root
		nodes = pack.nodes(svg_root);// root is initialized here
		console.log("read nodes");
		console.log(nodes);
	
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
		    })
		    .on("mouseover", function(d){
			var nodeSelection = d3.select(this).style({opacity:"0.5"});
			//nodeSelection.select("text").style({opacity:"1.0"});

		    })
		    .on("mouseout", function(d){
			var nodeSelection = d3.select(this).style({opacity:"1"});
		    })
		    .on("dblclick", function(d){
			console.log("in svg dbl click");
			console.log(d);
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
	    var _get_orig_data=function(){
		return orig_focus;
	    };
	    var _get_object_from_name = function(name){
		return _.find(nodes,function(c){
		    return c.name === name;
		});
	    };

	    return{
		// interface for graph manipulation
		update_data:_update_data,
		get_orig_data: _get_orig_data,
		zoom_to_name:function(name){
		    var d = _get_object_from_name(name);
		    if(d){
			console.log(d);
			_zoom(d);
		    }
		
		}
	    };
	};
	    
	return{
	    init:function(opt,data){
		if(!instance){
		    console.log("no instance");
		    instance = _init(opt);
		    if(data){
		    	instance.update_data(data);
		    }
		    else
		    	console.log("no data in");
		}
		else{
		    console.log("already init Svg");
		    // initialize it
		}
	    },
	    get_instance:function(){
		console.log("try to retrieve isntance");
		return instance;
	    }
	};
    }();

    u.Util = function(){
	var _is_object= function(ob){
	    return typeof(ob) === "object";
	};
	// array is object
	var _is_array = function(ob){
	    return Object.prototype.toString.call(ob) === '[object Array]';
	};
	var _is_string = function(ob){
	    return typeof(ob) === "string";
	};
	return{
	    adjacent_keys:function(ob){
		// if ob is an object
		if(!_is_array(ob) && _is_object(ob)){
		    return Object.keys(ob);
		}
	    },
	    is_object:_is_object,
	    is_array:_is_array,
	    is_string:_is_string
	};
    }();
    // typeahead for search input box
    u.Symfind = function(){
	var dataset = [],
	    engine,
	    box_name;
	var dataset_add = function(name){
	    dataset.push({val:name});
	};
	var dataset_clear = function(){ dataset = [];};
	var dataset_update = function(node){
	    var key_lst = u.Util.adjacent_keys(node);
	    _.map(key_lst,function(d){
		if( d === "name") 
		    dataset_add(node[d]);
		else if (d === "children"){
		    _.map(node[d],function(c){
			dataset_update(c);
		    });
		}
	    });
	};
	var _get_engine = function(){return engine;};
	var _init = function(input_name,data){
	    console.log("into symfind init()");
	    // get all names from data , store it in dataset
	    //console.log(data);
	    box_name = input_name;
	    dataset_clear();
	    dataset_update(data);
	    console.log(dataset);

	    engine = new Bloodhound({
		name:"symbols",
		local:dataset,
		//remote:null,
		datumTokenizer:
		Bloodhound.tokenizers.obj.whitespace("val"),
		queryTokenizer: 
		Bloodhound.tokenizers.whitespace
	    });
	    var promise = engine.initialize();
	    promise
	    .done(function(){console.log("success bloodhound");
			     console.log(engine.ttAdapter());
			    })
	    .fail(function(){console.log("fail bloodhound");
			    });

	    $("#" + input_name).typeahead(
		{
		    hint:true,
		    minLength:1,
		    highlight:true
		},
		{
		    displayKey:"val",
		    source:u.Symfind.get_engine().ttAdapter()
		}
	    );
	    console.log("end of symfind init");
	};
	var _clear = function(){};
	var _get_content = function(){
	    return $("#" + box_name).typeahead("val");
	};
	return{
	    init:_init,
	    clear:_clear,
	    get_engine:_get_engine,
	    get_content:_get_content
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

	    //u.Svg.get_instance().update_data();
	}
    });
    u.Ctl.set_btn("sym-cmd-sch",{
	click:function(){
	    console.log("back to sch clicked");
	    u.Controller.show("/lib/sch/");
	}
    });

    // init Svg display
    u.Svg.init({
	name:"sym-svg",
	width:700,
	height:700}, data_root);
    // initialize typeahead content
    u.Symfind.init("sym-search-txt",u.Svg.get_instance().get_orig_data());
    
    $("#sym-search-btn").click(
	function(e){
	    e.preventDefault();
	    console.log("find clicked");
	    console.log(u.Symfind.get_content());
	    // need to update u.Svg graph
	    var name = u.Symfind.get_content();
	    if(name){
		u.Svg.get_instance().zoom_to_name(name);
	    }
	}
    );



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










