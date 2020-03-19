var tempDate = moment();

var startHour   = '09', // 9AM
    endHour     = '17', // 5PM
    currentHour = '',
    dateToday   = $('#date-today'),
    container   = $('#container');

dateToday.html(moment(tempDate, 'k').format('LLLL'));

var workDay = endHour.slice(0,2) - startHour.slice(0,2);



var diary = $('<ol>');

function template() {
  var template = {
    body: $('<li class="diary-block">'),
    hour: $('<div class="diary-hour">'),
    //input: $('<textarea class="diary-input editor">'),
    input: $('<div class="diary-input" contenteditable>'),
    save: $('<button class="diary-save">&#128190;</textarea>')
  };
/*
  template.body.addClass('diary-block');
  template.hour.addClass('diary-hour');
  template.input.addClass('diary-input');
  //template.input.setAttribute('disabled', 'true');
  template.save.addClass('diary-save');
*/
  //template.save.html('&#128190;');
  
  template.body.append(template.hour, template.input, template.save);

  $(template.input).focus(function() {
    document.execCommand(this, false);
  });

  return template;
}

var diaryBlock = []

/*
var storage = [
  
  "9": 'TEST',
  "10": 'adasdsa\nasdasd'

];
*/

var localData = localStorage.getItem('diary');
var rawData = localData ? JSON.parse(localData) : {};

//console.log(storage[9]);

for(t=0;t<=workDay;t++){

  diaryBlock.push(template());

  var thisHour = parseInt(startHour)+t;

  var meridiemTime = moment(thisHour, 'HH').format('hhA');
  var militaryTime = parseInt(moment(thisHour, 'HH').format('k'));
  var militaryTimeNow = parseInt(moment(tempDate, 'k').format('k'));

  diaryBlock[t].hour.html('<span>' + meridiemTime + '<span>');
  

  //var diaryInput = '';

  //if (typeof storage[militaryTime] === 'object') {
  //  diaryInput = '';//storage[militaryTime].data
  //} else {
    diaryInput = rawData[militaryTime];
 // }

  diaryBlock[t].input.html(diaryInput);
  diaryBlock[t].save.attr('data-hour', militaryTime);

  rawData[militaryTime] = diaryInput;

  if (militaryTime < militaryTimeNow) {
    diaryBlock[t].body.addClass('hour-past');
    diaryBlock[t].input.attr('contenteditable', 'false');
  } 
  else if (militaryTime == militaryTimeNow) {
    diaryBlock[t].body.addClass('hour-current');
  } 
  else {
    diaryBlock[t].body.addClass('hour-future');
  }

  diaryBlock[t].save.on('click', function(){
    var data = $(this.previousElementSibling).html();

//    console.log(data);

  
    rawData[$(this).attr('data-hour')] = data;
    //console.log(rawData);


    localStorage.setItem('diary', JSON.stringify(rawData));
  });


  diary.append(diaryBlock[t].body);


  //console.log(t);
}

//console.log(rawData);

//var save = document.getElementsByTagName('button');

//for

/*
save.addEventListener('click', function() {
  console.log(this.nextElementSibling.value);
});
*/

container.append(diary);
//$(".editor")