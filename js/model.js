//doc.js
//To contain data, information only

teapot = teapot||{};

teapot.schematic = function(filename){
    var name = filename;
    var pages =[];
    var current_page = 0;
    
    var _add_page = function(page_size){
	var p = new teapot.page();
	p.init(page_size);
	pages.push(p);
    };
    var _get_page_num = function(){
	return pages.length;
    };

    return{
	get_name:function(){
	    return name;
	},
	set_name:function(s){
	    name = s;
	},
	init:function(ob){
	    console.log("into init..");
	},
	add_page: function(size){
	    _add_page(size);
	},
	draw_page: function(context,viewing_info){
	    // draw current page
	    pages[current_page].draw(context, viewing_info);
	},
	get_page_num: function(){
	    return(pages.length);
	},
	set_current_page : function(num){
	    current_page = num;
	},

	get_current_page:function(){
	    return current_page;
	},
	get_current_page_size: function(){
	    return pages[current_page].get_page_size();
	    
	},
	prev_page:function(){
	    var temp;
	    temp = (current_page == 0)?(_get_page_num() - 1 ):(current_page - 1);
	    current_page = temp;
	},
	next_page:function(){
	    var temp;
	    temp = (current_page == (_get_page_num() - 1))?(0):(current_page + 1);
	    current_page = temp;
	},
	delete_page:function(){
	    if(_get_page_num() == 1){
		return;
	    }else{
		//var temp = current_page;
		if( current_page == (_get_page_num() -1)){
		    pages.splice(current_page,1);
		    current_page = (_get_page_num() -1);
		}else{
		    pages.splice(current_page,1);
		}
		
	    }	    
	},
	get_page_info:function(){
	    //of course get current page info
	    return pages[current_page].get_page_info();
	},
	update_page_info:function(view_i){
	    pages[current_page].update_page_info(view_i);
	},
	add_component:function(obj){
	    pages[current_page].add_component(obj);

	},
	get_component_by_position:function(x,y){
	    return pages[current_page].get_component_by_position(x,y);
	},
	set_component_position:function(id,x,y){
	    pages[current_page].set_component_position(id,x,y);
	},
	delete_component:function(d){
	    pages[current_page].delete_component(d);
	},
	undo:function(){
	    pages[current_page].undo();
	},
	redo:function(){
	    pages[current_page].redo();
	},
	record:function(){
	    console.log("into schematic record");
	    pages[current_page].record();
	},
	show_pages:function(){
	    console.log(pages[current_page].records);
	    console.log(pages[current_page].records.length);
	    console.log(pages[current_page].record_index);
	}
    };
};

teapot.page = function(){
    var id = 1; // this id goes with page, it is got every time a new component is created, so it will change during operation
    var MAX_RECORD_STEPS = 10;
    this.records =[];
    this.storage = [0,1,2,3];
    this.record_index = -1;
    this.name = "";
    this.size = "";
    this.components =[];

    this.page_info = {
	grid:0,
	spacing:0,
	x:0,// sheet
	y:0,
	w:0,
	h:0,
	x0:0, //block area in center of the sheet
	y0:0,
	w0:0,
	h0:0
    };
    teapot.page.prototype.get_id = function(){
    // check the largest id number in components[]
	var i , max = 0;
	for (i in this.components){
	    if(this.components[i].get_id() > max){
		max = this.components[i].get_id();
	    }
	}
	return (max + 1);
    };
    teapot.page.prototype.get_max_steps = function(){
	return MAX_RECORD_STEPS;
    };
};
teapot.page.prototype.undo = function(){
    var j,temp,obj;
    if(this.record_index >= 1){
	console.log(this.records);
	console.log("---------");
	this.record_index = this.record_index -1;
	this.components = [];
	for(j =0;j< this.records[this.record_index].length;j++){
	    obj = JSON.parse(this.records[this.record_index][j]);
	    temp = new teapot.model.Component.factory(obj);
	    this.components.push(temp);
	//console.log(this.components);
	}
	console.log(this.records);
    }
    else{
	console.log("end of undo");
    }
};
teapot.page.prototype.redo = function(){
    var j,temp,a,obj;
    if( this.record_index < (this.records.length -1)){
	this.record_index = this.record_index + 1;
	this.components = [];
	for(j =0; j<this.records[this.record_index].length;j++){
	    a = JSON.parse(this.records[this.record_index][j]);
	    obj = new teapot.model.Component.factory(a);
	    this.components.push(obj);
	}
	console.log(this.records);
    }
    else{
	console.log("end of redo");
    }
};
/**
 0,1,2,3,4,.. 9

**/
teapot.page.prototype.record = function(){
    var j, temp;
    // over write
    if( this.record_index < (this.records.length -1)){
	console.log("into record in middle");
	console.log(this.records);
	console.log(this.record_index);
	console.log(this.records.length);
	// remove elements behind record_index
	this.records.splice(this.record_index + 1, this.records.length -1 - this.record_index);
	this.record_index ++;
	this.records[this.record_index] = [];
	for(j=0;j< this.components.length;j++){
	    temp = JSON.stringify(this.components[j].save());
	    this.records[this.record_index].push(temp);
	}
	console.log(this.records);
	console.log(this.record_index);

    }
    else if( this.record_index ==( this.get_max_steps() -1)){
	console.log(this.record_index);
	console.log(this.get_max_steps());

	// remove 1st one
	console.log("record index is:");
	console.log(this.record_index);
	//this.records.shift();
	this.records.splice(0,1);
	this.records[this.record_index]=[];
	for (j=0;j< this.components.length; j++){
	    temp = JSON.stringify(this.components[j].save());
	    this.records[this.record_index].push(temp);
	}
	console.log(this.records);
    }else{
	console.log("into 3rd option");
	console.log(this.components);
	this.record_index++;

	this.records[this.record_index]=[];
	for (j=0;j< this.components.length; j++){
	    temp = JSON.stringify(this.components[j].save());
	    this.records[this.record_index].push(temp);
	}
	console.log(this.records);
    }
};


teapot.page.prototype.get_component_by_id = function(d){
    var i;
    for(i in this.components){
	if(this.components[i].get_id() == d){
	    return this.components[i];
	}
    }
    throw{
	name:"Error",
	message: d + " id doesnt exist."
    };
    return null;
};
teapot.page.prototype.set_component_position = function(d,x,y){
    var i;
    for(i in this.components){
	if(this.components[i].get_id() == d){
	    this.components[i].set_position(x,y);
	}
    }
};

