const apollo = require('./handlers/apollo')
const graphiql = require('./handlers/graphiql')

const handleRequest = async request => {
  const url = new URL(request.url)
  try {
    if (url.pathname === '/graphql') {
      return apollo(request)
    } else if (url.pathname === '/graphiql') {
      return graphiql(request)
    } else {
      return new Response('Not found', { status: 404 })
    }
  } catch (err) {
    return new Response(err, { status: 500 })
  }
}

addEventListener('fetch', event => event.respondWith(handleRequest(event.request)))
