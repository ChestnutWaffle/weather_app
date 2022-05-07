let details = document.querySelector('#details');
let prog = document.querySelector("#progress");
let alertBox = document.querySelector("#alert-box");

let alertErr = false;

const geoSuccess = (position) => {

    details.innerHTML = `<h3 class='font-bold'>Location Successfully retrieved</h3>
        <div class="text-xs">Redirecting...</div>`;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/location", true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.send(`lat=${position.coords.latitude}&lon=${position.coords.longitude}`);

    setTimeout(() => {
        window.location.pathname = ('/');
    }, 1000)
}

const geoError = (error) => {
    prog.classList.add("hidden");
    alertBox.classList.add("alert-error");
    alertErr = true;
    details.innerHTML = `<h3 class='font-bold'>Could not retrieve location information</h3>
        <div class="text-xs">Please reset Location permission in site settings and Reload the page to Try Again,</div>
        <div class="text-xs">Or turn on location services on your device if it has been turned off and Try Again</div>`;
}

const getLocation = () => {
    if (alertErr) {
        alertBox.classList.remove('alert-error')
    }
    details.innerHTML = `<h3 class='font-bold'>Trying to retrieve location information</h3>
        <div class="text-xs">Please wait...</div>`;
    prog.classList.remove("hidden")
    let geo = navigator.geolocation;
    geo.getCurrentPosition(geoSuccess, geoError)
}