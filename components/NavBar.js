import Link from 'next/link';
import Image from 'next/image'
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
              <Link href={`/${username}`}>
                <Image src={user?.photoURL}></Image>
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
