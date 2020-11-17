function GenerateQuestion () {

  document.getElementById('submit').onclick = function() {

    var container = document.getElementById('container');

    //Show question
    var question = document.createElement('h2');
    question.innerHTML = "Nyt spørgsmål";
    container.appendChild(question);

    var questionTxtField = document.createElement('input');
    questionTxtField.type = 'text';
    questionTxtField.id = 'a'+i;
    questionTxtField.value = 'Skriv spørgsmål her';
    questionTxtField.name = 'question';
    questionTxtField.style.fontSize = "large";
    container.appendChild(questionTxtField);
    insertNewline(2);

    //Generate textfields for questions
    for (var i = 1; i <= 4; i++)
    {
      var radiobox1 = document.createElement('input');

      radiobox1.type = 'radio';
      radiobox1.id = 'rightAnswer'+i;
      radiobox1.value = i;
      radiobox1.name = 'answer'+question_no;

      container.appendChild(radiobox1);

      var answerTxt = document.createElement('text');
      answerTxt.innerHTML = 'Answer ' + i;
      container.appendChild(answerTxt);
      //var answerTxtnode = document.createTextNode('Answer ' + i);

      var newline = document.createElement('br');
      container.appendChild(newline);

      var answerTxtField = document.createElement('input');
      answerTxtField.type = 'text';
      answerTxtField.id = 'a'+i;
      answerTxtField.name = 'answer';
      container.appendChild(answerTxtField);

      insertNewline(2);
    }

    question_no = question_no + 1;
  };
}

function insertNewline(no)
{

  for (var i=0; i<no; i++)  
  {
    var newline = document.createElement('br');
    container.appendChild(newline);
  }
}
