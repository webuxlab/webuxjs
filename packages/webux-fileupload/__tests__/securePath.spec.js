const { securePath } = require("../src/utils/secure")
const path = require("path")

securePath(path.resolve("./public"), path.resolve("../../../hehe"))
securePath(path.resolve("./public"), path.resolve("./hehe"))
securePath(path.resolve("./public"), path.resolve("./public/hehe"))
securePath(path.resolve("./public"), path.resolve("./public/test/hehe"))
securePath(path.resolve("./public"), path.resolve("../public/hello"))
securePath(path.resolve("./public"), path.resolve("./public/../../public/hello"))