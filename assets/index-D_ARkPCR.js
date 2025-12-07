import{a as c,p as e,w as P}from"./chunk-WWGJGFF6-B6u1Qf49.js";import{e as m,b as f,C}from"./OrbitControls-2wmebMyn.js";import{s as p}from"./shaderMaterial-CmZ-zmui.js";import{g as d,x as S,A}from"./three.module-DcpnAN3g.js";import{O as E}from"./OrbitControls-CxagEG9A.js";var a=(o=>(o.TERRAIN="TERRAIN",o.SPHERE_BLOB="SPHERE_BLOB",o.PARTICLES="PARTICLES",o.FIREBALL="FIREBALL",o))(a||{});const h=`
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
`,R=p({uTime:0,uSpeed:.2,uNoiseScale:.8,uDisplacement:1.5,uColorA:new d("#0d1b2a"),uColorB:new d("#00ffcc")},`
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uNoiseScale;
    uniform float uDisplacement;
    
    ${h}

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
    `),_=p({uTime:0,uSpeed:.5,uNoiseScale:1.5,uDisplacement:.8,uColorA:new d("#ff0055"),uColorB:new d("#220033")},`
    varying vec2 vUv;
    varying float vNoise;
    varying vec3 vNormal;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uNoiseScale;
    uniform float uDisplacement;
    
    ${h}

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
    `),F=p({uTime:0,uSpeed:.1,uNoiseScale:.5,uDisplacement:2,uColorA:new d("#ffffff"),uColorB:new d("#4444ff")},`
    varying float vNoise;
    attribute float aRandom;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uNoiseScale;
    uniform float uDisplacement;
    
    ${h}

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
    `),B=`
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
`,I=p({uTime:0,uPointScale:1,uDecay:.1,uComplex:.3,uWaves:20,uEqColor:11,uFragment:!0,uElectroflow:!0},`
    ${B}
    
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
    `);m({TerrainMaterial:R});const L=({params:o})=>{const t=c.useRef(null),s=c.useRef(null);return f(()=>{t.current&&(t.current.uniforms.uTime.value+=.01,t.current.uniforms.uSpeed.value=o.speed,t.current.uniforms.uNoiseScale.value=o.noiseScale,t.current.uniforms.uDisplacement.value=o.displacement,t.current.uniforms.uColorA.value.set(o.colorA),t.current.uniforms.uColorB.value.set(o.colorB)),s.current&&(s.current.rotation.y+=.002)}),e.jsxs("mesh",{ref:s,rotation:[-Math.PI/2,0,0],children:[e.jsx("planeGeometry",{args:[10,10,128,128]}),e.jsx("terrainMaterial",{ref:t,wireframe:o.wireframe,side:S})]})};m({SphereBlobMaterial:_});const M=({params:o})=>{const t=c.useRef(null),s=c.useRef(null);return f(()=>{t.current&&(t.current.uniforms.uTime.value+=.01,t.current.uniforms.uSpeed.value=o.speed,t.current.uniforms.uNoiseScale.value=o.noiseScale,t.current.uniforms.uDisplacement.value=o.displacement,t.current.uniforms.uColorA.value.set(o.colorA),t.current.uniforms.uColorB.value.set(o.colorB)),s.current&&(s.current.rotation.y+=.002)}),e.jsxs("mesh",{ref:s,children:[e.jsx("icosahedronGeometry",{args:[2,64]}),e.jsx("sphereBlobMaterial",{ref:t,wireframe:o.wireframe})]})};m({ParticlesMaterial:F});const T=({params:o})=>{const t=c.useRef(null),s=c.useRef(null),{positions:x,randoms:r}=c.useMemo(()=>{const l=new Float32Array(6e4),i=new Float32Array(2e4);for(let u=0;u<2e4;u++){const n=Math.random()*Math.PI*2,v=Math.acos(Math.random()*2-1),y=3.5+(Math.random()-.5)*.5,j=y*Math.sin(v)*Math.cos(n),w=y*Math.sin(v)*Math.sin(n),N=y*Math.cos(v);l[u*3]=j,l[u*3+1]=w,l[u*3+2]=N,i[u]=Math.random()}return{positions:l,randoms:i}},[]);return f(()=>{t.current&&(t.current.uniforms.uTime.value+=.01,t.current.uniforms.uSpeed.value=o.speed,t.current.uniforms.uNoiseScale.value=o.noiseScale,t.current.uniforms.uDisplacement.value=o.displacement,t.current.uniforms.uColorA.value.set(o.colorA),t.current.uniforms.uColorB.value.set(o.colorB)),s.current&&(s.current.rotation.y+=.002)}),e.jsxs("points",{ref:s,children:[e.jsxs("bufferGeometry",{children:[e.jsx("bufferAttribute",{attach:"attributes-position",args:[x,3]}),e.jsx("bufferAttribute",{attach:"attributes-aRandom",args:[r,1]})]}),e.jsx("particlesMaterial",{ref:t,transparent:!0,blending:A,depthWrite:!1})]})};m({FireballMaterial:I});const D=({params:o})=>{const t=c.useRef(null),s=c.useRef(null),x=c.useRef(Date.now());return f(()=>{if(t.current){const r=(Date.now()-x.current)*o.speed;t.current.uniforms.uTime.value=r,t.current.uniforms.uPointScale.value=o.pointScale,t.current.uniforms.uDecay.value=o.decay,t.current.uniforms.uComplex.value=o.complex,t.current.uniforms.uWaves.value=o.waves,t.current.uniforms.uEqColor.value=o.hue,t.current.uniforms.uFragment.value=o.fragment,t.current.uniforms.uElectroflow.value=o.electroflow}if(s.current){s.current.rotation.y+=o.velocity;const r=Date.now()*.003;s.current.rotation.x=Math.sin(r*o.sinVel)*o.ampVel*Math.PI/180}}),e.jsxs("points",{ref:s,children:[e.jsx("icosahedronGeometry",{args:[3,7]}),e.jsx("fireballMaterial",{ref:t})]})},k={[a.TERRAIN]:[0,3,4],[a.SPHERE_BLOB]:[0,0,6],[a.PARTICLES]:[0,0,8],[a.FIREBALL]:[0,0,12]},V=({effectType:o,params:t,fireballParams:s})=>{const x=k[o];return e.jsx("div",{className:"absolute top-0 left-0 w-full h-full",children:e.jsxs(C,{camera:{position:x,fov:55,near:.1,far:1e3},dpr:[1,2],gl:{antialias:!0,alpha:!1},children:[e.jsx("color",{attach:"background",args:[328965]}),e.jsx("fogExp2",{attach:"fog",args:[328965,.02]}),e.jsx(E,{enableDamping:!0,dampingFactor:.05,enableZoom:!0}),o===a.TERRAIN&&e.jsx(L,{params:t}),o===a.SPHERE_BLOB&&e.jsx(M,{params:t}),o===a.PARTICLES&&e.jsx(T,{params:t}),o===a.FIREBALL&&s&&e.jsx(D,{params:s})]})})},O=({effectType:o,params:t,setEffectType:s,setParams:x,fireballParams:r,setFireballParams:g})=>{const l=(n,v)=>{x({...t,[n]:v})},i=(n,v)=>{g({...r,[n]:v})},u=Object.values(a);return e.jsxs("div",{className:"absolute top-4 right-4 w-80 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6 text-white shadow-2xl overflow-y-auto max-h-[90vh] z-20",children:[e.jsxs("div",{className:"mb-6",children:[e.jsx("h1",{className:"text-xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1",children:"Noise Lab"}),e.jsx("p",{className:"text-xs text-gray-400",children:"Interactive Perlin Experiments"})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx("label",{className:"block text-xs uppercase tracking-wider text-gray-500 mb-2 font-semibold",children:"Mode"}),e.jsx("div",{className:"grid grid-cols-2 gap-2",children:u.map(n=>e.jsx("button",{onClick:()=>s(n),className:`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${o===n?"bg-white/20 border-white/40 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]":"bg-transparent border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-200"}`,children:n.replace("_"," ")},n))})]}),e.jsxs("div",{className:"space-y-5",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-1",children:[e.jsx("label",{className:"text-xs text-gray-300",children:"Speed"}),e.jsx("span",{className:"text-xs text-gray-500",children:t.speed.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0",max:"2",step:"0.01",value:t.speed,onChange:n=>l("speed",parseFloat(n.target.value)),className:"w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-1",children:[e.jsx("label",{className:"text-xs text-gray-300",children:"Noise Scale"}),e.jsx("span",{className:"text-xs text-gray-500",children:t.noiseScale.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0.1",max:"5.0",step:"0.1",value:t.noiseScale,onChange:n=>l("noiseScale",parseFloat(n.target.value)),className:"w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-1",children:[e.jsx("label",{className:"text-xs text-gray-300",children:"Displacement / Intensity"}),e.jsx("span",{className:"text-xs text-gray-500",children:t.displacement.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0",max:"3",step:"0.1",value:t.displacement,onChange:n=>l("displacement",parseFloat(n.target.value)),className:"w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4 pt-2",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs text-gray-300 mb-2",children:"Color A"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"color",value:t.colorA,onChange:n=>l("colorA",n.target.value),className:"w-full h-8 rounded cursor-pointer opacity-0 absolute top-0 left-0"}),e.jsx("div",{className:"w-full h-8 rounded border border-white/20",style:{backgroundColor:t.colorA}})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs text-gray-300 mb-2",children:"Color B"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"color",value:t.colorB,onChange:n=>l("colorB",n.target.value),className:"w-full h-8 rounded cursor-pointer opacity-0 absolute top-0 left-0"}),e.jsx("div",{className:"w-full h-8 rounded border border-white/20",style:{backgroundColor:t.colorB}})]})]})]}),o!==a.PARTICLES&&o!==a.FIREBALL&&e.jsxs("div",{className:"flex items-center justify-between pt-2",children:[e.jsx("label",{className:"text-xs text-gray-300",children:"Wireframe Mode"}),e.jsx("button",{onClick:()=>l("wireframe",!t.wireframe),className:`w-10 h-5 rounded-full relative transition-colors duration-300 ${t.wireframe?"bg-purple-600":"bg-gray-700"}`,children:e.jsx("div",{className:`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform duration-300 ${t.wireframe?"left-6":"left-1"}`})})]}),o===a.FIREBALL&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"border-t border-white/10 pt-4 mt-4",children:e.jsx("h3",{className:"text-xs uppercase tracking-wider text-orange-400 mb-4 font-semibold",children:"Fireball Settings"})}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-1",children:[e.jsx("label",{className:"text-xs text-gray-300",children:"Velocity"}),e.jsx("span",{className:"text-xs text-gray-500",children:r.velocity.toFixed(4)})]}),e.jsx("input",{type:"range",min:"0",max:"0.02",step:"0.0001",value:r.velocity,onChange:n=>i("velocity",parseFloat(n.target.value)),className:"w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-1",children:[e.jsx("label",{className:"text-xs text-gray-300",children:"Speed"}),e.jsx("span",{className:"text-xs text-gray-500",children:r.speed.toFixed(5)})]}),e.jsx("input",{type:"range",min:"0",max:"0.0005",step:"0.00001",value:r.speed,onChange:n=>i("speed",parseFloat(n.target.value)),className:"w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-1",children:[e.jsx("label",{className:"text-xs text-gray-300",children:"Point Size"}),e.jsx("span",{className:"text-xs text-gray-500",children:r.pointScale.toFixed(1)})]}),e.jsx("input",{type:"range",min:"1",max:"5",step:"0.1",value:r.pointScale,onChange:n=>i("pointScale",parseFloat(n.target.value)),className:"w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-1",children:[e.jsx("label",{className:"text-xs text-gray-300",children:"Decay"}),e.jsx("span",{className:"text-xs text-gray-500",children:r.decay.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0",max:"1",step:"0.01",value:r.decay,onChange:n=>i("decay",parseFloat(n.target.value)),className:"w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-1",children:[e.jsx("label",{className:"text-xs text-gray-300",children:"Complexity"}),e.jsx("span",{className:"text-xs text-gray-500",children:r.complex.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0.1",max:"1",step:"0.01",value:r.complex,onChange:n=>i("complex",parseFloat(n.target.value)),className:"w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-1",children:[e.jsx("label",{className:"text-xs text-gray-300",children:"Waves"}),e.jsx("span",{className:"text-xs text-gray-500",children:r.waves.toFixed(1)})]}),e.jsx("input",{type:"range",min:"0",max:"20",step:"0.5",value:r.waves,onChange:n=>i("waves",parseFloat(n.target.value)),className:"w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-1",children:[e.jsx("label",{className:"text-xs text-gray-300",children:"Hue"}),e.jsx("span",{className:"text-xs text-gray-500",children:r.hue.toFixed(1)})]}),e.jsx("input",{type:"range",min:"0",max:"15",step:"0.1",value:r.hue,onChange:n=>i("hue",parseFloat(n.target.value)),className:"w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"})]}),e.jsx("div",{className:"border-t border-white/10 pt-4 mt-4",children:e.jsx("h3",{className:"text-xs uppercase tracking-wider text-cyan-400 mb-4 font-semibold",children:"Spin Settings"})}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-1",children:[e.jsx("label",{className:"text-xs text-gray-300",children:"Sine"}),e.jsx("span",{className:"text-xs text-gray-500",children:r.sinVel.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0",max:"0.5",step:"0.01",value:r.sinVel,onChange:n=>i("sinVel",parseFloat(n.target.value)),className:"w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-1",children:[e.jsx("label",{className:"text-xs text-gray-300",children:"Amplitude"}),e.jsx("span",{className:"text-xs text-gray-500",children:r.ampVel.toFixed(1)})]}),e.jsx("input",{type:"range",min:"0",max:"90",step:"1",value:r.ampVel,onChange:n=>i("ampVel",parseFloat(n.target.value)),className:"w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"})]}),e.jsxs("div",{className:"space-y-3 pt-2",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("label",{className:"text-xs text-gray-300",children:"Fragment Mode"}),e.jsx("button",{onClick:()=>i("fragment",!r.fragment),className:`w-10 h-5 rounded-full relative transition-colors duration-300 ${r.fragment?"bg-orange-600":"bg-gray-700"}`,children:e.jsx("div",{className:`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform duration-300 ${r.fragment?"left-6":"left-1"}`})})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("label",{className:"text-xs text-gray-300",children:"Electroflow"}),e.jsx("button",{onClick:()=>i("electroflow",!r.electroflow),className:`w-10 h-5 rounded-full relative transition-colors duration-300 ${r.electroflow?"bg-purple-600":"bg-gray-700"}`,children:e.jsx("div",{className:`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform duration-300 ${r.electroflow?"left-6":"left-1"}`})})]})]})]})]})]})},b={[a.TERRAIN]:{speed:.2,noiseScale:.8,displacement:1.5,colorA:"#0d1b2a",colorB:"#00ffcc",wireframe:!0},[a.SPHERE_BLOB]:{speed:.5,noiseScale:1.5,displacement:.8,colorA:"#ff0055",colorB:"#220033",wireframe:!1},[a.PARTICLES]:{speed:.1,noiseScale:.5,displacement:2,colorA:"#ffffff",colorB:"#4444ff",wireframe:!1},[a.FIREBALL]:{speed:1,noiseScale:1,displacement:2,colorA:"#ff5500",colorB:"#ffff00",wireframe:!1}},z={velocity:.002,speed:5e-4,pointScale:1,decay:.1,complex:.3,waves:20,hue:11,fragment:!0,electroflow:!0,sinVel:0,ampVel:80},q=()=>{const[o,t]=c.useState(a.TERRAIN),[s,x]=c.useState(b[a.TERRAIN]),[r,g]=c.useState(z),l=i=>{t(i),x(b[i]),i===a.FIREBALL&&g(z)};return e.jsxs("div",{className:"relative w-screen h-screen overflow-hidden font-sans bg-transparent",children:[e.jsx(V,{effectType:o,params:s,fireballParams:o===a.FIREBALL?r:void 0}),e.jsx(O,{effectType:o,params:s,setEffectType:l,setParams:x,fireballParams:r,setFireballParams:g}),e.jsxs("div",{className:"absolute bottom-6 left-6 pointer-events-none opacity-50 text-white mix-blend-difference z-10",children:[e.jsx("h2",{className:"text-4xl font-black tracking-tighter uppercase",children:o.replace("_"," ")}),e.jsx("p",{className:"text-sm tracking-widest mt-1",children:"PERLIN NOISE GENERATOR"})]})]})},H={fullscreen:!0};function Z(){return[{title:"Perlin Noise | Carry"},{property:"og:title",content:"Perlin Noise"},{name:"description",content:"An interactive Perlin noise visualizer with terrain, sphere blob, particles, and plasma effects."}]}const J=P(q);export{J as default,H as handle,Z as meta};
