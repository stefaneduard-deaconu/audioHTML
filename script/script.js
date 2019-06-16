function set(option) {
	var options = [
		"animals",
		"birds",
		"clothing",
		"car",
		"diseases",
		"education"
		]
	var labels = [
		"Animals",
		"Birds",
		"Clothing",
		"Car",
		"Diseases",
		"Education"
		]
	//console.log(document.getElementById("audio_player"));
	
	console.log(document.getElementsByTagName("h2")[0].innerHTML);
	console.log(options[option - 1]);
	document.getElementsByTagName("h2")[0].innerHTML = labels[option - 1];
	console.log(document.getElementsByTagName("source")[0]);
	document.getElementsByTagName("source")[0].src = `./audio/${options[option - 1]}.wav`;
	var player = document.getElementById("audio_player");
	player.load();
}