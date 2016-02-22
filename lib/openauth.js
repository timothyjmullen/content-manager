var ref = new Firebase("https://brilliant-torch-8379.firebaseio.com"), gravatar, name, email,uid;
/// LOGOUT
//////////////////////////////////////
function logout() {
  ref.unauth();
}
/// AUTH CHECK
/////////////////////////////////////
// Create a callback which logs the current auth state
function authDataCallback(authData) {
  if (authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
    console.log(JSON.stringify(authData))
    gravatar = authData.password.profileImageURL;
    email = authData.password.email;
    uid = authData.uid;
    ref.child("users").child(authData.uid).child("name").once("value", function(x) {
      name = x.val();
      document.getElementById("dLabel").innerHTML = "<img src=\"" + gravatar + "\"/>&#160;&#160;<span id=\"uname\">" + name + "</span>&#160;&#160;<span class=\"caret\"></span>";
    });
    document.getElementById("logout").addEventListener("click", logout);
  } else {
    document.getElementById("navProf").innerHTML = "<a href=\"login.html\" style=\"line-height:45px;\">Login</a>";
  }
}


window.onload = function() {
  // Register the callback to be fired every time auth state changes
  ref.onAuth(authDataCallback);
}
