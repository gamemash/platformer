uniform sampler2D texture1;
varying vec2 textureCoord;
uniform vec2 size;
uniform vec2 spriteLayout;
uniform vec2 spritePosition;
uniform vec2 spriteSize;
uniform int spriteFlipped;
uniform float opacity;
uniform int powerUp;

vec4 flowerCorrection(vec4 colorIn){
  vec4 result = colorIn;
  if (result.r > (176.0/256.0) && result.r < 178.0/256.0){
    result = vec4(252.0/256.0, 216.0/256.0, 168.0/256.0, 1.0);
  }

  if (result.r > (105.0/256.0) && result.r < 107.0/256.0){
    result = vec4(216, 40, 0, 256) / 256.0;
  }

  return result;
}

vec4 starCorrection(vec4 colorIn){
  vec4 result = colorIn;
  //overall
  if (result.r > (176.0/256.0) && result.r < 178.0/256.0){
    result = vec4(0, 0, 0, 256) / 256.0;
  }

  if (result.r > (105.0/256.0) && result.r < 107.0/256.0){
    result = vec4(200, 76, 12, 256) / 256.0;
  }

  return result;
}

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
    if (powerUp == 1){
      gl_FragColor = flowerCorrection(result);
    } else if (powerUp == 2) {
      gl_FragColor = starCorrection(result);
    } else {
      gl_FragColor = result;
    }
  }
}
