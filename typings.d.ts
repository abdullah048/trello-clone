interface Board {
  columns: Map<TypedColumn, Column>;
}

type TypedColumn = 'todo' | 'inprogress' | 'done';

interface Todo {
  $id: string;
  $createdAt: string;
  title: string;
  status: TypedColumn;
  image?: Image;
}

interface Image {
  bucketId: string;
  fileId: string;
}

interface Column {
  id: TypedColumn;
  todos: Todo[];
}
