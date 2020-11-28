//opret bruger kode:

async function add_user() {
  
  var name = document.getElementById('user_name_textfield').value;
  var login = document.getElementById('user_login_textfield').value;
  var email = document.getElementById('user_email_textfield').value;
  var password = document.getElementById('user_password_textfield').value;
  var hashedpw = await asyncHash(password);
    
  var request = db.transaction(["user"], "readwrite")
    .objectStore("user")
    .add( { brugerid: STUDENT, login: login, password: hashedpw, email: email, name: name});

  request.onsuccess = function(event) {
    alert("user has been added to your database.");
  };

  request.onerror = function(event) {
    alert("Unable to add data\r\n user already exists in your database ");
  };
}
