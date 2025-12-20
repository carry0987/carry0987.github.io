import{e as S,u as j,_ as t}from"./OrbitControls-DRK-Wmte.js";import{r as o}from"./chunk-JMJ3UQ3L-DTa-kQyz.js";import{s as T}from"./shaderMaterial-BL2Umirn.js";import{v as D}from"./constants-BCyxaF58.js";import{P as E,V as e,B as V,C as a}from"./three.module-DNtCYGiW.js";const b=T({cellSize:.5,sectionSize:1,fadeDistance:100,fadeStrength:1,fadeFrom:1,cellThickness:.5,sectionThickness:1,cellColor:new a,sectionColor:new a,infiniteGrid:!1,followCamera:!1,worldCamProjPosition:new e,worldPlanePosition:new e},`
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
      #include <${D>=154?"colorspace_fragment":"encodings_fragment"}>
    }
  `),I=o.forwardRef(({args:l,cellColor:s="#000000",sectionColor:c="#2080ff",cellSize:f=.5,sectionSize:m=1,followCamera:d=!1,infiniteGrid:P=!1,fadeDistance:u=100,fadeStrength:g=1,fadeFrom:w=1,cellThickness:v=.5,sectionThickness:p=1,side:C=V,...x},h)=>{S({GridMaterial:b});const i=o.useRef(null);o.useImperativeHandle(h,()=>i.current,[]);const r=new E,z=new e(0,1,0),y=new e(0,0,0);j(F=>{r.setFromNormalAndCoplanarPoint(z,y).applyMatrix4(i.current.matrixWorld);const n=i.current.material,G=n.uniforms.worldCamProjPosition,M=n.uniforms.worldPlanePosition;r.projectPoint(F.camera.position,G.value),M.value.set(0,0,0).applyMatrix4(i.current.matrixWorld)});const _={cellSize:f,sectionSize:m,cellColor:s,sectionColor:c,cellThickness:v,sectionThickness:p},k={fadeDistance:u,fadeStrength:g,fadeFrom:w,infiniteGrid:P,followCamera:d};return o.createElement("mesh",t({ref:i,frustumCulled:!1},x),o.createElement("gridMaterial",t({transparent:!0,"extensions-derivatives":!0,side:C},_,k)),o.createElement("planeGeometry",{args:l}))});export{I as G};
