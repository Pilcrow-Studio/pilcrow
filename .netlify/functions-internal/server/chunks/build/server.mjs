import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { defineComponent, shallowRef, h, resolveComponent, inject, hasInjectionContext, computed, toValue, getCurrentInstance, onServerPrefetch, createBlock, createCommentVNode, openBlock, withCtx, createElementBlock, Fragment, renderList, resolveDynamicComponent, mergeProps, watchEffect, unref, normalizeProps, guardReactiveProps, renderSlot, createTextVNode, toDisplayString, ref, toRef, nextTick, watch, createVNode, normalizeClass, provide, cloneVNode, defineAsyncComponent, shallowReactive, useSSRContext, createApp, onErrorCaptured, reactive, effectScope, isReadonly, isRef, isShallow, isReactive, toRaw, Suspense, getCurrentScope } from 'vue';
import { V as parseQuery, c as createError$1, W as headSymbol, X as defu, Y as useHead$1, x as hasProtocol, z as joinURL, Z as withQuery, L as withTrailingSlash, _ as withoutTrailingSlash, $ as isScriptProtocol, a0 as getContext, a1 as sanitizeStatusCode, a2 as $fetch, a3 as baseURL, a4 as createHooks, a5 as executeAsync, a6 as titleCase, a7 as toRouteMatcher, a8 as createRouter$1, a9 as camelCase, P as parseURL, aa as withoutBase, n as destr, ab as klona, ac as useSeoMeta$1, ad as stringifyQuery, ae as parse$1, af as getRequestHeader, ag as isEqual, ah as withLeadingSlash, ai as withBase, aj as setCookie, ak as getCookie, al as deleteCookie, am as resolveUnrefHeadInput } from '../nitro/nitro.mjs';
import { createPinia, setActivePinia, shouldHydrate } from 'pinia';
import { routerKey, useRoute as useRoute$1, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { InferSeoMetaPlugin } from '@unhead/addons';
import { TemplateParamsPlugin } from 'unhead/plugins';
import { defineWebSite, defineWebPage, SchemaOrgUnheadPlugin } from '@unhead/schema-org/vue';
import { parse, stringify } from 'devalue';
import { isFilled, asImageWidthSrcSet, asImagePixelDensitySrcSet, asLinkAttrs, asHTML, createClient, documentToLinkField, asImageSrc, asDate, asText, cookie, filter, asLink } from '@prismicio/client';
import { asTree } from '@prismicio/client/richtext';
import { DEV } from 'esm-env';
import { debounce } from 'perfect-debounce';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind3';
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
import 'unhead/utils';
import 'vue-bundle-renderer/runtime';
import 'node:url';
import 'ipx';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const appLayoutTransition = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "deep": false };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    versions: {
      get nuxt() {
        return "4.1.1";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
const definePayloadPlugin = defineNuxtPlugin;
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const nuxtApp = useNuxtApp();
    const error2 = useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || useNuxtApp();
  return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
    if (hasInjectionContext()) {
      const head = inject(headSymbol);
      if (!head) {
        throw new Error("[nuxt] [unhead] Missing Unhead instance.");
      }
      return head;
    }
  });
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  return useHead$1(input, { head, ...options });
}
function useSeoMeta(input, options = {}) {
  const head = injectHead(options.nuxt);
  return useSeoMeta$1(input, { head, ...options });
}
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const payloadPlugin = definePayloadPlugin(() => {
  definePayloadReducer(
    "skipHydrate",
    // We need to return something truthy to be treated as a match
    (data) => !shouldHydrate(data) && 1
  );
});
const unhead_1D1fUOGXS4VJl8WVMs3DdkWkgzDzaBl_YViS7wJheJo = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
const __nuxt_page_meta = {
  layout: "artwork"
};
const _routes = [
  {
    name: "prismic-preview",
    path: "/api/preview",
    component: () => import('./PrismicPreview-LbTaZjMy.mjs')
  },
  {
    name: "bio",
    path: "/bio",
    component: () => import('./bio-BqhHbEQv.mjs')
  },
  {
    name: "uid",
    path: "/:uid()",
    component: () => import('./_uid_-DAQ9vRCC.mjs')
  },
  {
    name: "index",
    path: "/",
    component: () => import('./index-DAX-XSTS.mjs')
  },
  {
    name: "work-uid",
    path: "/work/:uid()",
    meta: __nuxt_page_meta || {},
    component: () => import('./_uid_-BZpW3Xwr.mjs')
  },
  {
    name: "slice-simulator",
    path: "/slice-simulator",
    component: () => import('./slice-simulator-B7KBU_d8.mjs')
  },
  {
    name: "exhibitions-uid",
    path: "/exhibitions/:uid()",
    component: () => import('./_uid_-ClxcFN-b.mjs')
  }
];
const _wrapInTransition = (props, children) => {
  return { default: () => children.default?.() };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION) {
        resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  const isPageNavigation = isChangingPage(to, from);
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isPageNavigation ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      if (to.matched[to.matched.length - 1]?.components?.default === from.matched[from.matched.length - 1]?.components?.default) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    useError();
    if (!nuxtApp.ssrContext?.islandContext) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false) ;
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0) {
        return nuxtApp.runWithContext(() => showError(createError({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const onNuxtReady = (callback) => {
  {
    return;
  }
};
function useAsyncData(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  let [_key, _handler, options = {}] = args;
  const key = computed(() => toValue(_key));
  if (typeof key.value !== "string") {
    throw new TypeError("[nuxt] [useAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  options.server ??= true;
  options.default ??= getDefault;
  options.getCachedData ??= getDefaultCachedData;
  options.lazy ??= false;
  options.immediate ??= true;
  options.deep ??= asyncDataDefaults.deep;
  options.dedupe ??= "cancel";
  options._functionName || "useAsyncData";
  nuxtApp._asyncData[key.value];
  const initialFetchOptions = { cause: "initial", dedupe: options.dedupe };
  if (!nuxtApp._asyncData[key.value]?._init) {
    initialFetchOptions.cachedData = options.getCachedData(key.value, nuxtApp, { cause: "initial" });
    nuxtApp._asyncData[key.value] = createAsyncData(nuxtApp, key.value, _handler, options, initialFetchOptions.cachedData);
  }
  const asyncData = nuxtApp._asyncData[key.value];
  asyncData._deps++;
  const initialFetch = () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncReturn = {
    data: writableComputedRef(() => nuxtApp._asyncData[key.value]?.data),
    pending: writableComputedRef(() => nuxtApp._asyncData[key.value]?.pending),
    status: writableComputedRef(() => nuxtApp._asyncData[key.value]?.status),
    error: writableComputedRef(() => nuxtApp._asyncData[key.value]?.error),
    refresh: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    execute: (...args2) => nuxtApp._asyncData[key.value].execute(...args2),
    clear: () => clearNuxtDataByKey(nuxtApp, key.value)
  };
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
  Object.assign(asyncDataPromise, asyncReturn);
  return asyncDataPromise;
}
function writableComputedRef(getter) {
  return computed({
    get() {
      return getter()?.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function useLazyAsyncData(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  const [key, handler, options = {}] = args;
  return useAsyncData(key, handler, { ...options, lazy: true }, null);
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
async function refreshNuxtData(keys) {
  {
    return Promise.resolve();
  }
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = void 0;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = unref(nuxtApp._asyncData[key]._default());
    nuxtApp._asyncData[key].error.value = void 0;
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    if (nuxtApp._asyncDataPromises[key]) {
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function createAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  nuxtApp.payload._errors[key] ??= void 0;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = _handler ;
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData !== void 0;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: computed(() => asyncData.status.value === "pending"),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (...args) => {
      const [_opts, newValue = void 0] = args;
      const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
      if (nuxtApp._asyncDataPromises[key]) {
        if ((opts.dedupe ?? options.dedupe) === "defer") {
          return nuxtApp._asyncDataPromises[key];
        }
        nuxtApp._asyncDataPromises[key].cancelled = true;
      }
      {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
        if (cachedData !== void 0) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = void 0;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      asyncData.status.value = "pending";
      const promise = new Promise(
        (resolve, reject) => {
          try {
            resolve(handler(nuxtApp));
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = void 0;
        asyncData.status.value = "success";
      }).catch((error) => {
        if (promise.cancelled) {
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        if (promise.cancelled) {
          return;
        }
        delete nuxtApp._asyncDataPromises[key];
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      unsubRefreshAsyncData();
      if (nuxtApp._asyncData[key]?._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          if (!nuxtApp._asyncData[key]?._init) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => void 0;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.());
  const cookie2 = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie2.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie2.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie2.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie2.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie2;
}
function readRawCookies(opts = {}) {
  {
    return parse$1(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function isHashLinkWithoutHashMode(link) {
    return typeof link === "string" && link.startsWith("#");
  }
  function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
    const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
    if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hasTarget = computed(() => !!props.target && props.target !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = props.to || props.href || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (props.external) {
        return true;
      }
      const path = props.to || props.href || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = props.to || props.href || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, props.trailingSlash);
    });
    const link = isExternal.value ? void 0 : useBuiltinLink?.({ ...props, to });
    const href = computed(() => {
      const effectiveTrailingSlash = props.trailingSlash ?? options.trailingSlash;
      if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
        return to.value;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        return applyTrailingSlashBehavior(href2, effectiveTrailingSlash);
      }
      if (typeof to.value === "object") {
        return router.resolve(to.value)?.href ?? null;
      }
      return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: link?.isActive ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: link?.isExactActive ?? computed(() => to.value === router.currentRoute.value.path),
      route: link?.route ?? computed(() => router.resolve(to.value)),
      async navigate(_e) {
        await navigateTo(href.value, { replace: props.replace, external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Behavior
      trailingSlash: {
        type: String,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      shallowRef(false);
      const el = void 0;
      const elRef = void 0;
      async function prefetch(nuxtApp = useNuxtApp()) {
        {
          return;
        }
      }
      return () => {
        if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", {
          ref: el,
          href: href.value || null,
          // converts `""` to `null` to prevent the attribute from being added as empty (`href=""`)
          rel,
          target,
          onClick: (event) => {
            if (isExternal.value || hasTarget.value) {
              return;
            }
            event.preventDefault();
            return props.replace ? router.replace(href.value) : router.push(href.value);
          }
        }, slots.default?.());
      };
    }
    // }) as unknown as DefineComponent<NuxtLinkProps, object, object, ComputedOptions, MethodOptions, object, object, EmitsOptions, string, object, NuxtLinkProps, object, SlotsType<NuxtLinkSlots>>
  });
}
const __nuxt_component_2 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
const _0_siteConfig_7sElAad_E7kQulys29hLsJtJN2Qgy4nawEOY_VkQ7_U = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-site-config:init",
  enforce: "pre",
  async setup(nuxtApp) {
    const stack = useRequestEvent()?.context?.siteConfig;
    const state = useState("site-config");
    {
      nuxtApp.hooks.hook("app:rendered", () => {
        state.value = stack?.get({
          debug: (/* @__PURE__ */ useRuntimeConfig())["nuxt-site-config"].debug,
          resolveRefs: true
        });
      });
    }
    return {
      provide: {
        nuxtSiteConfig: stack
      }
    };
  }
});
const VALID_ISLAND_KEY_RE = /^[a-z][a-z\d-]*_[a-z\d]+$/i;
function isValidIslandKey(key) {
  return typeof key === "string" && VALID_ISLAND_KEY_RE.test(key) && key.length <= 100;
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
{
  reducers.push(["Island", (data) => data && data?.__nuxt_island && isValidIslandKey(data.__nuxt_island.key) && data.__nuxt_island]);
}
const revive_payload_server_n1AlfGORgF_ktGUsnqfaHO_ralshCj_1RP8grIXsy1Q = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "pinia",
  setup(nuxtApp) {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
    setActivePinia(pinia);
    {
      nuxtApp.payload.pinia = toRaw(pinia.state.value);
    }
    return {
      provide: {
        pinia
      }
    };
  }
});
const components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
function useSiteConfig(options) {
  const stack = useRequestEvent()?.context.siteConfig.get(defu({ resolveRefs: true }, options));
  delete stack._priority;
  return stack;
}
const siteConfig_OYG4NKHYqqpptRzrGBUYLOTURIgbf42K8drCiXLjiZ8 = /* @__PURE__ */ defineNuxtPlugin(() => {
  const head = injectHead();
  if (!head)
    return;
  const siteConfig = useSiteConfig();
  const input = {
    meta: [],
    templateParams: {
      site: siteConfig,
      // support legacy
      siteUrl: siteConfig.url,
      siteName: siteConfig.name
    }
  };
  if (siteConfig.separator)
    input.templateParams.separator = siteConfig.separator;
  if (siteConfig.titleSeparator)
    input.templateParams.titleSeparator = siteConfig.titleSeparator;
  if (siteConfig.description) {
    input.templateParams.siteDescription = siteConfig.description;
    input.meta.push(
      {
        name: "description",
        content: "%site.description",
        tagPriority: "low"
      }
    );
  }
  head.push(input);
});
const inferSeoMetaPlugin_sikvJ1ir5o__xpTTf7XTXwfm19ZJzxT3aWJWhjXx_0w = /* @__PURE__ */ defineNuxtPlugin(() => {
  const head = injectHead();
  if (!head)
    return;
  head.use(TemplateParamsPlugin);
  head.use(InferSeoMetaPlugin());
});
const titles_8MAVGgyp4WrlrojDQr6iwFKbMFjuasnXRkZB3A1_H10 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-seo:fallback-titles",
  env: {
    islands: false
  },
  setup() {
    const route = useRoute();
    const err = useError();
    const title = computed(() => {
      if (err.value && [404, 500].includes(err.value?.statusCode)) {
        return `${err.value.statusCode} - ${err.value.message}`;
      }
      if (typeof route.meta?.title === "string")
        return route.meta?.title;
      const path = withoutTrailingSlash(route.path || "/");
      const lastSegment = path.split("/").pop();
      return lastSegment ? titleCase(lastSegment) : null;
    });
    const minimalPriority = {
      // give nuxt.config values higher priority
      tagPriority: 101
    };
    useHead({ title: () => title.value }, minimalPriority);
  }
});
function useSchemaOrgConfig() {
  const runtimeConfig = /* @__PURE__ */ useRuntimeConfig();
  return defu(runtimeConfig["nuxt-schema-org"], {
    scriptAttributes: {}
  });
}
function useSchemaOrg(input) {
  const config = useSchemaOrgConfig();
  const script = {
    type: "application/ld+json",
    key: "schema-org-graph",
    // @ts-expect-error untyped
    nodes: input,
    tagPriority: "high",
    ...config.scriptAttributes
  };
  {
    return useHead({
      script: [script]
    });
  }
}
function resolveSitePath(pathOrUrl, options) {
  let path = pathOrUrl;
  if (hasProtocol(pathOrUrl, { strict: false, acceptRelative: true })) {
    const parsed = parseURL(pathOrUrl);
    path = parsed.pathname;
  }
  const base = withLeadingSlash(options.base || "/");
  if (base !== "/" && path.startsWith(base)) {
    path = path.slice(base.length);
  }
  let origin = withoutTrailingSlash(options.absolute ? options.siteUrl : "");
  if (base !== "/" && origin.endsWith(base)) {
    origin = origin.slice(0, origin.indexOf(base));
  }
  const baseWithOrigin = options.withBase ? withBase(base, origin || "/") : origin;
  const resolvedUrl = withBase(path, baseWithOrigin);
  return path === "/" && !options.withBase ? withTrailingSlash(resolvedUrl) : fixSlashes(options.trailingSlash, resolvedUrl);
}
const fileExtensions = [
  // Images
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "svg",
  "ico",
  // Documents
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "md",
  "markdown",
  // Archives
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
  // Audio
  "mp3",
  "wav",
  "flac",
  "ogg",
  "opus",
  "m4a",
  "aac",
  "midi",
  "mid",
  // Video
  "mp4",
  "avi",
  "mkv",
  "mov",
  "wmv",
  "flv",
  "webm",
  // Web
  "html",
  "css",
  "js",
  "json",
  "xml",
  "tsx",
  "jsx",
  "ts",
  "vue",
  "svelte",
  "xsl",
  "rss",
  "atom",
  // Programming
  "php",
  "py",
  "rb",
  "java",
  "c",
  "cpp",
  "h",
  "go",
  // Data formats
  "csv",
  "tsv",
  "sql",
  "yaml",
  "yml",
  // Fonts
  "woff",
  "woff2",
  "ttf",
  "otf",
  "eot",
  // Executables/Binaries
  "exe",
  "msi",
  "apk",
  "ipa",
  "dmg",
  "iso",
  "bin",
  // Scripts/Config
  "bat",
  "cmd",
  "sh",
  "env",
  "htaccess",
  "conf",
  "toml",
  "ini",
  // Package formats
  "deb",
  "rpm",
  "jar",
  "war",
  // E-books
  "epub",
  "mobi",
  // Common temporary/backup files
  "log",
  "tmp",
  "bak",
  "old",
  "sav"
];
function isPathFile(path) {
  const lastSegment = path.split("/").pop();
  const ext = (lastSegment || path).match(/\.[0-9a-z]+$/i)?.[0];
  return ext && fileExtensions.includes(ext.replace(".", ""));
}
function fixSlashes(trailingSlash, pathOrUrl) {
  const $url = parseURL(pathOrUrl);
  if (isPathFile($url.pathname))
    return pathOrUrl;
  const fixedPath = trailingSlash ? withTrailingSlash($url.pathname) : withoutTrailingSlash($url.pathname);
  return `${$url.protocol ? `${$url.protocol}//` : ""}${$url.host || ""}${fixedPath}${$url.search || ""}${$url.hash || ""}`;
}
function useNitroOrigin(e) {
  {
    e = e || useRequestEvent();
    return e?.context?.siteConfigNitroOrigin || "";
  }
}
function createSitePathResolver(options = {}) {
  const siteConfig = useSiteConfig();
  const nitroOrigin = useNitroOrigin();
  const nuxtBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL || "/";
  return (path) => {
    return computed(() => resolveSitePath(unref(path), {
      absolute: unref(options.absolute),
      withBase: unref(options.withBase),
      siteUrl: unref(options.canonical) !== false || false ? siteConfig.url : nitroOrigin,
      trailingSlash: siteConfig.trailingSlash,
      base: nuxtBase
    }));
  };
}
function withSiteUrl(path, options = {}) {
  const siteConfig = useSiteConfig();
  const nitroOrigin = useNitroOrigin();
  const base = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL || "/";
  return computed(() => {
    return resolveSitePath(unref(path), {
      absolute: true,
      siteUrl: unref(options.canonical) !== false || false ? siteConfig.url : nitroOrigin,
      trailingSlash: siteConfig.trailingSlash,
      base,
      withBase: unref(options.withBase)
    });
  });
}
function initPlugin(nuxtApp) {
  const head = injectHead();
  const config = useSchemaOrgConfig();
  const route = useRoute();
  const siteConfig = useSiteConfig();
  const resolvePath = createSitePathResolver({
    absolute: false,
    withBase: true
  });
  const resolveUrl = createSitePathResolver({
    canonical: true,
    absolute: true,
    withBase: true
  });
  const schemaOrg = computed(() => {
    const siteConfigResolved = {};
    for (const key in siteConfig) {
      if (key.startsWith("_")) {
        continue;
      }
      siteConfigResolved[key] = toValue(siteConfig[key]);
      if (typeof siteConfigResolved[key] === "object") {
        for (const k in siteConfigResolved[key]) {
          siteConfigResolved[key][k] = toValue(siteConfigResolved[key][k]);
        }
      }
    }
    return {
      ...route.meta?.schemaOrg || {},
      ...siteConfigResolved,
      url: toValue(resolveUrl(route.path)),
      host: withTrailingSlash(siteConfigResolved.url),
      inLanguage: toValue(siteConfigResolved.currentLocale) || toValue(siteConfigResolved.defaultLocale),
      path: toValue(resolvePath(route.path))
    };
  });
  const templateParamEntry = useHead({
    templateParams: { schemaOrg: schemaOrg.value }
  });
  watch(() => siteConfig, () => {
    templateParamEntry.patch({
      templateParams: { schemaOrg: schemaOrg.value }
    });
  }, { deep: true });
  head.use(
    SchemaOrgUnheadPlugin({}, async () => {
      const meta = {};
      await nuxtApp.hooks.callHook("schema-org:meta", meta);
      return meta;
    }, {
      minify: config.minify,
      trailingSlash: siteConfig.trailingSlash
    })
  );
}
function maybeAddIdentitySchemaOrg() {
  const config = useSchemaOrgConfig();
  const siteConfig = useSiteConfig({
    resolveRefs: true
  });
  if (config.identity || siteConfig.identity) {
    const identity = config.identity || siteConfig.identity;
    let identityPayload = {
      name: () => toValue(siteConfig.name),
      url: () => toValue(siteConfig.url)
    };
    let identityType;
    if (typeof identity !== "string") {
      identityPayload = {
        ...identityPayload,
        ...identity
      };
      identityType = identity.type;
      delete identityPayload.type;
    } else {
      identityType = identity;
    }
    if (siteConfig.twitter) {
      const id = siteConfig.twitter.startsWith("@") ? siteConfig.twitter.slice(1) : siteConfig.twitter;
      identityPayload.sameAs = [
        `https://twitter.com/${id}`
      ];
    }
    identityPayload._resolver = identityPayload._resolver || camelCase(identityType);
    useSchemaOrg([identityPayload]);
  }
}
const defaults_54CssQLVS8g_jeX5dMGDVegdJxaa0C9gQzDrSiH8aWc = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-schema-org:defaults",
  dependsOn: [
    "nuxt-schema-org:init"
  ],
  setup() {
    const error = useError();
    if (error.value?.error) {
      return;
    }
    const siteConfig = useSiteConfig();
    useSchemaOrg([
      defineWebSite({
        name: () => toValue(siteConfig.name) || "",
        inLanguage: () => toValue(siteConfig.currentLocale) || "",
        description: () => toValue(siteConfig.description) || ""
      }),
      defineWebPage()
    ]);
    maybeAddIdentitySchemaOrg();
  }
});
const init_2_MeG37Fd6F8dkeyTIxo2gBwQWVaILOgtnQAdY4wQoc = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-schema-org:init",
  setup(nuxtApp) {
    initPlugin(nuxtApp);
  }
});
const componentNames = [{ "hash": "SOHaoKfoo4fUkREsCFGw8ewxkl4-XkkHkug2VwYRtFM", "pascalName": "BrandedLogo", "kebabName": "branded-logo", "path": "/Users/jonaslinnestad/Desktop/Projects/gauken/node_modules/.pnpm/nuxt-og-image@5.1.9_@unhead+vue@2.0.14_vue@3.5.21_typescript@5.9.2___h3@1.15.4_magicast_7c48f0e2d07a55595b66d2168db230b3/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/BrandedLogo.vue", "category": "community" }, { "hash": "tFoYPh0fXaZR3uXybAqFEOGnQuQsvz-E-Yq-CtrFlIY", "pascalName": "Frame", "kebabName": "frame", "path": "/Users/jonaslinnestad/Desktop/Projects/gauken/node_modules/.pnpm/nuxt-og-image@5.1.9_@unhead+vue@2.0.14_vue@3.5.21_typescript@5.9.2___h3@1.15.4_magicast_7c48f0e2d07a55595b66d2168db230b3/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/Frame.vue", "category": "community" }, { "hash": "NPQTTXYQ8toXx5OaJ1VlRUUcxy1SNOxg-FoM7C08ZPM", "pascalName": "Nuxt", "kebabName": "nuxt", "path": "/Users/jonaslinnestad/Desktop/Projects/gauken/node_modules/.pnpm/nuxt-og-image@5.1.9_@unhead+vue@2.0.14_vue@3.5.21_typescript@5.9.2___h3@1.15.4_magicast_7c48f0e2d07a55595b66d2168db230b3/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/Nuxt.vue", "category": "community" }, { "hash": "VAHSTZlVcPHzkozocV1iTnwc4-YttdoOkHsYfoSgDZ4", "pascalName": "NuxtSeo", "kebabName": "nuxt-seo", "path": "/Users/jonaslinnestad/Desktop/Projects/gauken/node_modules/.pnpm/nuxt-og-image@5.1.9_@unhead+vue@2.0.14_vue@3.5.21_typescript@5.9.2___h3@1.15.4_magicast_7c48f0e2d07a55595b66d2168db230b3/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/NuxtSeo.vue", "category": "community" }, { "hash": "8CNn4yU043gQFqO-sZNDPz9GKED-h7ahXJ-61c9ThHM", "pascalName": "Pergel", "kebabName": "pergel", "path": "/Users/jonaslinnestad/Desktop/Projects/gauken/node_modules/.pnpm/nuxt-og-image@5.1.9_@unhead+vue@2.0.14_vue@3.5.21_typescript@5.9.2___h3@1.15.4_magicast_7c48f0e2d07a55595b66d2168db230b3/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/Pergel.vue", "category": "community" }, { "hash": "b-Juo-FXQepo6SOCnA478MTAqbXNZuve6-MzHgTKA7s", "pascalName": "SimpleBlog", "kebabName": "simple-blog", "path": "/Users/jonaslinnestad/Desktop/Projects/gauken/node_modules/.pnpm/nuxt-og-image@5.1.9_@unhead+vue@2.0.14_vue@3.5.21_typescript@5.9.2___h3@1.15.4_magicast_7c48f0e2d07a55595b66d2168db230b3/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/SimpleBlog.vue", "category": "community" }, { "hash": "vRUm5ru-64PEHIGsBby6-vCgLBg7iUJfvFKL6VuCXtI", "pascalName": "UnJs", "kebabName": "un-js", "path": "/Users/jonaslinnestad/Desktop/Projects/gauken/node_modules/.pnpm/nuxt-og-image@5.1.9_@unhead+vue@2.0.14_vue@3.5.21_typescript@5.9.2___h3@1.15.4_magicast_7c48f0e2d07a55595b66d2168db230b3/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/UnJs.vue", "category": "community" }, { "hash": "hq07GBU-Yd16ICfETt8SfSxfaYj3qBmDAiQkTcv89nw", "pascalName": "Wave", "kebabName": "wave", "path": "/Users/jonaslinnestad/Desktop/Projects/gauken/node_modules/.pnpm/nuxt-og-image@5.1.9_@unhead+vue@2.0.14_vue@3.5.21_typescript@5.9.2___h3@1.15.4_magicast_7c48f0e2d07a55595b66d2168db230b3/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/Wave.vue", "category": "community" }, { "hash": "zSwOodBXcjwS1qvFqGBJqitTEEnrvVfwQYkTeIxNpws", "pascalName": "WithEmoji", "kebabName": "with-emoji", "path": "/Users/jonaslinnestad/Desktop/Projects/gauken/node_modules/.pnpm/nuxt-og-image@5.1.9_@unhead+vue@2.0.14_vue@3.5.21_typescript@5.9.2___h3@1.15.4_magicast_7c48f0e2d07a55595b66d2168db230b3/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/WithEmoji.vue", "category": "community" }];
function generateMeta(url, resolvedOptions) {
  const meta = [
    { property: "og:image", content: url },
    { property: "og:image:type", content: () => `image/${getExtension(toValue(url)) || resolvedOptions.extension}` },
    { name: "twitter:card", content: "summary_large_image" },
    // we don't need this but avoids issue when using useSeoMeta({ twitterImage })
    { name: "twitter:image", content: url },
    { name: "twitter:image:src", content: url }
  ];
  if (resolvedOptions.width) {
    meta.push({ property: "og:image:width", content: resolvedOptions.width });
    meta.push({ name: "twitter:image:width", content: resolvedOptions.width });
  }
  if (resolvedOptions.height) {
    meta.push({ property: "og:image:height", content: resolvedOptions.height });
    meta.push({ name: "twitter:image:height", content: resolvedOptions.height });
  }
  if (resolvedOptions.alt) {
    meta.push({ property: "og:image:alt", content: resolvedOptions.alt });
    meta.push({ name: "twitter:image:alt", content: resolvedOptions.alt });
  }
  return meta;
}
function isInternalRoute(path) {
  return path.startsWith("/_") || path.startsWith("@");
}
function filterIsOgImageOption(key) {
  const keys = [
    "url",
    "extension",
    "width",
    "height",
    "fonts",
    "alt",
    "props",
    "renderer",
    "html",
    "component",
    "renderer",
    "emojis",
    "_query",
    "satori",
    "resvg",
    "sharp",
    "screenshot",
    "cacheMaxAgeSeconds"
  ];
  return keys.includes(key);
}
function separateProps(options, ignoreKeys = []) {
  options = options || {};
  const _props = defu(options.props, Object.fromEntries(
    Object.entries({ ...options }).filter(([k]) => !filterIsOgImageOption(k) && !ignoreKeys.includes(k))
  ));
  const props = {};
  Object.entries(_props).forEach(([key, val]) => {
    props[key.replace(/-([a-z])/g, (g) => String(g[1]).toUpperCase())] = val;
  });
  return {
    ...Object.fromEntries(
      Object.entries({ ...options }).filter(([k]) => filterIsOgImageOption(k) || ignoreKeys.includes(k))
    ),
    props
  };
}
function withoutQuery(path) {
  return path.split("?")[0];
}
function getExtension(path) {
  path = withoutQuery(path);
  const lastSegment = path.split("/").pop() || path;
  const extension = lastSegment.split(".").pop() || lastSegment;
  if (extension === "jpg")
    return "jpeg";
  return extension;
}
function createOgImageMeta(src, input, ssrContext) {
  const { defaults } = useOgImageRuntimeConfig();
  const _input = separateProps(defu(input, ssrContext._ogImagePayload));
  if (input._query && Object.keys(input._query).length)
    src = withQuery(src, { _query: input._query });
  const meta = generateMeta(src, input);
  ssrContext._ogImageInstances = ssrContext._ogImageInstances || [];
  const script = [];
  if (src) {
    script.push({
      id: "nuxt-og-image-options",
      type: "application/json",
      processTemplateParams: true,
      innerHTML: () => {
        const payload = resolveUnrefHeadInput(_input);
        if (payload.props && typeof payload.props.title === "undefined")
          payload.props.title = "%s";
        payload.component = resolveComponentName(input.component, defaults.component || "");
        delete payload.url;
        if (payload._query && Object.keys(payload._query).length === 0) {
          delete payload._query;
        }
        const final = {};
        for (const k in payload) {
          if (payload[k] !== defaults[k]) {
            final[k] = payload[k];
          }
        }
        return stringify(final);
      },
      // we want this to be last in our head
      tagPosition: "bodyClose"
    });
  }
  const instance = useHead({
    script,
    meta
  }, {
    tagPriority: "high"
  });
  ssrContext._ogImagePayload = _input;
  ssrContext._ogImageInstances.push(instance);
}
function resolveComponentName(component, fallback) {
  component = component || fallback || componentNames?.[0]?.pascalName;
  if (component && componentNames) {
    const originalName = component;
    for (const component2 of componentNames) {
      if (component2.pascalName.endsWith(originalName) || component2.kebabName.endsWith(originalName)) {
        return component2.pascalName;
      }
    }
  }
  return component;
}
function getOgImagePath(pagePath, _options) {
  const baseURL2 = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
  const extension = _options?.extension || useOgImageRuntimeConfig().defaults.extension;
  const path = joinURL("/", baseURL2, `__og-image__/${"image"}`, pagePath, `og.${extension}`);
  if (Object.keys(_options?._query || {}).length) {
    return withQuery(path, _options._query);
  }
  return path;
}
function useOgImageRuntimeConfig() {
  const c = /* @__PURE__ */ useRuntimeConfig();
  return {
    ...c["nuxt-og-image"],
    app: {
      baseURL: c.app.baseURL
    }
  };
}
function ogImageCanonicalUrls(nuxtApp) {
  nuxtApp.hooks.hook("app:rendered", async (ctx) => {
    const { ssrContext } = ctx;
    const e = useRequestEvent();
    const path = parseURL(e?.path || "").pathname;
    if (isInternalRoute(path))
      return;
    ssrContext?.head.use(TemplateParamsPlugin);
    ssrContext?.head.use({
      key: "nuxt-og-image:overrides-and-canonical-urls",
      hooks: {
        "tags:resolve": async (ctx2) => {
          const hasPrimaryPayload = ctx2.tags.some((tag) => tag.tag === "script" && tag.props.id === "nuxt-og-image-options");
          let overrides;
          for (const tag of ctx2.tags) {
            if (tag.tag === "script" && tag.props.id === "nuxt-og-image-overrides") {
              if (hasPrimaryPayload) {
                overrides = separateProps(parse(tag.innerHTML || "{}"));
                delete ctx2.tags[ctx2.tags.indexOf(tag)];
              } else {
                tag.props.id = "nuxt-og-image-options";
                tag.innerHTML = stringify(separateProps(parse(tag.innerHTML || "{}")));
                tag._d = "script:id:nuxt-og-image-options";
              }
              break;
            }
          }
          ctx2.tags = ctx2.tags.filter(Boolean);
          for (const tag of ctx2.tags) {
            if (tag.tag === "meta" && (tag.props.property === "og:image" || ["twitter:image:src", "twitter:image"].includes(tag.props.name || ""))) {
              if (!tag.props.content) {
                tag.props = {};
                continue;
              }
              if (!tag.props.content?.startsWith("https")) {
                await nuxtApp.runWithContext(() => {
                  tag.props.content = toValue(withSiteUrl(tag.props.content || "", {
                    withBase: true
                  }));
                });
              }
            } else if (overrides && tag.tag === "script" && tag.props.id === "nuxt-og-image-options") {
              tag.innerHTML = stringify(defu(overrides, parse(tag.innerHTML || "{}")));
            }
          }
        }
      }
    });
  });
}
function routeRuleOgImage(nuxtApp) {
  nuxtApp.hooks.hook("app:rendered", async (ctx) => {
    const { ssrContext } = ctx;
    const e = useRequestEvent();
    const path = parseURL(e?.path || "").pathname;
    if (isInternalRoute(path))
      return;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: ssrContext?.runtimeConfig?.nitro?.routeRules })
    );
    const matchedRules = _routeRulesMatcher.matchAll(
      withoutBase(path.split("?")?.[0] || "", ssrContext?.runtimeConfig?.app.baseURL || "")
    ).reverse();
    const combinedRules = defu({}, ...matchedRules);
    let routeRules = combinedRules?.ogImage;
    if (typeof routeRules === "undefined")
      return;
    const ogImageInstances = nuxtApp.ssrContext._ogImageInstances || [];
    if (routeRules === false) {
      ogImageInstances?.forEach((e2) => {
        e2.dispose();
      });
      nuxtApp.ssrContext._ogImagePayload = void 0;
      nuxtApp.ssrContext._ogImageInstances = void 0;
      return;
    }
    routeRules = defu(nuxtApp.ssrContext?.event?.context._nitro?.routeRules?.ogImage, routeRules);
    const src = getOgImagePath(ssrContext.url, routeRules);
    createOgImageMeta(src, routeRules, nuxtApp.ssrContext);
  });
}
const og_image_canonical_urls_server_y_egopZ_o54TfCnrXL_d24lRhNk3gjdQe92DxuiA9PM = /* @__PURE__ */ defineNuxtPlugin({
  setup(nuxtApp) {
    ogImageCanonicalUrls(nuxtApp);
  }
});
const route_rule_og_image_server_yQpg_tfAq6Gc8ifk6PeyeXot0jiyK5S7re5he3MACd4 = /* @__PURE__ */ defineNuxtPlugin({
  setup(nuxtApp) {
    routeRuleOgImage(nuxtApp);
  }
});
const robot_meta_server_B7f0jKF2Gs2fZmXR0C2Ki3LUWHlfXoReBOrWR2iRZCw = /* @__PURE__ */ defineNuxtPlugin({
  setup() {
    const event = useRequestEvent();
    const ctx = event?.context?.robots;
    if (!ctx)
      return;
    useHead({
      meta: [
        {
          "name": "robots",
          "content": () => ctx.rule || "",
          "data-hint": () => void 0
        }
      ]
    });
  }
});
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "Wrapper",
  props: {
    wrapper: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return _ctx.wrapper ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.wrapper), normalizeProps(mergeProps({ key: 0 }, _ctx.$attrs)), {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 16)) : renderSlot(_ctx.$slots, "default", { key: 1 });
    };
  }
});
const prismicKey = Symbol("prismic");
const usePrismic = () => {
  return inject(prismicKey, { options: { endpoint: "" } });
};
const version = "5.3.0";
const devMsg = (slug) => {
  return `https://prismic.dev/msg/vue/v${version}/${slug}`;
};
const isInternalURL = (url) => {
  const isInternal = /^\/(?!\/)/.test(url);
  const isSpecialLink = !isInternal && !/^https?:\/\//i.test(url);
  return isInternal && !isSpecialLink;
};
const defaultWrapper$1 = "div";
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  ...{ name: "DeprecatedPrismicRichText" },
  __name: "DeprecatedPrismicRichText",
  props: {
    field: {
      type: Array
    },
    fallback: {
      type: String
    },
    linkResolver: {
      type: Function
    },
    serializer: {
      type: [Object, Function]
    },
    wrapper: {
      type: [String, Object, Function]
    }
  },
  setup(__props) {
    const props = __props;
    const { options } = usePrismic();
    const html = computed(() => {
      if (!isFilled.richText(props.field)) {
        return props.fallback ?? "";
      }
      const linkResolver2 = props.linkResolver ?? options.linkResolver;
      const serializer = props.serializer ?? options.richTextSerializer;
      return asHTML(props.field, { linkResolver: linkResolver2, serializer });
    });
    const root = ref(null);
    const maybeRouter = inject(routerKey, null);
    let links = [];
    const navigate = function(event) {
      event.preventDefault();
      maybeRouter == null ? void 0 : maybeRouter.push(this.href);
    };
    const addListeners = () => {
      const node = root.value && "$el" in root.value ? root.value.$el : root.value;
      if (node && "querySelectorAll" in node) {
        links = Array.from(node.querySelectorAll("a")).map((element) => {
          const href = element.getAttribute("href");
          if (href && isInternalURL(href)) {
            const listener = navigate.bind({ href });
            element.addEventListener("click", listener);
            return { element, listener };
          } else {
            return false;
          }
        }).filter((link) => link);
      }
    };
    const removeListeners = () => {
      links.forEach(
        ({ element, listener }) => element.removeEventListener("click", listener)
      );
      links = [];
    };
    watch(html, () => {
      removeListeners();
      nextTick(addListeners);
    });
    return (_ctx, _cache) => {
      return unref(isFilled).richText(__props.field) || __props.fallback ? (openBlock(), createBlock(resolveDynamicComponent(__props.wrapper || defaultWrapper$1), {
        key: 0,
        ref_key: "root",
        ref: root,
        innerHTML: html.value
      }, null, 8, ["innerHTML"])) : createCommentVNode("", true);
    };
  }
});
const defaultWrapper = "div";
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  ...{ name: "PrismicEmbed" },
  __name: "PrismicEmbed",
  props: {
    field: {},
    wrapper: {}
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return unref(isFilled).embed(_ctx.field) ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.wrapper || defaultWrapper), {
        key: 0,
        "data-oembed": _ctx.field.embed_url,
        "data-oembed-type": _ctx.field.type,
        "data-oembed-provider": _ctx.field.provider_name,
        innerHTML: _ctx.field.html
      }, null, 8, ["data-oembed", "data-oembed-type", "data-oembed-provider", "innerHTML"])) : createCommentVNode("", true);
    };
  }
});
const _hoisted_1$1 = ["src", "srcset", "alt", "width", "height"];
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  ...{ name: "PrismicImage" },
  __name: "PrismicImage",
  props: {
    field: {},
    imgixParams: {},
    alt: {},
    fallbackAlt: {},
    width: {},
    height: {},
    widths: {},
    pixelDensities: {}
  },
  setup(__props) {
    const props = __props;
    const { options } = usePrismic();
    if (DEV) {
      watchEffect(() => {
        if (typeof props.alt === "string" && props.alt !== "") {
          console.warn(
            `[PrismicImage] The "alt" prop can only be used to declare an image as decorative by passing an empty string (alt="") but was provided a non-empty string. You can resolve this warning by removing the "alt" prop or changing it to alt="". For more details, see ${devMsg(
              "alt-must-be-an-empty-string"
            )}`
          );
        }
        if (typeof props.fallbackAlt === "string" && props.fallbackAlt !== "") {
          console.warn(
            `[PrismicImage] The "fallbackAlt" prop can only be used to declare an image as decorative by passing an empty string (fallbackAlt="") but was provided a non-empty string. You can resolve this warning by removing the "fallbackAlt" prop or changing it to fallbackAlt="". For more details, see ${devMsg(
              "alt-must-be-an-empty-string"
            )}`
          );
        }
        if (props.widths && props.pixelDensities) {
          console.warn(
            `[PrismicImage] Only one of "widths" or "pixelDensities" props can be provided. You can resolve this warning by removing either the "widths" or "pixelDensities" prop. "widths" will be used in this case.`
          );
        }
      });
    }
    const castInt = (input) => {
      if (typeof input === "number" || typeof input === "undefined") {
        return input;
      } else {
        const parsed = Number.parseInt(input);
        if (Number.isNaN(parsed)) {
          return void 0;
        } else {
          return parsed;
        }
      }
    };
    const image = computed(() => {
      var _a, _b;
      if (!isFilled.imageThumbnail(props.field)) {
        return;
      }
      let src;
      let srcSet;
      if (props.widths || !props.pixelDensities) {
        const res = asImageWidthSrcSet(props.field, {
          ...props.imgixParams,
          widths: props.widths === "defaults" ? (_a = options.components) == null ? void 0 : _a.imageWidthSrcSetDefaults : props.widths
        });
        src = res.src;
        srcSet = res.srcset;
      } else if (props.pixelDensities) {
        const res = asImagePixelDensitySrcSet(props.field, {
          ...props.imgixParams,
          pixelDensities: props.pixelDensities === "defaults" ? (_b = options.components) == null ? void 0 : _b.imagePixelDensitySrcSetDefaults : props.pixelDensities
        });
        src = res.src;
        srcSet = res.srcset;
      }
      const ar = props.field.dimensions.width / props.field.dimensions.height;
      const castedWidth = castInt(props.width);
      const castedHeight = castInt(props.height);
      let resolvedWidth = castedWidth ?? props.field.dimensions.width;
      let resolvedHeight = castedHeight ?? props.field.dimensions.height;
      if (castedWidth != null && castedHeight == null) {
        resolvedHeight = castedWidth / ar;
      } else if (castedWidth == null && castedHeight != null) {
        resolvedWidth = castedHeight * ar;
      }
      return {
        src,
        srcSet,
        alt: props.alt ?? (props.field.alt || props.fallbackAlt),
        width: Math.round(resolvedWidth),
        height: Math.round(resolvedHeight)
      };
    });
    return (_ctx, _cache) => {
      return image.value ? (openBlock(), createElementBlock("img", {
        key: 0,
        src: image.value.src,
        srcset: image.value.srcSet,
        alt: image.value.alt,
        width: image.value.width,
        height: image.value.height
      }, null, 8, _hoisted_1$1)) : createCommentVNode("", true);
    };
  }
});
const defaultInternalComponent = "router-link";
const defaultExternalComponent = "a";
const defaultExternalRelAttribute = "noreferrer";
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  ...{ name: "PrismicLink" },
  __name: "PrismicLink",
  props: {
    linkResolver: {},
    rel: { type: [String, Function] },
    internalComponent: {},
    externalComponent: {},
    field: {},
    document: {}
  },
  setup(__props) {
    const props = __props;
    const { options } = usePrismic();
    const rawAttrs = computed(() => {
      return asLinkAttrs(props.field || props.document, {
        linkResolver: props.linkResolver || options.linkResolver,
        rel(args) {
          var _a;
          const maybeRel = props.rel || ((_a = options.components) == null ? void 0 : _a.linkRel);
          if (maybeRel) {
            return typeof maybeRel === "function" ? maybeRel(args) : maybeRel;
          }
          return args.isExternal ? defaultExternalRelAttribute : void 0;
        }
      });
    });
    const component = computed(() => {
      var _a, _b;
      return isInternalURL(rawAttrs.value.href || "") ? props.internalComponent || ((_a = options.components) == null ? void 0 : _a.linkInternalComponent) || defaultInternalComponent : props.externalComponent || ((_b = options.components) == null ? void 0 : _b.linkExternalComponent) || defaultExternalComponent;
    });
    const attrs = computed(() => {
      return component.value === "a" ? {
        href: rawAttrs.value.href,
        target: rawAttrs.value.target,
        rel: rawAttrs.value.rel
      } : {
        to: rawAttrs.value.href,
        target: rawAttrs.value.target,
        rel: rawAttrs.value.rel
      };
    });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(component.value), normalizeProps(guardReactiveProps(attrs.value)), {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default", {}, () => [
            createTextVNode(toDisplayString(props.field && "text" in props.field ? props.field.text : void 0), 1)
          ])
        ]),
        _: 3
      }, 16);
    };
  }
});
const _hoisted_1 = ["dir"];
const _hoisted_2 = ["dir"];
const _hoisted_3 = ["dir"];
const _hoisted_4 = ["dir"];
const _hoisted_5 = ["dir"];
const _hoisted_6 = ["dir"];
const _hoisted_7 = ["dir"];
const _hoisted_8 = { key: 7 };
const _hoisted_9 = { key: 8 };
const _hoisted_10 = { key: 9 };
const _hoisted_11 = ["dir"];
const _hoisted_12 = ["dir"];
const _hoisted_13 = { key: 12 };
const _hoisted_14 = { key: 13 };
const _hoisted_15 = {
  key: 14,
  class: "block-img"
};
const _hoisted_16 = { key: 0 };
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  ...{ name: "PrismicRichTextDefaultComponent" },
  __name: "PrismicRichTextDefaultComponent",
  props: {
    node: {},
    linkResolver: {}
  },
  setup(__props) {
    const props = __props;
    const dir = computed(() => {
      return "direction" in props.node && props.node.direction === "rtl" ? "rtl" : void 0;
    });
    return (_ctx, _cache) => {
      return _ctx.node.type === "heading1" ? (openBlock(), createElementBlock("h1", {
        key: 0,
        dir: dir.value
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 8, _hoisted_1)) : _ctx.node.type === "heading2" ? (openBlock(), createElementBlock("h2", {
        key: 1,
        dir: dir.value
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 8, _hoisted_2)) : _ctx.node.type === "heading3" ? (openBlock(), createElementBlock("h3", {
        key: 2,
        dir: dir.value
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 8, _hoisted_3)) : _ctx.node.type === "heading4" ? (openBlock(), createElementBlock("h4", {
        key: 3,
        dir: dir.value
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 8, _hoisted_4)) : _ctx.node.type === "heading5" ? (openBlock(), createElementBlock("h5", {
        key: 4,
        dir: dir.value
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 8, _hoisted_5)) : _ctx.node.type === "heading6" ? (openBlock(), createElementBlock("h6", {
        key: 5,
        dir: dir.value
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 8, _hoisted_6)) : _ctx.node.type === "paragraph" ? (openBlock(), createElementBlock("p", {
        key: 6,
        dir: dir.value
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 8, _hoisted_7)) : _ctx.node.type === "preformatted" ? (openBlock(), createElementBlock("pre", _hoisted_8, [
        renderSlot(_ctx.$slots, "default")
      ])) : _ctx.node.type === "strong" ? (openBlock(), createElementBlock("strong", _hoisted_9, [
        renderSlot(_ctx.$slots, "default")
      ])) : _ctx.node.type === "em" ? (openBlock(), createElementBlock("em", _hoisted_10, [
        renderSlot(_ctx.$slots, "default")
      ])) : _ctx.node.type === "list-item" ? (openBlock(), createElementBlock("li", {
        key: 10,
        dir: dir.value
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 8, _hoisted_11)) : _ctx.node.type === "o-list-item" ? (openBlock(), createElementBlock("li", {
        key: 11,
        dir: dir.value
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 8, _hoisted_12)) : _ctx.node.type === "group-list-item" ? (openBlock(), createElementBlock("ul", _hoisted_13, [
        renderSlot(_ctx.$slots, "default")
      ])) : _ctx.node.type === "group-o-list-item" ? (openBlock(), createElementBlock("ol", _hoisted_14, [
        renderSlot(_ctx.$slots, "default")
      ])) : _ctx.node.type === "image" ? (openBlock(), createElementBlock("p", _hoisted_15, [
        _ctx.node.linkTo ? (openBlock(), createBlock(_sfc_main$a, {
          key: 0,
          field: _ctx.node.linkTo
        }, {
          default: withCtx(() => [
            createVNode(_sfc_main$b, { field: _ctx.node }, null, 8, ["field"])
          ]),
          _: 1
        }, 8, ["field"])) : (openBlock(), createBlock(_sfc_main$b, {
          key: 1,
          field: _ctx.node
        }, null, 8, ["field"]))
      ])) : _ctx.node.type === "embed" ? (openBlock(), createBlock(_sfc_main$c, {
        key: 15,
        field: _ctx.node.oembed
      }, null, 8, ["field"])) : _ctx.node.type === "hyperlink" ? (openBlock(), createBlock(_sfc_main$a, {
        key: 16,
        field: _ctx.node.data,
        "link-resolver": _ctx.linkResolver
      }, {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 8, ["field", "link-resolver"])) : _ctx.node.type === "label" ? (openBlock(), createElementBlock("span", {
        key: 17,
        class: normalizeClass(_ctx.node.data.label)
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 2)) : (openBlock(true), createElementBlock(Fragment, { key: 18 }, renderList(_ctx.node.text.split("\n"), (line, index) => {
        return openBlock(), createElementBlock(Fragment, { key: line }, [
          index > 0 ? (openBlock(), createElementBlock("br", _hoisted_16)) : createCommentVNode("", true),
          createTextVNode(toDisplayString(line), 1)
        ], 64);
      }), 128));
    };
  }
});
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  ...{ name: "PrismicRichTextSerialize" },
  __name: "PrismicRichTextSerialize",
  props: {
    components: {},
    children: {},
    linkResolver: {}
  },
  setup(__props) {
    const CHILD_TYPE_RENAMES = {
      "list-item": "listItem",
      "o-list-item": "oListItem",
      "group-list-item": "list",
      "group-o-list-item": "oList"
    };
    const props = __props;
    function getComponent(child) {
      var _a;
      return ((_a = props.components) == null ? void 0 : _a[CHILD_TYPE_RENAMES[child.type] || child.type]) || _sfc_main$9;
    }
    return (_ctx, _cache) => {
      const _component_PrismicRichTextSerialize = resolveComponent("PrismicRichTextSerialize", true);
      return openBlock(true), createElementBlock(Fragment, null, renderList(props.children, (child) => {
        return openBlock(), createBlock(resolveDynamicComponent(getComponent(child)), {
          key: JSON.stringify(child),
          node: child.node,
          "link-resolver": getComponent(child) === _sfc_main$9 ? props.linkResolver : void 0
        }, {
          default: withCtx(() => [
            child.children.length ? (openBlock(), createBlock(_component_PrismicRichTextSerialize, {
              key: 0,
              children: child.children,
              components: _ctx.components,
              "link-resolver": _ctx.linkResolver
            }, null, 8, ["children", "components", "link-resolver"])) : createCommentVNode("", true)
          ]),
          _: 2
        }, 1032, ["node", "link-resolver"]);
      }), 128);
    };
  }
});
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  ...{ name: "PrismicRichText" },
  __name: "PrismicRichText",
  props: {
    field: {
      type: Array
    },
    fallback: {
      type: [String, Object, Function]
    },
    components: {
      type: Object
    },
    linkResolver: {
      type: Function
    },
    serializer: {
      type: [Object, Function]
    },
    wrapper: {
      type: [String, Object, Function]
    }
  },
  setup(__props) {
    const props = __props;
    const { options } = usePrismic();
    const resolvedComponents = computed(() => {
      var _a;
      return props.components || ((_a = options.components) == null ? void 0 : _a.richTextComponents);
    });
    const resolvedLinkResolver = computed(() => {
      return props.linkResolver || options.linkResolver;
    });
    const children = computed(() => {
      return asTree(props.field || []).children;
    });
    const isModern = computed(() => {
      var _a;
      if (props.components) {
        return true;
      }
      if (props.serializer) {
        return false;
      }
      if ((_a = options.components) == null ? void 0 : _a.richTextComponents) {
        return true;
      }
      if (options.richTextSerializer) {
        return false;
      }
      return true;
    });
    if (DEV) {
      watchEffect(() => {
        if (props.components && props.serializer) {
          console.warn(
            `[PrismicRichText] Only one of "components" or "serializer" (deprecated) props can be provided. You can resolve this warning by removing either the "components" or "serializer" prop. "components" will be used in this case.`
          );
        }
      });
    }
    return (_ctx, _cache) => {
      return isModern.value && (unref(isFilled).richText(__props.field) || __props.fallback) ? (openBlock(), createBlock(_sfc_main$e, {
        key: 0,
        wrapper: __props.wrapper
      }, {
        default: withCtx(() => [
          children.value.length ? (openBlock(), createBlock(_sfc_main$8, {
            key: 0,
            children: children.value,
            components: resolvedComponents.value,
            "link-resolver": resolvedLinkResolver.value
          }, null, 8, ["children", "components", "link-resolver"])) : (openBlock(), createBlock(resolveDynamicComponent(__props.fallback), { key: 1 }))
        ]),
        _: 1
      }, 8, ["wrapper"])) : !isModern.value ? (openBlock(), createBlock(_sfc_main$d, {
        key: 1,
        field: __props.field,
        fallback: typeof __props.fallback === "string" ? __props.fallback : void 0,
        "link-resolver": __props.linkResolver,
        serializer: __props.serializer,
        wrapper: __props.wrapper
      }, null, 8, ["field", "fallback", "link-resolver", "serializer", "wrapper"])) : createCommentVNode("", true);
    };
  }
});
const table = () => ({
  table: { type: Object, required: true }
});
const thead = () => ({
  head: { type: Object, required: true }
});
const tbody = () => ({
  body: { type: Object, required: true }
});
const tr = () => ({
  row: {
    type: Object,
    required: true
  }
});
const th = () => ({
  cell: { type: Object, required: true }
});
const td = () => ({
  cell: { type: Object, required: true }
});
const defaultTableComponents = {
  table: defineComponent({
    props: table(),
    setup(props, { slots }) {
      return () => h("table", slots.default ? slots.default() : []);
    }
  }),
  thead: defineComponent({
    props: thead(),
    setup(props, { slots }) {
      return () => h("thead", slots.default ? slots.default() : []);
    }
  }),
  tbody: defineComponent({
    props: tbody(),
    setup(props, { slots }) {
      return () => h("tbody", slots.default ? slots.default() : []);
    }
  }),
  tr: defineComponent({
    props: tr(),
    setup(props, { slots }) {
      return () => h("tr", slots.default ? slots.default() : []);
    }
  }),
  th: defineComponent({
    props: th(),
    setup(props, { slots }) {
      return () => h("th", slots.default ? slots.default() : []);
    }
  }),
  td: defineComponent({
    props: td(),
    setup(props, { slots }) {
      return () => h("td", slots.default ? slots.default() : []);
    }
  })
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  ...{ name: "PrismicTableRow" },
  __name: "PrismicTableRow",
  props: {
    row: {},
    components: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(resolveDynamicComponent(props.components.tr), { row: _ctx.row }, {
        default: withCtx(() => [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.row.cells, (cell) => {
            return openBlock(), createElementBlock(Fragment, {
              key: cell.key
            }, [
              cell.type === "header" ? (openBlock(), createBlock(resolveDynamicComponent(props.components.th), {
                key: 0,
                cell
              }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$7, {
                    field: cell.content,
                    components: _ctx.components
                  }, null, 8, ["field", "components"])
                ]),
                _: 2
              }, 1032, ["cell"])) : (openBlock(), createBlock(resolveDynamicComponent(props.components.td), {
                key: 1,
                cell
              }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$7, {
                    field: cell.content,
                    components: props.components
                  }, null, 8, ["field", "components"])
                ]),
                _: 2
              }, 1032, ["cell"]))
            ], 64);
          }), 128))
        ]),
        _: 1
      }, 8, ["row"]);
    };
  }
});
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  ...{ name: "PrismicTable" },
  __name: "PrismicTable",
  props: {
    field: {},
    fallback: {},
    components: {}
  },
  setup(__props) {
    const props = __props;
    const mergedComponents = computed(() => ({
      ...defaultTableComponents,
      ...props.components
    }));
    return (_ctx, _cache) => {
      return unref(isFilled).table(_ctx.field) ? (openBlock(), createBlock(resolveDynamicComponent(mergedComponents.value.table), mergeProps({
        key: 0,
        table: _ctx.field
      }, _ctx.$attrs), {
        default: withCtx(() => [
          _ctx.field.head ? (openBlock(), createBlock(resolveDynamicComponent(mergedComponents.value.thead), {
            key: 0,
            head: _ctx.field.head
          }, {
            default: withCtx(() => [
              (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.field.head.rows, (row) => {
                return openBlock(), createBlock(_sfc_main$6, {
                  key: row.key,
                  row,
                  components: mergedComponents.value
                }, null, 8, ["row", "components"]);
              }), 128))
            ]),
            _: 1
          }, 8, ["head"])) : createCommentVNode("", true),
          (openBlock(), createBlock(resolveDynamicComponent(mergedComponents.value.tbody), {
            body: _ctx.field.body
          }, {
            default: withCtx(() => [
              (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.field.body.rows, (row) => {
                return openBlock(), createBlock(_sfc_main$6, {
                  key: row.key,
                  row,
                  components: mergedComponents.value
                }, null, 8, ["row", "components"]);
              }), 128))
            ]),
            _: 1
          }, 8, ["body"]))
        ]),
        _: 1
      }, 16, ["table"])) : (openBlock(), createBlock(resolveDynamicComponent(_ctx.fallback), { key: 1 }));
    };
  }
});
const TODOSliceComponent = DEV ? /* @__PURE__ */ defineComponent({
  name: "TODOSliceComponent",
  props: {
    slice: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const type = computed(() => {
      return "slice_type" in props.slice ? props.slice.slice_type : props.slice.type;
    });
    watchEffect(() => {
      console.warn(`[SliceZone] Could not find a component for Slice type "${type.value}"`, props.slice);
    });
    return () => {
      return h("section", {
        "data-slice-zone-todo-component": "",
        "data-slice-type": type.value
      }, [`Could not find a component for Slice type "${type.value}"`]);
    };
  }
}) : () => null;
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  ...{ name: "SliceZone" },
  __name: "SliceZone",
  props: {
    slices: {},
    components: {},
    defaultComponent: {},
    context: {},
    wrapper: {}
  },
  setup(__props) {
    const props = __props;
    const { options } = usePrismic();
    const renderedSlices = computed(() => {
      return props.slices.map((slice, index) => {
        var _a, _b;
        const type = "slice_type" in slice ? slice.slice_type : slice.type;
        const key = "id" in slice && typeof slice.id === "string" ? slice.id : `${index}-${JSON.stringify(slice)}`;
        const is = ((_a = props.components) == null ? void 0 : _a[type]) || props.defaultComponent || ((_b = options.components) == null ? void 0 : _b.sliceZoneDefaultComponent);
        if (!is) {
          return { is: TODOSliceComponent, key, props: { slice } };
        }
        if (slice.__mapped) {
          const { __mapped, ...mappedProps } = slice;
          return { is, key, props: mappedProps };
        }
        return {
          is,
          key,
          props: {
            slice,
            index,
            context: props.context,
            slices: props.slices
          }
        };
      });
    });
    return (_ctx, _cache) => {
      return _ctx.slices ? (openBlock(), createBlock(_sfc_main$e, {
        key: 0,
        wrapper: _ctx.wrapper
      }, {
        default: withCtx(() => [
          (openBlock(true), createElementBlock(Fragment, null, renderList(renderedSlices.value, (renderedSlice) => {
            return openBlock(), createBlock(resolveDynamicComponent(renderedSlice.is), mergeProps({
              key: renderedSlice.key,
              ref_for: true
            }, renderedSlice.props), null, 16);
          }), 128))
        ]),
        _: 1
      }, 8, ["wrapper"])) : createCommentVNode("", true);
    };
  }
});
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  ...{ name: "PrismicText" },
  __name: "PrismicText",
  props: {
    field: {},
    fallback: {},
    separator: {},
    wrapper: {}
  },
  setup(__props) {
    const props = __props;
    if (DEV) {
      watchEffect(() => {
        if (typeof props.field === "string") {
          throw new Error(
            `[PrismicText] The "field" prop only accepts a Rich Text or title field's value but was provided a different type of field instead (e.g. a Key Text or Select field). You can resolve this error by rendering the field value inline without <PrismicText>. For more details, see ${devMsg(
              "prismictext-works-only-with-rich-text-and-title-fields"
            )}`
          );
        }
      }, {});
    }
    return (_ctx, _cache) => {
      return unref(isFilled).richText(_ctx.field) || _ctx.fallback ? (openBlock(), createBlock(_sfc_main$e, {
        key: 0,
        wrapper: _ctx.wrapper
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(unref(asText)(_ctx.field) || _ctx.fallback), 1)
        ]),
        _: 1
      }, 8, ["wrapper"])) : createCommentVNode("", true);
    };
  }
});
const createPrismic = (options) => {
  let client;
  if (options.client) {
    client = options.client;
  } else {
    client = createClient(options.endpoint, options.clientConfig);
  }
  const prismicClient = {
    client,
    filter,
    cookie
  };
  const prismicHelpers = {
    asText,
    asHTML: (richTextField, ...config) => {
      const [configOrLinkResolver, maybeHTMLSerializer] = config;
      return asHTML(richTextField, typeof configOrLinkResolver === "function" || configOrLinkResolver == null ? {
        linkResolver: configOrLinkResolver || options.linkResolver,
        serializer: maybeHTMLSerializer || options.richTextSerializer
      } : {
        linkResolver: options.linkResolver,
        serializer: options.richTextSerializer,
        ...configOrLinkResolver
      });
    },
    asLink: (linkField, config) => {
      return asLink(linkField, typeof config === "function" ? { linkResolver: config } : {
        linkResolver: options.linkResolver,
        // TODO: For some reasons, TypeScript narrows the type to "unknown" where it's supposed to be a union
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...config
      });
    },
    asLinkAttrs: (linkField, config) => {
      return asLinkAttrs(linkField, {
        // TODO: We can't really retrieve the generic type here, this might cause some unexpected type error in some edge-case scenario
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        linkResolver: options.linkResolver,
        ...config
      });
    },
    asDate,
    asImageSrc,
    asImageWidthSrcSet,
    asImagePixelDensitySrcSet,
    isFilled,
    documentToLinkField
  };
  const prismic = {
    options,
    ...prismicClient,
    ...prismicHelpers,
    install(app) {
      app.provide(prismicKey, this);
      app.config.globalProperties.$prismic = this;
      if (options.injectComponents !== false) {
        app.component(_sfc_main$a.name, _sfc_main$a);
        app.component(_sfc_main$c.name, _sfc_main$c);
        app.component(_sfc_main$b.name, _sfc_main$b);
        app.component(_sfc_main$5.name, _sfc_main$5);
        app.component(_sfc_main$3.name, _sfc_main$3);
        app.component(_sfc_main$7.name, _sfc_main$7);
        app.component(_sfc_main$4.name, _sfc_main$4);
      }
    }
  };
  return prismic;
};
const _client = void 0;
const linkResolver = void 0;
const richTextSerializer = void 0;
const linkRel = void 0;
const richTextComponents = void 0;
const sliceZoneDefaultComponent = void 0;
const plugin_VsJeO7OWQcmp_79ubVrSLYzAF5fgIZ2ONwo_y8pP7Ro = /* @__PURE__ */ defineNuxtPlugin({
  name: "prismic:setup",
  parallel: true,
  async setup(nuxtApp) {
    const options = (/* @__PURE__ */ useRuntimeConfig()).public.prismic;
    let client;
    {
      client = _client;
    }
    const endpoint = options.environment || options.endpoint || client?.documentAPIEndpoint || "";
    const prismicPlugin = createPrismic({
      ...options,
      endpoint,
      // TypeScript expects either an endpoint of a client, not both
      client,
      linkResolver,
      richTextSerializer,
      injectComponents: false,
      // Handled at module level
      components: {
        linkInternalComponent: __nuxt_component_2,
        linkExternalComponent: __nuxt_component_2,
        ...options.components,
        linkRel,
        richTextComponents,
        sliceZoneDefaultComponent
      }
    });
    nuxtApp.vueApp.use(prismicPlugin);
    if (options.preview) {
      const previewCookie = useCookie("io.prismic.preview").value;
      {
        const req = useRequestEvent()?.node.req;
        if (req) {
          prismicPlugin.client.enableAutoPreviewsFromReq(req);
        }
      }
      if (previewCookie) {
        try {
          const session = typeof previewCookie === "string" ? JSON.parse(decodeURIComponent(previewCookie)) : previewCookie;
          if (Object.keys(session).some((key) => key in session && typeof session[key] === "object" && session[key] !== null && "preview" in session[key] && session[key].preview)) {
            let afterEachCalled = false;
            onNuxtReady(() => {
              if (!afterEachCalled) {
                refreshNuxtData();
              }
            });
            useRouter().afterEach(() => {
              afterEachCalled = true;
              refreshNuxtData();
            });
          }
        } catch (error) {
          console.warn("Failed to parse Prismic preview cookie", error);
        }
      }
    }
    if (options.toolbar && prismicPlugin.client?.repositoryName) {
      useHead({
        script: [{
          key: "prismic-preview",
          src: `https://static.cdn.prismic.io/prismic.min.js?repo=${prismicPlugin.client.repositoryName}&new=true`,
          async: true,
          defer: true,
          crossorigin: "anonymous"
        }]
      });
    } else {
      useCookie("io.prismic.preview").value = null;
    }
    return {
      provide: { prismic: prismicPlugin }
    };
  }
});
const _1_absoluteImageUrls_server_flSUiT3qAxlBp8PXBnNbLxEJ0POSbQpeUPxlRpgrET0 = /* @__PURE__ */ defineNuxtPlugin({
  enforce: "post",
  setup() {
    const head = injectHead();
    if (!head)
      return;
    const resolver = createSitePathResolver({
      withBase: true,
      absolute: true,
      canonical: true
    });
    head.use({
      key: "absoluteImageUrls",
      hooks: {
        "tags:resolve": async ({ tags }) => {
          for (const tag of tags) {
            if (tag.tag !== "meta")
              continue;
            if (tag.props.property !== "og:image:url" && tag.props.property !== "og:image" && tag.props.name !== "twitter:image")
              continue;
            if (typeof tag.props.content !== "string" || !tag.props.content.trim() || tag.props.content.startsWith("http") || tag.props.content.startsWith("//"))
              continue;
            tag.props.content = unref(resolver(tag.props.content));
          }
        }
      }
    });
  }
});
const _0_routeRules_6ZHUvU_36EWyBTTLeP9oNEDdqTRtn46TJ1YxWrXxnR0 = /* @__PURE__ */ defineNuxtPlugin({
  enforce: "post",
  async setup() {
    let __temp, __restore;
    const head = injectHead();
    const routeRuleState = useState("nuxt-seo-utils:routeRules", () => null);
    {
      const event = useRequestEvent();
      const routeRules = ([__temp, __restore] = executeAsync(() => getRouteRules(event)), __temp = await __temp, __restore(), __temp);
      routeRuleState.value = {
        head: routeRules.head,
        seoMeta: routeRules.seoMeta
      };
    }
    if (routeRuleState.value) {
      const { head: headInput, seoMeta } = routeRuleState.value;
      if (headInput)
        head.push(headInput);
      if (seoMeta)
        useSeoMeta(seoMeta);
    }
  }
});
function applyDefaults() {
  const siteConfig = useSiteConfig({
    resolveRefs: false
  });
  const resolveCurrentLocale = () => toValue(siteConfig.currentLocale) || toValue(siteConfig.defaultLocale) || "en";
  const head = injectHead();
  head.use(TemplateParamsPlugin);
  const { canonicalQueryWhitelist, canonicalLowercase } = (/* @__PURE__ */ useRuntimeConfig()).public["seo-utils"];
  const route = useRoute();
  const resolveUrl = createSitePathResolver({ withBase: true, absolute: true });
  const err = useError();
  const canonicalUrl = computed(() => {
    if (err.value) {
      return false;
    }
    const { query } = route;
    let url = resolveUrl(route.path || "/").value || route.path;
    if (canonicalLowercase) {
      try {
        url = url.toLocaleLowerCase(resolveCurrentLocale());
      } catch {
        url = url.toLowerCase();
      }
    }
    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(([key]) => canonicalQueryWhitelist.includes(key)).sort(([a], [b]) => a.localeCompare(b))
      // Sort params
    );
    const href = Object.keys(filteredQuery).length ? `${url}?${stringifyQuery(filteredQuery)}` : url;
    return { rel: "canonical", href };
  });
  const minimalPriority = {
    // give nuxt.config values higher priority
    tagPriority: "low"
  };
  useHead({
    htmlAttrs: { lang: resolveCurrentLocale },
    templateParams: {
      site: () => siteConfig,
      siteName: () => siteConfig.name
    },
    titleTemplate: "%s %separator %siteName",
    link: [() => canonicalUrl.value]
  }, minimalPriority);
  const seoMeta = {
    ogType: "website",
    ogUrl: () => {
      const url = canonicalUrl.value;
      return url ? url.href : false;
    },
    ogLocale: () => {
      const locale = resolveCurrentLocale();
      {
        const l = locale.replace("-", "_");
        if (l.includes("_")) {
          return l;
        }
      }
      return false;
    },
    ogSiteName: siteConfig.name
  };
  if (siteConfig.description)
    seoMeta.description = siteConfig.description;
  if (siteConfig.twitter) {
    const id = siteConfig.twitter.startsWith("@") ? siteConfig.twitter : `@${siteConfig.twitter}`;
    seoMeta.twitterCreator = id;
    seoMeta.twitterSite = id;
  }
  useSeoMeta(seoMeta, minimalPriority);
}
const defaults_hYiCEAtrVIc1T7FukJXnBb8zEECErfJ8LHLy9XdF3Vg = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-seo:defaults",
  order: 999,
  env: {
    islands: false
  },
  setup() {
    applyDefaults();
  }
});
const plugins = [
  payloadPlugin,
  unhead_1D1fUOGXS4VJl8WVMs3DdkWkgzDzaBl_YViS7wJheJo,
  plugin$1,
  _0_siteConfig_7sElAad_E7kQulys29hLsJtJN2Qgy4nawEOY_VkQ7_U,
  revive_payload_server_n1AlfGORgF_ktGUsnqfaHO_ralshCj_1RP8grIXsy1Q,
  plugin,
  components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8,
  siteConfig_OYG4NKHYqqpptRzrGBUYLOTURIgbf42K8drCiXLjiZ8,
  inferSeoMetaPlugin_sikvJ1ir5o__xpTTf7XTXwfm19ZJzxT3aWJWhjXx_0w,
  titles_8MAVGgyp4WrlrojDQr6iwFKbMFjuasnXRkZB3A1_H10,
  defaults_54CssQLVS8g_jeX5dMGDVegdJxaa0C9gQzDrSiH8aWc,
  init_2_MeG37Fd6F8dkeyTIxo2gBwQWVaILOgtnQAdY4wQoc,
  og_image_canonical_urls_server_y_egopZ_o54TfCnrXL_d24lRhNk3gjdQe92DxuiA9PM,
  route_rule_og_image_server_yQpg_tfAq6Gc8ifk6PeyeXot0jiyK5S7re5he3MACd4,
  robot_meta_server_B7f0jKF2Gs2fZmXR0C2Ki3LUWHlfXoReBOrWR2iRZCw,
  plugin_VsJeO7OWQcmp_79ubVrSLYzAF5fgIZ2ONwo_y8pP7Ro,
  _1_absoluteImageUrls_server_flSUiT3qAxlBp8PXBnNbLxEJ0POSbQpeUPxlRpgrET0,
  _0_routeRules_6ZHUvU_36EWyBTTLeP9oNEDdqTRtn46TJ1YxWrXxnR0,
  defaults_hYiCEAtrVIc1T7FukJXnBb8zEECErfJ8LHLy9XdF3Vg
];
const layouts = {
  artwork: defineAsyncComponent(() => import('./artwork-9hunAyCV.mjs').then((m) => m.default || m)),
  default: defineAsyncComponent(() => import('./default-BuGdeWhx.mjs').then((m) => m.default || m))
};
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  setup(props, context) {
    return () => h(layouts[props.name], props.layoutProps, context.slots);
  }
});
const nuxtLayoutProps = {
  name: {
    type: [String, Boolean, Object],
    default: null
  },
  fallback: {
    type: [String, Object],
    default: null
  }
};
const __nuxt_component_0 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: nuxtLayoutProps,
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const shouldUseEagerRoute = !injectedRoute || injectedRoute === useRoute();
    const route = shouldUseEagerRoute ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route?.meta.layout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = shallowRef();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    let lastLayout;
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route?.meta.layoutTransition ?? appLayoutTransition;
      const previouslyRenderedLayout = lastLayout;
      lastLayout = layout.value;
      return _wrapInTransition(hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value || void 0,
              name: layout.value,
              shouldProvide: !props.name,
              isRenderingNewLayout: (name) => {
                return name !== previouslyRenderedLayout && name === layout.value;
              },
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    },
    isRenderingNewLayout: {
      type: Function,
      required: true
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    const injectedRoute = inject(PageRouteSymbol);
    const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute();
    if (isNotWithinNuxtPage) {
      const vueRouterRoute = useRoute$1();
      const reactiveChildRoute = {};
      for (const _key in vueRouterRoute) {
        const key = _key;
        Object.defineProperty(reactiveChildRoute, key, {
          enumerable: true,
          get: () => {
            return props.isRenderingNewLayout(props.name) ? vueRouterRoute[key] : injectedRoute[key];
          }
        });
      }
      provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
    }
    return () => {
      if (!name || typeof name === "string" && !(name in layouts)) {
        return context.slots.default?.();
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    console.log("App");
    const { $lenis } = useNuxtApp();
    console.log("Lenis instance:", $lenis);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_NuxtLayout, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-DTIBqKcQ.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-IRq2KXj0.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/nuxt@4.1.1_@netlify+blobs@10.0.10_@parcel+watcher@2.5.1_@types+node@24.3.1_@vue+compile_3bb44644fad03edc420b82c1652e9f1e/node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = defineAsyncComponent(() => import('./island-renderer-BdNSvn_m.mjs').then((r) => r.default || r));
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/nuxt@4.1.1_@netlify+blobs@10.0.10_@parcel+watcher@2.5.1_@types+node@24.3.1_@vue+compile_3bb44644fad03edc420b82c1652e9f1e/node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { LayoutMetaSymbol as L, PageRouteSymbol as P, __nuxt_component_2 as _, usePrismic as a, useRouter as b, createError as c, useRoute as d, entry$1 as default, useAsyncData as e, _sfc_main$4 as f, useNuxtApp as g, _sfc_main$7 as h, injectHead as i, _sfc_main$b as j, useLazyAsyncData as k, _sfc_main$a as l, useOgImageRuntimeConfig as m, useSiteConfig as n, useRuntimeConfig as o, useRequestEvent as p, useHead as u };
//# sourceMappingURL=server.mjs.map
