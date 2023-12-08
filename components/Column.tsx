import { FC } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

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
                    {todos.length}
                  </span>
                </h2>
                <div className='space-y-2'>
                  {/* {todos.map((todo, index) => (
                        <Draggable>

                        </Draggable>
                    ))} */}
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
