'use client';

import { useBoardStore } from '@/store/BoardStore';
import { FC, useEffect } from 'react';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from './Column';

interface BoardProps {}

const Board: FC<BoardProps> = ({}) => {
  const { board, getBoard } = useBoardStore(state => state);
  useEffect(() => {
    getBoard();
  }, []);

  const handleOnDragEnd = (result: DropResult) => {};

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId='board' direction='horizontal' type='COLUMN'>
        {provided => (
          <div
            className='grid grid-cols-1 md:grid-cols-3 gap-5 px-7 md:px-3 lg:px-5 max-w-7xl mx-auto mt-5'
            {...provided.droppableProps}
            ref={provided.innerRef}>
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
