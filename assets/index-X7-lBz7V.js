import{a as p,p as o,w as Q}from"./chunk-WWGJGFF6-B6u1Qf49.js";import{ax as J,V as b,au as D,av as T,at as Y,y as B,k as g,aw as tt,E as et,q as it,S as st,g as L,F as ot,P as nt,W as at,d as F,z as A,x as Z,e as k,I as rt,B as lt,a as H,A as ht,c as ct}from"./three.module-B-r4iD_n.js";const K={type:"change"},I={type:"start"},W={type:"end"},C=new tt,X=new et,ut=Math.cos(70*it.DEG2RAD),u=new b,d=2*Math.PI,l={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},z=1e-6;class dt extends J{constructor(t,e=null){super(t,e),this.state=l.NONE,this.target=new b,this.cursor=new b,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:D.ROTATE,MIDDLE:D.DOLLY,RIGHT:D.PAN},this.touches={ONE:T.ROTATE,TWO:T.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new b,this._lastQuaternion=new Y,this._lastTargetPosition=new b,this._quat=new Y().setFromUnitVectors(t.up,new b(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new B,this._sphericalDelta=new B,this._scale=1,this._panOffset=new b,this._rotateStart=new g,this._rotateEnd=new g,this._rotateDelta=new g,this._panStart=new g,this._panEnd=new g,this._panDelta=new g,this._dollyStart=new g,this._dollyEnd=new g,this._dollyDelta=new g,this._dollyDirection=new b,this._mouse=new g,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=mt.bind(this),this._onPointerDown=pt.bind(this),this._onPointerUp=ft.bind(this),this._onContextMenu=wt.bind(this),this._onMouseWheel=yt.bind(this),this._onKeyDown=vt.bind(this),this._onTouchStart=gt.bind(this),this._onTouchMove=bt.bind(this),this._onMouseDown=_t.bind(this),this._onMouseMove=xt.bind(this),this._interceptControlDown=Et.bind(this),this._interceptControlUp=Pt.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(K),this.update(),this.state=l.NONE}update(t=null){const e=this.object.position;u.copy(e).sub(this.target),u.applyQuaternion(this._quat),this._spherical.setFromVector3(u),this.autoRotate&&this.state===l.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let s=this.minAzimuthAngle,n=this.maxAzimuthAngle;isFinite(s)&&isFinite(n)&&(s<-Math.PI?s+=d:s>Math.PI&&(s-=d),n<-Math.PI?n+=d:n>Math.PI&&(n-=d),s<=n?this._spherical.theta=Math.max(s,Math.min(n,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(s+n)/2?Math.max(s,this._spherical.theta):Math.min(n,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let a=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const r=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),a=r!=this._spherical.radius}if(u.setFromSpherical(this._spherical),u.applyQuaternion(this._quatInverse),e.copy(this.target).add(u),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let r=null;if(this.object.isPerspectiveCamera){const h=u.length();r=this._clampDistance(h*this._scale);const x=h-r;this.object.position.addScaledVector(this._dollyDirection,x),this.object.updateMatrixWorld(),a=!!x}else if(this.object.isOrthographicCamera){const h=new b(this._mouse.x,this._mouse.y,0);h.unproject(this.object);const x=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),a=x!==this.object.zoom;const S=new b(this._mouse.x,this._mouse.y,0);S.unproject(this.object),this.object.position.sub(S).add(h),this.object.updateMatrixWorld(),r=u.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;r!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(r).add(this.object.position):(C.origin.copy(this.object.position),C.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(C.direction))<ut?this.object.lookAt(this.target):(X.setFromNormalAndCoplanarPoint(this.object.up,this.target),C.intersectPlane(X,this.target))))}else if(this.object.isOrthographicCamera){const r=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),r!==this.object.zoom&&(this.object.updateProjectionMatrix(),a=!0)}return this._scale=1,this._performCursorZoom=!1,a||this._lastPosition.distanceToSquared(this.object.position)>z||8*(1-this._lastQuaternion.dot(this.object.quaternion))>z||this._lastTargetPosition.distanceToSquared(this.target)>z?(this.dispatchEvent(K),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?d/60*this.autoRotateSpeed*t:d/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){u.setFromMatrixColumn(e,0),u.multiplyScalar(-t),this._panOffset.add(u)}_panUp(t,e){this.screenSpacePanning===!0?u.setFromMatrixColumn(e,1):(u.setFromMatrixColumn(e,0),u.crossVectors(this.object.up,u)),u.multiplyScalar(t),this._panOffset.add(u)}_pan(t,e){const s=this.domElement;if(this.object.isPerspectiveCamera){const n=this.object.position;u.copy(n).sub(this.target);let a=u.length();a*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*a/s.clientHeight,this.object.matrix),this._panUp(2*e*a/s.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/s.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/s.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const s=this.domElement.getBoundingClientRect(),n=t-s.left,a=e-s.top,r=s.width,h=s.height;this._mouse.x=n/r*2-1,this._mouse.y=-(a/h)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(d*this._rotateDelta.x/e.clientHeight),this._rotateUp(d*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(d*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-d*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(d*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-d*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),s=.5*(t.pageX+e.x),n=.5*(t.pageY+e.y);this._rotateStart.set(s,n)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),s=.5*(t.pageX+e.x),n=.5*(t.pageY+e.y);this._panStart.set(s,n)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),s=t.pageX-e.x,n=t.pageY-e.y,a=Math.sqrt(s*s+n*n);this._dollyStart.set(0,a)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const s=this._getSecondPointerPosition(t),n=.5*(t.pageX+s.x),a=.5*(t.pageY+s.y);this._rotateEnd.set(n,a)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(d*this._rotateDelta.x/e.clientHeight),this._rotateUp(d*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),s=.5*(t.pageX+e.x),n=.5*(t.pageY+e.y);this._panEnd.set(s,n)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),s=t.pageX-e.x,n=t.pageY-e.y,a=Math.sqrt(s*s+n*n);this._dollyEnd.set(0,a),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const r=(t.pageX+e.x)*.5,h=(t.pageY+e.y)*.5;this._updateZoomParameters(r,h)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new g,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,s={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:s.deltaY*=16;break;case 2:s.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(s.deltaY*=10),s}}function pt(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function mt(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function ft(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(W),this.state=l.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function _t(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case D.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=l.DOLLY;break;case D.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=l.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=l.ROTATE}break;case D.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=l.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=l.PAN}break;default:this.state=l.NONE}this.state!==l.NONE&&this.dispatchEvent(I)}function xt(i){switch(this.state){case l.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case l.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case l.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function yt(i){this.enabled===!1||this.enableZoom===!1||this.state!==l.NONE||(i.preventDefault(),this.dispatchEvent(I),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(W))}function vt(i){this.enabled!==!1&&this._handleKeyDown(i)}function gt(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case T.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=l.TOUCH_ROTATE;break;case T.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=l.TOUCH_PAN;break;default:this.state=l.NONE}break;case 2:switch(this.touches.TWO){case T.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=l.TOUCH_DOLLY_PAN;break;case T.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=l.TOUCH_DOLLY_ROTATE;break;default:this.state=l.NONE}break;default:this.state=l.NONE}this.state!==l.NONE&&this.dispatchEvent(I)}function bt(i){switch(this._trackPointer(i),this.state){case l.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case l.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case l.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case l.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=l.NONE}}function wt(i){this.enabled!==!1&&i.preventDefault()}function Et(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Pt(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var _=(i=>(i.TERRAIN="TERRAIN",i.SPHERE_BLOB="SPHERE_BLOB",i.PARTICLES="PARTICLES",i.PLASMA="PLASMA",i))(_||{});const j=`
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
`,St=({effectType:i,params:t})=>{const e=p.useRef(null),s=p.useRef(null),n=p.useRef(null),a=p.useRef(null),r=p.useRef(null),h=p.useRef(null),x=p.useRef(null),S=p.useRef(0),E=p.useRef(null);return p.useEffect(()=>{if(!e.current)return;const y=e.current.clientWidth,v=e.current.clientHeight,m=new st;m.background=new L(328965),m.fog=new ot(328965,.02);const f=new nt(60,y/v,.1,1e3);f.position.z=5;const c=new at({antialias:!0,alpha:!1});c.setSize(y,v),c.setPixelRatio(Math.min(window.devicePixelRatio,2)),e.current.innerHTML="",e.current.appendChild(c.domElement);const P=new dt(f,c.domElement);P.enableDamping=!0,P.dampingFactor=.05,P.enableZoom=!0,r.current=P,n.current=m,a.current=f,s.current=c;const M=()=>{if(!e.current||!a.current||!s.current)return;const N=e.current.clientWidth,w=e.current.clientHeight;a.current.aspect=N/w,a.current.updateProjectionMatrix(),s.current.setSize(N,w)};return window.addEventListener("resize",M),()=>{window.removeEventListener("resize",M),s.current&&e.current&&(e.current.contains(s.current.domElement)&&e.current.removeChild(s.current.domElement),s.current.dispose()),r.current&&r.current.dispose(),cancelAnimationFrame(S.current)}},[]),p.useEffect(()=>{if(!n.current)return;const y=n.current;h.current&&(y.remove(h.current),h.current.geometry.dispose(),Array.isArray(h.current.material)?h.current.material.forEach(m=>m.dispose()):h.current.material.dispose(),h.current=null),x.current&&(y.remove(x.current),x.current.geometry.dispose(),x.current.material.dispose(),x.current=null);const v={uTime:{value:0},uSpeed:{value:t.speed},uNoiseScale:{value:t.noiseScale},uDisplacement:{value:t.displacement},uColorA:{value:new L(t.colorA)},uColorB:{value:new L(t.colorB)}};if(E.current=v,i===_.TERRAIN){const m=new F(10,10,128,128);m.rotateX(-Math.PI/2);const f=new A({uniforms:v,vertexShader:`
          varying vec2 vUv;
          varying float vElevation;
          uniform float uTime;
          uniform float uSpeed;
          uniform float uNoiseScale;
          uniform float uDisplacement;
          
          ${j}

          void main() {
            vUv = uv;
            vec3 pos = position;
            float noiseVal = snoise(vec3(pos.x * uNoiseScale, pos.z * uNoiseScale, uTime * uSpeed));
            vElevation = noiseVal;
            pos.y += noiseVal * uDisplacement;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,fragmentShader:`
          varying vec2 vUv;
          varying float vElevation;
          uniform vec3 uColorA;
          uniform vec3 uColorB;

          void main() {
            float mixStrength = (vElevation + 1.0) * 0.5;
            vec3 color = mix(uColorA, uColorB, mixStrength);
            gl_FragColor = vec4(color, 1.0);
          }
        `,wireframe:t.wireframe,side:Z}),c=new k(m,f);y.add(c),h.current=c,a.current&&(a.current.position.set(0,3,4),a.current.lookAt(0,0,0))}else if(i===_.SPHERE_BLOB){const m=new rt(2,64),f=new A({uniforms:v,vertexShader:`
          varying vec2 vUv;
          varying float vNoise;
          varying vec3 vNormal;
          uniform float uTime;
          uniform float uSpeed;
          uniform float uNoiseScale;
          uniform float uDisplacement;
          
          ${j}

          void main() {
            vUv = uv;
            vNormal = normal;
            vec3 pos = position;
            float noiseVal = snoise(vec3(pos * uNoiseScale + uTime * uSpeed));
            vNoise = noiseVal;
            pos += normal * noiseVal * uDisplacement;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,fragmentShader:`
          varying float vNoise;
          varying vec3 vNormal;
          uniform vec3 uColorA;
          uniform vec3 uColorB;

          void main() {
            float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0));
            float mixStrength = (vNoise + 1.0) * 0.5;
            vec3 baseColor = mix(uColorA, uColorB, mixStrength);
            // Add some rim lighting effect
            vec3 finalColor = mix(baseColor, vec3(1.0), pow(1.0 - abs(intensity), 3.0) * 0.5);
            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,wireframe:t.wireframe}),c=new k(m,f);y.add(c),h.current=c,a.current&&(a.current.position.set(0,0,6),a.current.lookAt(0,0,0))}else if(i===_.PLASMA){const m=new F(8,8,32,32),f=new A({uniforms:v,vertexShader:`
           varying vec2 vUv;
           void main() {
             vUv = uv;
             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
           }
         `,fragmentShader:`
           varying vec2 vUv;
           uniform float uTime;
           uniform float uSpeed;
           uniform float uNoiseScale;
           uniform vec3 uColorA;
           uniform vec3 uColorB;
           
           ${j}

           void main() {
             float noise1 = snoise(vec3(vUv * uNoiseScale * 2.0, uTime * uSpeed));
             float noise2 = snoise(vec3(vUv * uNoiseScale * 5.0 + vec2(10.0), uTime * uSpeed * 0.5));
             float combined = (noise1 + noise2) * 0.5;
             
             // Create plasma rings
             float rings = sin(combined * 10.0 + uTime);
             vec3 color = mix(uColorA, uColorB, rings * 0.5 + 0.5);
             gl_FragColor = vec4(color, 1.0);
           }
         `,side:Z,wireframe:t.wireframe}),c=new k(m,f);y.add(c),h.current=c,a.current&&(a.current.position.set(0,0,5),a.current.lookAt(0,0,0))}else if(i===_.PARTICLES){const f=new lt,c=new Float32Array(2e4*3),P=new Float32Array(2e4);for(let w=0;w<2e4;w++){const U=Math.random()*Math.PI*2,R=Math.acos(Math.random()*2-1),O=3.5+(Math.random()-.5)*.5,q=O*Math.sin(R)*Math.cos(U),G=O*Math.sin(R)*Math.sin(U),$=O*Math.cos(R);c[w*3]=q,c[w*3+1]=G,c[w*3+2]=$,P[w]=Math.random()}f.setAttribute("position",new H(c,3)),f.setAttribute("aRandom",new H(P,1));const M=new A({uniforms:v,vertexShader:`
          varying float vNoise;
          attribute float aRandom;
          uniform float uTime;
          uniform float uSpeed;
          uniform float uNoiseScale;
          uniform float uDisplacement;
          
          ${j}

          void main() {
            vec3 pos = position;
            // Curl-ish noise movement
            float n1 = snoise(vec3(pos * uNoiseScale + uTime * uSpeed * 0.2));
            float n2 = snoise(vec3(pos * uNoiseScale + 100.0 + uTime * uSpeed * 0.2));
            float n3 = snoise(vec3(pos * uNoiseScale + 200.0 + uTime * uSpeed * 0.2));
            
            pos += vec3(n1, n2, n3) * uDisplacement * aRandom;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = (4.0 / -mvPosition.z);
            vNoise = n1;
          }
        `,fragmentShader:`
          varying float vNoise;
          uniform vec3 uColorA;
          uniform vec3 uColorB;

          void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;
            
            vec3 color = mix(uColorA, uColorB, vNoise * 0.5 + 0.5);
            gl_FragColor = vec4(color, 1.0 - dist * 2.0);
          }
        `,transparent:!0,blending:ht,depthWrite:!1}),N=new ct(f,M);y.add(N),x.current=N,a.current&&(a.current.position.set(0,0,8),a.current.lookAt(0,0,0))}r.current&&(r.current.target.set(0,0,0),r.current.update())},[i]),p.useEffect(()=>{if(!s.current||!n.current||!a.current)return;const y=()=>{S.current=requestAnimationFrame(y),r.current&&r.current.update(),E.current&&(E.current.uTime.value+=.01,E.current.uSpeed.value=t.speed,E.current.uNoiseScale.value=t.noiseScale,E.current.uDisplacement.value=t.displacement,E.current.uColorA.value.set(t.colorA),E.current.uColorB.value.set(t.colorB));const v=h.current||x.current;v&&(v.rotation.y+=.002),s.current.render(n.current,a.current)};return y(),()=>{cancelAnimationFrame(S.current)}},[t]),o.jsx("div",{ref:e,className:"absolute top-0 left-0 w-full h-full"})},Tt=({effectType:i,params:t,setEffectType:e,setParams:s})=>{const n=(r,h)=>{s({...t,[r]:h})},a=Object.values(_);return o.jsxs("div",{className:"absolute top-4 right-4 w-80 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6 text-white shadow-2xl overflow-y-auto max-h-[90vh] z-20",children:[o.jsxs("div",{className:"mb-6",children:[o.jsx("h1",{className:"text-xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1",children:"Noise Lab"}),o.jsx("p",{className:"text-xs text-gray-400",children:"Interactive Perlin Experiments"})]}),o.jsxs("div",{className:"mb-6",children:[o.jsx("label",{className:"block text-xs uppercase tracking-wider text-gray-500 mb-2 font-semibold",children:"Mode"}),o.jsx("div",{className:"grid grid-cols-2 gap-2",children:a.map(r=>o.jsx("button",{onClick:()=>e(r),className:`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${i===r?"bg-white/20 border-white/40 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]":"bg-transparent border-white/5 text-gray-400 hover:bg-white/5 hover:text-gray-200"}`,children:r.replace("_"," ")},r))})]}),o.jsxs("div",{className:"space-y-5",children:[o.jsxs("div",{children:[o.jsxs("div",{className:"flex justify-between mb-1",children:[o.jsx("label",{className:"text-xs text-gray-300",children:"Speed"}),o.jsx("span",{className:"text-xs text-gray-500",children:t.speed.toFixed(2)})]}),o.jsx("input",{type:"range",min:"0",max:"2",step:"0.01",value:t.speed,onChange:r=>n("speed",parseFloat(r.target.value)),className:"w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"})]}),o.jsxs("div",{children:[o.jsxs("div",{className:"flex justify-between mb-1",children:[o.jsx("label",{className:"text-xs text-gray-300",children:"Noise Scale"}),o.jsx("span",{className:"text-xs text-gray-500",children:t.noiseScale.toFixed(2)})]}),o.jsx("input",{type:"range",min:"0.1",max:"5.0",step:"0.1",value:t.noiseScale,onChange:r=>n("noiseScale",parseFloat(r.target.value)),className:"w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"})]}),o.jsxs("div",{children:[o.jsxs("div",{className:"flex justify-between mb-1",children:[o.jsx("label",{className:"text-xs text-gray-300",children:"Displacement / Intensity"}),o.jsx("span",{className:"text-xs text-gray-500",children:t.displacement.toFixed(2)})]}),o.jsx("input",{type:"range",min:"0",max:"3",step:"0.1",value:t.displacement,onChange:r=>n("displacement",parseFloat(r.target.value)),className:"w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"})]}),o.jsxs("div",{className:"grid grid-cols-2 gap-4 pt-2",children:[o.jsxs("div",{children:[o.jsx("label",{className:"block text-xs text-gray-300 mb-2",children:"Color A"}),o.jsxs("div",{className:"relative",children:[o.jsx("input",{type:"color",value:t.colorA,onChange:r=>n("colorA",r.target.value),className:"w-full h-8 rounded cursor-pointer opacity-0 absolute top-0 left-0"}),o.jsx("div",{className:"w-full h-8 rounded border border-white/20",style:{backgroundColor:t.colorA}})]})]}),o.jsxs("div",{children:[o.jsx("label",{className:"block text-xs text-gray-300 mb-2",children:"Color B"}),o.jsxs("div",{className:"relative",children:[o.jsx("input",{type:"color",value:t.colorB,onChange:r=>n("colorB",r.target.value),className:"w-full h-8 rounded cursor-pointer opacity-0 absolute top-0 left-0"}),o.jsx("div",{className:"w-full h-8 rounded border border-white/20",style:{backgroundColor:t.colorB}})]})]})]}),i!==_.PARTICLES&&o.jsxs("div",{className:"flex items-center justify-between pt-2",children:[o.jsx("label",{className:"text-xs text-gray-300",children:"Wireframe Mode"}),o.jsx("button",{onClick:()=>n("wireframe",!t.wireframe),className:`w-10 h-5 rounded-full relative transition-colors duration-300 ${t.wireframe?"bg-purple-600":"bg-gray-700"}`,children:o.jsx("div",{className:`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform duration-300 ${t.wireframe?"left-6":"left-1"}`})})]})]})]})},V={[_.TERRAIN]:{speed:.2,noiseScale:.8,displacement:1.5,colorA:"#0d1b2a",colorB:"#00ffcc",wireframe:!0},[_.SPHERE_BLOB]:{speed:.5,noiseScale:1.5,displacement:.8,colorA:"#ff0055",colorB:"#220033",wireframe:!1},[_.PARTICLES]:{speed:.1,noiseScale:.5,displacement:2,colorA:"#ffffff",colorB:"#4444ff",wireframe:!1},[_.PLASMA]:{speed:.3,noiseScale:1,displacement:1,colorA:"#1a0b2e",colorB:"#ff00ff",wireframe:!1}},Dt=()=>{const[i,t]=p.useState(_.TERRAIN),[e,s]=p.useState(V[_.TERRAIN]),n=a=>{t(a),s(V[a])};return o.jsxs("div",{className:"relative w-screen h-screen overflow-hidden font-sans bg-transparent",children:[o.jsx(St,{effectType:i,params:e}),o.jsx(Tt,{effectType:i,params:e,setEffectType:n,setParams:s}),o.jsxs("div",{className:"absolute bottom-6 left-6 pointer-events-none opacity-50 text-white mix-blend-difference z-10",children:[o.jsx("h2",{className:"text-4xl font-black tracking-tighter uppercase",children:i.replace("_"," ")}),o.jsx("p",{className:"text-sm tracking-widest mt-1",children:"PERLIN NOISE GENERATOR"})]})]})},At={fullscreen:!0};function Ct(){return[{title:"Perlin Noise | Carry"},{property:"og:title",content:"Perlin Noise"},{name:"description",content:"An interactive Perlin noise visualizer with terrain, sphere blob, particles, and plasma effects."}]}const jt=Q(Dt);export{jt as default,At as handle,Ct as meta};
