import{a as r,p as e,w as R}from"./chunk-WWGJGFF6-B6u1Qf49.js";import{e as j,b,C as A}from"./OrbitControls-2wmebMyn.js";import{s as z}from"./shaderMaterial-CmZ-zmui.js";import{g as p,x as F,A as L}from"./three.module-DcpnAN3g.js";import{O as k}from"./OrbitControls-CxagEG9A.js";var i=(o=>(o.FIREBALL="FIREBALL",o.TERRAIN="TERRAIN",o.SPHERE_BLOB="SPHERE_BLOB",o.PARTICLES="PARTICLES",o))(i||{});const N=`
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

  // Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  //Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}
`,B=z({uTime:0,uSpeed:.2,uNoiseScale:.8,uDisplacement:1.5,uColorA:new p("#0d1b2a"),uColorB:new p("#00ffcc")},`
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uNoiseScale;
    uniform float uDisplacement;
    
    ${N}

    void main() {
        vUv = uv;
        vec3 pos = position;
        float noiseVal = snoise(vec3(pos.x * uNoiseScale, pos.y * uNoiseScale, uTime * uSpeed));
        vElevation = noiseVal;
        pos.z += noiseVal * uDisplacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
    `,`
    varying vec2 vUv;
    varying float vElevation;
    uniform vec3 uColorA;
    uniform vec3 uColorB;

    void main() {
        float mixStrength = (vElevation + 1.0) * 0.5;
        vec3 color = mix(uColorA, uColorB, mixStrength);
        gl_FragColor = vec4(color, 1.0);
    }
    `),_=z({uTime:0,uSpeed:.5,uNoiseScale:1.5,uDisplacement:.8,uColorA:new p("#ff0055"),uColorB:new p("#220033")},`
    varying vec2 vUv;
    varying float vNoise;
    varying vec3 vNormal;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uNoiseScale;
    uniform float uDisplacement;
    
    ${N}

    void main() {
        vUv = uv;
        vNormal = normal;
        vec3 pos = position;
        float noiseVal = snoise(vec3(pos * uNoiseScale + uTime * uSpeed));
        vNoise = noiseVal;
        pos += normal * noiseVal * uDisplacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
    `,`
    varying float vNoise;
    varying vec3 vNormal;
    uniform vec3 uColorA;
    uniform vec3 uColorB;

    void main() {
        float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0));
        float mixStrength = (vNoise + 1.0) * 0.5;
        vec3 baseColor = mix(uColorA, uColorB, mixStrength);
        vec3 finalColor = mix(baseColor, vec3(1.0), pow(1.0 - abs(intensity), 3.0) * 0.5);
        gl_FragColor = vec4(finalColor, 1.0);
    }
    `),$=z({uTime:0,uSpeed:.1,uNoiseScale:.5,uDisplacement:2,uColorA:new p("#ffffff"),uColorB:new p("#4444ff")},`
    varying float vNoise;
    attribute float aRandom;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uNoiseScale;
    uniform float uDisplacement;
    
    ${N}

    void main() {
        vec3 pos = position;
        float n1 = snoise(vec3(pos * uNoiseScale + uTime * uSpeed * 0.2));
        float n2 = snoise(vec3(pos * uNoiseScale + 100.0 + uTime * uSpeed * 0.2));
        float n3 = snoise(vec3(pos * uNoiseScale + 200.0 + uTime * uSpeed * 0.2));
        
        pos += vec3(n1, n2, n3) * uDisplacement * aRandom;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = (48.0 / -mvPosition.z);
        vNoise = n1;
    }
    `,`
    varying float vNoise;
    uniform vec3 uColorA;
    uniform vec3 uColorB;

    void main() {
        float dist = distance(gl_PointCoord, vec2(0.5));
        if (dist > 0.5) discard;
        
        vec3 color = mix(uColorA, uColorB, vNoise * 0.5 + 0.5);
        gl_FragColor = vec4(color, 1.0 - dist * 2.0);
    }
    `),I=`
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec3 P) {
    vec3 Pi0 = floor(P);
    vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
}

float pnoise(vec3 P, vec3 rep) {
    vec3 Pi0 = mod(floor(P), rep);
    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 1.5 * n_xyz;
}

float turbulence(vec3 p) {
    float t = -0.1;
    for (float f = 1.0; f <= 3.0; f++) {
        float power = pow(2.0, f);
        t += abs(pnoise(vec3(power * p), vec3(10.0, 10.0, 10.0)) / power);
    }
    return t;
}
`,T=z({uTime:0,uPointScale:1,uDecay:.1,uComplex:.3,uWaves:20,uEqColor:11,uFragment:!0,uElectroflow:!0},`
    ${I}
    
    varying float vQnoise;
    
    uniform float uTime;
    uniform float uPointScale;
    uniform float uDecay;
    uniform float uComplex;
    uniform float uWaves;
    uniform float uEqColor;
    uniform bool uFragment;

    void main() {
        float noise = (1.0 - uWaves) * turbulence(uDecay * abs(normal + uTime));
        vQnoise = (2.0 - uEqColor) * turbulence(uDecay * abs(normal + uTime));
        float b = pnoise(uComplex * position + vec3(1.0 * uTime), vec3(100.0));
        
        float displacement;
        if (uFragment) {
            displacement = -sin(noise) + normalize(b * 0.5);
        } else {
            displacement = -sin(noise) + cos(b * 0.5);
        }

        vec3 newPosition = position + normal * displacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        gl_PointSize = uPointScale;
    }
    `,`
    varying float vQnoise;
    uniform bool uElectroflow;

    void main() {
        float r, g, b;
        
        if (!uElectroflow) {
            r = cos(vQnoise + 0.5);
            g = cos(vQnoise - 0.5);
            b = 0.0;
        } else {
            r = cos(vQnoise + 0.5);
            g = cos(vQnoise - 0.5);
            b = abs(vQnoise);
        }
        gl_FragColor = vec4(r, g, b, 1.0);
    }
    `);j({TerrainMaterial:B});const D=({params:o})=>{const t=r.useRef(null),s=r.useRef(null);return b(()=>{t.current&&(t.current.uniforms.uTime.value+=.01,t.current.uniforms.uSpeed.value=o.speed,t.current.uniforms.uNoiseScale.value=o.noiseScale,t.current.uniforms.uDisplacement.value=o.displacement,t.current.uniforms.uColorA.value.set(o.colorA),t.current.uniforms.uColorB.value.set(o.colorB)),s.current&&(s.current.rotation.y+=.002)}),e.jsxs("mesh",{ref:s,rotation:[-Math.PI/2,0,0],children:[e.jsx("planeGeometry",{args:[10,10,128,128]}),e.jsx("terrainMaterial",{ref:t,wireframe:o.wireframe,side:F})]})};j({SphereBlobMaterial:_});const O=({params:o})=>{const t=r.useRef(null),s=r.useRef(null);return b(()=>{t.current&&(t.current.uniforms.uTime.value+=.01,t.current.uniforms.uSpeed.value=o.speed,t.current.uniforms.uNoiseScale.value=o.noiseScale,t.current.uniforms.uDisplacement.value=o.displacement,t.current.uniforms.uColorA.value.set(o.colorA),t.current.uniforms.uColorB.value.set(o.colorB)),s.current&&(s.current.rotation.y+=.002)}),e.jsxs("mesh",{ref:s,children:[e.jsx("icosahedronGeometry",{args:[2,64]}),e.jsx("sphereBlobMaterial",{ref:t,wireframe:o.wireframe})]})};j({ParticlesMaterial:$});const M=({params:o})=>{const t=r.useRef(null),s=r.useRef(null),{positions:c,randoms:n}=r.useMemo(()=>{const v=new Float32Array(6e4),g=new Float32Array(2e4);for(let u=0;u<2e4;u++){const x=Math.random()*Math.PI*2,y=Math.acos(Math.random()*2-1),f=3.5+(Math.random()-.5)*.5,a=f*Math.sin(y)*Math.cos(x),l=f*Math.sin(y)*Math.sin(x),h=f*Math.cos(y);v[u*3]=a,v[u*3+1]=l,v[u*3+2]=h,g[u]=Math.random()}return{positions:v,randoms:g}},[]);return b(()=>{t.current&&(t.current.uniforms.uTime.value+=.01,t.current.uniforms.uSpeed.value=o.speed,t.current.uniforms.uNoiseScale.value=o.noiseScale,t.current.uniforms.uDisplacement.value=o.displacement,t.current.uniforms.uColorA.value.set(o.colorA),t.current.uniforms.uColorB.value.set(o.colorB)),s.current&&(s.current.rotation.y+=.002)}),e.jsxs("points",{ref:s,children:[e.jsxs("bufferGeometry",{children:[e.jsx("bufferAttribute",{attach:"attributes-position",args:[c,3]}),e.jsx("bufferAttribute",{attach:"attributes-aRandom",args:[n,1]})]}),e.jsx("particlesMaterial",{ref:t,transparent:!0,blending:L,depthWrite:!1})]})};j({FireballMaterial:T});const V=({params:o})=>{const t=r.useRef(null),s=r.useRef(null),c=r.useRef(Date.now());return b(()=>{if(t.current){const n=(Date.now()-c.current)*o.speed;t.current.uniforms.uTime.value=n,t.current.uniforms.uPointScale.value=o.pointScale,t.current.uniforms.uDecay.value=o.decay,t.current.uniforms.uComplex.value=o.complex,t.current.uniforms.uWaves.value=o.waves,t.current.uniforms.uEqColor.value=o.hue,t.current.uniforms.uFragment.value=o.fragment,t.current.uniforms.uElectroflow.value=o.electroflow}if(s.current){s.current.rotation.y+=o.velocity;const n=Date.now()*.003;s.current.rotation.x=Math.sin(n*o.sinVel)*o.ampVel*Math.PI/180}}),e.jsxs("points",{ref:s,children:[e.jsx("sphereGeometry",{args:[3,512,512]}),e.jsx("fireballMaterial",{ref:t})]})},W={[i.TERRAIN]:[0,3,4],[i.SPHERE_BLOB]:[0,0,6],[i.PARTICLES]:[0,0,8],[i.FIREBALL]:[0,0,12]},q=({effectType:o,params:t,fireballParams:s})=>{const c=W[o];return e.jsx("div",{className:"absolute top-0 left-0 w-full h-full",children:e.jsxs(A,{camera:{position:c,fov:55,near:.1,far:1e3},dpr:[1,2],gl:{antialias:!0,alpha:!1},children:[e.jsx("color",{attach:"background",args:[328965]}),e.jsx("fogExp2",{attach:"fog",args:[328965,.02]}),e.jsx(k,{enableDamping:!0,dampingFactor:.05,enableZoom:!0}),o===i.TERRAIN&&e.jsx(D,{params:t}),o===i.SPHERE_BLOB&&e.jsx(O,{params:t}),o===i.PARTICLES&&e.jsx(M,{params:t}),o===i.FIREBALL&&s&&e.jsx(V,{params:s})]})})};function G({title:o,titleId:t,...s},c){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:c,"aria-labelledby":t},s),o?r.createElement("title",{id:t},o):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"}))}const Q=r.forwardRef(G);function H({title:o,titleId:t,...s},c){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:c,"aria-labelledby":t},s),o?r.createElement("title",{id:t},o):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"}))}const U=r.forwardRef(H);function Z({title:o,titleId:t,...s},c){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:c,"aria-labelledby":t},s),o?r.createElement("title",{id:t},o):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"}),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"}))}const X=r.forwardRef(Z);function J({title:o,titleId:t,...s},c){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:c,"aria-labelledby":t},s),o?r.createElement("title",{id:t},o):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"}))}const K=r.forwardRef(J);function Y({title:o,titleId:t,...s},c){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:c,"aria-labelledby":t},s),o?r.createElement("title",{id:t},o):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"}))}const ee=r.forwardRef(Y);function te({title:o,titleId:t,...s},c){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:c,"aria-labelledby":t},s),o?r.createElement("title",{id:t},o):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18 18 6M6 6l12 12"}))}const oe=r.forwardRef(te),w={[i.FIREBALL]:{icon:X,label:"Fireball",activeClass:"bg-orange-500/20 border-orange-500/50 text-orange-400",color:"#f97316"},[i.TERRAIN]:{icon:K,label:"Terrain",activeClass:"bg-green-500/20 border-green-500/50 text-green-400",color:"#22c55e"},[i.SPHERE_BLOB]:{icon:U,label:"Blob",activeClass:"bg-purple-500/20 border-purple-500/50 text-purple-400",color:"#a855f7"},[i.PARTICLES]:{icon:ee,label:"Particles",activeClass:"bg-cyan-500/20 border-cyan-500/50 text-cyan-400",color:"#06b6d4"}},d=(o,t,s,c)=>{const n=(o-t)/(s-t)*100;return`linear-gradient(to right, ${c} 0%, ${c} ${n}%, #374151 ${n}%, #374151 100%)`},ne=({effectType:o,params:t,setEffectType:s,setParams:c,fireballParams:n,setFireballParams:m})=>{const[v,g]=r.useState(!1),u=(a,l)=>{c({...t,[a]:l})},x=(a,l)=>{m({...n,[a]:l})},y=Object.values(i),f=(a=!1)=>e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:`${a?"flex items-center justify-between mb-4":"mb-6"}`,children:[e.jsxs("div",{children:[e.jsx("h1",{className:`${a?"text-lg":"text-xl"} font-bold bg-clip-text text-transparent bg-linear-to-r from-orange-400 to-pink-500`,children:"Noise Lab"}),e.jsx("p",{className:`${a?"text-[10px]":"text-xs"} text-gray-400 font-mono tracking-wider`,children:"PERLIN EXPERIMENTS"})]}),a&&e.jsxs("div",{className:"flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-lg",children:[e.jsx("div",{className:"w-2 h-2 rounded-full animate-pulse",style:{backgroundColor:w[o].color}}),e.jsx("span",{className:"text-xs text-white",children:w[o].label})]})]}),e.jsxs("div",{className:`${a?"mb-4":"mb-6"}`,children:[e.jsx("span",{className:`${a?"text-[10px]":"text-xs"} font-bold text-gray-500 uppercase tracking-widest mb-2 block`,children:"Mode"}),e.jsx("div",{className:`${a?"flex space-x-2 overflow-x-auto pb-2 -mx-1 px-1":"grid grid-cols-2 gap-2"}`,children:y.map(l=>{const h=w[l],P=h.icon,E=o===l;return e.jsxs("button",{onClick:()=>s(l),className:`${a?"shrink-0 flex items-center justify-center px-4 py-2.5":"flex items-center justify-center p-3"} rounded-xl transition-all ${E?h.activeClass:"bg-white/5 border-transparent hover:bg-white/10 text-gray-400"} border`,children:[e.jsx(P,{className:`${a?"w-4 h-4 mr-1.5":"w-5 h-5 mr-2"}`}),e.jsx("span",{className:`${a?"text-xs":"text-sm"}`,children:h.label})]},l)})})]}),e.jsxs("div",{className:`space-y-${a?"4":"5"}`,children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:`flex justify-between ${a?"text-[10px]":"text-xs"} text-gray-400`,children:[e.jsx("span",{children:"Speed"}),e.jsx("span",{children:t.speed.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0",max:"2",step:"0.01",value:t.speed,onChange:l=>u("speed",parseFloat(l.target.value)),className:"w-full h-1.5 rounded-lg appearance-none cursor-pointer",style:{background:d(t.speed,0,2,"#a855f7")}})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:`flex justify-between ${a?"text-[10px]":"text-xs"} text-gray-400`,children:[e.jsx("span",{children:"Noise Scale"}),e.jsx("span",{children:t.noiseScale.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0.1",max:"5.0",step:"0.1",value:t.noiseScale,onChange:l=>u("noiseScale",parseFloat(l.target.value)),className:"w-full h-1.5 rounded-lg appearance-none cursor-pointer",style:{background:d(t.noiseScale,.1,5,"#3b82f6")}})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:`flex justify-between ${a?"text-[10px]":"text-xs"} text-gray-400`,children:[e.jsx("span",{children:"Intensity"}),e.jsx("span",{children:t.displacement.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0",max:"3",step:"0.1",value:t.displacement,onChange:l=>u("displacement",parseFloat(l.target.value)),className:"w-full h-1.5 rounded-lg appearance-none cursor-pointer",style:{background:d(t.displacement,0,3,"#ec4899")}})]}),e.jsxs("div",{className:`grid grid-cols-2 gap-${a?"3":"4"} pt-2`,children:[e.jsxs("div",{children:[e.jsx("label",{className:`block ${a?"text-[10px]":"text-xs"} text-gray-400 mb-2`,children:"Color A"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"color",value:t.colorA,onChange:l=>u("colorA",l.target.value),className:"w-full h-8 rounded-lg cursor-pointer opacity-0 absolute top-0 left-0"}),e.jsx("div",{className:"w-full h-8 rounded-lg border border-white/20 transition-colors",style:{backgroundColor:t.colorA}})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:`block ${a?"text-[10px]":"text-xs"} text-gray-400 mb-2`,children:"Color B"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"color",value:t.colorB,onChange:l=>u("colorB",l.target.value),className:"w-full h-8 rounded-lg cursor-pointer opacity-0 absolute top-0 left-0"}),e.jsx("div",{className:"w-full h-8 rounded-lg border border-white/20 transition-colors",style:{backgroundColor:t.colorB}})]})]})]}),o!==i.PARTICLES&&o!==i.FIREBALL&&e.jsxs("div",{className:"flex items-center justify-between pt-2",children:[e.jsx("label",{className:`${a?"text-[10px]":"text-xs"} text-gray-400`,children:"Wireframe"}),e.jsx("button",{onClick:()=>u("wireframe",!t.wireframe),className:`w-10 h-5 rounded-full relative transition-colors duration-300 ${t.wireframe?"bg-purple-600":"bg-gray-700"}`,children:e.jsx("div",{className:`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform duration-300 ${t.wireframe?"left-6":"left-1"}`})})]}),o===i.FIREBALL&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"border-t border-white/10 pt-4 mt-4",children:e.jsx("span",{className:`${a?"text-[10px]":"text-xs"} font-bold text-orange-400 uppercase tracking-widest`,children:"Fireball Settings"})}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:`flex justify-between ${a?"text-[10px]":"text-xs"} text-gray-400`,children:[e.jsx("span",{children:"Velocity"}),e.jsx("span",{children:n.velocity.toFixed(4)})]}),e.jsx("input",{type:"range",min:"0",max:"0.02",step:"0.0001",value:n.velocity,onChange:l=>x("velocity",parseFloat(l.target.value)),className:"w-full h-1.5 rounded-lg appearance-none cursor-pointer",style:{background:d(n.velocity,0,.02,"#f97316")}})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:`flex justify-between ${a?"text-[10px]":"text-xs"} text-gray-400`,children:[e.jsx("span",{children:"Anim Speed"}),e.jsx("span",{children:n.speed.toFixed(5)})]}),e.jsx("input",{type:"range",min:"0",max:"0.0005",step:"0.00001",value:n.speed,onChange:l=>x("speed",parseFloat(l.target.value)),className:"w-full h-1.5 rounded-lg appearance-none cursor-pointer",style:{background:d(n.speed,0,5e-4,"#fb923c")}})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:`flex justify-between ${a?"text-[10px]":"text-xs"} text-gray-400`,children:[e.jsx("span",{children:"Point Size"}),e.jsx("span",{children:n.pointScale.toFixed(1)})]}),e.jsx("input",{type:"range",min:"1",max:"5",step:"0.1",value:n.pointScale,onChange:l=>x("pointScale",parseFloat(l.target.value)),className:"w-full h-1.5 rounded-lg appearance-none cursor-pointer",style:{background:d(n.pointScale,1,5,"#eab308")}})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:`flex justify-between ${a?"text-[10px]":"text-xs"} text-gray-400`,children:[e.jsx("span",{children:"Decay"}),e.jsx("span",{children:n.decay.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0",max:"1",step:"0.01",value:n.decay,onChange:l=>x("decay",parseFloat(l.target.value)),className:"w-full h-1.5 rounded-lg appearance-none cursor-pointer",style:{background:d(n.decay,0,1,"#ef4444")}})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:`flex justify-between ${a?"text-[10px]":"text-xs"} text-gray-400`,children:[e.jsx("span",{children:"Complexity"}),e.jsx("span",{children:n.complex.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0.1",max:"1",step:"0.01",value:n.complex,onChange:l=>x("complex",parseFloat(l.target.value)),className:"w-full h-1.5 rounded-lg appearance-none cursor-pointer",style:{background:d(n.complex,.1,1,"#a855f7")}})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:`flex justify-between ${a?"text-[10px]":"text-xs"} text-gray-400`,children:[e.jsx("span",{children:"Waves"}),e.jsx("span",{children:n.waves.toFixed(1)})]}),e.jsx("input",{type:"range",min:"0",max:"20",step:"0.5",value:n.waves,onChange:l=>x("waves",parseFloat(l.target.value)),className:"w-full h-1.5 rounded-lg appearance-none cursor-pointer",style:{background:d(n.waves,0,20,"#3b82f6")}})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:`flex justify-between ${a?"text-[10px]":"text-xs"} text-gray-400`,children:[e.jsx("span",{children:"Hue"}),e.jsx("span",{children:n.hue.toFixed(1)})]}),e.jsx("input",{type:"range",min:"0",max:"15",step:"0.1",value:n.hue,onChange:l=>x("hue",parseFloat(l.target.value)),className:"w-full h-1.5 rounded-lg appearance-none cursor-pointer",style:{background:d(n.hue,0,15,"#ec4899")}})]}),e.jsx("div",{className:"border-t border-white/10 pt-4 mt-4",children:e.jsx("span",{className:`${a?"text-[10px]":"text-xs"} font-bold text-cyan-400 uppercase tracking-widest`,children:"Spin Settings"})}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:`flex justify-between ${a?"text-[10px]":"text-xs"} text-gray-400`,children:[e.jsx("span",{children:"Sine"}),e.jsx("span",{children:n.sinVel.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0",max:"0.5",step:"0.01",value:n.sinVel,onChange:l=>x("sinVel",parseFloat(l.target.value)),className:"w-full h-1.5 rounded-lg appearance-none cursor-pointer",style:{background:d(n.sinVel,0,.5,"#06b6d4")}})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:`flex justify-between ${a?"text-[10px]":"text-xs"} text-gray-400`,children:[e.jsx("span",{children:"Amplitude"}),e.jsx("span",{children:n.ampVel.toFixed(1)})]}),e.jsx("input",{type:"range",min:"0",max:"90",step:"1",value:n.ampVel,onChange:l=>x("ampVel",parseFloat(l.target.value)),className:"w-full h-1.5 rounded-lg appearance-none cursor-pointer",style:{background:d(n.ampVel,0,90,"#22d3ee")}})]}),e.jsxs("div",{className:`${a?"grid grid-cols-2 gap-3":"space-y-3"} pt-3`,children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("label",{className:`${a?"text-[10px]":"text-xs"} text-gray-400`,children:"Fragment"}),e.jsx("button",{onClick:()=>x("fragment",!n.fragment),className:`w-10 h-5 rounded-full relative transition-colors duration-300 ${n.fragment?"bg-orange-500":"bg-gray-700"}`,children:e.jsx("div",{className:`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform duration-300 ${n.fragment?"left-6":"left-1"}`})})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("label",{className:`${a?"text-[10px]":"text-xs"} text-gray-400`,children:"Electroflow"}),e.jsx("button",{onClick:()=>x("electroflow",!n.electroflow),className:`w-10 h-5 rounded-full relative transition-colors duration-300 ${n.electroflow?"bg-purple-500":"bg-gray-700"}`,children:e.jsx("div",{className:`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform duration-300 ${n.electroflow?"left-6":"left-1"}`})})]})]})]})]})]});return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"hidden md:block absolute top-4 right-4 w-80 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-white shadow-2xl overflow-y-auto max-h-[90vh] z-20",children:[e.jsxs("div",{className:"absolute top-6 right-6 flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-lg",children:[e.jsx("div",{className:"w-2 h-2 rounded-full animate-pulse",style:{backgroundColor:w[o].color}}),e.jsx("span",{className:"text-[10px] text-gray-400",children:w[o].label})]}),f(!1)]}),e.jsx("button",{onClick:()=>g(!v),className:"md:hidden fixed right-4 bottom-4 w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-lg z-60 transition-all duration-300",children:v?e.jsx(oe,{className:"w-6 h-6 text-white"}):e.jsx(Q,{className:"w-6 h-6 text-white"})}),e.jsx("div",{className:"md:hidden fixed bottom-0 left-0 right-0 z-50",children:e.jsx("div",{className:`transform transition-transform duration-300 ease-out ${v?"translate-y-0":"translate-y-full"}`,children:e.jsxs("div",{className:"bg-black/70 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-4 pb-8 shadow-2xl max-h-[70vh] overflow-y-auto text-white",children:[f(!0),e.jsx("div",{className:"mt-4 pt-3 border-t border-white/10 text-[9px] text-gray-500 text-center",children:"Interactive Perlin noise visualization • Scroll for more controls"})]})})})]})},C={[i.FIREBALL]:{speed:1,noiseScale:1,displacement:2,colorA:"#ff5500",colorB:"#ffff00",wireframe:!1},[i.TERRAIN]:{speed:.2,noiseScale:.8,displacement:1.5,colorA:"#0d1b2a",colorB:"#00ffcc",wireframe:!0},[i.SPHERE_BLOB]:{speed:.5,noiseScale:1.5,displacement:.8,colorA:"#ff0055",colorB:"#220033",wireframe:!1},[i.PARTICLES]:{speed:.1,noiseScale:.5,displacement:2,colorA:"#ffffff",colorB:"#4444ff",wireframe:!1}},S={velocity:.002,speed:5e-4,pointScale:5,decay:.1,complex:.3,waves:20,hue:11,fragment:!0,electroflow:!0,sinVel:0,ampVel:80},re=()=>{const[o,t]=r.useState(i.FIREBALL),[s,c]=r.useState(C[i.FIREBALL]),[n,m]=r.useState(S),v=g=>{t(g),c(C[g]),g===i.FIREBALL&&m(S)};return e.jsxs("div",{className:"relative w-screen h-screen overflow-hidden font-sans bg-transparent",children:[e.jsx(q,{effectType:o,params:s,fireballParams:o===i.FIREBALL?n:void 0}),e.jsx(ne,{effectType:o,params:s,setEffectType:v,setParams:c,fireballParams:n,setFireballParams:m}),e.jsxs("div",{className:"absolute bottom-6 left-6 pointer-events-none opacity-50 text-white mix-blend-difference z-10",children:[e.jsx("h2",{className:"text-4xl font-black tracking-tighter uppercase",children:o.replace("_"," ")}),e.jsx("p",{className:"text-sm tracking-widest mt-1",children:"PERLIN NOISE GENERATOR"})]})]})},xe={fullscreen:!0};function ue(){return[{title:"Perlin Noise | Carry"},{property:"og:title",content:"Perlin Noise"},{name:"description",content:"An interactive Perlin noise visualizer with terrain, sphere blob, particles, and plasma effects."}]}const de=R(re);export{de as default,xe as handle,ue as meta};
