const apollo = require('./handlers/apollo')
const playground = require('./handlers/playground')

const graphQLOptions = {
  // Set the path for the GraphQL server
  baseUrl: '/',
  // Set the path for the GraphQL playground
  // This option can be removed to disable the playground route
  playgroundUrl: '/___graphql',
  // When a request's path isn't matched, forward it to the origin
  forwardUnmatchedRequestsToOrigin: false,
  // Enable debug mode to return script errors directly in browser
  debug: false,
}

const handleRequest = request => {
  const url = new URL(request.url)
  try {
    if (url.pathname === graphQLOptions.baseUrl) {
      return apollo(request, graphQLOptions)
    } else if (graphQLOptions.playgroundUrl && url.pathname === graphQLOptions.playgroundUrl) {
      return playground(request, graphQLOptions)
    } else if (graphQLOptions.forwardUnmatchedRequestsToOrigin) {
      return fetch(request)
    } else {
      return new Response('Not found', { status: 404 })
    }
  } catch (err) {
    return new Response(graphQLOptions.debug ? err : 'Something went wrong', { status: 500 })
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
