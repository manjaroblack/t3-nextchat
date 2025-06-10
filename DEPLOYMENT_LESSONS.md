# Deployment Lessons Learned: T3-NextChat on Netlify

This document summarizes the key challenges and solutions encountered while deploying the T3-NextChat application to Netlify. Use this as a reference for future Next.js and Prisma projects on serverless platforms.

---

### 1. Next.js App Router: API Route Exports

*   **Problem:** The build failed with an error related to invalid exports from the NextAuth.js API route (`src/app/api/auth/[...nextauth]/route.ts`).
*   **Root Cause:** In the Next.js App Router, API routes cannot have default exports. We were incorrectly exporting the `authOptions` object directly.
*   **Solution:** API routes must export named functions corresponding to HTTP methods (`GET`, `POST`, etc.).

    ```typescript
    // Incorrect
    // export default NextAuth(authOptions);

    // Correct
    const handler = NextAuth(authOptions);
    export { handler as GET, handler as POST };
    ```

### 2. Tailwind CSS v4: Theme Configuration

*   **Problem:** The build failed with a type error: `Module '"tailwindcss/defaultTheme"' has no exported member 'fontFamily'`.
*   **Root Cause:** The project's `tailwind.config.ts` was using a syntax from Tailwind CSS v3, which is incompatible with v4.
*   **Solution:** In Tailwind CSS v4, the default theme is extended automatically. The direct import from `tailwindcss/defaultTheme` must be removed, and the configuration simplified.

    ```typescript
    // tailwind.config.ts

    // Remove this line
    // import { fontFamily } from "tailwindcss/defaultTheme";

    // Simplify the theme object
    fontFamily: {
      // Change from: sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      sans: ["var(--font-geist-sans)"],
    },
    ```

### 3. Prisma on Serverless (Netlify/Vercel)

This was the most complex issue, with the same error message (`Cannot find module '.prisma/client/default'`) having multiple underlying causes.

*   **Problem:** The deployed serverless function could not find the generated Prisma Client at runtime.

*   **Cause A: Missing Query Engine Binary**
    *   Serverless platforms (like Netlify) run on a Linux environment. By default, `prisma generate` only creates a query engine binary for your local OS (e.g., Windows or macOS).
    *   **Solution:** You must explicitly tell Prisma to also generate a binary compatible with the deployment environment. This is done using `binaryTargets` in `schema.prisma`.
    *   **Key Takeaway:** Always check your deployment provider's build image environment. Netlify's `noble` image (Ubuntu 24.04) requires the `debian-openssl-3.0.x` target.

        ```prisma
        // prisma/schema.prisma
        generator client {
          provider      = "prisma-client-js"
          binaryTargets = ["native", "debian-openssl-3.0.x"] // Add this line
        }
        ```

*   **Cause B (The Final Fix): Custom Output Path & Bundling**
    *   Even with the correct `binaryTargets`, the build failed because we were using a custom `output` path for the Prisma client (`src/generated/prisma`). Serverless bundlers often fail to locate and include files from non-standard locations.
    *   **Solution:** The most robust and recommended approach is to **revert to Prisma's default configuration**.
        1.  **Remove the custom `output` path** from `prisma/schema.prisma`.
        2.  **Update all imports** in your application code to import `PrismaClient` directly from the package: `import { PrismaClient } from '@prisma/client';`.
        3.  This ensures the generated client is placed in `node_modules/.prisma/client`, a location that is always correctly bundled by deployment platforms.

---

### Final Checklist for Future Deployments:

1.  [ ] **API Routes:** Are all App Router API routes using named `GET`/`POST` exports?
2.  [ ] **Dependencies:** Are all configurations (e.g., Tailwind) up-to-date with the installed package versions?
3.  [ ] **Prisma Schema:**
    *   [ ] Is the `binaryTargets` property set correctly for the deployment environment?
    *   [ ] Have you removed any custom `output` paths to use the default `node_modules` location?
4.  [ ] **Prisma Imports:** Is `PrismaClient` imported from `@prisma/client` everywhere in the code?
