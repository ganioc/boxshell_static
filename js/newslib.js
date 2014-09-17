// javascript for bs_sch.html manipulation

var teapot = teapot||{};

$(document).ready(function() {
    console.log("begin new lib function");
    //console.log(document.URL);

    // hide the scrollbar on windows
    $('body').css("overflow","hidden");

    $(window).resize(function(){
	$("#frame_block").css("width",window.innerWidth)
	.css("height",window.innerHeight);
	$("#svg_root").attr("width",window.innerWidth + "px")
	.attr("height", window.innerHeight + "px");

    });
    $(window).resize();
    var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    var data =[
	{
	    "State": "ND",
	    "Total": 641481,
	    "Under 5 Years": 0.065,
	    "5 to 13 Years": 0.105,
	    "14 to 17 Years": 0.053,
	    "18 to 24 Years": 0.129,
	    "16 Years and Over": 0.804,
	    "18 Years and Over": 0.777,
	    "15 to 44 Years": 0.410,
	    "45 to 64 Years": 0.260,
	    "65 Years and Over": 0.147,
	    "85 Years and Over": 0.028
	},
	{
	    "State": "ST",
	    "Total": 641481,
	    "Under 5 Years": 0.165,
	    "5 to 13 Years": 0.1105,
	    "14 to 17 Years": 0.053,
	    "18 to 24 Years": 0.129,
	    "16 Years and Over": 0.804,
	    "18 Years and Over": 0.777,
	    "15 to 44 Years": 0.410,
	    "45 to 64 Years": 0.260,
	    "65 Years and Over": 0.147,
	    "85 Years and Over": 0.028
	},
	{
	    "State": "WASH",
	    "Total": 641481,
	    "Under 5 Years": 0.05,
	    "5 to 13 Years": 0.15,
	    "14 to 17 Years": 0.053,
	    "18 to 24 Years": 0.129,
	    "16 Years and Over": 0.804,
	    "18 Years and Over": 0.777,
	    "15 to 44 Years": 0.410,
	    "45 to 64 Years": 0.260,
	    "65 Years and Over": 0.147,
	    "85 Years and Over": 0.028
	}

    ];
    var margin = {top: 20, right: 40, bottom: 10, left: 40},
    width = 960,
    height = 250 - margin.top - margin.bottom;

    var format = d3.format(".1%"),
	states,
	age;

    var x= d3.scale.linear()
    .range([0, width]);
    var y= d3.scale.ordinal()
    .rangeRoundBands([0,height], .1);

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top")
    .tickSize(-height - margin.bottom)
    .tickFormat(format);

    var svg = d3.select("svg")
    .attr("width" , width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left", -margin.left + "px")
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    svg.append("g").attr("class","x axis");
    svg.append("g").attr("class","y axis")
    .append("line")
    .attr("class", "domain")
    .attr("y2", height);

    var menu = d3.select("#menu select")
    .on("change", change);
    
    
    
    function change(){


    }
    

    function type(d){
	d.value = +d.value;
	return d;
    }

});




