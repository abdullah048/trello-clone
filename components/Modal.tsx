'use client';
import { useBoardStore } from '@/store/BoardStore';
import { useModalStore } from '@/store/ModalStore';
import { Dialog, Transition } from '@headlessui/react';
import { FormEvent, Fragment, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import TaskTypeRadioGroup from './TaskTypeRadioGroup';
import Image from 'next/image';
import { ArrowPathIcon, PhotoIcon } from '@heroicons/react/24/solid';

const Modal = () => {
  const { isOpen, closeModal } = useModalStore(state => state);
  const {
    newTaskText,
    setNewTaskText,
    addTask,
    newTaskType,
    loading,
    setLoading,
  } = useBoardStore(state => state);
  const [inputText, setInputText] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const imagePickRef = useRef<HTMLInputElement | null>(null);
  const [debouncedValue] = useDebounce(inputText, 500);

  useEffect(() => {
    setNewTaskText(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    if (!loading) {
      closeModal();
      setImage(null);
      setInputText('');
    }
  }, [loading]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setLoading();
    e.preventDefault();
    if (!newTaskText) return;
    addTask(newTaskText, newTaskType, image);
    // closeModal();
  };

  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='form'
        onSubmit={handleSubmit}
        className='relative z-10'
        onClose={closeModal}>
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
                <TaskTypeRadioGroup />

                <div className='mt-2'>
                  {image && (
                    <Image
                      src={URL.createObjectURL(image)}
                      width={200}
                      height={200}
                      alt='Uploaded Image'
                      className='w-full h-44 object-cover mt-2 filter rounded-md mb-3 hover:grayscale transition-all duration-150 cursor-not-allowed'
                      onClick={() => setImage(null)}
                    />
                  )}
                  <button
                    type='button'
                    onClick={() => {
                      imagePickRef.current?.click();
                    }}
                    className='w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'>
                    <PhotoIcon className='h-6 w-6 inline-block mr-2' />
                    Upload Image
                  </button>

                  <input
                    type='file'
                    ref={imagePickRef}
                    hidden
                    accept='image/*'
                    onChange={e => {
                      setImage(e.target.files![0]);
                    }}
                  />
                </div>

                <div className='mt-4'>
                  <button
                    disabled={!newTaskText || loading}
                    type='submit'
                    className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed'>
                    {loading && (
                      <svg
                        className='animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'>
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          stroke-width='4'></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                    )}
                    Add Task
                  </button>
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