teapot.page.prototype.SIZE = {
    a4:{width:11.69, height:8.27},
    a3:{width:16.54, height:11.69},
    legend:{width:2, height:1}
};
teapot.page.prototype.get_size = function(){
    return this.size;
};
teapot.page.prototype.set_size = function(s){
    this.size = s;
};
teapot.page.prototype.get_page_info = function(){
    return this.page_info;
};
teapot.page.prototype.set_page_info = function(pinfo){
    this.page_info = pinfo;
};
teapot.page.prototype.draw_sheet = function(context,view_i){
    var size = this.get_size();

    if(size =="a3"){
	
    }else if(size == "a4"){
	
	//draw background
	context.save();
	context.fillStyle = view_i.sheet_color;
	context.shadowOffsetX = view_i.sheet_shadow_offset;
	context.shadowOffsetY = view_i.sheet_shadow_offset;;
	context.shadowColor = view_i.sheet_shadow_color;
	context.shadowBlur = 10;
	
	context.fillRect(this.page_info.x,
			 this.page_info.y,
			 this.page_info.w,
			 this.page_info.h);
	
	context.restore();

	//draw the rectangle line
	context.strokeStyle = view_i.sheet_line_color;
	context.width = 2;
	context.strokeRect(this.page_info.x0,
			   this.page_info.y0,
			   this.page_info.w0,
			   this.page_info.h0 );
	//draw grid, cross line first
	var i,j, x_num, len_y, y_num, len_x;
	x_num = Math.floor( (this.page_info.w - 2*this.page_info.spacing)/this.page_info.grid);
	y_num = Math.floor((this.page_info.h - 2*this.page_info.spacing)/this.page_info.grid);
	len_x = this.page_info.w0;
	len_y = this.page_info.h0;

	context.beginPath();
	context.strokeStyle = view_i.sheet_line_color2;//view_i.sheet_line_color2;
	context.lineWidth = 1;
/*	//context.strokeRect( x0 ,y0 , 200, 200);
	for( i = 1; i< x_num +1 ;i++){
	    context.moveTo(this.page_info.x0 + i*this.page_info.grid,this.page_info.y0);//x0 + i*grid, y0);
	    context.lineTo(this.page_info.x0 + i*this.page_info.grid,this.page_info.y0 + len_y);//x0 + i*grid, y0 + len_y);
	}
	for( i = 1; i< y_num + 1;i++){
	    context.moveTo(this.page_info.x0 ,this.page_info.y0 + i*this.page_info.grid);//x0 + i*grid, y0);
	    context.lineTo(this.page_info.x0 + len_x, this.page_info.y0 + i*this.page_info.grid );//x0 + i*grid, y0 + len_y);
	}
*/
	context.stroke();
	context.closePath();
	
    }else{
	console.log("no " + size + "paper supported.");
    }
};
teapot.page.prototype.draw_components = function(context,view_i){
    //console.log("into draw components");
    //console.log(this.components);
    
    var i,temp,x1,y1;
    var page_i = this.get_page_info();
    for(i in this.components){
	temp = this.components[i];
	// get x,y , turn it into coordinate on canvas
	x1 = page_i.x0 + temp.get_position_x()* page_i.grid;
	y1 = page_i.y0 + temp.get_position_y()* page_i.grid;
	temp.draw(context, x1, y1,view_i);
    }
    
};

teapot.page.prototype.init = function(psize){
    console.log(psize);
    
    if( psize != "a3" &&  psize != "a4"){
	console.log("Error! size not correct.");
	return;
    }
    this.size = psize.toLowerCase();
    
    console.log(this.size);
    console.log("end of page init");
};
teapot.page.prototype.draw = function(context, viewing_info){
	//draw background pattern first
    context.fillStyle = viewing_info.background_color;
    context.rect(0 , 0 , viewing_info.canvas_width , viewing_info.canvas_height);
    context.fill();

    // then draw sheet
    console.log("begin to draw sheet");
    this.draw_sheet(context,viewing_info);
    
    // draw component inside components[ ]
    console.log("into draw page components");
    this.draw_components(context, viewing_info);
    
};
teapot.page.prototype.get_page_size = function(){
    return this.SIZE[this.size];
};
teapot.page.prototype.add_component = function(obj){
    obj.set_id(this.get_id());
    this.components.push(obj);
};
teapot.page.prototype.delete_component = function(id){
    var j;
    for( j = this.components.length -1; j>=0; j--){
	if(this.components[j].get_id() === id){
	    this.components.splice(j,1);
	}
    }

};

teapot.page.prototype.update_page_info = function(view_i){
    var spacing, grid, w,h,x0,y0,x,y,w0,h0;
    
    //console.log("update page info----");
    //console.log(this.size);
    
    if(this.size == "a3"){
	    
    }
    else if(this.size == "a4"){
	grid = Math.floor(view_i.grid_size * view_i.dpi * view_i.scaling);
	//console.log(grid);

	x = Math.floor(view_i.offset * view_i.dpi * view_i.scaling) + view_i.sheet_origin_x;
	//console.log(x);
	y = Math.floor(view_i.offset* view_i.dpi * view_i.scaling) + view_i.sheet_origin_y;
	//console.log(y);
	w = Math.floor(this.SIZE[this.size].width * view_i.dpi * view_i.scaling);
	//console.log(w);
	h = Math.floor(this.SIZE[this.size].height * view_i.dpi * view_i.scaling);
	//console.log(h);
	spacing = Math.floor(view_i.sheet_spacing * view_i.dpi * view_i.scaling);
	//console.log(spacing);

	
	x0 = x + spacing;
	y0 = y + spacing;
	w0 = w - 2*spacing;
	h0 = h - 2*spacing;
	
	var page_info = {};
	    
	page_info.y = y; // start of the sheet, almost equals sheet_origin
	page_info.x = x;
	page_info.w = w;
	page_info.h = h;
	page_info.spacing = spacing;
	page_info.grid = grid;
	page_info.x0 = x0; // start of the drawing rectangle
	page_info.y0 = y0;
	page_info.w0 = w0;
	page_info.h0 = h0;
	
	this.set_page_info( page_info);
    }
    else{
	console.log("wrong pape size");
	
    }
};
/**
check if the mouse click point is on any of the components
x_grid,y_grid should something within drawing rectangle area
then judge if click is on components

**/
teapot.page.prototype.get_component_by_position = function(x,y){
    //var xp = x0 - view_i.sheet_origin_x;
    //var yp = y0 - view_i.sheet_origin_y;
    var p_info = this.get_page_info();
    var x_grid, y_grid;
    x_grid = Math.floor((x - p_info.x0)/p_info.grid);
    y_grid = Math.floor(( y- p_info.y0)/p_info.grid);
    var i;
    for(i in this.components){
	if(this.components[i].is_within(x_grid,y_grid) === true){
	    return this.components[i];
	}
    }
    return null;
};
/**
@class Component
*this is a class for component
*/


