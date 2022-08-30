import { INSTALLED_KEY } from "../constants/key.js";
const makeInstaller = (components = []) => {
  const install = (app) => {
    if (app[INSTALLED_KEY])
      return;
    app[INSTALLED_KEY] = true;
    components.forEach((c) => app.use(c));
  };
  return {
    install
  };
};
export {
  makeInstaller
};
