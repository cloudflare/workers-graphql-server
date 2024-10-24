import type { Context } from 'hono'
import type { GraphQLServerOptions } from '..'

import { ApolloServer } from '@apollo/server'
import { startServerAndCreateCloudflareWorkersHandler } from '@as-integrations/cloudflare-workers'

import KVCache from '../kv-cache'
import resolvers from '../resolvers'

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
    resolvers,
    introspection: true,
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
