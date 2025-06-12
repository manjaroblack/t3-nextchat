---
description: "Scaffold a new React component."
---

# Create Component Workflow

This workflow automates the creation of a new, standardized React component.

1. **Prompt for Component Name**
   - The agent will ask the user for a component name in `PascalCase` (e.g., `UserProfile`).

2. **Create Component File**
   - // turbo
   - The agent will create a new file at `src/components/<ComponentName>.tsx`.

3. **Add Boilerplate Code**
   - The agent will write the following boilerplate code to the new file, replacing `<ComponentName>` with the user-provided name:

     ```tsx
     import type React from 'react';

     type <ComponentName>Props = {
       // TODO: Define component props
     };

     const <ComponentName>: React.FC<<ComponentName>Props> = ({}) => {
       return (
         <div>
           {/* TODO: Implement component_markup */}
           <p><ComponentName></p>
         </div>
       );
     };

     export default <ComponentName>;
     ```

4. **Confirm Success**
   - The agent will confirm that the component file was created successfully.
