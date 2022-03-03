var SceneGems = function()
{
    SceneGems.instance = this;

    this.create();
};

SceneGems.instance = null;

SceneGems.prototype = {

    create: function()
    {

        grpSceneGems = game.add.group();

        imgGemsBG = grpSceneGems.create(0, 0, 'pak1', 'diamond_bg.png');
        imgGemsBG.anchor.set(0.5);

        txtGemsVal = new Phaser.Text(game, 0, 3, '75', {fill:'#FFFFFF', font: '30px ' + GAME_FONT, align: 'center'});
        setCorrectAnchor(txtGemsVal, 0.5);
        imgGemsBG.addChild(txtGemsVal);

        imgGemsIcn = grpSceneGems.create(-55, -2, 'pak1', 'icons_11.png');
        imgGemsIcn.anchor.set(0.5);
        imgGemsBG.addChild(imgGemsIcn);

        //grpSceneGems.visible = false;

        SceneGems.instance.updatePlayerGems();
        SceneGems.instance.onResolutionChange();
    },

    incPlayerGems: function(inc)
    {
        soundManager.playSound('nakup');
        PlayerGems += inc;
        GameData.Save();
        SceneGems.instance.updatePlayerGems();
        SetPoingScaleTween(imgGemsBG, 100, 0, null, Phaser.Easing.Back.Out);
    },

    updatePlayerGems: function()
    {
        txtGemsVal.text = '' + PlayerGems;
    },

    update: function()
    {
    },

    onResolutionChange: function()
    {
        imgGemsBG.position.setTo(game.width >> 1, game.height - 30);
    }
}


