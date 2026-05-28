import{_ as m,O as l,H as i,f as p,k as o,ac as n,j as d,F as b,d as c,b as r,X as s,i as f}from"./chunks/framework.Cj7lVACV.js";const y={};function _(u,t){const e=l("moe-button");return i(),p(b,null,[o(e,null,{default:n(()=>[...t[0]||(t[0]=[d("默认按钮",-1)])]),_:1}),o(e,{type:"primary"},{default:n(()=>[...t[1]||(t[1]=[d("主要按钮",-1)])]),_:1}),o(e,{type:"success"},{default:n(()=>[...t[2]||(t[2]=[d("成功按钮",-1)])]),_:1}),o(e,{type:"warning"},{default:n(()=>[...t[3]||(t[3]=[d("警告按钮",-1)])]),_:1}),o(e,{type:"danger"},{default:n(()=>[...t[4]||(t[4]=[d("危险按钮",-1)])]),_:1}),o(e,{type:"info"},{default:n(()=>[...t[5]||(t[5]=[d("信息按钮",-1)])]),_:1})],64)}const h=m(y,[["render",_]]),g=`<template>
  <moe-button>默认按钮</moe-button>
  <moe-button type="primary">主要按钮</moe-button>
  <moe-button type="success">成功按钮</moe-button>
  <moe-button type="warning">警告按钮</moe-button>
  <moe-button type="danger">危险按钮</moe-button>
  <moe-button type="info">信息按钮</moe-button>
</template>
`,x={};function P(u,t){const e=l("moe-button");return i(),p(b,null,[o(e,{plain:""},{default:n(()=>[...t[0]||(t[0]=[d("默认按钮",-1)])]),_:1}),o(e,{type:"primary",plain:""},{default:n(()=>[...t[1]||(t[1]=[d("主要按钮",-1)])]),_:1}),o(e,{type:"success",plain:""},{default:n(()=>[...t[2]||(t[2]=[d("成功按钮",-1)])]),_:1}),o(e,{type:"warning",plain:""},{default:n(()=>[...t[3]||(t[3]=[d("警告按钮",-1)])]),_:1}),o(e,{type:"danger",plain:""},{default:n(()=>[...t[4]||(t[4]=[d("危险按钮",-1)])]),_:1})],64)}const k=m(x,[["render",P]]),S=`<template>
  <moe-button plain>默认按钮</moe-button>
  <moe-button type="primary" plain>主要按钮</moe-button>
  <moe-button type="success" plain>成功按钮</moe-button>
  <moe-button type="warning" plain>警告按钮</moe-button>
  <moe-button type="danger" plain>危险按钮</moe-button>
</template>
`,q={};function B(u,t){const e=l("moe-button");return i(),p(b,null,[o(e,{type:"primary",size:"large"},{default:n(()=>[...t[0]||(t[0]=[d("大型按钮",-1)])]),_:1}),o(e,{type:"primary"},{default:n(()=>[...t[1]||(t[1]=[d("默认按钮",-1)])]),_:1}),o(e,{type:"primary",size:"small"},{default:n(()=>[...t[2]||(t[2]=[d("小型按钮",-1)])]),_:1})],64)}const $=m(q,[["render",B]]),v=`<template>
  <moe-button type="primary" size="large">大型按钮</moe-button>
  <moe-button type="primary">默认按钮</moe-button>
  <moe-button type="primary" size="small">小型按钮</moe-button>
</template>
`,T={};function z(u,t){const e=l("moe-button");return i(),p(b,null,[o(e,{type:"primary",round:""},{default:n(()=>[...t[0]||(t[0]=[d("圆角按钮",-1)])]),_:1}),o(e,{type:"primary",circle:"",icon:"mingcute:star-line"}),o(e,{type:"danger",circle:"",icon:"mingcute:heart-line"})],64)}const E=m(T,[["render",z]]),I=`<template>
  <moe-button type="primary" round>圆角按钮</moe-button>
  <moe-button type="primary" circle icon="mingcute:star-line" />
  <moe-button type="danger" circle icon="mingcute:heart-line" />
</template>
`,A={};function w(u,t){const e=l("moe-button");return i(),p(b,null,[o(e,{type:"primary",loading:""},{default:n(()=>[...t[0]||(t[0]=[d("加载中",-1)])]),_:1}),o(e,{disabled:""},{default:n(()=>[...t[1]||(t[1]=[d("禁用按钮",-1)])]),_:1}),o(e,{type:"primary",disabled:""},{default:n(()=>[...t[2]||(t[2]=[d("禁用主要按钮",-1)])]),_:1})],64)}const N=m(A,[["render",w]]),V=`<template>
  <moe-button type="primary" loading>加载中</moe-button>
  <moe-button disabled>禁用按钮</moe-button>
  <moe-button type="primary" disabled>禁用主要按钮</moe-button>
</template>
`,C={};function D(u,t){const e=l("moe-icon"),a=l("moe-button");return i(),c(a,{type:"primary",loading:""},{loading:n(()=>[o(e,{icon:"mingcute:refresh-2-line",animation:"spin"})]),default:n(()=>[t[0]||(t[0]=d(" 自定义加载 ",-1))]),_:1})}const j=m(C,[["render",D]]),G=`<template>
  <moe-button type="primary" loading>
    <template #loading>
      <moe-icon icon="mingcute:refresh-2-line" animation="spin" />
    </template>
    自定义加载
  </moe-button>
</template>
`,M={};function O(u,t){const e=l("moe-button");return i(),p(b,null,[o(e,{type:"text"},{default:n(()=>[...t[0]||(t[0]=[d("文字按钮",-1)])]),_:1}),o(e,{type:"text",disabled:""},{default:n(()=>[...t[1]||(t[1]=[d("禁用文字按钮",-1)])]),_:1})],64)}const F=m(M,[["render",O]]),H=`<template>
  <moe-button type="text">文字按钮</moe-button>
  <moe-button type="text" disabled>禁用文字按钮</moe-button>
</template>
`,L={};function R(u,t){const e=l("moe-button");return i(),p(b,null,[o(e,{tag:"a",href:"https://vuejs.org",target:"_blank",type:"primary"},{default:n(()=>[...t[0]||(t[0]=[d(" 渲染为链接 ",-1)])]),_:1}),o(e,{tag:"div",type:"info"},{default:n(()=>[...t[1]||(t[1]=[d("渲染为 div",-1)])]),_:1})],64)}const J=m(L,[["render",R]]),X=`<template>
  <moe-button tag="a" href="https://vuejs.org" target="_blank" type="primary">
    渲染为链接
  </moe-button>
  <moe-button tag="div" type="info">渲染为 div</moe-button>
</template>
`,K={};function Q(u,t){const e=l("moe-button"),a=l("moe-button-group");return i(),p(b,null,[o(a,{type:"primary",size:"small"},{default:n(()=>[o(e,null,{default:n(()=>[...t[0]||(t[0]=[d("上一页",-1)])]),_:1}),o(e,null,{default:n(()=>[...t[1]||(t[1]=[d("下一页",-1)])]),_:1})]),_:1}),o(a,{type:"danger"},{default:n(()=>[o(e,{icon:"mingcute:delete-2-line"},{default:n(()=>[...t[2]||(t[2]=[d("删除",-1)])]),_:1}),o(e,{icon:"mingcute:edit-2-line"},{default:n(()=>[...t[3]||(t[3]=[d("编辑",-1)])]),_:1})]),_:1})],64)}const U=m(K,[["render",Q]]),W=`<template>
  <moe-button-group type="primary" size="small">
    <moe-button>上一页</moe-button>
    <moe-button>下一页</moe-button>
  </moe-button-group>

  <moe-button-group type="danger">
    <moe-button icon="mingcute:delete-2-line">删除</moe-button>
    <moe-button icon="mingcute:edit-2-line">编辑</moe-button>
  </moe-button-group>
</template>
`,tt=JSON.parse('{"title":"Button 按钮","description":"","frontmatter":{},"headers":[],"relativePath":"components/button.md","filePath":"components/button.md"}'),Y={name:"components/button.md"},et=Object.assign(Y,{setup(u){return(t,e)=>{const a=l("DemoBlock");return i(),p("div",null,[e[0]||(e[0]=r("h1",{id:"button-按钮",tabindex:"-1"},[d("Button 按钮 "),r("a",{class:"header-anchor",href:"#button-按钮","aria-label":'Permalink to "Button 按钮"'},"​")],-1)),e[1]||(e[1]=r("p",null,"常用操作按钮，支持类型、尺寸、加载态、禁用态、图标按钮、自定义渲染标签和按钮组。",-1)),e[2]||(e[2]=r("h2",{id:"基础用法",tabindex:"-1"},[d("基础用法 "),r("a",{class:"header-anchor",href:"#基础用法","aria-label":'Permalink to "基础用法"'},"​")],-1)),o(a,{title:"基础用法",description:"通过 type 控制按钮语义和视觉层级。",source:s(g)},{default:n(()=>[o(h)]),_:1},8,["source"]),e[3]||(e[3]=r("h2",{id:"plain-按钮",tabindex:"-1"},[d("Plain 按钮 "),r("a",{class:"header-anchor",href:"#plain-按钮","aria-label":'Permalink to "Plain 按钮"'},"​")],-1)),o(a,{title:"Plain 按钮",description:"适合弱强调操作，保留主题色但降低视觉重量。",source:s(S)},{default:n(()=>[o(k)]),_:1},8,["source"]),e[4]||(e[4]=r("h2",{id:"文字按钮",tabindex:"-1"},[d("文字按钮 "),r("a",{class:"header-anchor",href:"#文字按钮","aria-label":'Permalink to "文字按钮"'},"​")],-1)),o(a,{title:"文字按钮",description:"type 为 text 时适合链接型或弱操作入口。",source:s(H)},{default:n(()=>[o(F)]),_:1},8,["source"]),e[5]||(e[5]=r("h2",{id:"尺寸",tabindex:"-1"},[d("尺寸 "),r("a",{class:"header-anchor",href:"#尺寸","aria-label":'Permalink to "尺寸"'},"​")],-1)),o(a,{title:"尺寸",description:"提供 large、default、small 三种常用尺寸。",source:s(v)},{default:n(()=>[o($)]),_:1},8,["source"]),e[6]||(e[6]=r("h2",{id:"圆角与圆形",tabindex:"-1"},[d("圆角与圆形 "),r("a",{class:"header-anchor",href:"#圆角与圆形","aria-label":'Permalink to "圆角与圆形"'},"​")],-1)),o(a,{title:"圆角与圆形",description:"round 适合胶囊按钮，circle 适合纯图标操作。",source:s(I)},{default:n(()=>[o(E)]),_:1},8,["source"]),e[7]||(e[7]=r("h2",{id:"加载与禁用",tabindex:"-1"},[d("加载与禁用 "),r("a",{class:"header-anchor",href:"#加载与禁用","aria-label":'Permalink to "加载与禁用"'},"​")],-1)),o(a,{title:"加载与禁用",description:"loading 和 disabled 状态都会阻止点击事件。",source:s(V)},{default:n(()=>[o(N)]),_:1},8,["source"]),e[8]||(e[8]=r("h2",{id:"自定义加载图标",tabindex:"-1"},[d("自定义加载图标 "),r("a",{class:"header-anchor",href:"#自定义加载图标","aria-label":'Permalink to "自定义加载图标"'},"​")],-1)),o(a,{title:"自定义加载图标",description:"通过 loading 插槽可以完全自定义加载状态的图标内容。",source:s(G)},{default:n(()=>[o(j)]),_:1},8,["source"]),e[9]||(e[9]=r("h2",{id:"自定义标签",tabindex:"-1"},[d("自定义标签 "),r("a",{class:"header-anchor",href:"#自定义标签","aria-label":'Permalink to "自定义标签"'},"​")],-1)),o(a,{title:"自定义标签",description:"通过 tag 可以将按钮渲染为 a、div 或自定义组件。",source:s(X)},{default:n(()=>[o(J)]),_:1},8,["source"]),e[10]||(e[10]=r("h2",{id:"按钮组",tabindex:"-1"},[d("按钮组 "),r("a",{class:"header-anchor",href:"#按钮组","aria-label":'Permalink to "按钮组"'},"​")],-1)),o(a,{title:"按钮组",description:"ButtonGroup 可以统一控制内部按钮的 type、size 和 disabled。",source:s(W)},{default:n(()=>[o(U)]),_:1},8,["source"]),e[11]||(e[11]=f("",14))])}}});export{tt as __pageData,et as default};
