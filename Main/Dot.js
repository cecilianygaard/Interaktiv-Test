function createDatabase() {

  var container = document.getElementById('container');

  try {
    //if (window.openDatabase) {
    var shortName = 'testFest.db';
    var version = '1.0';
    var displayName = 'Display Information';
    var maxSize = 65536; // in bytes
    db = openDatabase(shortName, version, displayName, maxSize);
    // }
    var labelx = document.createElement('label');
    labelx.htmlFor = 'labelx';
    var descriptionx = document.createTextNode('Yo');
    labelx.appendChild(descriptionx);
    container.appendChild(labelx);
  }
  catch(e) {

    alert(e);
  }
}

function showQuestion () {
  document.getElementById('submit').onclick = function() {


    var container = document.getElementById('container');

    //Show question
    var question = document.createElement('h2');
    question.innerHTML = "Spørgsmål";
    container.appendChild(question);


    //Generate radio buttons
    for (var i = 1; i <= 4; i++)
    {

      var radiobox1 = document.createElement('input');

      radiobox1.type = 'radio';
      radiobox1.id = i;
      radiobox1.value = i;
      radiobox1.name = 'question';

      var label1 = document.createElement('label');
      label1.htmlFor = 'Answer ' + i;

      var description1 = document.createTextNode('Answer ' + i);

      label1.appendChild(description1);

      container.appendChild(radiobox1);
      container.appendChild(label1);
      var newline = document.createElement('br');
      container.appendChild(newline);
    }
  }
}
