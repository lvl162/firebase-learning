import Image from 'next/image';
const UserProfile = ({ user }) => {
  return (
    <div className='box-center'>
      <Image
        src={user.photoURL}
        className='card-avt'
        width={200}
        height={200}
      />
      <style jsx global>
        {`
          .card-avt {
            width: 20% !important;
            display: block !important;
            margin: auto !important;
            border-radius: 50% !important;
            max-width: 150px !important;
          }
        `}
      </style>
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName}</h1>
    </div>
  );
};
export default UserProfile;
