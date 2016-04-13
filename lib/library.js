var members = {},
    userteams = [];

// GET TEMPLATE LIST FOR SELECTED TEAM
function getTemplateList() {

}

// GET TEAM NAMES FOR SELECT ELEMENT
function teamList(teams) {
  var tSel = document.getElementById("teamSelect"),
      x = "", optEl = {};
  for (x in teams) {
    // GET TEAM NAME
    userteams.push(x);
    ref.child("teams/" + x).once("value", function(data) {
      var optEl = document.createElement('option');
      optEl.innerHTML = data.val().name + ' (' + userteams[tSel.childNodes.length - 3] + ')';
      optEl.setAttribute("team", userteams[tSel.childNodes.length - 3]);
      tSel.appendChild(optEl);
      getTemplateList();
    });
  }
}

// GET TEAM LIST FOR USER
function teamInit() {
  var tSel = document.getElementById("teamSelect");
  // GET USER TEAM DATA
  ref.child("users/" + btoa(email) + "/teams").once("value", function(x) {
    if (x.val()) {
      teamList(x.val());
    }
  });
}


// EVENT HANDLERS
//*********************************
$(function() {
  teamInit();
});
