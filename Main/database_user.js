/* indexedDB path for Chrome
 C:\Users\"user name"\AppData\Local\Google\Chrome\User Data\Default\IndexedDB */

/* indexedDB databases are unique per webpage and pc user
 As processing changes URL everytime it's reloaded, a new db is created when that happens.
 An existing db can be renamed to match another URL */

/* Find indexedDB in Chrome dev tools this way:
 1) Click options
 2) Click more tools
 3) Click developer tools
 4) Find indexeddB tab */

//Note: If anything in the db format changes, the db must be cleared and rebuild. Either delete database file or delete in dev tools.

const ADMIN   = "0";
const TEACHER = "1";
const STUDENT = "2";

//prefixes of implementation that we want to test
         window.indexedDB = window.indexedDB || window.mozIndexedDB || 
         window.webkitIndexedDB || window.msIndexedDB;
         
         //prefixes of window.IDB objects
         window.IDBTransaction = window.IDBTransaction || 
         window.webkitIDBTransaction || window.msIDBTransaction;
         window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
         
         if (!window.indexedDB) {
            window.alert("Your browser doesn't support a stable version of IndexedDB.");
         }
         
         const userData = [
            { brugerid: TEACHER, username: "p", password: "", email: "abc@def.com" },
            { brugerid: STUDENT, username: "dude", password: "ho", email: "du@de.com" }
            //hardcode more users here
         ];
         
          const dummyanswerData = [
            {text: "svar"}
         ];
           
            const dummyQuestionData = [
            {text: "Spørgsmål", answers:"", correctAnswers: "" }
         ];
         
             const dummyTestData = [
            {testname: "Testxxx", questions:"", username: "" }
         ];
           
         var db;
         var request = window.indexedDB.open("newDatabase", 1);
         
         request.onerror = function(event) {
            console.log("error: ");
         };
         
         request.onsuccess = function(event) {
            db = request.result;
            console.log("success: " + db);
         };
         
         //this function will create the database if it doesn't exist
         request.onupgradeneeded = function(event) {
            var db = event.target.result;
            
            
            /* Generate user table in database */
            
            
            //create user table and tell database that key is username (unique)
            var objectStore = db.createObjectStore("user", {keyPath: "username"});
            
            //needed for index based searching by username
            objectStore.createIndex("username", "username", { unique: true });
            
            //populate database with hardcoded entries
            for (var i in userData) {
               objectStore.add(userData[i]);
            }
            
            /* Generate answer table in database */
            
            var objectStoreAnswers = db.createObjectStore("answers", { autoIncrement : true });
            
            //needed for index based searching by id
            //objectStoreAnswers.createIndex("id", "id", { unique: true });
            
             //populate database with hardcoded entries
            for (var j in dummyanswerData) {
               objectStoreAnswers.add(dummyanswerData[j]);
            }
            
            /* Generate question table */
            
            var objectStoreQuestions = db.createObjectStore("questions", { autoIncrement : true });
            
            //needed for index based searching by id
            //objectStoreAnswers.createIndex("id", "id", { unique: true });
            
             //populate database with hardcoded entries
            for (var k in dummyQuestionData) {
               objectStoreQuestions.add(dummyQuestionData[k]);
            }
            
            /* Generate question table */
            var objectStoreTest = db.createObjectStore("test", { autoIncrement : true });
            
            //needed for index based searching by id
            //objectStoreAnswers.createIndex("id", "id", { unique: true });
            
             //populate database with hardcoded entries
            for (var l in dummyTestData) {
               objectStoreTest.add(dummyTestData[l]);
            }
            
            
         }
          
         function check_password()
         {
           
           //retrieve username and password from login page
           var brugernavn = document.getElementById('Brugernavn').value;
           var pw = document.getElementById('Adgangskode').value;
           
           //point to user table in db
            var objectStore = db.transaction("user").objectStore("user");
     
            //search in username
            var index = objectStore.index("username");

            //do the search
            index.get(brugernavn).onsuccess = function(event) {
               //user found, now check if password is correct
               if (event.target.result.password == pw) {
                 sessionStorage.username = event.target.result.username;
                 sessionStorage.brugerid = event.target.result.brugerid;
                 if (event.target.result.brugerid == TEACHER)
                 {
                    window.location.href = 'Mail_laerer.html';    
                 }
                 else if (event.target.result.brugerid == STUDENT)
                 {
                    window.location.href = 'Main_elev.html';
                 }      
               }
               else
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
               if(request.result) {
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
            .add({ brugerid: "2", username: "Svend", password: "hej", email: "svend@tveskaeg.org" });
            
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