/**
Like a factory,you get an object from the factory
Based on the type of the component,
all infor about the object is from the factory

**/
teapot.model = {};

teapot.model.Component = function(){
    this.id = 0;
    ////////////////////////////////////////////
    this.position_x = 0;
    this.position_y = 0;
    this.num = -1;
    this.rotate_direction = this.ROTATE_DEFAULT;
    ////////////////////////////////////////////
    this.width_body = 0;
    this.height_body = 0;
    this.left_x_body = 0;
    this.top_y_body = 0;
    this.pins = [];
};

teapot.model.Component.prototype.block_line_color = "black";
teapot.model.Component.prototype.set_block_line_color = function(color){
    //block_line_color = color;
};
teapot.model.Component.prototype.get_block_line_color = function(color){
    return this.block_line_color;
};
// get the max ref number for each Ref , such as R, L, C
// D, U
teapot.model.Component.prototype.sequence_num = (function(){
    var num_base = [];
    return{
	get:function(r){
	    console.log(r);
	    console.log(num_base[r]);
	    if(num_base[r] === undefined){
		num_base[r] = [];
		num_base[r].push(1);
	
		return 1;
	    }
	    else{
		// find a number in num_base[r]
		console.log("find in num_base");
		var j;
		for(j =0;j< num_base[r].length;j++){
		    if( (j+1) < num_base[r][j]){
			num_base[r].push( j+1);
			num_base[r].sort();
			return(j+1);
		    }
		}
		// otherwise, add a new one
		num_base[r].push(num_base[r].length + 1);
		num_base[r].sort();
		return num_base[r].length;
	    }
	},
	set:function(r,n){
	    if(num_base[r] === "undefined"){
		num_base[r] = [];
		num_base[r].push(n);
		num_base[r].sort();//from small to bigger
	    }
	    else{// I will pretend there will be no 2 same ref num
		// No, copy will bring new problems here.
		// I will handle Rf num problems later
		num_base[r].push(n);
		num_base[r].sort();
	    }
	},
	init:function(){

	}
    };
})();
teapot.model.Component.prototype.get_name = function(){
    return "component";
};
teapot.model.Component.prototype.get_id = function(){
    return this.id;
};
teapot.model.Component.prototype.set_id = function(i){
    this.id = i;
};

teapot.model.Component.prototype.set_position = function(x0,y0){
    this.position_x = x0;
    this.position_y = y0;
};

teapot.model.Component.prototype.get_position_x = function(){
    return this.position_x;
};
teapot.model.Component.prototype.get_position_y = function(){
    return this.position_y;
};
teapot.model.Component.prototype.get_block_width = function(){
    return this.width_body;
};
teapot.model.Component.prototype.get_block_height = function(){
    return this.height_body;
};
teapot.model.Component.prototype.get_block_x = function(){
    return this.left_x_body;
};
teapot.model.Component.prototype.get_block_y = function(){
    return this.top_y_body;
};
teapot.model.Component.prototype.is_within = function(x,y){
    var xp,yp,wp,hp,x0,y0;
    x0 = this.get_position_x();
    y0 = this.get_position_y();
    xp = x0 + this.get_block_x();
    yp = y0 + this.get_block_y();
    wp = xp + this.get_block_width();
    hp = yp + this.get_block_height();

    if( x >= xp && x < wp && y >= yp && y < hp){
	return true;
    }
    else
	return false;
};
/**
x,y is not on grid, relative to center position of component
**/
teapot.model.Component.prototype.get_pin_by_position = function(x,y,grid){
// consider rotate position
// all pins are in pins[]
    var j;
    for( j in this.pins){
	if( this.pins[j].is_within(x,y,grid) === true){
	    return this.pins[j];
	}
    }

    return null;
};
teapot.model.Component.prototype.draw_pins = function(context,x0,y0,view_i,grid){
    var i;
    for( i in this.pins){
	this.pins[i].draw(context,x0,y0,view_i,grid);
    }
};

