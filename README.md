workers + graphql playground

deploying this project requires a KV binding called `GRAPHQL_ON_WORKERS` to be defined for your application. if you don't want to set this up, comment out [this line](https://github.com/signalnerve/workers-graphql/blob/master/src/handlers/apollo.js#L43) before deploy
