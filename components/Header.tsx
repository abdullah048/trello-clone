'use client';

import { useBoardStore } from '@/store/BoardStore';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import { useDebounce } from 'use-debounce';

const Header = () => {
  const { setSearchString, searchString } = useBoardStore(state => state);
  const [searchText, setSearchText] = useState<string>('');
  const [value] = useDebounce(searchText, 500);

  useEffect(() => {
    setSearchString(value);
  }, [value]);
  return (
    <header>
      <div className='flex flex-col md:flex-row items-center p-5 md:px-2 md:py-1 bg-gray-500/10'>
        <div className='absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055D1] rounded-md filter blur-3xl opacity-50 -z-10' />
        <Image
          priority
          src='https://links.papareact.com/c2cdd5'
          alt='Trello logo'
          width={300}
          height={100}
          className='w-44 md:w-56 pb-10 md:pb-0 object-contain'
        />
        <div className='flex items-center space-x-5 flex-1 justify-end w-full'>
          <form className='flex items-center space-x-5 bg-white rounded-md shadow-md p-2 flex-1 md:flex-initial'>
            <MagnifyingGlassIcon className='h-6 w-6 text-gray-400' />
            <input
              type='text'
              placeholder='Search'
              className='flex-1 outline-none text-gray-400'
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <button hidden type='submit'>
              Search
            </button>
          </form>

          <Avatar githubHandle='abdullah048' size='50' round />
        </div>
      </div>
    </header>
  );
};

export default Header;
