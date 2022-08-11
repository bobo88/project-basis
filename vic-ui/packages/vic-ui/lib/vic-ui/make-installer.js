"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const key = require("../constants/key.js");
const makeInstaller = (components = []) => {
  const install = (app) => {
    if (app[key.INSTALLED_KEY])
      return;
    app[key.INSTALLED_KEY] = true;
    components.forEach((c) => app.use(c));
  };
  return {
    install
  };
};
exports.makeInstaller = makeInstaller;
