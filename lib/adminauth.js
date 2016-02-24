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
    gravatar = authData.password.profileImageURL;
    email = authData.password.email;
    uid = authData.uid;
    // Only let me see this page
    if (!/tim\.mullen@outlook.com/i.test(email)) {
      window.location = "library.html";
    }
    ref.child("users").child(authData.uid).child("name").once("value", function(x) {
      name = x.val();
      document.getElementById("dLabel").innerHTML = "<img src=\"" + gravatar + "\"/>&#160;&#160;<span id=\"uname\">" + name + "</span>&#160;&#160;<span class=\"caret\"></span>";
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
