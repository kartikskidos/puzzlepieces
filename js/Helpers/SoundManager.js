
SoundManager = function(game)
{
    this.game = game;
    try{
        this.soundPlaying = true;
        this.musicPlaying = true;

        if(localStorage.getItem(GameData.ProfileName + '-sounds'))
            this.soundPlaying = JSON.parse(localStorage.getItem(GameData.ProfileName + '-sounds')) === true;
        if(localStorage.getItem(GameData.ProfileName + '-music'))
            this.musicPlaying = JSON.parse(localStorage.getItem(GameData.ProfileName + '-music')) === true;
    }catch(e){
        this.soundPlaying = true;
        this.musicPlaying = true;
    }

    if(GameData.BuildDebug){
        this.musicPlaying = false;
        this.soundPlaying = false;
    }

    this.music = [];
    this.sounds = [];
    this.actualMusic = null;
    this.prevSoundPlayed = null;
}

SoundManager.prototype = {
    constructor: SoundManager,

    create: function ()
    {

        this.addMusic('hudba_loop', 0.4, true);

        this.addSound('button', 0.4);
        this.addSound('casovac', 0.3, true);
        this.addSound('hviezdy', 0.6);
        this.addSound('explode', 0.6);
        this.addSound('booster', 0.6);
        this.addSound('booster_hammer', 0.6);
        this.addSound('karta_tah', 0.4);
        this.addSound('lose_result', 0.4);
        this.addSound('win_result', 0.4);
        this.addSound('nakup', 0.4);
    },

    addMusic: function(audioFile, volume, loop)
    {
        if ( loop === undefined )
            loop = false;

        this.music[audioFile] = game.add.audio(audioFile, volume, loop);
        this.music[audioFile].VOL = volume;
    },

    addSound: function(audioFile, volume, loop)
    {
        if ( loop === undefined )
            loop = false;

        this.sounds[audioFile] = game.add.audio(audioFile, volume, loop);
        this.sounds[audioFile].VOL = volume;
    },

    playMusic: function (musicToPlay, reset)
    {
        if ( reset === undefined )
            reset = false;


        if (musicToPlay != this.actualMusic || reset)
            this.actualMusic = musicToPlay;

        if (!this.musicPlaying)
            return;

        for (var key in this.music){
            if(key == 'contains')
                continue;
            if (key == this.actualMusic) {
                if (!this.music[key].isPlaying || reset)
                    this.music[key].play();
            }else
                this.music[key].stop();
        }
    },

    playSound: function (soundToPlay, volume)
    {
        if(!this.soundPlaying)
            return;

        if(volume === undefined)
            volume = this.sounds[soundToPlay].VOL;
        try{
            this.sounds[soundToPlay].volume = volume;
            this.sounds[soundToPlay].play()
        }catch(e){
            LOG('Failed to play sound : ' + soundToPlay);
        }
    },

    pauseMusic: function()
    {
        if (!this.musicPlaying)
            return;

        for (var key in this.music){
            if(key == 'contains')
                continue;
            if (key == this.actualMusic)
                this.music[key].pause();
        }
    },

    resumeMusic: function()
    {
        if (!this.musicPlaying)
            return;

        for (var key in this.music){
            if(key == 'contains')
                continue;
            if (key == this.actualMusic)
                this.music[key].resume();
        }
    },

    stopMusic: function ()
    {
        for (var key in this.music){
            if(key == 'contains')
                continue;

            this.music[key].stop();
        }
    },

    toggleMusic: function(musicToPlay)
    {
        if (!this.musicPlaying){
            this.musicPlaying = true;
            this.playMusic(musicToPlay);
        } else {
            this.musicPlaying = false;
            this.stopMusic();
        }
        try{
            localStorage.setItem(GameData.ProfileName + '-music', this.musicPlaying);
        }catch(e){

        }
    },

    toggleSounds: function()
    {
        if (!this.soundPlaying)
            this.soundPlaying = true;
        else{
            this.soundPlaying = false;

            for (var key in this.sounds){
                if(key == 'contains')
                    continue;

                this.sounds[key].stop();
            }
        }
        try{
            localStorage.setItem(GameData.ProfileName + '-sounds', this.soundPlaying);
        }catch(e){

        }
    }


}