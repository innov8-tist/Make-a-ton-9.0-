# Authentication UI Setup

## Overview
Professional login page with Sign In and Sign Up forms, built with React, TypeScript, Tailwind CSS, shadcn/ui components, and react-hook-form.

## Features
✅ Sign In form with email/password and "Remember me" option  
✅ Sign Up form with password confirmation validation  
✅ Forgot / reset password flow  
✅ Professional responsive design  
✅ Form validation with react-hook-form  
✅ Loading states and error handling  
✅ Smooth toggles between Sign In and Sign Up  

## File Structure
```
apps/frontend/src/
├── components/
│   ├── auth/
│   │   ├── AuthLayout.tsx       # Layout wrapper
│   │   ├── AuthPage.tsx         # Sign in / sign up / forgot / reset state machine
│   │   ├── SignInForm.tsx       # Sign in form
│   │   ├── SignUpForm.tsx       # Sign up form
│   │   ├── ForgotPasswordForm.tsx # Request a reset link
│   │   └── ResetPasswordForm.tsx  # Set a new password from a reset token
│   └── ui/
│       ├── button.tsx           # Button component
│       ├── input.tsx            # Input component
│       ├── label.tsx            # Label component
│       ├── checkbox.tsx         # Checkbox component
│       └── icons.tsx            # Icon exports
├── types/
│   └── auth.ts                  # Auth type definitions
├── lib/
│   ├── utils.ts                 # Utility functions (cn)
│   └── slot.tsx                 # Slot component
└── routes/
    └── auth.tsx                 # Auth route
```

## Installation

### 1. Install Dependencies
```bash
cd apps/frontend
npm install  # or pnpm install / yarn install
```

### 2. Environment Variables
Add to `.env.local`:
```env
VITE_API_URL=http://localhost:3000
```

## Usage

### Access the Auth Page
Navigate to `/auth` in your browser.

### API Integration
Update the form submission handlers in:
- `SignInForm.tsx` - `onSubmit` function
- `SignUpForm.tsx` - `onSubmit` function

Example:
```typescript
const onSubmit = async (data: SignInFormData) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (response.ok) {
    const { token } = await response.json();
    localStorage.setItem('token', token);
    // Redirect to dashboard
  }
};
```

### Password Reset Flow

`AuthPage` switches between four modes: `signin`, `signup`, `forgot`, `reset`. A reset
link opens the page in reset mode straight from the URL:

```
/auth?mode=reset&token=<token>
```

`POST /auth/forgot-password` and `POST /auth/reset-password` are called through
`authService`. Until the API implements them, dev builds fall back to
`src/lib/auth-dev-mock.ts`, which issues single-use tokens that expire after 30 minutes
and shows a "Continue to reset password" shortcut in place of the email. Production
builds never use the mock and surface the API error instead.

A successful reset clears the stored session token and returns the user to sign in.

## Customization

### Change Colors
Edit Tailwind classes in component files. Base colors are using `neutral` palette.

### Modify Form Fields
Edit `SignInForm.tsx` or `SignUpForm.tsx`:
- Update the `useForm` default values
- Add/remove fields in the form JSX
- Update TypeScript types in `types/auth.ts`

### Add More OAuth Providers
1. Add the provider icon to `icons.tsx` (lucide-react no longer ships brand icons)
2. Add the button to the form components
3. Implement the OAuth handler and the matching `authService` call

## Dependencies
- `react` - UI library
- `react-hook-form` - Form state management
- `tailwindcss` - CSS framework
- `lucide-react` - Icons
- `class-variance-authority` - Component variants
- `clsx` - Class merging utility
- `tailwind-merge` - Tailwind class resolution

## Testing
Visit `http://localhost:5173/auth` (default Vite port) to test the UI.

## Next Steps
1. Connect to backend API endpoints
2. Implement OAuth flow with your providers
3. Implement the reset endpoints server-side and remove the dev mock
4. Implement email verification
5. Add session management/auth state management
