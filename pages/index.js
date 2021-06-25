import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

import PostFeed from '../components/PostFeed'
import { firestore, postToJson, fromMillis } from '../lib/firebase'
import { useState } from 'react'

const LIMIT = 1;
export const getServerSideProps = async (context) => {

  const postsQuery = firestore.collectionGroup('posts')
  .where('published', '==', true)
  .orderBy('createdAt', 'desc')
  .limit(LIMIT)

  const posts = (await postsQuery.get()).docs.map(postToJson);

  return {
    props: {
      posts
    }
  }
}

export default function Home(props) {

  const [posts, setPosts] = useState(props.posts);

  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  const loadMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];
    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;
    
    
    const query = firestore
    .collectionGroup("posts")
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .startAfter(cursor)
    .limit(LIMIT);
    
    const newPosts = (await query.get()).docs.map(doc => doc.data());

    setPosts(posts.concat(newPosts))
    setLoading(false);

    if (newPosts.length < LIMIT) setPostsEnd(true);
    return newPosts;
  }

  return (
    <main>
      {/* <Link prefetch={false} href={{
        pathname: '[username]',
        query: {username: "aloidz"}
      }}>
       <a>Loi profile</a>

      </Link> */}
    {/* <Loader show/>
    <button onClick={() => {toast.success("ngu vc")}}>
      Du em di ck
    </button> */}

    <PostFeed posts={posts} />
    {!loading && !postsEnd && <button onClick={loadMorePosts}>Load more post</button>}
    <Loader show={loading} />
    {postsEnd && "You have reached the end!"}
    </main>
  )
}
