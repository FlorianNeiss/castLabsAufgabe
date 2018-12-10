//Start reading here

var sampleFile = "https://demo.castlabs.com/tmp/text0.mp4";
// creating the FileReader
let fr = new FileReader();
//Main method
fr.onloadend = function (event) {
    console.log("Successfully loaded file", sampleFile);
    var raw = event.target.result;

    // Check if isTypedArray
    if (!isTypedArray(raw)) {
        return;
    }
    //now I can cast
    let uint8Array = new Uint8Array(raw);
    //check if cast is successfull
    if (!isTypedArray(uint8Array)) {
        return
    }
    // TO-DO find way to create and split array here
    const hex = convertToHex(raw, uint8Array);
    //Find the boxes and print the console logs
    findBox(hex);
};


fr.onerror = function (event) {
    console.log("Erorr did not load file");
    fr.abort();
};

// methods

// 1st method to be called
// Checks if obj is a typedArray
function isTypedArray(obj) {
    return !!obj && obj.byteLength !== undefined;
}
// 2nd method to be called
//Converts the uint8Array to a hex string
function convertToHex(raw, uint8Array) {
    var hex = "";
    for (var cycle2 = 0; cycle2 < raw.byteLength; cycle2++) {
        hex += uint8Array[cycle2].toString(16) + " ";
    }
    return hex;
}
// 3rd method to be called
// Uses the hex string to find the boxes 
// Calls the methods findName() findSize() log() and extractImages()
function findBox(hex) {
    // TO-DO find better way just to log once
    for (let i = 0; i < hex.length; i++) {
        const name = findBoxName(hex, i + 4);
        const size = findSize(hex, i);
        if (name === 'moof') {
            i = 7;
            logBoxMessage(name, size);
            continue;
        }
        if (name === 'traf') {
            i = 31;
            logBoxMessage(name, size);
            continue;
        }
        if (name === 'mdat') {
            logBoxMessage(name, size);
            //Build array then cut to boxsize of mdat without name mdat
            extractImages(hex.split(" ").splice(i + 8), name);
            return;
        }
        logBoxMessage(name, size);
        i += size - 1;
    }
}
// 4th method to be called
// find the the name of the box
// hex is the hexString and position is the place to search for the name
// calls hex2a()
// hex is a hex string that gets split and spliced by the parameter position
// position is the position in which the array gets cut
function findBoxName(hex, position) {
    const hexArrayForName = hex.split(" ").splice(position, 4);
    let name = "";
    for (let index = 0; index < hexArrayForName.length; index++) {
        name += hex2a(hexArrayForName[index]);
    }
    return name;
}
// 5th method to be called
// Converts hex string to ascii
function hex2a(hex) {
    var hex = hex.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}
// 6th method to be called
// find the the size of the box
// hex is the hexString and position is the place to search for the name
// calls hexToDec()
// hex is a hex string that gets split and spliced by the parameter position
// position is the position in which the array gets cut
function findSize(hex, position) {
    //First 4 elements to get the size
    const hexArrayForSize = hex.split(" ").splice(position, 4);
    let size = 0;
    for (let index = 0; index < hexArrayForSize.length; index++) {
        size += hexArrayForSize[index];
    }
    return hexToDec(size);
}
// 7th method to be called
// Converts hex string to decimal
// hex is a hex string that gets converted to decimal
function hexToDec(hex) {
    var result = 0, digitValue;
    hex = hex.toLowerCase();
    for (var i = 0; i < hex.length; i++) {
        digitValue = '0123456789abcdefgh'.indexOf(hex[i]);
        result = result * 16 + digitValue;
    }
    return result;
}
// 8th method to be called
// logs the message of a found box with name and size
// name is the boxName and boxSize is the boxsize
function logBoxMessage(boxName, boxSize) {
    console.log(`Found box of tpye ${boxName} and size ${boxSize}`);
}
// 9th method to be called
// hex is the hex string from the file and boxName is the name of the bix for the log message
// builds base64 string and adds it to the html body
// calls hexToBase64(), atou() and addHtmlImages()
// hex is the hex string but as an array and is already cut to the perfect length
function extractImages(hex, boxName) {
    // Build big string and call hexToBase64() 
    let base64ImageString = hexToBase64(hex.toString());
    //Decode the base64 string
    let atouString = atou(base64ImageString);
    //log big message be careful
    console.log(`Content of box ${boxName} is: ${atouString}`);
    // add atouString to html body
    addHtmlImages(atouString);
}
// 10th method to be called
// Converts a hexstring to a base64 string
function hexToBase64(hexstring) {
    return btoa(hexstring.match(/\w{2}/g).map(function (a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
}
// 11th method to be called
// base64 encoded ascii to ucs-2 string
// str is a str which needs to be decoded
function atou(str) {
    return decodeURIComponent(escape(window.atob(str)));
}
// 12th method to be called
// adds the atouString to the html body
// atouString is the base64 decoded string for the html file
function addHtmlImages(atouString){
    let div = document.createElement('div');
    div.innerHTML = atouString;
    document.body.appendChild(div);
}
// Never called just in case 
// ucs-2 string to base64 encoded ascii
// function utoa(str) {
//     return window.btoa(unescape(encodeURIComponent(str)));
// }










// Bonus 1 MaxLimit Of Integer // Connection Stops Breaks
// Bonus 2 See Source Code of renderd HTML file
