---
description: "Deploy the application to Netlify."
---

# Deploy to Netlify Workflow

This workflow automates the deployment of the application to Netlify.

1. **Prompt for Deployment Type**
   - The agent will ask the user whether they want to create a **production** or **preview** deployment.

2. **Run Netlify Deploy Command**
   - // turbo
   - Based on the user's choice, the agent will run one of the following commands:
     - For **production**:

       ```bash
       pnpm netlify deploy --prod --build
       ```

     - For **preview**:

       ```bash
       pnpm netlify deploy --build
       ```

3. **Confirm Deployment**
   - The agent will monitor the output of the command and provide the user with the deployment URL upon successful completion.
