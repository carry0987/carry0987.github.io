import{a as n,p as e,w}from"./chunk-WWGJGFF6-B6u1Qf49.js";import{e as m,b as d,C as A}from"./OrbitControls-2wmebMyn.js";import{s as f}from"./shaderMaterial-CmZ-zmui.js";import{g as l,x as N,A as R}from"./three.module-DcpnAN3g.js";import{O as E}from"./OrbitControls-CxagEG9A.js";var i=(r=>(r.TERRAIN="TERRAIN",r.SPHERE_BLOB="SPHERE_BLOB",r.PARTICLES="PARTICLES",r.PLASMA="PLASMA",r))(i||{});const p=`
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
`,B=f({uTime:0,uSpeed:.2,uNoiseScale:.8,uDisplacement:1.5,uColorA:new l("#0d1b2a"),uColorB:new l("#00ffcc")},`
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uNoiseScale;
    uniform float uDisplacement;
    
    ${p}

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
    `),P=f({uTime:0,uSpeed:.5,uNoiseScale:1.5,uDisplacement:.8,uColorA:new l("#ff0055"),uColorB:new l("#220033")},`
    varying vec2 vUv;
    varying float vNoise;
    varying vec3 vNormal;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uNoiseScale;
    uniform float uDisplacement;
    
    ${p}

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
    `),M=f({uTime:0,uSpeed:.3,uNoiseScale:1,uColorA:new l("#1a0b2e"),uColorB:new l("#ff00ff")},`
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,`
    varying vec2 vUv;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uNoiseScale;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    
    ${p}

    void main() {
        float noise1 = snoise(vec3(vUv * uNoiseScale * 2.0, uTime * uSpeed));
        float noise2 = snoise(vec3(vUv * uNoiseScale * 5.0 + vec2(10.0), uTime * uSpeed * 0.5));
        float combined = (noise1 + noise2) * 0.5;
        
        float rings = sin(combined * 10.0 + uTime);
        vec3 color = mix(uColorA, uColorB, rings * 0.5 + 0.5);
        gl_FragColor = vec4(color, 1.0);
    }
    `),T=f({uTime:0,uSpeed:.1,uNoiseScale:.5,uDisplacement:2,uColorA:new l("#ffffff"),uColorB:new l("#4444ff")},`
    varying float vNoise;
    attribute float aRandom;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uNoiseScale;
    uniform float uDisplacement;
    
    ${p}

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
    `);m({TerrainMaterial:B});const z=({params:r})=>{const o=n.useRef(null),t=n.useRef(null);return d(()=>{o.current&&(o.current.uniforms.uTime.value+=.01,o.current.uniforms.uSpeed.value=r.speed,o.current.uniforms.uNoiseScale.value=r.noiseScale,o.current.uniforms.uDisplacement.value=r.displacement,o.current.uniforms.uColorA.value.set(r.colorA),o.current.uniforms.uColorB.value.set(r.colorB)),t.current&&(t.current.rotation.y+=.002)}),e.jsxs("mesh",{ref:t,rotation:[-Math.PI/2,0,0],children:[e.jsx("planeGeometry",{args:[10,10,128,128]}),e.jsx("terrainMaterial",{ref:o,wireframe:r.wireframe,side:N})]})};m({SphereBlobMaterial:P});const _=({params:r})=>{const o=n.useRef(null),t=n.useRef(null);return d(()=>{o.current&&(o.current.uniforms.uTime.value+=.01,o.current.uniforms.uSpeed.value=r.speed,o.current.uniforms.uNoiseScale.value=r.noiseScale,o.current.uniforms.uDisplacement.value=r.displacement,o.current.uniforms.uColorA.value.set(r.colorA),o.current.uniforms.uColorB.value.set(r.colorB)),t.current&&(t.current.rotation.y+=.002)}),e.jsxs("mesh",{ref:t,children:[e.jsx("icosahedronGeometry",{args:[2,64]}),e.jsx("sphereBlobMaterial",{ref:o,wireframe:r.wireframe})]})};m({PlasmaMaterial:M});const I=({params:r})=>{const o=n.useRef(null),t=n.useRef(null);return d(()=>{o.current&&(o.current.uniforms.uTime.value+=.01,o.current.uniforms.uSpeed.value=r.speed,o.current.uniforms.uNoiseScale.value=r.noiseScale,o.current.uniforms.uColorA.value.set(r.colorA),o.current.uniforms.uColorB.value.set(r.colorB)),t.current&&(t.current.rotation.y+=.002)}),e.jsxs("mesh",{ref:t,children:[e.jsx("planeGeometry",{args:[8,8,32,32]}),e.jsx("plasmaMaterial",{ref:o,side:N,wireframe:r.wireframe})]})};m({ParticlesMaterial:T});const D=({params:r})=>{const o=n.useRef(null),t=n.useRef(null),{positions:c,randoms:a}=n.useMemo(()=>{const s=new Float32Array(6e4),v=new Float32Array(2e4);for(let u=0;u<2e4;u++){const y=Math.random()*Math.PI*2,h=Math.acos(Math.random()*2-1),g=3.5+(Math.random()-.5)*.5,S=g*Math.sin(h)*Math.cos(y),C=g*Math.sin(h)*Math.sin(y),j=g*Math.cos(h);s[u*3]=S,s[u*3+1]=C,s[u*3+2]=j,v[u]=Math.random()}return{positions:s,randoms:v}},[]);return d(()=>{o.current&&(o.current.uniforms.uTime.value+=.01,o.current.uniforms.uSpeed.value=r.speed,o.current.uniforms.uNoiseScale.value=r.noiseScale,o.current.uniforms.uDisplacement.value=r.displacement,o.current.uniforms.uColorA.value.set(r.colorA),o.current.uniforms.uColorB.value.set(r.colorB)),t.current&&(t.current.rotation.y+=.002)}),e.jsxs("points",{ref:t,children:[e.jsxs("bufferGeometry",{children:[e.jsx("bufferAttribute",{attach:"attributes-position",args:[c,3]}),e.jsx("bufferAttribute",{attach:"attributes-aRandom",args:[a,1]})]}),e.jsx("particlesMaterial",{ref:o,transparent:!0,blending:R,depthWrite:!1})]})},L={[i.TERRAIN]:[0,3,4],[i.SPHERE_BLOB]:[0,0,6],[i.PARTICLES]:[0,0,8],[i.PLASMA]:[0,0,5]},k=({effectType:r,params:o})=>{const t=L[r];return e.jsx("div",{className:"absolute top-0 left-0 w-full h-full",children:e.jsxs(A,{camera:{position:t,fov:60,near:.1,far:1e3},dpr:[1,2],gl:{antialias:!0,alpha:!1},children:[e.jsx("color",{attach:"background",args:[328965]}),e.jsx("fogExp2",{attach:"fog",args:[328965,.02]}),e.jsx(E,{enableDamping:!0,dampingFactor:.05,enableZoom:!0}),r===i.TERRAIN&&e.jsx(z,{params:o}),r===i.SPHERE_BLOB&&e.jsx(_,{params:o}),r===i.PLASMA&&e.jsx(I,{params:o}),r===i.PARTICLES&&e.jsx(D,{params:o})]})})},F=({effectType:r,params:o,setEffectType:t,setParams:c})=>{const a=(s,v)=>{c({...o,[s]:v})},x=Object.values(i);return e.jsxs("div",{className:"absolute top-4 right-4 w-80 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6 text-white shadow-2xl overflow-y-auto max-h-[90vh] z-20",children:[e.jsxs("div",{className:"mb-6",children:[e.jsx("h1",{className:"text-xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1",children:"Noise Lab"}),e.jsx("p",{className:"text-xs text-gray-400",children:"Interactive Perlin Experiments"})]}),e.jsxs("div",{className:"mb-6",children:[e.jsx("label",{className:"block text-xs uppercase tracking-wider text-gray-500 mb-2 font-semibold",children:"Mode"}),e.jsx("div",{className:"grid grid-cols-2 gap-2",children:x.map(s=>e.jsx("button",{onClick:()=>t(s),className:`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${r===s?"bg-white/20 border-white/40 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]":"bg-transparent border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-200"}`,children:s.replace("_"," ")},s))})]}),e.jsxs("div",{className:"space-y-5",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-1",children:[e.jsx("label",{className:"text-xs text-gray-300",children:"Speed"}),e.jsx("span",{className:"text-xs text-gray-500",children:o.speed.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0",max:"2",step:"0.01",value:o.speed,onChange:s=>a("speed",parseFloat(s.target.value)),className:"w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-1",children:[e.jsx("label",{className:"text-xs text-gray-300",children:"Noise Scale"}),e.jsx("span",{className:"text-xs text-gray-500",children:o.noiseScale.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0.1",max:"5.0",step:"0.1",value:o.noiseScale,onChange:s=>a("noiseScale",parseFloat(s.target.value)),className:"w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between mb-1",children:[e.jsx("label",{className:"text-xs text-gray-300",children:"Displacement / Intensity"}),e.jsx("span",{className:"text-xs text-gray-500",children:o.displacement.toFixed(2)})]}),e.jsx("input",{type:"range",min:"0",max:"3",step:"0.1",value:o.displacement,onChange:s=>a("displacement",parseFloat(s.target.value)),className:"w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4 pt-2",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs text-gray-300 mb-2",children:"Color A"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"color",value:o.colorA,onChange:s=>a("colorA",s.target.value),className:"w-full h-8 rounded cursor-pointer opacity-0 absolute top-0 left-0"}),e.jsx("div",{className:"w-full h-8 rounded border border-white/20",style:{backgroundColor:o.colorA}})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs text-gray-300 mb-2",children:"Color B"}),e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"color",value:o.colorB,onChange:s=>a("colorB",s.target.value),className:"w-full h-8 rounded cursor-pointer opacity-0 absolute top-0 left-0"}),e.jsx("div",{className:"w-full h-8 rounded border border-white/20",style:{backgroundColor:o.colorB}})]})]})]}),r!==i.PARTICLES&&e.jsxs("div",{className:"flex items-center justify-between pt-2",children:[e.jsx("label",{className:"text-xs text-gray-300",children:"Wireframe Mode"}),e.jsx("button",{onClick:()=>a("wireframe",!o.wireframe),className:`w-10 h-5 rounded-full relative transition-colors duration-300 ${o.wireframe?"bg-purple-600":"bg-gray-700"}`,children:e.jsx("div",{className:`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform duration-300 ${o.wireframe?"left-6":"left-1"}`})})]})]})]})},b={[i.TERRAIN]:{speed:.2,noiseScale:.8,displacement:1.5,colorA:"#0d1b2a",colorB:"#00ffcc",wireframe:!0},[i.SPHERE_BLOB]:{speed:.5,noiseScale:1.5,displacement:.8,colorA:"#ff0055",colorB:"#220033",wireframe:!1},[i.PARTICLES]:{speed:.1,noiseScale:.5,displacement:2,colorA:"#ffffff",colorB:"#4444ff",wireframe:!1},[i.PLASMA]:{speed:.3,noiseScale:1,displacement:1,colorA:"#1a0b2e",colorB:"#ff00ff",wireframe:!1}},O=()=>{const[r,o]=n.useState(i.TERRAIN),[t,c]=n.useState(b[i.TERRAIN]),a=x=>{o(x),c(b[x])};return e.jsxs("div",{className:"relative w-screen h-screen overflow-hidden font-sans bg-transparent",children:[e.jsx(k,{effectType:r,params:t}),e.jsx(F,{effectType:r,params:t,setEffectType:a,setParams:c}),e.jsxs("div",{className:"absolute bottom-6 left-6 pointer-events-none opacity-50 text-white mix-blend-difference z-10",children:[e.jsx("h2",{className:"text-4xl font-black tracking-tighter uppercase",children:r.replace("_"," ")}),e.jsx("p",{className:"text-sm tracking-widest mt-1",children:"PERLIN NOISE GENERATOR"})]})]})},q={fullscreen:!0};function W(){return[{title:"Perlin Noise | Carry"},{property:"og:title",content:"Perlin Noise"},{name:"description",content:"An interactive Perlin noise visualizer with terrain, sphere blob, particles, and plasma effects."}]}const Z=w(O);export{Z as default,q as handle,W as meta};
