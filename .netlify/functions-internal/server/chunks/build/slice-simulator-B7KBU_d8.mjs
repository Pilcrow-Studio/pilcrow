import { f as _sfc_main$4 } from './server.mjs';
import { defineComponent, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { SliceSimulator } from '@slicemachine/adapter-nuxt/simulator';
import { c as components } from './index-CMrq-3rs.mjs';
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
  __name: "slice-simulator",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SliceZone = _sfc_main$4;
      _push(ssrRenderComponent(unref(SliceSimulator), _attrs, {
        default: withCtx(({ slices }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_SliceZone, {
              slices,
              components: unref(components)
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_SliceZone, {
                slices,
                components: unref(components)
              }, null, 8, ["slices", "components"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/slice-simulator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=slice-simulator-B7KBU_d8.mjs.map
