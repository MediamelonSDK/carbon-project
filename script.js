//41 - 106

var dropDownList = {
    '0':"Location",
    '1':"Network",
    '2':"Connection Type",
    '3':"Video Quality",
    '4':"Device Type",
    '5': "Multi CDN",
    '6': "Data Center"
}

var dropdownContnetData = {
    '0': [{'name':'USA', 'value': 11}, 
          {'name':'Canada', 'value': 16}, 
          {'name':'France', 'value': 13}, 
          {'name':'India', 'value': 18}],

    '1': [{'name':'AT&T', 'value': 14},
          {'name':'Telus', 'value': 19},
          {'name':'Jio', 'value': 21},
          {'name':'Vodafone', 'value': 11}],

    '2': [{'name':'WiFi', 'value': 7}, 
          {'name':'Mobile Network', 'value': 15}],

    '3': [{'name':'SD', 'value': 6}, 
          {'name':'HD', 'value': 14}, 
          {'name':'4K', 'value': 25}],

    '4': [{'name':'65" TV', 'value': 24}, 
          {'name':'55" TV', 'value': 20},
          {'name':'Web Browser', 'value': 14}, 
          {'name':'Mobile', 'value': 6}],
    
    '5': [{'name':'Akamai', 'value': 20.5},
          {'name':'Azure', 'value': 22.1},
          {'name':'On Prem Private CDN', 'value': 25}],

    '6': [{'name':'Elemental', 'value': 22.5},
          {'name':'Harmonic', 'value': 23.0}]
}

var dropdownContnetActiveList = {
    '0': 0,
    '1': 0,
    '2': 1,
    '3': 1,
    '4': 3,
    '5': 0,
    '6': 0
}

let radioElementsTrack = new Array(Object.keys(dropDownList).length);

var emissionValuesArray = [84, 78, 43, 67, 75, 51, 58, 49, 41, 104, 69, 90, 47, 93, 42, 101, 103, 77, 105, 72, 41, 72, 100, 78, 86, 91, 91, 91, 76, 99, 72, 55, 57, 78, 43, 103, 42, 96, 91, 82, 68, 86, 82, 92, 92, 99, 69, 84, 75, 81, 96, 74, 65, 95, 94, 41, 106, 68, 62, 91, 63, 71, 99, 74, 94, 95, 81, 88, 99, 68, 83, 69, 66, 94, 101, 48, 62, 78, 50, 87, 73, 67, 73, 106, 86, 42, 68, 65, 97, 88, 53, 43, 86, 61, 94, 76, 73, 46, 81, 93];

var playerEmission = 0, cdnEmission = 0, encoderEmission = 0;

var updateEmissionValuesArray = function(fetch){
    if(fetch){
        if(localStorage.getItem('emissionValuesArray')){
            emissionValuesArray = JSON.parse(localStorage.getItem('emissionValuesArray'));
        }
    }
    localStorage.setItem('emissionValuesArray', JSON.stringify(emissionValuesArray));
}

