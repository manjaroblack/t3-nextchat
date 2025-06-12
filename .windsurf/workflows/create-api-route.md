---
description: "Scaffold a new tRPC API route."
---

# Create API Route Workflow

This workflow automates the creation of a new, standardized tRPC API route.

1. **Prompt for Route Name**
   - The agent will ask the user for a route name in `camelCase` (e.g., `userManagement`).

2. **Create Router File**
   - // turbo
   - The agent will create a new file at `src/server/routers/<routeName>.ts`.

3. **Add Boilerplate Code**
   - The agent will write the following boilerplate code to the new file, replacing `<routeName>` and `<RouteName>` with the user-provided name (in camelCase and PascalCase respectively):

     ```tsx
     import { createTRPCRouter, publicProcedure } from "../trpc";
     import { z } from "zod";

     export const <routeName>Router = createTRPCRouter({
       // Example procedure
       hello: publicProcedure
         .input(z.object({ text: z.string() }))
         .query(({ input }) => {
           return {
             greeting: `Hello ${input.text}`,
           };
         }),
     });
     ```

4. **Update Root Router**
   - The agent will open `src/server/routers/root.ts` and add the new router to the `appRouter`.

5. **Confirm Success**
   - The agent will confirm that the API route was created and integrated successfully.
