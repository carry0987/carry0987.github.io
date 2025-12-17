import{E as m,U as ut,T as ce,b as lt,a2 as T,a3 as R,t as w,ac as de,Z as I,ad as D,O as ct,n as H,ae as dt,af as he,_ as Ce,ag as W,ah as ht,ai as S,w as Y,G as Se,a as Pe,M as B,m as k,h as Fe,F as P,a5 as re,R as ie,z as Be,d as O,B as F,D as se,x as X,aj as ft,ak as ne,J as ee,al as E,S as ae,o as Re,s as Me,a7 as Ue,aa as Ge,p as pt,q as gt,a8 as mt,a9 as xt,ab as _t,am as yt,an as bt,ao as $,e as v,ap as vt}from"./index-jF4_gexC.js";import{F as Tt,S as K,c as j,a as wt,b as Ct,B as ze}from"./colorToUniform-GyJ8zeut.js";import"./chunk-WWGJGFF6-BuW-gJ52.js";import"./preload-helper-BXl3LOEh.js";import"./trophy-y9tdKf69.js";import"./createLucideIcon-Dcecqn9j.js";import"./arrow-right-Bjq9ITpj.js";import"./rotate-ccw-CbKczr2k.js";import"./sparkles-eto6oSff.js";import"./circle-alert-DPXuc6-c.js";class Ae{static init(e){Object.defineProperty(this,"resizeTo",{configurable:!0,set(t){globalThis.removeEventListener("resize",this.queueResize),this._resizeTo=t,t&&(globalThis.addEventListener("resize",this.queueResize),this.resize())},get(){return this._resizeTo}}),this.queueResize=()=>{this._resizeTo&&(this._cancelResize(),this._resizeId=requestAnimationFrame(()=>this.resize()))},this._cancelResize=()=>{this._resizeId&&(cancelAnimationFrame(this._resizeId),this._resizeId=null)},this.resize=()=>{if(!this._resizeTo)return;this._cancelResize();let t,r;if(this._resizeTo===globalThis.window)t=globalThis.innerWidth,r=globalThis.innerHeight;else{const{clientWidth:i,clientHeight:s}=this._resizeTo;t=i,r=s}this.renderer.resize(t,r),this.render()},this._resizeId=null,this._resizeTo=null,this.resizeTo=e.resizeTo||null}static destroy(){globalThis.removeEventListener("resize",this.queueResize),this._cancelResize(),this._cancelResize=null,this.queueResize=null,this.resizeTo=null,this.resize=null}}Ae.extension=m.Application;class ke{static init(e){e=Object.assign({autoStart:!0,sharedTicker:!1},e),Object.defineProperty(this,"ticker",{configurable:!0,set(t){this._ticker&&this._ticker.remove(this.render,this),this._ticker=t,t&&t.add(this.render,this,ut.LOW)},get(){return this._ticker}}),this.stop=()=>{this._ticker.stop()},this.start=()=>{this._ticker.start()},this._ticker=null,this.ticker=e.sharedTicker?ce.shared:new ce,e.autoStart&&this.start()}static destroy(){if(this._ticker){const e=this._ticker;this.ticker=null,e.destroy()}}}ke.extension=m.Application;class St extends lt{constructor(){super(...arguments),this.chars=Object.create(null),this.lineHeight=0,this.fontFamily="",this.fontMetrics={fontSize:0,ascent:0,descent:0},this.baseLineOffset=0,this.distanceField={type:"none",range:0},this.pages=[],this.applyFillAsTint=!0,this.baseMeasurementFontSize=100,this.baseRenderedFontSize=100}get font(){return T(R,"BitmapFont.font is deprecated, please use BitmapFont.fontFamily instead."),this.fontFamily}get pageTextures(){return T(R,"BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."),this.pages}get size(){return T(R,"BitmapFont.size is deprecated, please use BitmapFont.fontMetrics.fontSize instead."),this.fontMetrics.fontSize}get distanceFieldRange(){return T(R,"BitmapFont.distanceFieldRange is deprecated, please use BitmapFont.distanceField.range instead."),this.distanceField.range}get distanceFieldType(){return T(R,"BitmapFont.distanceFieldType is deprecated, please use BitmapFont.distanceField.type instead."),this.distanceField.type}destroy(e=!1){this.emit("destroy",this),this.removeAllListeners();for(const t in this.chars)this.chars[t].texture?.destroy();this.chars=null,e&&(this.pages.forEach(t=>t.texture.destroy(!0)),this.pages=null)}}const De=class Oe extends St{constructor(e){super(),this.resolution=1,this.pages=[],this._padding=0,this._measureCache=Object.create(null),this._currentChars=[],this._currentX=0,this._currentY=0,this._currentMaxCharHeight=0,this._currentPageIndex=-1,this._skipKerning=!1;const t={...Oe.defaultOptions,...e};this._textureSize=t.textureSize,this._mipmap=t.mipmap;const r=t.style.clone();t.overrideFill&&(r._fill.color=16777215,r._fill.alpha=1,r._fill.texture=w.WHITE,r._fill.fill=null),this.applyFillAsTint=t.overrideFill;const i=r.fontSize;r.fontSize=this.baseMeasurementFontSize;const s=de(r);t.overrideSize?r._stroke&&(r._stroke.width*=this.baseRenderedFontSize/i):r.fontSize=this.baseRenderedFontSize=i,this._style=r,this._skipKerning=t.skipKerning??!1,this.resolution=t.resolution??1,this._padding=t.padding??4,t.textureStyle&&(this._textureStyle=t.textureStyle instanceof I?t.textureStyle:new I(t.textureStyle)),this.fontMetrics=D.measureFont(s),this.lineHeight=r.lineHeight||this.fontMetrics.fontSize||r.fontSize}ensureCharacters(e){const t=D.graphemeSegmenter(e).filter(x=>!this._currentChars.includes(x)).filter((x,p,g)=>g.indexOf(x)===p);if(!t.length)return;this._currentChars=[...this._currentChars,...t];let r;this._currentPageIndex===-1?r=this._nextPage():r=this.pages[this._currentPageIndex];let{canvas:i,context:s}=r.canvasAndContext,n=r.texture.source;const a=this._style;let u=this._currentX,l=this._currentY,d=this._currentMaxCharHeight;const c=this.baseRenderedFontSize/this.baseMeasurementFontSize,h=this._padding*c;let f=!1;const y=i.width/this.resolution,_=i.height/this.resolution;for(let x=0;x<t.length;x++){const p=t[x],g=D.measureText(p,a,i,!1);g.lineHeight=g.height;const b=g.width*c,C=Math.ceil((a.fontStyle==="italic"?2:1)*b),U=g.height*c,M=C+h*2,G=U+h*2;if(f=!1,p!==`
`&&p!=="\r"&&p!=="	"&&p!==" "&&(f=!0,d=Math.ceil(Math.max(G,d))),u+M>y&&(l+=d,d=G,u=0,l+d>_)){n.update();const A=this._nextPage();i=A.canvasAndContext.canvas,s=A.canvasAndContext.context,n=A.texture.source,u=0,l=0,d=0}const z=b/c-(a.dropShadow?.distance??0)-(a._stroke?.width??0);if(this.chars[p]={id:p.codePointAt(0),xOffset:-this._padding,yOffset:-this._padding,xAdvance:z,kerning:{}},f){this._drawGlyph(s,g,u+h,l+h,c,a);const A=n.width*c,le=n.height*c,ot=new ct(u/A*n.width,l/le*n.height,M/A*n.width,G/le*n.height);this.chars[p].texture=new w({source:n,frame:ot}),u+=Math.ceil(M)}}n.update(),this._currentX=u,this._currentY=l,this._currentMaxCharHeight=d,this._skipKerning&&this._applyKerning(t,s)}get pageTextures(){return T(R,"BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."),this.pages}_applyKerning(e,t){const r=this._measureCache;for(let i=0;i<e.length;i++){const s=e[i];for(let n=0;n<this._currentChars.length;n++){const a=this._currentChars[n];let u=r[s];u||(u=r[s]=t.measureText(s).width);let l=r[a];l||(l=r[a]=t.measureText(a).width);let d=t.measureText(s+a).width,c=d-(u+l);c&&(this.chars[s].kerning[a]=c),d=t.measureText(s+a).width,c=d-(u+l),c&&(this.chars[a].kerning[s]=c)}}}_nextPage(){this._currentPageIndex++;const e=this.resolution,t=H.getOptimalCanvasAndContext(this._textureSize,this._textureSize,e);this._setupContext(t.context,this._style,e);const r=e*(this.baseRenderedFontSize/this.baseMeasurementFontSize),i=new w({source:new dt({resource:t.canvas,resolution:r,alphaMode:"premultiply-alpha-on-upload",autoGenerateMipmaps:this._mipmap})});this._textureStyle&&(i.source.style=this._textureStyle);const s={canvasAndContext:t,texture:i};return this.pages[this._currentPageIndex]=s,s}_setupContext(e,t,r){t.fontSize=this.baseRenderedFontSize,e.scale(r,r),e.font=de(t),t.fontSize=this.baseMeasurementFontSize,e.textBaseline=t.textBaseline;const i=t._stroke,s=i?.width??0;if(i&&(e.lineWidth=s,e.lineJoin=i.join,e.miterLimit=i.miterLimit,e.strokeStyle=he(i,e)),t._fill&&(e.fillStyle=he(t._fill,e)),t.dropShadow){const n=t.dropShadow,a=Ce.shared.setValue(n.color).toArray(),u=n.blur*r,l=n.distance*r;e.shadowColor=`rgba(${a[0]*255},${a[1]*255},${a[2]*255},${n.alpha})`,e.shadowBlur=u,e.shadowOffsetX=Math.cos(n.angle)*l,e.shadowOffsetY=Math.sin(n.angle)*l}else e.shadowColor="black",e.shadowBlur=0,e.shadowOffsetX=0,e.shadowOffsetY=0}_drawGlyph(e,t,r,i,s,n){const a=t.text,u=t.fontProperties,d=(n._stroke?.width??0)*s,c=r+d/2,h=i-d/2,f=u.descent*s,y=t.lineHeight*s;let _=!1;n.stroke&&d&&(_=!0,e.strokeText(a,c,h+y-f));const{shadowBlur:x,shadowOffsetX:p,shadowOffsetY:g}=e;n._fill&&(_&&(e.shadowBlur=0,e.shadowOffsetX=0,e.shadowOffsetY=0),e.fillText(a,c,h+y-f)),_&&(e.shadowBlur=x,e.shadowOffsetX=p,e.shadowOffsetY=g)}destroy(){super.destroy();for(let e=0;e<this.pages.length;e++){const{canvasAndContext:t,texture:r}=this.pages[e];H.returnCanvasAndContext(t),r.destroy(!0)}this.pages=null}};De.defaultOptions={textureSize:512,style:new W,mipmap:!0};let fe=De;function Ie(o,e,t,r){const i={width:0,height:0,offsetY:0,scale:e.fontSize/t.baseMeasurementFontSize,lines:[{width:0,charPositions:[],spaceWidth:0,spacesIndex:[],chars:[]}]};i.offsetY=t.baseLineOffset;let s=i.lines[0],n=null,a=!0;const u={width:0,start:0,index:0,positions:[],chars:[]},l=t.baseMeasurementFontSize/e.fontSize,d=e.letterSpacing*l,c=e.wordWrapWidth*l,h=e.lineHeight?e.lineHeight*l:t.lineHeight,f=e.wordWrap&&e.breakWords,y=p=>{const g=s.width;for(let b=0;b<u.index;b++){const C=p.positions[b];s.chars.push(p.chars[b]),s.charPositions.push(C+g)}s.width+=p.width,a=!1,u.width=0,u.index=0,u.chars.length=0},_=()=>{let p=s.chars.length-1;if(r){let g=s.chars[p];for(;g===" ";)s.width-=t.chars[g].xAdvance,g=s.chars[--p]}i.width=Math.max(i.width,s.width),s={width:0,charPositions:[],chars:[],spaceWidth:0,spacesIndex:[]},a=!0,i.lines.push(s),i.height+=h},x=p=>p-d>c;for(let p=0;p<o.length+1;p++){let g;const b=p===o.length;b||(g=o[p]);const C=t.chars[g]||t.chars[" "];if(/(?:\s)/.test(g)||g==="\r"||g===`
`||b){if(!a&&e.wordWrap&&x(s.width+u.width)?(_(),y(u),b||s.charPositions.push(0)):(u.start=s.width,y(u),b||s.charPositions.push(0)),g==="\r"||g===`
`)_();else if(!b){const z=C.xAdvance+(C.kerning[n]||0)+d;s.width+=z,s.spaceWidth=z,s.spacesIndex.push(s.charPositions.length),s.chars.push(g)}}else{const G=C.kerning[n]||0,z=C.xAdvance+G+d;f&&x(s.width+u.width+z)&&(y(u),_()),u.positions[u.index++]=u.width+G,u.chars.push(g),u.width+=z}n=g}return _(),e.align==="center"?Pt(i):e.align==="right"?Ft(i):e.align==="justify"&&Bt(i),i}function Pt(o){for(let e=0;e<o.lines.length;e++){const t=o.lines[e],r=o.width/2-t.width/2;for(let i=0;i<t.charPositions.length;i++)t.charPositions[i]+=r}}function Ft(o){for(let e=0;e<o.lines.length;e++){const t=o.lines[e],r=o.width-t.width;for(let i=0;i<t.charPositions.length;i++)t.charPositions[i]+=r}}function Bt(o){const e=o.width;for(let t=0;t<o.lines.length;t++){const r=o.lines[t];let i=0,s=r.spacesIndex[i++],n=0;const a=r.spacesIndex.length,l=(e-r.width)/a;for(let d=0;d<r.charPositions.length;d++)d===s&&(s=r.spacesIndex[i++],n+=l),r.charPositions[d]+=n}}function Rt(o){if(o==="")return[];typeof o=="string"&&(o=[o]);const e=[];for(let t=0,r=o.length;t<r;t++){const i=o[t];if(Array.isArray(i)){if(i.length!==2)throw new Error(`[BitmapFont]: Invalid character range length, expecting 2 got ${i.length}.`);if(i[0].length===0||i[1].length===0)throw new Error("[BitmapFont]: Invalid character delimiter.");const s=i[0].charCodeAt(0),n=i[1].charCodeAt(0);if(n<s)throw new Error("[BitmapFont]: Invalid character range.");for(let a=s,u=n;a<=u;a++)e.push(String.fromCharCode(a))}else e.push(...Array.from(i))}if(e.length===0)throw new Error("[BitmapFont]: Empty set when resolving characters.");return e}let V=0;class Mt{constructor(){this.ALPHA=[["a","z"],["A","Z"]," "],this.NUMERIC=[["0","9"]],this.ALPHANUMERIC=[["a","z"],["A","Z"],["0","9"]," "],this.ASCII=[[" ","~"]],this.defaultOptions={chars:this.ALPHANUMERIC,resolution:1,padding:4,skipKerning:!1,textureStyle:null},this.measureCache=ht(1e3)}getFont(e,t){let r=`${t.fontFamily}-bitmap`,i=!0;if(t._fill.fill&&!t._stroke?(r+=t._fill.fill.styleKey,i=!1):(t._stroke||t.dropShadow)&&(r=`${t.styleKey}-bitmap`,i=!1),!S.has(r)){const n=Object.create(t);n.lineHeight=0;const a=new fe({style:n,overrideFill:i,overrideSize:!0,...this.defaultOptions});V++,V>50&&Y("BitmapText",`You have dynamically created ${V} bitmap fonts, this can be inefficient. Try pre installing your font styles using \`BitmapFont.install({name:"style1", style})\``),a.once("destroy",()=>{V--,S.remove(r)}),S.set(r,a)}const s=S.get(r);return s.ensureCharacters?.(e),s}getLayout(e,t,r=!0){const i=this.getFont(e,t),s=`${e}-${t.styleKey}-${r}`;if(this.measureCache.has(s))return this.measureCache.get(s);const n=D.graphemeSegmenter(e),a=Ie(n,t,i,r);return this.measureCache.set(s,a),a}measureText(e,t,r=!0){return this.getLayout(e,t,r)}install(...e){let t=e[0];typeof t=="string"&&(t={name:t,style:e[1],chars:e[2]?.chars,resolution:e[2]?.resolution,padding:e[2]?.padding,skipKerning:e[2]?.skipKerning},T(R,"BitmapFontManager.install(name, style, options) is deprecated, use BitmapFontManager.install({name, style, ...options})"));const r=t?.name;if(!r)throw new Error("[BitmapFontManager] Property `name` is required.");t={...this.defaultOptions,...t};const i=t.style,s=i instanceof W?i:new W(i),n=t.dynamicFill??this._canUseTintForStyle(s),a=new fe({style:s,overrideFill:n,skipKerning:t.skipKerning,padding:t.padding,resolution:t.resolution,overrideSize:!1,textureStyle:t.textureStyle}),u=Rt(t.chars);return a.ensureCharacters(u.join("")),S.set(`${r}-bitmap`,a),a.once("destroy",()=>S.remove(`${r}-bitmap`)),a}uninstall(e){const t=`${e}-bitmap`,r=S.get(t);r&&r.destroy()}_canUseTintForStyle(e){return!e._stroke&&(!e.dropShadow||e.dropShadow.color===0)&&!e._fill.fill&&e._fill.color===16777215}}const Ut=new Mt;var Gt=`in vec2 aPosition;
out vec2 vTextureCoord;

uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

vec4 filterVertexPosition( void )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
    
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
`,zt=`in vec2 vTextureCoord;
out vec4 finalColor;
uniform sampler2D uTexture;
void main() {
    finalColor = texture(uTexture, vTextureCoord);
}
`,pe=`struct GlobalFilterUniforms {
  uInputSize: vec4<f32>,
  uInputPixel: vec4<f32>,
  uInputClamp: vec4<f32>,
  uOutputFrame: vec4<f32>,
  uGlobalFrame: vec4<f32>,
  uOutputTexture: vec4<f32>,
};

@group(0) @binding(0) var <uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler: sampler;

struct VSOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>
};

fn filterVertexPosition(aPosition: vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0 * gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord(aPosition: vec2<f32>) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

@vertex
fn mainVertex(
  @location(0) aPosition: vec2<f32>,
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition)
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
) -> @location(0) vec4<f32> {
    return textureSample(uTexture, uSampler, uv);
}
`;class At extends Tt{constructor(){const e=Se.from({vertex:{source:pe,entryPoint:"mainVertex"},fragment:{source:pe,entryPoint:"mainFragment"},name:"passthrough-filter"}),t=Pe.from({vertex:Gt,fragment:zt,name:"passthrough-filter"});super({gpuProgram:e,glProgram:t})}}class We{constructor(e){this._renderer=e}push(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",canBundle:!1,action:"pushFilter",container:t,filterEffect:e})}pop(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"filter",action:"popFilter",canBundle:!1})}execute(e){e.action==="pushFilter"?this._renderer.filter.push(e):e.action==="popFilter"&&this._renderer.filter.pop()}destroy(){this._renderer=null}}We.extension={type:[m.WebGLPipes,m.WebGPUPipes,m.CanvasPipes],name:"filter"};const ge=new B;function kt(o,e){e.clear();const t=e.matrix;for(let r=0;r<o.length;r++){const i=o[r];if(i.globalDisplayStatus<7)continue;const s=i.renderGroup??i.parentRenderGroup;s?.isCachedAsTexture?e.matrix=ge.copyFrom(s.textureOffsetInverseTransform).append(i.worldTransform):s?._parentCacheAsTextureRenderGroup?e.matrix=ge.copyFrom(s._parentCacheAsTextureRenderGroup.inverseWorldTransform).append(i.groupTransform):e.matrix=i.worldTransform,e.addBounds(i.bounds)}return e.matrix=t,e}const Dt=new re({attributes:{aPosition:{buffer:new Float32Array([0,0,1,0,1,1,0,1]),format:"float32x2",stride:8,offset:0}},indexBuffer:new Uint32Array([0,1,2,0,2,3])});class Ot{constructor(){this.skip=!1,this.inputTexture=null,this.backTexture=null,this.filters=null,this.bounds=new Be,this.container=null,this.blendRequired=!1,this.outputRenderSurface=null,this.globalFrame={x:0,y:0,width:0,height:0},this.firstEnabledIndex=-1,this.lastEnabledIndex=-1}}class Ee{constructor(e){this._filterStackIndex=0,this._filterStack=[],this._filterGlobalUniforms=new k({uInputSize:{value:new Float32Array(4),type:"vec4<f32>"},uInputPixel:{value:new Float32Array(4),type:"vec4<f32>"},uInputClamp:{value:new Float32Array(4),type:"vec4<f32>"},uOutputFrame:{value:new Float32Array(4),type:"vec4<f32>"},uGlobalFrame:{value:new Float32Array(4),type:"vec4<f32>"},uOutputTexture:{value:new Float32Array(4),type:"vec4<f32>"}}),this._globalFilterBindGroup=new Fe({}),this.renderer=e}get activeBackTexture(){return this._activeFilterData?.backTexture}push(e){const t=this.renderer,r=e.filterEffect.filters,i=this._pushFilterData();i.skip=!1,i.filters=r,i.container=e.container,i.outputRenderSurface=t.renderTarget.renderSurface;const s=t.renderTarget.renderTarget.colorTexture.source,n=s.resolution,a=s.antialias;if(r.every(f=>!f.enabled)){i.skip=!0;return}const u=i.bounds;if(this._calculateFilterArea(e,u),this._calculateFilterBounds(i,t.renderTarget.rootViewPort,a,n,1),i.skip)return;const l=this._getPreviousFilterData(),d=this._findFilterResolution(n);let c=0,h=0;l&&(c=l.bounds.minX,h=l.bounds.minY),this._calculateGlobalFrame(i,c,h,d,s.width,s.height),this._setupFilterTextures(i,u,t,l)}generateFilteredTexture({texture:e,filters:t}){const r=this._pushFilterData();this._activeFilterData=r,r.skip=!1,r.filters=t;const i=e.source,s=i.resolution,n=i.antialias;if(t.every(f=>!f.enabled))return r.skip=!0,e;const a=r.bounds;if(a.addRect(e.frame),this._calculateFilterBounds(r,a.rectangle,n,s,0),r.skip)return e;const u=s;this._calculateGlobalFrame(r,0,0,u,i.width,i.height),r.outputRenderSurface=P.getOptimalTexture(a.width,a.height,r.resolution,r.antialias),r.backTexture=w.EMPTY,r.inputTexture=e,this.renderer.renderTarget.finishRenderPass(),this._applyFiltersToTexture(r,!0);const h=r.outputRenderSurface;return h.source.alphaMode="premultiplied-alpha",h}pop(){const e=this.renderer,t=this._popFilterData();t.skip||(e.globalUniforms.pop(),e.renderTarget.finishRenderPass(),this._activeFilterData=t,this._applyFiltersToTexture(t,!1),t.blendRequired&&P.returnTexture(t.backTexture),P.returnTexture(t.inputTexture))}getBackTexture(e,t,r){const i=e.colorTexture.source._resolution,s=P.getOptimalTexture(t.width,t.height,i,!1);let n=t.minX,a=t.minY;r&&(n-=r.minX,a-=r.minY),n=Math.floor(n*i),a=Math.floor(a*i);const u=Math.ceil(t.width*i),l=Math.ceil(t.height*i);return this.renderer.renderTarget.copyToTexture(e,s,{x:n,y:a},{width:u,height:l},{x:0,y:0}),s}applyFilter(e,t,r,i){const s=this.renderer,n=this._activeFilterData,u=n.outputRenderSurface===r,l=s.renderTarget.rootRenderTarget.colorTexture.source._resolution,d=this._findFilterResolution(l);let c=0,h=0;if(u){const y=this._findPreviousFilterOffset();c=y.x,h=y.y}this._updateFilterUniforms(t,r,n,c,h,d,u,i);const f=e.enabled?e:this._getPassthroughFilter();this._setupBindGroupsAndRender(f,t,s)}calculateSpriteMatrix(e,t){const r=this._activeFilterData,i=e.set(r.inputTexture._source.width,0,0,r.inputTexture._source.height,r.bounds.minX,r.bounds.minY),s=t.worldTransform.copyTo(B.shared),n=t.renderGroup||t.parentRenderGroup;return n&&n.cacheToLocalTransform&&s.prepend(n.cacheToLocalTransform),s.invert(),i.prepend(s),i.scale(1/t.texture.orig.width,1/t.texture.orig.height),i.translate(t.anchor.x,t.anchor.y),i}destroy(){this._passthroughFilter?.destroy(!0),this._passthroughFilter=null}_getPassthroughFilter(){return this._passthroughFilter??(this._passthroughFilter=new At),this._passthroughFilter}_setupBindGroupsAndRender(e,t,r){if(r.renderPipes.uniformBatch){const i=r.renderPipes.uniformBatch.getUboResource(this._filterGlobalUniforms);this._globalFilterBindGroup.setResource(i,0)}else this._globalFilterBindGroup.setResource(this._filterGlobalUniforms,0);this._globalFilterBindGroup.setResource(t.source,1),this._globalFilterBindGroup.setResource(t.source.style,2),e.groups[0]=this._globalFilterBindGroup,r.encoder.draw({geometry:Dt,shader:e,state:e._state,topology:"triangle-list"}),r.type===ie.WEBGL&&r.renderTarget.finishRenderPass()}_setupFilterTextures(e,t,r,i){if(e.backTexture=w.EMPTY,e.inputTexture=P.getOptimalTexture(t.width,t.height,e.resolution,e.antialias),e.blendRequired){r.renderTarget.finishRenderPass();const s=r.renderTarget.getRenderTarget(e.outputRenderSurface);e.backTexture=this.getBackTexture(s,t,i?.bounds)}r.renderTarget.bind(e.inputTexture,!0),r.globalUniforms.push({offset:t})}_calculateGlobalFrame(e,t,r,i,s,n){const a=e.globalFrame;a.x=t*i,a.y=r*i,a.width=s*i,a.height=n*i}_updateFilterUniforms(e,t,r,i,s,n,a,u){const l=this._filterGlobalUniforms.uniforms,d=l.uOutputFrame,c=l.uInputSize,h=l.uInputPixel,f=l.uInputClamp,y=l.uGlobalFrame,_=l.uOutputTexture;a?(d[0]=r.bounds.minX-i,d[1]=r.bounds.minY-s):(d[0]=0,d[1]=0),d[2]=e.frame.width,d[3]=e.frame.height,c[0]=e.source.width,c[1]=e.source.height,c[2]=1/c[0],c[3]=1/c[1],h[0]=e.source.pixelWidth,h[1]=e.source.pixelHeight,h[2]=1/h[0],h[3]=1/h[1],f[0]=.5*h[2],f[1]=.5*h[3],f[2]=e.frame.width*c[2]-.5*h[2],f[3]=e.frame.height*c[3]-.5*h[3];const x=this.renderer.renderTarget.rootRenderTarget.colorTexture;y[0]=i*n,y[1]=s*n,y[2]=x.source.width*n,y[3]=x.source.height*n,t instanceof w&&(t.source.resource=null);const p=this.renderer.renderTarget.getRenderTarget(t);this.renderer.renderTarget.bind(t,!!u),t instanceof w?(_[0]=t.frame.width,_[1]=t.frame.height):(_[0]=p.width,_[1]=p.height),_[2]=p.isRoot?-1:1,this._filterGlobalUniforms.update()}_findFilterResolution(e){let t=this._filterStackIndex-1;for(;t>0&&this._filterStack[t].skip;)--t;return t>0&&this._filterStack[t].inputTexture?this._filterStack[t].inputTexture.source._resolution:e}_findPreviousFilterOffset(){let e=0,t=0,r=this._filterStackIndex;for(;r>0;){r--;const i=this._filterStack[r];if(!i.skip){e=i.bounds.minX,t=i.bounds.minY;break}}return{x:e,y:t}}_calculateFilterArea(e,t){if(e.renderables?kt(e.renderables,t):e.filterEffect.filterArea?(t.clear(),t.addRect(e.filterEffect.filterArea),t.applyMatrix(e.container.worldTransform)):e.container.getFastGlobalBounds(!0,t),e.container){const i=(e.container.renderGroup||e.container.parentRenderGroup).cacheToLocalTransform;i&&t.applyMatrix(i)}}_applyFiltersToTexture(e,t){const r=e.inputTexture,i=e.bounds,s=e.filters,n=e.firstEnabledIndex,a=e.lastEnabledIndex;if(this._globalFilterBindGroup.setResource(r.source.style,2),this._globalFilterBindGroup.setResource(e.backTexture.source,3),n===a)s[n].apply(this,r,e.outputRenderSurface,t);else{let u=e.inputTexture;const l=P.getOptimalTexture(i.width,i.height,u.source._resolution,!1);let d=l;for(let c=n;c<a;c++){const h=s[c];if(!h.enabled)continue;h.apply(this,u,d,!0);const f=u;u=d,d=f}s[a].apply(this,u,e.outputRenderSurface,t),P.returnTexture(l)}}_calculateFilterBounds(e,t,r,i,s){const n=this.renderer,a=e.bounds,u=e.filters;let l=1/0,d=0,c=!0,h=!1,f=!1,y=!0,_=-1,x=-1;for(let p=0;p<u.length;p++){const g=u[p];if(!g.enabled)continue;if(_===-1&&(_=p),x=p,l=Math.min(l,g.resolution==="inherit"?i:g.resolution),d+=g.padding,g.antialias==="off"?c=!1:g.antialias==="inherit"&&c&&(c=r),g.clipToViewport||(y=!1),!!!(g.compatibleRenderers&n.type)){f=!1;break}if(g.blendRequired&&!(n.backBuffer?.useBackBuffer??!0)){Y("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."),f=!1;break}f=!0,h||(h=g.blendRequired)}if(!f){e.skip=!0;return}if(y&&a.fitBounds(0,t.width/i,0,t.height/i),a.scale(l).ceil().scale(1/l).pad((d|0)*s),!a.isPositive){e.skip=!0;return}e.antialias=c,e.resolution=l,e.blendRequired=h,e.firstEnabledIndex=_,e.lastEnabledIndex=x}_popFilterData(){return this._filterStackIndex--,this._filterStack[this._filterStackIndex]}_getPreviousFilterData(){let e,t=this._filterStackIndex-1;for(;t>0&&(t--,e=this._filterStack[t],!!e.skip););return e}_pushFilterData(){let e=this._filterStack[this._filterStackIndex];return e||(e=this._filterStack[this._filterStackIndex]=new Ot),this._filterStackIndex++,e}}Ee.extension={type:[m.WebGLSystem,m.WebGPUSystem],name:"filter"};const Ve=class Le extends re{constructor(...e){let t=e[0]??{};t instanceof Float32Array&&(T(R,"use new MeshGeometry({ positions, uvs, indices }) instead"),t={positions:t,uvs:e[1],indices:e[2]}),t={...Le.defaultOptions,...t};const r=t.positions||new Float32Array([0,0,1,0,1,1,0,1]);let i=t.uvs;i||(t.positions?i=new Float32Array(r.length):i=new Float32Array([0,0,1,0,1,1,0,1]));const s=t.indices||new Uint32Array([0,1,2,0,2,3]),n=t.shrinkBuffersToFit,a=new O({data:r,label:"attribute-mesh-positions",shrinkToFit:n,usage:F.VERTEX|F.COPY_DST}),u=new O({data:i,label:"attribute-mesh-uvs",shrinkToFit:n,usage:F.VERTEX|F.COPY_DST}),l=new O({data:s,label:"index-mesh-buffer",shrinkToFit:n,usage:F.INDEX|F.COPY_DST});super({attributes:{aPosition:{buffer:a,format:"float32x2",stride:8,offset:0},aUV:{buffer:u,format:"float32x2",stride:8,offset:0}},indexBuffer:l,topology:t.topology}),this.batchMode="auto"}get positions(){return this.attributes.aPosition.buffer.data}set positions(e){this.attributes.aPosition.buffer.data=e}get uvs(){return this.attributes.aUV.buffer.data}set uvs(e){this.attributes.aUV.buffer.data=e}get indices(){return this.indexBuffer.data}set indices(e){this.indexBuffer.data=e}};Ve.defaultOptions={topology:"triangle-list",shrinkBuffersToFit:!1};let oe=Ve;const me="http://www.w3.org/2000/svg",xe="http://www.w3.org/1999/xhtml";class He{constructor(){this.svgRoot=document.createElementNS(me,"svg"),this.foreignObject=document.createElementNS(me,"foreignObject"),this.domElement=document.createElementNS(xe,"div"),this.styleElement=document.createElementNS(xe,"style");const{foreignObject:e,svgRoot:t,styleElement:r,domElement:i}=this;e.setAttribute("width","10000"),e.setAttribute("height","10000"),e.style.overflow="hidden",t.appendChild(e),e.appendChild(r),e.appendChild(i),this.image=se.get().createImage()}destroy(){this.svgRoot.remove(),this.foreignObject.remove(),this.styleElement.remove(),this.domElement.remove(),this.image.src="",this.image.remove(),this.svgRoot=null,this.foreignObject=null,this.styleElement=null,this.domElement=null,this.image=null,this.canvasAndContext=null}}let _e;function It(o,e,t,r){r||(r=_e||(_e=new He));const{domElement:i,styleElement:s,svgRoot:n}=r;i.innerHTML=`<style>${e.cssStyle};</style><div style='padding:0'>${o}</div>`,i.setAttribute("style","transform-origin: top left; display: inline-block"),t&&(s.textContent=t),document.body.appendChild(n);const a=i.getBoundingClientRect();n.remove();const u=e.padding*2;return{width:a.width-u,height:a.height-u}}class Wt{constructor(){this.batches=[],this.batched=!1}destroy(){this.batches.forEach(e=>{X.return(e)}),this.batches.length=0}}class Ye{constructor(e,t){this.state=K.for2d(),this.renderer=e,this._adaptor=t,this.renderer.runners.contextChange.add(this)}contextChange(){this._adaptor.contextChange(this.renderer)}validateRenderable(e){const t=e.context,r=!!e._gpuData,i=this.renderer.graphicsContext.updateGpuContext(t);return!!(i.isBatchable||r!==i.isBatchable)}addRenderable(e,t){const r=this.renderer.graphicsContext.updateGpuContext(e.context);e.didViewUpdate&&this._rebuild(e),r.isBatchable?this._addToBatcher(e,t):(this.renderer.renderPipes.batch.break(t),t.add(e))}updateRenderable(e){const r=this._getGpuDataForRenderable(e).batches;for(let i=0;i<r.length;i++){const s=r[i];s._batcher.updateElement(s)}}execute(e){if(!e.isRenderable)return;const t=this.renderer,r=e.context;if(!t.graphicsContext.getGpuContext(r).batches.length)return;const s=r.customShader||this._adaptor.shader;this.state.blendMode=e.groupBlendMode;const n=s.resources.localUniforms.uniforms;n.uTransformMatrix=e.groupTransform,n.uRound=t._roundPixels|e._roundPixels,j(e.groupColorAlpha,n.uColor,0),this._adaptor.execute(this,e)}_rebuild(e){const t=this._getGpuDataForRenderable(e),r=this.renderer.graphicsContext.updateGpuContext(e.context);t.destroy(),r.isBatchable&&this._updateBatchesForRenderable(e,t)}_addToBatcher(e,t){const r=this.renderer.renderPipes.batch,i=this._getGpuDataForRenderable(e).batches;for(let s=0;s<i.length;s++){const n=i[s];r.addToBatch(n,t)}}_getGpuDataForRenderable(e){return e._gpuData[this.renderer.uid]||this._initGpuDataForRenderable(e)}_initGpuDataForRenderable(e){const t=new Wt;return e._gpuData[this.renderer.uid]=t,t}_updateBatchesForRenderable(e,t){const r=e.context,i=this.renderer.graphicsContext.getGpuContext(r),s=this.renderer._roundPixels|e._roundPixels;t.batches=i.batches.map(n=>{const a=X.get(ft);return n.copyTo(a),a.renderable=e,a.roundPixels=s,a})}destroy(){this.renderer=null,this._adaptor.destroy(),this._adaptor=null,this.state=null}}Ye.extension={type:[m.WebGLPipes,m.WebGPUPipes,m.CanvasPipes],name:"graphics"};const Xe=class Ke extends oe{constructor(...e){super({});let t=e[0]??{};typeof t=="number"&&(T(R,"PlaneGeometry constructor changed please use { width, height, verticesX, verticesY } instead"),t={width:t,height:e[1],verticesX:e[2],verticesY:e[3]}),this.build(t)}build(e){e={...Ke.defaultOptions,...e},this.verticesX=this.verticesX??e.verticesX,this.verticesY=this.verticesY??e.verticesY,this.width=this.width??e.width,this.height=this.height??e.height;const t=this.verticesX*this.verticesY,r=[],i=[],s=[],n=this.verticesX-1,a=this.verticesY-1,u=this.width/n,l=this.height/a;for(let c=0;c<t;c++){const h=c%this.verticesX,f=c/this.verticesX|0;r.push(h*u,f*l),i.push(h/n,f/a)}const d=n*a;for(let c=0;c<d;c++){const h=c%n,f=c/n|0,y=f*this.verticesX+h,_=f*this.verticesX+h+1,x=(f+1)*this.verticesX+h,p=(f+1)*this.verticesX+h+1;s.push(y,_,x,_,p,x)}this.buffers[0].data=new Float32Array(r),this.buffers[1].data=new Float32Array(i),this.indexBuffer.data=new Uint32Array(s),this.buffers[0].update(),this.buffers[1].update(),this.indexBuffer.update()}};Xe.defaultOptions={width:100,height:100,verticesX:10,verticesY:10};let Et=Xe;class ue{constructor(){this.batcherName="default",this.packAsQuad=!1,this.indexOffset=0,this.attributeOffset=0,this.roundPixels=0,this._batcher=null,this._batch=null,this._textureMatrixUpdateId=-1,this._uvUpdateId=-1}get blendMode(){return this.renderable.groupBlendMode}get topology(){return this._topology||this.geometry.topology}set topology(e){this._topology=e}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.geometry=null,this._uvUpdateId=-1,this._textureMatrixUpdateId=-1}setTexture(e){this.texture!==e&&(this.texture=e,this._textureMatrixUpdateId=-1)}get uvs(){const t=this.geometry.getBuffer("aUV"),r=t.data;let i=r;const s=this.texture.textureMatrix;return s.isSimple||(i=this._transformedUvs,(this._textureMatrixUpdateId!==s._updateID||this._uvUpdateId!==t._updateID)&&((!i||i.length<r.length)&&(i=this._transformedUvs=new Float32Array(r.length)),this._textureMatrixUpdateId=s._updateID,this._uvUpdateId=t._updateID,s.multiplyUvs(r,i))),i}get positions(){return this.geometry.positions}get indices(){return this.geometry.indices}get color(){return this.renderable.groupColorAlpha}get groupTransform(){return this.renderable.groupTransform}get attributeSize(){return this.geometry.positions.length/2}get indexSize(){return this.geometry.indices.length}}class ye{destroy(){}}class je{constructor(e,t){this.localUniforms=new k({uTransformMatrix:{value:new B,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),this.localUniformsBindGroup=new Fe({0:this.localUniforms}),this.renderer=e,this._adaptor=t,this._adaptor.init()}validateRenderable(e){const t=this._getMeshData(e),r=t.batched,i=e.batched;if(t.batched=i,r!==i)return!0;if(i){const s=e._geometry;if(s.indices.length!==t.indexSize||s.positions.length!==t.vertexSize)return t.indexSize=s.indices.length,t.vertexSize=s.positions.length,!0;const n=this._getBatchableMesh(e);return n.texture.uid!==e._texture.uid&&(n._textureMatrixUpdateId=-1),!n._batcher.checkAndUpdateTexture(n,e._texture)}return!1}addRenderable(e,t){const r=this.renderer.renderPipes.batch,i=this._getMeshData(e);if(e.didViewUpdate&&(i.indexSize=e._geometry.indices?.length,i.vertexSize=e._geometry.positions?.length),i.batched){const s=this._getBatchableMesh(e);s.setTexture(e._texture),s.geometry=e._geometry,r.addToBatch(s,t)}else r.break(t),t.add(e)}updateRenderable(e){if(e.batched){const t=this._getBatchableMesh(e);t.setTexture(e._texture),t.geometry=e._geometry,t._batcher.updateElement(t)}}execute(e){if(!e.isRenderable)return;e.state.blendMode=ne(e.groupBlendMode,e.texture._source);const t=this.localUniforms;t.uniforms.uTransformMatrix=e.groupTransform,t.uniforms.uRound=this.renderer._roundPixels|e._roundPixels,t.update(),j(e.groupColorAlpha,t.uniforms.uColor,0),this._adaptor.execute(this,e)}_getMeshData(e){var t,r;return(t=e._gpuData)[r=this.renderer.uid]||(t[r]=new ye),e._gpuData[this.renderer.uid].meshData||this._initMeshData(e)}_initMeshData(e){return e._gpuData[this.renderer.uid].meshData={batched:e.batched,indexSize:0,vertexSize:0},e._gpuData[this.renderer.uid].meshData}_getBatchableMesh(e){var t,r;return(t=e._gpuData)[r=this.renderer.uid]||(t[r]=new ye),e._gpuData[this.renderer.uid].batchableMesh||this._initBatchableMesh(e)}_initBatchableMesh(e){const t=new ue;return t.renderable=e,t.setTexture(e._texture),t.transform=e.groupTransform,t.roundPixels=this.renderer._roundPixels|e._roundPixels,e._gpuData[this.renderer.uid].batchableMesh=t,t}destroy(){this.localUniforms=null,this.localUniformsBindGroup=null,this._adaptor.destroy(),this._adaptor=null,this.renderer=null}}je.extension={type:[m.WebGLPipes,m.WebGPUPipes,m.CanvasPipes],name:"mesh"};class Vt{execute(e,t){const r=e.state,i=e.renderer,s=t.shader||e.defaultShader;s.resources.uTexture=t.texture._source,s.resources.uniforms=e.localUniforms;const n=i.gl,a=e.getBuffers(t);i.shader.bind(s),i.state.set(r),i.geometry.bind(a.geometry,s.glProgram);const l=a.geometry.indexBuffer.data.BYTES_PER_ELEMENT===2?n.UNSIGNED_SHORT:n.UNSIGNED_INT;n.drawElements(n.TRIANGLES,t.particleChildren.length*6,l,0)}}class Lt{execute(e,t){const r=e.renderer,i=t.shader||e.defaultShader;i.groups[0]=r.renderPipes.uniformBatch.getUniformBindGroup(e.localUniforms,!0),i.groups[1]=r.texture.getTextureBindGroup(t.texture);const s=e.state,n=e.getBuffers(t);r.encoder.draw({geometry:n.geometry,shader:t.shader||e.defaultShader,state:s,size:t.particleChildren.length*6})}}function be(o,e=null){const t=o*6;if(t>65535?e||(e=new Uint32Array(t)):e||(e=new Uint16Array(t)),e.length!==t)throw new Error(`Out buffer length is incorrect, got ${e.length} and expected ${t}`);for(let r=0,i=0;r<t;r+=6,i+=4)e[r+0]=i+0,e[r+1]=i+1,e[r+2]=i+2,e[r+3]=i+0,e[r+4]=i+2,e[r+5]=i+3;return e}function Ht(o){return{dynamicUpdate:ve(o,!0),staticUpdate:ve(o,!1)}}function ve(o,e){const t=[];t.push(`

        var index = 0;

        for (let i = 0; i < ps.length; ++i)
        {
            const p = ps[i];

            `);let r=0;for(const s in o){const n=o[s];if(e!==n.dynamic)continue;t.push(`offset = index + ${r}`),t.push(n.code);const a=ee(n.format);r+=a.stride/4}t.push(`
            index += stride * 4;
        }
    `),t.unshift(`
        var stride = ${r};
    `);const i=t.join(`
`);return new Function("ps","f32v","u32v",i)}class Yt{constructor(e){this._size=0,this._generateParticleUpdateCache={};const t=this._size=e.size??1e3,r=e.properties;let i=0,s=0;for(const d in r){const c=r[d],h=ee(c.format);c.dynamic?s+=h.stride:i+=h.stride}this._dynamicStride=s/4,this._staticStride=i/4,this.staticAttributeBuffer=new E(t*4*i),this.dynamicAttributeBuffer=new E(t*4*s),this.indexBuffer=be(t);const n=new re;let a=0,u=0;this._staticBuffer=new O({data:new Float32Array(1),label:"static-particle-buffer",shrinkToFit:!1,usage:F.VERTEX|F.COPY_DST}),this._dynamicBuffer=new O({data:new Float32Array(1),label:"dynamic-particle-buffer",shrinkToFit:!1,usage:F.VERTEX|F.COPY_DST});for(const d in r){const c=r[d],h=ee(c.format);c.dynamic?(n.addAttribute(c.attributeName,{buffer:this._dynamicBuffer,stride:this._dynamicStride*4,offset:a*4,format:c.format}),a+=h.size):(n.addAttribute(c.attributeName,{buffer:this._staticBuffer,stride:this._staticStride*4,offset:u*4,format:c.format}),u+=h.size)}n.addIndex(this.indexBuffer);const l=this.getParticleUpdate(r);this._dynamicUpload=l.dynamicUpdate,this._staticUpload=l.staticUpdate,this.geometry=n}getParticleUpdate(e){const t=Xt(e);return this._generateParticleUpdateCache[t]?this._generateParticleUpdateCache[t]:(this._generateParticleUpdateCache[t]=this.generateParticleUpdate(e),this._generateParticleUpdateCache[t])}generateParticleUpdate(e){return Ht(e)}update(e,t){e.length>this._size&&(t=!0,this._size=Math.max(e.length,this._size*1.5|0),this.staticAttributeBuffer=new E(this._size*this._staticStride*4*4),this.dynamicAttributeBuffer=new E(this._size*this._dynamicStride*4*4),this.indexBuffer=be(this._size),this.geometry.indexBuffer.setDataWithSize(this.indexBuffer,this.indexBuffer.byteLength,!0));const r=this.dynamicAttributeBuffer;if(this._dynamicUpload(e,r.float32View,r.uint32View),this._dynamicBuffer.setDataWithSize(this.dynamicAttributeBuffer.float32View,e.length*this._dynamicStride*4,!0),t){const i=this.staticAttributeBuffer;this._staticUpload(e,i.float32View,i.uint32View),this._staticBuffer.setDataWithSize(i.float32View,e.length*this._staticStride*4,!0)}}destroy(){this._staticBuffer.destroy(),this._dynamicBuffer.destroy(),this.geometry.destroy()}}function Xt(o){const e=[];for(const t in o){const r=o[t];e.push(t,r.code,r.dynamic?"d":"s")}return e.join("_")}var Kt=`varying vec2 vUV;
varying vec4 vColor;

uniform sampler2D uTexture;

void main(void){
    vec4 color = texture2D(uTexture, vUV) * vColor;
    gl_FragColor = color;
}`,jt=`attribute vec2 aVertex;
attribute vec2 aUV;
attribute vec4 aColor;

attribute vec2 aPosition;
attribute float aRotation;

uniform mat3 uTranslationMatrix;
uniform float uRound;
uniform vec2 uResolution;
uniform vec4 uColor;

varying vec2 vUV;
varying vec4 vColor;

vec2 roundPixels(vec2 position, vec2 targetSize)
{       
    return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
}

void main(void){
    float cosRotation = cos(aRotation);
    float sinRotation = sin(aRotation);
    float x = aVertex.x * cosRotation - aVertex.y * sinRotation;
    float y = aVertex.x * sinRotation + aVertex.y * cosRotation;

    vec2 v = vec2(x, y);
    v = v + aPosition;

    gl_Position = vec4((uTranslationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    if(uRound == 1.0)
    {
        gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
    }

    vUV = aUV;
    vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uColor;
}
`,Te=`
struct ParticleUniforms {
  uTranslationMatrix:mat3x3<f32>,
  uColor:vec4<f32>,
  uRound:f32,
  uResolution:vec2<f32>,
};

fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32>
{
  return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
}

@group(0) @binding(0) var<uniform> uniforms: ParticleUniforms;

@group(1) @binding(0) var uTexture: texture_2d<f32>;
@group(1) @binding(1) var uSampler : sampler;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) color : vec4<f32>,
  };
@vertex
fn mainVertex(
  @location(0) aVertex: vec2<f32>,
  @location(1) aPosition: vec2<f32>,
  @location(2) aUV: vec2<f32>,
  @location(3) aColor: vec4<f32>,
  @location(4) aRotation: f32,
) -> VSOutput {
  
   let v = vec2(
       aVertex.x * cos(aRotation) - aVertex.y * sin(aRotation),
       aVertex.x * sin(aRotation) + aVertex.y * cos(aRotation)
   ) + aPosition;

   var position = vec4((uniforms.uTranslationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

   if(uniforms.uRound == 1.0) {
       position = vec4(roundPixels(position.xy, uniforms.uResolution), position.zw);
   }

    let vColor = vec4(aColor.rgb * aColor.a, aColor.a) * uniforms.uColor;

  return VSOutput(
   position,
   aUV,
   vColor,
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) color: vec4<f32>,
  @builtin(position) position: vec4<f32>,
) -> @location(0) vec4<f32> {

    var sample = textureSample(uTexture, uSampler, uv) * color;
   
    return sample;
}`;class $t extends ae{constructor(){const e=Pe.from({vertex:jt,fragment:Kt}),t=Se.from({fragment:{source:Te,entryPoint:"mainFragment"},vertex:{source:Te,entryPoint:"mainVertex"}});super({glProgram:e,gpuProgram:t,resources:{uTexture:w.WHITE.source,uSampler:new I({}),uniforms:{uTranslationMatrix:{value:new B,type:"mat3x3<f32>"},uColor:{value:new Ce(16777215),type:"vec4<f32>"},uRound:{value:1,type:"f32"},uResolution:{value:[0,0],type:"vec2<f32>"}}}})}}class $e{constructor(e,t){this.state=K.for2d(),this.localUniforms=new k({uTranslationMatrix:{value:new B,type:"mat3x3<f32>"},uColor:{value:new Float32Array(4),type:"vec4<f32>"},uRound:{value:1,type:"f32"},uResolution:{value:[0,0],type:"vec2<f32>"}}),this.renderer=e,this.adaptor=t,this.defaultShader=new $t,this.state=K.for2d()}validateRenderable(e){return!1}addRenderable(e,t){this.renderer.renderPipes.batch.break(t),t.add(e)}getBuffers(e){return e._gpuData[this.renderer.uid]||this._initBuffer(e)}_initBuffer(e){return e._gpuData[this.renderer.uid]=new Yt({size:e.particleChildren.length,properties:e._properties}),e._gpuData[this.renderer.uid]}updateRenderable(e){}execute(e){const t=e.particleChildren;if(t.length===0)return;const r=this.renderer,i=this.getBuffers(e);e.texture||(e.texture=t[0].texture);const s=this.state;i.update(t,e._childrenDirty),e._childrenDirty=!1,s.blendMode=ne(e.blendMode,e.texture._source);const n=this.localUniforms.uniforms,a=n.uTranslationMatrix;e.worldTransform.copyTo(a),a.prepend(r.globalUniforms.globalUniformData.projectionMatrix),n.uResolution=r.globalUniforms.globalUniformData.resolution,n.uRound=r._roundPixels|e._roundPixels,j(e.groupColorAlpha,n.uColor,0),this.adaptor.execute(this,e)}destroy(){this.renderer=null,this.defaultShader&&(this.defaultShader.destroy(),this.defaultShader=null)}}class Ne extends $e{constructor(e){super(e,new Vt)}}Ne.extension={type:[m.WebGLPipes],name:"particle"};class qe extends $e{constructor(e){super(e,new Lt)}}qe.extension={type:[m.WebGPUPipes],name:"particle"};const Qe=class Je extends Et{constructor(e={}){e={...Je.defaultOptions,...e},super({width:e.width,height:e.height,verticesX:4,verticesY:4}),this.update(e)}update(e){this.width=e.width??this.width,this.height=e.height??this.height,this._originalWidth=e.originalWidth??this._originalWidth,this._originalHeight=e.originalHeight??this._originalHeight,this._leftWidth=e.leftWidth??this._leftWidth,this._rightWidth=e.rightWidth??this._rightWidth,this._topHeight=e.topHeight??this._topHeight,this._bottomHeight=e.bottomHeight??this._bottomHeight,this._anchorX=e.anchor?.x,this._anchorY=e.anchor?.y,this.updateUvs(),this.updatePositions()}updatePositions(){const e=this.positions,{width:t,height:r,_leftWidth:i,_rightWidth:s,_topHeight:n,_bottomHeight:a,_anchorX:u,_anchorY:l}=this,d=i+s,c=t>d?1:t/d,h=n+a,f=r>h?1:r/h,y=Math.min(c,f),_=u*t,x=l*r;e[0]=e[8]=e[16]=e[24]=-_,e[2]=e[10]=e[18]=e[26]=i*y-_,e[4]=e[12]=e[20]=e[28]=t-s*y-_,e[6]=e[14]=e[22]=e[30]=t-_,e[1]=e[3]=e[5]=e[7]=-x,e[9]=e[11]=e[13]=e[15]=n*y-x,e[17]=e[19]=e[21]=e[23]=r-a*y-x,e[25]=e[27]=e[29]=e[31]=r-x,this.getBuffer("aPosition").update()}updateUvs(){const e=this.uvs;e[0]=e[8]=e[16]=e[24]=0,e[1]=e[3]=e[5]=e[7]=0,e[6]=e[14]=e[22]=e[30]=1,e[25]=e[27]=e[29]=e[31]=1;const t=1/this._originalWidth,r=1/this._originalHeight;e[2]=e[10]=e[18]=e[26]=t*this._leftWidth,e[9]=e[11]=e[13]=e[15]=r*this._topHeight,e[4]=e[12]=e[20]=e[28]=1-t*this._rightWidth,e[17]=e[19]=e[21]=e[23]=1-r*this._bottomHeight,this.getBuffer("aUV").update()}};Qe.defaultOptions={width:100,height:100,leftWidth:10,topHeight:10,rightWidth:10,bottomHeight:10,originalWidth:100,originalHeight:100};let Nt=Qe;class qt extends ue{constructor(){super(),this.geometry=new Nt}destroy(){this.geometry.destroy()}}class Ze{constructor(e){this._renderer=e}addRenderable(e,t){const r=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,r),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,t),t._batcher.updateElement(t)}validateRenderable(e){const t=this._getGpuSprite(e);return!t._batcher.checkAndUpdateTexture(t,e._texture)}_updateBatchableSprite(e,t){t.geometry.update(e),t.setTexture(e._texture)}_getGpuSprite(e){return e._gpuData[this._renderer.uid]||this._initGPUSprite(e)}_initGPUSprite(e){const t=e._gpuData[this._renderer.uid]=new qt,r=t;return r.renderable=e,r.transform=e.groupTransform,r.texture=e._texture,r.roundPixels=this._renderer._roundPixels|e._roundPixels,e.didViewUpdate||this._updateBatchableSprite(e,r),t}destroy(){this._renderer=null}}Ze.extension={type:[m.WebGLPipes,m.WebGPUPipes,m.CanvasPipes],name:"nineSliceSprite"};const Qt={name:"tiling-bit",vertex:{header:`
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,main:`
            uv = (tilingUniforms.uTextureTransform * vec3(uv, 1.0)).xy;

            position = (position - tilingUniforms.uSizeAnchor.zw) * tilingUniforms.uSizeAnchor.xy;
        `},fragment:{header:`
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `,main:`

            var coord = vUV + ceil(tilingUniforms.uClampOffset - vUV);
            coord = (tilingUniforms.uMapCoord * vec3(coord, 1.0)).xy;
            var unclamped = coord;
            coord = clamp(coord, tilingUniforms.uClampFrame.xy, tilingUniforms.uClampFrame.zw);

            var bias = 0.;

            if(unclamped.x == coord.x && unclamped.y == coord.y)
            {
                bias = -32.;
            }

            outColor = textureSampleBias(uTexture, uSampler, coord, bias);
        `}},Jt={name:"tiling-bit",vertex:{header:`
            uniform mat3 uTextureTransform;
            uniform vec4 uSizeAnchor;

        `,main:`
            uv = (uTextureTransform * vec3(aUV, 1.0)).xy;

            position = (position - uSizeAnchor.zw) * uSizeAnchor.xy;
        `},fragment:{header:`
            uniform sampler2D uTexture;
            uniform mat3 uMapCoord;
            uniform vec4 uClampFrame;
            uniform vec2 uClampOffset;
        `,main:`

        vec2 coord = vUV + ceil(uClampOffset - vUV);
        coord = (uMapCoord * vec3(coord, 1.0)).xy;
        vec2 unclamped = coord;
        coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);

        outColor = texture(uTexture, coord, unclamped == coord ? 0.0 : -32.0);// lod-bias very negative to force lod 0

        `}};let N,q;class Zt extends ae{constructor(){N??(N=Re({name:"tiling-sprite-shader",bits:[wt,Qt,Me]})),q??(q=Ue({name:"tiling-sprite-shader",bits:[Ct,Jt,Ge]}));const e=new k({uMapCoord:{value:new B,type:"mat3x3<f32>"},uClampFrame:{value:new Float32Array([0,0,1,1]),type:"vec4<f32>"},uClampOffset:{value:new Float32Array([0,0]),type:"vec2<f32>"},uTextureTransform:{value:new B,type:"mat3x3<f32>"},uSizeAnchor:{value:new Float32Array([100,100,.5,.5]),type:"vec4<f32>"}});super({glProgram:q,gpuProgram:N,resources:{localUniforms:new k({uTransformMatrix:{value:new B,type:"mat3x3<f32>"},uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uRound:{value:0,type:"f32"}}),tilingUniforms:e,uTexture:w.EMPTY.source,uSampler:w.EMPTY.source.style}})}updateUniforms(e,t,r,i,s,n){const a=this.resources.tilingUniforms,u=n.width,l=n.height,d=n.textureMatrix,c=a.uniforms.uTextureTransform;c.set(r.a*u/e,r.b*u/t,r.c*l/e,r.d*l/t,r.tx/e,r.ty/t),c.invert(),a.uniforms.uMapCoord=d.mapCoord,a.uniforms.uClampFrame=d.uClampFrame,a.uniforms.uClampOffset=d.uClampOffset,a.uniforms.uTextureTransform=c,a.uniforms.uSizeAnchor[0]=e,a.uniforms.uSizeAnchor[1]=t,a.uniforms.uSizeAnchor[2]=i,a.uniforms.uSizeAnchor[3]=s,n&&(this.resources.uTexture=n.source,this.resources.uSampler=n.source.style)}}class er extends oe{constructor(){super({positions:new Float32Array([0,0,1,0,1,1,0,1]),uvs:new Float32Array([0,0,1,0,1,1,0,1]),indices:new Uint32Array([0,1,2,0,2,3])})}}function tr(o,e){const t=o.anchor.x,r=o.anchor.y;e[0]=-t*o.width,e[1]=-r*o.height,e[2]=(1-t)*o.width,e[3]=-r*o.height,e[4]=(1-t)*o.width,e[5]=(1-r)*o.height,e[6]=-t*o.width,e[7]=(1-r)*o.height}function rr(o,e,t,r){let i=0;const s=o.length/e,n=r.a,a=r.b,u=r.c,l=r.d,d=r.tx,c=r.ty;for(t*=e;i<s;){const h=o[t],f=o[t+1];o[t]=n*h+u*f+d,o[t+1]=a*h+l*f+c,t+=e,i++}}function ir(o,e){const t=o.texture,r=t.frame.width,i=t.frame.height;let s=0,n=0;o.applyAnchorToTexture&&(s=o.anchor.x,n=o.anchor.y),e[0]=e[6]=-s,e[2]=e[4]=1-s,e[1]=e[3]=-n,e[5]=e[7]=1-n;const a=B.shared;a.copyFrom(o._tileTransform.matrix),a.tx/=o.width,a.ty/=o.height,a.invert(),a.scale(o.width/r,o.height/i),rr(e,2,0,a)}const L=new er;class sr{constructor(){this.canBatch=!0,this.geometry=new oe({indices:L.indices.slice(),positions:L.positions.slice(),uvs:L.uvs.slice()})}destroy(){this.geometry.destroy(),this.shader?.destroy()}}class et{constructor(e){this._state=K.default2d,this._renderer=e}validateRenderable(e){const t=this._getTilingSpriteData(e),r=t.canBatch;this._updateCanBatch(e);const i=t.canBatch;if(i&&i===r){const{batchableMesh:s}=t;return!s._batcher.checkAndUpdateTexture(s,e.texture)}return r!==i}addRenderable(e,t){const r=this._renderer.renderPipes.batch;this._updateCanBatch(e);const i=this._getTilingSpriteData(e),{geometry:s,canBatch:n}=i;if(n){i.batchableMesh||(i.batchableMesh=new ue);const a=i.batchableMesh;e.didViewUpdate&&(this._updateBatchableMesh(e),a.geometry=s,a.renderable=e,a.transform=e.groupTransform,a.setTexture(e._texture)),a.roundPixels=this._renderer._roundPixels|e._roundPixels,r.addToBatch(a,t)}else r.break(t),i.shader||(i.shader=new Zt),this.updateRenderable(e),t.add(e)}execute(e){const{shader:t}=this._getTilingSpriteData(e);t.groups[0]=this._renderer.globalUniforms.bindGroup;const r=t.resources.localUniforms.uniforms;r.uTransformMatrix=e.groupTransform,r.uRound=this._renderer._roundPixels|e._roundPixels,j(e.groupColorAlpha,r.uColor,0),this._state.blendMode=ne(e.groupBlendMode,e.texture._source),this._renderer.encoder.draw({geometry:L,shader:t,state:this._state})}updateRenderable(e){const t=this._getTilingSpriteData(e),{canBatch:r}=t;if(r){const{batchableMesh:i}=t;e.didViewUpdate&&this._updateBatchableMesh(e),i._batcher.updateElement(i)}else if(e.didViewUpdate){const{shader:i}=t;i.updateUniforms(e.width,e.height,e._tileTransform.matrix,e.anchor.x,e.anchor.y,e.texture)}}_getTilingSpriteData(e){return e._gpuData[this._renderer.uid]||this._initTilingSpriteData(e)}_initTilingSpriteData(e){const t=new sr;return t.renderable=e,e._gpuData[this._renderer.uid]=t,t}_updateBatchableMesh(e){const t=this._getTilingSpriteData(e),{geometry:r}=t,i=e.texture.source.style;i.addressMode!=="repeat"&&(i.addressMode="repeat",i.update()),ir(e,r.uvs),tr(e,r.positions)}destroy(){this._renderer=null}_updateCanBatch(e){const t=this._getTilingSpriteData(e),r=e.texture;let i=!0;return this._renderer.type===ie.WEBGL&&(i=this._renderer.context.supports.nonPowOf2wrapping),t.canBatch=r.textureMatrix.isSimple&&(i||r.source.isPowerOfTwo),t.canBatch}}et.extension={type:[m.WebGLPipes,m.WebGPUPipes,m.CanvasPipes],name:"tilingSprite"};const nr={name:"local-uniform-msdf-bit",vertex:{header:`
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32,
                uRound:f32,
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `},fragment:{header:`
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
         `,main:`
            outColor = vec4<f32>(calculateMSDFAlpha(outColor, localUniforms.uColor, localUniforms.uDistance));
        `}},ar={name:"local-uniform-msdf-bit",vertex:{header:`
            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix *= uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `},fragment:{header:`
            uniform float uDistance;
         `,main:`
            outColor = vec4(calculateMSDFAlpha(outColor, vColor, uDistance));
        `}},or={name:"msdf-bit",fragment:{header:`
            fn calculateMSDFAlpha(msdfColor:vec4<f32>, shapeColor:vec4<f32>, distance:f32) -> f32 {

                // MSDF
                var median = msdfColor.r + msdfColor.g + msdfColor.b -
                    min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                    max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                var screenPxDistance = distance * (median - 0.5);
                var alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                var luma: f32 = dot(shapeColor.rgb, vec3<f32>(0.299, 0.587, 0.114));
                var gamma: f32 = mix(1.0, 1.0 / 2.2, luma);
                var coverage: f32 = pow(shapeColor.a * alpha, gamma);

                return coverage;

            }
        `}},ur={name:"msdf-bit",fragment:{header:`
            float calculateMSDFAlpha(vec4 msdfColor, vec4 shapeColor, float distance) {

                // MSDF
                float median = msdfColor.r + msdfColor.g + msdfColor.b -
                                min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                                max(msdfColor.r, max(msdfColor.g, msdfColor.b));

                // SDF
                median = min(median, msdfColor.a);

                float screenPxDistance = distance * (median - 0.5);
                float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);

                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                float luma = dot(shapeColor.rgb, vec3(0.299, 0.587, 0.114));
                float gamma = mix(1.0, 1.0 / 2.2, luma);
                float coverage = pow(shapeColor.a * alpha, gamma);

                return coverage;
            }
        `}};let Q,J;class lr extends ae{constructor(e){const t=new k({uColor:{value:new Float32Array([1,1,1,1]),type:"vec4<f32>"},uTransformMatrix:{value:new B,type:"mat3x3<f32>"},uDistance:{value:4,type:"f32"},uRound:{value:0,type:"f32"}});Q??(Q=Re({name:"sdf-shader",bits:[pt,gt(e),nr,or,Me]})),J??(J=Ue({name:"sdf-shader",bits:[mt,xt(e),ar,ur,Ge]})),super({glProgram:J,gpuProgram:Q,resources:{localUniforms:t,batchSamplers:_t(e)}})}}class cr extends yt{destroy(){this.context.customShader&&this.context.customShader.destroy(),super.destroy()}}class tt{constructor(e){this._renderer=e}validateRenderable(e){const t=this._getGpuBitmapText(e);return this._renderer.renderPipes.graphics.validateRenderable(t)}addRenderable(e,t){const r=this._getGpuBitmapText(e);we(e,r),e._didTextUpdate&&(e._didTextUpdate=!1,this._updateContext(e,r)),this._renderer.renderPipes.graphics.addRenderable(r,t),r.context.customShader&&this._updateDistanceField(e)}updateRenderable(e){const t=this._getGpuBitmapText(e);we(e,t),this._renderer.renderPipes.graphics.updateRenderable(t),t.context.customShader&&this._updateDistanceField(e)}_updateContext(e,t){const{context:r}=t,i=Ut.getFont(e.text,e._style);r.clear(),i.distanceField.type!=="none"&&(r.customShader||(r.customShader=new lr(this._renderer.limits.maxBatchableTextures)));const s=D.graphemeSegmenter(e.text),n=e._style;let a=i.baseLineOffset;const u=Ie(s,n,i,!0),l=n.padding,d=u.scale;let c=u.width,h=u.height+u.offsetY;n._stroke&&(c+=n._stroke.width/d,h+=n._stroke.width/d),r.translate(-e._anchor._x*c-l,-e._anchor._y*h-l).scale(d,d);const f=i.applyFillAsTint?n._fill.color:16777215;let y=i.fontMetrics.fontSize,_=i.lineHeight;n.lineHeight&&(y=n.fontSize/d,_=n.lineHeight/d);let x=(_-y)/2;x-i.baseLineOffset<0&&(x=0);for(let p=0;p<u.lines.length;p++){const g=u.lines[p];for(let b=0;b<g.charPositions.length;b++){const C=g.chars[b],U=i.chars[C];if(U?.texture){const M=U.texture;r.texture(M,f||"black",Math.round(g.charPositions[b]+U.xOffset),Math.round(a+U.yOffset+x),M.orig.width,M.orig.height)}}a+=_}}_getGpuBitmapText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new cr;return e._gpuData[this._renderer.uid]=t,this._updateContext(e,t),t}_updateDistanceField(e){const t=this._getGpuBitmapText(e).context,r=e._style.fontFamily,i=S.get(`${r}-bitmap`),{a:s,b:n,c:a,d:u}=e.groupTransform,l=Math.sqrt(s*s+n*n),d=Math.sqrt(a*a+u*u),c=(Math.abs(l)+Math.abs(d))/2,h=i.baseRenderedFontSize/e._style.fontSize,f=c*i.distanceField.range*(1/h);t.customShader.resources.localUniforms.uniforms.uDistance=f}destroy(){this._renderer=null}}tt.extension={type:[m.WebGLPipes,m.WebGPUPipes,m.CanvasPipes],name:"bitmapText"};function we(o,e){e.groupTransform=o.groupTransform,e.groupColorAlpha=o.groupColorAlpha,e.groupColor=o.groupColor,e.groupBlendMode=o.groupBlendMode,e.globalDisplayStatus=o.globalDisplayStatus,e.groupTransform=o.groupTransform,e.localDisplayStatus=o.localDisplayStatus,e.groupAlpha=o.groupAlpha,e._roundPixels=o._roundPixels}class dr extends ze{constructor(e){super(),this.generatingTexture=!1,this.currentKey="--",this._renderer=e,e.runners.resolutionChange.add(this)}resolutionChange(){const e=this.renderable;e._autoResolution&&e.onViewUpdate()}destroy(){const{htmlText:e}=this._renderer;e.getReferenceCount(this.currentKey)===null?e.returnTexturePromise(this.texturePromise):e.decreaseReferenceCount(this.currentKey),this._renderer.runners.resolutionChange.remove(this),this.texturePromise=null,this._renderer=null}}function te(o,e){const{texture:t,bounds:r}=o,i=e._style._getFinalPadding();bt(r,e._anchor,t);const s=e._anchor._x*i*2,n=e._anchor._y*i*2;r.minX-=i-s,r.minY-=i-n,r.maxX-=i-s,r.maxY-=i-n}class rt{constructor(e){this._renderer=e}validateRenderable(e){const t=this._getGpuText(e),r=e.styleKey;return t.currentKey!==r}addRenderable(e,t){const r=this._getGpuText(e);if(e._didTextUpdate){const i=e._autoResolution?this._renderer.resolution:e.resolution;(r.currentKey!==e.styleKey||e.resolution!==i)&&this._updateGpuText(e).catch(s=>{console.error(s)}),e._didTextUpdate=!1,te(r,e)}this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuText(e);t._batcher.updateElement(t)}async _updateGpuText(e){e._didTextUpdate=!1;const t=this._getGpuText(e);if(t.generatingTexture)return;const r=t.texturePromise;t.texturePromise=null,t.generatingTexture=!0,e._resolution=e._autoResolution?this._renderer.resolution:e.resolution;let i=this._renderer.htmlText.getTexturePromise(e);r&&(i=i.finally(()=>{this._renderer.htmlText.decreaseReferenceCount(t.currentKey),this._renderer.htmlText.returnTexturePromise(r)})),t.texturePromise=i,t.currentKey=e.styleKey,t.texture=await i;const s=e.renderGroup||e.parentRenderGroup;s&&(s.structureDidChange=!0),t.generatingTexture=!1,te(t,e)}_getGpuText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new dr(this._renderer);return t.renderable=e,t.transform=e.groupTransform,t.texture=w.EMPTY,t.bounds={minX:0,maxX:1,minY:0,maxY:0},t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._resolution=e._autoResolution?this._renderer.resolution:e.resolution,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}}rt.extension={type:[m.WebGLPipes,m.WebGPUPipes,m.CanvasPipes],name:"htmlText"};function hr(){const{userAgent:o}=se.get().getNavigator();return/^((?!chrome|android).)*safari/i.test(o)}const fr=new Be;function it(o,e,t,r){const i=fr;i.minX=0,i.minY=0,i.maxX=o.width/r|0,i.maxY=o.height/r|0;const s=P.getOptimalTexture(i.width,i.height,r,!1);return s.source.uploadMethodId="image",s.source.resource=o,s.source.alphaMode="premultiply-alpha-on-upload",s.frame.width=e/r,s.frame.height=t/r,s.source.emit("update",s.source),s.updateUvs(),s}function pr(o,e){const t=e.fontFamily,r=[],i={},s=/font-family:([^;"\s]+)/g,n=o.match(s);function a(u){i[u]||(r.push(u),i[u]=!0)}if(Array.isArray(t))for(let u=0;u<t.length;u++)a(t[u]);else a(t);n&&n.forEach(u=>{const l=u.split(":")[1].trim();a(l)});for(const u in e.tagStyles){const l=e.tagStyles[u].fontFamily;a(l)}return r}async function gr(o){const t=await(await se.get().fetch(o)).blob(),r=new FileReader;return await new Promise((s,n)=>{r.onloadend=()=>s(r.result),r.onerror=n,r.readAsDataURL(t)})}async function mr(o,e){const t=await gr(e);return`@font-face {
        font-family: "${o.fontFamily}";
        font-weight: ${o.fontWeight};
        font-style: ${o.fontStyle};
        src: url('${t}');
    }`}const Z=new Map;async function xr(o){const e=o.filter(t=>S.has(`${t}-and-url`)).map(t=>{if(!Z.has(t)){const{entries:r}=S.get(`${t}-and-url`),i=[];r.forEach(s=>{const n=s.url,u=s.faces.map(l=>({weight:l.weight,style:l.style}));i.push(...u.map(l=>mr({fontWeight:l.weight,fontStyle:l.style,fontFamily:t},n)))}),Z.set(t,Promise.all(i).then(s=>s.join(`
`)))}return Z.get(t)});return(await Promise.all(e)).join(`
`)}function _r(o,e,t,r,i){const{domElement:s,styleElement:n,svgRoot:a}=i;s.innerHTML=`<style>${e.cssStyle}</style><div style='padding:0;'>${o}</div>`,s.setAttribute("style",`transform: scale(${t});transform-origin: top left; display: inline-block`),n.textContent=r;const{width:u,height:l}=i.image;return a.setAttribute("width",u.toString()),a.setAttribute("height",l.toString()),new XMLSerializer().serializeToString(a)}function yr(o,e){const t=H.getOptimalCanvasAndContext(o.width,o.height,e),{context:r}=t;return r.clearRect(0,0,o.width,o.height),r.drawImage(o,0,0),t}function br(o,e,t){return new Promise(async r=>{t&&await new Promise(i=>setTimeout(i,100)),o.onload=()=>{r()},o.src=`data:image/svg+xml;charset=utf8,${encodeURIComponent(e)}`,o.crossOrigin="anonymous"})}class st{constructor(e){this._activeTextures={},this._renderer=e,this._createCanvas=e.type===ie.WEBGPU}getTexture(e){return this.getTexturePromise(e)}getManagedTexture(e){const t=e.styleKey;if(this._activeTextures[t])return this._increaseReferenceCount(t),this._activeTextures[t].promise;const r=this._buildTexturePromise(e).then(i=>(this._activeTextures[t].texture=i,i));return this._activeTextures[t]={texture:null,promise:r,usageCount:1},r}getReferenceCount(e){return this._activeTextures[e]?.usageCount??null}_increaseReferenceCount(e){this._activeTextures[e].usageCount++}decreaseReferenceCount(e){const t=this._activeTextures[e];t&&(t.usageCount--,t.usageCount===0&&(t.texture?this._cleanUp(t.texture):t.promise.then(r=>{t.texture=r,this._cleanUp(t.texture)}).catch(()=>{Y("HTMLTextSystem: Failed to clean texture")}),this._activeTextures[e]=null))}getTexturePromise(e){return this._buildTexturePromise(e)}async _buildTexturePromise(e){const{text:t,style:r,resolution:i,textureStyle:s}=e,n=X.get(He),a=pr(t,r),u=await xr(a),l=It(t,r,u,n),d=Math.ceil(Math.ceil(Math.max(1,l.width)+r.padding*2)*i),c=Math.ceil(Math.ceil(Math.max(1,l.height)+r.padding*2)*i),h=n.image,f=2;h.width=(d|0)+f,h.height=(c|0)+f;const y=_r(t,r,i,u,n);await br(h,y,hr()&&a.length>0);const _=h;let x;this._createCanvas&&(x=yr(h,i));const p=it(x?x.canvas:_,h.width-f,h.height-f,i);return s&&(p.source.style=s),this._createCanvas&&(this._renderer.texture.initSource(p.source),H.returnCanvasAndContext(x)),X.return(n),p}returnTexturePromise(e){e.then(t=>{this._cleanUp(t)}).catch(()=>{Y("HTMLTextSystem: Failed to clean texture")})}_cleanUp(e){P.returnTexture(e,!0),e.source.resource=null,e.source.uploadMethodId="unknown"}destroy(){this._renderer=null;for(const e in this._activeTextures)this._activeTextures[e]&&this.returnTexturePromise(this._activeTextures[e].promise);this._activeTextures=null}}st.extension={type:[m.WebGLSystem,m.WebGPUSystem,m.CanvasSystem],name:"htmlText"};class vr extends ze{constructor(e){super(),this._renderer=e,e.runners.resolutionChange.add(this)}resolutionChange(){const e=this.renderable;e._autoResolution&&e.onViewUpdate()}destroy(){const{canvasText:e}=this._renderer;e.getReferenceCount(this.currentKey)>0?e.decreaseReferenceCount(this.currentKey):this.texture&&e.returnTexture(this.texture),this._renderer.runners.resolutionChange.remove(this),this._renderer=null}}class nt{constructor(e){this._renderer=e}validateRenderable(e){const t=this._getGpuText(e),r=e.styleKey;return t.currentKey!==r?!0:e._didTextUpdate}addRenderable(e,t){const r=this._getGpuText(e);if(e._didTextUpdate){const i=e._autoResolution?this._renderer.resolution:e.resolution;(r.currentKey!==e.styleKey||e.resolution!==i)&&this._updateGpuText(e),e._didTextUpdate=!1,te(r,e)}this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuText(e);t._batcher.updateElement(t)}_updateGpuText(e){const t=this._getGpuText(e);t.texture&&this._renderer.canvasText.decreaseReferenceCount(t.currentKey),e._resolution=e._autoResolution?this._renderer.resolution:e.resolution,t.texture=this._renderer.canvasText.getManagedTexture(e),t.currentKey=e.styleKey}_getGpuText(e){return e._gpuData[this._renderer.uid]||this.initGpuText(e)}initGpuText(e){const t=new vr(this._renderer);return t.currentKey="--",t.renderable=e,t.transform=e.groupTransform,t.bounds={minX:0,maxX:1,minY:0,maxY:0},t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}}nt.extension={type:[m.WebGLPipes,m.WebGPUPipes,m.CanvasPipes],name:"text"};class at{constructor(e){this._activeTextures={},this._renderer=e}getTexture(e,t,r,i){typeof e=="string"&&(T("8.0.0","CanvasTextSystem.getTexture: Use object TextOptions instead of separate arguments"),e={text:e,style:r,resolution:t}),e.style instanceof W||(e.style=new W(e.style)),e.textureStyle instanceof I||(e.textureStyle=new I(e.textureStyle)),typeof e.text!="string"&&(e.text=e.text.toString());const{text:s,style:n,textureStyle:a}=e,u=e.resolution??this._renderer.resolution,{frame:l,canvasAndContext:d}=$.getCanvasAndContext({text:s,style:n,resolution:u}),c=it(d.canvas,l.width,l.height,u);if(a&&(c.source.style=a),n.trim&&(l.pad(n.padding),c.frame.copyFrom(l),c.frame.scale(1/u),c.updateUvs()),n.filters){const h=this._applyFilters(c,n.filters);return this.returnTexture(c),$.returnCanvasAndContext(d),h}return this._renderer.texture.initSource(c._source),$.returnCanvasAndContext(d),c}returnTexture(e){const t=e.source;t.resource=null,t.uploadMethodId="unknown",t.alphaMode="no-premultiply-alpha",P.returnTexture(e,!0)}renderTextToCanvas(){T("8.10.0","CanvasTextSystem.renderTextToCanvas: no longer supported, use CanvasTextSystem.getTexture instead")}getManagedTexture(e){e._resolution=e._autoResolution?this._renderer.resolution:e.resolution;const t=e.styleKey;if(this._activeTextures[t])return this._increaseReferenceCount(t),this._activeTextures[t].texture;const r=this.getTexture({text:e.text,style:e.style,resolution:e._resolution,textureStyle:e.textureStyle});return this._activeTextures[t]={texture:r,usageCount:1},r}decreaseReferenceCount(e){const t=this._activeTextures[e];t.usageCount--,t.usageCount===0&&(this.returnTexture(t.texture),this._activeTextures[e]=null)}getReferenceCount(e){return this._activeTextures[e]?.usageCount??0}_increaseReferenceCount(e){this._activeTextures[e].usageCount++}_applyFilters(e,t){const r=this._renderer.renderTarget.renderTarget,i=this._renderer.filter.generateFilteredTexture({texture:e,filters:t});return this._renderer.renderTarget.bind(r,!1),i}destroy(){this._renderer=null;for(const e in this._activeTextures)this._activeTextures[e]&&this.returnTexture(this._activeTextures[e].texture);this._activeTextures=null}}at.extension={type:[m.WebGLSystem,m.WebGPUSystem,m.CanvasSystem],name:"canvasText"};v.add(Ae);v.add(ke);v.add(Ye);v.add(vt);v.add(je);v.add(Ne);v.add(qe);v.add(at);v.add(nt);v.add(tt);v.add(st);v.add(rt);v.add(et);v.add(Ze);v.add(Ee);v.add(We);
