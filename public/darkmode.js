var htmlTag = document.getElementById("html");
    var themeBtn = document.getElementById("darkmode");

    const darkMode = () => {
      htmlTag.setAttribute("data-theme", "dark");
    }
    const lightMode = () => {
      htmlTag.setAttribute("data-theme", "winter")
    }

    themeBtn.addEventListener("click", () => {
      // Get the value of the "dark" item from the local storage on every click
      setDarkMode = localStorage.getItem('dark');
      if (setDarkMode !== "on") {
        darkMode();
        // Set the value of the itwm to "on" when dark mode is on
        localStorage.setItem('dark', 'on');
      } else {
        lightMode();
        // Set the value of the item to  "null" when dark mode if off
        localStorage.setItem('dark', 'off');
      }
    });

    // Get the value of the "dark" item from the local storage
    let setDarkMode = localStorage.getItem('dark');

    // Check dark mode is on or off on page reload
    if (setDarkMode === 'on') {
      darkMode();
      document.getElementById('moon').classList.remove('swap-on');
      document.getElementById('moon').classList.add('swap-off');
      document.getElementById('sun').classList.remove('swap-off');
      document.getElementById('sun').classList.add('swap-on');
    }