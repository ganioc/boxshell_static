var peach;
var LOG_DEBUG = true;

if (!peach) {
    peach = {};
} else if ( typeof peach != "object") {
    throw new Error("peach already exists and it is not an object.");
}

if (!peach.smith5) {
    peach.smith5 = {};
} else if ( typeof peach.smith5 != "object") {
    throw new Error("peach.smith5 already exists and it is not an object.");
}

if (peach.smith5.graph) {
    throw new Error("peach.smith5.graph already exists.");
}

if (peach.smith5.data) {
    throw new Error("peach.smith5.data already exists.");
}

if (peach.smith5.state){
    throw new Error("peach.smith5.state already exists.");
}

if (peach.smith5.storage){
    throw new Error("peach.smith5.storage already exists.");
}

var logout = function(string) {
    if (LOG_DEBUG == true)
        console.log(string);
};
/*
 * peach.smith5.graph is for canvas manipulation
 */
peach.smith5.graph = {
    name : "mycanvas",
    bSquare : true,
    dimension : "2d",
    canvas : "",
    context : "",
    width : "",
    width_half : "",
    height : "",
    centerX : "",
    centerY : "",
    line_color : "green",
    admittance_line_color :"dimgray",
    bkground_color : "black",
    line_width : 1,
    mark_width : 2,
    matching_line_width : 1,
    mark_color : "red",
    bkground_color: "#000000",
    matching_data_color: "blue",
    matching_line_color : "yellow",
    matching_trace_width:1,
    matching_trace_color: "white",
    mark_radius :3,
    scale : 1,
    max_scale : 3,
    min_scale : 0.2,
    r:0,//this is the radius of smith chart circle
    //mouse states
    mouse_drag : false,
    mouse_drag_origin_x : 0,
    mouse_drag_origin_y : 0,
    chart_origin_x : 0,
    chart_origin_y : 0,
    //fucntions
    init : function() {
        //logout("begin graph init.");
        this.canvas = document.getElementById(this.name);
        this.context = this.canvas.getContext(this.dimension);
        this.width = this.canvas.width;
        this.width_half = 0.9 * this.width / 2;
        if (this.bSquare != true) {
            this.height = this.canvas.height;
        } else
            this.height = this.width;

        this.centerX = this.width / 2;
        this.centerY = this.height / 2;

        this.scale = 1.0;
	this.r = this.scale*this.width_half;

        $(document)[0].oncontextmenu = function() {
            return false;
        };

        if (this.canvas.addEventListener) {
            // IE9, Chrome, Safari, Opera
            this.canvas.addEventListener("mousewheel", this.MouseWheelHandler, false);
            // Firefox
            this.canvas.addEventListener("DOMMouseScroll", this.MouseWheelHandler, false);
        }
        else{ // IE 6/7/8
            this.canvas.attachEvent("onmousewheel", this.MouseWheelHandler);
	}
	
	this.canvas.addEventListener("touchstart",touch_func,false);
	this.canvas.addEventListener("touchmove",touch_func,false);
	this.canvas.addEventListener("touchend",touch_func,false);
	this.canvas.addEventListener("touchcancel",touch_func,false);

	$("#" + this.name).mouseout(function () {
	    $("#status >div:nth-child(2)>div:nth-child(2)").html(0);
	    $("#status >div:nth-child(3)>div:nth-child(2)").html(0);
	    $("#status >div:nth-child(4)>div:nth-child(2)").html(0);
	    $("#status >div:nth-child(5)>div:nth-child(2)").html(0);
	    $("#status >div:nth-child(6)>div:nth-child(2)").html(0);
	    $("#status >div:nth-child(7)>div:nth-child(2)").html(0);
	    $("#status >div:nth-child(8)>div:nth-child(2)").html(0);
	    $("#status >div:nth-child(9)>div:nth-child(2)").html(0);
	    $("#status >div:nth-child(10)>div:nth-child(2)").html(0);
	});

	

        $("#" + this.name).mousedown(function(e) {
            switch(s_state.state) {
            case s_state.NORMAL_STATE:
                switch(e.which) {
                case 1:
                    //leftclick
                    var temp = peach.smith5.graph;
                    temp.mouse_drag = true;
                    temp.mouse_drag_origin_x = e.offsetX;
                    temp.mouse_drag_origin_y = e.offsetY;
		    //var origin = s_graph.get_coordinate(e.offsetX , e.offsetY);
                    break;
                case 3:
                    //rightclick
                    s_graph.scale = 1.0;
		    s_graph.r = s_graph.width_half * s_graph.scale;
                    s_graph.centerX = s_graph.width / 2;
                    s_graph.centerY = s_graph.height / 2;
                    s_graph.chart_origin_x = 0;
                    s_graph.chart_origin_y = 0;
                    s_graph.draw_smith();
                    break;
                }
                break;
            case s_state.MATCHING_STATE:
                switch(e.which) {
                case 1:
                    //leftclick
		    //logout(s_data.matching_component);
		    s_data.get_matching_result2(e.offsetX,e.offsetY, s_data.matching_component);
                    s_state.reset();
                    s_graph.draw_smith();
                    break;
                case 3://right click
                    s_state.reset();
                    s_graph.draw_smith();
                    break;
                }
                break;
            }
        });
        // mouse down
        $("#" + this.name).mouseup(function(e) {
            switch(e.which) {
            case 1:
                peach.smith5.graph.mouse_drag = false;
                break;
            case 3:
                //rightclick
                break;
            }
        });
        //mouseup

        $("#" + this.name).mousemove(function(e) {
	    var xpos,ypos;
            var temp = peach.smith5.graph;

	    //$('#cursor').show();
	    if(e.offsetX==undefined) // this works for Firefox
	    {
		xpos = e.pageX-$('#' + temp.name).offset().left;
		ypos = e.pageY-$('#' + temp.name).offset().top;
	    }             
	    else                     // works in Google Chrome
	    {
		xpos = e.offsetX;
		ypos = e.offsetY;
	    }
	    //logout("x y:" + xpos + " " + ypos);

	    s_data.update_status(xpos, ypos);

            switch(s_state.state) {
            case s_state.NORMAL_STATE:
                if (temp.mouse_drag == true) {
                    temp.chart_origin_x += xpos - temp.mouse_drag_origin_x;
                    temp.chart_origin_y += ypos - temp.mouse_drag_origin_y;
                    temp.mouse_drag_origin_x = xpos;
                    temp.mouse_drag_origin_y = ypos;
                    temp.draw_smith();
                }
                break;
            case s_state.MATCHING_STATE:
                if (s_data.data.length > 0) {
                    s_graph.draw_smith();
                    s_data.matching(xpos, ypos);
                }
                break;
            }
        });
        //end of mouse move
    }, //init ()
    //drawing function
    /*
     draw_circle_by_point()
     draw_circle_y_axis()//point on the big circle

     */
    draw_smith : function() {
        this.flush_canvas();
        this.context.save();
        this.context.translate(this.centerX + this.chart_origin_x, this.centerY + this.chart_origin_y);

        this.draw_line(-this.r, 0, this.r, 0, this.line_color);

        this.draw_circle_by_point(0, 0, this.r, 0,this.line_color);
	//this.draw_circle_by_point(-this.r,0,-this.r/2,0);
	this.draw_circle_by_point(this.r/4,0,this.r,0,this.line_color);
	this.draw_circle_by_point(-this.r/4,0,this.r,0,this.line_color);
	//this.draw_circle_by_point(-this.r*3/4,0,this.r,0);
        //this.draw_circle_by_point(-this.r, 0, 0, 0);
        this.draw_circle_by_point(-this.r / 2, 0, this.r, 0,this.line_color);
        this.draw_circle_by_point(this.r / 2, 0, this.r, 0,this.line_color);
	this.draw_circle_by_point(-this.r*3/4,0, this.r,0, this.line_color);
        this.draw_circle_y_axis(this.r * Math.cos(Math.PI * 0.5), this.r * Math.sin(Math.PI * 0.5),this.line_color);
        this.draw_circle_y_axis(this.r * Math.cos(Math.PI * 0.25), this.r * Math.sin(Math.PI * 0.25),this.line_color);
        this.draw_circle_y_axis(this.r * Math.cos(Math.PI * 0.75), this.r * Math.sin(Math.PI * 0.75),this.line_color);

	//draw admittance lines
	this.draw_circle_by_point(-this.r,0,0,0, this.admittance_line_color);
	this.draw_circle_by_point(-this.r,0,-this.r/2,0, this.admittance_line_color);
	this.draw_circle_by_point(-this.r,0,-this.r/4,0, this.admittance_line_color);
	this.draw_circle_by_point(-this.r,0,this.r/4,0, this.admittance_line_color);
	this.draw_circle_by_point(-this.r,0,this.r/2,0,this.admittance_line_color);
	this.draw_circle_by_point(-this.r,0,this.r/2,0,this.admittance_line_color);
	this.draw_circle_by_point(-this.r,0,this.r*3/4,0,this.admittance_line_color);
	this.draw_circle_y_axis_left(this.r*Math.cos(Math.PI*0.5), this.r*Math.sin(Math.PI*0.5),this.admittance_line_color);
	this.draw_circle_y_axis_left(this.r*Math.cos(Math.PI*0.25), this.r*Math.sin(Math.PI*0.25),this.admittance_line_color);
	this.draw_circle_y_axis_left(this.r*Math.cos(Math.PI*0.75), this.r*Math.sin(Math.PI*0.75),this.admittance_line_color);
	

        this.draw_blank_area();

        //draw outer circle
        this.draw_circle(0, 0, this.r,this.line_color);
	this.draw_data(s_data);        
	this.draw_matching_data(s_data);
        this.context.restore();
    },
    draw_data : function(d) {
        //logout("draw_data-----------------------");
        if (d.data.length != 0) {
	    //logout("into draw_data");
            var k;
            for ( k = 0; k < d.data.length; k++) {
		if(k == s_data.refered_data ){
		    this.mark_data(d.data[k][3], d.data[k][4], this.mark_color);
		}
		else{
		    this.mark_data(d.data[k][3], d.data[k][4], "white");
		}
		if( (k+1)<d.data.length){
		    //logout("draw connection");
		    // draw connection between points
		    //logout(d.data[k][3]+ ":"+ d.data[k][4] + ":"+ d.data[k+1][3] + ":" +d.data[k+1][4]);
		    this.draw_line(d.data[k][3]*this.r,d.data[k][4]*this.r,d.data[k+1][3]*this.r,d.data[k+1][4]*this.r,this.mark_color);
		}
            }
        }
    },
    draw_matching_data:function(d){
	if(d.matching_data.length != 0){
	    var k,j,old, freq, component,type, new_,gamma;
	    for( k=0;k<d.matching_data.length;k++){
		j = d.matching_data[k];
		if(j[5] == s_state.MATCHING_TYPE_SC){
		    this.draw_matching_trace(j[0],j[1],j[2],j[3],j[4],true);
		}
		else if( j[5] == s_state.MATCHING_TYPE_SI){
		    this.draw_matching_trace(j[0],j[1],j[2],j[3],j[4],false);
		}
		else if( j[5] == s_state.MATCHING_TYPE_PC){
		    this.draw_matching_trace(j[0],j[1],j[2],j[3],j[4],false);
		}
		else if( j[5] == s_state.MATCHING_TYPE_PI){
		    this.draw_matching_trace(j[0],j[1],j[2],j[3],j[4],true);
		}
		else if( j[5] == s_state.MATCHING_TYPE_LINE){
		    this.draw_matching_trace(j[0],j[1],j[2],j[3],j[4],false);
		}
		// draw circle
		this.mark_matching_data(j[0]+j[2]*Math.cos(j[4]) , j[1]+j[2]*Math.sin(j[4]), this.matching_data_color);
	    }// end of for k

	    // draw other matching points in last stage
	    var temp_array=[];
	    for(k =0; k< d.data.length; k++){
		//if(k!= s_data.refered_data){
		    //draw mark data at last stage
		old = [d.data[k][1],d.data[k][2]];
		freq = d.data[k][0];
		for(j=0;j<d.matching_data.length;j++){
		    component = d.matching_data[j][6];
		    type = d.matching_data[j][5];
		    new_ = d.comp_component(freq, old, type, component);
		    old = [new_[1], new_[2]];
		}		    
		gamma = s_data.map_impedance_to_gamma(old[0]/s_data.system_impedance,old[1]/s_data.system_impedance);
		if( k == d.refered_data )
		    this.mark_matching_data(gamma[0],gamma[1],this.mark_color );
		else
		    this.mark_matching_data(gamma[0],gamma[1], this.matching_trace_color);
		temp_array.push([gamma[0],gamma[1]]);
	    }// for k
	    for(k=0;k<temp_array.length-1;k++){
		this.draw_line(temp_array[k][0]*this.r,temp_array[k][1]*this.r,temp_array[k+1][0]*this.r,temp_array[k+1][1]*this.r, "yellow");
	    }
	}// if
    },

    mark_data : function(gr, gx, color) {
        //logout("mark_data()");
        r = this.width_half * this.scale;
        this.context.beginPath();
        //logout("mark :" + gr, "," + gx);
        //this.context.arc(gr * r, gx * r, this.mark_radius, 0, 2 * Math.PI, true);
	this.context.arc(gr * r, gx * r, this.mark_radius*1.5, 0, 2 * Math.PI, true);
        this.context.lineWidth = this.mark_width;
        this.context.strokeStyle = color;
        this.context.stroke();
    },
    mark_matching_data: function(gr, gx, color){
        //logout("mark_data()");
        r = this.width_half * this.scale;
        this.context.beginPath();
        //logout("mark :" + gr, "," + gx);
        this.context.arc(gr * r, gx * r, this.mark_radius, 0, 2 * Math.PI, true);
        this.context.lineWidth = this.mark_width;
        this.context.strokeStyle = color;
        this.context.stroke();

    },
    flush_canvas : function() {
	//this.context.fillStyle = "#000000";
        //this.context.clearRect(0, 0, this.width, this.height);
	var radius = this.r;
	this.context.beginPath();
        this.context.fillStyle = this.bkground_color;
        this.context.moveTo(0, this.height);
        this.context.lineTo(this.width, this.height);
        this.context.lineTo(this.width, 0);
        this.context.lineTo(0, 0);
        this.context.fill();
    },
    /* used only for drawing yellow lines during matching process */
    draw_matching_arc : function(x, y, radius, theta1, theta2,direction, deltax) {
        var r = this.r;
        this.context.save();
        this.context.translate(this.centerX + this.chart_origin_x, this.centerY + this.chart_origin_y);
        this.context.beginPath();
        this.context.arc(x * r, y * r, radius * r, theta1, theta2,direction);
        this.context.lineWidth = this.matching_line_width;
        this.context.strokeStyle = this.matching_line_color;
        this.context.stroke();
	this.context.font = "10pt Comic Sans MS";
	this.context.fillStyle = "lime";
	this.context.textAlign = "center";
	this.context.textBaseline = "middle";
	this.context.fillText(deltax, x*r, y*r);
        this.context.restore();
    },
    // this is for drawing matching data point
    draw_matching_trace: function(x,y,radius,theta1,theta2, direction){
	var r = this.r;
        this.context.beginPath();
        this.context.arc(x * r, y * r, radius * r, theta1, theta2, direction);
        this.context.lineWidth = this.matching_trace_width;
        this.context.strokeStyle = this.matching_trace_color;
        this.context.stroke();
    },
    //draw a circle on the canvas
    draw_circle : function(x, y, radius,color) {
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, 2 * Math.PI, true);
        this.context.lineWidth = this.line_width;
        this.context.strokeStyle = color;
        this.context.stroke();
    },
    draw_circle_by_theta : function(x, y, radius, start_theta, end_theta,color) {
        this.context.beginPath();
        this.context.arc(x, y, radius, start_theta, end_theta, false);
        this.context.lineWidth = this.line_width;
        this.context.strokeStyle = color;
        this.context.stroke();
    },
    draw_circle_by_point : function(x, y, end_x, end_y,color) {
        var radius = Math.sqrt(Math.pow((x - end_x), 2) + Math.pow((y - end_y), 2)) / 2;
        this.draw_circle((x + end_x) / 2, (y + end_y) / 2, radius,color);
    },
    draw_circle_y_axis : function(x, y,color/* x, y are the points on the big circle, c is the chart object */) {
        var x_axis = this.scale * this.width_half;
        var y_new = (Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(x_axis, 2) - 2 * x_axis * x) / (2 * y );
        this.draw_circle_by_theta(x_axis, y_new, y_new, Math.PI * 0.5, Math.PI * 1.5,color);
        this.draw_circle_by_theta(x_axis, -y_new, y_new, Math.PI * 0.5, Math.PI * 1.5,color);
    },
    draw_circle_y_axis_left:function(x,y,color){
	var x_axis = -this.scale * this.width_half;
	var y_new = ( Math.pow(x,2) + Math.pow(y,2) + Math.pow(x_axis,2) - 2* x_axis *x)/(2*y);
	this.draw_circle_by_theta(x_axis, y_new, y_new, Math.PI * 1.5, Math.PI * 0.5,color);
        this.draw_circle_by_theta(x_axis, -y_new, y_new, Math.PI * 1.5, Math.PI * 0.5,color);
    },
    draw_line : function(start_x, start_y, end_x, end_y,color) {
        this.context.beginPath();
        this.context.moveTo(start_x, start_y);
        this.context.lineTo(end_x, end_y);
        this.context.lineWidth = this.line_width;
        this.context.strokeStyle = color;
        this.context.stroke();
    },
    draw_blank_area : function() {
        var radius = this.r;
        // clean bottom right
        this.context.beginPath();
        this.context.fillStyle = this.bkground_color;
        this.context.moveTo(radius, -10);
        this.context.lineTo(radius, 0);
        this.context.arcTo(radius, radius, -10, radius, radius);
        this.context.lineTo(-10, radius);
        this.context.lineTo(-10, this.height*this.max_scale);
        this.context.lineTo(this.width*this.max_scale, this.height*this.max_scale);
        this.context.lineTo(this.width*this.max_scale, -10);
        this.context.fill();

        // clean bottom left
        this.context.beginPath();
        this.context.moveTo(-radius, -10);
        this.context.lineTo(-radius, 0);
        this.context.arcTo(-radius, radius, 10, radius, radius);
        this.context.lineTo(10, radius);
        this.context.lineTo(10, this.height*this.max_scale);
        this.context.lineTo(-this.width*this.max_scale, this.height*this.max_scale);
        this.context.lineTo(-this.width*this.max_scale, -10);
        this.context.fill();

        // clean top left
        this.context.beginPath();
        this.context.moveTo(-radius, 10);
        this.context.lineTo(-radius, 0);
        this.context.arcTo(-radius, -radius, 10, -radius, radius);
        this.context.lineTo(10, -radius);
        this.context.lineTo(10, -this.height*this.max_scale);
        this.context.lineTo(-this.width*this.max_scale, -this.height*this.max_scale);
        this.context.lineTo(-this.width*this.max_scale, -10);
        this.context.fill();

        // clean top right
        this.context.beginPath();
        this.context.moveTo(radius, 10);
        this.context.lineTo(radius, 0);
        this.context.arcTo(radius, -radius, -10, -radius, radius);
        this.context.lineTo(-10, -radius);
        this.context.lineTo(-10, -this.height*this.max_scale);
        this.context.lineTo(this.width*this.max_scale, -this.height*this.max_scale);
        this.context.lineTo(this.width*this.max_scale, 10);
        this.context.fill();

    },

    //mouse event handler
    MouseWheelHandler : function(e) {
        // cross-browser wheel delta
        var e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        peach.smith5.graph.set_scale(delta);
        return false;
    },
    // set scale according to delta value from mouse wheel handler
    set_scale : function(d) {
        this.scale += d * 0.02;
        this.scale = Math.min(this.max_scale, Math.max(this.min_scale, this.scale));
	this.r = this.scale * this.width_half;
        this.draw_smith();
    },
    get_coordinate:function(x,y){
	var x1,y1;
	x1 = (parseFloat(x) - this.centerX - this.chart_origin_x) / this.r;
        y1 = (parseFloat(y) - this.centerY - this.chart_origin_y) / this.r;
	return([x1,y1]);
    }    
};
// end of peach.smith5.graph

