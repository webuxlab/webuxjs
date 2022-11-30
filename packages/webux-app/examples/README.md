## errorhandler.js

```bash
node errorhandler.js
```

```bash
curl http://localhost:1337/hello
curl -H "accept-language: fr" http://localhost:1337/hello
curl http://localhost:1337/error
```

Output:

```text
{"msg":"Hello !","lang":"en","from":"::ffff:127.0.0.1"}

{"msg":"Bonjour !","lang":"fr","from":"::ffff:127.0.0.1"}

{"message":"Bad Request","devMessage":"Message for the dev. team","extra":{"user":{"test":"An object to add extra information"},"req":{"method":"GET","url":"/error","ip":"::ffff:127.0.0.1"},"stack":"Error: Bad Request\n    at Handler (/Projects/webuxjs/packages/webux-app/src/errorhandler/index.js:112:17)\n    at App.ErrorHandler (/Projects/webuxjs/packages/webux-app/src/App.js:118:12)\n    at /Projects/webuxjs/packages/webux-app/examples/errorhandler.js:27:18\n    at Layer.handle [as handle_request] (/Projects/webuxjs/packages/webux-app/node_modules/express/lib/router/layer.js:95:5)\n    at next (/Projects/webuxjs/packages/webux-app/node_modules/express/lib/router/route.js:144:13)\n    at Route.dispatch (/Projects/webuxjs/packages/webux-app/node_modules/express/lib/router/route.js:114:3)\n    at Layer.handle [as handle_request] (/Projects/webuxjs/packages/webux-app/node_modules/express/lib/router/layer.js:95:5)\n    at /Projects/webuxjs/packages/webux-app/node_modules/express/lib/router/index.js:284:15\n    at Function.process_params (/Projects/webuxjs/packages/webux-app/node_modules/express/lib/router/index.js:346:12)\n    at next (/Projects/webuxjs/packages/webux-app/node_modules/express/lib/router/index.js:280:10)"},"hash":"268ea24115fb15168bb9ae007e94e7c8269d0d6c308501306e1a76ba63555888","refCode":"4e4a3700-704e-11ed-a351-87a374755750"}
```

---

```bash
NODE_ENV=production node errorhandler.js
```

```bash
curl http://localhost:1337/error
```

Output:

```text
{"message":"Bad Request","success":false,"refCode":"5fdf40a0-704e-11ed-9856-e3f9491a0e07"}
```

---
