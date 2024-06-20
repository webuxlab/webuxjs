# Demo

## Getting Started

```bash
docker compose build
docker compose --env-file .env.docker up
```

## Notes

**Not covered**

- crawler
- pubsub
- queue
- search
- sitemap

## Testing the demo application

```bash
curl localhost:1337/home

curl -XPOST localhost:1337/api/v1/admin/api_key -H "X-Api-Key: bonjour" -d '{"client_name":"studiowebux","description":"yeahh","api_key_length":42,"daily_limit":9}' -H "Content-Type: application/json" | jq

curl -XPOST localhost:1337/api/v1/admin/api_key -H "X-Api-Key: hello-1" -d '{"client_name":"studiowebux","description":"yeahh","api_key_length":42,"daily_limit":9}' -H "Content-Type: application/json" | jq


curl -XGET localhost:1337/api/v1/admin/api_key/usage -H "X-Api-Key: hello" | jq
curl localhost:1337/api/v1/generator/name -H "X-Api-Key: hello"

curl -XPOST http://localhost:1337/api/v1/admin/random -H "Accept: application/json" -H "Content-Type: application/json" -d '{"operation":"Integer"}' | jq

```
