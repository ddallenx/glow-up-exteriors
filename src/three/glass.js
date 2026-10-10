import * as THREE from 'three'

export const grimeVert = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`
export const grimeFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime; uniform float uSeed; uniform float uStatic; uniform vec2 uAspect;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
  float fbm(vec2 p){ float v=0.; float a=.5; for(int i=0;i<4;i++){ v+=a*noise(p); p*=2.03; a*=.5; } return v; }
  void main(){
    float t = uStatic > .5 ? .62 : fract(uTime*.085 + uSeed);
    float wipe = clamp(t/.46, 0., 1.);
    float eased = wipe*wipe*(3.-2.*wipe);
    float p = eased*1.18 - .06;
    float cleaned = 1. - smoothstep(p-.035, p, vUv.x);
    float returning = smoothstep(.9, 1., t);
    float clean = cleaned * (1. - returning);

    vec2 q = vUv * uAspect;
    float streaks = fbm(vec2(q.x*3.2, q.y*.9) + uSeed*10.);
    float blotch  = fbm(q*2.1 + 7.);
    float spots   = smoothstep(.74, .8, noise(q*26. + uSeed*5.));
    float grime = smoothstep(.38,.85, streaks*.9 + blotch*.5) * .5 + spots*.45;
    grime *= 1. - clean;

    float edge = exp(-abs(vUv.x - p) * 55.) * step(t, .46) * step(.001, wipe);
    vec3 col = mix(vec3(.46,.5,.52), vec3(.78,.88,1.), edge);
    float a = clamp(grime + edge*.55, 0., .85);
    gl_FragColor = vec4(col, a);
  }
`

export function makeGrimeMaterial(seed, aspect, isStatic) {
  return new THREE.ShaderMaterial({
    vertexShader: grimeVert,
    fragmentShader: grimeFrag,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uSeed: { value: seed },
      uStatic: { value: isStatic ? 1 : 0 },
      uAspect: { value: new THREE.Vector2(aspect, 1) },
    },
  })
}
