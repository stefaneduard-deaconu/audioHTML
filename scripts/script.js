// we follow a model:
// ->  we won't have two identical named files with different labels!
var filenames = [
	'activities',
	'animalsd',
	'animalss',
	'bathroom',
	'beverage',
	'birds',
	'body',
	'cardinal_points_and_continents',
	'clothes',
	'colors',
	'communication',
	'company',
	'economy',
	'elements',
	'emotions_and_feelings',
	'family',
	'flowers',
	'food',
	'fruits',
	'hobbies',
	'house',
	'insects',
	'jobs',
	'kitchen',
	'living_room',
	'looks',
	'mathematics',
	'medicine',
	'month_week_season',
	'my_room',
	'natural_hazards',
	'numbers',
	'office',
	'personality',
	'places',
	'plants_and_trees',
	'relations',
	'school',
	'seven_senses',
	'space',
	'sports',
	'surfaces',
	'time',
	'transportation_means',
	'trip',
	'underwater',
	'vegetables',
	'weather'
];

var labels = {
	'activities': 'Activities',
	'animalsd': 'Animals (Tame)',
	'animalss': 'Animals (Wild)',
	'bathroom': 'Bathroom',
	'beverage': 'Beverage',
	'birds': 'Birds',
	'body': 'Body',
	'cardinal_points_and_continents': 'Cardinal Points and Continents',
	'clothes': 'Clothes',
	'colors': 'Colors',
	'communication': 'Communication',
	'company': 'Company',
	'economy': 'Economy',
	'elements': 'Elements',
	'emotions_and_feelings': 'Emotions and Feelings',
	'family': 'Family',
	'flowers': 'Flowers',
	'food': 'Food',
	'fruits': 'Fruits',
	'hobbies': 'Hobbies',
	'house': 'House',
	'insects': 'Insects',
	'jobs': 'Jobs',
	'kitchen': 'Kitchen',
	'living_room': 'Living Room',
	'looks': 'Looks',
	'mathematics': 'Mathematics',
	'month_week_season': 'Months, Days and Seasons',
	'my_room': 'My Room',
	'natural_hazards': 'Natural Hazards',
	'numbers': 'Numbers',
	'office': 'Office',
	'places': 'Places',
	'plants_and_trees': 'Plants and Trees',
	'relations': 'Relations',
	'school': 'School',
	'seven_senses': 'Seven Senses',
	'space': 'Space',
	'sports': 'Sports',
	'surfaces': 'Surfaces',
	'time': 'Time',
	'transportation_means': 'Transportation Means',
	'trip': 'Trip',
	'underwater': 'Underwater',
	'vegetables': 'Vegetables',
	'weather': 'Weather'
};

var btns = []


function toLabel(string) {
	// replace replaces only the first occurence, for some reason :)()(
    split_string = string.split('_');
	// the next line make overleaping whitespaces collapse into one
	string = split_string.join(' ');
    string = string.trim();
    firstLetterToUpper = string.substr(0, 1) // getting the first letter
        .toUpperCase(); // making it uppercase
    remainder = string.substr(1); // getting the remainder of the string
    return firstLetterToUpper + remainder;
}

function generateButtons(filenames, labels) {
    // we create teh btn's, by using the labels as the explicit ones
    //   and using undefined for the default ones
    for (var i = 0; i < filenames.length; i++)
        btns.push({
            filename: filenames[i],
            label: labels[filenames[i]]
        });
    // now we set the default labels for the remaining buttons
    btns.forEach((btn) => {
        if (btn.label == undefined) {
            btn.label = toLabel(btn.filename);
            labels[btn.filename] = btn.label;
        }
    });
}
generateButtons(filenames, labels);


var buttons = new Vue({
    el: '#buttons',
    data: {
        btns: btns
    }
});


/*
 * after generating the buttons, we choose the first one to be loaded
 *   as default,
 */
// (*1) this should correspond with the focused element :)
// TODO  create a variable for the current playing file. create the events and matching classes necessary to add interactivity
var startup_audio = 'bathroom'; // this is the choice
var startup_label = new Vue({
    el: '#audio_label',
    data: {
        label: labels[startup_audio]
    }
});


/*
 * and now we add functionality to the buttons :)
 */
// TODO  also try a var btn of buttons variante :)
//
// (!) this section must be modified if you upload multiple audio formats (such as .wav, .mp3, .ogg)
var audioSource = document.querySelector('audio source');
var audioLabel = document.getElementById('audio_label');

function loadAudio(index) {
    // (!) this section must be modified if you upload multiple audio formats (such as .wav, .mp3, .ogg)
    audioSource.src = './audio/' + filenames[index] + '.wav';
    audioLabel.innerHTML = labels[filenames[index]];
}
//
buttons = document.getElementsByTagName('button');
for (let i = 0; i < buttons.length; i++) {
    buttons[i].setAttribute('onclick', `loadAudio(${i})`);
}


// final script, they might just be about styling :D
function postScriptum(buttonsToScroll) {
    var btnGroup = document.getElementsByClassName('btn-group')[0];
    // TODO: here we can do a function to find a certain element on which to fucus (*1)
    btnGroup.scrollBy(0, (buttonsToScroll - 1) * 36 + 1);
}
postScriptum(3); // we get into sight, and highlight (TODO), the fourth element
