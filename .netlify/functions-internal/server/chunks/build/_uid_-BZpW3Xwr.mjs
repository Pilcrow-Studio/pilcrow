import { _ as __nuxt_component_0 } from './NuxtImg-DXIWJVG8.mjs';
import { a as usePrismic, d as useRoute, e as useAsyncData, g as useNuxtApp, u as useHead, h as _sfc_main$7 } from './server.mjs';
import { defineComponent, withAsyncContext, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useCurrency } from './useCurrency-CxkotuyY.mjs';
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
    const { formatCurrency } = useCurrency();
    const prismic = usePrismic();
    const route = useRoute();
    const { data: art_piece } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      route.params.uid,
      () => prismic.client.getByUID("art_piece", route.params.uid),
      "$LaHKuENaWj"
    )), __temp = await __temp, __restore(), __temp);
    if (art_piece.value?.id) {
      const { ssrContext } = useNuxtApp();
      if (ssrContext && ssrContext.res) {
        ssrContext.res.setHeader(
          "Netlify-Cache-Tag",
          `art-piece-${art_piece.value.id}`
        );
      }
    }
    useHead({
      title: art_piece.value?.data.meta_title,
      meta: [
        { name: "description", content: art_piece.value?.data.meta_description },
        { property: "og:title", content: art_piece.value?.data.meta_title },
        { property: "og:description", content: art_piece.value?.data.meta_description },
        { property: "og:image", content: art_piece.value?.data.meta_image?.url },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: art_piece.value?.data.meta_title },
        { name: "twitter:description", content: art_piece.value?.data.meta_description },
        { name: "twitter:image", content: art_piece.value?.data.meta_image?.url }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0;
      const _component_PrismicRichText = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(_attrs)}><section><div class="relative grid grid-cols-8 gap-4"><div class="art-container bg-gray-100 p-4 col-span-6"><div id="art-piece-image" class="art-image mb-4 shadow-md">`);
      if (unref(art_piece)?.data.artwork?.url) {
        _push(ssrRenderComponent(_component_NuxtImg, {
          format: "avif",
          src: unref(art_piece).data.artwork.url,
          height: "500",
          class: "w-full h-full object-cover"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="sticky top-0 col-span-2 py-4 border-t border-b border-gray-200"><h1>${ssrInterpolate(unref(art_piece)?.data.title)}</h1>`);
      if (unref(art_piece)?.data.description) {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_PrismicRichText, {
          field: unref(art_piece).data.description
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(art_piece)?.data.size) {
        _push(`<p class="text-sm mt-2">${ssrInterpolate(unref(art_piece).data.size)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(art_piece)?.data.price) {
        _push(`<p class="text-sm mt-2">${ssrInterpolate(unref(formatCurrency)(unref(art_piece).data.price))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/work/[uid].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_uid_-BZpW3Xwr.mjs.map
