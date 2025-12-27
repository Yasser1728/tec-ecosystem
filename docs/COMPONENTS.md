# Component Documentation

This document provides a comprehensive guide to using the TEC Ecosystem components.

## Table of Contents

- [Header](#header)
- [Footer](#footer)
- [ServiceCard](#servicecard)
- [DomainList](#domainlist)
- [LanguageToggle](#languagetoggle)
- [ParticlesCanvas](#particlescanvas)

---

## Header

A simple header component displaying the TEC Ecosystem title.

### Usage

```jsx
import Header from '@/components/Header';

function Page() {
  return <Header />;
}
```

### Props

No props required.

### Example

```jsx
export default function MyPage() {
  return (
    <>
      <Header />
      <main>Page content here</main>
    </>
  );
}
```

---

## Footer

A footer component displaying copyright information with dynamic year.

### Usage

```jsx
import Footer from '@/components/Footer';

function Page() {
  return (
    <>
      <main>Content</main>
      <Footer />
    </>
  );
}
```

### Props

No props required.

### Features

- Automatically updates copyright year based on current date
- Centered text layout
- Responsive design

---

## ServiceCard

A reusable card component for displaying service information.

### Usage

```jsx
import ServiceCard from '@/components/ServiceCard';

function ServicesPage() {
  return (
    <ServiceCard 
      title="Web Development" 
      description="Build modern web applications"
    />
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| title | string | Yes | The title of the service |
| description | string | Yes | The description of the service |

### Example

```jsx
export default function Services() {
  const services = [
    { title: "Design", description: "UI/UX design services" },
    { title: "Development", description: "Full-stack development" },
    { title: "Marketing", description: "Digital marketing solutions" }
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {services.map((service, i) => (
        <ServiceCard 
          key={i}
          title={service.title} 
          description={service.description}
        />
      ))}
    </div>
  );
}
```

---

## DomainList

Displays a collapsible list of TEC ecosystem domains organized by tiers.

### Usage

```jsx
import DomainList from '@/components/DomainList';

function DomainsPage() {
  const domains = [
    {
      tier: "Tier 1",
      tierAr: "المستوى 1",
      items: [
        { 
          name: "TEC", 
          url: "tec", 
          desc: "Main platform", 
          descAr: "المنصة الرئيسية" 
        }
      ]
    }
  ];
  
  return <DomainList domains={domains} language="en" />;
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| domains | Array<Object> | Yes | Array of domain objects |
| language | string | Yes | Current language ('en' or 'ar') |

### Domain Object Structure

```typescript
{
  tier: string;        // English tier name
  tierAr: string;      // Arabic tier name
  items: Array<{
    name: string;      // Domain name
    url: string;       // Domain URL path
    desc: string;      // English description
    descAr: string;    // Arabic description
  }>;
}
```

### Features

- Collapsible categories
- Bilingual support
- Smooth transitions
- Interactive hover effects

---

## LanguageToggle

A bilingual toggle button component for switching between English and Arabic.

### Usage

```jsx
import { useState } from 'react';
import LanguageToggle from '@/components/LanguageToggle';

function Page() {
  const [language, setLanguage] = useState('en');
  
  return (
    <>
      <LanguageToggle language={language} setLanguage={setLanguage} />
      <main>{language === 'en' ? 'Content' : 'المحتوى'}</main>
    </>
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| language | string | Yes | Current language ('en' or 'ar') |
| setLanguage | Function | Yes | Function to update language state |

### Features

- Fixed position in top-right corner
- Visual indication of active language
- Smooth transitions
- High z-index for overlay

---

## ParticlesCanvas

An animated canvas background featuring floating particles with gradient colors.

### Usage

```jsx
import ParticlesCanvas from '@/components/ParticlesCanvas';

function Page() {
  return (
    <>
      <ParticlesCanvas />
      <main className="relative z-10">
        Content appears above particles
      </main>
    </>
  );
}
```

### Props

No props required.

### Features

- Responsive particle count (30 on mobile, 60 on desktop)
- High DPI screen support
- Gradient particle colors (TEC green to blue)
- Automatic cleanup on unmount
- Particles bounce off screen edges
- Smooth animation using requestAnimationFrame

### Technical Details

- Uses HTML5 Canvas API
- Handles window resize events
- Accounts for device pixel ratio
- Non-interactive (pointer-events: none)

---

## Styling Guidelines

All components use Tailwind CSS for styling. Common TEC Ecosystem design tokens:

### Colors

- **TEC Green**: `#00ff9d` / `bg-tec-green` / `text-tec-green`
- **TEC Blue**: `#00c6ff` / `bg-tec-blue` / `text-tec-blue`
- **TEC Dark**: `#0a0e2b` / `bg-tec-dark` / `text-tec-dark`

### Font

- Primary: Cairo (for Arabic support)
- Fallback: Inter, sans-serif

---

## Testing Components

All components have unit tests. To run tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Writing Component Tests

Example test structure:

```jsx
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

---

## Contributing

When adding new components:

1. Add JSDoc comments with description, params, and examples
2. Create unit tests in `tests/unit/components.test.js`
3. Update this documentation file
4. Follow existing naming conventions
5. Use Tailwind CSS for styling
6. Support bilingual content where applicable

---

## Support

For issues or questions about components:

- Check the [Architecture Documentation](./ARCHITECTURE.md)
- Review component source code and JSDoc comments
- Open an issue on GitHub
- Contact the maintainer

---

© 2024-2025 TEC Ecosystem - All Rights Reserved
