uniform sampler2D texture1;
uniform sampler2D textData;

varying vec2 textureCoord;
uniform float tileSize;
uniform vec2 spriteLayout;
uniform vec2 spritePosition;
uniform float textLength;

void main(){
  vec2 characterPosition = vec2(floor(textureCoord.x)/ textLength, floor(textureCoord.y));
  vec2 character = texture2D(textData, characterPosition).xy * 255.0;

  vec2 relativePosition = (mod(textureCoord,1.0) + character) / spriteLayout;
  vec4 result = texture2D(texture1, relativePosition);
  if (length(result.rgb) < 0.5)
    discard;
  gl_FragColor = result;
}
