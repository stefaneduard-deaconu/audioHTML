var options = [
		"_industrial",
		"_oildrum",
		"_ride",
		"_rock"
		]
var labels = { }

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
	console.log(labels[option]); //
	if (labels[option] == undefined)
		labels[option] = toLabel(option);
	console.log(labels[option]);
	//
	document.getElementsByTagName("h2")[0].innerHTML = labels[option];
	document.getElementsByTagName("source")[0].src = `./audio/${option}.wav`;
	var player = document.getElementById("audio_player");
	player.load();
}