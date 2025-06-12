---
description: Accessibility (a11y) best practices for creating inclusive Next.js applications.
trigger: model_decision
tags: [accessibility, a11y, nextjs, react, wcag, shadcn-ui]
---

# Accessibility (a11y) Guidelines

These guidelines ensure our Next.js application is usable by everyone, including people with disabilities, by following Web Content Accessibility Guidelines (WCAG) 2.2 principles.

## Core Principles (POUR)

Adhere to the four main principles of WCAG:

1. **Perceivable:** Information and user interface components must be presentable to users in ways they can perceive.

    * Provide text alternatives for non-text content.
    * Provide captions and other alternatives for multimedia.
    * Create content that can be presented in different ways (e.g., simpler layout) without losing information or structure.
    * Make it easier for users to see and hear content including separating foreground from background.

2. **Operable:** User interface components and navigation must be operable.

    * Make all functionality available from a keyboard.
    * Give users enough time to read and use content.
    * Do not design content in a way that is known to cause seizures or physical reactions.
    * Provide ways to help users navigate, find content, and determine where they are.
    * Make it easier for users to operate functionality through various input modalities beyond keyboard.
    * Ensure interactive targets meet minimum size requirements (WCAG 2.2 SC 2.5.8 Target Size (Minimum)) to aid users with motor impairments.
    * If dragging movements are essential for interaction, provide a simple pointer alternative (WCAG 2.2 SC 2.5.7 Dragging Movements).

3. **Understandable:** Information and the operation of user interface must be understandable.

    * Make text content readable and understandable.
    * Make web pages appear and operate in predictable ways.
    * Help users avoid and correct mistakes.
    * If help mechanisms (e.g., contact information, help links) are provided, ensure they are available consistently across pages (WCAG 2.2 SC 3.2.6 Consistent Help).
    * In multi-step processes, minimize redundant data entry by pre-filling known information or making it easily selectable, unless re-entry is essential (WCAG 2.2 SC 3.3.7 Redundant Entry).
    * Ensure authentication processes do not solely rely on cognitive function tests (e.g., memorizing complex passwords, solving puzzles) without providing an accessible alternative (WCAG 2.2 SC 3.3.8 Accessible Authentication (Minimum)).

4. **Robust:** Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies.

    * Maximize compatibility with current and future user agents, including assistive technologies.

## 1. Semantic HTML

* **Use Semantic Elements:** Use HTML elements according to their semantic meaning (e.g., `<nav>`, `<main>`, `<article>`, `<aside>`, `<button>`, `<h1>`-`<h6>`, `<ul>`, `<ol>`, `<li>`). Avoid using `<div>` or `<span>` for everything.
* **Proper Document Structure:** Ensure a logical document structure with clear headings and landmarks.
* **Valid HTML:** Write valid HTML to ensure consistent interpretation by browsers and assistive technologies.

## 2. ARIA (Accessible Rich Internet Applications)

* **Use When Necessary:** Use ARIA attributes to enhance accessibility for dynamic content and complex UI components when semantic HTML alone is insufficient.
* **Correct Roles and Attributes:** Ensure ARIA roles (e.g., `role="button"`, `role="navigation"`) and attributes (e.g., `aria-label`, `aria-describedby`, `aria-hidden`, `aria-expanded`) are used correctly. Remember the **first rule of ARIA**: If a native HTML element or attribute can provide the desired semantics and behavior, use it instead of ARIA. For complex custom components, consult the WAI-ARIA Authoring Practices Guide (APG) for established patterns.
* **`eslint-plugin-jsx-a11y`:** Next.js includes this ESLint plugin by default. Pay attention to its warnings for ARIA usage.
* **Shadcn/UI & Radix UI:** Components from shadcn/ui are built on Radix UI, which handles many ARIA attributes and accessibility primitives. Understand how these components manage ARIA internally.

## 3. Keyboard Navigation

* **Keyboard Accessibility:** All interactive elements (links, buttons, form fields, custom components) must be focusable and operable using only the keyboard.
* **Logical Focus Order:** Ensure the tab order is logical and follows the visual flow of the page.
* **Visible Focus Indicators (WCAG 2.2 SC 2.4.11):** Do not remove or obscure default browser focus indicators (e.g., outlines) unless providing a clear, highly visible custom alternative that meets minimum contrast and area requirements as defined in WCAG 2.2 Success Criterion 2.4.11 Focus Appearance. Shadcn/ui components generally handle this well.
* **Skip Links:** For pages with extensive navigation, provide a "skip to main content" link.

