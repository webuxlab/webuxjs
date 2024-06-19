# Webux Lab - WebuxJS Framework

## Packages

| Packages         | Status     |
| ---------------- | ---------- |
| webux-app        | Stable     |
| webux-fileupload | Stable     |
| webux-generator  | WIP        |
| webux-logger     | Stable     |
| webux-mailer     | Stable     |
| webux-route      | Stable     |
| webux-security   | Stable     |
| webux-server     | Stable     |
| webux-socket     | Stable     |
| webux-sql        | Stable     |
| webux-telemetry  | Alpha      |
| webux-queue      | Alpha      |
| webux-pubsub     | Alpha      |
| webux-sitemap    | Beta       |
| webux-search     | Beta       |
| webux-crawler    | Alpha      |
| webux-view       | Alpha      |
| webux-scylla     | Not Tested |
| webux-mongo      | Not Tested |
| webux-janusgraph | Not Tested |

## Setup

```bash
nvm install 20
nvm use 20

Now using node v20.12.2 (npm v10.5.0)
```

## Getting Started

See the generator.

```bash
npm i -g husky lerna
```

## Releases

```bash
npx lerna publish
```

## Cleanup

```bash
for f in *; do echo $f; pushd $f; rm package-lock.json; rm -fr node_modules/; popd; done
for f in *; do echo $f; pushd $f; npm i; popd; done
```