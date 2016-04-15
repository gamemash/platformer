uniform vec2 tileLocation;
uniform vec2 screenSize;
uniform float textLength;
varying vec2 textureCoord;
uniform float fontSize; 
uniform int fixedPosition;

void main() {
  vec2 correctedPosition = vec2(position.x * textLength, position.y);
  vec2 pixelPosition = (correctedPosition * fontSize / 4.0 + tileLocation.xy);
  if (fixedPosition == 1){ 
    pixelPosition = pixelPosition + cameraPosition.xy;
  }
  pixelPosition = pixelPosition * 32.0;
  gl_Position = vec4(pixelPosition / screenSize - 1.0, 0.0, 1.0);
  textureCoord = floor(correctedPosition + 0.5);
}
