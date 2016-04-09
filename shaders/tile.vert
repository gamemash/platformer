uniform vec2 tileLocation;
uniform vec2 screenSize;
varying vec2 textureCoord;

void main() {
  //vec2 screenSize = vec2(1500, 500);

  //gl_Position = vec4(position.xy, 0, 1);
  gl_Position = vec4((position.xy + tileLocation.xy + cameraPosition.xy) / screenSize - 1.0, 0.0, 1.0);
  textureCoord = position.xy;
}
