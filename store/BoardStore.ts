import { databases, storage } from '@/appwrite';
import { getGroupedTodos } from '@/helper';
import { create } from 'zustand';

interface BoardState {
  board: Board;
  searchString: string;
  newTaskText: string;
  newTaskType: TypedColumn;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;
  updateTodo: (todo: Todo, columnId: TypedColumn) => void;
  setSearchString: (searchString: string) => void;
  setNewTaskText: (text: string) => void;
  setNewTaskType: (columnId: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  searchString: '',
  newTaskText: '',
  newTaskType: 'todo',
  getBoard: async () => {
    const board = await getGroupedTodos();
    set({ board });
  },
  setBoardState: board => set({ board }),
  updateTodo: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },
  deleteTask: async (taskIndex, todo, id) => {
    const newColumns = new Map(get().board.columns);
    newColumns.get(id)?.todos.splice(taskIndex, 1);
    set({ board: { columns: newColumns } });
    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },
  addTask: async () => {
    // Todo: call appwrite api here...
  },
  setSearchString: searchString => set({ searchString }),
  setNewTaskText: taskText => set({ newTaskText: taskText }),
  setNewTaskType: columnId => set({ newTaskType: columnId }),
}));
