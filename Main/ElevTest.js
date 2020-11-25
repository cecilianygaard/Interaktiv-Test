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
