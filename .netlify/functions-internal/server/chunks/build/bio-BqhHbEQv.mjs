import { ssrRenderAttrs } from 'vue/server-renderer';
import { useSSRContext } from 'vue';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(_attrs)}><div class="min-h-screen"><section><div class="container"><h1 class="text-4xl font-bold">Bio</h1></div></section></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/bio.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const bio = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { bio as default };
//# sourceMappingURL=bio-BqhHbEQv.mjs.map
