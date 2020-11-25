//opret bruger kode:
//do the search
  index.get(brugernavn).onsuccess = function(event) {
    //user found, now check if password is correct
    if (event.target.result.password == hashedpw) {
      sessionStorage.username = event.target.result.username;
      sessionStorage.brugerid = event.target.result.brugerid;
      if (event.target.result.brugerid == TEACHER)
      {
        window.location.href = 'Main_laerer.html';
      } else if (event.target.result.brugerid == STUDENT)
      {
        window.location.href = 'Main_elev.html';
      }
    } else
    {
      alert("Password wrong");
    }
  };

  index.get(brugernavn).onerror = function(event) {
    alert("user not found");
  };
}

//below are test functions that might come in handy later

function read() {
  var transaction = db.transaction(["user"]);
  var objectStore = transaction.objectStore("user");
  var request = objectStore.get("Svend");

  request.onerror = function(event) {
    alert("Unable to retrieve data from database!");
  };

  request.onsuccess = function(event) {
    // Do something with the request.result!
    if (request.result) {
      alert("Name: " + request.result.username + ", Password: " + request.result.password + ", Email: " + request.result.email);
    } else {
      alert("Svend couldn't be found in your database!");
    }
  };
}

function read_all_users() {
  var objectStore = db.transaction("user").objectStore("user");

  objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;

    if (cursor) {
      alert("Username: " + cursor.key + ", Id: " + cursor.value.brugerid + ", Password: " + cursor.value.password + ", Email: " + cursor.value.email);
      cursor.continue();
    } else {
      alert("No more entries!");
    }
  };
}

function add_user() {
  var request = db.transaction(["user"], "readwrite")
    .objectStore("user")
    .add( { 
  brugerid: 
  "2", username: 
  "Svend", password: 
  "hej", email: 
    "svend@tveskaeg.org"
  }
  );

  request.onsuccess = function(event) {
    alert("Svend has been added to your database.");
  };

  request.onerror = function(event) {
    alert("Unable to add data\r\nSvend is aready exist in your database! ");
  }
}

function remove_user() {
  var request = db.transaction(["user"], "readwrite")
    .objectStore("user")
    .delete("Svend");

  request.onsuccess = function(event) {
    alert("Svend's entry has been removed from your database.");
  };
}
