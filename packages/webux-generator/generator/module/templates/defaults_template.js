// ██████╗ ███████╗███████╗ █████╗ ██╗   ██╗██╗  ████████╗    ██╗   ██╗ █████╗ ██╗     ██╗   ██╗███████╗███████╗
// ██╔══██╗██╔════╝██╔════╝██╔══██╗██║   ██║██║  ╚══██╔══╝    ██║   ██║██╔══██╗██║     ██║   ██║██╔════╝██╔════╝
// ██║  ██║█████╗  █████╗  ███████║██║   ██║██║     ██║       ██║   ██║███████║██║     ██║   ██║█████╗  ███████╗
// ██║  ██║██╔══╝  ██╔══╝  ██╔══██║██║   ██║██║     ██║       ╚██╗ ██╔╝██╔══██║██║     ██║   ██║██╔══╝  ╚════██║
// ██████╔╝███████╗██║     ██║  ██║╚██████╔╝███████╗██║        ╚████╔╝ ██║  ██║███████╗╚██████╔╝███████╗███████║
// ╚═════╝ ╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝         ╚═══╝  ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚══════╝╚══════╝

/**
 * File: {{moduleFilename}}
 * Author: {{author}}
 * Date: {{creationDate}}
 * License: {{license}}
 */

"use strict";

const Webux = require("@studiowebux/app");

const resource = async () => {

  return Promise.resolve("not implemented, remove me to continue.");

  const {{moduleName}} = new Webux.db.{{modelName}}({
    // your stuff
  });
  const {{moduleName}}Created = await {{moduleName}}.save();

  if (!{{moduleName}}Created) {
    throw new Error("{{modelName}} not created !");
  }

  return Promise.resolve('Default {{moduleName}} "resource" created.');
};

module.exports = Promise.all([resource()]);
