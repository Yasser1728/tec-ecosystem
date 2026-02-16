# Next.js Routing Conflicts Prevention

## Problem Description

Next.js supports two routing systems:
1. **Pages Router** (legacy, stable) - Routes defined in `pages/` directory
2. **App Router** (new, modern) - Routes defined in `app/` directory

However, Next.js **does not allow the same route to exist in both directories**. This causes a build error:

```
⨯ Conflicting app and page file was found, please remove the conflicting files to continue:
⨯   "pages/index.tsx" - "app/page.tsx"
```

## Example of Conflict

If you have both:
- `pages/index.tsx` (serves route `/`)
- `app/page.tsx` (also serves route `/`)

Next.js will fail to build because both files are trying to handle the same route.

## Our Current Architecture

The **tec-ecosystem** repository uses a **hybrid routing approach**:

- **Pages Router**: Used for 175+ routes (all main application pages)
- **App Router**: Used for 1 specific route (`/validation-key.txt`)

This works because there's **no route overlap**.

## Prevention Mechanism

We've implemented an automated check to prevent routing conflicts:

### 1. Pre-Build Check

The build process now automatically checks for conflicts before building:

```json
{
  "scripts": {
    "prebuild": "node scripts/check-routing-conflicts.js"
  }
}
```

This script runs **before every build** and will:
- ✅ Pass if no conflicts exist
- ❌ Fail the build if conflicts are detected

### 2. Manual Check

You can manually check for conflicts at any time:

```bash
npm run check:routes
```

### 3. Script Location

The conflict checker is located at:
```
scripts/check-routing-conflicts.js
```

## How It Works

The script:
1. Scans all files in `pages/` directory
2. Scans all files in `app/` directory
3. Converts file paths to route paths
4. Compares the routes to find duplicates
5. Reports any conflicts found

## Route Mapping Examples

| File Path | Route Path |
|-----------|------------|
| `pages/index.js` | `/` |
| `pages/about.js` | `/about` |
| `pages/blog/post.js` | `/blog/post` |
| `app/page.tsx` | `/` |
| `app/about/page.tsx` | `/about` |
| `app/api/users/route.ts` | `/api/users` (API route) |

## Resolving Conflicts

If the checker finds conflicts, you have two options:

### Option 1: Remove from Pages Router
Delete or move the file from the `pages/` directory.

### Option 2: Remove from App Router
Delete or move the file from the `app/` directory.

**Important**: Choose based on which routing system you want to use for that specific route.

## Best Practices

1. **Decide on a Primary Router**: For new features, decide whether to use Pages or App Router
2. **Keep API Routes Separate**: API routes in `pages/api/` don't conflict with App Router
3. **Document Hybrid Usage**: If using both routers, document which routes use which system
4. **Run Checks Locally**: Before committing, run `npm run check:routes`
5. **CI/CD Integration**: The pre-build hook ensures conflicts are caught in CI/CD

## Current Status

✅ **No routing conflicts detected** in the tec-ecosystem repository.

Our hybrid approach:
- Pages Router: 175 routes (main application)
- App Router: 1 route (validation endpoint)
- Conflicts: 0

## Related Issues

- Reference issue from Tec-App repository (different repo): Vercel build failure due to `pages/index.tsx` and `app/page.tsx` conflict
- Resolution: Implemented automated conflict detection in this repository to prevent similar issues

## Migration Path (Future)

If we decide to migrate from Pages Router to App Router:

1. Create new App Router pages incrementally
2. Run conflict checker after each new page
3. Test the new page thoroughly
4. Delete the corresponding Pages Router file
5. Verify no conflicts remain
6. Deploy

## References

- [Next.js Pages Router Documentation](https://nextjs.org/docs/pages)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Incremental Adoption Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
