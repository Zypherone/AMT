var tempTime = moment(); //'20200319 11'; //moment();

var startHour   = '09', // 9AM
    endHour     = '17', // 5PM
    currentHour = '',
    dateRow     = $('#date-row'),
    dateToday   = $('#date-today'),
    container   = $('#container');


dateToday.html(moment(tempTime, 'YYYYMMDD k').format('LLLL'));

var workDay = endHour.slice(0,2) - startHour.slice(0,2);

var rawData;

//var view = moment(tempTime).format('YYYYMMDD k');
var view = moment().format('YYYYMMDD');

//console.log(view);

function buildDiary(date) {

  view = date;

  //console.log(view);

  dateRow.empty();
  container.empty();

  var datePrevValue = moment(view, 'YYYYMMDD').subtract('1', 'day').format('dddd, LL'),
      
      dateNextValue = moment(view, 'YYYYMMDD').add('1','day').format('dddd, LL');

  var momPrev = moment(datePrevValue, 'dddd, LL').format('YYYYMMDD'),
      momNext = moment(dateNextValue, 'dddd, LL').format('YYYYMMDD');

      //dateNowValue = dateNowValue == $('date-today').html() ? 'Today' : dateNowValue;

      //dateNowValue = moment(view, 'YYYYMMDD').format('LLLL');
      //dateNowValue = moment().format('LLLL');

      if (view == moment().format('YYYYMMDD')) {
        dateNowValue = 'Today';
      } 
      else {
        dateNowValue = moment(view).format('dddd, LL');
      }

  var datePrev = $('<button class="date-previous" data-date="' + momPrev + '">').html(datePrevValue),
      dateNow  = $('<button class="date-now">').html(dateNowValue),
      dateNext = $('<button class="date-next" data-date="' + momNext + '">').html(dateNextValue);

  dateRow.append(datePrev, dateNow, dateNext);

  var diary = $('<ol>');

  function template() {
    var template = {
      body: $('<li class="diary-block">'),
      hour: $('<div class="diary-hour">'),
      input: $('<div class="diary-input" contenteditable>'),
      save: $('<button class="diary-save">&#128190;</textarea>')
    };
    
    template.body.append(template.hour, template.input, template.save);

    $(template.input).focus(function() {
      document.execCommand(this, false);
    });

    return template;
  }

  //console.log(view);

  var localData = localStorage.getItem(view);
  rawData = localData ? JSON.parse(localData) : {};

  //console.log('obj', rawData);

  for(t=0;t<=workDay;t++){

    var hourBlock = template();

    var thisHour = parseInt(startHour)+t;

    var meridiemTime = moment(thisHour, 'HH').format('hhA');
    var militaryTime = parseInt(moment(thisHour, 'HH').format('k'));


    //var militaryTimeNow = parseInt(moment(view + ' 11', 'YYYYMMDD k').format('k'));
    //var militaryTimeNow = parseInt(moment(view, 'YYYYMMDD').format('k'));
    var militaryTimeNow = parseInt(moment().format('k'));

    //console.log(militaryTimeNow);

    hourBlock.hour.html('<span>' + meridiemTime + '<span>'); 

    diaryInput = rawData[militaryTime];
  
    hourBlock.input.html(diaryInput);
    hourBlock.save.attr('data-hour', militaryTime);

    rawData[militaryTime] = diaryInput;

    //console.log(militaryTimeNow)
    var todaysDate = $('#date-today').html();
    todaysDate = moment(todaysDate, 'LLLL').format('YYYYMMDD');
    
    var isThePast = view < todaysDate;
    console.log(isThePast, todaysDate);
    //console.log(todaysDate, isThePast, view);

    console.log(isThePast, militaryTime < militaryTimeNow);

    if (isThePast && militaryTime < militaryTimeNow) {
      hourBlock.body.addClass('hour-past');
      hourBlock.input.attr('contenteditable', 'false');
    } 
    else if (militaryTime == militaryTimeNow) {
      hourBlock.body.addClass('hour-current');
    } 
    else {
      hourBlock.body.addClass('hour-future');
    }

    diary.append(hourBlock.body);

  }

  container.append(diary);
}

function storageDiaryObj(hour, data) {


  //JSON.stringify(rawData);

  rawData[hour] = data;

  return JSON.stringify(rawData);

}

$(document).on('click', '.diary-save', function() {
  var input = $(this.previousElementSibling).html();

  //rawData[$(this).attr('data-hour')] = data;
  //JSON.stringify(rawData);
  var hour = $(this).attr('data-hour');
  var data = storageDiaryObj(hour, input);

  //console.log(data);
  localStorage.setItem(view, data);
})

buildDiary(view);

$(document).on('click', 'button', function() {

  //console.log($(this).attr('data-date'));
  buildDiary($(this).attr('data-date'));
})


//$(".editor")