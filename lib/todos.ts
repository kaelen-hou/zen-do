import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  Timestamp 
} from 'firebase/firestore'
import { db, auth } from './firebase'
import { Todo } from '@/types'
import { CreateTaskInput } from './validations'

const TODOS_COLLECTION = 'todos'

export async function createTodo(userId: string, data: CreateTaskInput): Promise<string> {
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
      console.error('- Custom data:', (error as Record<string, unknown>).customData);
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to create task: ${errorMessage}`);
  }
}

export async function getTodos(userId: string): Promise<Todo[]> {
  try {
    console.log('🔍 Starting getTodos for userId:', userId);
    
    const q = query(
      collection(db, TODOS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    console.log('📋 Executing query...');
    const querySnapshot = await getDocs(q)
    console.log('📊 Query snapshot size:', querySnapshot.size);
    
    const todos: Todo[] = []
    
    querySnapshot.forEach((doc) => {
      console.log('📄 Processing document:', doc.id);
      const data = doc.data()
      console.log('📝 Document data:', data);
      
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
        userId: data.userId,
      })
    })
    
    console.log('✅ Returning', todos.length, 'todos');
    return todos
  } catch (error) {
    console.error('❌ Error fetching todos:', error)
    throw new Error('Failed to fetch tasks')
  }
}

export async function updateTodo(todoId: string, data: Partial<Todo>): Promise<void> {
  try {
    const todoRef = doc(db, TODOS_COLLECTION, todoId)
    await updateDoc(todoRef, {
      ...data,
      updatedAt: Timestamp.now(),
      ...(data.dueDate && { dueDate: Timestamp.fromDate(data.dueDate) }),
    })
  } catch (error) {
    console.error('Error updating todo:', error)
    throw new Error('Failed to update task')
  }
}

export async function deleteTodo(todoId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, TODOS_COLLECTION, todoId))
  } catch (error) {
    console.error('Error deleting todo:', error)
    throw new Error('Failed to delete task')
  }
}