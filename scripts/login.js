var attempt = 3; // Variable to count number of attempts.
// Below function Executes on click of login button.
function validate(){
    var username = document.getElementById("username_id").value;
    var password = document.getElementById("password_id").value;
    if ( username == "Formget" && password == "formget#123"){
        alert ("Login successfully");
        window.location = "index.html"; // Redirecting to other page.
        return false;
    }
    else{
        attempt --;// Decrementing by one.
        alert("You have left "+attempt+" attempt;");
        // Disabling fields after 3 attempts.
        if( attempt == 0){
            document.getElementById("username_id").disabled = true;
            document.getElementById("password_id").disabled = true;
            document.getElementById("submi_id").disabled = true;
            return false;
        }
    }
}