/*
 * This is for data store and manipulate purpose.
 */
peach.smith5.data = function() {
    this.system_impedance = 50;
    this.float_length = 2;
    this.data = [];
    this.refered_data = 0;
    this.refered_freq = 0;
    this.matching_data = [];
    this.matching_component = [];

    this.set_refered = function(freq){
	this.refered_freq = parseFloat(freq);
	this.sync_refered();
    };
    this.sync_refered_index = function(){
	this.refered_freq = this.data[this.refered_data][0];
    };
    this.sync_refered = function(){
	var i;
	//logout("into sync_refered");
	//logout(this.refered_data + "," + this.refered_freq);
	for(i=0; i< this.data.length; i++){
	    if( this.refered_freq == this.data[i][0]){
		this.refered_data = i;
		return;
	    }
	}
	warning("no freq found in set_refered()");	
    };
    this.get_refered = function(){
	return([this.refered_data, this.refered_freq]);
    };
    this.get_last = function() {
        if (this.data == [])
            return [];
        else
            return this.data[this.data.length - 1];
    };
    this.remove = function(index){
	if(index <0 || index>= this.data.length )
	    return;
	var d = this.data.slice(0,index);
	var b = this.data.slice(index, this.data.length-1);
	logout(this.data);
	logout(d);
	logout(b);
	this.data = d.concat(b);
	logout(this.data);
    };
    this.get_last_matching_data = function() {
        if (this.matching_data.length == 0)
            return [];
        else 
            return this.matching_data[this.matching_data.length - 1];
    };
    this.sync_matching_data = function(){
	// first matching data based on refered_data point
	// other matching data based on the first matching data
	// recompute it
	//logout("before sync_matching_data");
	//logout(s_data.matching_data);
	/*var old = [s_data.data[s_data.refered_data][3],s_data.data[s_data.refered_data][4]];
	var i,new1;
	for(i = 0; i< s_data.matching_data.length; i++){
	    new1 = s_data.sync_helper(old,s_data.matching_data[i]);
	    s_data.matching_data[i] = new1;
	    old = [new1[0]+ new1[2]*Math.cos(new1[4]), new1[1] + new1[2]*Math.sin(new1[4])];*/
	var old, i,new1;
	old = s_data.data[s_data.refered_data];
	old = [old[3],old[4]];
	//logout(old);
	for(i =0; i<s_data.matching_data.length; i++){
	    new1 = s_data.sync_helper(old, s_data.matching_data[i]);
	    //logout("new1 -->" + new1);
	    s_data.matching_data[i]= new1;
	    old = [new1[0]+ new1[2]*Math.cos(new1[4]) , new1[1] + new1[2]*Math.sin(new1[4])];
	}
    };
    // old is the old coordinate in gamma value; 
    // now_matching is the value of current matching_data
    // return a new matching_data value
    this.sync_helper = function(old, now){
	var radius,x0,y0,theta0,theta1,freq;
	var tempZ,tempj, tempG, tempY;
	logout("into sync helper");
	logout(old);
	logout(now);
	freq = s_data.data[s_data.refered_data][0];
	//logout("freq "+ freq);
	switch(now[5]){
	case s_state.MATCHING_TYPE_SC:
	    // get x0,y0 ,r , theta0, from old[,]
	    // get type, component from now
	    // get theta1 from computation
	    radius = this.get_radius(old);
	    x0 = 1 - radius;
	    y0 = 0;
	    theta0  = s_data.get_theta(old[0],old[1],x0,y0);
	    tempZ = this.map_gamma_to_impedance(old[0],old[1]);
	    tempj = 1/(2*Math.PI*freq*1e6*now[6]*(1e-12)*this.system_impedance);
	    tempG = this.map_impedance_to_gamma(tempZ[0],-tempZ[1] - tempj);
	    theta1 = this.get_theta(tempG[0],tempG[1],x0,y0);
            break;
        case s_state.MATCHING_TYPE_SI:
	    radius = this.get_radius(old);
	    //logout("radius "+ radius);
	    x0 = 1 - radius;
	    y0 = 0;
	    theta0  = s_data.get_theta(old[0],old[1],x0,y0);
	    tempZ = s_data.map_gamma_to_impedance(old[0],old[1]);
	    //logout("tempZ " + tempZ);
	    //logout("j is " + now[6]);
	    tempj = 2*Math.PI*freq*1e6*now[6]*(1e-9)/s_data.system_impedance;
	    //logout("tempj " + tempj);
	    tempG = s_data.map_impedance_to_gamma(tempZ[0],-tempZ[1] + tempj);
	    //logout("tempG " + tempG);
	    theta1 = s_data.get_theta(tempG[0],tempG[1],x0,y0);
	    break;
        case s_state.MATCHING_TYPE_PI:
	    radius = this.get_radius_Y(old);
	    x0 = -1 + radius;
	    y0 = 0;
	    theta0  = s_data.get_theta(old[0],old[1],x0,y0);
	    tempZ = this.map_gamma_to_impedance(old[0],old[1]);
	    tempY = this.map_z_to_y(tempZ[0],-tempZ[1]);
	    tempj = (1/(2*Math.PI*freq*1e6*now[6]*1e-9))*this.system_impedance;
	    tempZ =this.map_y_to_z(tempY[0],tempY[1]-tempj);
	    tempG = this.map_impedance_to_gamma(tempZ[0], tempZ[1]);
	    theta1 = this.get_theta(tempG[0],tempG[1],x0,y0);
            break;
        case s_state.MATCHING_TYPE_PC:
	    radius = this.get_radius_Y(old);
	    x0 = -1 + radius;
	    y0 = 0;
	    theta0  = s_data.get_theta(old[0],old[1],x0,y0);
	    tempZ = this.map_gamma_to_impedance(old[0],old[1]);
	    tempY = this.map_z_to_y(tempZ[0],-tempZ[1]);
	    tempj = (2*Math.PI*freq*1e6*now[6]*1e-12)*this.system_impedance;
	    tempZ =this.map_y_to_z(tempY[0],tempY[1] + tempj);
	    tempG = this.map_impedance_to_gamma(tempZ[0], tempZ[1]);
	    theta1 = this.get_theta(tempG[0],tempG[1],x0,y0);
	    break;
        case s_state.MATCHING_TYPE_LINE:
	    radius = this.get_distance(old[0],old[1],0,0);
	    x0 = 0; y0 = 0;
	    theta0 = s_data.get_theta(old[0],old[1],x0,y0);
	    theta1 = theta0 + now[6]*4*Math.PI;
	    break;
	}
	return([x0,y0,radius,theta0,theta1,now[5],now[6]]);
    };
    this.add = function(f, r, k) {
        // f , frquency, r real impedance, k complex impedance;
        // compute circle center, radius and theta
        // to exelerate the drawing speed.
        var i;
        for ( i = 0; i < this.data.length; i++) {
            if (f == this.data[i][0]) {
                warning("Duplicate frequency point:" + f + "MHz");
                return false;
            }
        }
        // compute gamma point center coordinate
        var a = s_data.map_impedance_to_gamma(parseFloat(r) / s_data.system_impedance, parseFloat(k) / s_data.system_impedance);

        this.data.push([f, r, k, a[0], a[1]]);
        return true;
    };
    //store the specfic item in data
    this.sync = function(index){
	var a = s_data.map_impedance_to_gamma( s_data.data[index][1]/s_data.system_impedance, s_data.data[index][2]/s_data.system_impedance);
	s_data.data[index][3] = a[0];
	s_data.data[index][4] = a[1];
    };
    this.add_matching_data = function(x0, y0, r, theta0, theta1, type, component) {
        this.matching_data.push([x0, y0, r, theta0, theta1, type, component]);
    };

    this.sort = function() {
        var i, j, k;
        var s = [];
        var d = this.data;
        //logout("---------------------");
        for ( i = 0; i < d.length - 1; i++) {
            //logout("+++++++++++++ " + i + "++++++");
            for ( j = 0; j < d.length - 1 - i; j++) {
                if (parseFloat(d[j][0]) > parseFloat(d[j+1][0])) {
                    s = d[j + 1];
                    d[j + 1] = d[j];
                    d[j] = s;
                }
            }
        }
        this.data = d;
	this.sync_refered();
        this.reload();
    };
    //reload input_data table
    this.reload = function() {
        $("#input_data tbody").empty();
	if( this.data.length <1){
	    //logout("data length <1");
	    return;
	}
        var i;
        for ( i = 0; i < this.data.length; i++) {
            $("#input_data tbody").append("<tr>" + "<td>" + s_data.data[i][0] + "</td>" + "<td>" + s_data.data[i][1] + "</td>" + "<td>" + s_data.data[i][2] + "</td>" + "</tr>");
        }
	//logout("set refered data");
	$("#input_data tbody tr:eq(" + s_data.refered_data +")").addClass("important");
    };

    this.clear = function() {
        this.data = [];
	this.matching_data = [];
        $("#input_data tbody").empty();
    };
    this.checkRegexp = function(o, pattern, text) {
        if (!( pattern.test(o.val()) )) {
            o.addClass("ui-state-error");
            this.updateTips(text);
            return false;
        } else {
            return true;
        }
    };
    this.updateTips = function(text) {
        $(".validateTips").text(text).addClass("ui-state-highlight");
        setTimeout(function() {
            $(".validateTips").removeClass("ui-state-highlight", 1500);
        }, 500);
    };
    // get rid of useless zeros
    this.trim_number = function(str) {
        var s = str;
        while (s.substr(0, 1) == '0' && s.length > 1) {
            s = s.substr(1, 9999);
        }
        return s;
    };
    this.map_impedance_to_gamma = function(real, complex) {// input normalized impedance
        var gr, gx;
        var root = Math.pow(real + 1, 2) + Math.pow(complex, 2);
        gr = (Math.pow(real, 2) + Math.pow(complex, 2) - 1) / root;
        gx = (complex * 2) / root;
	//because the y axis is downward in campus, so I deliberately
	//change the sign of gx; anytime you need a real impedance 
	//value, just use [gamma_x, -gamma_y] instead.
        return ([gr, -gx]);
    };
    this.map_gamma_to_impedance = function(gr, gx) {// input gamma coordinate
        var real, complex;
        var root = Math.pow(1 - gr, 2) + Math.pow(gx, 2);
        real = (1 - Math.pow(gr, 2) - Math.pow(gx, 2)) / root;
        complex = (2 * gx) / root;
        return ([real, complex]);// complex is opposite sign to real value
    };
    this.map_z_to_y = function(gr, gx) {
        var root = Math.pow(gr, 2) + Math.pow(gx, 2);
        return ([gr / root, -gx / root]);
    };
    this.map_y_to_z = function(gr, gx) {
        var root = Math.pow(gr, 2) + Math.pow(gx, 2);
        return ([gr / root, -gx / root]);
    };
    this.get_radius_Y = function(da){
        return (Math.pow(da[1], 2) + Math.pow(1 + da[0], 2)) / (2 * (1 + da[0]));	    };
    this.get_radius = function(da) {
         return (Math.pow(da[1], 2) + Math.pow(1 - da[0], 2)) / (2 * (1 - da[0]));
    };
    this.get_distance = function( x,y, r_x, r_y){
	return (Math.sqrt(Math.pow(x - r_x,2) + Math.pow(y - r_y,2)));
    };
    this.get_Z_theta = function(x,y) {
	var r = this.get_distance(x,y,0,0);
	var theta = this.get_theta(x,y,0,0);
	return([r,theta]);
    };
    this.get_theta = function(x, y, r_x, r_y) {
        // absolute coordinate 2D system
        var theta = Math.atan((y - r_y) / (x - r_x));
	if(theta == Number.POSITIVE_INFINITY ){
	    return(Math.PI/2);
	}
	if(theta == Number.NEGATIVE_INFINITY ){
	    return(Math.PI*3/2);
	}
	if(theta == 0){
    	    if((x-r_x)>0)
		theta = 0;
	    else
		theta = Math.PI;
	}
        else if (theta > 0) {
            if ((x - r_x) > 0) {
                theta = theta;
            } else {
                theta = Math.PI + theta;
            }
        } else {//theta<0
            if ((x - r_x) > 0) {
                theta = Math.PI * 2 + theta;
            } else {
                theta = Math.PI + theta;
            }
        }
        return theta;
    };
    this.get_info_from_data_Y = function(x,y){
	var r = s_graph.r;
	var radius,x0,y0,x1,y1,theta1,theta2;
	radius = this.get_radius_Y([s_data.data[0][3], s_data.data[0][4]]);
	x0 = -1 + radius;
        y0 = 0;
        x1 = (parseFloat(x) - s_graph.centerX - s_graph.chart_origin_x) / r;
        y1 = (parseFloat(y) - s_graph.centerY - s_graph.chart_origin_y) / r;
	theta1 = this.get_theta(s_data.data[0][3], s_data.data[0][4], x0, y0);
        theta2 = this.get_theta(x1, y1, x0, y0);
	return([x0,y0,radius,theta1,theta2]);
    };
    this.get_info_from_data = function(x,y){
	//logout("into get_info_from_data");
        var r = s_graph.r;
	var radius,x0,y0,x1,y1,theta1,theta2;
	radius = this.get_radius([s_data.data[0][3], s_data.data[0][4]]);
        x0 = 1 - radius;
        y0 = 0;
        x1 = (parseFloat(x) - s_graph.centerX - s_graph.chart_origin_x) / r;
        y1 = (parseFloat(y) - s_graph.centerY - s_graph.chart_origin_y) / r;
        theta1 = this.get_theta(s_data.data[0][3], s_data.data[0][4], x0, y0);
        theta2 = this.get_theta(x1, y1, x0, y0);
	return([x0,y0,radius,theta1,theta2]);
    };
    this.get_info_from_matching_data_Y = function(x,y){
	var r = s_graph.r;
	var da,radius,x0,y0,x1,y1,theta1,theta2;
	var orgin_x,origin_y;
	da = this.get_last_matching_data();
	origin_x = da[0] + da[2]*Math.cos(da[4]);
	origin_y = da[1] + da[2]*Math.sin(da[4]);
	radius = this.get_radius_Y([origin_x,origin_y]);
	x0 = -1 + radius;
        y0 = 0;
        x1 = (parseFloat(x) - s_graph.centerX - s_graph.chart_origin_x) / r;
        y1 = (parseFloat(y) - s_graph.centerY - s_graph.chart_origin_y) / r;

	theta1 = this.get_theta(origin_x, origin_y, x0, y0);
        theta2 = this.get_theta(x1, y1, x0, y0);
	return([x0,y0,radius,theta1,theta2]);
    };
    this.get_info_from_matching_data= function(x,y){
        var r = s_graph.r;
	var da,radius,x0,y0,x1,y1,theta1,theta2;
	da = this.get_last_matching_data();

	var origin_x, origin_y;
	origin_x = da[0] + da[2]*Math.cos(da[4]);
	origin_y = da[1] + da[2]*Math.sin(da[4]);
	radius = this.get_radius([origin_x, origin_y]);
        x0 = 1 - radius;
        y0 = 0;
        x1 = (parseFloat(x) - s_graph.centerX - s_graph.chart_origin_x) / r;
        y1 = (parseFloat(y) - s_graph.centerY - s_graph.chart_origin_y) / r;

        theta1 = this.get_theta(origin_x, origin_y, x0, y0);
        theta2 = this.get_theta(x1, y1, x0, y0);
	return([x0,y0,radius,theta1,theta2]);
    };
    /*this is the function for drawing arc during matching process */
    this.matching = function(x, y) {
        var radius, x0, y0, x1,y1,theta1, theta2, original,deltax,t,component;
	x1 =(parseFloat(x) - s_graph.centerX - s_graph.chart_origin_x) /s_graph.r;
	y1 = (parseFloat(y) - s_graph.centerY - s_graph.chart_origin_y) /s_graph.r;
        switch(s_state.matching_type) {
        case s_state.MATCHING_TYPE_SC:
	    t=this.get_matching_result_info(true, s_data.matching_data.length < 1);
            break;
        case s_state.MATCHING_TYPE_SI:
	    t=this.get_matching_result_info(true, s_data.matching_data.length < 1);
	    break;
        case s_state.MATCHING_TYPE_PI:
	    t=this.get_matching_result_info(false, s_data.matching_data.length < 1);
            break;
        case s_state.MATCHING_TYPE_PC:
	    t=this.get_matching_result_info(false, s_data.matching_data.length < 1);
	    break;
	case s_state.MATCHING_TYPE_LINE:
	    t=this.get_matching_result_info(true, s_data.matching_data.length < 1);
	    t[0]=0;t[1]=0;t[2]=s_data.get_distance(t[4][0],t[4][1],0,0);
	    t[3]=s_data.get_theta(t[4][0],t[4][1],0,0);
	    break;
        }
	x0=t[0];y0=t[1];radius=t[2];theta1=t[3];
	original=t[4];// gamma coordinate values [x,y]
	theta2 = s_data.get_theta(x1, y1, x0, y0);

        switch(s_state.matching_type) {
        case s_state.MATCHING_TYPE_SC:
	    deltax = s_data.compute_deltax_Z(original[0], original[1], x0+radius*Math.cos(theta2), y0+radius*Math.sin(theta2));
	    if (theta2 < theta1) {
		component = s_data.comp_sc(s_data.data[this.refered_data][0],deltax);
		s_graph.draw_smith();
                s_graph.draw_matching_arc(x0, y0, radius, theta1, theta2, true,(component/1e-12).toFixed(2)+"pF");
		this.matching_component = [x0, y0,radius, theta1, theta2,true,component/1e-12, s_state.MATCHING_TYPE_SC];
            }
	    break;
	case s_state.MATCHING_TYPE_SI:
	    deltax = s_data.compute_deltax_Z(original[0], original[1], x0+radius*Math.cos(theta2), y0+radius*Math.sin(theta2));
	    if (theta2 > theta1) {
		component= s_data.comp_si(s_data.data[this.refered_data][0],deltax);
                s_graph.draw_smith();
                s_graph.draw_matching_arc(x0, y0, radius, theta1, theta2,false, (component/1e-9).toFixed(2)+"nH");
		this.matching_component = [x0, y0,radius, theta1, theta2,false,component/1e-9, s_state.MATCHING_TYPE_SI];
            }
	    break;
	case s_state.MATCHING_TYPE_LINE:
	    //component is the delta of theta
	    //logout("theta1 theta2 :" + theta1 + " " + theta2);
	    component = (theta2 < theta1)?(Math.PI*2 - theta1 +  theta2):(theta2 - theta1);
	    s_graph.draw_smith();
	    s_graph.draw_matching_arc(x0,y0,radius,theta1,theta2, false, (0.25*component/Math.PI).toFixed(3) + ' \u03bb');
	    this.matching_component = [x0, y0, radius, theta1, theta2, false ,(0.25*component/Math.PI),s_state.MATCHING_TYPE_LINE];
	    break;
	case s_state.MATCHING_TYPE_PI:
	    deltax = s_data.compute_deltax_Y(original[0], original[1], x0+radius*Math.cos(theta2), y0+radius*Math.sin(theta2));
	    if ( (theta1> Math.PI && theta1< 2*Math.PI && theta2< theta1 && theta2>Math.PI) || (theta1<=Math.PI && theta1>=0 && theta2<theta1 && theta2>=0) || (theta1<=Math.PI && theta1>=0 && theta2 >= Math.PI) ) {
		component = s_data.comp_pi(s_data.data[this.refered_data][0],deltax);
		s_graph.draw_smith();
		s_graph.draw_matching_arc(x0, y0, radius, theta1, theta2, true,(component/1e-9).toFixed(2)+"nH");
		this.matching_component = [x0, y0,radius, theta1, theta2,true,component/1e-9, s_state.MATCHING_TYPE_PI];
            }
	    break;
	case s_state.MATCHING_TYPE_PC:
	    deltax = s_data.compute_deltax_Y(original[0], original[1], x0+radius*Math.cos(theta2), y0+radius*Math.sin(theta2));
	    if ((theta1>=0 && theta1<=Math.PI&& theta2 > theta1 && theta2 < Math.PI) || (theta1>Math.PI && theta2>Math.PI && theta2>theta1) || (theta1>Math.PI && theta2>=0 && theta2<Math.PI)) {
		component = s_data.comp_pc(s_data.data[this.refered_data][0],deltax);// f , deltax
		s_graph.draw_smith();       
                s_graph.draw_matching_arc(x0, y0, radius, theta1, theta2,false,(component/1e-12).toFixed(2)+"pF");
		this.matching_component = [x0, y0,radius, theta1, theta2,false,component/1e-12, s_state.MATCHING_TYPE_PC];
            }
	    break;
	}
    };
    this.compute_deltax_Y = function(x0,y0,x1,y1){
	var a0 = this.get_Y(x0,y0);
	var a1 = this.get_Y(x1,y1);
	return(a1[1] - a0[1]);
    };
    this.compute_deltax_Z = function(x0, y0, x1, y1) {
        var a0 = this.get_Z(x0, y0);
        var a1 = this.get_Z(x1, y1);
        return (a1[1] - a0[1]);
    };
//this function has only a component value in matching_component array
//I think it's better than the old get_matching_result() function
    this.get_matching_result2 = function(x,y,comp){
        var radius, x0, y0, x1,y1,theta1, theta2, type,deltax,component,t;
	x1 =(parseFloat(x) - s_graph.centerX - s_graph.chart_origin_x) / s_graph.r;
	y1 = (parseFloat(y) - s_graph.centerY - s_graph.chart_origin_y) /s_graph.r;

	x0=comp[0];y0=comp[1];radius=comp[2];theta1=comp[3];theta2=comp[4];
	type=comp[7];component=comp[6];
	switch(s_state.matching_type){
	case s_state.MATCHING_TYPE_SC:
	    if(theta2<theta1){
		this.add_matching_data(x0,y0,radius,theta1,theta2,type,component);
		this.update_matching_result();
	    }
	    break;
	case s_state.MATCHING_TYPE_SI:
	    if(theta2 > theta1){
		this.add_matching_data(x0,y0,radius,theta1,theta2,type,component);
		this.update_matching_result();
	    }
	    break;
	case s_state.MATCHING_TYPE_LINE:
	    this.add_matching_data(x0,y0,radius,theta1,theta2,type,component);
	    this.update_matching_result();
	    break;
	case s_state.MATCHING_TYPE_PI:
	    if ( (theta1> Math.PI && theta1< 2*Math.PI && theta2< theta1 && theta2>Math.PI) || (theta1<=Math.PI && theta1>=0 && theta2<theta1 && theta2>=0) || (theta1<=Math.PI && theta1>=0 && theta2 >= Math.PI) ) {
		this.add_matching_data(x0,y0,radius,theta1,theta2,type,component);
		this.update_matching_result();
	    }
	    break;
	case s_state.MATCHING_TYPE_PC:
	    if ((theta1>=0 && theta1<=Math.PI&& theta2 > theta1 && theta2 < Math.PI) || (theta1>Math.PI && theta2>Math.PI && theta2>theta1) || (theta1>Math.PI && theta2>=0 && theta2<Math.PI)) {
		this.add_matching_data(x0,y0,radius,theta1,theta2,type,component);
		this.update_matching_result();
	    }
	    break;
	}
    };
/*    this.get_matching_result=function(x,y){
	var r = s_graph.r;
        var radius, x0, y0, x1,y1,theta1, theta2, original,deltax,component;
	x1 =(parseFloat(x) - s_graph.centerX - s_graph.chart_origin_x) / r;
	y1 = (parseFloat(y) - s_graph.centerY - s_graph.chart_origin_y) / r;
	switch(s_state.matching_type){
	case s_state.MATCHING_TYPE_SC:
	    if (s_data.matching_data.length < 1) {
		var t=this.get_matching_result_info_from_data();
		x0=t[0];y0=t[1];radius=t[2];theta1=t[3];
		original=t[4];
	    }
	    else{
		var t=this.get_matching_result_info_from_matching_data();
		x0=t[0];y0=t[1];radius=t[2];theta1=t[3];
		original=t[4];
	    }

	    theta2 = s_data.get_theta(x1, y1, x0, y0);
	    deltax = s_data.compute_deltax_Z(original[0], original[1], x1, y1);
	    if(theta2<theta1){
		this.add_matching_data(x0, y0, radius, theta1, theta2, s_state.MATCHING_TYPE_SC, deltax);
		this.update_matching_result();
	    }

	    break;
	case s_state.MATCHING_TYPE_SI:
	    if (s_data.matching_data.length < 1) {
		var t=this.get_matching_result_info_from_data();
		x0=t[0];y0=t[1];radius=t[2];theta1=t[3];
		original=t[4];
	    }
	    else{
		var t=this.get_matching_result_info_from_matching_data();
		x0=t[0];y0=t[1];radius=t[2];theta1=t[3];
		original=t[4];
	    }
	    theta2 = s_data.get_theta(x1, y1, x0, y0);
	    deltax = s_data.compute_deltax_Z(original[0], original[1], x1, y1);
	    if(theta2 > theta1){
		this.add_matching_data(x0, y0, radius, theta1, theta2, s_state.MATCHING_TYPE_SI, deltax);
		this.update_matching_result();
	    }
	    break;
	case s_state.MATCHING_TYPE_PI:
	    if (s_data.matching_data.length < 1) {
		var t=this.get_matching_result_info_from_data_Y();
		x0=t[0];y0=t[1];radius=t[2];theta1=t[3];
		original=t[4];
	    }
	    else{
		var t=this.get_matching_result_info_from_matching_data_Y();
		x0=t[0];y0=t[1];radius=t[2];theta1=t[3];
		original=t[4];
	    }
	    theta2 = s_data.get_theta(x1, y1, x0, y0);
	    deltax = s_data.compute_deltax_Y(original[0], original[1], x0+radius*Math.cos(theta2), y0+radius*Math.sin(theta2));

	    if ( (theta1> Math.PI && theta1< 2*Math.PI && theta2< theta1 && theta2>Math.PI) || (theta1<=Math.PI && theta1>=0 && theta2<theta1 && theta2>=0) || (theta1<=Math.PI && theta1>=0 && theta2 >= Math.PI) ) {
		this.add_matching_data(x0, y0, radius, theta1, theta2, s_state.MATCHING_TYPE_PI, deltax);
		this.update_matching_result();
	    }
	    break;
	case s_state.MATCHING_TYPE_PC:
	    if (s_data.matching_data.length < 1) {
		var t=this.get_matching_result_info_from_data_Y();
		x0=t[0];y0=t[1];radius=t[2];theta1=t[3];
		original=t[4];
	    }
	    else{
		var t=this.get_matching_result_info_from_matching_data_Y();
		x0=t[0];y0=t[1];radius=t[2];theta1=t[3];
		original=t[4];
	    }
	    theta2 = s_data.get_theta(x1, y1, x0, y0);
	    deltax = s_data.compute_deltax_Y(original[0], original[1], x1, y1);
	    if ((theta1>=0 && theta1<=Math.PI&& theta2 > theta1 && theta2 < Math.PI) || (theta1>Math.PI && theta2>Math.PI && theta2>theta1) || (theta1>Math.PI && theta2>=0 && theta2<Math.PI)) {
		this.add_matching_data(x0, y0, radius, theta1, theta2, s_state.MATCHING_TYPE_PC, deltax);
		this.update_matching_result();
	    }
	    break;
	}
    };
*/
    this.comp_si = function(f,delta){
	var a;
	a = (delta*s_data.system_impedance)/(f*1e6*2*Math.PI);
	return a;
    };
    this.comp_sc = function(f,delta){
	var a;
	var R = s_data.system_impedance;
	a = -1/(f*1e6*2*Math.PI*delta);
	return a/(R);
    };
    this.comp_pi = function(f,delta){
	var a;
	a = -s_data.system_impedance/(f*1e6*2*Math.PI*delta);
	return a;
    };
    this.comp_pc = function(f,delta){
	var a;
	a= (delta/s_data.system_impedance)/(f*1e6*2*Math.PI);
	return a;
    };
    this.comp_component= function(freq, old, type, component){
	var answer=[];
	switch(type){
	    case s_state.MATCHING_TYPE_SI:
	    answer[0] = "S"+component.toFixed(2)+"nH";
	    answer[1] = parseFloat(old[0]);
	    answer[2] = parseFloat(old[1]) + 2*Math.PI*freq*1e6*component*1e-9;
	    break;
	    case s_state.MATCHING_TYPE_SC:
	    answer[0] = "S"+component.toFixed(2) + "pF";
	    answer[1] = parseFloat(old[0]);
	    answer[2] = parseFloat(old[1]) - 1/(2*Math.PI*freq*1e6*component*1e-12);
	    break;
	case s_state.MATCHING_TYPE_LINE:
	    answer[0] = "TL"+component.toFixed(2) + ' \u03bb';
	    var gamma1 = s_data.map_impedance_to_gamma(old[0]/s_data.system_impedance, old[1]/s_data.system_impedance);
	    var Z = s_data.get_Z_theta(gamma1[0],gamma1[1]);
	    var theta = -component*4*Math.PI;
	    //logout("theta delta is:" + theta); 
	    var gamma1;
	    gamma1[0] = Z[0]*Math.cos(Z[1]-theta);
	    gamma1[1] = Z[0]*Math.sin(Z[1]-theta) ;
	    var impedance1 = s_data.map_gamma_to_impedance(gamma1[0],gamma1[1]);
	    answer[1] = impedance1[0]*s_data.system_impedance;
	    answer[2] = -impedance1[1]*s_data.system_impedance;
	    break;
	case s_state.MATCHING_TYPE_PI:
	    answer[0] = "P" + component.toFixed(2) + "nH";
	    var y;
	    y = this.map_z_to_y(old[0],old[1]);
	    y[1] -= 1/(2*Math.PI*freq*1e6*component*1e-9);
	    y = this.map_y_to_z(y[0],y[1]);
	    answer[1] = y[0];
	    answer[2] = y[1];
	    break;
	case s_state.MATCHING_TYPE_PC:
	    answer[0] = "P" + component.toFixed(2) + "pF";
	    var y;
	    y = this.map_z_to_y(old[0],old[1]);
	    y[1] += 2*Math.PI*freq*1e6*component*1e-12;
	    y = this.map_y_to_z(y[0],y[1]);
	    answer[1] = y[0];
	    answer[2] = y[1];
	    break;
	}
	return answer;
    }
    this.get_component_value = function(deltax, type){
	switch(type){
	case s_state.MATCHING_TYPE_SI:
	    return( "S"+(deltax/(1e-9)).toFixed(2) + "nH");
	    break;
	case s_state.MATCHING_TYPE_SC:
	    return( "S"+(deltax/(1e-12)).toFixed(2) + "pF");
	    break;
	case s_state.MATCHING_TYPE_PI:
	    return( "P"+(deltax/(1e-9)).toFixed(2) + "nH");
	    break;
	case s_state.MATCHING_TYPE_PC:
	    return( "P"+(deltax/(1e-12)).toFixed(2) + "pF");
	    break;
	}
    };
    this.update_matching_result= function(){
	$("#matching_result table").remove();
	this.update_matching_result_table_head();
	this.update_matching_result_table_content();
    };
    // update matching component data
    this.update_matching_result_table_content=function(){
	if(this.matching_data.length<1)
	    return;
	var i,j,component,freq, s_component, new_, old;

	for(i=0; i< this.data.length ;i++){
	    old = [this.data[i][1],this.data[i][2]];//this is 
	    freq = this.data[i][0];
	    for(j=0; j<this.matching_data.length; j++){
		component = this.matching_data[j][6];
		type = this.matching_data[j][5];
		new_ = this.comp_component(freq, old, type, component);
		old = [new_[1],new_[2]];
		$("#matching_result table:eq("+ i +")>tbody").append('<tr> <td>'+ new_[0]+'</td><td>'+ new_[1].toFixed(1) +'</td><td>'+ new_[2].toFixed(1) +'</td></tr>');
	    }	    
	}
    };
    this.update_matching_result_table_head=function(){
	if(this.data.length <1){
	    warning("No source impedance entered yet.");
	    return;
	}
	var i;
	for(i = 0;i<this.data.length; i++){
	    $("#matching_result").append('<table class="ui-widget ui-widget-content"><caption>Freq: '+ this.data[i][0]+'MHz</caption><thead> <tr class="ui-widget-header "> <th>Matching</th> <th>Real</th> <th>Imag</th> </tr> </thead>  <tbody> </tbody>  </table>');
	}
	for(i = 0;i<this.data.length; i++){
	    var z = [this.data[i][1],this.data[i][2]];
	    $("#matching_result table:eq("+ i +")>tbody").append('<tr> <td>Initial</td><td>'+parseFloat(z[0]).toFixed(1).toString()+'</td><td>'+ parseFloat(z[1]).toFixed(1).toString()+'</td></tr>');
	}
    };
    // z , is z impedance or not
    // first, is this first matching point or not?
    this.get_matching_result_info = function(z, first){
	if(z == true){//Z
	    if( first == true)
		return this.get_matching_result_info_from_data();
	    else
		return this.get_matching_result_info_from_matching_data();
	}
	else{//Y
	    if( first == true)
		return this.get_matching_result_info_from_data_Y(first);
	    else
		return this.get_matching_result_info_from_matching_data_Y();
	}
    };
    this.get_matching_result_info_from_data_Y = function(){
	var radius, x0, y0, theta1, original;
	var index = s_data.refered_data;
	radius = s_data.get_radius_Y([s_data.data[index][3],s_data.data[index][4]]);
	x0 = -1 + radius;
	y0 = 0;
	theta1 = s_data.get_theta(s_data.data[index][3], s_data.data[index][4], x0,y0);
	original = [s_data.data[index][3], s_data.data[index][4]];
	return([x0,y0,radius,theta1,original]);
    };
    this.get_matching_result_info_from_data= function(){
	var radius, x0, y0, theta1, original;
	var x1,y1,t;
	var index = s_data.refered_data;
	radius = s_data.get_radius([s_data.data[index][3], s_data.data[index][4]]);
	x0 = 1 - radius;
	y0 = 0;
	theta1 = s_data.get_theta(s_data.data[index][3], s_data.data[index][4],x0,y0);
	original = [s_data.data[index][3], s_data.data[index][4]];

	return([x0,y0,radius,theta1,original]);
    };
    this.get_matching_result_info_from_matching_data_Y = function(){
	var radius, x0, y0, theta1, original;
	var t = this.get_last_matching_data();
	var x1,y1;
	x1 = t[0] + t[2]*Math.cos(t[4]);
	y1 = t[1] + t[2]*Math.sin(t[4]);
	radius = this.get_radius_Y([x1,y1]);
	x0 = -1 + radius;
	y0 = 0;
	theta1 =  this.get_theta(x1,y1,x0,y0);
	original = [x1,y1];
	return([x0,y0,radius,theta1, original]);
    };
    this.get_matching_result_info_from_matching_data=function(){
	var radius, x0, y0, theta1, original;
	var t,x1,y1;
	t = s_data.get_last_matching_data();
	x1 = t[0] + t[2] * Math.cos(t[4]);
	y1 = t[1] + t[2] * Math.sin(t[4]);
	radius = this.get_radius([x1,y1]);
        x0 = 1 - radius;
        y0 = 0;
        theta1 = this.get_theta(x1,y1,x0,y0);
        original = [x1,y1];	

	return([x0,y0,radius,theta1,original]);
    };
    this.update_status=function(x1,y1){
	var da = s_graph.get_coordinate(x1,y1);//x,y are also on canvas
	var z = this.get_Z(parseFloat(da[0]),parseFloat(da[1]));
	var y = this.get_Y(parseFloat(da[0]),parseFloat(da[1]));
	var amp = Math.sqrt(Math.pow(da[0],2) +Math.pow(da[1],2));
	var theta = (2*Math.PI - this.get_theta(da[0],da[1],0,0))*180/Math.PI;
	var swr = (1 +amp)/(1-amp);

	$("#status >div:nth-child(2)>div:nth-child(2)").html((da[0]).toFixed(this.float_length).toString());
	$("#status >div:nth-child(3)>div:nth-child(2)").html((-da[1]).toFixed(this.float_length).toString());
	$("#status >div:nth-child(4)>div:nth-child(2)").html((z[0]*this.system_impedance).toFixed(this.float_length).toString());
	$("#status >div:nth-child(5)>div:nth-child(2)").html((z[1]*this.system_impedance).toFixed(this.float_length).toString());
	$("#status >div:nth-child(6)>div:nth-child(2)").html((y[0]/this.system_impedance).toFixed(this.float_length).toString());
	$("#status >div:nth-child(7)>div:nth-child(2)").html((y[1]/this.system_impedance).toFixed(this.float_length).toString());
	$("#status >div:nth-child(8)>div:nth-child(2)").html((amp).toFixed(this.float_length).toString());
	$("#status >div:nth-child(9)>div:nth-child(2)").html((theta).toFixed(this.float_length).toString());
	$("#status >div:nth-child(10)>div:nth-child(2)").html((swr).toFixed(this.float_length).toString());
	
    };
    this.get_Z = function(x,t){
	var a,b;
	var root =Math.pow((1-x),2)+ Math.pow(t,2);
	a = (1 - Math.pow(x,2) - Math.pow(t,2))/root;
	b = (-2*t)/root;
	return([a,b]);
    };
    this.get_Y = function(x,y){
	var root = Math.pow(1+x,2) + Math.pow(y,2);
	var a,b;
	a = (1 - Math.pow(x,2) - Math.pow(y,2))/root;
	b = 2*y/root;
	return([a,b]);
    };
    this.load_file = function(ind){
	// load file from local storage
	var fname = s_storage.get_filename(ind);
	logout("fname is :" + fname);

	if(fname == null){
	    warning("Error in loading file");
	    return;
	}
	// delte old data 
	s_data.data = [];
	s_data.matching_data = [];

	// add new data
	var data_length = s_storage.get_data_num(fname);
	logout("length is:" + data_length);
	var i,j;
	for(i = 0; i< data_length; i++){
	    var temp=[];
	    for(j = 0; j< s_storage.dataArrayLength; j++){
		temp.push(s_storage.get_single_data(fname, i,j));
	    }
	    s_data.data.push(temp);
	}
	s_data.refered_data = s_storage.get_data_refered(fname);
	s_data.refered_freq = s_data.data[s_data.refered_data][0];
	
	//add new matching data
	data_length = s_storage.get_matchingdata_num(fname);
	for(i =0; i< data_length; i++){
	    var temp = [];
	    for(j=0; j<s_storage.matchingdataArrayLength; j++){
		temp.push(s_storage.get_single_matchingdata(fname, i,j));
	    }
	    s_data.matching_data.push(temp);
	    s_data.matching_data[i][5] = parseInt(s_data.matching_data[i][5]);
	}

	// reload , reset, update screen display
	s_data.reload();
	s_data.update_matching_result();
	s_graph.draw_smith();
    };
};
// end of peach.smith5.data

