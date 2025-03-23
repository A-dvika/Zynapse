import axios from 'axios';

export interface ProductHuntPost {
  id: number;
  name: string;
  tagline: string;
  url: string;
  votesCount: number;
  commentsCount: number;
  createdAt: string;
  thumbnailUrl?: string;
  description?: string;
}

const PRODUCT_HUNT_API_URL = 'https://api.producthunt.com/v2/api/graphql';

export async function fetchProductHuntPosts(
  limit: number = 10,
  token: string
): Promise<ProductHuntPost[]> {
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
            thumbnail {
              url
            }
            description
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
      thumbnailUrl: node.thumbnail?.url || null,
      description: node.description || null,
    };
  });

  return posts;
}
