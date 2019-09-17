/*
     █████  ██    ██ ██   ██         ███████ ███    ██ ███████
    ██   ██ ██    ██  ██ ██          ██      ████   ██ ██
    ███████ ██    ██   ███           █████   ██ ██  ██ ███████
    ██   ██ ██    ██  ██ ██          ██      ██  ██ ██      ██
    ██   ██  ██████  ██   ██         ██      ██   ████ ███████
*/


function toLabel(string) {
    if (!string) return ''
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

/*
        ███    ███  ██████  ██████  ██    ██ ██      ███████ ███████
        ████  ████ ██    ██ ██   ██ ██    ██ ██      ██      ██
        ██ ████ ██ ██    ██ ██   ██ ██    ██ ██      █████   ███████
        ██  ██  ██ ██    ██ ██   ██ ██    ██ ██      ██           ██
        ██      ██  ██████  ██████   ██████  ███████ ███████ ███████
*/


const fs = require('fs')
const ipc = require('electron').ipcRenderer;




/*
        ███████ ███████ ████████ ████████ ██ ███    ██  ██████  ███████
        ██      ██         ██       ██    ██ ████   ██ ██       ██
        ███████ █████      ██       ██    ██ ██ ██  ██ ██   ███ ███████
             ██ ██         ██       ██    ██ ██  ██ ██ ██    ██      ██
        ███████ ███████    ██       ██    ██ ██   ████  ██████  ███████
*/

const SettingsClass = function(oldSettings) {
    const settings = {}
    for (key in oldSettings) {
        settings[key] = oldSettings[key]
    }
    return settings
}

var settingsObject = SettingsClass(
    JSON.parse(ipc.sendSync('send-settings'))
)

console.log(settingsObject)

/*
        ██████  ██    ██ ████████ ████████  ██████  ███    ██ ███████
        ██   ██ ██    ██    ██       ██    ██    ██ ████   ██ ██
        ██████  ██    ██    ██       ██    ██    ██ ██ ██  ██ ███████
        ██   ██ ██    ██    ██       ██    ██    ██ ██  ██ ██      ██
        ██████   ██████     ██       ██     ██████  ██   ████ ███████
*/


const AudioButton = function(audioSource, label, id) {
    const btn = {}
    btn.audioSource = audioSource
    btn.label = label
    btn.id = id
    btn.getLabel = function() {
        return btn.label
    }
    btn.getId = function() {
        return btn.id
    }
    btn.setLabel = function(label) {
        btn.label = label
    }
    btn.setId = function(id) {
        btn.id = id
    }
    return btn
}
const ImagePresentation = function(id, images) {
    const presentation = {}
    presentation.id = id
    presentation.images = images
    return presentation
}

// we follow a model:
// ->  we won't have two identical named files with different labels!

var filenames = JSON.parse(ipc.sendSync('send-filenames'))
var labels = JSON.parse(ipc.sendSync('send-labels'))


function generateButtons(filenames, labels) {
    let btns = []
    // we create teh btn's, by using the labels as the explicit ones
    //   and using undefined for the default ones
    for (let i = 0; i < filenames.length; i++)
        btns.push(AudioButton(filenames[i], labels[filenames[i]], i));
    // now we set the default labels for the remaining buttons
    btns.forEach((btn) => {
        if (btn.getLabel() == undefined) {
            btn.setLabel(
                toLabel(btn.audioSource)
            )
            labels[btn.filename] = btn.getLabel;
        }
    })
    return btns
}

var buttons = generateButtons(filenames, labels)

// generate the Vue object used for generating the buttons:
let btns_data = []
for (let i = 0; i < buttons.length; i++) {
    btns_data.push({
        'id': buttons[i].getId(),
        'label': buttons[i].getLabel()
    })
}
var vueButtons = new Vue({
    el: '#buttons',
    data: {
        btns: btns_data
    }
})


/*
            ██ ███    ███  █████   ██████  ███████ ███████
            ██ ████  ████ ██   ██ ██       ██      ██
            ██ ██ ████ ██ ███████ ██   ███ █████   ███████
            ██ ██  ██  ██ ██   ██ ██    ██ ██           ██
            ██ ██      ██ ██   ██  ██████  ███████ ███████
*/

// The next one is a Singleton gallery with presentations for each button

const ImagesGallery = (function() {
    var instance
    function createInstance() { // called only once during the execution
        const gallery = {}
        // fields and members:
        gallery.img = document.querySelector("#pictureDiv img")
        gallery.setPicture = function(src) {
            let timer = 0
            let interval = setInterval(function () {
                timer += 16
                gallery.img.style.top = `${1.618 * (timer / 618) * 100}%`
            }, 16);
            setTimeout(function(){
                gallery.img.src = src
                gallery.img.style.top = `${-1.618 * (timer / 618) * 100}%`
                window.clearInterval(interval)
                interval = setInterval(function () {
                    timer -= 16
                    gallery.img.style.top = `${-1.618 * (timer / 618) * 100}%`
                }, 16);
            }, 618)
            setTimeout(function(){
                window.clearInterval(interval)
                gallery.img.style.top = `0px`
            }, 1236)
        }
        return gallery
    }
    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance()
            }
            return instance
        }
    }
})()

