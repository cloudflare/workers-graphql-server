import type { Context } from 'hono'
import type { GraphQLServerOptions } from '..'

import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { startServerAndCreateCloudflareWorkersHandler } from '@as-integrations/cloudflare-workers'

import KVCache from '../kv-cache'
import createResolvers from '../resolvers'

// TODO: Fix me!
// @ts-expect-error
import typeDefs from '../schema.graphql'

type ServerContext = {}

const handler = async (
  context: Context,
  graphQLServerOptions: GraphQLServerOptions,
) => {
  const server = new ApolloServer<ServerContext>({
    typeDefs,
    resolvers: createResolvers(context),
    introspection: true,
    ...(graphQLServerOptions.enableSandbox
      ? {}
      : {
          plugins: [ApolloServerPluginLandingPageDisabled()],
        }),
    ...(graphQLServerOptions.kvCache && context.env.KV_CACHE
      ? {
          cache: new KVCache(context.env.KV_CACHE),
        }
      : {}),
  })

  const cfHandler = startServerAndCreateCloudflareWorkersHandler<
    Env,
    ServerContext
  >(server, {
    context: async ({ env, request, ctx }) => {
      return {}
    },
  })

  return cfHandler(context.req.raw, context.env, context.executionCtx)
}

export default handler
