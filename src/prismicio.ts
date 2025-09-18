import * as prismic from '@prismicio/client'
import * as prismicNext from '@prismicio/next'
import config from '../slicemachine.config.json'

/**
 * The project's Prismic repository name.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || config.repositoryName

/**
 * A list of Route Resolver objects that define how a document's `url` field is resolved.
 *
 * {@link https://prismic.io/docs/route-resolver#route-resolver}
 */
const routes: prismic.ClientConfig['routes'] = [
  {
    type: 'blogcomponents',
    path: '/portal-brain/:uid',
  },
  {
    type: 'blogpost',
    path: '/portal-brain/:uid',
  },
]

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (config: prismicNext.CreateClientConfig = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    fetchOptions: {
      next: {
        tags: ['prismic'],
        revalidate: process.env.NODE_ENV === 'production' ? 3600 : 5, // 1 hora em prod, 5 segundos em dev
      },
    },
    ...config,
  })

  prismicNext.enableAutoPreviews({
    client,
  })

  return client
}
