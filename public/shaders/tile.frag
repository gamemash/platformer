uniform sampler2D texture1;
varying vec2 textureCoord;
uniform float tileSize;
uniform vec2 spriteLayout;
uniform vec2 spritePosition;

void main(){
  //gl_FragColor = vec4(textureCoord / 50.0, 0, 1);

  gl_FragColor = texture2D(texture1, (textureCoord / tileSize  + spritePosition) / spriteLayout );
}
