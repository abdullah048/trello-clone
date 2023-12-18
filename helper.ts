import { ID, databases, storage } from './appwrite';

export const getGroupedTodos = async () => {
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
  );

  const todos = data.documents;

  const columns = todos.reduce((acc, todo) => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }
    acc.get(todo.status)?.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      ...(todo.image && { image: JSON.parse(todo.image) }),
    });
    return acc;
  }, new Map<TypedColumn, Column>());

  // If columns doesn't have inprogress, todo, and done, add them with empty todos.
  const columnsTypes: TypedColumn[] = ['todo', 'inprogress', 'done'];
  for (const columnType of columnsTypes) {
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        todos: [],
      });
    }
  }

  // Sort the columns in the following order => todo, inprogress, done.
  const sortedColumns = new Map(
    Array.from(columns.entries()).sort(
      (a, b) => columnsTypes.indexOf(a[0]) - columnsTypes.indexOf(b[0])
    )
  );
  const board: Board = {
    columns: sortedColumns,
  };

  return board;
};

export const uploadImage = async (file: File) => {
  if (!file) return;
  const uploadedFile = await storage.createFile(
    process.env.NEXT_PUBLIC_BUCKET_ID!,
    ID.unique(),
    file
  );
  return uploadedFile;
};

export const getUrl = async (image: Image) => {
  const url = storage.getFilePreview(image.bucketId, image.fileId);
  return url;
};
