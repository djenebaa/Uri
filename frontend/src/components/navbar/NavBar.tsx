import Link from 'next/link';

function NavBar() {
  return (
    <nav className="text-white flex justify-between m-7">
      <ul className="flex flex-row space-x-5">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/genre">Genre</Link>
        </li>
      </ul>
      <ul>
      
          <li>
            <Link href="/profile">Profile</Link>
          </li>
        
      </ul>
    </nav>
  );
}

export default NavBar;
