# Search Plugin

```bash
npm install --save @studiowebux/search
```

## Usage

```javascript
const { searchDocument, formatZincResponse } = require("../src/index");

// ...

app.search("/:term", async (req, res) => {
  const response = await searchDocument(
    "webuxlab",
    process.env.ZINC_ENDPOINT,
    process.env.ZINC_AUTHENTICATION,
    "webuxlab.com"
  );

  return res.json(formatZincResponse(response));
});

// ...
```

See `tests/` for examples.
