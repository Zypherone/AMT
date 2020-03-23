// Lets prepare the variables.
var view             = moment(timeData).format('YYYYMMDD'),
    dateFormat       = 'dddd, DD MMMM YYYY HH:mm A',
    buttonDateFormat = 'dddd, DD MMMM',
    viewFormat       = 'YYYYMMDD',
    diaryBody        = $('#container'),
    diaryDateRow     = $('#date-row'),
    rawData          = {}
    currentDate      = view;

$('#date-today').html(moment(timeData).format(dateFormat));

var hoursInAWorkDay = endOfWorkDay - startOfWorkDay;

var dataTimeBlock = {};

// Lets build a template for the each hour of the time blocks.
var template = {
  html: function () {
    
    // Build the basic HTML structure
    var template =  {
      body : $('<li class="diary-block">'),
      time : $('<div class="diary-hour">'),
      input: $('<div class="diary-input">'),
      button: $('<button class="diary-button">')
    };

    // Prep for push to browser
    template.body.append(
      template.time,
      template.input,
      template.button
    );

    // Set the time block so we can pretify it.
    template.time = template.time.append('<span>');
    
    return template;

  },
  time: function() {
    // Build the time values for functions/
    return {
      meridiem: function(hour) { return moment(hour, 'HH').format('hA') },
      military: function(hour) { return parseInt(moment(hour ? hour : timeData, 'YYYYMMDDHHkk').format('YYYYMMDDkk')) },
      date    : function(date) { return moment(data ? date : timeData).format('YYYYMMDD') }
    }
  }
}

// Save function 
function saveDiaryData(date, html) {

  // Prep date index for local storage.
  var date = currentDate + moment(date, 'hA').format('kk');

  // Prep an array to push into local storage
  rawDiaryData[date] = html;

  // Save to local storage 
  localStorage.setItem(currentDate, JSON.stringify(rawDiaryData));
  

}

// Let prepare the eventsButton function so we can save or swtich dates.
function eventsButton() {

  // Events button for date, prev, and next.
  if ($(this).hasClass('button-date')) {
    buildHourBlock($(this).attr('data-date'));
  }
  // Or we save, unlock diary entiries.
  else {

    // Asign var with the appropriate elements.
    var hourBlock  = $(this.parentElement),
        timeBlock  = $(this.previousElementSibling.previousElementSibling),
        inputBlock = $(this.previousElementSibling);

    // Lets check if the diary entry is locked, is so unlock
    if (hourBlock.attr('data-lock') === 'true') {
      var password = prompt('Enter Password to unlock this diary.');

      // Apply password check and confirm if entry is to be updated.
      if ( password == passwordChoice 
          && confirm('Are you sure you want to edit this entry?')) {
        
        hourBlock.attr('data-lock', false);
        inputBlock.attr('contenteditable', true);
        
      }
    }
    // Lets save entry.
    else {
      
      // If this is past entry, lock once saved.
      if (hourBlock.attr('data-lock') === 'false') {
        hourBlock.attr('data-lock', true);
        inputBlock.attr('contenteditable', false);
      }
      
      saveDiaryData(timeBlock.html(), inputBlock.html());
    }
  }

}

// Build the buttons for the prev, next and current buttons.
function buildDateButtons(view) {
  
  // Build the basic HTML structuce.
  var button = {
    html: {
      previous: $('<button>'),
      current: $('<button>'),
      next: $('<button>')
    },
    // Lets determind the values for prev, next, or current date.
    value: {
      previous: moment(view, 'YYYYMMDD').subtract('1', 'day'),
      next: moment(view, 'YYYYMMDD').add('1', 'day'),
      current: function() {
        if (view == moment(timeData).format('YYYYMMDD')) {
          return 'Today';
        } else {
          return moment(view, 'YYYYMMDD').format(buttonDateFormat);
        }
      }
    },
    data: {
      previous: function() { return moment(button.value.previous).format('YYYYMMDD') },
      next: function() { return moment(button.value.next).format('YYYYMMDD') },
    },
    short: {
      previous: function() { return moment(button.value.previous).format('DD ddd') },
      next: function() { return moment(button.value.next).format('DD ddd') }
    },
    long: {
      previous: function() { return moment(button.value.previous).format(buttonDateFormat) },
      next: function() { return moment(button.value.next).format(buttonDateFormat) }
    }
  }

  /*
    Lets add the clases and data-* to the date buttons.
    data-short is for short hand view for mobile
    data-long is for standard browser view
    data-date is for click function to switch dates
  */

  button.html.previous
    .addClass('button-date date-previous')
    .attr('data-short', button.short.previous())
    .attr('data-long', button.long.previous())
    .attr('data-date', button.data.previous());

  button.html.current
    .addClass('date-current')
    .html(button.value.current());

  button.html.next
    .addClass('button-date date-next')
    .attr('data-short', button.short.next())
    .attr('data-long', button.long.next())
    .attr('data-date', button.data.next());

  // Lets push this to the browser.
  diaryDateRow
    .append(
      button.html.previous, 
      button.html.current, 
      button.html.next
    );
}

function buildHourBlock(viewDate) {

  // Lets set the currenDate variable 
  currentDate = viewDate;

  // Lets check to see if there is anything in localStorage
  var localData = localStorage.getItem(currentDate);
  rawDiaryData = localData ? JSON.parse(localData) : {};

  diaryBody.empty();
  diaryDateRow.empty();

  // Lets build the date buttons, previous, next and show todays or current date.
  buildDateButtons(currentDate);


  // Create an ordered list for the hour block. Will append later.
  var diary = $('<ol>');

  // Lets repeat the code for each hour of a working day.
  for(h=0;h<hoursInAWorkDay;h++) {

    // Lets set the hour for each block;
    var thisHour = parseInt(startOfWorkDay) + h;

    // Pull the hourBlock template
    var hourBlock = template.html(),
        time      = template.time();

    hourBlock.time.html(time.meridiem(thisHour));

    // Lets prep a variable to compare dates/time
    var compareTimeDate = (thisHour.toString().length == 1 ? '0' : '' ) + thisHour;
        compareTimeDate = currentDate + compareTimeDate;

    //rawDiaryData[compareTimeDate] = rawDiaryData[compareTimeDate];
    hourBlock.input.html(rawDiaryData[compareTimeDate]);

    // Apply appropriate classes for each time bloack.
    // Is the timeblock in the future?
    if (time.military(compareTimeDate) > time.military()) {
      hourBlock.body.addClass('hour-future');
      hourBlock.input.attr('contenteditable', true);
    }
    // Is the timeblock is now?
    else if (time.military(compareTimeDate) == time.military()) {
      hourBlock.body.addClass('hour-current');
      hourBlock.input.attr('contenteditable', true);
    }
    // Then all timeblocks are in the past. Lock them.
    else {
      hourBlock.body.addClass('hour-past').attr('data-lock', 'true');
    }

    // Lets append this to the diary.
    diary.append(
      hourBlock.body
    );
  }

  // Lets push the diary onto the browser and into the container block.
  $('#container').append(
    diary
  );

}

// Lets start and build todays diary.
buildHourBlock(view);

// Lets add the event listners for .diary-button and .button-date.
$(document).on('click', '.diary-button', eventsButton);
$(document).on('click', '.button-date', eventsButton);