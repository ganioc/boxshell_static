// javascript for bs_register.html manipulation
function mark_error(name){
    $("#"+name).parent().addClass("has-error");
    $("#"+name).next().addClass("glyphicon-remove");
    $("#"+name).next().next().fadeIn();
    
}
function clear_error(name){
    $("#"+name).parent().removeClass("has-error has-success");
    $("#"+name).next().removeClass("glyphicon-remove glyphicon-ok");
    $("#"+name).next().next().fadeOut();

}
function mark_success(name){
    $("#"+name).parent().addClass("has-success");
    $("#"+name).next().addClass("glyphicon-ok");
    $("#"+name).next().next().fadeOut();


}
function validate_pattern(name,pattern){
    //var pattern = /^[A-Za-z]+[A-Za-z0-9-_]*$/;
    if(name.search(pattern) === 0){
	return true;
    }
    else{
	return false;
    }
}
function validate_username(){
    var name = $("#name_register").val();
    if(name.length > 30){
	return false;
    }
    else
	return validate_pattern(name,/^[A-Za-z]+[A-Za-z0-9-_]*$/);
}

function validate_emailaddress(){
    var address = $("#email_register").val();
    if(address.length > 60){
	return false;
    }
    else
	return validate_pattern(address,/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

}

function validate_password(){
    var pwd = $("#pwd_register").val();
    if(pwd.length <3 || pwd.length > 40){
	return false;
    }
    else
	return true;
}
function validate_password2(){
    var pwd2 = $("#pwd2_register").val();
    var pwd1 = $("#pwd_register").val();
    if(pwd2.length === 0){
	return false;
    }
    else if(pwd2 !== pwd1){
	return false;
    }
    else
	return true;
}


function check_warning(name){
    if( name === "checkbox_terms"){
	return !$("#checkbox_terms").prop('checked');
    }
    //else
    if( $("#"+name).next().next().css("display") === "block")
	return true;
    else
	return false;
}
// this function is for submit button checking
function validate(){
    if(check_warning("name_register") === false &&
      check_warning("email_register") === false &&
      check_warning("pwd_register") === false &&
      check_warning("pwd2_register") === false &&
      check_warning("checkbox_terms") === false){
	return true;
    }
    if(check_warning("checkbox_terms") === false){
	// show the tooltip on submit button
	$("#checkbox_terms").tooltip('enable');
    }
    return false;

}
function keyup_callback(){
    var validate_input = {
	'name_register':validate_username,
	'email_register':validate_emailaddress,
	'pwd_register':validate_password,
	'pwd2_register':validate_password2
    };
    return function(e){
	if(validate_input[e.target.id]()===true){
	    if(check_warning(e.target.id) === true){
		clear_error(e.target.id);
		mark_success(e.target.id);
	    }
	    else 
		mark_success(e.target.id);
	}
	else{
	    if( check_warning(e.target.id) === false){
		clear_error(e.target.id);
		mark_error(e.target.id);
	    }
	    else
		mark_error(e.target.id);
	}
    };
}
$(document).ready(function() {
    // console.log("begin bs_register function");
    // console.log(document.URL);
    //check
    $("#name_register").keyup(keyup_callback() ).bind('paste',keyup_callback());
    $("#email_register").keyup(keyup_callback()).bind('paste',keyup_callback());
    $("#pwd_register").keyup(keyup_callback()).bind('paste',keyup_callback());
    $("#pwd2_register").keyup(keyup_callback()).bind('paste',keyup_callback());

    $("#checkbox_terms").change(function(e){
	// if it's on , remove the tooltip on submit button
	if($(this).prop('checked')){
	    $("#submit_register").tooltip('disable');
	}
	else{
	    $("#submit_register").tooltip('enable');
	}
	// else , add a tooltip on
    });

    //$("#checkbox_terms").tooltip('enable');

    if(check_warning("checkbox_terms") === false){
	// show the tooltip on submit button
	$("#submit_register").tooltip('disable');
    }
    else{
	$("#submit_register").tooltip('enable');
    }

    keyup_callback()({target:{id:"name_register"}});
    keyup_callback()({target:{id:"email_register"}});
    keyup_callback()({target:{id:"pwd_register"}});
    keyup_callback()({target:{id:"pwd2_register"}});
    $("#name_register").focus();
});



