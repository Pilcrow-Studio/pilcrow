import { a as usePrismic, d as useRoute, e as useAsyncData, g as useNuxtApp, u as useHead, h as _sfc_main$7, j as _sfc_main$b } from './server.mjs';
import { defineComponent, withAsyncContext, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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
    const { data: exhibition } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      route.params.uid,
      () => prismic.client.getByUID("exhibitions", route.params.uid),
      "$5lsJuGYxB1"
    )), __temp = await __temp, __restore(), __temp);
    if (exhibition.value?.id) {
      const { ssrContext } = useNuxtApp();
      if (ssrContext && ssrContext.res) {
        ssrContext.res.setHeader(
          "Netlify-Cache-Tag",
          `exhibition-${exhibition.value.id}`
        );
      }
    }
    useHead({
      title: exhibition.value?.data.meta_title,
      meta: [
        { name: "description", content: exhibition.value?.data.meta_description },
        { property: "og:title", content: exhibition.value?.data.meta_title },
        { property: "og:description", content: exhibition.value?.data.meta_description },
        { property: "og:image", content: exhibition.value?.data.meta_image?.url },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: exhibition.value?.data.meta_title },
        { name: "twitter:description", content: exhibition.value?.data.meta_description },
        { name: "twitter:image", content: exhibition.value?.data.meta_image?.url }
      ]
    });
    const formatDateTime = (timestamp) => {
      const date = new Date(timestamp);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PrismicRichText = _sfc_main$7;
      const _component_PrismicImage = _sfc_main$b;
      _push(`<div${ssrRenderAttrs(_attrs)}><h1>${ssrInterpolate(unref(exhibition)?.data.title)}</h1>`);
      if (unref(exhibition)?.data.description) {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_PrismicRichText, {
          field: unref(exhibition).data.description
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(exhibition)?.data.cover_image) {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_PrismicImage, {
          field: unref(exhibition).data.cover_image
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(exhibition)?.data.date_and_time) {
        _push(`<div><p>Date: ${ssrInterpolate(formatDateTime(unref(exhibition).data.date_and_time))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/exhibitions/[uid].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_uid_-ClxcFN-b.mjs.map
