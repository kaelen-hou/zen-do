# Firebase Setup Instructions

## Issue: Firestore 400 Bad Request Error

You're getting a 400 Bad Request error because Firestore security rules haven't been configured. By default, Firestore denies all read/write operations for security.

## Quick Fix Options

### Option 1: Deploy Security Rules (Recommended)

1. Install Firebase CLI if you haven't:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init firestore
   ```
   - Select your Firebase project (zendo-aaf81)
   - Accept the default database rules file (firestore.rules)
   - Accept the default database indexes file (firestore.indexes.json)

4. Deploy the security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Option 2: Temporary Testing Rules (Firebase Console)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `zendo-aaf81`
3. Go to Firestore Database
4. Click on "Rules" tab
5. Replace the default rules with:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own todos
    match /todos/{todoId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Allow users to read and write their own user profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

6. Click "Publish"

## What These Rules Do

- **Authenticated Access**: Only signed-in users can access data
- **User Isolation**: Users can only access their own todos (where `userId` matches their auth UID)
- **Secure Creation**: New todos must have the correct userId field matching the authenticated user

## Alternative: Development Mode (NOT for Production)

For quick testing only, you could temporarily use test mode rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 12, 31);
    }
  }
}
```

**⚠️ Warning**: These rules allow anyone to read/write your database. Only use for testing and remember to update before going to production.

## Verify the Fix

After updating the rules:
1. Try creating a task in your app
2. Check the browser's Network tab - the Firestore request should now return 200 OK
3. Verify the task appears in your Firebase Console under Firestore Database

## Additional Debugging

If you still get errors, check:
1. Firebase Console > Authentication - make sure users are being created
2. Browser Developer Tools > Network tab - check the exact error response
3. Firebase Console > Firestore > Data - see if documents are being created