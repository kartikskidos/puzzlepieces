/**
 * Created by echovanec on 24. 11. 2014.
 */

var IMAGE_FOLDER = 'img/';

function loadSplash(game)
{
    game.load.text('lang_strings', 'assets/dat/m.xml');
    game.load.image('inlogic_logo', 'assets/' + IMAGE_FOLDER + 'inl.png');
    game.load.image('void', 'assets/' + IMAGE_FOLDER + 'void.png');

    //PPS_USE-REMOVE_INIT_INLLOGO
    /*
    game.load.image('game_logo', 'assets/' + IMAGE_FOLDER + 'logo.png');
    //PPS_USE-REMOVE_INIT_INLLOGO
    */

    //PPS_USE-LOGICIELEDUCATIF
    /*
    game.load.image('logoLogicieleeducatif', 'assets/' + IMAGE_FOLDER + 'logo_logicieleducatif.png');
    game.load.image('btnLogicieleeducatif', 'assets/' + IMAGE_FOLDER + 'btn_logicieleducatif.png');
    //PPS_USE-LOGICIELEDUCATIF
    */
};

function loadImages(game)
{
    game.load.atlas('pak1', 'assets/' + IMAGE_FOLDER + 'pak1.png', 'assets/' + IMAGE_FOLDER + 'pak1.json');

    game.load.xml('gamefont_TA_xml', 'assets/fnt/gamefont_TA.xml');
    //game.load.bitmapFont('gameFont', 'assets/fnt/gamefont_mahjong.png', 'assets/fnt/gamefont_mahjong.xml');
};

function loadSounds(game)
{
    //TODO: SAMSUNG DUOS to nevie nahrat... [stock browser]
    game.load.audio('hudba_loop', ['assets/audio/hudba_loop.ogg', 'assets/audio/hudba_loop.mp3']);

    game.load.audio('button',           ['assets/audio/button.ogg',         'assets/audio/button.mp3']);
    game.load.audio('casovac',          ['assets/audio/casovac.ogg',        'assets/audio/casovac.mp3']);
    game.load.audio('hudba_loop',       ['assets/audio/hudba_loop.ogg',     'assets/audio/hudba_loop.mp3']);
    game.load.audio('hviezdy',          ['assets/audio/hviezdy.ogg',        'assets/audio/hviezdy.mp3']);
    game.load.audio('explode',          ['assets/audio/explode.ogg',        'assets/audio/explode.mp3']);
    game.load.audio('booster',          ['assets/audio/booster.ogg', 'assets/audio/booster.mp3']);
    game.load.audio('booster_hammer',   ['assets/audio/booster_hammer.ogg', 'assets/audio/booster_hammer.mp3']);
    game.load.audio('karta_tah',        ['assets/audio/karta_tah.ogg', 'assets/audio/karta_tah.mp3']);
    game.load.audio('lose_result',      ['assets/audio/lose_resultogg', 'assets/audio/lose_result.mp3']);
    game.load.audio('win_result',       ['assets/audio/win_result.ogg', 'assets/audio/win_result.mp3']);
    game.load.audio('nakup',            ['assets/audio/nakup.ogg', 'assets/audio/nakup.mp3']);
};

function getPakFrames(prefix, frames)
{
    output = [];
    for(var i = 0; i < frames.length; i++)
        output[i] = prefix + frames[i] + '.png';

    return output;
};



