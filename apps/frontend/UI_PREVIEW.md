# UI Preview & Design Guide

## Sign In Page Layout

```
┌─────────────────────────────────────────┐
│                                         │
│     Please enter your details to       │
│        sign in                          │
│                                         │
│   Welcome back                          │
│                                         │
│   ┌───────────────────────────────────┐ │
│   │ Email address                     │ │
│   │ your@email.com                    │ │
│   └───────────────────────────────────┘ │
│                                         │
│   ┌───────────────────────────────────┐ │
│   │ Password                          │ │
│   │ ••••••••                          │ │
│   └───────────────────────────────────┘ │
│                                         │
│   [☐] Remember for 30 days   Forgot    │
│                             password?  │
│                                         │
│   ┌───────────────────────────────────┐ │
│   │         Sign in                   │ │
│   └───────────────────────────────────┘ │
│                                         │
│   Don't have an account? Sign up        │
│                                         │
└─────────────────────────────────────────┘
```

## Forgot Password Page Layout

```
┌─────────────────────────────────────────┐
│                                         │
│   Reset your password                   │
│   Enter your email and we will send     │
│   you a reset link                      │
│                                         │
│   ┌───────────────────────────────────┐ │
│   │ Email address                     │ │
│   │ your@email.com                    │ │
│   └───────────────────────────────────┘ │
│                                         │
│   ┌───────────────────────────────────┐ │
│   │       Send reset link             │ │
│   └───────────────────────────────────┘ │
│                                         │
│            Back to sign in              │
│                                         │
└─────────────────────────────────────────┘
```

## Reset Password Page Layout

```
┌─────────────────────────────────────────┐
│                                         │
│   Choose a new password                 │
│                                         │
│   ┌───────────────────────────────────┐ │
│   │ New password                      │ │
│   │ ••••••••                          │ │
│   └───────────────────────────────────┘ │
│                                         │
│   ┌───────────────────────────────────┐ │
│   │ Confirm new password              │ │
│   │ ••••••••                          │ │
│   └───────────────────────────────────┘ │
│                                         │
│   ┌───────────────────────────────────┐ │
│   │        Reset password             │ │
│   └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

## Sign Up Page Layout

```
┌─────────────────────────────────────────┐
│                                         │
│   Please enter your details to get     │
│        started                          │
│                                         │
│   Create account                        │
│                                         │
│   ┌───────────────────────────────────┐ │
│   │ Full name                         │ │
│   │ John Doe                          │ │
│   └───────────────────────────────────┘ │
│                                         │
│   ┌───────────────────────────────────┐ │
│   │ Email address                     │ │
│   │ your@email.com                    │ │
│   └───────────────────────────────────┘ │
│                                         │
│   ┌───────────────────────────────────┐ │
│   │ Password                          │ │
│   │ ••••••••                          │ │
│   └───────────────────────────────────┘ │
│                                         │
│   ┌───────────────────────────────────┐ │
│   │ Confirm password                  │ │
│   │ ••••••••                          │ │
│   └───────────────────────────────────┘ │
│                                         │
│   [☐] I agree to the terms of          │
│       service and privacy policy       │
│                                         │
│   ┌───────────────────────────────────┐ │
│   │      Create account                │ │
│   └───────────────────────────────────┘ │
│                                         │
│   Already have an account? Sign in      │
│                                         │
└─────────────────────────────────────────┘
```

## Color Palette

### Primary Colors
- **Background**: `bg-gradient-to-br from-slate-50 to-slate-100`
- **Card**: `bg-white`
- **Text**: `text-slate-900` (heading), `text-slate-600` (secondary)

### Interactive Elements
- **Primary Button**: `bg-neutral-900 text-white` → hover `bg-neutral-800`
- **Secondary Button (Outline)**: `border border-neutral-200 bg-white` → hover `bg-neutral-100`
- **Links**: `text-blue-600` → hover `text-blue-700`

### States
- **Error**: `text-red-500`
- **Disabled**: `opacity-50 cursor-not-allowed`
- **Focus**: `ring-2 ring-neutral-950 ring-offset-2`

## Typography

```
Heading (h1): 
  - Font size: 30px (text-3xl)
  - Font weight: 700 (bold)
  - Color: text-slate-900

Subtitle:
  - Font size: 14px (text-sm)
  - Font weight: 400 (normal)
  - Color: text-slate-600

Label:
  - Font size: 14px (text-sm)
  - Font weight: 500 (medium)
  - Color: text-slate-900

Body Text:
  - Font size: 14px (text-sm)
  - Font weight: 400 (normal)
  - Color: text-slate-600

