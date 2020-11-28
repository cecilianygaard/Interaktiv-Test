var db;
var request = window.indexedDB.open("newDatabase", 1);

var test_no = 0;
         
request.onerror = function(event)
{
           
};
         
request.onsuccess = function(event)
{
   db = request.result;
   var objectStoreTests = db.transaction(["test"], "readwrite").objectStore("test");

   objectStoreTests.openCursor().onsuccess = function(event)
   {  
      var cursor = event.target.result;
      if (cursor)
      {
         test_no++;
         let div = document.getElementById('dropdown');
         let a = document.createElement('a');
         a.href = 'javascript:getTest('+test_no+')';
         a.innerHTML = cursor.value.testname;
         div.appendChild(a);
         cursor.continue();
      }
      else
      {
     
      }
   };           
};
