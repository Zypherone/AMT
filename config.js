/*
  For debugging purposes

*/

var debug = {
    on: false,
  date: '20/03/2020', // DD/MM/YYYY
  time: '11:18 AM', // HH:mm (AM or PM)
  query: function() {
    return moment(this.date + ' ' + this.time, 'DD/MM/YY HH:mm A');
  }
}

/**
 * Update this section to update password or the standard working day.
 */

var startOfWorkDay = '09',   // Value is in 24 hour format
    endOfWorkDay   = '17',   // Value is in 24 hour format
    passwordChoice = 'test'; // Update password here.

// Lets start the moment function for time manipulate!
var timeData = !debug.on ? moment() : debug.query();
