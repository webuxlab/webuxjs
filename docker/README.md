# Docker

You need a lot of CPU, a lot of RAM and Very Fast Storage.
This is only for dev and there is no security, redondancy, backup and etc. I'm working on a PoC, it requires a lot of effort to put in place a simple demo, as soon as I validate the solution, I will check to integrate redondancy, then includes security, the last milestone is to get a production ready docker compose setup.

Soon as it is production ready, I would like to do the same using Kubernetes. The plan is to use something like KNative along with containerize services.

```bash
docker compose up -d
```

## Logs using ELK

See the example [here](../packages/webux-logger/examples/full_example/infrastructure/elk/launch.sh)

## Tracing

See the example [here](../packages/webux-telemetry/examples/docker-compose.yml)

## Object Storage with SeaweedFS

See the example and configurations [here](../packages/webux-fileupload/examples/objectStorage/infrastructure/docker-compose.yml)

## Backend

See the generator [here](../packages/webux-generator/generator/app-v2/templates/backend/Dockerfile)

## Frontend

See the generator [here](../packages/webux-generator/generator/app-v2/templates/frontend/Dockerfile)

## RabbitMQ

See the example to start the Server [here](../packages/webux-queue/examples/start.sh)
