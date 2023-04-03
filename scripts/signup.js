function validate(){
    var username = document.getElementById("username_id").value;
    var password = document.getElementById("password_id").value;
    var repeat_password = document.getElementById("repeat_password_id").value;
    var email = document.getElementById("email_id").value;

  
    if ( username == "" || password == "" || repeat_password == "" || email == ""){
        alert ("Please fill all the fields");
        return false;
    }
    else if (password != repeat_password){
        alert ("Passwords do not match");
        return false;
    }
    else{
        alert ("Sign up successfully");
        window.location = "index.html"; // Redirecting to other page.
        return false;
    }
}
