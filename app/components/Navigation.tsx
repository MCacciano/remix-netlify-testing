import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

export default function Navigation({ user }: { user: any }) {
  const [showUserNav, setShowUserNav] = useState(false);

  const toggleUserNav = () => {
    setShowUserNav(prev => !prev);
  };

  return (
    <nav className="border-b border-gray-900 font-rubik">
      <div className="flex justify-evenly">
        <div className="flex-1 flex justify-start">
          <Link to="/feed" className="p-5">
            LFGroup
          </Link>
        </div>
        <div className="flex-1 flex justify-end gap-4">
          {user?.id ? (
            <div className="relative">
              <div
                className="flex cursor-pointer p-5"
                onClick={toggleUserNav}
                onMouseLeave={() => setShowUserNav(false)}
              >
                <h3>{user.username}</h3>
                {showUserNav ? (
                  <ChevronUpIcon className="w-5" />
                ) : (
                  <ChevronDownIcon className="w-5" />
                )}
              </div>
              {showUserNav ? (
                <ul
                  className="absolute top-14 right-6 bg-white border border-gray-900 font-rubik z-50"
                  onMouseEnter={() => setShowUserNav(true)}
                  onMouseLeave={() => setShowUserNav(false)}
                >
                  <li className="border-b border-gray-900" onClick={toggleUserNav}>
                    <Link
                      to={`/user/${user.id}`}
                      className="py-2 px-4 block hover:bg-gray-900 hover:text-white"
                    >
                      Profile
                    </Link>
                  </li>
                  <li className="border-b border-gray-900 py-2 px-4 hover:bg-gray-900 hover:text-white">
                    <form action="/logout" method="post">
                      <button type="submit">Logout</button>
                    </form>
                  </li>
                </ul>
              ) : null}
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
