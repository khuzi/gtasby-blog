import React, { useState } from "react";
import { Link, graphql } from "gatsby";

import Layout from "../components/layout";
import Seo from "../components/seo";
import Bio from "../components/bio";

const BlogIndex = ({ data }) => {
  // const siteTitle = data.site.siteMetadata?.title || `Title`;
  const posts = data.allMarkdownRemark.nodes;

  const [searchPost, setSearchPost] = useState("");

  const filteredPosts = posts.filter((post) =>
    post.frontmatter.title.toLowerCase().includes(searchPost.toLowerCase())
  );

  if (filteredPosts.length === 0) {
    return (
      <Layout searchPost={searchPost} setSearchPost={setSearchPost} home>
        <Seo title="All posts" />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    );
  }

  return (
    <Layout searchPost={searchPost} setSearchPost={setSearchPost} home>
      <Seo title="All posts" />
      <Bio />
      <div className="pre-posts-title">
        <h3>Newest Posts</h3>
      </div>
      <ol style={{ listStyle: `none` }}>
        {filteredPosts.map((post, i) => {
          const title = post.frontmatter.title || post.fields.slug;
          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <div className="card-image">
                    <img src={post.frontmatter.image} />
                    <div className="card-avatar">
                      <img src={post.frontmatter.avatar} />
                    </div>
                  </div>
                </header>
                <div
                  className="card-content"
                  style={{ background: post.frontmatter.bg_color }}
                >
                  <h2 className="card-title">
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                  <section>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: post.frontmatter.description || post.excerpt,
                      }}
                      itemProp="description"
                    />
                  </section>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </Layout>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        fields {
          slug
        }
        excerpt
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          image
          avatar
          bg_color
        }
      }
    }
  }
`;