Error Text:
  - Font size: 14px (text-sm)
  - Font weight: 400 (normal)
  - Color: text-red-500
```

## Spacing

```
Container:
  - Max width: 448px
  - Padding: 32px (p-8)
  - Gap between sections: 16px (space-y-4)

Form Fields:
  - Height: 40px (h-10)
  - Padding: 12px horizontal, 8px vertical (px-3 py-2)
  - Border radius: 6px (rounded-md)
  - Margin bottom: 16px

Buttons:
  - Height: 44px (h-11)
  - Padding: 32px horizontal (px-8)
  - Border radius: 6px (rounded-md)
  - Gap: 8px between icon and text

Checkboxes:
  - Size: 16px (h-4 w-4)
  - Border width: 1px
  - Border radius: 4px
```

## Responsive Design

### Mobile (< 640px)
- Width: 100% with 16px padding
- Font sizes: Same as desktop (design is already compact)
- Button heights: Same 44px
- Touch targets: Adequate for mobile (minimum 48px recommended)

### Tablet (640px - 1024px)
- Width: 480px centered
- All other properties: Same as mobile

### Desktop (> 1024px)
- Width: 448px centered
- All other properties: Same

## Interactive States

### Button States
```
Default:
  - Black background
  - White text
  - Cursor: pointer
  
Hover:
  - Darker background
  - Same text
  - Transition: smooth

Active/Pressed:
  - Even darker background
  
Disabled:
  - 50% opacity
  - Cursor: not-allowed
  - Events: none

Loading:
  - Spinner animation
  - Text changes to "Signing in..."
  - Disabled state maintained
```

### Input States
```
Default:
  - White background
  - Light gray border
  - 14px font
  
Focus:
  - Ring: 2px solid black
  - Ring offset: 2px
  
Error:
  - Border: 1px solid red (implied by error text below)
  - Error message: Red text below input
  
Disabled:
  - 50% opacity
  - Cursor: not-allowed
```

### Form Validation

```
Valid Input:
  - Border: 1px solid #e5e7eb (neutral-200)
  - No message

Invalid Input (on submit):
  - Border: 1px solid #e5e7eb (same, no visual border change)
  - Error message: Red text below field
  - Message: "Email is required" or "Password is required"
  
Matching Password:
  - Confirm password field removes error

Mismatched Password:
  - Error: "Passwords do not match"
```

## Animation & Transitions

```
Smooth Transitions:
  - Duration: 150-200ms
  - Easing: ease-out
  - Applied to: colors, opacity, transforms

Loading Spinner:
  - Animation: rotate 360° infinite
  - Duration: 1s
  - Icon size: 16px (h-4 w-4)

Form Toggle:
  - Fade in/out the form
  - Duration: 200ms (not implemented, just instant swap currently)
```

## Dark Mode Support

All colors have dark mode variants:
```
Light: bg-white, text-slate-900
Dark: bg-neutral-950, text-neutral-50

Light: border-neutral-200
Dark: border-neutral-800

Light: focus-visible:ring-neutral-950
Dark: dark:focus-visible:ring-neutral-300
```

## Icon Specifications

### Spinner Icon
- Source: lucide-react `LoaderCircle`
- Size: 16px (h-4 w-4)
- Color: Inherits from button text
- Margin right: 8px
- Animation: `animate-spin` (60 rotations per minute)

## Accessibility Features

### Semantic HTML
```
<form> - Wraps form fields
<label htmlFor="..."> - Associated with input IDs
<input> - Native form inputs
<button type="submit"> - Form submission
```

### Focus Management
```
Tab order: email → password → remember → forgot password → signin button → signup link
Tab trapping: None (form-only focus)
Focus visible: Ring indicator on all interactive elements
```

### Error Announcements
```
Error text appears immediately below problematic field
High contrast: Red text on white background (WCAG AA compliant)
Field ID linked to error message via proper association
```

### Screen Reader Support
```
Form labels are programmatically associated
Button text clearly describes action
Error messages are descriptive
Links have descriptive text ("Sign up", "Forgot password?")
```

---

## Design System Summary

| Element | Light | Dark |
|---------|-------|------|
| Background | slate-50/100 | neutral-950 |
| Surface | white | neutral-950 |
| Text Primary | slate-900 | neutral-50 |
| Text Secondary | slate-600 | neutral-400 |
| Border | neutral-200 | neutral-800 |
| Primary Button | neutral-900 | neutral-50 |
| Primary Text | neutral-50 | neutral-900 |
| Error | red-500 | red-500 |
| Success | green-500 | green-500 |

All colors meet WCAG AA contrast requirements.
