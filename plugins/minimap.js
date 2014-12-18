/*
 * minimap
 * https://github.com/dryas/impactjs-minimap
 *
 * v1.0.0
 *
 * A plugin for the ImpactJS engine to display minimaps and a radar for entities.
 *
 * Benjamin Kaiser
 * me@benjaminkaiser.biz
 * http://www.benjaminkaiser.biz
 *
 * This work is licensed under the MIT License (MIT). To view a copy of this license, visit https://github.com/dryas/impactjs-minimap/blob/master/LICENSE.
 *
 * It would be very nice when you inform me, with an short email, when you are using this plugin in a project. Thanks.
 */

ig.module(
	'plugins.minimap'
)
.requires(
	'impact.game'
)
.defines(function() {
	ig.Game.inject({

	// Cache for the map canvases:
	maps: [],

	/*
	 * drawMiniMap(name, posx, posy, entities = [])
	 *
	 * Draws a map on the screen.
	 *
	 * Parameters:
	 *      name      = Name of the map to display (same as
	 *                  used on generateMiniMap())
	 *      posx      = Position (X) where the map should be displayed
	 *      posy      = Position (Y) where the map should be displayed
	 *      entities  = Array of entities which position should be 
	 *                  displayed on the map
	 */
	drawMiniMap: function(name, posx, posy, entities)
	{
		// Needed parameters:
		if (typeof name === 'undefined')
			throw "minimap plugin [drawMiniMap()]: no name parameter set";

		// Optional parameters "posx" and "posy". Set to ("posx", "posy") 0 by default:
		posx = typeof posx !== 'undefined' ? posx : 0;
		posy = typeof posy !== 'undefined' ? posy : 0;

		// Get scaling factor:
		var s = ig.system.scale;

		// Get canvas and 2d context:
		var ctx = ig.system.context;

		// Save current state of the canvas:
		ctx.save();

		// Draw minimap background:
		ctx.drawImage(this.maps[name], posx, posy);

		// Draw entities position on the minimap:
		if (typeof entities !== 'undefined')
		{
			for(var entityid = 0; entityid < entities.length; entityid++)
			{
				var entity = this.getEntitiesByType(entities[entityid]);

				for (i=0; i < entity.length; i++) 
				{
					x = (entity[i].pos.x * s / (ig.game.collisionMap.tilesize / 2)) + posx + (this.maps[name + '_offsetx'] * s);
					y = (entity[i].pos.y * s / (ig.game.collisionMap.tilesize / 2)) + posy + (this.maps[name + '_offsety'] * s);

					// Draw entity as dot on the map:
					if (entity[i].minimap['mapsize'] === 'undefined')
						entity[i].minimap['mapsize'] = 5;
					if (entity[i].minimap['mapcolor'] === 'undefined')
						entity[i].minimap['mapcolor'] = '#FFFFFF';

					ctx.fillStyle = entity[i].minimap['mapcolor'];
					ctx.fillRect(x, y, entity[i].minimap['mapsize'], entity[i].minimap['mapsize']);
				}
			}
		}

		// Restore former state of the canvas:
		ctx.restore();
	},

	/*
	 * generateMiniMap(name, width, height, layer = [0])
	 *
	 * Generates a map, needs to be called in the init function.
	 *
	 * Parameters:
	 *      name      = Name of the map to generate (need to be used at
	 *                  drawMiniMap())
	 *      width     = Width of the minimap
	 *      height    = Height of the minimap
	 *      layer     = Array of layer ids that should be displayed on
	 *                  the generated map
	 *		resize	  = Should the map be resized to the width and height values?
	 *
	 * ATTENTION: Do NOT call it in the draw function because this will have
	 *            a big impact on performance, if the map needs to be redrawn
	 *            on every frame!
	 */
	generateMiniMap: function(name, width, height, layer, resize)
	{
		// Needed parameters:
		if (typeof name === 'undefined')
			throw "minimap plugin [generateMiniMap()]: no name parameter set";
		if (typeof width === 'undefined')
			throw "minimap plugin [generateMiniMap()]: no width parameter set";
		if (typeof height === 'undefined')
			throw "minimap plugin [generateMiniMap()]: no height parameter set";

		// Optional parameter "layer". Set to (Layer) 0 by default:
		layer = typeof layer !== 'undefined' ? layer : [0];

		// Optional parameter "resize". Set to (resize) to false by default:
		resize = typeof resize !== 'undefined' ? resize : false;

		// Get scaling factor:
		var s = ig.system.scale;

		// create the minimap canvas
		var maptemp = ig.$new('canvas');
		maptemp.width = width * s;
		maptemp.height = height * s;

		// Get the canvas 2d context for map creation:
		var ctx = maptemp.getContext('2d');

		// Set solid background color for map:
		if(ig.game.clearColor)
		{
			ctx.fillStyle = ig.game.clearColor;
			ctx.fillRect(0, 0, maptemp.width, maptemp.height);
		}

		// Load background map data:
		var bglayers = ig.game.backgroundMaps;

		// Cycle through all layers that should be included in the map:
		for(var layerid = 0; layerid < layer.length; layerid++)
		{
			// Get the current layer:
			var map = bglayers[layer[layerid]];

			// Set fixed tilesize factor:
			var fWidth = 4;
			var fHeight = 4;

			// Calculate size of the tileset:
			var w = map.tiles.width * s;
			var h = map.tiles.height * s;
			var ws = w / map.tilesize * fWidth;
			var hs = h / map.tilesize * fHeight;

			// Resize tileset of the current map:
			var ts = ig.$new('canvas');
			var tsctx = ts.getContext('2d');
			ts.width = ws;
			ts.height = hs;
			tsctx.drawImage(map.tiles.data, 0, 0, w, h, 0, 0, ws, hs);

			// Calculate values to center the map:
			if (!resize)
			{
				this.maps[name + '_offsetx'] = Math.floor((width - (map.width * Math.floor(width / map.width))) / 2);
				this.maps[name + '_offsety'] = Math.floor((height - (map.height * Math.floor(height / map.height))) / 2);
			}
			// Or set them to 0 if resize is wanted:
			else
			{
				this.maps[name + '_offsetx'] = 0;
				this.maps[name + '_offsety'] = 0;
			}

			// draw the map
			var tile = 0;

			for(var x = 0; x < map.width; x++)
			{
				for(var y = 0; y < map.height; y++)
				{
					// Does a tile exists on this position?
					if((tile = map.data[y][x]))
					{
						ctx.drawImage(
							ts,
							Math.floor(((tile-1) * s) % (ws/fWidth)) * fWidth,
							(Math.floor((tile-1) * s / (ws/fHeight)) * fHeight) * s,
							fWidth * s,
							fHeight * s,
							((x * Math.floor(width / map.width)) + this.maps[name + '_offsetx']) * s,
							((y * Math.floor(height / map.height)) + this.maps[name + '_offsety']) * s,
							Math.floor(width / map.width) * s,
							Math.floor(height / map.height) * s
						);
					}
				}
			}

			// If resize is enabled, resize the drawed map:
			if (resize)
			{
				// Move maptemp to final save point:
				this.maps[name] = ig.$new('canvas');
				this.maps[name].width = width * s;
				this.maps[name].height = height * s;
				var fctx = this.maps[name].getContext('2d');
				// Draw resized map:
				fctx.drawImage(
					maptemp,
					0,
					0,
					(map.width * Math.floor(width / map.width)) * s,
					(map.height * Math.floor(height / map.height)) * s,
					0,
					0,
					width * s,
					height * s
				);
			}
			else
			{
				// Move maptemp to final save point:
				this.maps[name] = maptemp;
			}
		}
	}
	})
});
