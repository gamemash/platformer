var stampit = require('stampit');
var THREE = require('three');

var size = 50;
var rectShape = new THREE.Shape();
rectShape.moveTo( 0,0 );
rectShape.lineTo( 0, size );
rectShape.lineTo( size, size );
rectShape.lineTo( size, 0 );
rectShape.lineTo( 0, 0 );
  

var SpriteGeometry = stampit().refs({
}).init(function(){
  this.geometry = new THREE.ShapeGeometry(rectShape);
});

module.exports = SpriteGeometry;

