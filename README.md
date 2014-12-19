impactjs-minimap
================

This is a minimap plugin for [ImpactJS](http://www.impactjs.com/).

![Overview: Minimap](https://github.com/dryas/impactjs-minimap/blob/master/doc/img/overview.png)

Features
--------

 * Generate minimap on the fly, no "pre-rendered" images needed
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

Support impactjs-minimap development
------------------------------------

[![Donate to author](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=6UEHKJ5C3T8BC)

Contribute
--------

You're welcome to contribute to this plugin by creating a pull requests or feature request in the issues section.

License
--------

This bundle is available under the [MIT license](https://github.com/dryas/impactjs-minimap/blob/master/LICENSE).
