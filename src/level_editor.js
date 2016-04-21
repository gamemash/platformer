let stampit                             = require('stampit');
let THREE                               = require('three');
let {mouseMoveStream, mouseClickStream} = require('./mouse_stream.js');
let Selector                            = require('./selector.js');
let _                                   = require('underscore');
let PhysicsEngine                       = require('./physics_engine.js');
let Blocks                              = require('./blocks.js');

function convertToGridCoordinatesForRenderer(renderer, pixelCoordinates) {
  let newCoordinates = new THREE.Vector2()
  newCoordinates.x = Math.floor((pixelCoordinates.x / 32)- renderer.camera.position.x);
  newCoordinates.y = Math.floor(pixelCoordinates.y / 32);
  return newCoordinates;
}

let Level = stampit
  .init(function(){
    this.data = {}
    this.loadedSprites = {}
  })
  .methods({
    set: function(coordinates, entity_id, metadata) {
      let sprite = Blocks[entity_id].create({game: this.game, position: new THREE.Vector2(coordinates.x, coordinates.y) });

      if(this.loadedSprites[coordinates.x + ":" + coordinates.y] != undefined) {
        this.delete(coordinates);
        this.loadedSprites[coordinates.x + ":" + coordinates.y] = sprite;
      } else {
        this.loadedSprites[coordinates.x + ":" + coordinates.y] = sprite;
      }


      this.data[coordinates.x + ":" + coordinates.y] = {
        x: coordinates.x,
        y: coordinates.y,
        entity_id: entity_id,
        metadata: metadata
      }
    },
    delete: function(coordinates) {
      console.log(coordinates);
      delete this.data[coordinates.x + ":" + coordinates.y];
      PhysicsEngine.removeObject(this.loadedSprites[coordinates.x + ":" + coordinates.y]);
      this.game.renderer.deleteFromScene(this.loadedSprites[coordinates.x + ":" + coordinates.y].mesh);
      delete this.loadedSprites[coordinates.x + ":" + coordinates.y];
    },
    export: function() {
      console.log(JSON.stringify(this.data));
    },
    clear: function() {
      let scene = this.game.renderer.scene;
      for(var i = scene.children.length - 1; i >= 0 ; i--){
        let obj = scene.children[i];
        console.log(obj)
        scene.remove(obj);
      }
    },
    load: function() {
      this.clear();
      for (var key in this.data) {
        if (this.data.hasOwnProperty(key)) {
          let block = this.data[key];
          let sprite = Blocks[block.entity_id].create({game: this.game, position: new THREE.Vector2(block.x, block.y) });
          this.loadedSprites[block.x + ":" + block.y] = sprite;
        }
      }
    }
  })

let BlockTool = stampit
  .init(function() {

  })
  .methods({
    use: function(coordinates) {
      level.set(coordinates, this.blockId, {});
    }
  })

let EraseTool = stampit
  .methods({
    use: function(coordinates) {
      level.delete(coordinates);
    }
  })

let LevelEditor = stampit
  .init(function(){
    this.selectedTool = BlockTool.create({blockId: "Ground", game: this.game});
    this.selector = Selector.create({game: this.game, position: new THREE.Vector2(0, 0)});
    let convertToGridCoordinates = convertToGridCoordinatesForRenderer.bind(this, this.game.renderer);
    let mouseMoveGridStream = mouseMoveStream.map(convertToGridCoordinates);

    mouseMoveGridStream.onValue(this.selector.moveToCoordinates.bind(this.selector));

    let clickPositionStream = mouseMoveGridStream.sampledBy(mouseClickStream.filter((x) => {return x}));
    mouseClickStream.log();
    let dragPositionStream = mouseMoveStream.map(convertToGridCoordinates).filterBy(mouseClickStream);

    let level = Level.create({game: this.game});
    window.level = level;

    clickPositionStream.log()
      .merge(dragPositionStream)
      .skipDuplicates(_.isEqual)
      .onValue((coordinates) => {
        this.selectedTool.use(coordinates);
      });

    this.toolbox = document.getElementById('toolbox');

    for (var key in Blocks) {
      if (Blocks.hasOwnProperty(key)) {
        this.addBlockToToolbox(key);
      }
    }

    this.addSpacerToToolbox();
    this.addBlockToToolbox('Eraser');
    this.addBlockToToolbox('Clear');
    this.addSpacerToToolbox();
    this.addBlockToToolbox('Save');
    this.addBlockToToolbox('Load');


  })
  .methods({
    selectTool: function(id) {
      if (Blocks.hasOwnProperty(id)) {
        this.selectedTool = BlockTool.create({blockId: id, game: this.game});
      } else {
        this.selectedTool = EraseTool.create({game: this.game});
      }
    },

    addSpacerToToolbox: function() {
      element = document.createElement("div");
      element.className = "spacer";
      this.toolbox.appendChild(element);
    },

    addBlockToToolbox: function(key) {
      element = document.createElement("div");
      element.className = "block";

      if (key == "Ground") {
        element.className += " selected";
      }

      element.id = key;
      this.toolbox.appendChild(element);
      element.addEventListener("click", (evt) => {
        this.selectTool(evt.target.id);
        let blockButtons = document.querySelectorAll(".block");

        _.each(blockButtons, (button) => {
          button.className = "block"
        });

        evt.target.className += " selected"
      });
    }
  })

module.exports = LevelEditor;