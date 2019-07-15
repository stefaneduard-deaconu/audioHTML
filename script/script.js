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

// settings:
audio_src_url = 'https://raw.githubusercontent.com/stefaneduard-deaconu/audioHTML/gh-pages/audio/'
//
function set(option) { // option is a string, that stores the name of the audio file
    if (labels[option] == undefined)
        labels[option] = toLabel(option);
    //
    document.getElementsByTagName('h2')[0].innerHTML = labels[option];
    document.getElementsByTagName('source')[0].src = audio_src_url + `${option}.wav`;
    var player = document.getElementById('audio_player');
    player.load();
}

// we follow a model:
//   we won't have two identical named files with different labels !

// generating a selection of buttonCount buttons, and of labelCount implicit labels:
var filenames = [ ]
var labels = { }



function generateButtonContent(btnCount, lblCount) {
	// it is no problem if there are more labels than button :)
	possibleFilenames = [
		'_industrial',
		'_oildrum',
		'_ride',
		'_rock',
	]
	// it could be better if generating random stuff using the words, but that isn't important
	possibleLabels = [
		['_industrial', 'Industrialized world music'],
		['_oildrum', 'Oilly drum'],
		['_ride', 'Ride for music'],
		['_rock', 'Rocks and sticks..']
	]
	// generate integers between 0 and 3
	for(let i = 0; i < btnCount; i++) {
        value = parseInt(Math.random() * 4);
		console.log(value);
        filenames.push(possibleFilenames[value]);
    }
    for(let i = 0; i < lblCount; i++) {
        value = parseInt(Math.random() * 4);
		console.log(value);
        labels[`${possibleLabels[value][0]}`] = possibleLabels[value][1]
    }
}
generateButtonContent(16, 3);

//   for testin':
// console.log(filenames);
// console.log(labels);
// // You can easily, for testing, define your own labels here:
// var labels = {
//     '_industrial': 'Industrial Beats'
// }

var btns = []

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
set('_industrial');

/*
 * and now we add functionality to the buttons :)
 */
// TODO  also try a var btn of buttons variante :)
//
// (!) this section must be modified if you upload multiple audio formats (such as .wav, .mp3, .ogg)
var audioTag = document.querySelector('audio');
var audioLabel = document.getElementById('audio_label');

function loadAudio(index) {
    // (!) this section must be modified if you upload multiple audio formats (such as .wav, .mp3, .ogg)
    audioTag.children[0].src = audio_src_url + filenames[index] + '.wav';
	audioTag.load();
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
