var users = {}, teams = {};

function listUsers() {
  // Attach an asynchronous callback to read the data at our posts reference
  ref.child('users').on("value", function(snapshot) {
    users = snapshot.val();
    buildTable();
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}

function listTeams() {
  // Attach an asynchronous callback to read the data at our posts reference
  ref.child('teams').on("value", function(snapshot) {
    teams = snapshot.val();
    buildTeamTable();
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}

function buildTable() {
  var userTable = document.getElementById('usertable'), i = 1, x = "", row, col0, col1, col2, col3, col4, col5;
  // Clear table
  while (userTable.children.length > 0) {
      userTable.removeChild(userTable.children[userTable.children.length - 1]);
  }
  // Build user table
  for (x in users) {
    row = document.createElement('tr');
    col0 = document.createElement('td');
    col1 = document.createElement('td');
    col2 = document.createElement('td');
    col3 = document.createElement('td');
    col4 = document.createElement('td');
    col5 = document.createElement('td');
    // Set cell content
    col0.innerHTML = i; /* Index */
    col1.innerHTML = users[x].name; /* Name */
    col2.innerHTML = users[x].email; /* Email */
    col3.innerHTML = users[x].uid; /* UID */
    col4.innerHTML = users[x].created_on.replace(/^.{4}(.{6}) (\d{4}) \d{2}:\d{2}.*$/i, '$1, $2'); /* Created Date */
    col5.innerHTML = users[x].role /* Role */
    // Append cells to row
    row.appendChild(col0);
    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);
    row.appendChild(col4);
    row.appendChild(col5);
    // Append table row
    userTable.appendChild(row);
    // Increase index
    i++;
  }

  document.getElementById("loading-users").className = 'loading hide';
  document.getElementById("load-control-users").className = '';
}

function buildTeamTable() {
  var teamTable = document.getElementById('teamtable'), i = 1, x = "", row, col0, col1, col2, col3, col4, memcount = 0;
  // Clear table
  while (teamTable.children.length > 0) {
      teamTable.removeChild(teamTable.children[teamTable.children.length - 1]);
  }
  // Build team table
  for (x in teams) {
    for (var k in teams[x].members) if (teams[x].members.hasOwnProperty(k)) ++memcount;
    row = document.createElement('tr');
    col0 = document.createElement('td');
    col1 = document.createElement('td');
    col2 = document.createElement('td');
    col3 = document.createElement('td');
    col4 = document.createElement('td');
    // Set cell content
    col0.innerHTML = i; /* Index */
    col1.innerHTML = teams[x].name; /* Name */
    col2.innerHTML = atob(teams[x].mgr); /* Email */
    col3.innerHTML = memcount.toString(); /* UID */
    col4.innerHTML = teams[x].created_on.replace(/^.{4}(.{6}) (\d{4}) \d{2}:\d{2}.*$/i, '$1, $2'); /* Created Date */
    // Append cells to row
    row.appendChild(col0);
    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);
    row.appendChild(col4);
    // Append table row
    teamTable.appendChild(row);
    // Increase index
    i++;
  }

  document.getElementById("loading-teams").className = 'loading hide';
  document.getElementById("load-control-teams").className = '';
}

function addTeam() {
  var teamName = document.getElementById("txtTeamName").value,
      teamID = document.getElementById("txtTeamID").value,
      teamMgr = document.getElementById("emTeamManager").value,
      validID = true, validMgr = true;

  // Validation
  ref.child('teams').child(teamID).once("value", function(data) {
    if (data.val()) {
      document.getElementById("alert").innerHTML = "<span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span> The team ID already exists.";
      document.getElementById("alert").className = "alert alert-warning";
      validID = false;
    }
  });
  ref.child('users').child(btoa(teamMgr)).once("value", function(data) {
    if (!data.val()) {
      console.log(btoa(teamMgr))
      document.getElementById("alert").innerHTML = "<span class=\"glyphicon glyphicon-warning-sign\" aria-hidden=\"true\"></span> The user specified as team manager does not exist.";
      document.getElementById("alert").className = "alert alert-warning";
      validMgr = false
    }
  });
  if (validID && validMgr) {
    ref.child("teams").child(teamID).set({
      name: teamName,
      mgr: btoa(teamMgr),
      created_on: new Date().toString()
    });
    ref.child("teams/" + teamID + "/members/" + btoa(teamMgr)).set("admin");
    ref.child("users/" + btoa(teamMgr) + "/teams/" + teamID).set("admin");
    listTeams();
    document.getElementById("alert").innerHTML = "<span class=\"glyphicon glyphicon-ok-circle\" aria-hidden=\"true\"></span> Team was created successfully.";
    document.getElementById("alert").className = "alert alert-success";
  } else {
    return false;
  }
}

// Event Handlers
document.getElementById("addTeam").addEventListener("submit", function(e) {
  e.preventDefault();
  e.stopPropagation();
  addTeam();
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  document.getElementById("alert").innerHTML = '';
  if (e.target.name == "users"){
    listUsers();
  } else if (e.target.name == "teams") {
    listTeams();
  }
});
// Init tooltips
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});
