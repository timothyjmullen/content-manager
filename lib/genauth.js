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
    ref.child("users").child(authData.uid).on("value", function(snap) {
      snap = snap.val();
      document.getElementById("dLabel").innerHTML = "<img src=\"" + gravatar + "\"/>&#160;&#160;<span id=\"uname\">" + snap.name + "</span>&#160;&#160;<span class=\"caret\"></span>";
      if (snap.role == 'a') {
        $("#dList").prepend('<li><a href="admin.html">Admin Tools</a></li>');
      }
    });
  } else {
    console.log("User is logged out");
    window.location = "login.html";
  }
}
// Register the callback to be fired every time auth state changes
ref.onAuth(authDataCallback);

window.onload = function() {
  document.getElementById("logout").addEventListener("click", logout);
}
