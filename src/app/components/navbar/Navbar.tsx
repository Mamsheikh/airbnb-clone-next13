'use client';

import Container from '../Container';
import Logo from './Logo';
import Search from './Search';
import UserMenu from './UserMenu';

const Navbar = () => {
  return (
    <div className='fixed bg-white w-full shadow-sm z-10'>
      <div className='py-4 border-b-[1px]'>
        <Container>
          <div
            className='
            flex
            flex-row
            items-center
            gap-3
            md:gap-0
            justify-between
          '
          >
            <Logo />
            <Search />
            <UserMenu />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
