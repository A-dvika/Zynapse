import axios from 'axios';

export interface ProductHuntPost {
  id: number;
  name: string;
  tagline: string;
  url: string;
  votesCount: number;
  commentsCount: number;
  createdAt: string;
}

const PRODUCT_HUNT_API_URL = 'https://api.producthunt.com/v2/api/graphql';

/**
 * Fetch Product Hunt posts using the GraphQL API.
 * @param limit The number of posts to fetch.
 * @param token Your Product Hunt API Bearer token.
 * @returns An array of ProductHuntPost objects.
 */
export async function fetchProductHuntPosts(limit: number = 10, token: string): Promise<ProductHuntPost[]> {
  // GraphQL query to fetch posts
  const query = `
    query GetPosts($limit: Int) {
      posts(first: $limit) {
        edges {
          node {
            id
            name
            tagline
            url
            votesCount
            commentsCount
            createdAt
          }
        }
      }
    }
  `;
  
  const variables = { limit };

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const response = await axios.post(PRODUCT_HUNT_API_URL, { query, variables }, { headers });

  // Extract posts from the response
  const posts = response.data.data.posts.edges.map((edge: any) => {
    const node = edge.node;
    return {
      id: parseInt(node.id),
      name: node.name,
      tagline: node.tagline,
      url: node.url,
      votesCount: node.votesCount,
      commentsCount: node.commentsCount,
      createdAt: node.createdAt,
    };
  });

  return posts;
}