teapot.model.Component.prototype.draw = function(context, x0,y0,view_i){
    var grid, j;
    var x0_block,y0_block;
    var rotation = this.get_rotate();
    var w,h;
    var start_r,end_r,x0_r,y0_r;
    var x_r,y_r,radius_r, theta_start_r, theta_end_r;
    var temp;

    grid = Math.floor(view_i.grid_size * view_i.dpi * view_i.scaling);

    context.save();
    context.strokeStyle = "yellow";

    // draw block, this is right.
    if( rotation === this.ROTATE_DEFAULT || rotation === this.ROTATE_CLOCKWISE_180){
	w = this.width;
	h = this.height;
    }else{
	w = this.height;
	h = this.width;
    }
    x0_block = Math.floor(x0 - w*grid/2);
    y0_block = Math.floor(y0 - h*grid/2);    
    context.strokeRect(x0_block,y0_block,w*grid, h*grid);


    // draw inside block 
    if(this.bDrawing === false){
	//grid_size = this
	//x0_block = Math.floor(x0 - this.width*grid/2);
	//y0_block = Math.floor(y0 - this.height*grid/2);
	//context.strokeRect(x0_block,y0_block,this.width*grid, this.height*grid);
    }
    else{// draw based on drawing
	context.strokeStyle = this.get_block_line_color();
	if( this.drawing.lines.length != 0){
	    var lines = this.drawing.lines;

	    context.beginPath();
	    for (j in lines){
		if( rotation === this.ROTATE_DEFAULT){
		    start_r = lines[j].start;
		    end_r = lines[j].end;
		}else if(rotation === this.ROTATE_CLOCKWISE_90){
		    start_r = teapot.base.coord_transform(lines[j].start,90);
		    end_r = teapot.base.coord_transform(lines[j].end, 90);
		}else if( rotation === this.ROTATE_CLOCKWISE_180){
		    start_r = teapot.base.coord_transform(lines[j].start,180);
		    end_r = teapot.base.coord_transform(lines[j].end, 180);
		}else if( rotation === this.ROTATE_COUNTER_CLOCKWISE_90){
		    start_r = teapot.base.coord_transform(lines[j].start,-90);
		    end_r = teapot.base.coord_transform(lines[j].end, -90);
		}
		context.moveTo( x0 + start_r.x * grid,
				y0 + start_r.y * grid);
		context.lineTo( x0 + end_r.x * grid,
				y0 + end_r.y * grid);
	    }

	    //context.closePath();
	    context.stroke();
	}
	if(this.drawing.arcs.length != 0){
	    var arcs =  this.drawing.arcs;
	    
	    for( j in arcs ){
		//console.log("into arcs drawing");
		context.beginPath();
		if( rotation === this.ROTATE_DEFAULT){
		    x_r = arcs[j].x;
		    y_r = arcs[j].y;
		    radius_r = arcs[j].r;
		    theta_start_r = arcs[j].start;
		    theta_end_r = arcs[j].end;

		}else if(rotation === this.ROTATE_CLOCKWISE_90){
		    temp = {x:arcs[j].x,y:arcs[j].y};
		    temp = teapot.base.coord_transform(temp,90);
		    x_r = temp.x;
		    y_r = temp.y;
		    radius_r = arcs[j].r;
		    theta_start_r = arcs[j].start + 90;
		    theta_end_r = arcs[j].end + 90;
		}else if( rotation === this.ROTATE_CLOCKWISE_180){
		    temp = {x:arcs[j].x,y:arcs[j].y};
		    temp = teapot.base.coord_transform(temp,180);
		    x_r = temp.x;
		    y_r = temp.y;
		    radius_r = arcs[j].r;
		    theta_start_r = arcs[j].start + 180;
		    theta_end_r = arcs[j].end + 180;

		}else if( rotation === this.ROTATE_COUNTER_CLOCKWISE_90){
		    temp = {x:arcs[j].x,y:arcs[j].y};
		    temp = teapot.base.coord_transform(temp,-90);
		    x_r = temp.x;
		    y_r = temp.y;
		    radius_r = arcs[j].r;
		    theta_start_r = arcs[j].start - 90;
		    theta_end_r = arcs[j].end - 90;
		}

		context.arc(x0 + x_r * grid, 
			    y0 + y_r * grid, 
			    radius_r * grid,
			    theta_start_r *Math.PI/180, 
			    theta_end_r *Math.PI/180, 
			    arcs[j].anticlockwise);

		context.stroke();
	    }
	    //context.closePath();
	    
	}
	
    }
    
    // draw pins
    this.draw_pins(context, x0, y0, view_i,grid);
    
    //console.log("draw");
    context.restore();
    
};
teapot.model.Component.prototype.draw_faint = function(context, x0,y0,view_i){
    var x0_block,y0_block,grid;
    var rotation = this.get_rotate();
    var w,h;

    if( rotation === this.ROTATE_DEFAULT || rotation === this.ROTATE_CLOCKWISE_180){
	w = this.width;
	h = this.height;
    }else{
	w = this.height;
	h = this.width;
    }

    grid = Math.floor(view_i.grid_size * view_i.dpi * view_i.scaling);
    x0_block = Math.floor(x0 - w*grid/2);
    y0_block = Math.floor(y0 - h*grid/2);    

    
    this.draw(context,x0,y0,view_i);
    context.save();
    // draw a faint rectangle over it
    context.fillStyle = view_i.moving_color;
    context.fillRect(x0_block,y0_block,w*grid, h*grid);
    //context.fillRect(0,0,20,20);

    context.restore();
};

teapot.model.Component.prototype.draw_glow = function(context, x0,y0,view_i){
    var grid,x0_block,y0_block;
    var rotation = this.get_rotate();
    var w,h;

    if( rotation === this.ROTATE_DEFAULT || rotation === this.ROTATE_CLOCKWISE_180){
	w = this.width;
	h = this.height;
    }else{
	w = this.height;
	h = this.width;
    }

    grid = Math.floor(view_i.grid_size * view_i.dpi * view_i.scaling);

    x0_block = Math.floor(x0 - w*grid/2);
    y0_block = Math.floor(y0 - h*grid/2);    
    
    context.save();
    context.fillStyle = view_i.glowing_color;
    context.fillRect(x0_block,y0_block,w*grid, h*grid);

    context.restore();
};

teapot.model.Component.prototype.mark_block = function(context, p_info,view_i){
    context.save();
    context.strokeStyle = view_i.mark_color;
    context.lineWidth = view_i.mark_line_width;
    var x,y,w,h;

    x = (this.get_position_x() + this.get_block_x()) * p_info.grid + p_info.x0;
    y = (this.get_position_y() + this.get_block_y()) * p_info.grid + p_info.y0;
    w = this.get_block_width()* p_info.grid;
    h = this.get_block_height()* p_info.grid;

    context.strokeRect(x,y,w,h);
    context.restore();
};
teapot.model.Component.prototype.unmark_block = function(context){


};

teapot.model.Component.prototype.rotate = function(){
// rotate the component, change everyting concerned with drawing, lines and pins
    if(this.get_rotate() === this.ROTATE_DEFAULT){
	console.log("rotate 90 degree");
	this.set_rotate(this.ROTATE_CLOCKWISE_90);
    }else if( this.get_rotate() === this.ROTATE_CLOCKWISE_90){
	this.set_rotate(this.ROTATE_CLOCKWISE_180);
    }else if( this.get_rotate() === this.ROTATE_COUNTER_CLOCKWISE_90){
	this.set_rotate(this.ROTATE_DEFAULT);
    }else if( this.get_rotate() === this.ROTATE_CLOCKWISE_180){
	this.set_rotate(this.ROTATE_COUNTER_CLOCKWISE_90);
    }else{
	throw{
	    name:"ERROR"
	};
    }
    this.reset_rotate();
};

