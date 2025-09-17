import { a as usePrismic, d as useRoute, e as useAsyncData, u as useHead, f as _sfc_main$4 } from './server.mjs';
import { defineComponent, withAsyncContext, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "[uid]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const prismic = usePrismic();
    const route = useRoute();
    const { data: page } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      route.params.uid,
      () => prismic.client.getByUID("page", route.params.uid),
      "$lGTdzq_7Aq"
    )), __temp = await __temp, __restore(), __temp);
    useHead({
      title: page.value?.data.meta_title,
      meta: [
        { name: "description", content: page.value?.data.meta_description },
        { property: "og:title", content: page.value?.data.meta_title },
        { property: "og:description", content: page.value?.data.meta_description },
        { property: "og:image", content: page.value?.data.meta_image?.url },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: page.value?.data.meta_title },
        { name: "twitter:description", content: page.value?.data.meta_description },
        { name: "twitter:image", content: page.value?.data.meta_image?.url }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SliceZone = _sfc_main$4;
      _push(ssrRenderComponent(_component_SliceZone, mergeProps({
        wrapper: "main",
        slices: unref(page)?.data.slices ?? [],
        components: unref(components)
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[uid].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_uid_-DAQ9vRCC.mjs.map
