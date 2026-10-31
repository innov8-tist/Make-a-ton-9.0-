# Component Structure & Data Flow

## Component Hierarchy

```
AuthPage (src/components/auth/AuthPage.tsx)
└── State: isSignUp (boolean toggle)
    ├── AuthLayout
    │   └── SignInForm or SignUpForm
    │       ├── form (react-hook-form)
    │       ├── Input components
    │       ├── Label components
    │       ├── Checkbox components
    │       └── Button components
    └── OAuth Buttons (in forms)
```

## Data Flow

### Sign In Flow
```
User Input
    ↓
SignInForm (react-hook-form validation)
    ↓
onSubmit → authService.signIn()
    ↓
API POST /auth/signin
    ↓
Response { user, token }
    ↓
localStorage.setItem('token')
    ↓
redirect to /dashboard
```

### Sign Up Flow
```
User Input
    ↓
SignUpForm (validation + password match)
    ↓
onSubmit → authService.signUp()
    ↓
API POST /auth/signup
    ↓
Response { user, token }
    ↓
localStorage.setItem('token')
    ↓
redirect to /dashboard
```

### Toggle Flow
```
User clicks "Sign up" button
    ↓
SignInForm → onToggle()
    ↓
AuthPage updates isSignUp state
    ↓
Renders SignUpForm instead
    ↓
Vice versa for switching back
```

## Component Props

### AuthPage
```typescript
Props: none
State: 
  - isSignUp: boolean
Methods:
  - toggleMode: () => void
```

### AuthLayout
```typescript
Props:
  - children: ReactNode
  - title: string
  - subtitle?: string
Returns: JSX wrapped in centered container
```

### SignInForm
```typescript
Props:
  - onToggle: () => void
Form Data:
  - email: string
  - password: string
  - remember: boolean
Validation:
  - email: required, valid email format
  - password: required
```

### SignUpForm
```typescript
Props:
  - onToggle: () => void
Form Data:
  - name: string
  - email: string
  - password: string (min 8 chars)
  - confirmPassword: string
  - agreeToTerms: boolean
Validation:
  - all fields required
  - password >= 8 characters
  - confirmPassword must match password
  - agreeToTerms must be true
```

## UI Components

### Button
```typescript
Props:
  - variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  - size?: 'default' | 'sm' | 'lg' | 'icon'
  - disabled?: boolean
  - onClick?: () => void
  - children: ReactNode
```

### Input
```typescript
Props:
  - type?: 'text' | 'email' | 'password' | 'number' | etc.
  - placeholder?: string
  - disabled?: boolean
  - value?: string
  - onChange?: (e: ChangeEvent) => void
  - ...standard HTML input attributes
```

### Label
```typescript
Props:
  - htmlFor?: string
  - children: ReactNode
  - className?: string
```

### Checkbox
```typescript
Props:
  - id?: string
  - checked?: boolean
  - onChange?: (checked: boolean) => void
  - disabled?: boolean
  - ...standard HTML input attributes
```

## Form Validation Logic

### SignIn Validation
```
email: 
  ✓ Required
  ✓ Valid email format (HTML5)

password:
  ✓ Required
  ✓ No length requirement (server validates)
```

### SignUp Validation
```
name:
  ✓ Required
  ✓ Text only

email:
  ✓ Required
  ✓ Valid email format
  ✓ Unique check on backend

password:
  ✓ Required
  ✓ Minimum 8 characters
  ✓ Server should check strength

confirmPassword:
  ✓ Required
  ✓ Must match password field (client-side)

agreeToTerms:
  ✓ Must be checked
  ✓ Legal requirement
```

## State Management Options

### Current (None)
Forms use local react-hook-form state only.

### Recommended (for production)

#### Option 1: useAuth Hook
```typescript
const { user, isLoading, error, signIn, signUp } = useAuth();
```

#### Option 2: Context API
```typescript
const { user, isAuthenticated } = useContext(AuthContext);
```

#### Option 3: Zustand Store
```typescript
const { user, signIn, signUp } = useAuthStore();
```

#### Option 4: TanStack Query
```typescript
const { mutate: signIn } = useMutation({
  mutationFn: authService.signIn,
});
```

## Error Handling

### Form Validation Errors
- Display inline under each field
- Red text, 12px font
- Clear when user corrects the field

### API Errors
- Display in toast/alert at top
- "Email already exists", "Invalid credentials", etc.
- Auto-dismiss after 5 seconds or user click

### Network Errors
- Show generic "Connection error. Please try again."
- Allow user to retry

## Loading States

### Button Loading
- Disable button when `isLoading`
- Show spinner icon
- Change text to "Signing in..." or "Creating account..."

### Form Loading
- Disable all inputs while submitting
- Disable all buttons
- Prevent double submission

## Responsive Breakpoints

```
Mobile (< 640px)
- Full width form
- Padding: 16px
- Font size: 14px

Tablet (640px - 1024px)
- Max width: 480px
- Padding: 24px
- Font size: 14px

Desktop (> 1024px)
- Max width: 448px (defined in AuthLayout)
- Padding: 32px
- Font size: 14px
```

## Accessibility Features

✅ Proper `<label>` associations with `htmlFor`  
✅ Semantic HTML (form, input, button, label)  
✅ ARIA attributes on error messages  
✅ Keyboard navigation (Tab, Enter, Space)  
✅ Focus indicators (ring-2)  
✅ Color contrast ratios meet WCAG AA  
✅ Error messages linked to inputs  
✅ Loading states have aria-busy  

## Performance Considerations

- Components are lightweight and functional
- No unnecessary re-renders (react-hook-form optimization)
- Icons from lucide-react (tree-shakeable)
- CSS is tailwind (purged in production)
- Form state is local (no global state overhead)

## Security Best Practices

- Passwords sent via HTTPS only
- No password stored in localStorage
- Token stored in localStorage (vulnerable but simple)
- CSRF protection via httpOnly cookies recommended
- Sanitization handled by browser/framework
- Rate limiting on API (backend responsibility)

---

For integration questions, check AUTH_SETUP.md or QUICK_START.md
