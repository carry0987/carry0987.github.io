import{r as e}from"./chunk-ChSjv458.js";import{P as t}from"./jsx-runtime-CDrvMv1E.js";import{Ft as n,h as r,wt as i,yt as a}from"./three.module-BvyxSh7g.js";import{s as o}from"./OrbitControls-Ct9yVnSs.js";import{t as s}from"./constants-ndaHe9YA.js";var c=e(t()),l=class extends a{constructor(){super({uniforms:{time:{value:0},fade:{value:1}},vertexShader:`
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
      }`})}},u=e=>new n().setFromSpherical(new i(e,Math.acos(1-Math.random()*2),Math.random()*2*Math.PI)),d=c.forwardRef(({radius:e=100,depth:t=50,count:n=5e3,saturation:i=0,factor:a=4,fade:s=!1,speed:d=1},f)=>{let p=c.useRef(null),[m,h,g]=c.useMemo(()=>{let o=[],s=[],c=Array.from({length:n},()=>(.5+.5*Math.random())*a),l=new r,d=e+t,f=t/n;for(let e=0;e<n;e++)d-=f*Math.random(),o.push(...u(d).toArray()),l.setHSL(e/n,i,.9),s.push(l.r,l.g,l.b);return[new Float32Array(o),new Float32Array(s),new Float32Array(c)]},[n,t,a,e,i]);o(e=>p.current&&(p.current.uniforms.time.value=e.clock.elapsedTime*d));let[_]=c.useState(()=>new l);return c.createElement(`points`,{ref:f},c.createElement(`bufferGeometry`,null,c.createElement(`bufferAttribute`,{attach:`attributes-position`,args:[m,3]}),c.createElement(`bufferAttribute`,{attach:`attributes-color`,args:[h,3]}),c.createElement(`bufferAttribute`,{attach:`attributes-size`,args:[g,1]})),c.createElement(`primitive`,{ref:p,object:_,attach:`material`,blending:2,"uniforms-fade-value":s,depthWrite:!1,transparent:!0,vertexColors:!0}))});export{d as t};