teapot.model.Component.prototype.rotate_counter = function(){
    if(this.get_rotate() === this.ROTATE_DEFAULT){
	this.set_rotate(this.ROTATE_COUNTER_CLOCKWISE_90);
    }else if( this.get_rotate() === this.ROTATE_CLOCKWISE_90){
	this.set_rotate(this.ROTATE_DEFAULT);
    }else if( this.get_rotate() === this.ROTATE_COUNTER_CLOCKWISE_90){
	this.set_rotate(this.ROTATE_CLOCKWISE_180);
    }else if( this.get_rotate() === this.ROTATE_CLOCKWISE_180){
	this.set_rotate(this.ROTATE_CLOCKWISE_90);
    }else{
	throw{
	    name:"ERROR"
	};
    }
    this.reset_rotate();
};

teapot.model.Component.prototype.init_pins = function(inf){
    // should based on rotate_direction to set pin position
    // alternate info.pins[] information accordingly

    var i;
    var info_r,info= inf;
    var rotation = this.get_rotate();
    var temp;

    console.log("inside init pins ");
    console.log(info);

    this.pins = [];
    // init pin objects
    if(info.top_pins.length !== 0){
	console.log("init top pins");
	//console.log(info.top_pins.length);
	for( i in info.top_pins){
	    //console.log(info.top_pins[i]);
	    temp = new teapot.model.Pin.factory(info.top_pins[i]);

	    if( rotation === this.ROTATE_DEFAULT){
		;
	    }else if(rotation === this.ROTATE_CLOCKWISE_90){
		temp.set_position_start(teapot.base.coord_transform(temp.get_position_start(),90));
		temp.set_position_end(teapot.base.coord_transform(temp.get_position_end(),90));
	    }else if( rotation === this.ROTATE_CLOCKWISE_180){
		temp.set_position_start(teapot.base.coord_transform(temp.get_position_start(),180));
		temp.set_position_end(teapot.base.coord_transform(temp.get_position_end(),180));
	    }else if( rotation === this.ROTATE_COUNTER_CLOCKWISE_90){
		temp.set_position_start(teapot.base.coord_transform(temp.get_position_start(),-90));
		temp.set_position_end(teapot.base.coord_transform(temp.get_position_end(),-90));
	    }
 	    
	    this.pins.push(temp );
	}
    }
    if(info.bottom_pins.length !== 0){
	for( i in info.bottom_pins){
	    temp = new teapot.model.Pin.factory(info.bottom_pins[i]);

	    if( rotation === this.ROTATE_DEFAULT){
		;
	    }else if(rotation === this.ROTATE_CLOCKWISE_90){
		temp.set_position_start(teapot.base.coord_transform(temp.get_position_start(),90));
		temp.set_position_end(teapot.base.coord_transform(temp.get_position_end(),90));
	    }else if( rotation === this.ROTATE_CLOCKWISE_180){
		temp.set_position_start(teapot.base.coord_transform(temp.get_position_start(),180));
		temp.set_position_end(teapot.base.coord_transform(temp.get_position_end(),180));
	    }else if( rotation === this.ROTATE_COUNTER_CLOCKWISE_90){
		temp.set_position_start(teapot.base.coord_transform(temp.get_position_start(),-90));
		temp.set_position_end(teapot.base.coord_transform(temp.get_position_end(),-90));
	    }
 	    
	    this.pins.push(temp );
	}
    }
    if(info.left_pins.length !== 0){
	for( i in info.left_pins){

	    temp = new teapot.model.Pin.factory(info.left_pins[i]);

	    if( rotation === this.ROTATE_DEFAULT){
		;
	    }else if(rotation === this.ROTATE_CLOCKWISE_90){
		temp.set_position_start(teapot.base.coord_transform(temp.get_position_start(),90));
		temp.set_position_end(teapot.base.coord_transform(temp.get_position_end(),90));
	    }else if( rotation === this.ROTATE_CLOCKWISE_180){
		temp.set_position_start(teapot.base.coord_transform(temp.get_position_start(),180));
		temp.set_position_end(teapot.base.coord_transform(temp.get_position_end(),180));
	    }else if( rotation === this.ROTATE_COUNTER_CLOCKWISE_90){
		temp.set_position_start(teapot.base.coord_transform(temp.get_position_start(),-90));
		temp.set_position_end(teapot.base.coord_transform(temp.get_position_end(),-90));
	    }
 	    
	    this.pins.push(temp );
	}
    }
    if(info.right_pins.length !== 0){
	for( i in info.right_pins){
	    temp = new teapot.model.Pin.factory(info.right_pins[i]);

	    if( rotation === this.ROTATE_DEFAULT){
		;
	    }else if(rotation === this.ROTATE_CLOCKWISE_90){
		temp.set_position_start(teapot.base.coord_transform(temp.get_position_start(),90));
		temp.set_position_end(teapot.base.coord_transform(temp.get_position_end(),90));
	    }else if( rotation === this.ROTATE_CLOCKWISE_180){
		temp.set_position_start(teapot.base.coord_transform(temp.get_position_start(),180));
		temp.set_position_end(teapot.base.coord_transform(temp.get_position_end(),180));
	    }else if( rotation === this.ROTATE_COUNTER_CLOCKWISE_90){
		temp.set_position_start(teapot.base.coord_transform(temp.get_position_start(),-90));
		temp.set_position_end(teapot.base.coord_transform(temp.get_position_end(),-90));
	    }
 	    
	    this.pins.push(temp );
	}
    }
    
};

