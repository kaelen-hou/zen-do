import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Todo } from '@/types';
import { CreateTaskInput } from './validations';

const TODOS_COLLECTION = 'todos';

export async function createTodo(
  userId: string,
  data: CreateTaskInput
): Promise<string> {
  console.log('=== CREATE TODO DEBUG ===');
  console.log('1. User ID:', userId);
  console.log('2. Input data:', data);
  console.log('3. Firebase auth current user:', auth.currentUser?.uid);
  console.log('4. Auth state match:', auth.currentUser?.uid === userId);

  try {
    const todoData = {
      ...data,
      userId,
      attachments: [],
      dueDate: data.dueDate ? Timestamp.fromDate(data.dueDate) : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      deletedAt: null,
    };

    console.log('5. Final todo data:', todoData);
    console.log('6. Collection path:', TODOS_COLLECTION);

    const docRef = await addDoc(collection(db, TODOS_COLLECTION), todoData);
    console.log('✅ Document created successfully:', docRef.id);
    return docRef.id;
  } catch (error: unknown) {
    console.error('❌ DETAILED ERROR INFORMATION:');
    if (error instanceof Error) {
      console.error('- Error message:', error.message);
      console.error('- Error stack:', error.stack);
    }
    console.error('- Full error object:', error);

    // Additional Firebase-specific error info
    if (error && typeof error === 'object' && 'customData' in error) {
      console.error(
        '- Custom data:',
        (error as Record<string, unknown>).customData
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to create task: ${errorMessage}`);
  }
}

export async function getTodos(userId: string): Promise<Todo[]> {
  try {
    console.log('🔍 Starting getTodos for userId:', userId);

    // 使用简单查询避免复合索引需求
    const q = query(
      collection(db, TODOS_COLLECTION),
      where('userId', '==', userId)
    );

    console.log('📋 Executing query...');
    const querySnapshot = await getDocs(q);
    console.log('📊 Query snapshot size:', querySnapshot.size);

    const todos: Todo[] = [];

    querySnapshot.forEach(doc => {
      console.log('📄 Processing document:', doc.id);
      const data = doc.data();
      console.log('📝 Document data:', data);

      // 只处理未删除的任务
      if (!data.deletedAt) {
        todos.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          dueDate: data.dueDate?.toDate() || null,
          priority: data.priority,
          status: data.status,
          attachments: data.attachments || [],
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          deletedAt: data.deletedAt?.toDate() || null,
          userId: data.userId,
        });
      }
    });

    // 在客户端按创建时间降序排序
    todos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    console.log('✅ Returning', todos.length, 'todos');
    return todos;
  } catch (error) {
    console.error('❌ Error fetching todos:', error);
    throw new Error('Failed to fetch tasks');
  }
}

export async function updateTodo(
  todoId: string,
  data: Partial<Todo>
): Promise<void> {
  try {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    await updateDoc(todoRef, {
      ...data,
      updatedAt: Timestamp.now(),
      ...(data.dueDate && { dueDate: Timestamp.fromDate(data.dueDate) }),
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    throw new Error('Failed to update task');
  }
}

// 软删除：移到回收站
export async function deleteTodo(todoId: string): Promise<void> {
  try {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    await updateDoc(todoRef, {
      deletedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw new Error('Failed to delete task');
  }
}

// 获取回收站中的任务
export async function getDeletedTodos(userId: string): Promise<Todo[]> {
  try {
    // 使用简单查询避免复合索引需求
    const q = query(
      collection(db, TODOS_COLLECTION),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const todos: Todo[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();

      // 只处理已删除的任务
      if (data.deletedAt) {
        todos.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          dueDate: data.dueDate?.toDate() || null,
          priority: data.priority,
          status: data.status,
          attachments: data.attachments || [],
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          deletedAt: data.deletedAt?.toDate() || null,
          userId: data.userId,
        });
      }
    });

    // 在客户端按删除时间降序排序
    todos.sort((a, b) => {
      if (!a.deletedAt || !b.deletedAt) return 0;
      return b.deletedAt.getTime() - a.deletedAt.getTime();
    });

    return todos;
  } catch (error) {
    console.error('Error fetching deleted todos:', error);
    throw new Error('Failed to fetch deleted tasks');
  }
}

// 从回收站恢复任务
export async function restoreTodo(todoId: string): Promise<void> {
  try {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    await updateDoc(todoRef, {
      deletedAt: null,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error restoring todo:', error);
    throw new Error('Failed to restore task');
  }
}

// 永久删除任务
export async function permanentlyDeleteTodo(todoId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, TODOS_COLLECTION, todoId));
  } catch (error) {
    console.error('Error permanently deleting todo:', error);
    throw new Error('Failed to permanently delete task');
  }
}
