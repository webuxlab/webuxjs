## Webux-socket Example

### Launch redis container

```bash
docker run -d --name redis -p 6379:6379 redis
```

### Launch the frontend

```bash
cd frontend/
npm install
npm run serve
```

### Launch the backend

Default version

```bash
npm install
node index.js
```

Standalone Version

```bash
npm install
node standalone.js
```

With namespaces

```bash
npm install
node index_namespaces.js
```

Other variant of default

```bash
npm install
node index_default.js
```
