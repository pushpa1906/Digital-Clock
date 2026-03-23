document.addEventListener("DOMContentLoaded", function () {

    const options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };

    // ----------------------
    // 🌍 Update default clocks
    // ----------------------
    function updateWorldClocks() {

        const now = new Date();

        const newyork = document.getElementById("newyork");
        const denver = document.getElementById("denver");
        const dallas = document.getElementById("dallas");
        const newdelhi = document.getElementById("newdelhi");

        if (newyork)
            newyork.textContent = now.toLocaleTimeString("en-US", { ...options, timeZone: "America/New_York" });

        if (denver)
            denver.textContent = now.toLocaleTimeString("en-US", { ...options, timeZone: "America/Denver" });

        if (dallas)
            dallas.textContent = now.toLocaleTimeString("en-US", { ...options, timeZone: "America/Chicago" });

        if (newdelhi)
            newdelhi.textContent = now.toLocaleTimeString("en-IN", { ...options, timeZone: "Asia/Kolkata" });
    }


    // ----------------------
    // 🧹 Clear all added cities
    // ----------------------
    document.getElementById("clearAllBtn").addEventListener("click", function () {

        document.querySelectorAll(".dynamic-city").forEach(city => city.remove());

        localStorage.removeItem("cities");

    });


    // ----------------------
    // 🔍 Search city (WORKING)
    // ----------------------
    const searchInput = document.getElementById("cityInput");
    const searchBtn = document.getElementById("searchCityBtn");

    searchBtn.addEventListener("click", async function () {

        const city = searchInput.value.trim();

        if (!city) return;

        try {
            // 🌍 Step 1: Get city data
            const response = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
            );

            const data = await response.json();

            if (!data.results || data.results.length === 0) {
                alert("❌ City not found");
                return;
            }

            const place = data.results[0];

            const cityName = place.name + ", " + place.country;
            const timezone = place.timezone;

            console.log("🌍 Found:", cityName, timezone);

            // ➕ Add to UI using YOUR existing function
            addCityToUI(timezone, cityName);

            searchInput.value = "";

        } catch (error) {
            console.error("❌ Error:", error);
            alert("Something went wrong");
        }
    });
    searchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            searchBtn.click();
        }
    });
    // ----------------------
    // ➕ Create clock UI
    // ----------------------
    function addCityToUI(cityValue, cityName, shouldSave = true) {

        const container = document.querySelector(".timezone-container");

        if (!container) {
            console.error("❌ timezone-container missing");
            return;
        }

        const clockBox = document.createElement("div");
        clockBox.classList.add("clock-box", "dynamic-city");

        const cityTitle = document.createElement("h2");
        cityTitle.textContent = cityName;

        const timeDisplay = document.createElement("p");
        const timezoneLabel = document.createElement("span");
        timezoneLabel.classList.add("timezone-label");

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("remove-btn");

        // 🧹 Remove city + update localStorage
        removeBtn.addEventListener("click", function () {

            clockBox.remove();

            let savedCities = JSON.parse(localStorage.getItem("cities")) || [];

            savedCities = savedCities.filter(city => city.name !== cityName);

            localStorage.setItem("cities", JSON.stringify(savedCities));
        });

        clockBox.appendChild(cityTitle);
        clockBox.appendChild(timeDisplay);
        clockBox.appendChild(timezoneLabel);
        clockBox.appendChild(removeBtn);


        container.appendChild(clockBox);

        console.log("✅ Added:", cityName);

        // ⏱️ Live clock update
        setInterval(function () {

            const now = new Date();

            // 🌍 City time
            const cityTime = new Date(
                now.toLocaleString("en-US", { timeZone: cityValue })
            );

            // 🏠 Local time
            const localTime = new Date();

            // ⏱️ Difference in milliseconds
            const diffMs = cityTime - localTime;

            // Convert to total minutes
            const totalMinutes = Math.round(diffMs / (1000 * 60));

            const hours = Math.floor(Math.abs(totalMinutes) / 60);
            const minutes = Math.abs(totalMinutes) % 60;

            let label = "";

            if (totalMinutes > 0) {
                label = `+${hours}h ${minutes}m ahead`;
            } else if (totalMinutes < 0) {
                label = `-${hours}h ${minutes}m behind`;
            } else {
                label = "Same time";
            }
            // -------------------------
            // 📅 DAY DIFFERENCE
            // -------------------------
            const cityDate = cityTime.toDateString();
            const localDate = localTime.toDateString();

            let dayLabel = "";

            if (cityDate !== localDate) {
                if (cityTime > localTime) {
                    dayLabel = "Next day";
                } else {
                    dayLabel = "Previous day";
                }
            }

            // ⏰ Format time
            const time = new Intl.DateTimeFormat([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZone: cityValue
            }).format(new Date());

            timeDisplay.textContent = time;

            timeDisplay.textContent = time;
            // ✅ Combine both labels
            timezoneLabel.textContent = `${label}${dayLabel ? " • " + dayLabel : ""}`;
        }, 1000);
        // 💾 Save to localStorage (ONLY when needed)
        if (shouldSave) {
            let savedCities = JSON.parse(localStorage.getItem("cities")) || [];

            const alreadyExists = savedCities.some(city => city.name === cityName);

            if (!alreadyExists) {
                savedCities.push({
                    name: cityName,
                    timezone: cityValue
                });

                localStorage.setItem("cities", JSON.stringify(savedCities));
                console.log("💾 Saved:", savedCities); // 👈 ADD THIS LINE
            }
        }
    }

    // ----------------------
    // 🔄 Load saved cities on page load
    // ----------------------
    function loadSavedCities() {

        const savedCities = JSON.parse(localStorage.getItem("cities")) || [];

        console.log("🔄 Loading:", savedCities); // 👈 ADD THIS

        savedCities.forEach(city => {
            addCityToUI(city.timezone, city.name, false);
        });
    }


    // ----------------------
    // 🚀 Start everything
    // ----------------------
    setInterval(updateWorldClocks, 1000);
    updateWorldClocks();
    loadSavedCities();


});