gallery = ImagesGallery.getInstance()
setTimeout(function(){ gallery.setPicture("images/animalsd0.jpg") }, 1000)


console.log(ImagesGallery.getInstance())

// TODO  model: the rule is that each filenames has associated images,
// named by uding the filename and numbered 0, ...

function generatePresentations(filenames) {
    const base_dir = './images/'
    presentations = []
    for (fn of filenames) {
        base_fn = base_dir + fn
        images = []
        toContinue = true
        for (number = 0; toContinue && number < 3; number++) {
            complete_path_to_file = `${base_fn}${number}.jpg`
            // Synchronous method
            try {
                // TODO  this enxt part doesn't allow for a dynamic image extension
                if (fs.existsSync(complete_path_to_file)) {
                    //file exists
                    images.push(fn + number + '.jpg')
                } else {
                    toContinue = false
                }
            } catch (err) {
                console.error(err)
            }
            // The next method is asynchronous
            // console.log(complete_path_to_file)
            // fs.access(complete_path_to_file, fs.F_OK, (err) => {
            //     if (err) {
            //         // BUG GY
            //         // console.error(err)
            //         toContinue = false
            //         return
            //     }
            //     //file exists
            //     console.log(complete_path_to_file)
            //     images.push(fn + number + '.jpg')
            // })
        }
        presentations.push(images)
    }
    return presentations
}
var presentations = generatePresentations(filenames)
console.log(presentations)



/*
         █████        ██████  ██       █████  ██    ██ ███████ ██████
        ██   ██       ██   ██ ██      ██   ██  ██  ██  ██      ██   ██
        ███████ █████ ██████  ██      ███████   ████   █████   ██████
        ██   ██       ██      ██      ██   ██    ██    ██      ██   ██
        ██   ██       ██      ███████ ██   ██    ██    ███████ ██   ██
*/

window.addEventListener('load', function() {
    setTimeout(function() {
        document.getElementById('audio-player').classList.add('active')
    }, 618);

})





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
var audioTag = document.querySelector('audio');
var audioLabel = document.getElementById('audio_label');

function loadAudio(index, autoplay = true) {
    // (!) this section must be modified if you upload multiple audio formats (such as .mp3, .mp3, .ogg)
    audioTag.children[0].src = './audios/' + filenames[index] + '.mp3';
    audioTag.load();
    audioLabel.innerHTML = labels[filenames[index]];
    // here we make other stuff, like focusing on the audio and loading the corresponding image
    const image = document.getElementsByTagName('img')[0];
    image.src = `./images/${filenames[index]}.jpg`;
    audioTag.click();
    setTimeout(function() {
        audioTag.focus();
        if (autoplay)
            audioTag.play();
    }, 382);
}
//
buttons = document.getElementsByTagName('button');
for (let i = 0; i < buttons.length; i++) {
    buttons[i].setAttribute('onclick', `loadAudio(${i})`);
}

window.addEventListener('load', function() {
    // final script, they might just be about styling :D
    function postScriptum(buttonsToScroll) {
        var btnGroup = document.getElementsByClassName('btn-group')[0];
        // TODO: here we can do a function to find a certain element on which to fucus (*1)
        btnGroup.scrollBy(0, 42 + buttonsToScroll * 36);
    }
    // TODO  next one:
    //postScriptum(filenames.indexOf(startup_audio)); // we get into sight, and highlight (TODO), the fourth element
    // load the startup audio:
    loadAudio(0, false);

    setTimeout(function() {
            document.getElementsByTagName('audio')[0].focus();
        },
        382
    );

    // TODO  ???? what about this?
    //document.getElementsByTagName('audio')[0].autoplay = true;
});





/*
// autoplay audiofile after audiofile
document.getElementsByTagName('audio')[0].onended = function() {

	// very in work
	alert('loading the next section in 5 seconds');
	setTimeout(function(){

loadAudio(3)}, 5000); // TODO  replace this with the next item, if there is one
} */

