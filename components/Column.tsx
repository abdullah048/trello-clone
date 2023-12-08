import { FC } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import TodoCard from './TodoCard';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { useBoardStore } from '@/store/BoardStore';
import { useModalStore } from '@/store/ModalStore';

interface ColumnProps {
  id: TypedColumn;
  index: number;
  todos: [] | Todo[];
}

const idToColumnHeading: {
  [key in TypedColumn]: string;
} = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

const Column: FC<ColumnProps> = ({ id, todos, index }) => {
  const { searchString } = useBoardStore(state => state);
  const { openModal } = useModalStore(state => state);
  return (
    <Draggable draggableId={id} index={index}>
      {provided => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}>
          <Droppable droppableId={index.toString()} type='card'>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`p-2 rounded-2xl shadow-sm bg-white/50`}>
                <h2 className='flex justify-between items-center text-md lg:text-lg xl:text-xl p-2 font-bold'>
                  {idToColumnHeading[id]}
                  <span className='text-gray-500 bg-gray-200 rounded-lg px-3 py-2 text-sm flex justify-center items-center'>
                    {!searchString
                      ? todos.length
                      : todos.filter(todo =>
                          todo.title
                            .toLowerCase()
                            .includes(searchString.toLowerCase())
                        ).length}
                  </span>
                </h2>
                <div className='space-y-2'>
                  {todos.map((todo, index) => {
                    if (
                      searchString &&
                      !todo.title
                        .toLowerCase()
                        .includes(searchString.toLowerCase())
                    )
                      return null;
                    return (
                      <Draggable
                        key={todo.$id}
                        draggableId={todo.$id}
                        index={index}>
                        {provided => (
                          <TodoCard
                            todo={todo}
                            index={index}
                            id={id}
                            innerRef={provided.innerRef}
                            draggableProps={provided.draggableProps}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                  <div className='flex items-end justify-end p-2'>
                    <button
                      className='text-green-600 hover:text-green-700'
                      onClick={openModal}>
                      <PlusCircleIcon className='h-10 w-10' />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
