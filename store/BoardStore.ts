import { ID, databases, storage } from '@/appwrite';
import { getGroupedTodos, uploadImage } from '@/helper';
import { create } from 'zustand';

interface BoardState {
  board: Board;
  loading: boolean;
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
  setLoading: () => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  searchString: '',
  newTaskText: '',
  newTaskType: 'todo',
  loading: false,
  setLoading: () => set({ loading: !get().loading }),
  getBoard: async () => {
    const board = await getGroupedTodos();
    set({ board });
    set({ loading: false });
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
  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;
    set({ loading: true });
    if (image) {
      const uploadedImage = await uploadImage(image);
      if (uploadedImage) {
        file = {
          bucketId: uploadedImage?.bucketId,
          fileId: uploadedImage?.$id,
        };
      }
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    set({ newTaskText: '' });
    set(state => {
      const newColumns = new Map(state.board.columns);
      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      };
      const column = newColumns.get(columnId);
      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }
      set({ loading: false });
      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },
  setSearchString: searchString => set({ searchString }),
  setNewTaskText: taskText => set({ newTaskText: taskText }),
  setNewTaskType: columnId => set({ newTaskType: columnId }),
}));
