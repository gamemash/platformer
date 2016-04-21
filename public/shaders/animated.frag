uniform sampler2D texture1;
varying vec2 textureCoord;
uniform vec2 tileSize;
uniform vec2 spriteLayout;
uniform vec2 spritePosition;
uniform vec2 spriteSize;
uniform int spriteFlipped;
uniform float opacity;

void main(){
  //gl_FragColor = vec4(textureCoord / 50.0, 0, 1);

  vec2 position = textureCoord;
  if (spriteFlipped == 1) {
    position = vec2(1.0 - textureCoord.x, textureCoord.y);
  } 

  vec4 result = texture2D(texture1, (position * spriteSize + spritePosition ) / spriteLayout );
  if (result.w < 0.01){
    discard;
  } else {
    result.a = opacity;
    gl_FragColor = result;
  }
}
