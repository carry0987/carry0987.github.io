import{r as e}from"./rolldown-runtime-XKyaHtl9.js";import{ot as t}from"./jsx-runtime-C3US_PGx.js";import{s as n}from"./OrbitControls-Dh7-DU24.js";import{Ft as r,h as i,wt as a,yt as o}from"./three.module-D-6Nqny5.js";import{t as s}from"./constants-C-UhYjcR.js";var c=e(t()),l=class extends o{constructor(){super({uniforms:{time:{value:0},fade:{value:1}},vertexShader:`
      uniform float time;
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);
        gl_PointSize = size * (30.0 / -mvPosition.z) * (3.0 + sin(time + 100.0));
        gl_Position = projectionMatrix * mvPosition;
      }`,fragmentShader:`
      uniform sampler2D pointTexture;
      uniform float fade;
      varying vec3 vColor;
      void main() {
        float opacity = 1.0;
        if (fade == 1.0) {
          float d = distance(gl_PointCoord, vec2(0.5, 0.5));
          opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));
        }
        gl_FragColor = vec4(vColor, opacity);

        #include <tonemapping_fragment>
	      #include <${s>=154?`colorspace_fragment`:`encodings_fragment`}>
      }`})}},u=e=>new r().setFromSpherical(new a(e,Math.acos(1-Math.random()*2),Math.random()*2*Math.PI)),d=c.forwardRef(({radius:e=100,depth:t=50,count:r=5e3,saturation:a=0,factor:o=4,fade:s=!1,speed:d=1},f)=>{let p=c.useRef(null),[m,h,g]=c.useMemo(()=>{let n=[],s=[],c=Array.from({length:r},()=>(.5+.5*Math.random())*o),l=new i,d=e+t,f=t/r;for(let e=0;e<r;e++)d-=f*Math.random(),n.push(...u(d).toArray()),l.setHSL(e/r,a,.9),s.push(l.r,l.g,l.b);return[new Float32Array(n),new Float32Array(s),new Float32Array(c)]},[r,t,o,e,a]);n(e=>p.current&&(p.current.uniforms.time.value=e.clock.elapsedTime*d));let[_]=c.useState(()=>new l);return c.createElement(`points`,{ref:f},c.createElement(`bufferGeometry`,null,c.createElement(`bufferAttribute`,{attach:`attributes-position`,args:[m,3]}),c.createElement(`bufferAttribute`,{attach:`attributes-color`,args:[h,3]}),c.createElement(`bufferAttribute`,{attach:`attributes-size`,args:[g,1]})),c.createElement(`primitive`,{ref:p,object:_,attach:`material`,blending:2,"uniforms-fade-value":s,depthWrite:!1,transparent:!0,vertexColors:!0}))});export{d as t};