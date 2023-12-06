'use client';

import { useBoardStore } from '@/store/BoardStore';
import { FC, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

interface BoardProps {}

const Board: FC<BoardProps> = ({}) => {
  const getBoard = useBoardStore(state => state.getBoard);
  useEffect(() => {
    getBoard();
  }, []);

  return (
    <DragDropContext onDragEnd={() => {}}>
      <Droppable droppableId='board' direction='horizontal' type='column'>
        {provided => <div>{/* Rendering all the columns */}</div>}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
