import { defineAsyncComponent, markRaw } from 'vue';

const defineSliceZoneComponents = (components2) => {
  const result = {};
  let type;
  for (type in components2) {
    const component = components2[type];
    result[type] = typeof component === "string" ? component : markRaw(component);
  }
  return result;
};
const components = defineSliceZoneComponents({
  footer: defineAsyncComponent(() => import('./index-C9Qmvdyp.mjs')),
  rich_text: defineAsyncComponent(() => import('./index-CyP0h6V9.mjs'))
});

export { components as c };
//# sourceMappingURL=index-CMrq-3rs.mjs.map
