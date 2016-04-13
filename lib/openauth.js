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
    ref.child("users").child(btoa(email)).on("value", function(snap) {
      snap = snap.val();
      document.getElementById("dLabel").innerHTML = "<img src=\"" + gravatar + "\"/><span class=\"hidden-xs\" id=\"uname\">&#160;&#160;" + snap.name + "&#160;</span><span class=\"caret\"></span>";
      if (snap.role == 'a') {
        $("#dList").prepend('<li><a href="admin">Admin Tools</a></li>');
      }
    });
    document.getElementById("logout").addEventListener("click", logout);
  } else {
    document.getElementById("navProf").innerHTML = "<a href=\"login\" style=\"line-height:45px;\">Login</a>";
  }
}


window.onload = function() {
  // Register the callback to be fired every time auth state changes
  ref.onAuth(authDataCallback);
}
