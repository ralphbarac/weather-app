window.addEventListener('load', ()=> {
    let long;
    let lat;
    const timeSectionHour = document.querySelector('.hour');
    const timeSectionModifier = document.querySelector('.modifier');
    const timeSectionDate = document.querySelector('.time-section-date');
    const temperatureDescription = document.querySelector('.temperature-section-summary');
    const temperatureDegree = document.querySelector('.temperature-section-degree');
    const locationTimezone = document.querySelector('.temperature-section-location');
    const temperatureSection = document.querySelector('.temperature-section');
    const temperatureSpan = document.querySelector('.temperature-section span');
    const overviewParagraph = document.querySelector('.overview-paragraph');

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
                    const { temperature, summary, icon } = info.currently;
                    const minutely_summary = info.minutely.summary
                    const daily_summary = info.daily.summary
                    //Set DOM elements from the API
                    temperatureDegree.textContent = Math.floor(temperature) + "°";
                    temperatureDescription.textContent = summary;
                    locationTimezone.textContent = info.timezone;
                    overviewParagraph.textContent = minutely_summary + " " + daily_summary;
                    //Temperature conversion between C/F
                    let celsius = convToCelsius(temperature);
                    //Time conversion from UNIX to current date and time
                    let date = new Date(info.currently.time*1000);
                    let modifier = 'AM'
                    let hours = date.getHours();
                    if(hours > 12){
                        hours = hours - 12;
                        modifier = 'PM'
                    }
                    let minutes = "0" + date.getMinutes();
                    let formattedTime = hours + ':' + minutes.substr(-2);
                    //Initilize array for weekday section
                    let tempHigh = [];
                    for(i = 0; i < 7; i++){
                        tempHigh.push(info.daily.data[i].temperatureHigh);
                    }
                    let weekDayBlocks = Array.from(document.getElementsByClassName('week-section-block'));    
                    //Change Temperature to Celsius/Farenheit
                    temperatureDegree.addEventListener('click', () =>{
                        if(temperatureSpan.textContent === "Farenheit"){
                            temperatureSpan.textContent = "Celsius";
                            temperatureDegree.textContent = celsius + "°";
                            for(i = 0; i < 7; i++){
                                weekDayBlocks[i].getElementsByClassName('temp-high')[0].textContent = convToCelsius(tempHigh[i]);
                            }
                        }
                        else{
                            temperatureSpan.textContent = "Farenheit";
                            temperatureDegree.textContent = Math.floor(temperature) + "°";
                            for (i = 0; i < 7; i++){
                                weekDayBlocks[i].getElementsByClassName('temp-high')[0].textContent = Math.floor(tempHigh[i]);
                            }
                        }
                    });
                
                    //Set the date, temperature high, and icon in each weekday box 
                    weekArray = getWeekArray();               
                   for(i = 0; i < 7; i++){
                       weekDayBlocks[i].getElementsByClassName('title')[0].textContent = weekArray[i].substr(0,3);
                       weekDayBlocks[i].getElementsByClassName('temp-high')[0].textContent = Math.floor(tempHigh[i]);
                       let skycons = new Skycons({"color": "white"});
                       skycons.add(weekDayBlocks[i].getElementsByClassName('icon')[0], info.daily.data[i].icon.replace(/-/g, "_").toUpperCase());
                       skycons.play();

                    }
                    weekDayBlocks[0].getElementsByClassName('title')[0].textContent = "TODAY";
                    skycons.add(document.getElementsByClassName('icon-0')[0], icon.replace(/-/g, "_").toUpperCase());

                    //Set DOM elements with time from API
                    timeSectionHour.textContent = formattedTime;
                    timeSectionModifier.textContent = modifier;
                    timeSectionDate.textContent = weekArray[0].toLowerCase().charAt(0).toUpperCase()+weekArray[0].substr(1).toLowerCase() + "," + " " + date.getDate() + " " + getMonth() + " " + date.getFullYear();

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
                    day = "SUNDAY";
                    break;
                case 1:
                    day = "MONDAY";
                    break;
                case 2:
                    day = "TUESDAY";
                    break;
                case 3:
                    day = "WEDNESDAY";
                    break;
                case 4:
                    day = "THURSDAY";
                    break;
                case 5:
                    day = "FRIDAY";
                    break;
                case 6: 
                    day = "SATURDAY";
                    break;
            }
            weekArray.push(day);
        }
        return weekArray;
    }

    function getMonth(){
        month = new Date().getMonth();
       switch(month){
           case 0:
                month = "January";
                break;
           case 1:
                month = "February";
                break;
           case 2:
                month = "March";
                break;
           case 3:
                month = "April";
                break;
           case 4:
                month = "May";
                break;
           case 5:
                month = "June";
                break;
           case 6:
                month = "July";
                break;
           case 7:
                month = "August";
                break;
           case 8:
                month = "September";
                break;
           case 9:
                month = "October";
                break;
           case 10:
                month = "November";
                break;
           case 11:
                month = "December";
                break;
       }
       return month;
    }
});