teapot.model.Component.prototype.init_block = function(info){
    // should based on rotation
    // change block information accordingly
    var rotation = this.get_rotate();
    var w,h,x,y;



    
    if( rotation === this.ROTATE_DEFAULT){
	w = this.width;
	h = this.height;
	x = -this.width/2;
	y  = -this.height/2;

	if(info.left_pins.length != 0){
	    w += this.PIN_LENGTH;
	    x -= this.PIN_LENGTH;
	} 
	if(info.right_pins.length != 0){
	    w += this.PIN_LENGTH;
	}
	if(info.top_pins.length != 0){
	    h += this.PIN_LENGTH;
	    y -= this.PIN_LENGTH;
	}
	if(info.bottom_pins.length != 0){
	    h += this.PIN_LENGTH;
	}

    }else if(rotation === this.ROTATE_CLOCKWISE_90){
	w = this.height;
	h = this.width;
	x = -w/2;
	y  = -h/2;


	if(info.left_pins.length != 0){
	    h += this.PIN_LENGTH;
	    y -= this.PIN_LENGTH;
	} 
	if(info.right_pins.length != 0){
	    h += this.PIN_LENGTH;
	}
	if(info.top_pins.length != 0){
	    w += this.PIN_LENGTH;
	}
	if(info.bottom_pins.length != 0){
	    w += this.PIN_LENGTH;
	    x -= this.PIN_LENGTH;
	}

    }else if( rotation === this.ROTATE_CLOCKWISE_180){
	w = this.width;
	h = this.height;
	x = -this.width/2;
	y  = -this.height/2;


	if(info.left_pins.length != 0){
	    w += this.PIN_LENGTH;
	} 
	if(info.right_pins.length != 0){
	    w += this.PIN_LENGTH;
	    x -= this.PIN_LENGTH;
	}
	if(info.top_pins.length != 0){
	    h += this.PIN_LENGTH;
	}
	if(info.bottom_pins.length != 0){
	    h += this.PIN_LENGTH;
	    y -= this.PIN_LENGTH;
	}

    }else if( rotation === this.ROTATE_COUNTER_CLOCKWISE_90){
	w = this.height;
	h = this.width;
	x = -w/2;
	y  = -h/2;

	if(info.left_pins.length != 0){
	    h += this.PIN_LENGTH;
	} 
	if(info.right_pins.length != 0){
	    h += this.PIN_LENGTH;
	    y -= this.PIN_LENGTH;
	}
	if(info.top_pins.length != 0){
	    w += this.PIN_LENGTH;
	    x -= this.PIN_LENGTH;
	}
	if(info.bottom_pins.length != 0){
	    w += this.PIN_LENGTH;
	}
    }
    
    this.width_body = w;
    this.height_body = h;
    this.left_x_body = x;
    this.top_y_body = y;
};
teapot.model.Component.prototype.init = function(typ){
    if(typeof typ === "object"){
	this.set_model_name(typ.type);
	this.set_num(typ.num);
	this.sequence_num.set(this.get_ref(),this.get_num());
	this.set_rotate(typ.rotate);
	this.set_position(typ.x0,typ.y0);
    }else{
	this.set_num(this.sequence_num.get(this.get_ref()));
    }

    console.log("init pins");
    this.init_pins(this.pin_definition);
    console.log("init block");
    this.init_block(this.pin_definition);
    console.log("init basic info from typ");


};
teapot.model.Component.prototype.set_model_name = function(n){
    this.model_name = n;
};
teapot.model.Component.prototype.set_num = function(n){
    this.num = n;
};
teapot.model.Component.prototype.get_num = function(){
    return this.num;
};
teapot.model.Component.prototype.set_rotate = function(n){
    this.rotate_direction = n;
};
teapot.model.Component.prototype.save = function(){
    console.log("into save()");
    var str = {};
    str.type = this.model_name;
    str.num = this.num;
    str.rotate = this.rotate_direction;
    str.x0 = this.position_x;
    str.y0 = this.position_y;
    console.log(str);
    console.log("out of save()");
    return str;
};
teapot.model.Component.prototype.get_id = function(){
    return this.id;
};
teapot.model.Component.prototype.set_id = function(i){
    this.id = i;
};
teapot.model.Component.prototype.get_ref = function(){
    return this.ref;
};
teapot.model.Component.prototype.get_rotate = function(){
    return this.rotate_direction;
};
teapot.model.Component.prototype.set_rotate = function(d){
    this.rotate_direction = d;
};

teapot.model.Component.prototype.PIN_LENGTH = 2;
teapot.model.Component.prototype.ROTATE_DEFAULT  = 0;
teapot.model.Component.prototype.ROTATE_CLOCKWISE_90  = 1;
teapot.model.Component.prototype.ROTATE_COUNTER_CLOCKWISE_90  = 2;
teapot.model.Component.prototype.ROTATE_CLOCKWISE_180  = 3;

teapot.model.Component.prototype.PIN_TYPE_IN = "input";
teapot.model.Component.prototype.PIN_TYPE_OUT = "output";
teapot.model.Component.prototype.PIN_TYPE_IN_OUT = "in_output";

teapot.model.Component.prototype.PIN_ELECTRICAL_POWER = 301;
teapot.model.Component.prototype.PIN_ELECTRICAL_GROUND = 302;
teapot.model.Component.prototype.PIN_ELECTRICAL_IO = 303;
teapot.model.Component.prototype.PIN_ELECTRICAL_NC = 304;

/**
This function is used to reset drawing items based on direction setting.
It may be a complicated function.

basic information:(won't change at any time)
drawing
pin_definition

what would be changed during direction change:
this.width, height,
this.width_body, height_body, left_x_body, top_y_body

or, I just change draw() function 


**/
teapot.model.Component.prototype.reset_rotate = function(){
//change this.width, this.height

//    var proto = teapot.model.Component.factory(this.model_name);
//    console.log(proto.get_model_name());
    this.init_pins(this.pin_definition);
    this.init_block(this.pin_definition);

};

teapot.model.Component.prototype.draw_block = function(context,x0,y0){

};

/**
type is a simple string
or is an object

**/
teapot.model.Component.factory = function(type1){
    var constr, newcomponent;

    if(typeof type1 === "string"){
	constr = type1;
    }
    else if(typeof type1 === "object"){
	constr = type1.type;
    }
    else{
	throw{
	    name:"Error",
	    message: type1 + " is not valid."
	};
    }

    if(typeof teapot.model.Component[constr]!= "function"){
	throw{
	    name:"Error",
	    message: constr + " doesn't exist."
	};
    }
    
    if( typeof teapot.model.Component[constr].prototype.get_name !== "function"){
	teapot.model.Component[constr].prototype = new teapot.model.Component();
    }

    newcomponent = new teapot.model.Component[constr](type1);
    //newcomponent.prototype = new teapot.model.Component();

    return newcomponent;
};

