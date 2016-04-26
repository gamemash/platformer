uniform vec2 tileLocation;
uniform vec2 screenSize;
varying vec2 textureCoord;
uniform int fixedPosition;
uniform vec2 size;
uniform float zIndex;

void main() {
  //vec2 screenSize = vec2(1500, 500);

  //gl_Position = vec4(position.xy, 0, 1);
  vec2 pixelPosition = (position.xy * size + tileLocation.xy);
  if (fixedPosition == 0){ 
    pixelPosition = pixelPosition + cameraPosition.xy;
  }
  pixelPosition = pixelPosition * 64.0;
  gl_Position = vec4(pixelPosition / screenSize - 1.0, zIndex, 1.0);
  textureCoord = floor(position.xy + 0.5);
}
