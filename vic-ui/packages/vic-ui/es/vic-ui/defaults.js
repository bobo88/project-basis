import { makeInstaller } from "./make-installer.js";
import Components from "./component.js";
import Plugins from "./plugin.js";
const installer = makeInstaller([...Components, ...Plugins]);
export {
  installer as default
};
