var oldConsoleLog = console.log;
console.log = function (message) {
    oldConsoleLog.apply(console, arguments);

    updtTxt(arguments);
};

var consoleTxtObject = null;
var textLists = [];

function updtTxt (arguments) {
    if (game == null) return;

    var txt = arguments[0];
    for (var i = 1; i < arguments.length; i++){
        txt += " ";
        txt += arguments[i];
    }
    textLists.push(txt);

    if (consoleTxtObject != null && !consoleTxtObject.alive){
        consoleTxtObject.destroy();
        consoleTxtObject = null;
    }

    if (consoleTxtObject == null) {
        consoleTxtObject = game.add.text(5, 20, "", {fill: '#00ff00'});
        consoleTxtObject.fontSize = 12;
        consoleTxtObject.lineSpacing = -5;
    }

    var strToWrite = "";
    var maxLines = 30;
    var i = textLists.length > maxLines ? textLists.length - maxLines : 0;
    for (i; i < textLists.length; i++){
        strToWrite += textLists[i];
        strToWrite += '\n';
    }
    consoleTxtObject.setText(strToWrite);

    game.world.bringToTop(consoleTxtObject);
}