/**
typ={
 
type:model_name,
 num:1,// with this.ref to form the reference name
 rotate: 0;
 x0:0,
 y0:0

}
****/
teapot.model.Component.standard_pwr = function(typ){
    this.width = 2;
    this.height = 2;
    this.ref = "";
    this.bRef_display = false;
    this.model_name = "standard_pwr";
    this.bModel_name_display = false;
    this.type = this.TYPE_STANDARD;
    this.info = {};
    this.drawing = {
	lines:[
	    {start:{x:-1,y:1},end:{x:1,y:1}}
	],
	circles:[],
	arcs:[]
    };
    this.bDrawing = true;

    // this is to get a copy of parent members,
    // I only need enter below 1 function to inherit from parent member
    teapot.model.Component.apply(this,arguments);
    
    this.pin_definition = {
	top_pins:[],
	bottom_pins:[{
	    position_start:{x:0,y:1},
	    position_end:{x:0, y:3},
	    type: this.PIN_TYPE_IN_OUT,
	    electrical: this.PIN_ELECTRICAL_POWER,
	    number:0,
	    name:""
	}],
	left_pins:[],
	right_pins:[]
    };


    this.init(typ);
};



teapot.model.Component.standard_gnd = function(typ){
    this.width = 2;
    this.height = 2;
    this.ref = "";
    this.bRef_display = false;
    this.model_name = "standard_gnd";
    this.bModel_name_display = false;
    this.type = this.TYPE_STANDARD;
    this.info = {};
    this.drawing = {
	lines:[
	    {start:{x:-1,y:-1},end:{x:1,y:-1}},
	    {start:{x:-0.6,y:-0.4},end:{x:0.6,y:-0.4}},
	    {start:{x:-0.3,y:0.2},end:{x:0.3,y:0.2}}
	],
	circles:[],
	arcs:[]
    };
    this.bDrawing = true;

    // this is to get a copy of parent members,
    // I only need enter below 1 function to inherit from parent member
    teapot.model.Component.apply(this,arguments);
    
    this.pin_definition = {
	top_pins:[{
	    position_start:{x:0,y:-1},
	    position_end:{x:0, y:-3},
	    type: this.PIN_TYPE_IN_OUT,
	    electrical: this.PIN_ELECTRICAL_GROUND,
	    number:0,
	    name:""
	}],
	bottom_pins:[],
	left_pins:[],
	right_pins:[]
    };

    this.init(typ);
};

teapot.model.Component.standard_offpage = function(typ){
    this.width = 3;
    this.height = 2;
    this.ref = "";
    this.bRef_display = false;
    this.model_name = "standard_offpage";
    this.bModel_name_display = false;
    this.type = this.TYPE_STANDARD;
    this.info = {};
    this.drawing = {
	lines:[
	    {start:{x:-1.5,y:-0.5},end:{x:-1.5,y:0.5}},
	    {start:{x:-1.5,y:-0.5},end:{x:1,y:-0.5}},
	    {start:{x:-1.5,y:0.5},end:{x:1,y:0.5}},
	    {start:{x:1,y:-0.5},end:{x:1.5,y:0}},
	    {start:{x:1,y:0.5},end:{x:1.5,y:0}}
	],
	circles:[],
	arcs:[]
    };
    this.bDrawing = true;

    // this is to get a copy of parent members,
    // I only need enter below 1 function to inherit from parent member
    teapot.model.Component.apply(this,arguments);
    
    this.pin_definition = {
	top_pins:[],
	bottom_pins:[],
	left_pins:[{
	    position_start:{x:-1.5,y:0},
	    position_end:{x:-3.5, y:0},
	    type: this.PIN_TYPE_IN_OUT,
	    electrical: this.PIN_ELECTRICAL_IO,
	    number:0,
	    name:""
	}],
	right_pins:[]
    };

    this.init(typ);
};

teapot.model.Component.standard_resistor = function(typ){
    this.width = 4;
    this.height = 2;
    this.ref = "R";
    this.bRef_display = false;
    this.model_name = "standard_resistor";
    this.bModel_name_display = false;
    this.type = this.TYPE_STANDARD;
    this.info = {};
    this.drawing = {
	lines:[
	    {start:{x:-2,y:-0.5},end:{x:-2,y:0.5}},
	    {start:{x:2,y:-0.5},end:{x:2,y:0.5}},
	    {start:{x:-2,y:0.5},end:{x:2,y:0.5}},
	    {start:{x:-2,y:-0.5},end:{x:2,y:-0.5}}
	],
	circles:[],
	arcs:[]
    };
    this.bDrawing = true;

    // this is to get a copy of parent members,
    // I only need enter below 1 function to inherit from parent member
    teapot.model.Component.apply(this,arguments);
    
    this.pin_definition = {
	top_pins:[],
	bottom_pins:[],
	left_pins:[{
	    position_start:{x:-2,y:0},
	    position_end:{x:-4, y:0},
	    type: this.PIN_TYPE_IN_OUT,
	    electrical: this.PIN_ELECTRICAL_IO,
	    number:0,
	    name:""
	}],
	right_pins:[{
	    position_start:{x:2,y:0},
	    position_end:{x:4, y:0},
	    type: this.PIN_TYPE_IN_OUT,
	    electrical: this.PIN_ELECTRICAL_IO,
	    number:0,
	    name:""
	}]
    };

    this.init(typ);


};

