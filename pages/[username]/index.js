import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';
import { getUserWithUsername, postToJson } from '../../lib/firebase';
export const getServerSideProps = async ({ query }) => {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  let user = null,
    posts = null;
  if (!userDoc) {
    return {
      notFound: true,
    };
  }
  if (userDoc) {
    user = userDoc.data();
    const postsQuery = userDoc.ref
      .collection('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5);
    posts = (await postsQuery.get()).docs.map(postToJson);
  }

  return {
    props: {
      user,
      posts,
    },
  };
};

const UserProfilePage = ({ user, posts }) => {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
};
export default UserProfilePage;
