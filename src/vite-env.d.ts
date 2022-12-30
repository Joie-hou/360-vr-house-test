/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.glb" {
  const src: string;
  export default src;
}
declare module "*.obj" {
  const src: string;
  export default src;
}
declare module "*.fbx" {
  const src: string;
  export default src;
}
declare module "*.blend" {
  const src: string;
  export default src;
}