peach.smith5.state = {
    state : "",
    yesno : false,
    callback:"",
    temp:"",
    NORMAL_STATE : 0,
    MATCHING_STATE : 1,
    matching_type : "",
    MATCHING_TYPE_PI : 10,
    MATCHING_TYPE_SI : 11,
    MATCHING_TYPE_PC : 12,
    MATCHING_TYPE_SC : 13,
    MATCHING_TYPE_LINE: 14,
    init : function() {
        this.state = this.NORMAL_STATE;
    },
    set : function(s) {
        this.state = s;
    },
    get : function() {
        return this.state;
    },
    reset : function() {
        this.set(s_state.NORMAL_STATE);
        $("#accordion button").removeClass("ui-state-error");
        $("#accordion button").removeClass("ui-state-disabled");
    },
    set_matching_type : function(t) {
        this.matching_type = t;
    },
    get_matching_type : function() {
        return this.matching_type;
    }
};
// end of peach.smith5.state
// naming rule: data0_0, data0_1, data0_2
// naming rule: matching0_0, matching0_1
// add prefix : case1_data1_2
/*
getItem
setItem
clear
removeItem
*/
peach.smith5.storage = function(){
    this.name = "smith5 storage";
    this.currentFileName = "";
    this.fileName = "file";
    this.fileNum = 0;
    this.dataName = "data";
    this.matchingName = "matching";
    this.dataLength = 0;
    this.dataArrayLength = 5;
    this.matchingLength = 0;
    this.matchingdataArrayLength = 7;
    this.bStorage = true;
    this.init = function(){
	//logout("storage init()");
	if(typeof(Storage)!="undefined")
	{
	    this.bStorage = true;
	    var num = localStorage.getItem("fileNum");
	    if(num == null){
		this.fileNum = 0;
		localStorage.setItem("fileNum",0);
	    }
	    else{
		this.fileNum = parseInt(num);
		logout(num);
	    }
	}
	else
	{
	    this.bStorage = false;
	    logout("no storage support.");
	}
    };
    this.check_filename = function(name) {
	var i, bValue;
	bValue = -1;
	logout("name is:" + name);

	for(i =0 ; i< this.fileNum; i++){
	    logout("get " + i + ":" + localStorage.getItem(this.fileName + i));
	    if(localStorage.getItem(this.fileName + i) == name){
		logout("there is something equl, id:" + i);
		bValue = i;
		break;
	    }		
	}
	logout("berfore return check_filename , bValue is:"+ bValue);
	return bValue;
    };
    this.add_filename = function(name){
	// clear existing name data first
	var index = this.check_filename(name);
	logout("index: " + index);
	if (index != -1){
	    logout("to delete it by index:" + index);
	    this.delete_by_index(index);
	}
	// then add new name data
	logout("fileNum is:" + this.fileNum);
	localStorage.setItem(this.fileName + this.fileNum, name);
	this.add_data(this.get_filename(this.fileNum));
	this.add_matchingdata(this.get_filename(this.fileNum));

	this.fileNum++;
	localStorage.setItem("fileNum",this.fileNum);
    };
    this.add_data = function(name){
	var i,j;
	localStorage.setItem(name + "_data_length", s_data.data.length);
	localStorage.setItem(name + "_data_refered", s_data.refered_data);
	for(i = 0; i<s_data.data.length; i++){
	    for(j =0;j< this.dataArrayLength; j++){
		localStorage.setItem(name + "_data" + i + "_" +j, s_data.data[i][j]);
	    }
	}
    };
    this.add_matchingdata = function(name){
	if(s_data.matching_data.length <1)
	    return;
	var i,j;
	localStorage.setItem(name + "_matchingdata_length", s_data.matching_data.length);
	for(i=0; i<s_data.matching_data.length; i++){
	    for(j=0; j<this.matchingdataArrayLength; j++){
		localStorage.setItem(name + "_matchingdata" + i + "_" + j,s_data.matching_data[i][j]);
	    }
	}
    };
    // make file*x* in sequence, be called after only one file is deleted.
    this.sort_index = function(ind){
	logout("into sort_index:" + ind);
	var j;

	for(j = ind;j< this.fileNum-1; j++){
	    var k = j+1;
	    logout(localStorage.getItem(s_storage.fileName +j));
	    logout(localStorage.getItem(s_storage.fileName + k));
	    localStorage.setItem(s_storage.fileName + j, localStorage.getItem(s_storage.fileName + k));
	}
	logout("after shifting data");
	this.fileNum--;
	//this.delete_filename_by_index();
	localStorage.removeItem(this.fileName + this.fileNum);
	localStorage.setItem("fileNum", this.fileNum);
    };
    this.delete_by_index = function (ind){
	logout("into delete by index");
	this.delete_data_by_index(ind);
	this.delete_matchingdata_by_index(ind);
	this.delete_filename_by_index(ind);
	this.sort_index(ind);
    };
    this.delete_data_by_index = function(ind){
	var filename = this.get_filename(ind);
	var len = parseInt(localStorage.getItem(filename + "_data_length"));
	
	var i,j;
	// for every data
	for(i=0;i< len;i++){
	    for(j = 0; j< this.dataArrayLength ; j++){
		localStorage.removeItem(filename + "_data"+ i + "_" + j);
	    }
	}

    };
    this.delete_matchingdata_by_index = function(ind){
	if( localStorage.getItem(this.get_filename(ind) + "_matchingdata_length") == null)
	    return;

	var filename = this.get_filename(ind);
	var len = parseInt(localStorage.getItem(filename + "_matchingdata_length"));
	var i,j;
	// for every data
	for(i=0;i< len;i++){
	    for(j = 0; j< this.matchingdataArrayLength ; j++){
		localStorage.removeItem(filename + "_matchingdata"+ i + "_" + j);
	    }
	}
    };
    this.delete_filename_by_index = function(ind){
	logout("delete filename by index:" + ind);
	localStorage.removeItem(this.filename + ind);
	localStorage.removeItem(this.get_filename(ind) +"_data_refered");
	localStorage.removeItem(this.get_filename(ind) +"_data_length");
	localStorage.removeItem(this.get_filename(ind) +"_matchingdata_length");
    };
    this.clear = function(){
	localStorage.clear();
	s_storage.fileNum = 0;
	localStorage.setItem("fileNum",0);
    };
    this.get_file_num = function(){
	var temp;
	temp = parseInt(localStorage.getItem("fileNum"));
	return temp;
    };
    this.get_filename = function(i){
	return localStorage.getItem(this.fileName + i);
    };
    this.get_data_num = function(name){
	var temp;
	temp = parseInt(localStorage.getItem(name + "_data_length"));
	return temp;
    };
    this.get_single_data = function(name,i,j){
	var temp;
	temp = localStorage.getItem(name + "_data" + i + "_" +j);
	return parseFloat(temp);
    };
    this.get_data_refered = function(name){
	return parseInt(localStorage.getItem(name + "_data_refered"));
    };
    this.get_matchingdata_num = function(name){
	var temp = localStorage.getItem(name + "_matchingdata_length");
	if(temp == null)
	    return 0;
	else
	    return parseInt(temp);
    };
    this.get_single_matchingdata = function(name ,i,j){
	var temp = localStorage.getItem(name + "_matchingdata" + i + "_" + j);
	return parseFloat(temp);
    };
};

function touch_func(e){
    e.preventDefault();
    //alert("touch_func invoked");
    var touches = e.changedTouches;
    if(touches.length > 1){
	//alert("length > 1");
	return false;
    }
    var first = touches[0];
    var type="";
    //alert(e.type);
    switch(e.type){
	case "touchstart": type="mousedown";break;
	case "touchmove": type="mousemove"; break;
	case "touchend": type="mouseup"; break;
	default: 
	return false;
    }
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type,true,true,window,1,
				  first.screenX,first.screenY,
				  first.clientX, first.clientY, false,
				  false,false,false,0,null);
    first.target.dispatchEvent(simulatedEvent);
}
