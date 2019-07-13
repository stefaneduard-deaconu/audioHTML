// we use this next function to create labels for each file
// but we will create labels as they become necessary
function toLabel(string) {
		string = string.replace('_', ' ')
					   .trim();
		firstLetterToUpper = string.substr(0, 1) // getting the first letter
							       .toUpperCase(); // making it uppercase
		remainder = string.substr(1); // getting the remainder of the string
		return firstLetterToUpper + remainder;
	}


function set(option) { // option is a string, that stores the name of the audio file
	if (labels[option] == undefined)
		labels[option] = toLabel(option);
	//
	document.getElementsByTagName('h2')[0].innerHTML = labels[option];
	document.getElementsByTagName('source')[0].src = `./audio/${option}.wav`;
	var player = document.getElementById('audio_player');
	player.load();
}

// we follow a model:
//   we won't have two identical named files with different labels !
var filenames = [
	'_industrial',
	'_oildrum',
	'_ride',
	'_rock',
	'_industrial',
	'_oildrum',
	'_ride',
	'_ride',
	'_industrial',
	'_oildrum',
	'_ride',
	'_industrial',
	'_oildrum','_industrial',
	'_oildrum',
	'_ride',
	'_industrial',
	'_oildrum',
	'_ride',
	'_industrial',
	'_oildrum',
	'_ride',
]
// next we say that some audios must have less-defaulty labels
var labels = {
	'_industrial': 'Industrial Beats'
}
var btns = [ ]
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
var startup_audio = '_industrial';
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
for(let i = 0; i < buttons.length; i++) {
	buttons[i].setAttribute('onclick', `loadAudio(${i})`);
}


// final script, they might just be about styling :D
function postScriptum(buttonsToScroll) {
	var btnGroup = document.getElementsByClassName('btn-group')[0];
	// TODO: here we can do a function to find a certain element on which to fucus (*1)
	btnGroup.scrollBy(0, (buttonsToScroll - 1) * 36 + 1);
}
postScriptum(3); // we get into sight, and highlight (TODO), the fourth element
