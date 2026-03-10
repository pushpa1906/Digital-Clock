//Getting Current Time
function updateClock() {
    const now = new Date();
    const clockCard = document.querySelector(".clock-container");
    const progressBar = document.getElementById("progress-bar");
    const indicator = document.getElementById("time-indicator");

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    //Greeting Message
    const greeting = document.getElementById("greeting");
    if (hours < 12) {
        greeting.textContent = "Good Morning"
    } else if (hours < 18) {
        greeting.textContent = "Good Afternoon";
    } else {
        greeting.textContent = "Good Evening";
    }

    //Background + Card Theme Based on Time
    if (hours >= 6 && hours < 12) {

        //Morning - sunrise colors
        document.body.style.background = "linear-gradient(135deg,#FFD89B,#FFB6A3)";
        clockCard.style.background = "#FFE5D4";
        progressBar.style.background = "#ffd148";

    } else if (hours >= 12 && hours < 16) {

        //Afternoon - bright sky colors
        document.body.style.background = "linear-gradient(135deg,#A7D8FF,#74B9FF)";
        clockCard.style.background = "#f7ccc6";
        progressBar.style.background = "#42A5F5";

    } else if (hours >= 16 && hours < 19) {

        // Sunset colors
        document.body.style.background =
            "linear-gradient(135deg,#FF9A8B,#FF6A88)";
        clockCard.style.background = "#FFD6C9";
        progressBar.style.background = "#af813d";

    } else if (hours >= 19 && hours < 24) {

        //Night - colors
        document.body.style.background =
            "linear-gradient(135deg,#2C3E50,#031565)";
        clockCard.style.background = "#D6E6F2";
        progressBar.style.background = "#082661";

    } else {

        // Midnight colors
        document.body.style.background =
            "linear-gradient(135deg,#0F2027,#203A43)";
        clockCard.style.background = "#C7D6E5";
        progressBar.style.background = "#1a1645";
    }

    // Sun / Moon indicator
    if (hours >= 6 && hours < 19) {
        indicator.textContent = "☀️";
    } 
    else {
        indicator.textContent = "🌙";
    }
    
    // Convert to 12-hour format
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    // Pad hours, minutes, and seconds with leading zeros
    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    //Combine Time to display
    const seperator = seconds % 2 === 0 ? ":" : " ";//Blinking effect for seperator
    const currentTime = `${hours}${seperator}${minutes}${seperator}${seconds} ${ampm}`;
    document.getElementById("clock").textContent = currentTime;//Replaces the text with new time
    
    //Update Date
    const currentDate = now.toDateString();
    document.getElementById("date").textContent = currentDate;

    //Progress Bar
    const totalSecondsInDay = 24 * 60 * 60;

    const secondsPassed =
        now.getHours() * 60 * 60 +
        now.getMinutes() * 60 +
        now.getSeconds();

    const dayProgress = (secondsPassed / totalSecondsInDay) * 100;

    progressBar.style.width = `${dayProgress}%`;
    // Move the sun/moon indicator    
    indicator.style.left = `${dayProgress}%`;

    document.getElementById("progress-text").textContent =
        `${Math.floor(dayProgress)}% of day completed`;//Math.floor is used to remove decimals
    

}

//Update Every Second
setInterval(updateClock, 1000);//runs function repeatedly every 1000 milliseconds (1 second)
updateClock();

//Full Screen button
const  fullScreenButton = document.getElementById("fullscreen-btn");
fullScreenButton.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        fullScreenButton.textContent = "⤢";
    }   else {      
        document.exitFullscreen();
        fullScreenButton.textContent = "⛶";
    }
});
