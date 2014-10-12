// javascript for bs_sch.html manipulation
"use strict";

var teapot = teapot||{};

var root = {
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

//function add_
var width = 700,
    height = width,
    margin = 20;

var color = d3.scale.linear()
	.domain([0,5])
	.range(["#FA8072", "#F5DEB3"])
	.interpolate(d3.interpolateRgb);

var pack = d3.layout.pack()
	.padding(2)
	.size([width - margin, width - margin])
	.value(function(d) { return d.size; });

var svg = d3.select("svg")
	.attr("width",width)
	.attr("height",height)
	.append("g")
	.attr("transform","translate(" + width/2 + "," + width/2 + ")");

var focus = root,  // this is the original form root
    nodes = pack.nodes(root),// root is initialized here
    view;

var circle = svg.selectAll("circle")
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
		zoom(d);
	    d3.event.stopPropagation();
	});

var text = svg.selectAll("text")
	.data(nodes)
	.enter().append("text")
	.attr("class","label")
	.style("fill-opacity",function(d){
	    return d.parent === root? 1:0;
	})
	.style("display", function(d){
	    return d.parent === root?null:"none";
	})
	.text(function(d) { return d.name; });

var node = svg.selectAll("circle, text");



$(document).ready(function() {
    console.log("begin newlib 2 function");

    d3.select("body")
	.style("background", "#2E8B57")
	.on("click", function(){ zoom(root);});

    zoomTo([root.x, root.y, root.r*2 + margin]);

    d3.select(self.frameElement).style("height", width + "px");

});

function zoom(d){
    var focus0 = focus;
    focus = d;

    var transition = d3.transition()
	    .duration(d3.event.altKey?7500:750)
	    .tween("zoom", function(d){
		var i = d3.interpolateZoom(view,[focus.x,focus.y,focus.r*2 + margin]);
		return function(t){
		    zoomTo( i(t) );
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
}

function zoomTo(v){
    var k = width/ v[2];
    view = v;
    node.attr("transform", function(d){
	return "translate(" + (d.x - v[0]) * k + "," + (d.y-v[1])*k + ")";
    });
    circle.attr("r",function(d){ return d.r*k; });
}


