var LOG_DEBUG=true;

var logout = function(string) {
    if (LOG_DEBUG == true)
        console.log(string);
};

/*
 This is the place to put the prefix definition here,
 following class, object will all use it.
*/
var teapot = {};
if(!teapot) {
    teapot = {};
} else if ( typeof teapot != "object") {
    throw new Error("teapot already exists and it is not an object.");
}

teapot.base = {};
teapot.base.coord_transform = function(point, degree){
    if(degree === 90){
	return {x:-point.y, y:point.x};
    }else if( degree === 180){
	return {x:-point.x,y:-point.y};
    }else if( degree === -90){
	return {x:point.y, y:-point.x};
    }
    return {};
};

