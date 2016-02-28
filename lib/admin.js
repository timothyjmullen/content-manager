var users = {};
function listUsers() {
  // Attach an asynchronous callback to read the data at our posts reference
  ref.child('users').on("value", function(snapshot) {
    users = snapshot.val();
    buildTable();
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
    col0.innerHTML = i; // Index
    col1.innerHTML = users[x].name; // Name
    col2.innerHTML = users[x].email; // Email
    col3.innerHTML = users[x].uid; // UID
    col4.innerHTML = users[x].created_on.replace(/^.{4}(.{6}) (\d{4}) \d{2}:\d{2}.*$/i, '$1, $2'); // Created Date
    col5.innerHTML = users[x].role // Role
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

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  if (/users/i.test(e.target)){
    listUsers();
  } else if (/teams/i.test(e.target)) {

  }
})
