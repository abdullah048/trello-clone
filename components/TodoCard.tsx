'use client';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { FC } from 'react';
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from 'react-beautiful-dnd';

interface TodoCardProps {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

const TodoCard: FC<TodoCardProps> = ({
  todo,
  id,
  index,
  innerRef,
  dragHandleProps,
  draggableProps,
}) => {
  return (
    <div
      className='bg-white rounded-md space-y-2 drop-shadow-md'
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}>
      <div className='flex justify-between items-center p-5'>
        <p>{todo.title}</p>
        <button className='text-red-500 hover:text-red-600'>
          <XCircleIcon className='ml-5 w-8 h-8' />
        </button>
      </div>
      {/* Note: Add Todo Image logic below... */}
      {/* {imageUrl && (

      )} */}
    </div>
  );
};

export default TodoCard;
