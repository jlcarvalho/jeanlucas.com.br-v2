import Link from 'next/link'

import { getPost, getPosts } from '../../lib/posts';

import Layout from '../../components/Layout';

export async function getStaticProps({ params: { slug } }) {
  const post = getPost({ slug });

  return {
    props: {
      post,
    }
  };
}

export async function getStaticPaths() {
  const posts = getPosts();

  return {
    paths: posts.map(({ slug }) => ({
      params: { slug }
    })),
    fallback: false,
  }
}

export default function PostPage({ post }) {
  return <Layout>
    <Link href="/">
      <a>Voltar</a>
    </Link>

    <h1>{post.title}</h1>

    <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
  </Layout>
}