teapot.model.Component.standard_capacitor = function(typ){
    this.width = 4;
    this.height = 2;
    this.ref = "C";
    this.bRef_display = false;
    this.model_name = "standard_capacitor";
    this.bModel_name_display = false;
    this.type = this.TYPE_STANDARD;
    this.info = {};
    this.drawing = {
	lines:[
	    {start:{x:-2,y:0},end:{x:-0.5,y:0}},
	    {start:{x:2,y:0},end:{x:0.5,y:0}},
	    {start:{x:0.5,y:0.8},end:{x:0.5,y:-0.8}},
	    {start:{x:-0.5,y:0.8},end:{x:-0.5,y:-0.8}}
	],
	circles:[],
	arcs:[]
    };
    this.bDrawing = true;

    // this is to get a copy of parent members,
    // I only need enter below 1 function to inherit from parent member
    teapot.model.Component.apply(this,arguments);
    
    this.pin_definition = {
	top_pins:[],
	bottom_pins:[],
	left_pins:[{
	    position_start:{x:-2,y:0},
	    position_end:{x:-4, y:0},
	    type: this.PIN_TYPE_IN_OUT,
	    electrical: this.PIN_ELECTRICAL_IO,
	    number:0,
	    name:""
	}],
	right_pins:[{
	    position_start:{x:2,y:0},
	    position_end:{x:4, y:0},
	    type: this.PIN_TYPE_IN_OUT,
	    electrical: this.PIN_ELECTRICAL_IO,
	    number:1,
	    name:""
	}]
    };

    this.init(typ);
};
teapot.model.Component.standard_inductor = function(typ){
    this.width = 4;
    this.height = 2;
    this.ref = "L";
    this.bRef_display = false;
    this.model_name = "standard_inductor";
    this.bModel_name_display = false;
    this.type = this.TYPE_STANDARD;
    this.info = {};
    this.drawing = {
	lines:[],
	circles:[],
	arcs:[{x:-1.5,y:0,r:0.5,start:0,end:180,anticlockwise:true},
	      {x:-0.5,y:0,r:0.5,start:0,end:180,anticlockwise:true},
	      {x:0.5,y:0,r:0.5,start:0,end:180,anticlockwise:true},
	      {x:1.5,y:0,r:0.5,start:0,end:180,anticlockwise:true}
	     ]
    };
    this.bDrawing = true;

    // this is to get a copy of parent members,
    // I only need enter below 1 function to inherit from parent member
    teapot.model.Component.apply(this,arguments);
    
    this.pin_definition = {
	top_pins:[],
	bottom_pins:[],
	left_pins:[{
	    position_start:{x:-2,y:0},
	    position_end:{x:-4, y:0},
	    type: this.PIN_TYPE_IN_OUT,
	    electrical: this.PIN_ELECTRICAL_IO,
	    number:0,
	    name:""
	}],
	right_pins:[{
	    position_start:{x:2,y:0},
	    position_end:{x:4, y:0},
	    type: this.PIN_TYPE_IN_OUT,
	    electrical: this.PIN_ELECTRICAL_IO,
	    number:0,
	    name:""
	}]
    };

    this.init(typ);
};

/**
*
@class Pin
* this class is for pin definition
*/
teapot.model.Pin = function(){
    var name = "pin";
    var pin_color = "blue";
    teapot.model.Pin.prototype.get_name = function(){
	return name;
    };
    teapot.model.Pin.prototype.get_pin_color = function(){
	return pin_color;
    };
    teapot.model.Pin.prototype.set_pin_color = function(c){
	pin_color = c;
    };
    
};
/**
x,y is relative to component center position
**/
teapot.model.Pin.prototype.is_within = function(x,y,grid){
    var st,ed,x1,y1,x2,y2;
    st = this.get_position_start();
    ed = this.get_position_end();
    x1 = st.x * grid;
    y1 = st.y * grid;
    x2 = ed.x * grid;
    y2 = ed.y * grid;

    // this is wrong here! not consider pin direction
    //left
    if(st.y === ed.y && st.x< ed.x){//right
	if( x >= (st.x*grid -this.delta) && x<= (ed.x*grid +this.delta) && y >= (st.y*grid - this.delta) && y <= (ed.y*grid + this.delta)){
	    return true;
	}else{	    return false;    }    

    }
    else if(st.y === ed.y && st.x> ed.x){//left
	if( x <= (st.x*grid -this.delta) && x>= (ed.x*grid +this.delta) && y >= (st.y*grid - this.delta) && y <= (ed.y*grid + this.delta)){
	    return true;
	}else{	    return false;    }    
    
    }else if(st.x === ed.x && st.y > ed.y){ // top
	if( y <= (st.y*grid  + this.delta) && y >= (ed.y*grid  -this.delta) && x >= (st.x*grid - this.delta) && x <= (ed.x*grid + this.delta)){
	    return true;
	}else{	    return false;    }    


    }else if(st.x === ed.x && st.y < ed.y){ // bottom
	if( y >= (st.y*grid  - this.delta) && y <= (ed.y*grid  +this.delta) && x >= (st.x*grid - this.delta) && x <= (ed.x*grid + this.delta)){
	    return true;
	}else{	    return false;    }    
	

    }else{
	throw{
	    name:"Error"
	};
    }
};	


teapot.model.Pin.prototype.delta = 2;// 2px within pin line

teapot.model.Pin.prototype.get_position_start = function(){
    return this.position_start;
};
teapot.model.Pin.prototype.get_position_end = function(){
    return this.position_end;
};
teapot.model.Pin.prototype.set_position_start = function(p){
    this.position_start = p;
};
teapot.model.Pin.prototype.set_position_end = function(p){
    this.position_end = p;
};

teapot.model.Pin.factory = function(info){
    var constr = info.type, newpin;

    if(typeof teapot.model.Pin[constr]!= "function"){
	throw{
	    name:"Error",
	    message: constr + " doesn't exist."
	};
    }
    
    teapot.model.Pin[constr].prototype = new teapot.model.Pin();

    newpin = new teapot.model.Pin[constr](info);

    return newpin;    
};

teapot.model.Pin.input = function(info){
    this.position_start = info.position_start;
    this.position_end = info.position_end;
    this.type = info.type;
    this.electrical = info.electrical;
    this.number = info.number;
    this.name = info.name;

    this.draw = function(context, x0, y0, view_i){

    };
};
teapot.model.Pin.output = function(info){
    this.position_start = info.position_start;
    this.position_end = info.position_end;
    this.type = info.type;
    this.electrical = info.electrical;
    this.number = info.number;
    this.name = info.name;

    this.draw = function(context, x0, y0, view_i){

    };
};
teapot.model.Pin.in_output = function(info){
    this.position_start = info.position_start;
    this.position_end = info.position_end;
    this.type = info.type;
    this.electrical = info.electrical;
    this.number = info.number;
    this.name = info.name;

    teapot.model.Pin.in_output.prototype.draw = function(context, x0, y0, view_i, grid){
	context.save();
	context.strokeStyle = this.get_pin_color();
	context.beginPath();
	context.moveTo(x0 + grid*this.position_start.x, y0+ grid*this.position_start.y);
	context.lineTo(x0 + grid*this.position_end.x, y0 + grid*this.position_end.y);
	context.stroke();
	context.restore();
    };

    teapot.model.Pin.in_output.prototype.mark = function(context, x0, y0, view_i, grid){
	context.save();
	context.strokeStyle = view_i.pin_mark_color;
	context.beginPath();
	context.moveTo(x0 + grid*this.position_start.x, y0+ grid*this.position_start.y);
	context.lineTo(x0 + grid*this.position_end.x, y0 + grid*this.position_end.y);
	context.stroke();
	context.restore();
    };
};
