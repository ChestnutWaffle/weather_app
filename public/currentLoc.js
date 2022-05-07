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
        <div class="text-xs">Please reset Location permission in site settings and Reload the page to try again.</div>`;
      }

      const getLocation = () => {
        if(alertErr) {
          alertBox.classList.remove('alert-error')
        }
        prog.classList.remove("hidden")
        let geo = navigator.geolocation;
        geo.getCurrentPosition(geoSuccess, geoError)
      }