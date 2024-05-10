# Example

```bash
docker run \
    -d \
    --name redis-inmemory-demo \
    -p 6379:6379 \
    -v $(pwd)/data:/data \
    redis redis-server --save 60 1 --loglevel warning
```

