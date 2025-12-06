import{a as n,p as e,w as D,R as S}from"./chunk-FGUA77HG-BxeL2Wrr.js";import{e as L,b as g,_ as y,v as T,C as _}from"./constants-j8IvHXVs.js";import{s as G,E as F}from"./Environment-DqAx_Oog.js";import{E as A,V as d,j as V,g as P,J as O}from"./three.module-BciEV48b.js";import{O as I}from"./OrbitControls-197V_kms.js";const B=G({cellSize:.5,sectionSize:1,fadeDistance:100,fadeStrength:1,fadeFrom:1,cellThickness:.5,sectionThickness:1,cellColor:new P,sectionColor:new P,infiniteGrid:!1,followCamera:!1,worldCamProjPosition:new d,worldPlanePosition:new d},`
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform vec3 worldPlanePosition;
    uniform float fadeDistance;
    uniform bool infiniteGrid;
    uniform bool followCamera;

    void main() {
      localPosition = position.xzy;
      if (infiniteGrid) localPosition *= 1.0 + fadeDistance;
      
      worldPosition = modelMatrix * vec4(localPosition, 1.0);
      if (followCamera) {
        worldPosition.xyz += (worldCamProjPosition - worldPlanePosition);
        localPosition = (inverse(modelMatrix) * worldPosition).xyz;
      }

      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,`
    varying vec3 localPosition;
    varying vec4 worldPosition;

    uniform vec3 worldCamProjPosition;
    uniform float cellSize;
    uniform float sectionSize;
    uniform vec3 cellColor;
    uniform vec3 sectionColor;
    uniform float fadeDistance;
    uniform float fadeStrength;
    uniform float fadeFrom;
    uniform float cellThickness;
    uniform float sectionThickness;

    float getGrid(float size, float thickness) {
      vec2 r = localPosition.xz / size;
      vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
      float line = min(grid.x, grid.y) + 1.0 - thickness;
      return 1.0 - min(line, 1.0);
    }

    void main() {
      float g1 = getGrid(cellSize, cellThickness);
      float g2 = getGrid(sectionSize, sectionThickness);

      vec3 from = worldCamProjPosition*vec3(fadeFrom);
      float dist = distance(from, worldPosition.xyz);
      float d = 1.0 - min(dist / fadeDistance, 1.0);
      vec3 color = mix(cellColor, sectionColor, min(1.0, sectionThickness * g2));

      gl_FragColor = vec4(color, (g1 + g2) * pow(d, fadeStrength));
      gl_FragColor.a = mix(0.75 * gl_FragColor.a, gl_FragColor.a, g2);
      if (gl_FragColor.a <= 0.0) discard;

      #include <tonemapping_fragment>
      #include <${T>=154?"colorspace_fragment":"encodings_fragment"}>
    }
  `),$=n.forwardRef(({args:s,cellColor:r="#000000",sectionColor:t="#2080ff",cellSize:i=.5,sectionSize:c=1,followCamera:a=!1,infiniteGrid:o=!1,fadeDistance:f=100,fadeStrength:u=1,fadeFrom:m=1,cellThickness:x=.5,sectionThickness:h=1,side:v=V,...j},l)=>{L({GridMaterial:B});const p=n.useRef(null);n.useImperativeHandle(l,()=>p.current,[]);const w=new A,C=new d(0,1,0),k=new d(0,0,0);g(R=>{w.setFromNormalAndCoplanarPoint(C,k).applyMatrix4(p.current.matrixWorld);const b=p.current.material,z=b.uniforms.worldCamProjPosition,E=b.uniforms.worldPlanePosition;w.projectPoint(R.camera.position,z.value),E.value.set(0,0,0).applyMatrix4(p.current.matrixWorld)});const N={cellSize:i,sectionSize:c,cellColor:r,sectionColor:t,cellThickness:x,sectionThickness:h},M={fadeDistance:f,fadeStrength:u,fadeFrom:m,infiniteGrid:o,followCamera:a};return n.createElement("mesh",y({ref:p,frustumCulled:!1},j),n.createElement("gridMaterial",y({transparent:!0,"extensions-derivatives":!0,side:v},N,M)),n.createElement("planeGeometry",{args:s}))}),W=[[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],[23,25],[25,27],[24,26],[26,28],[0,11],[0,12]],q=(s,r,t)=>{s.lerp(r,t)},H=({start:s,end:r})=>{const t=n.useRef(null);return g(()=>{if(t.current){const i=s.distanceTo(r);if(i<.01){t.current.scale.set(0,0,0);return}t.current.position.lerpVectors(s,r,.5),t.current.lookAt(r),t.current.rotateX(Math.PI/2),t.current.scale.set(1,i,1)}}),e.jsxs("mesh",{ref:t,children:[e.jsx("cylinderGeometry",{args:[.06,.06,1,8]}),e.jsx("meshStandardMaterial",{color:"#00e5ff",emissive:"#0044aa",metalness:.8,roughness:.2})]})},J=({position:s})=>{const r=n.useRef(null);return g(()=>{r.current&&r.current.position.copy(s)}),e.jsxs("mesh",{ref:r,children:[e.jsx("sphereGeometry",{args:[.08,16,16]}),e.jsx("meshStandardMaterial",{color:"#ffffff",metalness:.5,roughness:.1})]})},K=({nose:s,leftEar:r,rightEar:t,mouthLeft:i,mouthRight:c})=>{const a=n.useRef(null);return g(()=>{if(a.current){a.current.position.copy(s),new d(0,0,1);const o=new d().subVectors(t,r).normalize(),f=new d(0,1,0),u=new O,m=new d().crossVectors(o,f).normalize(),x=new d().crossVectors(m,o).normalize();u.makeBasis(o,x,m)}}),e.jsxs("group",{ref:a,children:[e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[.25,32,32]}),e.jsx("meshStandardMaterial",{color:"#e0f2fe",transparent:!0,opacity:.9})]}),e.jsxs("mesh",{position:[-.1,.05,.2],children:[e.jsx("sphereGeometry",{args:[.04,16,16]}),e.jsx("meshBasicMaterial",{color:"black"})]}),e.jsxs("mesh",{position:[.1,.05,.2],children:[e.jsx("sphereGeometry",{args:[.04,16,16]}),e.jsx("meshBasicMaterial",{color:"black"})]})]})},U=({landmarks:s})=>{const r=n.useMemo(()=>Array.from({length:33},()=>new d),[]);return g(()=>{s.forEach((t,i)=>{if(i<33){const c=(.5-t.x)*3,a=(.5-t.y)*3+1,o=-t.z*2;q(r[i],new d(c,a,o),.3)}})}),s[0].visibility&&s[0].visibility<.5?null:e.jsxs("group",{children:[W.map(([t,i],c)=>e.jsx(H,{start:r[t],end:r[i]},`bone-${c}`)),[11,12,13,14,15,16,23,24,25,26,27,28].map(t=>e.jsx(J,{position:r[t]},`joint-${t}`)),e.jsx(K,{nose:r[0],leftEar:r[7],rightEar:r[8],mouthLeft:r[9],mouthRight:r[10]})]})},X=({poseResults:s})=>e.jsxs("div",{className:"w-full h-full bg-slate-900 relative",children:[e.jsxs(_,{shadows:!0,camera:{position:[0,1,5],fov:50},children:[e.jsx("fog",{attach:"fog",args:["#0f172a",5,20]}),e.jsx("ambientLight",{intensity:.5}),e.jsx("spotLight",{position:[10,10,10],angle:.15,penumbra:1,intensity:1,castShadow:!0}),e.jsx("pointLight",{position:[-10,-10,-10],intensity:.5}),s&&s.poseLandmarks&&e.jsx(U,{landmarks:s.poseLandmarks}),e.jsx($,{infiniteGrid:!0,fadeDistance:30,sectionColor:"#4f46e5",cellColor:"#0f172a"}),e.jsx(F,{preset:"city"}),e.jsx(I,{enablePan:!1,maxPolarAngle:Math.PI/1.5,enableDamping:!0,dampingFactor:.03})]}),!s&&e.jsx("div",{className:"absolute inset-0 flex items-center justify-center pointer-events-none",children:e.jsx("p",{className:"text-cyan-500 animate-pulse text-xl",children:"Waiting for Pose Data..."})})]}),Q=({onPoseDetected:s,isActive:r})=>{const t=n.useRef(null),[i,c]=n.useState(!0),a=n.useRef(0),o=n.useRef(null);return n.useEffect(()=>{if(!t.current)return;const f=t.current,u=window.Pose;if(!u){console.error("MediaPipe Pose library not loaded"),c(!1);return}const m=new u({locateFile:l=>`https://cdn.jsdelivr.net/npm/@mediapipe/pose/${l}`});m.setOptions({modelComplexity:1,smoothLandmarks:!0,enableSegmentation:!1,minDetectionConfidence:.5,minTrackingConfidence:.5}),m.onResults(l=>{c(!1),l.poseLandmarks&&s({poseLandmarks:l.poseLandmarks})}),o.current=m;let x=null,h=!1;const v=async()=>{if(!(!r||!f)){if(f.readyState>=2&&!h&&o.current){h=!0;try{await o.current.send({image:f})}catch(l){console.error("Pose processing error:",l)}finally{h=!1}}a.current=requestAnimationFrame(v)}};return r&&(async()=>{try{x=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640},height:{ideal:480},facingMode:"user"}}),t.current&&(t.current.srcObject=x,t.current.onloadedmetadata=()=>{t.current?.play().catch(l=>console.error("Play error:",l)),v()})}catch(l){console.error("Error accessing webcam:",l),c(!1)}})(),()=>{a.current&&cancelAnimationFrame(a.current),x&&x.getTracks().forEach(l=>l.stop()),o.current&&(o.current.close(),o.current=null)}},[r,s]),e.jsxs("div",{className:"absolute top-4 right-4 w-32 h-24 sm:w-48 sm:h-36 bg-black rounded-lg overflow-hidden border-2 border-cyan-500/50 shadow-lg z-50",children:[e.jsx("video",{ref:t,className:"w-full h-full object-cover transform -scale-x-100",playsInline:!0,muted:!0}),i&&r&&e.jsx("div",{className:"absolute inset-0 flex items-center justify-center bg-black/80 text-xs text-cyan-400",children:"Init Vision..."})]})},Y=()=>{const[s,r]=n.useState(null),t=S.useRef([]),i=n.useCallback(a=>{r(a),t.current=a.poseLandmarks},[]),c=n.useCallback(()=>{const a=Array.from({length:33},()=>({x:.5,y:.5,z:0,visibility:1})),o=(f,u,m)=>{a[f]={x:u,y:m,z:0,visibility:1}};o(0,.5,.1),o(7,.55,.1),o(8,.45,.1),o(9,.52,.15),o(10,.48,.15),o(11,.6,.25),o(12,.4,.25),o(13,.65,.45),o(14,.35,.45),o(15,.7,.6),o(16,.3,.6),o(23,.55,.55),o(24,.45,.55),o(25,.55,.75),o(26,.45,.75),o(27,.55,.95),o(28,.45,.95),r({poseLandmarks:a})},[]);return e.jsxs("div",{className:"relative w-full h-screen bg-black overflow-hidden font-sans",children:[e.jsx("div",{className:"absolute inset-0 z-0",children:e.jsx(X,{poseResults:s})}),e.jsx(Q,{isActive:!0,onPoseDetected:i}),e.jsxs("div",{className:"absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6",children:[e.jsxs("header",{className:"flex justify-between items-start pointer-events-auto",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600 tracking-tighter drop-shadow-sm",children:"MOTION CAPTURE"}),e.jsx("p",{className:"text-cyan-200/70 text-sm mt-1",children:"Real-time Pose to 3D Avatar"})]}),e.jsx("div",{className:"bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:`w-3 h-3 rounded-full ${s?"bg-green-500 animate-pulse":"bg-red-500"}`}),e.jsx("span",{className:"font-mono font-bold text-gray-300 text-sm",children:s?"TRACKING ACTIVE":"NO SKELETON DETECTED"})]})})]}),e.jsxs("footer",{className:"pointer-events-auto flex flex-col items-center gap-4 mb-4",children:[e.jsxs("button",{onClick:c,className:"px-6 py-2 bg-cyan-900/80 hover:bg-cyan-700/80 border border-cyan-500/50 rounded-lg text-cyan-100 font-semibold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 flex items-center gap-2",children:[e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"}),e.jsx("path",{d:"M3 3v9h9"})]}),"Reset Pose"]}),e.jsxs("div",{className:"bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10 max-w-xl text-center",children:[e.jsxs("p",{className:"text-gray-300 text-sm",children:["Stand back so the camera can see your full body. ",e.jsx("br",{}),"The 3D Robot will mimic your movements in real-time."]}),e.jsx("div",{className:"mt-2 text-xs text-cyan-500/60 font-mono",children:"Powered by MediaPipe Pose & React Three Fiber"})]})]})]})]})},se={fullscreen:!0};function ne(){return[{title:"3D Motion Capture"},{property:"og:title",content:"3D Motion Capture"},{name:"description",content:"3D Motion Capture - Real-time pose detection that mirrors your movements onto a 3D robot avatar."}]}const ae=D(Y);export{ae as default,se as handle,ne as meta};