## 4. Focus Management

* **Manage Focus in Dynamic UIs:** For single-page applications and dynamic content changes (e.g., opening modals, navigating client-side), manage focus programmatically to ensure users understand context changes.
* **Route Announcements:** Next.js includes a route announcer by default for client-side transitions, which helps assistive technologies. Ensure page titles are descriptive.

## 5. Image Accessibility

* **`alt` Text:** All `<img>` elements must have an `alt` attribute.

  * **Descriptive `alt`:** If the image conveys information, the `alt` text should describe the image's content or function.
  * **Empty `alt` for Decorative Images:** If an image is purely decorative, use an empty `alt=""`.
* **`next/image`:** Use the `next/image` component, which requires an `alt` prop.

## 6. Color and Contrast

* **Sufficient Contrast:** Ensure text and interactive elements have sufficient color contrast against their background (WCAG AA: 4.5:1 for normal text, 3:1 for large text).
* **Use Contrast Checkers:** Utilize tools to check color contrast ratios.
* **Don't Rely on Color Alone:** Do not use color as the sole means of conveying information, indicating an action, prompting a response, or distinguishing a visual element.

## 7. Form Accessibility

* **Labels:** All form controls (`<input>`, `<textarea>`, `<select>`) must have associated `<label>` elements. Use `htmlFor` attribute on labels pointing to the `id` of the form control.
* **Fieldsets and Legends:** Group related form controls using `<fieldset>` and provide a description using `<legend>`.
* **Error Handling:** Clearly identify and describe errors. Associate error messages with their respective form fields using `aria-describedby` or `aria-errormessage`.
* **Validation Feedback:** Provide feedback for both client-side and server-side validation in an accessible manner.

## 8. Content Readability and Structure

* **Clear Language:** Use clear and concise language.
* **Headings:** Use headings (`<h1>` - `<h6>`) to structure content logically. Don't skip heading levels.
* **Lists:** Use `<ul>`, `<ol>`, and `<dl>` for lists.

## 9. Dynamic Content and Client-Side Rendering

* **Announce Changes:** For significant content updates that don't involve a full page reload, use ARIA live regions (`aria-live`, `aria-atomic`, `aria-relevant`) to inform assistive technology users.
* **Loading States:** Provide clear loading indicators for asynchronous operations.

## 10. Multimedia Accessibility

* **Captions and Transcripts:** Provide synchronized captions for pre-recorded video and audio. Provide transcripts for audio-only and video-only content.
* **Audio Descriptions:** For videos where visual information is not conveyed through audio, provide audio descriptions.

## 11. Testing and Tools

* **Manual Testing:** Regularly test with keyboard-only navigation and screen readers (e.g., NVDA, VoiceOver, JAWS).
* **Automated Tools:**

  * **`eslint-plugin-jsx-a11y`:** Integrated into Next.js projects by default.
  * **Browser Developer Tools:** Many browsers have built-in accessibility inspection tools.
  * **Axe DevTools:** Browser extension for automated accessibility testing.
* **User Testing:** If possible, involve users with disabilities in testing.

## 12. Leveraging Next.js and Shadcn/UI

* **Next.js Features:**

  * **Route Announcer:** Default for client-side navigation.
  * **ESLint Plugin:** `eslint-plugin-jsx-a11y` included.
  * **Semantic HTML in Examples:** Next.js documentation and examples often promote good semantic structure.
* **Shadcn/UI (Radix UI Primitives):**

  * Components are built on Radix UI, which provides unstyled, accessible primitives.
  * Handles many low-level accessibility concerns like keyboard navigation, focus management, and ARIA attributes for common patterns (dialogs, dropdowns, etc.).
  * While shadcn/ui provides a strong foundation, always verify that the specific implementation and customization meet accessibility requirements.

## 13. Continuous Improvement

* **Stay Updated:** Accessibility standards and best practices evolve. Keep learning and stay informed.
* **Integrate into Workflow:** Make accessibility a consideration throughout the entire development lifecycle, not an afterthought.
