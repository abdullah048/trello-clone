'use client';
import { useBoardStore } from '@/store/BoardStore';
import { useModalStore } from '@/store/ModalStore';
import { Dialog, Transition } from '@headlessui/react';
import { FC, Fragment, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

interface ModalProps {}

const Modal: FC<ModalProps> = ({}) => {
  const { isOpen, closeModal } = useModalStore(state => state);
  const { setNewTaskText } = useBoardStore(state => state);
  const [inputText, setInputText] = useState<string>('');

  const [debouncedValue] = useDebounce(inputText, 500);

  useEffect(() => {
    setNewTaskText(debouncedValue);
  }, [debouncedValue]);

  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='form' className='relative z-10' onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>
        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'>
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle  transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-md font-medium leading-6 text-gray-900  pb-2'>
                  Add a Task
                </Dialog.Title>
                <div className=''>
                  <input
                    type='text'
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder='Enter a task here...'
                    className='w-full border border-gray-300 rounded-md outline-none p-3'
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