document.addEventListener('shaka-ui-loaded', function () {
    updateEmissionValuesArray(true); //fetch the stored emissionValuesArray from the local storage    

    const container = document.getElementById('dropdown-container');
    const numberOfDropdowns = Object.keys(dropDownList).length; // Change this number to create more or fewer dropdowns

    for (let i = 0; i < numberOfDropdowns; i++) {
        const dropdown = document.createElement('div');
        dropdown.classList.add('dropdown');
        //radio buttons
        const button = document.createElement('button');
        button.classList.add('dropdown-toggle');
        button.textContent = dropDownList[i];

        const dropdownContent = document.createElement('div');
        dropdownContent.classList.add('dropdown-content');
        dropdownContent.id = `dropdown-content${i}`;

        const radioLength = dropdownContnetData[i].length;
        for(let j=0;j<radioLength;j++){
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `dropdown${i}`;
            radio.id = `dp${j}`;
            
            if(j == dropdownContnetActiveList[i]){
                radio.checked = true;
                radioElementsTrack[i] = radio;
            }

            radio.addEventListener('click', function(){
                if (this === radioElementsTrack[i]) {
                    this.checked = false;
                    radioElementsTrack[i] = null;
                } else {                    
                    radioElementsTrack[i] = this;
                }

                if (this.checked) {
                    dropdownContnetActiveList[i] = j;                    
                } else {
                    dropdownContnetActiveList[i] = -1;
                }

                if(i < 5){
                    calculateCurrentAssetEmission(true);
                    calculateCDNEmission();                    
                }
                else if(i == 5){
                    calculateCDNEmission();
                } else if(i > 5){
                    calculateEncoderEmission();
                }

                updateTotalCO2Emission();
                
            })

            label.appendChild(radio);
            label.appendChild(document.createTextNode(`${dropdownContnetData[i][j]['name']}`));
            dropdownContent.appendChild(label);
        }

        dropdown.appendChild(button);
        dropdown.appendChild(dropdownContent);
        container.appendChild(dropdown);

        const toggleButton = dropdown.querySelector('.dropdown-toggle');
        const content = dropdown.querySelector('.dropdown-content');
        content.style.display = 'none';

        toggleButton.addEventListener('click', function () {
            if (content.style.display === 'none') {
                collapse(container);
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    }
    calculateCurrentAssetEmission(true);
    calculateCDNEmission();
    calculateEncoderEmission();
    updateTotalCO2Emission();

    //NEW
    const overlayContainer = document.getElementById('overlay-content');    
    overlayContainer.style.display = 'none';  
    setTimeout(function(){
        let indicator = document.getElementById('emission-indicator');
        let overlayShowing = false;

        // Open the overlay when the carbon indicator is clicked
        indicator.addEventListener('click', (e) => {
            overlayShowing = ! overlayShowing;
            overlayContainer.style.display = overlayShowing ? 'flex' : 'none';
            e.preventDefault();
            e.stopPropagation();
        });
    },1000);
    //NEW
});

var calculateCurrentAssetEmission = function(updateArray) {
    let len = 5; //Object.keys(dropdownContnetActiveList).length;
    let co2 = 0;
    for(let i = 0;i<len;i++){        
        if(dropdownContnetActiveList[i] >= 0){
            co2 += dropdownContnetData[i][dropdownContnetActiveList[i]]['value'];
        }
    }
    document.getElementById('current-session-co2-emission').textContent = "CO2e for current playback session = " + co2 + " kg"; 
    
    if(!updateArray){
        emissionValuesArray.pop();
    }
    emissionValuesArray.push(co2);

    let totalCo2 = emissionValuesArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    document.getElementById('total-co2-emission').textContent = "Total CO2e of all the playback sessions = " + totalCo2.toFixed(2) + " kg";

    let avgCo2 = totalCo2/(emissionValuesArray.length);
    document.getElementById('average-co2-emission').textContent = "Avg. CO2e per playback session = " + avgCo2.toFixed(2) + " kg";
    updateEmissionValuesArray(false);


    document.getElementById('overlay-co2-emission').textContent = "CO2e for current session = " + co2 + " kg";
    document.getElementById('overlay-avg-co2-emission').textContent = "Avg. CO2e per session = " + avgCo2.toFixed(2) + " kg";
    document.getElementById('overlay-total-co2-emission').textContent = "Total CO2e of all sessions = " + totalCo2.toFixed(2) + " kg";
    
    let indicator = document.getElementById('emission-indicator'); 
    let innerIndicator = document.getElementById('overlay-inner-indicator');    
    let switchElement = document.getElementById('switch');
    if (co2 > avgCo2) {
        indicator.src = 'Carbon-Icon-R.svg';
        innerIndicator.src = 'leaf-R.svg';
        switchElement.checked = false;
    } else if (co2 == avgCo2) {
        indicator.src = 'Carbon-Icon_O.svg';
        innerIndicator.src = 'leaf-O.svg';
        switchElement.checked = false;
    } else {
        indicator.src = 'Carbon-Icon.svg';
        innerIndicator.src = 'leaf.svg';
        switchElement.checked = true;
    }

    playerEmission = co2;
}

var calculateCDNEmission = function() {
    let avgCo2 = 0;
    if(dropdownContnetActiveList[5] >= 0){
        avgCo2 = dropdownContnetData[5][dropdownContnetActiveList[5]]['value'];
    }

    let len = emissionValuesArray.length;
    let totalCo2 = len*avgCo2;

    document.getElementById('avgerage-co2-cdn').textContent = "Avg. CO2e per CDN session = " + avgCo2.toFixed(2) + " kg";    

    document.getElementById('total-co2-cdn').textContent = "Total CO2e of all the CDN sessions = " + totalCo2.toFixed(2) + " kg";

    cdnEmission = avgCo2;
}

var calculateEncoderEmission = function() {
    let avgEncodeCO2 = 0;
    if(dropdownContnetActiveList[6] >= 0){
        avgEncodeCO2 = dropdownContnetData[6][dropdownContnetActiveList[6]]['value'];
    }

    document.getElementById('encode-avg-co2').textContent = "Avg. CO2e per session to encode & package = " + avgEncodeCO2 + " kg";    

    let len = emissionValuesArray.length;
    let totalCo2 = len*avgEncodeCO2;
    document.getElementById('encode-co2-emission').textContent = "Total CO2e to encode & package = " + totalCo2 + " kg";    

    encoderEmission = avgEncodeCO2;
}

var updateTotalCO2Emission = function() {

    let totalCO2Emission = playerEmission + cdnEmission + encoderEmission;
    document.getElementById('overall-co2-emission').textContent = "Cummulative CO2e for current session = " + totalCO2Emission + " kg";    
}

var collapse = function(container) {
    const children = container.children;

    for (let i = 0; i < children.length; i++) {        
        const content = children[i].querySelector('.dropdown-content');
        content.style.display = 'none';
    }
}

var handleSwitch = function() {
    let switchElement = document.getElementById('switch');

    if(!switchElement.checked){
        switchElement.checked = true;
    }
    else {
        dropdownContnetActiveList[2] = 0;
        dropdownContnetActiveList[3] = 0;

        let ctRaido = document.getElementById('dropdown-content2').querySelector('#dp0');
        ctRaido.checked = true;
        radioElementsTrack[2] = ctRaido;

        let vqRadio = document.getElementById('dropdown-content3').querySelector('#dp0');
        vqRadio.checked = true;
        radioElementsTrack[3] = vqRadio;

        calculateCurrentAssetEmission(false);
    }
}

var openLink = function(link) {

    if(link === 'instagram'){
        window.open('https://www.instagram.com', '_blank');
    }
    else if(link === 'twitter'){
        window.open('https://www.x.com', '_blank');
    }
    
}