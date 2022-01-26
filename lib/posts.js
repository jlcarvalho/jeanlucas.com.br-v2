import fs from 'fs';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import orderBy from 'lodash/orderBy';

const md = new MarkdownIt({
  html: true,
});

export const getPosts = ({ withContent = false } = {}) => {
  const files = fs.readdirSync('content');

  const posts = files.map((filename) => {
    const fileContent = fs.readFileSync(`content/${filename}`, 'utf-8');
    const { data: metadata, content } = matter(fileContent);

    // TODO: melhorar essa parte
    if (typeof metadata.date !== 'string') {
      metadata.date = metadata.date.toISOString();
    }

    if (withContent) {
      return {
        ...metadata,
        content,
      }
    }

    return metadata;
  });

  return orderBy(posts, 'date', 'desc');
}

export const getPost = ({ slug }) => {
  const post = getPosts({ withContent: true })
    .find(post => post.slug === slug);

  return {
    ...post,
    content: md.render(post.content),
  }
}
