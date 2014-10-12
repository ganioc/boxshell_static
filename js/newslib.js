// javascript for bs_sch.html manipulation
"use strict";

var teapot = teapot||{};
var width,height;



$(document).ready(function() {
    console.log("begin new lib function");
    //console.log(document.URL);
    width = window.innerWidth;
    height = window.innerHeight;

    // hide the scrollbar on windows
    $('body').css("overflow","hidden");

    $(window).resize(
	resize_cb
    );


    

    var fill = d3.scale.category20();

    // var nodes = d3.range(10).map(function(i) {
    // 	return {index: i};
    // });

    var datum = {
	"nodes":[
	    {"x": 469, "y": 410},
	    {"x": 493, "y": 364},
	    {"x": 442, "y": 365},
	    {"x": 467, "y": 314},
	    {"x": 477, "y": 248},
	    {"x": 425, "y": 207},
	    {"x": 402, "y": 155},
	    {"x": 369, "y": 196},
	    {"x": 350, "y": 148},
	    {"x": 539, "y": 222},
	    {"x": 594, "y": 235},
	    {"x": 582, "y": 185},
	    {"x": 633, "y": 200},
	    {"x": 633, "y": 200}
	],
	"links":[
	    {"source":  0, "target":  1},
	    {"source":  1, "target":  2},
	    {"source":  2, "target":  0},
	    {"source":  1, "target":  3},
	    {"source":  3, "target":  2},
	    {"source":  3, "target":  4},
	    {"source":  4, "target":  5},
	    {"source":  5, "target":  6},
	    {"source":  5, "target":  7},
	    {"source":  6, "target":  7},
	    {"source":  6, "target":  8},
	    {"source":  7, "target":  8},
	    {"source":  9, "target":  4},
	    {"source":  9, "target": 11},
	    {"source":  9, "target": 10},
	    {"source": 10, "target": 11},
	    {"source": 11, "target": 12},
	    {"source": 12, "target": 10}
	]
    };

    // var nodes = [
    // 	{'name':"root"},
    // 	{'name':"gnd"},
    // 	{'name':"power"},
    // 	{'name':"resistor"}
    // ];

    var force = d3.layout.force()
	    .size([width, height])
            .charge(-400)
	    .linkDistance(40)
            .gravity(0.1)
	    .on("tick", tick);

    var drag = force.drag()
            .on("dragstart",dragstart);

    var svg = d3.select("svg")
	    .attr("width", width)
	    .attr("height", height);

    var link = svg.selectAll(".link"),
	node = svg.selectAll(".node");

    force.nodes(datum.nodes)
	.links(datum.links)
	.start();

    link = link.data(datum.links)
        .enter().append("line")
        .attr("class","link");

    node = node.data(datum.nodes)
	.enter().append("circle")
	.attr("class","node")
	.attr("r",10)
	.on("dblclick",dblclick)
	.call(drag);

    
    // var node = svg.selectAll(".node")
    // 	    .data(nodes)
    // 	    .enter().append("circle")
    // 	    .attr("class", "node")
    // 	    .attr("cx", function(d) { return d.x; })
    // 	    .attr("cy", function(d) { return d.y; })
    // 	    .attr("r", 20)
    // 	    .style("fill", function(d, i) { return fill(i); })
    // 	    .style("stroke", function(d, i) { return d3.rgb(fill(i)).darker(2); })
    // 	    .call(force.drag)
    // 	    .on("mousedown", function() { d3.event.stopPropagation(); });
    

    svg.style("opacity", 1e-6)
	.transition()
	.duration(2000)
	.style("opacity", 1);


    $(window).resize();

    function tick(e) {

	// Push different nodes in different directions for clustering.
	// var k = 5 * e.alpha;
	// nodes.forEach(function(o, i) {
	//     //o.y += i & 1 ? k : -k;
	//     o.x += i & 2 ? k : -k;
	// });

	// node.attr("cx", function(d) { return d.x; })
	//     .attr("cy", function(d) { return d.y; });
	link.attr("x1",function(d){ return d.source.x;})
	    .attr("y1",function(d){ return d.source.y;})
	    .attr("x2",function(d){ return d.target.x;})
	    .attr("y2",function(d){ return d.target.y;});
	node.attr("cx", function(d){ return d.x; })
	    .attr("cy", function(d){ return d.y; });
    }

    function dblclick(d) {
	d3.select(this).classed("fixed", d.fixed = false);
    }

    function dragstart(d) {
	//d3.select(this).classed("fixed", d.fixed = true);
    }

    function mousedown() {
	force.size([width, height]);
	svg.attr("width", width)
	    .attr("height", height);

	// nodes.forEach(function(o, i) {
	//     o.x += (Math.random() - .5) * 40;
	//     o.y += (Math.random() - .5) * 40;
	// });
	force.resume();
    }   

    function resize_cb(){
	width = window.innerWidth;
	height = window.innerHeight;

	$("#frame_block").css("width",window.innerWidth)
	.css("height",window.innerHeight);

	$("#svg_root").attr("width",window.innerWidth + "px")
	.attr("height", window.innerHeight + "px");

	mousedown();

    }
});













