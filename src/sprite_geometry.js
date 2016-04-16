var stampit = require('stampit');
var THREE = require('three');

let rectShape = function(size){
  var rectShape = new THREE.Shape();
  rectShape.moveTo( 0,0 );
  rectShape.lineTo( 0, size.y );
  rectShape.lineTo( size.x, size.y );
  rectShape.lineTo( size.x, 0 );
  rectShape.lineTo( 0, 0 );
  return rectShape;
}
  

var SpriteGeometry = stampit().refs({
}).init(function(){
  this.geometry = new THREE.ShapeGeometry(rectShape(this.size));
});

module.exports = SpriteGeometry;

