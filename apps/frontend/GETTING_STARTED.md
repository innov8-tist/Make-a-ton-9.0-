# Getting Started with the Login Page

## What You Have

A complete, professional authentication UI with:
- **Sign In page** with email, password, "Remember me", and "Forgot password"
- **Sign Up page** with full registration and password confirmation
- **OAuth buttons** for Google and GitHub
- **Form validation** with real-time error feedback
- **Responsive design** that works on all devices
- **Accessibility features** for keyboard and screen reader users
- **TypeScript support** for type-safe development
- **Ready-to-integrate API layer** with auth-service.ts

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd apps/frontend
npm install
```

The `react-hook-form` package was already added to package.json.

### 2. Run the Dev Server
```bash
npm run dev
```

This starts Vite on `http://localhost:5173`

### 3. View the Login Page
Open `http://localhost:5173/auth` in your browser

### 4. Test It Out
- Type in the form fields (watch validation work)
- Click the toggle link to switch between Sign In and Sign Up
- Try invalid emails to see error handling
- Click the OAuth buttons (not connected yet)

## File Structure

```
Your login page is built with these files:

🏗️ Components
  ├─ AuthPage.tsx          Main container with toggle logic
  ├─ SignInForm.tsx        Email/password login form
  ├─ SignUpForm.tsx        Registration form
  └─ AuthLayout.tsx        Shared wrapper layout

🎨 UI Components
  ├─ button.tsx            Reusable button with variants
  ├─ input.tsx             Text input field
  ├─ label.tsx             Form label
  ├─ checkbox.tsx          Checkbox input
  └─ icons.tsx             Icons (Google, GitHub, Spinner)

🛠️ Utilities
  ├─ auth-service.ts       API integration methods
  ├─ useAuth.ts            Authentication state hook
  ├─ types/auth.ts         TypeScript type definitions
  └─ slot.tsx              Utility component

📍 Routes
  └─ auth.tsx              Route configuration
```

## Connecting to Your Backend

### Step 1: Set Environment Variables
Create `.env.local` in `apps/frontend/`:
```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

### Step 2: Update Sign In Form
Edit `apps/frontend/src/components/auth/SignInForm.tsx`:

Find this section:
```typescript
const onSubmit = async (data: SignInFormData) => {
  // TODO: Implement sign in logic
  console.log('Sign in:', data);
};
```

Replace with:
```typescript
const onSubmit = async (data: SignInFormData) => {
  try {
    const result = await authService.signIn(data);
    
    // Store the token
    localStorage.setItem('token', result.token);
    
    // Redirect to dashboard or home
    // navigate({ to: '/dashboard' });
    
    console.log('Signed in as:', result.user.name);
  } catch (error) {
    // Show error to user
    alert(error instanceof Error ? error.message : 'Sign in failed');
  }
};
```

### Step 3: Update Sign Up Form
Edit `apps/frontend/src/components/auth/SignUpForm.tsx`:

Same pattern - replace the `onSubmit` function:
```typescript
const onSubmit = async (data: SignUpFormData) => {
  try {
    const result = await authService.signUp(data);
    localStorage.setItem('token', result.token);
    // navigate({ to: '/dashboard' });
    console.log('Account created for:', result.user.email);
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Sign up failed');
  }
};
```

### Step 4: Test the Connection
1. Make sure your backend is running on `http://localhost:3000`
2. Reload the auth page
3. Try signing in with valid credentials
4. Check browser DevTools Network tab to see API calls

## Customization

### Change the Colors
Open any component and update Tailwind classes:
```typescript
// Example: Change button color
<Button className="bg-blue-600 hover:bg-blue-700">Sign in</Button>
```

### Add More Form Fields
1. Update the type in `src/types/auth.ts`:
```typescript
export interface SignUpFormData {
  // ... existing fields
  company?: string;  // Add this
}
```

2. Add the field in the form component:
```typescript
<Input
  placeholder="Company name"
  {...register('company')}
/>
```

### Customize Error Messages
Update validation in form `register` calls:
```typescript
{...register('email', {
  required: 'Please enter your email address',  // Custom message
  pattern: { 
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Invalid email format'
  }
})}
```

## Using the Pre-Built Auth Service

The `auth-service.ts` file has ready-to-use API methods:

```typescript
import { authService } from '@/lib/auth-service';

// Sign in
const response = await authService.signIn({
  email: 'user@example.com',
  password: 'password123'
});

// Sign up
const response = await authService.signUp({
  name: 'John Doe',
  email: 'user@example.com',
  password: 'password123'
});

// Google sign in
const response = await authService.signInWithGoogle(googleToken);

// GitHub sign in
const response = await authService.signInWithGitHub(githubCode);

// Request password reset
await authService.requestPasswordReset('user@example.com');

// Reset password with token
await authService.resetPassword(resetToken, newPassword);

// Get current user
const user = await authService.getCurrentUser();

// Sign out
await authService.signOut();
```

## Expected API Responses

Your backend should return JSON in this format:

### Success Response
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Error Response
```json
{
  "error": "Invalid email or password"
}
```

## Backend API Endpoints Required

Your backend needs these endpoints:

```
POST   /auth/signin              - Sign in with email/password
POST   /auth/signup              - Create new account
POST   /auth/google              - Google OAuth callback
POST   /auth/github              - GitHub OAuth callback
POST   /auth/forgot-password     - Request password reset
POST   /auth/reset-password      - Reset password with token
POST   /auth/signout             - Sign out (optional)
GET    /auth/me                  - Get current user (optional)
```

## Troubleshooting

### Issue: Form won't submit
- Check browser console for errors
- Make sure API URL is correct in `.env.local`
- Check that backend is running

### Issue: Styles not showing
- Run `npm run dev` to restart the dev server
- Check that Tailwind is working on other pages
- Clear browser cache

### Issue: Validation not working
- Make sure you didn't modify the `register` calls
- Check browser console for errors
- Try clearing cache and reloading

### Issue: OAuth buttons do nothing
- OAuth integration requires setup with Google/GitHub
- See AUTH_SETUP.md for OAuth configuration

## Testing the UI

### Try These Scenarios
1. ✓ Click around - explore all interactive elements
2. ✓ Try typing invalid email addresses
3. ✓ Try passwords that don't match in sign up
4. ✓ Resize browser window to test responsive design
5. ✓ Press Tab to test keyboard navigation
6. ✓ Open DevTools and test on mobile view

### Use Browser DevTools
- **Elements tab**: Inspect the form structure
- **Console tab**: Check for JavaScript errors
- **Network tab**: Monitor API calls (when connected)
- **Application tab**: Check localStorage for token

## Documentation

For more detailed information, read these files:

- **QUICK_START.md** - 2-minute overview
- **AUTH_SETUP.md** - Complete setup guide
- **COMPONENT_STRUCTURE.md** - Architecture and data flow
- **UI_PREVIEW.md** - Design system and styling
- **IMPLEMENTATION_CHECKLIST.md** - Full checklist

## Next Steps

1. ✅ Get the UI running locally (done)
2. 🔄 Connect to your backend API
3. 🔑 Implement OAuth with Google and GitHub
4. 💾 Setup session/token management
5. 📧 Add email verification (optional)
6. 🔐 Add two-factor authentication (optional)
7. 🚀 Deploy to production

## Support Resources

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Your Project README](../../README.md)

---

**You're all set!** Your professional login page is ready to use and customize. Start with Step 2 above to see it in action.