var toggled = false;
document.onkeydown = (e) => {
    /* here we use spacebar for playing and pausing the audio
    	function description:
    */
    const DOWN = 40,
        UP = 38,
        SPACEBAR = 32,
        ENTER = 13;
    key = e.keyCode;
    //console.log(key);
    // TODO  make the audio so that it is focused only when playing
    if (key == SPACEBAR) { // whitespace :D
        var isFocused = (document.activeElement === audioTag); // check for focus
        if (!isFocused) {
            audioTag.focus();
            if (audioTag.duration > 0 && !audioTag.paused) { // it's playing ----> this will disappear, soon :)
                audioTag.pause();
            } else {
                audioTag.play();
            }
        }
        /*else { // we presume we just pause the audio, because it being focused means it is playing :D
        	audioTag.pause();
        	console.log('foc');
        } */
        //audioTag.dispatchEvent(new KeyboardEvent('keypress',{'keyCode':32, 'which':32}));
    }
    // else {
    // 	if (key == DOWN) {
    // 		console.log('down, next audio, just browsing');
    // 		toggled = false
    // 	}
    // 	if (key == UP) {
    // 		console.log('up, previous audio, just browsing');
    // 		toggled = false
    // 	}
    // 	if (key == ENTER) {
    //
    // 		console.log('enter - load audio');
    //
    // 		if (toggled) {
    // 			loadAudio(3);
    // 			toggled = false;
    // 		} else {
    // 			document.getElementById('textDiv').innerHTML = 'Press again Enter to load next section';
    // 			toggled = true;
    // 		}
    //
    // 	}
    // }
};
/*document.addEventListener('click', function() {
	audioTag.pause();
});*/

// TODO  replace existing :focus CSS with one with .playing class, for easier control over everything

// functions for inserting a TAG with the PROPS of ... (obj) before an element and a father :)
//
// btn = document.getElementsByTagName('button')[0];
// // we create a container div
// containerDiv = document.createElement('div');
// containerDiv.style.display = 'inline-block';
// containerDiv.height = containerDiv.width = '36px';
// console.log(containerDiv);
// newImg = document.createElement('img');
// newImg.src = './icons/i.png';
// newImg.style.paddingTop = newImg.style.paddingLeft = (36 - 20) / 2 + 'px';
// newImg.width = '20';
// newImg.height = '20';
// //
// newImg.style.background = 'white';
// newImg.style.borderRight = `${(36 - 20) / 2}px solid white`;
// newImg.style.borderBottom = `${(36 - 20) / 2 - 1}px solid white`;
// newImg.style.borderLeft = '1px solid black';
// // newImg.style.margin = '0';
// newImg.style.margin = window.getComputedStyle(btn).margin; // in case it's the first button
// //
// btn.classList.add('x-btn');
// //
// btn.parentNode.insertBefore(newImg, btn);


// for (i of [1, 2, 4, 6, 9]) {
// 	btn = document.getElementsByTagName('button')[i];
// 	// we create a container div
// 	containerDiv = document.createElement('div');
// 	containerDiv.style.display = 'inline-block';
// 	containerDiv.height = containerDiv.width = '36px';
// 	console.log(containerDiv);
// 	newImg = document.createElement('img');
// 	newImg.src = './icons/i.png';
// 	newImg.style.paddingTop = newImg.style.paddingLeft = (36 - 20) / 2 + 'px';
// 	newImg.width = '20';
// 	newImg.height = '20';
// 	//
// 	newImg.style.background = 'white';
// 	newImg.style.borderRight = `${(36 - 20) / 2}px solid white`;
// 	newImg.style.borderBottom = `${(36 - 20) / 2 - 2}px solid white`;
// 	newImg.style.borderLeft = '1px solid black';
// 	// newImg.style.margin = '0';
// 	newImg.style.margin = window.getComputedStyle(btn).margin; // in case it's the first button
// 	newImg.style.marginTop = 42 + i * 36;
// 	//
// 	btn.classList.add('x-btn');
// 	//
// 	btn.parentNode.insertBefore(newImg, btn);
// }
//
//
// btn = document.getElementsByTagName('button')[7];
// // we create a container div
// containerDiv = document.createElement('div');
// containerDiv.style.display = 'inline-block';
// containerDiv.height = containerDiv.width = '36px';
// console.log(containerDiv);
// newImg = document.createElement('img');
// newImg.src = './icons/t.png';
// newImg.style.paddingTop = newImg.style.paddingLeft = (36 - 20) / 2 + 'px';
// newImg.width = '20';
// newImg.height = '20';
// //
// newImg.style.background = 'white';
// newImg.style.borderRight = `${(36 - 20) / 2}px solid white`;
// newImg.style.borderBottom = `${(36 - 20) / 2 - 2}px solid white`;
// newImg.style.borderLeft = '1px solid black';
// // newImg.style.margin = '0';
// newImg.style.margin = window.getComputedStyle(btn).margin; // in case it's the first button
// newImg.style.marginTop = 42 + 7 * 36;
// //
// btn.classList.add('x-btn');
// //
// btn.parentNode.insertBefore(newImg, btn);
//
// // button.x-btn + button {
// // 	border-top: 1px solid black;
// // }
// // 	button.x-btn + img {
// // 		border-top: 1px solid black;
// // 		display: inline;
// // 	}
// // 	button.x-btn + img + button{
// // 		border-top: 1px solid black;
// // 	}





