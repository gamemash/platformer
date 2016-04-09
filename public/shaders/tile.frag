uniform sampler2D texture1;
varying vec2 textureCoord;
uniform float tileSize;

void main(){
  //gl_FragColor = vec4(textureCoord / 50.0, 0, 1);
  gl_FragColor = texture2D(texture1, textureCoord / tileSize);
}
