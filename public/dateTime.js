var dateUnix = new Date().getTime();
var date = new Date(dateUnix + offset);
var dateEl = document.getElementById("date");
dateEl.innerHTML = date.toLocaleString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' });

function updateDate() {
    var unix = new Date().getTime();
    var date1 = new Date(unix + offset);
    var timeEl = document.getElementById("time");
    timeEl.innerHTML = date1.toLocaleTimeString('en-US', { timeZone: "UTC", hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

setInterval(updateDate, 500);