var tempTime = moment(); //'20200319 11'; //moment();

var startHour   = '09', // 9AM
    endHour     = '17', // 5PM
    currentHour = '',
    dateRow     = $('#date-row'),
    dateToday   = $('#date-today'),
    container   = $('#container');




var workDay = endHour.slice(0,2) - startHour.slice(0,2);

var rawData;

//var view = moment(tempTime).format('YYYYMMDD k');

var tempDate = 'Friday, March 20, 2020 10:18 AM';
var view = moment(tempDate, 'LLLL').format('YYYYMMDD');
dateToday.html(moment(tempDate, 'LLLL').format('LLLL'));

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

      if (view == moment(tempDate, 'LLLL').format('YYYYMMDD')) {
        dateNowValue = 'Today';
      } 
      else {
        dateNowValue = moment(view).format('dddd, LL');
      }

  var dateShortPrev = moment(datePrevValue, 'dddd LL').format('DD ddd'),
      dateShortNext = moment(dateNextValue, 'dddd LL').format('DD ddd');

  var datePrev = $('<button class="button-date date-previous" data-short="' + dateShortPrev + '" data-long="' + datePrevValue + '" data-date="' + momPrev + '">').html(''),
      dateNow  = $('<button class="date-now">').html(dateNowValue),
      dateNext = $('<button class="button-date date-next" data-short="' + dateShortNext + '" data-long="' + dateNextValue + '" data-date="' + momNext + '">').html('');

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
    var militaryTimeNow = parseInt(moment($('#date-today').html(), 'LLLL').format('k'));
    //var militaryTimeNow = parseInt(moment().format('k'));

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
    //console.log(isThePast, todaysDate);
    //console.log(todaysDate, isThePast, view);

    //console.log(isThePast, militaryTime < militaryTimeNow);

    hourBlock.body.attr("id", "BLOCK" + meridiemTime);

    if (!isThePast && militaryTime > militaryTimeNow || view > moment(tempDate, 'LLLL').format('YYYYMMDD')) {
      hourBlock.body.addClass('hour-future');
    } 
    else if (!isThePast && militaryTime == militaryTimeNow && view == moment(tempDate, 'LLLL').format('YYYYMMDD')) {
      hourBlock.body.addClass('hour-current');
    } 
    else {
      hourBlock.body.addClass('hour-past');
      hourBlock.save.html('&#128273;');
      hourBlock.body.attr('data-lock', 'true');
      hourBlock.body.attr('title',  'Not editable');
      hourBlock.input.attr('contenteditable', 'false');
    }

    /*

    if (isThePast && militaryTime < militaryTimeNow) {
      hourBlock.body.addClass('hour-past');
      hourBlock.input.attr('contenteditable', 'false');
    } 
    else if (isThePast && militaryTime == militaryTimeNow && view == moment(tempDate, 'LLLL').format('YYYYMMDD')) {
      hourBlock.body.addClass('hour-current');
    } 
    else {
      hourBlock.body.addClass('hour-future');
    }
    */
    diary.append(hourBlock.body);

  }

  container.append(diary);
  /*
  setTimeout(function() {
    window.location.hash = "BLOCK09AM";
  }, 10000);
  */
/*
 $('html, body').animate({
    scrollTop: $('#BLOCK09AM').offset().top
  }, 800, function(){
  });
*/
}

function storageDiaryObj(hour, data) {


  //JSON.stringify(rawData);

  rawData[hour] = data;

  return JSON.stringify(rawData);

}

$(document).on('click', '.diary-save', function() {

  if ($(this.parentElement).attr('data-lock') == 'true') {

    var password = prompt('Enter password:');

    if (password == 'test' && confirm('Are you sure you want to edit this locked entry?')) {
      $(this.parentElement).attr('data-lock', 'false');
      $(this).html('&#128190;');
      $(this.previousElementSibling).attr('contenteditable', 'true');
      $(this.parentElement).attr('title',  '');
    }
/*
    hourBlock.body.addClass('hour-past');
    hourBlock.save.html('&#128273;');
    hourBlock.save.attr('data-lock', 'true');
    hourBlock.body.attr('title',  'Not editable');
    hourBlock.input.attr('contenteditable', 'false
*/
    
  }
  else {

    if ($(this.parentElement).attr('data-lock') == 'false') {
      $(this.parentElement).attr('data-lock', 'true');
      $(this).html('&#128273;');
      $(this.previousElementSibling).attr('contenteditable', 'false');
      $(this.parentElement).attr('title',  'Not editable');
    }

    var input = $(this.previousElementSibling).html();
    //rawData[$(this).attr('data-hour')] = data;
    //JSON.stringify(rawData);
    var hour = $(this).attr('data-hour');
    var data = storageDiaryObj(hour, input);
    console.log(data);
    //console.log(data);
    localStorage.setItem(view, data);
  }
})

buildDiary(view);

$(document).on('click', '.button-date', function() {
  
  //console.log($(this).attr('data-date'));
  buildDiary($(this).attr('data-date'));
})


//$(".editor")