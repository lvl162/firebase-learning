import Image from 'next/image'
const UserProfile = ({ user }) => {
  return (
    <div className='box-center'>
      <Image src={user.photoURL} className='card-img-center' />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName}</h1>
    </div>
  );
};
export default UserProfile;
