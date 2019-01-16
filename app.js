window.addEventListener('load', ()=> {
    let long;
    let lat;
    const timeSectionHour = document.querySelector('.time-section-hour');
    const timeSectionDate = document.querySelector('.time-section-date');
    const temperatureDescription = document.querySelector('.temperature-section-summary');
    const temperatureDegree = document.querySelector('.temperature-section-degree');
    const locationTimezone = document.querySelector('.temperature-section-location');
    const temperatureSection = document.querySelector('.temperature-section');
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
                .then(info =>{
                    console.log(info);
                    const { temperature, summary, icon } = info.currently;
                    const { data } = info.daily;
                    //Set DOM elements from the API
                    temperatureDegree.textContent = temperature;
                    temperatureDescription.textContent = summary;
                    locationTimezone.textContent = info.timezone;
                    //Temperature conversion between C/F
                    let celsius = convToCelsius(temperature);
                    //Time conversion from UNIX to current date and time
                    var date = new Date(info.currently.time*1000);
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
                    //Initilize array for weekday section
                    let today = new Date().getDate();
                    let tempHigh = [];
                    for(i = 0; i < 7; i++){
                        tempHigh.push(info.daily.data[i].temperatureHigh);
                    }
                    let weekDayBlocks = Array.from(document.getElementsByClassName('week-section-block'));    
                    //Change Temperature to Celsius/Farenheit
                    temperatureSection.addEventListener('click', () =>{
                        if(temperatureSpan.textContent === "Farenheit"){
                            temperatureSpan.textContent = "Celsius";
                            temperatureDegree.textContent = celsius;
                            for(i = 0; i < 7; i++){
                                weekDayBlocks[i].getElementsByClassName('temp-high')[0].textContent = convToCelsius(tempHigh[i]);
                            }
                        }
                        else{
                            temperatureSpan.textContent = "Farenheit";
                            temperatureDegree.textContent = temperature;
                            for (i = 0; i < 7; i++){
                                weekDayBlocks[i].getElementsByClassName('temp-high')[0].textContent = tempHigh[i];
                            }
                        }
                    });
                
                    //Set the date, temperature high, and icon in each weekday box 
                    weekArray = getWeekArray();               
                   for(i = 0; i < 7; i++){
                       weekDayBlocks[i].getElementsByClassName('title')[0].textContent = weekArray[i] ;
                       weekDayBlocks[i].getElementsByClassName('temp-high')[0].textContent = Math.floor(tempHigh[i]);
                       var skycons = new Skycons({"color": "white"});
                       skycons.add(weekDayBlocks[i].getElementsByClassName('icon')[0], info.daily.data[i].icon.replace(/-/g, "_").toUpperCase());
                       skycons.play();

                    }
                    weekDayBlocks[0].getElementsByClassName('title')[0].textContent = "TODAY";
                    skycons.add(document.getElementsByClassName('icon-0')[0], icon.replace(/-/g, "_").toUpperCase());

                });
        });
    }

    function convToCelsius(temperature){
        celsiusTemp = (temperature - 32) * (5/9);
        return Math.floor(celsiusTemp);
    }

    //Get list of days and create array
    function getWeekArray(){
        date = new Date().getDay();
        weekArray = [];
        for(i = 0; i < 7; i++){
            curr = (date + i) % 7;
            switch(curr){
                case 0:
                    day = "SUN";
                    break;
                case 1:
                    day = "MON";
                    break;
                case 2:
                    day = "TUE";
                    break;
                case 3:
                    day = "WED";
                    break;
                case 4:
                    day = "THU";
                    break;
                case 5:
                    day = "FRI";
                    break;
                case 6: 
                    day = "SAT";
                    break;
            }
            weekArray.push(day);
        }
        return weekArray;
    }
});