const {
    app,
    BrowserWindow
} = require('electron')

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1242, //1366
        height: 768, //768,
        webPreferences: {
            nodeIntegration: true,
            devTools: true
        }
    })

    // and load the index.html of the app.
    win.loadFile('index.html')


    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })


    // try moving these to another place if id doesn't work best
    // set fullscreen
    // TODO  you may get it to fullscreen after a few milliseconds
    win.setFullScreen(true);
    win.show();
    // // Open the DevTools.
    // win.webContents.openDevTools()

    //
    //win.removeMenu();

    const electron = require('electron')
    ipc = electron.ipcMain;

    var filenames = 

    labels = {
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
    }

    ipc.on('send-filenames', (event, args) => {
        event.returnValue = JSON.stringify(filenames)
        // event.sender.send('receive-filenames', JSON.stringify(filenames));
    });
    ipc.on('send-labels', (event, args) => {
        event.returnValue = JSON.stringify(labels)
        // event.sender.send('receive-filenames', JSON.stringify(labels));
    });
    settings = {
        'theme': 'classic',
        'repeat': true,
        'autoplay': true,
        'audio-aid': false,
        'active-button': {
            'id': 5,
            'sectionStart': undefined,
            'sectionEnd': undefined,
            'currentTime': 15
        },
        'sections': {
            '0': [],
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': [],
            '7': [],
            '8': [],
            '9': [],
            '10': [],
            '11': [],
            '12': [],
            '13': [],
            '14': [],
            '15': [],
            '16': [],
            '17': [],
            '18': [],
            '19': [],
            '20': [],
            '21': [],
            '22': [],
            '23': [],
            '24': [],
            '25': [],
            '26': [],
            '27': [],
            '28': [],
            '29': [],
            '30': [],
            '31': [],
            '32': [],
            '33': [],
            '34': [],
            '35': [],
            '36': [],
            '37': [],
            '38': [],
            '39': [],
            '40': [],
            '41': [],
            '42': [],
            '43': [],
            '44': [],
            '45': [],
            '46': [],
            '47': []
        }
    }
    ipc.on('send-settings', (event, args) => {
        event.returnValue = JSON.stringify(settings)
        // event.sender.send('receive-settings', JSON.stringify(settings));
    });
    defaultSettings = {

    }



    // const fs = require('fs')
    //
    // working with files from the main and renderer processes
    // console.log('PATH IS: ' + app.getPath('userData'))
    // fs.writeFile(app.getPath('userData') + '/first.json', JSON.stringify(filenames), (err) => {
    //         if (err) {
    //             console.log("An error ocurred creating the file " + err.message)
    //         }
    //
    //         console.log("The file has been succesfully saved");
    //     })
    // fs.readFile(app.getPath('userData') + '/first.json', 'utf8', (err, data) => {
    //         if (err) {
    //             console.log("An error ocurred shile reading /first.json " + err.message)
    //         }
    //
    //         console.log("The file has been succesfully read");
    //         console.log(data)
    //     })

        // dialog for opening a file
    // const { dialog } = require('electron')
    // dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)


// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})
