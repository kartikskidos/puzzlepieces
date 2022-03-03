var ORIENTATION_PORTRAIT     = 0;
var ORIENTATION_LANDSCAPE    = 1;
var GAME_CURRENT_ORIENTATION = ORIENTATION_PORTRAIT;

var game_resolution = {
    x: 480,
    yMin: 680,
    yMax: 1300
};

function getMaxGameResolution() {
    return [game_resolution['x'], game_resolution['yMax']];
}
