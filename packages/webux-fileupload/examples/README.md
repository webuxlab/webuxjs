# index-image.js

```bash
node index-image.js
```

You can use postman to easily upload an image,

Select `Body`, `form-data`, Set the `Key` as **file**, name the field `file`, and select an **image**.

Call the endpoint: **'POST /defaultupload'**

`http://localhost:1340/defaultupload` -> it will upload the file and leave it in the .tmp directory.
`http://localhost:1340/upload` -> it will upload the file in the .tmp directory and move it in the uploads/ directory once validated and processed.

To **retrieve** publicly the file, go to: `http://localhost:1340/public/name_of_your_file.png` -> this one uses the static assets from expressJS

To **download** the file, go to: `http://localhost:1340/download/name_of_your_file.png` -> this one uses an api route, so you can secure it and etc.
