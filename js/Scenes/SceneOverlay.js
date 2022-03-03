var SceneOverlay = function()
{
    SceneOverlay.instance = this;

    this.create();
};

SceneOverlay.instance = null;

SceneOverlay.prototype = {

    create: function ()
    {
        grpSceneOverlay = game.add.group(); grpSceneOverlay.name = 'grpSceneOverlay';

        imgOverlay = grpSceneOverlay.create(game.width >> 1, game.height >> 1, 'pak1', 'blank.png');
        imgOverlay.anchor.set(0.5);
        imgOverlay.width = game.width;
        imgOverlay.height = game.height;
        imgOverlay.alpha = 0.6;
        imgOverlay.tint = 0x000000;
        AddButtonEvents(imgOverlay, SceneOverlay.instance.__OnPressedOverlay, function(){}, function(){});

        grpSceneOverlay.visible = false;
    },

    onResolutionChange: function()
    {
        imgOverlay.reset(game.width >> 1, game.height >> 1);
        imgOverlay.width = game.width;
        imgOverlay.height = game.height;
        imgOverlay.tint = 0x000000;
    },

    __OnPressedOverlay: function()
    {
        imgOverlay.tint = 0x000000;
        scenes.forEach(function(scene) {
            if(typeof scene.OnPressedOverlay === 'function')
                scene.OnPressedOverlay();
        });
    },

    ShowAnimated: function()
    {
        imgOverlay.tint = 0x000000;
        SceneOverlay.instance.onResolutionChange();
        ScenesTransitions.showSceneAlpha(grpSceneOverlay, 0, ScenesTransitions.TRANSITION_LENGTH);
    },

    HideAnimated: function()
    {
        ScenesTransitions.hideSceneAlpha(grpSceneOverlay, 0, ScenesTransitions.TRANSITION_LENGTH);
    }
}