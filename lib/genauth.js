var ref = firebase.database().ref(), auth = firebase.auth(), gravatar, name, email, uid, uteams;
/// LOGOUT
//////////////////////////////////////
function logout() {
  auth().signOut().then(function() {
    // Sign-out successful.
    console.log("User is logged out");
    window.location = "login";
  }, function(error) {
    // An error happened.
    console.log('Something went wrong with the logout procedure...');
  });
}
/// AUTH CHECK
/////////////////////////////////////
// Create a callback which logs the current auth state
function authDataCallback(authData) {
  //console.log("User " + authData.uid + " is logged in with " + authData.provider);
  //console.log(JSON.stringify(authData))
  gravatar = authData.password.profileImageURL;
  email = authData.password.email;
  uid = authData.uid;
  ref.child("users").child(btoa(email)).on("value", function(snap) {
    snap = snap.val();
    document.getElementById("dLabel").innerHTML = "<img src=\"" + gravatar + "\"/><span class=\"hidden-xs\" id=\"uname\">&#160;&#160;" + snap.name + "&#160;</span><span class=\"caret\"></span>";
    uteams = snap.teams;
    if (snap.role == 'a') {
      $("#dList").prepend('<li><a href="admin">Admin Tools</a></li>');
    }
  });
}
// Register the callback to be fired every time auth state changes
//ref.onAuth(authDataCallback);

auth.onAuthStateChanged(function(user) {
  if (user) {
    // User signed in!
    authDataCallback(user);
  } else {
    // User logged out
    console.log("User is logged out");
    window.location = "login";
  }
});

window.onload = function() {
  document.getElementById("logout").addEventListener("click", logout);
}
