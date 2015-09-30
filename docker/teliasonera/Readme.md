# Dev deployment

The deployment requires config file in private/docker_config.json.

We don't want to include the config file in the repository because it contains
sensitive info (like AWS credentials).

## Build and push to docker registry

This assumes that you have rights to push to some Docker registry.

make dist
docker build -t [registry address]/mattermost-dev:latest -f docker/teliasonera/Dockerfile .
docker push [registry address]/mattermost-dev:latest
