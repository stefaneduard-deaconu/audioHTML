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
    btn.tag = null
    btn.getTag = function() {
        return btn.tag
    }
    btn.setTag = function() {
        btn.tag = document.querySelector(`#btn-${btn.id}`)
    }
    btn.getLabel = function() {
        return btn.label
    }
    btn.getSource = function() {
        return btn.audioSource
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



// we follow a model:
// ->  we won't have two identical named files with different labels!

const AudioLibrary = (function() {
    var instance

    function createInstance() {
        const library = {}
        library.filenames = JSON.parse(ipc.sendSync('send-filenames'))
        library.labels = JSON.parse(ipc.sendSync('send-labels'))
        library.getFilenames = function() {
            return library.filenames
        }
        library.getLabels = function() {
            return library.labels
        }

        // TODO: move all of this inside the AudioLibrary :D
        function generateButtons() {
            let btns = []
            // we create teh btn's, by using the labels as the explicit ones
            //   and using undefined for the default ones
            for (let i = 0; i < library.filenames.length; i++)
                btns.push(AudioButton(library.filenames[i], library.labels[library.filenames[i]], i));
            // now we set the default labels for the remaining buttons
            btns.forEach((btn) => {
                if (btn.getLabel() == undefined) {
                    btn.setLabel(
                        toLabel(btn.audioSource)
                    )
                    library.labels[btn.filename] = btn.getLabel;
                }
            })
            return btns
        }
        library.buttons = generateButtons()
        library.getButtons = function() {
            return library.buttons
        }

        return library
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

audioLibrary = AudioLibrary.getInstance()
console.log(audioLibrary)

// var filenames = JSON.parse(ipc.sendSync('send-filenames'))
// var labels = JSON.parse(ipc.sendSync('send-labels'))



/*
        ██    ██ ██    ██ ███████      ██████  ██████       ██ ███████
        ██    ██ ██    ██ ██          ██    ██ ██   ██      ██ ██
        ██    ██ ██    ██ █████       ██    ██ ██████       ██ ███████
         ██  ██  ██    ██ ██          ██    ██ ██   ██ ██   ██      ██
          ████    ██████  ███████      ██████  ██████   █████  ███████
*/
// generate the Vue object used for generating the buttons:
let btns_data = []
for (let i = 0; i < audioLibrary.getButtons().length; i++) {
    btns_data.push({
        'id': audioLibrary.getButtons()[i].getId(),
        'label': audioLibrary.getButtons()[i].getLabel()
    })
}
var vueButtons = new Vue({
    el: '#buttons',
    data: {
        btns: btns_data
    }
})

// after generating the buttons, we can add the tag references to them:
// include the button tags for the NOW generated buttons:
audioLibrary.getButtons().forEach((each) => {
    each.setTag()
})

// setting events for the buttons:
for (button of audioLibrary.getButtons()) {
    let btn = Object.assign({}, button)
    btn.getTag().addEventListener('click', function() {
        audioPlayer.loadAudio(btn) // TODO add settings for this button!!!
        audioPlayer.play()
    })
}

/*
██████   █████   ██████  ███████     ██████  ████████ ███    ██ ███████
██   ██ ██   ██ ██       ██          ██   ██    ██    ████   ██ ██
██████  ███████ ██   ███ █████       ██████     ██    ██ ██  ██ ███████
██      ██   ██ ██    ██ ██          ██   ██    ██    ██  ██ ██      ██  ██
██      ██   ██  ██████  ███████     ██████     ██    ██   ████ ███████   █
                                                                         █
*/
/*
███████ ███████ ████████ ████████ ██ ███    ██  ██████  ███████
██      ██         ██       ██    ██ ████   ██ ██       ██
███████ █████      ██       ██    ██ ██ ██  ██ ██   ███ ███████
     ██ ██         ██       ██    ██ ██  ██ ██ ██    ██      ██
███████ ███████    ██       ██    ██ ██   ████  ██████  ███████
*/



console.log(settingsObject)

function generateControls() {
    let docsButton = document.createElement('button')
    docsButton.innerHTML = '<div>Docs</div>'
    docsButton.id = 'docs-button'
    docsButton.onclick = function() {
        if (docs.getShown() == false) {
            docs.show()
        } else {
            docs.hide()
        }
    }

    let settingsButton = document.createElement('button')
    settingsButton.innerHTML = '<div>Settings</div>'
    settingsButton.id = 'settings-button'
    settingsButton.onclick = function() {
        // if (settings.getShown() == false) {
        //     settings.show()
        // } else {
        //     settings.hide()
        // }
    }

    document.body.appendChild(docsButton)
    document.body.appendChild(settingsButton)
    let buttonsStylesheet = document.createElement('link')
    buttonsStylesheet.rel = "stylesheet"
    buttonsStylesheet.type = "text/css"
    buttonsStylesheet.href = "./styles/buttons.css"
    document.head.appendChild(buttonsStylesheet)
}
generateControls()

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
        // TODO  model: the rule is that each audioLIbrary.filenames has associated images,
        // named by uding the filename and numbered 0, ...
        function generatePresentations() {
            const base_dir = './images/'
            presentations = []
            for (fn of audioLibrary.getFilenames()) {
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
                }
                presentations.push(images)
            }
            return presentations
        }
        gallery.presentations = generatePresentations()
        gallery.getPresentations = function() {
            return gallery.presentations
        }
        gallery.setImage = function(filename) {
            gallery.img.style.minWidth = gallery.img.style.minHeight = ''
            gallery.img.style.position = ''
            gallery.img.style.top = gallery.img.style.left = ''
            let timer = 0
            let interval = setInterval(function() {
                timer += 16
                gallery.img.style.top = `${1.618 * (timer / 618) * 100}%`
            }, 16);
            setTimeout(function() {
                gallery.img.src = `images/${filename}`
                gallery.img.style.top = `${-1.618 * (timer / 618) * 100}%`
                window.clearInterval(interval)
                interval = setInterval(function() {
                    timer -= 16
                    gallery.img.style.top = `${-1.618 * (timer / 618) * 100}%`
                }, 16);
            }, 618)
            setTimeout(function() {
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

imagesGallery = ImagesGallery.getInstance()
// setTimeout(function() {
//     imagesGallery.setImage("_grey.jpg")
// }, 1000)
//
//
// console.log(ImagesGallery.getInstance())





/*
         █████        ██████  ██       █████  ██    ██ ███████ ██████
        ██   ██       ██   ██ ██      ██   ██  ██  ██  ██      ██   ██
        ███████ █████ ██████  ██      ███████   ████   █████   ██████
        ██   ██       ██      ██      ██   ██    ██    ██      ██   ██
        ██   ██       ██      ███████ ██   ██    ██    ███████ ██   ██
*/

window.addEventListener('load', function() {
    setTimeout(function() {
        // document.getElementById('audio-player').classList.add('active')
    }, 618);

})

const AudioPlayer = (function() {
    var instance
    const firstInstance = function() {
        const instance = {}
        instance.audio = document.querySelector('audio')
        instance.isActive = false
        instance.sections = null
        instance.currPresentation = null
        instance.currImageId = null
        instance.loadAudio = function(button) {
            console.log(button)
            // we clean from the last "loading":
            instance.currPresentation = null // unnecessary !!!
            // this should partition the audio, and save info about this,
            // then load the audio and ready it for playing (if autoplaying, just play)
            instance.audio.src = `./audios/${button.getSource()}.mp3`
            instance.audio.load()
            var audioScroll = document.getElementById('audio-scroll')
            audioScroll.style.width = '4px'
            // also set the image for the gallery:
            // we find the required image (find sections, then choose the right one:)
            console.log(button.getId())
            console.log(imagesGallery.getPresentations()[0]);
            instance.currPresentation = imagesGallery.getPresentations()[button.getId()]
            imagesGallery.setImage(instance.currPresentation[0]) // at least one image per presentation
            instance.currImageId = 0
        }
        instance.setSection = function(start, end) {
            // TODO
        }
        instance.derulateLeft = function(time = 1) {
            if (instance.audio.currentTime >= time) {
                instance.audio.currentTime -= time
            } else {
                // nothing, or show something red TODO TODO TODO
            }
        }
        instance.derulateRight = function(time = 1) {
            if (instance.audio.currentTime <= instance.audio.duration - time) {
                instance.audio.currentTime += time
            } else {
                // nothing, because it will just end very fast
                // TODO  make it end right in this second :D
            }
        }
        instance.volumeUp = function(percent) {
            if (instance.audio.volume + percent <= 1) {
                instance.audio.volume += percent
            } else {
                instance.audio.volume = 1
            }
            document.getElementById('volume-bar').style.height = `calc(${instance.audio.volume} * 24px)`
        }
        instance.volumeDown = function(percent) {
            if (instance.audio.volume - percent >= 0) {
                instance.audio.volume -= percent
            } else {
                instance.audio.volume = 0
            }
            document.getElementById('volume-bar').style.height = `calc(${instance.audio.volume} * 24px)`
        }
        instance.presentationInterval = null
        instance.play = function() {
            instance.presentationInterval = window.setInterval(
                function() {
                    let sectionDuration = instance.audio.duration / instance.currPresentation.length
                    let imageId = Math.floor(instance.audio.currentTime / sectionDuration)
                    console.log(imageId)
                    console.log(instance.currImageId)
                    if (imageId != instance.currImageId) {
                        imagesGallery.setImage(instance.currPresentation[imageId])
                        instance.currImageId = imageId
                    }
                }, 1000)
            instance.audio.play()
            // because nothing will happend before 2 seconds have passed
            var audioScroll = document.getElementById('audio-scroll')
            window.setTimeout(
                () => {
                    instance.sections = Math.ceil(instance.audio.duration)
                    let section = Math.ceil(instance.audio.currentTime)
                    audioScroll.style.width = `calc(${section / instance.sections} * 100%)`
                    console.log("NOW")
                    instance.interval = window.setInterval(
                        () => {
                            let section = Math.ceil(instance.audio.currentTime)
                            audioScroll.style.width = `calc(${section / instance.sections} * calc(100% - 30px))`
                            console.log("NOW")
                        }, 1000)
                }, 1000)

            // document.querySelector('audio').play()
            document.querySelector('#audio-player').classList.add('active')
            instance.isActive = true
        }
        instance.stop = function() {
            window.clearInterval(instance.presentationInterval)
            instance.audio.pause()
            window.clearInterval(instance.interval)
            document.querySelector('#audio-player').classList.remove('active')
            instance.isActive = false
            // set the currentTime according to the 3-seconds stuff
        }
        return instance
    }
    return {
        getInstance: function() {
            if (!instance) {
                instance = firstInstance()
            }
            return instance
        }
    }
})()

var audioPlayer = AudioPlayer.getInstance()
// setTimeout(() => {
//     audioPlayer.loadAudio(audioLibrary.getButtons()[0])
//     audioPlayer.play()
// }, 3000)
// setTimeout(() => {
//     audioPlayer.stop()
// }, 15000)

// events (play button), and key event (space, left, right):

/*
 █████  ██    ██     ███████ ██    ██ ███████ ███    ██ ████████ ███████
██   ██ ██    ██     ██      ██    ██ ██      ████   ██    ██    ██
███████ ██    ██     █████   ██    ██ █████   ██ ██  ██    ██    ███████
██   ██ ██    ██     ██       ██  ██  ██      ██  ██ ██    ██         ██
██   ██  ██████      ███████   ████   ███████ ██   ████    ██    ███████
*/

// play-button event:
document.getElementById('play-button').addEventListener('click', function(event) {
    if (audioPlayer.isActive) {
        audioPlayer.stop()
    } else {
        audioPlayer.play()
    }
})

// the main event that tests every single combination of key presses we model
//  our application around
var isKeydown = false
var keydownTimer = 0
document.addEventListener('keyup', (event) => {
    isKeydown = false
    keydownTimer = 0
})
document.addEventListener('keydown', (event) => {
    isKeydown = true
    keydownTimer += 1
    if (event.altKey || event.ctrlKey || event.shiftKey) {
        // we control the pressing of the AudioButtons
    } else {
        console.log('-' + event.key + '-')
        // we control the usage of the Audio
        switch (event.key) {
            case ' ':
                event.preventDefault() // for not pressing the same button again and again
                console.log('HERE')
                if (audioPlayer.isActive == true)
                    audioPlayer.stop()
                else {
                    audioPlayer.play()
                }
                break
            case 'ArrowLeft':
                // TODO: everytime the times hits a section, we play normally for a bit
                if (audioPlayer.isActive == true) {
                    time = 0.1
                    if (keydownTimer > 30)
                        time = 0.3
                    audioPlayer.derulateLeft(time)
                }
                break
            case 'ArrowUp':
                // if (audioPlayer.isActive == true) {
                    percent = 0.01
                    if (keydownTimer > 25)
                        percent = 0.05
                    audioPlayer.volumeUp(percent)
                // }
                break
            case 'ArrowDown':
                // if (audioPlayer.isActive == true) {
                    percent = 0.01
                    if (keydownTimer > 25)
                        percent = 0.05
                    audioPlayer.volumeDown(percent)
                // }
                break
            case 'ArrowRight':
                if (audioPlayer.isActive == true) {
                    time = 0.1
                    if (keydownTimer > 30)
                        time = 0.3
                    audioPlayer.derulateRight(time)
                }
                break
            default:
                break

        }
        // TODO  we can't control the section part of the audio-player
    }
})


document.querySelector('#audio-player #section-start')
    .addEventListener('drag',
        (event) => {

        })
document.querySelector('#audio-player #section-start')
    .addEventListener('dragend',
        (event) => {

        })

/*
██████   ██████   ██████ ███████
██   ██ ██    ██ ██      ██
██   ██ ██    ██ ██      ███████
██   ██ ██    ██ ██           ██
██████   ██████   ██████ ███████
*/

const Docs = (function() {
    var instance

    function createInstance() {
        const docs = {}
        docs.docsBoard = document.createElement('div')
        docs.docsBoard.id = 'docs-board'
        docs.isShown = false
        docs.getShown = function() {
            return docs.isShown
        }
        docs.show = function() {
            docs.isShown = true
            let dash = docs.docsBoard
            dash.style.left = '-100%'
            document.body.appendChild(docs.docsBoard)
            // include the html from a GET request:
            dash.innerHTML = '<iframe src="./docs/index.html" style="width:calc(100% - 4px); height: 100%"></iframe>'
            // TODO  simply importing from HTML request, not using iframe
            // dash.setAttribute('w3-include-html', './docs/docs.html');
            // file = dash.getAttribute('w3-include-html')
            // if (file) { // TODO  redundancy here, because the code must be restructured
            //     /* Make an HTTP request using the attribute value as the file name: */
            //     xhttp = new XMLHttpRequest();
            //     xhttp.onreadystatechange = function() {
            //         if (this.readyState == 4) {
            //             if (this.status == 200) {
            //                 // dash.innerHTML = this.responseText;
            //             }
            //             if (this.status == 404) {
            //                 // dash.innerHTML = "Page not found.";
            //             }
            //             /* Remove the attribute: */
            //             // dash.removeAttribute("w3-include-html");
            //         }
            //     }
            //     xhttp.open("GET", file, true);
            //     xhttp.send();
            //     /* Exit the function: */
            //     return;
            // }
            // now we decrease the size of the app page:
            let page = document.body
            let outerTimer = 0
            let decrease = function() {
                outerTimer += 16
                // document.body.style.width = '90%'
                page.style.boxShadow = '-3px 0px 7px 0px black' // TODO  styling
                page.style.marginLeft = `calc(5% + ${outerTimer / 382 * 2.5}%)`
                page.style.marginTop = `calc(5% + ${outerTimer / 382 * 2.5}%)`
                page.style.width = `calc(90% - ${outerTimer / 382 * 5}%)`
                page.style.height = `calc(90% - ${outerTimer / 382 * 5}%)`
            }
            var interval = window.setInterval(decrease, 8)
            setTimeout(function() {
                // close the previous interval:
                window.clearInterval(interval)
                // animate the entering of the docsBoard
                let timer = 0
                var docsInterval = window.setInterval(function() {
                    timer += 16
                    dash.style.left = `-${100 - (timer / 618) * 100}%`
                }, 16)
                window.setTimeout(function() {
                    dash.style.left = '0px'
                    window.clearInterval(docsInterval)
                }, 618)
            }, 382)
        }
        docs.hide = function() {
            let dash = docs.docsBoard
            let timer = 0
            let interval = window.setInterval(function() {
                timer += 16
                dash.style.left = `-${100 - (1 - timer / 618) * 100}%`
            }, 16)
            setTimeout(function() {
                window.clearInterval(interval)
                dash.style.left = '-100%'
                document.body.removeChild(docs.docsBoard)
            }, 618)
            // now we increase the size of the app window:
            var page = document.body
            let outerTimer = 0
            let increase = function() {
                outerTimer += 16
                // boxShadow?
                page.style.marginLeft = `calc(7.5% - ${outerTimer / 382 * 2.5}%)`
                page.style.marginTop = `calc(7.5% - ${outerTimer / 382 * 2.5}%)`
                page.style.width = `calc(85% + ${outerTimer / 382 * 5}%)`
                page.style.height = `calc(85% + ${outerTimer / 382 * 5}%)`
            }
            window.setTimeout(function() {
                // for reincreasing the app page
                let interval = window.setInterval(increase, 8)
                window.setTimeout(function() {
                    // close the previous intervals:
                    window.clearInterval(interval)
                    // and get the window to the default (CSS) size
                    page.style.boxShadow = ''
                    page.style.width = ''
                    page.style.height = ''
                    page.style.marginLeft = ''
                    page.style.marginTop = ''
                }, 382)
            }, 618)
            docs.isShown = false
        }
        return docs
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

var docs = Docs.getInstance()
// window.setTimeout(docs.show, 1000)
// window.setTimeout(docs.hide, 5000)

/*
 * after generating the buttons, we choose the first one to be loaded
 *   as default,
 */

// TODO  reenter the default button:
// // (*1) this should correspond with the focused element :)
// // TODO  create a variable for the current playing file. create the events and matching classes necessary to add interactivity
// var startup_audio = 'bathroom'; // this is the choice
// var startup_label = new Vue({
//     el: '#audio_label',
//     data: {
//         label: labels[startup_audio]
//     }
// });
//
//
//
// /*
//  * and now we add functionality to the buttons :)
//  */
// var audioTag = document.querySelector('audio');
// var audioLabel = document.getElementById('audio_label');
//
// function loadAudio(index, autoplay = true) {
//     // (!) this section must be modified if you upload multiple audio formats (such as .mp3, .mp3, .ogg)
//     audioTag.children[0].src = './audios/' + filenames[index] + '.mp3';
//     audioTag.load();
//     audioLabel.innerHTML = labels[filenames[index]];
//     // here we make other stuff, like focusing on the audio and loading the corresponding image
//     const image = document.getElementsByTagName('img')[0];
//     image.src = `./images/${filenames[index]}.jpg`;
//     audioTag.click();
//     setTimeout(function() {
//         audioTag.focus();
//         if (autoplay)
//             audioTag.play();
//     }, 382);
// }
// //
// buttons = document.getElementsByTagName('button');
// for (let i = 0; i < buttons.length; i++) {
//     buttons[i].setAttribute('onclick', `loadAudio(${i})`);
// }
//
// window.addEventListener('load', function() {
//     // final script, they might just be about styling :D
//     function postScriptum(buttonsToScroll) {
//         var btnGroup = document.getElementsByClassName('btn-group')[0];
//         // TODO: here we can do a function to find a certain element on which to fucus (*1)
//         btnGroup.scrollBy(0, 42 + buttonsToScroll * 36);
//     }
//     // TODO  next one:
//     //postScriptum(filenames.indexOf(startup_audio)); // we get into sight, and highlight (TODO), the fourth element
//     // load the startup audio:
//     loadAudio(0, false);
//
//     setTimeout(function() {
//             document.getElementsByTagName('audio')[0].focus();
//         },
//         382
//     );
//
//     // TODO  ???? what about this?
//     //document.getElementsByTagName('audio')[0].autoplay = true;
// });
//
//
//
//
//
// /*
// // autoplay audiofile after audiofile
// document.getElementsByTagName('audio')[0].onended = function() {
//
// 	// very in work
// 	alert('loading the next section in 5 seconds');
// 	setTimeout(function(){
//
// loadAudio(3)}, 5000); // TODO  replace this with the next item, if there is one
// } */





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
