"use strict";
const makeInstaller = require("./make-installer.js");
const component = require("./component.js");
const plugin = require("./plugin.js");
const installer = makeInstaller.makeInstaller([...component, ...plugin]);
module.exports = installer;
