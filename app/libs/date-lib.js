const monthNames = [
	"January", "February", "March",
	"April", "May", "June", "July",
	"August", "September", "October",
	"November", "December"
];
	
const dayOfWeekNames = [
	"Sunday", "Monday", "Tuesday", "Wednesday",
	"Thursday", "Friday", "Saturday"
];

export function formatDate(date) {
	const year = date.getFullYear();
	const month = monthNames[date.getMonth()];
	const day = pad2(date.getDate());
	const dayOfWeek = dayOfWeekNames[date.getDay()];
	return dayOfWeek + ', ' + month + ' ' + day + ', ' + year;
}

export function formatTime(date) {
	const hr = pad2(date.getHours());
	const min = pad2(date.getMinutes());
	return hr + ':' + min;
}

export function formatRelativeDate(timestamp) {
  let diff = Math.round(Date.now() / 1000) - timestamp;

  if (diff < 60) {
    return diff + 's';
  }
  diff = Math.round(diff / 60);
  if (diff < 60) {
    return diff + 'm';
  }
  diff = Math.round(diff / 60);
  if (diff < 60) {
    return diff + 'h';
  }
  diff = Math.round(diff / 24);
  return diff + 'd';
}

function pad2(str) {
	return ("0" + str).slice(-2);
}
