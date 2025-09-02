import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/shared/utils/lib/firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export class AuthService {
  static async signInWithEmail(email: string, password: string): Promise<void> {
    if (!auth) throw new Error('Firebase not initialized');
    await signInWithEmailAndPassword(auth, email, password);
  }

  static async signUp(
    email: string,
    password: string,
    displayName?: string
  ): Promise<void> {
    if (!auth) throw new Error('Firebase not initialized');
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
  }

  static async signInWithGoogle(): Promise<void> {
    if (!auth) throw new Error('Firebase not initialized');
    const provider = new GoogleAuthProvider();
    // 设置 Google 登录的额外配置
    provider.addScope('profile');
    provider.addScope('email');
    provider.setCustomParameters({
      prompt: 'select_account', // 允许用户选择账户
    });

    try {
      await signInWithPopup(auth, provider);
    } catch (error: unknown) {
      // 处理弹窗被阻止的情况
      const firebaseError = error as { code?: string; message?: string };
      if (firebaseError.code === 'auth/popup-blocked') {
        throw new Error('弹窗被浏览器阻止，请允许弹窗后重试');
      } else if (firebaseError.code === 'auth/popup-closed-by-user') {
        throw new Error('登录已取消');
      } else if (firebaseError.code === 'auth/cancelled-popup-request') {
        // 用户取消了登录，不需要抛出错误
        return;
      }
      throw error;
    }
  }

  static async signOut(): Promise<void> {
    if (!auth) throw new Error('Firebase not initialized');
    await signOut(auth);
  }

  static async resetPassword(email: string): Promise<void> {
    if (!auth) throw new Error('Firebase not initialized');
    await sendPasswordResetEmail(auth, email);
  }

  static async updateUserProfile(
    displayName: string,
    photoURL?: string
  ): Promise<void> {
    if (!auth) throw new Error('Firebase not initialized');
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName, photoURL });
    }
  }

  static convertFirebaseUser(firebaseUser: FirebaseUser): AuthUser {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
    };
  }
}
