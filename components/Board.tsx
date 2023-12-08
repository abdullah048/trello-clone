'use client';

import { useBoardStore } from '@/store/BoardStore';
import { FC, useEffect } from 'react';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from './Column';

interface BoardProps {}

const Board: FC<BoardProps> = ({}) => {
  const { board, getBoard, setBoardState, updateTodo } = useBoardStore(
    state => state
  );
  useEffect(() => {
    getBoard();
  }, []);

  const handleOnDragEnd = (result: DropResult) => {
    const { type, source, destination } = result;
    // Check if user dragged card outside of board
    if (!destination) return;

    // Handle column drag
    if (type === 'column') {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const reArrangedColumns = new Map(entries);
      setBoardState({
        columns: reArrangedColumns,
      });
    }
    // Handle card drag
    if (type === 'card') {
      const columns = Array.from(board.columns);
      const startColIndex = columns[Number(source.droppableId)];
      const finishColIndex = columns[Number(destination.droppableId)];

      const startCol = {
        id: startColIndex[0],
        todos: startColIndex[1].todos,
      };

      const finishCol = {
        id: finishColIndex[0],
        todos: finishColIndex[1].todos,
      };

      if (!startCol || !finishCol) return;

      if (source.index === destination.index && startCol === finishCol) return;

      const newTodos = startCol.todos;
      const [todoMoved] = newTodos.splice(source.index, 1);

      if (startCol.id === finishCol.id) {
        // Same column task drag.
        newTodos.splice(destination.index, 0, todoMoved);
        const newColumn = {
          id: startCol.id,
          todos: newTodos,
        };
        const newColumns = new Map(board.columns);
        newColumns.set(startCol.id, newColumn);

        setBoardState({
          columns: newColumns,
        });
      } else {
        // dragging to another column.
        const finishTodos = Array.from(finishCol.todos);
        finishTodos.splice(destination.index, 0, todoMoved);
        const newColumns = new Map(board.columns);
        const newColumn = {
          id: startCol.id,
          todos: newTodos,
        };

        newColumns.set(startCol.id, newColumn);
        newColumns.set(finishCol.id, {
          id: finishCol.id,
          todos: finishTodos,
        });
        setBoardState({
          columns: newColumns,
        });
      }

      updateTodo(todoMoved, finishCol.id);
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId='board' direction='horizontal' type='column'>
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
