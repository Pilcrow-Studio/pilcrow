import { h as _sfc_main$7 } from './server.mjs';
import { g as getSliceComponentProps } from './getSliceComponentProps-DZY85aVg.mjs';
import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
import 'vue-router';
import '@unhead/addons';
import '@unhead/schema-org/vue';
import '@prismicio/client';
import '@prismicio/client/richtext';
import 'esm-env';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  props: getSliceComponentProps(),
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PrismicRichText = _sfc_main$7;
      _push(`<section${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_PrismicRichText, {
        wrapper: "div",
        field: _ctx.slice.primary.content,
        class: "richtext"
      }, null, _parent));
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("slices/RichText/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CyP0h6V9.mjs.map
