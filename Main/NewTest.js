  function GenerateQuestion () {

    var container = document.getElementById('container');

    //Show question
    var question = document.createElement('h2');
    question.innerHTML = "Spørgsmål " + question_no;
    container.appendChild(question);

    var questionTxtField = document.createElement('input');
    questionTxtField.type = 'text';
    questionTxtField.id = 'a'+question_no;
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

      insertNewline(1);

      var answerTxtField = document.createElement('input');
      answerTxtField.type = 'text';
      answerTxtField.id = 'answer_text_field'+answer_no;
      answerTxtField.name = 'answer';
      container.appendChild(answerTxtField);

      insertNewline(2);
      
      answer_no++;
    }
    
    
    question_no = question_no + 1;
  //};
}

function SaveTest()
{
    
    //for now, only all the answers are saved. 
    
    //add sanity checks such as:
    //1) Does all text fields contain text?
    //2) Is there a selected radio button for all questions?

    for (var i = 1; i < answer_no; i++)
    {
       var request = db.transaction(["answers"], "readwrite")
            .objectStore("answers")
            .add({ text: document.getElementById('answer_text_field'+i).value});
    }
}

function insertNewline(no)
{

  for (var i=0; i<no; i++)  
  {
    var newline = document.createElement('br');
    container.appendChild(newline);
  }
}
