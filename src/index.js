// export components and core classes
import * as components from './components'; // all the components
export * from './core';
export { get, waitFor } from './core/component/registry';
export  { add as controller } from './core/controller';
