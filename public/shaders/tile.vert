varying vec2 textureCoord;

uniform vec2 tileLocation;
uniform vec2 screenSize;
uniform int fixedPosition;

void main() {
  vec2 pixelPosition = (position.xy + tileLocation.xy);
  if (fixedPosition == 0){ 
    pixelPosition = pixelPosition + cameraPosition.xy;
  }
  pixelPosition = pixelPosition * 64.0;
  gl_Position = vec4(pixelPosition / screenSize - 1.0, 0.0, 1.0);
  textureCoord = floor(position.xy + 0.5);
}
