//41 - 106

var dropDownList = {
    '0':"Location",
    '1':"Network",
    '2':"Connection Type",
    '3':"Video Quality",
    '4':"Device Type",
    '5': "Multi CDN",
    '6': "Encoder"
}

var dropdownContnetData = {
    '0': [{'name':'USA', 'value': 11}, 
          {'name':'Canada', 'value': 16}, 
          {'name':'France', 'value': 13}, 
          {'name':'India', 'value': 18}],

    '1': [{'name':'AT&T', 'value': 14},
          {'name':'Telus', 'value': 19},
          {'name':'Jio', 'value': 24},
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
    
    '5': [{'name':'Akamai', 'value': 700},
          {'name':'Azure', 'value': 200},
          {'name':'On Prem Private CDN', 'value': 100}],

    '6': [{'name':'Elemental', 'value': 30},
          {'name':'Harmonic', 'value': 27}]
}

var dropdownContnetActiveList = {
    '0': 0,
    '1': 0,
    '2': 1,
    '3': 1,
    '4': 3
}

let radioElementsTrack = new Array(Object.keys(dropDownList).length);

var emissionValuesArray = [84, 78, 43, 67, 75, 51, 58, 49, 41, 104, 69, 90, 47, 93, 42, 101, 103, 77, 105, 72, 41, 72, 100, 78, 86, 91, 91, 91, 76, 99, 72, 55, 57, 78, 43, 103, 42, 96, 91, 82, 68, 86, 82, 92, 92, 99, 69, 84, 75, 81, 96, 74, 65, 95, 94, 41, 106, 68, 62, 91, 63, 71, 99, 74, 94, 95, 81, 88, 99, 68, 83, 69, 66, 94, 101, 48, 62, 78, 50, 87, 73, 67, 73, 106, 86, 42, 68, 65, 97, 88, 53, 43, 86, 61, 94, 76, 73, 46, 81, 93];

var updateEmissionValuesArray = function(fetch){
    if(fetch){
        if(localStorage.getItem('emissionValuesArray')){
            emissionValuesArray = JSON.parse(localStorage.getItem('emissionValuesArray'));
        }
    }
    localStorage.setItem('emissionValuesArray', JSON.stringify(emissionValuesArray));
}

document.addEventListener('DOMContentLoaded', function () {
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
                calculateCurrentAssetEmission();
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
    calculateCurrentAssetEmission();
});

var calculateCurrentAssetEmission = function() {
    let len = Object.keys(dropdownContnetActiveList).length;
    let co2 = 0;
    for(let i = 0;i<len;i++){        
        if(dropdownContnetActiveList[i] >= 0){
            co2 += dropdownContnetData[i][dropdownContnetActiveList[i]]['value'];
        }
    }
    document.getElementById('current-session-co2-emission').textContent = "CO2 emission current playback = " + co2 + " kg";    
    emissionValuesArray.push(co2);

    let totalCo2 = emissionValuesArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    document.getElementById('total-co2-emission').textContent = "Total CO2 emission of asset  = " + totalCo2 + " kg";

    let avgCo2 = totalCo2/(emissionValuesArray.length);
    document.getElementById('average-co2-emission').textContent = "Average CO2 emission of the assets  = " + avgCo2.toFixed(2) + " kg";
    updateEmissionValuesArray(false);
    
    let indicator = document.getElementById('carbon-indicator');    
    if (co2 > avgCo2) {
        indicator.style.backgroundColor = 'red';
    } else if (co2 == avgCo2) {
        indicator.style.backgroundColor = 'orange';
    } else {
        indicator.style.backgroundColor = 'green';
    }
}

var collapse = function(container) {
    const children = container.children;

    for (let i = 0; i < children.length; i++) {        
        const content = children[i].querySelector('.dropdown-content');
        content.style.display = 'none';
    }
}