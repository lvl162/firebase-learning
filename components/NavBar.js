import Link from 'next/link';
import Image from 'next/image';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

export default function NavBar() {
  const { user, username } = useContext(UserContext);

  return (
    <nav className='navbar'>
      <ul>
        <li>
          <Link href='/'>
            <button className='btn-logo'>FEED</button>
          </Link>
        </li>

        {username && (
          // da co username
          <>
            <li className='push-left'>
              <Link href='/admin'>
                <button className='btn-blue'>Write Posts</button>
              </Link>
            </li>
            <li>
              <style jsx global>{`
                .avatar {
                  border-radius: 50%;
                  width: 50px;
                  height: 50px;
                  cursor: pointer;
                }
              `}</style>
              <Link href={`/${username}`}>
                <Image
                  className='avatar'
                  src={user?.photoURL}
                  width={50}
                  height={50}
                ></Image>
              </Link>
            </li>
          </>
        )}

        {!username && (
          <>
            <li>
              <Link href='/enter'>
                <button className='btn-blue'>Login</button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
