impactjs-minimap
================

This is a minimap plugin for [ImpactJS](http://www.impactjs.com/).

![Overview: Minimap](https://github.com/dryas/impactjs-minimap/blob/master/doc/img/overview.png)

Features
--------

 * Generate multiple(!) minimaps in different sized (e.g. minimap vs. commander map) on the fly, no "pre-rendered" images needed
 * Choose which layers of the map should be displayed on the minimap
 * Display entities and their movement by entity type on the map
 * Choose if you want the entities displayed as a rectancle or as an image
 * Change color, size, offset of entity indicators
 * Show viewport of the user on the minimap

Installation
------------

  * To use the minimap plugin simply copy the "minimap.js" file in your plugins folder of your ImpactJS installation.
  * Register the plugin in your main.js:
```
.requires(
	'plugins.minimap'
)
```
  * Call the "generateMiniMap" function to initialise the minimap in your main.js AFTER(!) the loadLevel call:
```
MyGame = ig.Game.extend({
    init: function() {
    this.loadLevel(LevelTest);
    this.generateMiniMap("minimap", 150, 150, [0,1]);
});
```
  * Add the minimap draw calls to your main.js:
```
draw: function() {
    this.parent();
    this.drawMiniMap("minimap", (ig.system.width - 150 - 8), 8, ["EntityPlayer"], true);
```
  * If you want to display entities on the map add the minimap configuration to the entity file (e.g. /entities/player.js):
```
EntityPlayer = EntityClient.extend({
    miniMap: { mapColor: '#0000FF', mapSize: 4 },
    ...
});
```

Configuration
------------

There are two functions you need to call:

### generateMiniMap():

This function needs to be called in your "init" function. It will generate the minimap graphic from the big playable map and cache it for later usage. You can add the following parameters:

| Parameter        | Description  |
| ---------------- | ------------ |
| name             | This parameter defines the name of the minimap. All the time later when you want to draw the map you need to use it as a reference |
| width            | Width of the minimap |
| height           | Height of the minimap |
| layer            | An array of layers (of the map) you want to display on the minimap. |

### drawMiniMap();

This function needs to be called in your "draw" function. It will display the minimap in your canvas:

| Parameter        | Description  |
| ---------------- | ------------ |
| name             | The map you want to display (as you have defined in the generateMiniMap() function |
| posx             | Position X where you want to display the minimap |
| posy             | Position Y where you want to display the minimap |
| entities         | An array of entities you want to display on the map (entitytype) |
| showviewport     | [true/false] Should the viewport be displayed on the minimap? |
| viewportcolor    | Define the color of the displayed viewport |

### Entity configuration

```
EntityPlayer = EntityClient.extend({
    miniMap: { mapColor: '#0000FF', mapSize: 4, icon: 'media/playericon.png', iconOffset: {x: 0, y: 0} },
    ...
});
```

If you want to display the entities and their positions on the minimap, you need to add a configuration parameter "miniMap" to the entity. You can use the following paramters:

| Parameter        | Description  |
| ---------------- | ------------ |
| mapColor         | The color of the entity on the minimap |
| mapSize          | The size of the entity on the minimap |
| icon             | If you want to display a graphic instead of the colored rectange, you can define it here |
| iconOffset       | If the icon should be displayed with an offset, it can be defined here |

![Icon](https://github.com/dryas/impactjs-minimap/blob/master/doc/img/icon.png)

Support impactjs-minimap development
------------------------------------

[![Donate to author](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=6UEHKJ5C3T8BC)

Contribute
--------

You're welcome to contribute to this plugin by creating a pull requests or feature request in the issues section.

License
--------

This bundle is available under the [MIT license](https://github.com/dryas/impactjs-minimap/blob/master/LICENSE).
