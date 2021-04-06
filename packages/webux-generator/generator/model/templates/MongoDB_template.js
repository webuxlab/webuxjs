// ███╗   ███╗ ██████╗ ██████╗ ███████╗██╗
// ████╗ ████║██╔═══██╗██╔══██╗██╔════╝██║
// ██╔████╔██║██║   ██║██║  ██║█████╗  ██║
// ██║╚██╔╝██║██║   ██║██║  ██║██╔══╝  ██║
// ██║ ╚═╝ ██║╚██████╔╝██████╔╝███████╗███████╗
// ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝

/**
 * File: {{modelFilename}}
 * Author: {{author}}
 * Date: {{creationDate}}
 * License: {{license}}
 */

"use strict";

module.exports = db => {
  
  // Do your magic ! check mongoose for more details
  let {{modelName}} = db.Schema(
    {
      
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  );

  // indexes
    // if needed
  // pre/post functions
    // if needed

  return db.model("{{modelName}}", {{modelName}});
};
