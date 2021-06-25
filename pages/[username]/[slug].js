import { firestore, getUserWithUsername, postToJson } from '../../lib/firebase';
import styles from '../../styles/Post.module.css';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import PostContent from '../../components/PostContent';
import HeartButton from '../../components/HeartButton';
import AuthCheck from '../../components/AuthCheck';
import Link from 'next/link';
const Post = (props) => {
  const postRef = firestore.doc(props.path);

  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>
      <aside className='card'>
        <p>
          <strong>{post.heartCount || 0} 💗</strong>
        </p>
        <AuthCheck fallback={<Link href='/enter'>Sign up</Link>}>
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  );
};
export default Post;

export const getStaticProps = async ({ params }) => {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);
  let post = null,
    path = null;
  if (userDoc) {
    const postRef = userDoc.ref.collection('posts').doc(slug);
    post = postToJson(await postRef.get());
    path = postRef.path;
  }
  return {
    props: {
      post,
      path,
    },
    revalidate: 5000,
  };
};

export const getStaticPaths = async () => {
  const snapshot = await firestore.collectionGroup('posts').get();

  const paths = snapshot.docs.map((doc) => {
    const { username, slug } = doc.data();
    return {
      params: { username, slug },
    };
  });
  return {
    paths,
    fallback: 'blocking',
  };
};
