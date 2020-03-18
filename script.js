var startHour   = '09', // 9AM
    endHour     = '17', // 5PM
    currentHour = '',
    dateToday   = document.getElementById('date-today'),
    container   = document.getElementById('container');

dateToday.innerHTML = moment(moment(), 'k').format('LLLL');

var workDay = endHour.slice(0,2) - startHour.slice(0,2);

var diary = document.createElement('ol');

function template() {
  var template = {
    body: document.createElement('li'),
    hour: document.createElement('div'),
    input: document.createElement('textarea'),
    save: document.createElement('button')
  };

  template.body.classList.add('diary-block');
  template.hour.classList.add('diary-hour');
  template.input.classList.add('diary-input');
  //template.input.setAttribute('disabled', 'true');
  template.save.classList.add('diary-save');
  template.save.innerHTML = '&#128190;';
  
  template.body.append(template.hour);
  template.body.append(template.input);
  template.body.append(template.save);

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
  var militaryTimeNow = parseInt(moment(moment(), 'k').format('k'));

  diaryBlock[t].hour.innerHTML = '<span>' + meridiemTime + '<span>';
  

  //var diaryInput = '';

  //if (typeof storage[militaryTime] === 'object') {
  //  diaryInput = '';//storage[militaryTime].data
  //} else {
    diaryInput = rawData[militaryTime];
 // }

  diaryBlock[t].input.value = diaryInput;
  diaryBlock[t].save.setAttribute('data-hour', militaryTime);

  //rawData.push(Array('{"' + militaryTime + '": "' + diaryInput + '"}'));
  //rawData.push(Array());
  //rawData[militaryTime] = {data: diaryInput};
  rawData[militaryTime] = diaryInput;



  //data[militaryTime].data = diaryInput;
  //var temp = militaryTime.data = diaryInput;
  
  //data.push(militaryTime: diaryInput});
  //data

//  console.log(militaryTime < militaryTimeNow, militaryTime,  militaryTimeNow);

  if (militaryTime < militaryTimeNow) {
    diaryBlock[t].body.classList.add('hour-past');
    diaryBlock[t].input.setAttribute('disabled', 'true');
  } 
  else if (militaryTime == militaryTimeNow) {
    diaryBlock[t].body.classList.add('hour-current');
  } 
  else {
    diaryBlock[t].body.classList.add('hour-future');
  }

  diaryBlock[t].save.addEventListener('click', function(){
    var data = this.previousElementSibling.value;

    //rawData[0].data = 'test';
    rawData[this.getAttribute('data-hour')] = data;
    //console.log(rawData);

    localStorage.setItem('diary', JSON.stringify(rawData));
    //rawData[militaryTime] = data;
    //var mhour = this.getAttribute('data-hour');
    //var clean = rawData.join('');
    //clean[mhour] = 'test'; //data;
    //console.log(clean[mhour]);
    //console.log();
    //localStorage
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