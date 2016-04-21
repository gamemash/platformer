varying vec2 textureCoord;

uniform sampler2D texture1;
uniform vec2 spriteLayout;

void main(){
  vec4 result = texture2D(texture1, textureCoord);
  if (result.w < 0.01)
    discard;
  gl_FragColor = result;
}
