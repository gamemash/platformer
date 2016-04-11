uniform vec2 tileLocation;
uniform vec2 screenSize;
varying vec2 textureCoord;

void main() {
  //vec2 screenSize = vec2(1500, 500);

  //gl_Position = vec4(position.xy, 0, 1);
  vec2 pixelPosition = (position.xy + tileLocation.xy + cameraPosition.xy);
  pixelPosition = floor(pixelPosition * 32.0 + 0.5);
  gl_Position = vec4(pixelPosition / screenSize - 1.0, 0.0, 1.0);
  textureCoord = floor(position.xy + 0.5);
}