// here we try to make a div fit :)
// TODO  remember that weird things may happen, if the label is too long :))

function addLetterToButton(index, letter) {
    // use 'i' or 't' to add the corresponding letter :D
    btn = document.getElementsByTagName('button')[i]
    btn.classList.toggle('x-btn')
    div = document.createElement('div')
    div.classList.toggle('x-btn')
    btn.parentNode.insertBefore(div, btn)
    img = document.createElement('img')
    img.src = `./icons/${letter}.png`
    div.appendChild(img)
    // to align the text :))
    btn.style.paddingRight = '60px' // 24 + 36
}
// for (i of [4, 7, 12]) {
//     addLetterToButton(i, 'i')
// }
// for (i of [5, 6, 9]) {
//     addLetterToButton(i, 't')
// }

// TODO  e-btn (expandable button)
// we presume the buttons are always together, and in the array the order is ascending
function groupButtons(firstButton, numButtons, groupName, groupLabel = toLabel(groupName)) {
    // used for when we already added expandable buttons :)
    let btns = document.getElementsByTagName('button')
    let firstIndex = 0
    for (index in btns) { // pay attention to this being a string :D))
        if (btns[index].innerHTML.trim() == labels[firstButton]) {
            firstIndex = parseInt(index)
            break
        }
    }

    /// (I) we create the expandable button
    // now we know the index of the first button, and we have to group it with other numButtons buttons :DD
    // and we take the first buttons
    btnAfterExpandable = btns[firstIndex]
    let expandableBtn = document.createElement('button');
    expandableBtn.innerHTML = groupLabel;
    let btnGroup = document.querySelector('.btn-group');
    btnGroup.insertBefore(expandableBtn, btnAfterExpandable);
    //
    let btn = btns[firstIndex]
    btn.classList.add('x-btn');
    btn.classList.add('e-btn');
    let div = document.createElement('div');
    div.classList.add('x-btn');
    div.classList.add('e-btn');
    btn.parentNode.insertBefore(div, btn);
    // and we insert the image (plus sign)
    img = document.createElement('img')
    img.src = './icons/more.png'
    div.appendChild(img);
    // to align the text :))
    btn.style.paddingRight = '60px'; // 24 + 36
    // style the button so that the plus also highlights
    // for the button
    // TODO  add on mouse over, because we get unwanted results :(
    btn.addEventListener('mouseenter', function() {
        console.log('entering')
        if (!buttonsToExpand[groupName].toggled) {
            div.style.backgroundColor = 'rgb(2, 182, 236)';
            btn.style.backgroundColor = 'rgb(2, 182, 236)';
        } else {
            div.style.backgroundColor = 'white'
        }
    });
    btn.addEventListener('mouseleave', function() {
        console.log('leaving')
        if (!buttonsToExpand[groupName].toggled) {
            div.style.backgroundColor = 'rgb(2, 200, 259)'
            btn.style.backgroundColor = 'rgb(2, 200, 259)'
        } else {
            div.style.backgroundColor = 'white'
        }

    });
    // for the div :)
    div.addEventListener('mouseenter', function() {
        btn.dispatchEvent(new Event('mouseenter'))
    });
    div.addEventListener('mouseleave', function() {
        btn.dispatchEvent(new Event('mouseleave'))
    });
    /// (I) we unroot the corresponding buttons, we place them inside the 'buttonsToExpand' object
    // set the label
    console.log(groupName)
    buttonsToExpand[groupName].label = groupLabel;
    // *** set the buttons
    // but first,
    // let's create the '.btn-subgroup' div :)
    let groupDiv = document.createElement('div');
    groupDiv.classList.add('btn-subgroup');
    for (let i = 0; i < numButtons; i++) {
        let btn = btnGroup.removeChild(btns[firstIndex + 1]);
        btn.classList.toggle('x-btn');
        groupDiv.appendChild(btn);
        // creating the div with the icon, attention that the x-btn class is toggled, not added (as in the rest of the buttons). but we could always toggle it :))
        let div = document.createElement('div');
        div.classList.add('x-btn');
        groupDiv.insertBefore(div, btn);
        img = document.createElement('img')
        img.src = './icons/dots_vertical.png'
        div.appendChild(img);
        // to align the text :))
        btn.style.paddingRight = '60px'; // 24 + 36
        //
        groupDiv.insertBefore(div, btn);
    }
    // btnGroup.insertBefore(groupDiv, btnAfterExpandable);
    // console.log(groupDiv);
    buttonsToExpand[groupName].subgroup = groupDiv
    console.log(buttonsToExpand)

    /// (III)  and now the event listeners that expand the button :DDDD
    // div is the plus (expand) one
    div.addEventListener('click', function(e) {
        // change the icon:
        console.log(e.target)
        console.log(e.target.nodeName)
        if (!buttonsToExpand[groupName].toggled) {
            if (e.target.nodeName == "IMG") {
                e.target.src = './icons/diminish.png'
            } else { // it's the div containing it :), it's parent
                e.target.children[0].src = './icons/diminish.png'
            }
        } else {
            if (e.target.nodeName == "IMG") {
                e.target.src = './icons/more.png'
            } else { // it's the div containing it :), it's parent
                e.target.children[0].src = './icons/more.png'
            }
        }
        // set the div's bg colour to white
        if (!buttonsToExpand[groupName].toggled) {
            if (e.target.nodeName == "IMG") {
                e.target.parentNode.style.backgroundColor = 'white';
                e.target.parentNode.nextSibling.style.backgroundColor = 'rgb(2, 182, 236)';
                e.target.parentNode.nextSibling.style.color = 'black';
            } else {
                e.target.style.backgroundColor = 'white';
                e.target.nextSibling.style.backgroundColor = 'rgb(2, 182, 236)';
                e.target.nextSibling.style.color = 'black';
            }
        } else {
            if (e.target.nodeName == "IMG") {
                e.target.parentNode.style.backgroundColor = 'white';
                e.target.parentNode.nextSibling.style.backgroundColor = 'rgb(2, 200, 259)';
                e.target.parentNode.nextSibling.style.color = 'white';
            } else {
                e.target.style.backgroundColor = 'white';
                e.target.nextSibling.style.backgroundColor = 'rgb(2, 200, 259)';
                e.target.nextSibling.style.color = 'white';
            }
        }
        // NOW attach the subgroup:
        if (!buttonsToExpand[groupName].toggled) {
            btnGroup.insertBefore(buttonsToExpand[groupName].subgroup, btn.nextSibling)
            buttonsToExpand[groupName].toggled = true
        } else {
            btnGroup.removeChild(buttonsToExpand[groupName].subgroup, btn.nextSibling)
            buttonsToExpand[groupName].toggled = false
        }
        // div.nextSibling.addEventListener('click', function(e){e.target.previousSibling.click()})
        // but it's reset by the mouseenter, mouseleave events :
        // TODO  unset it later on :), we can keep a toogle for each Event Listener :D


        // btns =
        // for (i in btnGroup) {
        //
        // 	newDiv.appendChild()
        // }
    });
    btn.addEventListener('click', function(e) {
        e.target.previousSibling.click()
    })
    // (*) and finally, the button will expand using an event listener
}

var buttonsToExpand = {
    'animals': {
        'label': 'Animals',
        'subgroup': undefined,
        'toggled': false
    }
}

// groupButtons('animalsd', 2, 'animals', 'Animals');





// btn.addEventListener

// btn = document.getElementsByTagName('button')[1];
// // we create a container div
// containerDiv = document.createElement('div');
// containerDiv.style.display = 'inline-block';
// containerDiv.height = containerDiv.width = '36px';
// console.log(containerDiv);
// newImg = document.createElement('img');
// newImg.src = './icons/t.png';
// newImg.style.paddingTop = newImg.style.paddingLeft = (36 - 20) / 2 + 'px';
// newImg.width = '20';
// newImg.height = '20';
// //
// newImg.style.background = 'white';
// newImg.style.borderRight = `${(36 - 20) / 2}px solid white`;
// newImg.style.borderBottom = `${(36 - 20) / 2 - 1}px solid white`;
// newImg.style.borderLeft = '1px solid black';
// // newImg.style.margin = '0';
// newImg.style.margin = window.getComputedStyle(btn).margin; // in case it's the first button
// //
// btn.classList.add('t-btn');
// //
// btn.parentNode.insertBefore(newImg, btn);
