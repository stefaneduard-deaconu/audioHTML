function set(option) {
	var options = [
		"_industrial",
		"_oildrum",
		"_ride",
		"_rock"
		]
	var labels = [
		"Industrial Beat",
		"Oil Drums",
		"Ride Patterns",
		"Rock Sounds"
		]
	document.getElementsByTagName("h2")[0].innerHTML = labels[option - 1];
	document.getElementsByTagName("source")[0].src = `./audio/${options[option - 1]}.wav`;
	var player = document.getElementById("audio_player");
	player.load();
}