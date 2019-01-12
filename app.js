window.addEventListener('load', ()=> {
    let long;
    let lat;
    let timeSectionHour = document.querySelector('.time-section-hour');
    let timeSectionDate = document.querySelector('.time-section-date');
    let temperatureDescription = document.querySelector('.temperature-section-summary');
    let temperatureDegree = document.querySelector('.temperature-section-degree');
    let locationTimezone = document.querySelector('.temperature-section-location');
    let temperatureSection = document.querySelector('.temperature-section');
    const temperatureSpan = document.querySelector('.temperature-section span');

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position =>{
            long = position.coords.longitude;
            lat = position.coords.latitude;

            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const api = `${proxy}https://api.darksky.net/forecast/31ceba0a6fd686c4e33c9085e1a03f70/${lat},${long}`;
            
            fetch(api)
                .then(response =>{
                    return response.json();
                })
                .then(data =>{
                    console.log(data);
                    const { temperature, summary, icon } = data.currently;
                    //Set DOM elements from the API
                    temperatureDegree.textContent = temperature;
                    temperatureDescription.textContent = summary;
                    locationTimezone.textContent = data.timezone;
                    //Temperature conversion between C/F
                    let celsius = (temperature - 32) * (5 / 9);
                    //Time conversion from UNIX to current date and time
                    var date = new Date(data.currently.time*1000);
                    var modifier = 'AM'
                    var hours = date.getHours();
                    if(hours > 12){
                        hours = hours - 12;
                        modifier = 'PM'
                    }
                    var minutes = "0" + date.getMinutes();
                    var formattedTime = hours + ':' + minutes.substr(-2);
                    var formattedDate = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear();
                    console.log(formattedTime + modifier);
                    //Set DOM elements with time from API
                    timeSectionHour.textContent = formattedTime + modifier
                    timeSectionDate.textContent = formattedDate;
                    //Set Icon
                    setIcons(icon, document.querySelector('.icon'));
                    //Change Temperature to Celsius/Farenheit
                    temperatureSection.addEventListener('click', () =>{
                        if(temperatureSpan.textContent === "Farenheit"){
                            temperatureSpan.textContent = "Celsius";
                            temperatureDegree.textContent = Math.floor(celsius);
                        }
                        else{
                            temperatureSpan.textContent = "Farenheit";
                            temperatureDegree.textContent = temperature;
                        }
                    });
                });
        });
    }

    function setIcons(icon, iconID){
        const skycons = new Skycons({color: "white"});
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }
});