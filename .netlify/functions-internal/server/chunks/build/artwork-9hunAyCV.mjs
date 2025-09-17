import { N as Nav, H as HeaderText, _ as __nuxt_component_0, F as Footer } from './HeaderText-DbNt-1ly.mjs';
import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import 'vue-router';
import './server.mjs';
import '../nitro/nitro.mjs';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind3';
import 'devalue';
import 'consola';
import 'unhead';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'unhead/server';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-bundle-renderer/runtime';
import 'node:url';
import 'ipx';
import 'pinia';
import '@unhead/addons';
import '@unhead/schema-org/vue';
import '@prismicio/client';
import '@prismicio/client/richtext';
import 'esm-env';
import 'perfect-debounce';
import './NuxtImg-DXIWJVG8.mjs';
import './index-CMrq-3rs.mjs';
import './index-9D9qVuZg.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "artwork",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(Nav, null, null, _parent));
      _push(ssrRenderComponent(HeaderText, null, null, _parent));
      _push(`<main><div class="min-h-screen">`);
      _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      _push(`</div></main>`);
      _push(ssrRenderComponent(Footer, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/artwork.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=artwork-9hunAyCV.mjs.map
