---
description: Security best practices for the Next.js, tRPC, Prisma, and @stackframe/stack application.
trigger: model_decision
tags: [security, nextjs, trpc, prisma, stackframe, owasp]
---

# Security Guidelines

These guidelines provide best practices for securing the Next.js application, including its tRPC API, Prisma data layer, and @stackframe/stack authentication.

## 1. Dependency Management

- **Keep Dependencies Updated:** Regularly update all dependencies (Next.js, tRPC, Prisma, @stackframe/stack, UI libraries, etc.) to their latest stable versions. Use tools like `pnpm audit` or integrated services (e.g., Dependabot, Snyk) to identify and patch vulnerabilities.
- **Lock Versions:** Use `pnpm-lock.yaml` to ensure consistent and vetted dependency versions across environments.
- **Minimize Dependencies:** Only include necessary packages to reduce the attack surface.

## 2. Input Validation and Sanitization

- **Validate All Inputs:** Treat all incoming data (from users, APIs, databases) as untrusted. Implement strict validation on both client-side and server-side.
- **Use Schema Validation:** Leverage `zod` for robust schema-based validation for all tRPC procedure inputs, API Route handler inputs, and form submissions. Define strict types, formats, lengths, and ranges.
- **Sanitize Outputs:** When rendering user-generated content, ensure it's properly sanitized to prevent XSS. React generally handles this for string variables, but be cautious with `dangerouslySetInnerHTML`.
- **Avoid `dangerouslySetInnerHTML`:** Use this only when absolutely necessary and with extreme caution, ensuring the HTML content is from a trusted source or thoroughly sanitized.
- **Prefer `innerText` over `innerHTML`** for setting text content to avoid parsing HTML.

## 3. Environment Variables & Secrets Management

- **Server-Side Only by Default:** Next.js correctly keeps environment variables server-side by default. Only expose variables to the client by prefixing them with `NEXT_PUBLIC_` and only when absolutely necessary.
- **Never Hardcode Secrets:** Store API keys, database credentials, JWT secrets, and other sensitive information in environment variables, not in the codebase.
- **Prioritize Secrets Managers for Production:** For production environments, **strongly prefer** using a dedicated secrets management service (e.g., Doppler, HashiCorp Vault, cloud provider's secret manager) over `.env` files for managing sensitive keys. Relying solely on `.env` files in production can pose significant security risks for critical applications.
- **Secure `.env` files:** Ensure `.env` files are included in `.gitignore` and are not committed to the repository.

## 4. Server-Side Code Protection

- **`server-only` Package:** Use the `server-only` package in files that contain sensitive server-side logic or environment variables to ensure they are not accidentally bundled and sent to the client.

## 5. HTTP Security Headers

Implement robust security headers to protect against common web vulnerabilities. This can be done via Next.js middleware or a reverse proxy like Nginx.

- **Content-Security-Policy (CSP):** Define a strict CSP to control which resources the browser can load. Start with `default-src 'self'` and incrementally allow trusted sources. For inline scripts and styles, consider using nonces or hashes to maintain security if `'unsafe-inline'` is too permissive. Consult Next.js documentation for implementing CSP with nonces in the App Router. Use tools like CSP Evaluator to test your policy.
- **HTTP Strict-Transport-Security (HSTS):** Enforce HTTPS connections: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.
- **X-Content-Type-Options:** Prevent MIME-sniffing: `X-Content-Type-Options: nosniff`.
- **X-Frame-Options:** Protect against clickjacking: `X-Frame-Options: SAMEORIGIN` or `DENY`.
- **Referrer-Policy:** Control referrer information: `Referrer-Policy: strict-origin-when-cross-origin` or `no-referrer`.
- **Permissions-Policy (Feature-Policy):** Restrict browser features available to the site.

## 6. Authentication and Authorization (@stackframe/stack)

- **Leverage @stackframe/stack:** Utilize `@stackframe/stack` for robust authentication, including its pre-built UI components and hooks.
- **Secure Session Management:** Ensure session cookies managed by `@stackframe/stack` are configured securely (see Secure Cookies section).
- **Authorization in tRPC:** Implement authorization checks within tRPC procedures using middleware or direct checks. Verify that the authenticated user has the necessary permissions to perform the requested action or access the requested data.
- **Principle of Least Privilege (PoLP):** Grant users and system components only the minimum necessary permissions.
- **Role-Based Access Control (RBAC):** If applicable, implement RBAC to manage user permissions effectively.
- **Stay Updated:** Regularly review security advisories and documentation from Next.js and `@stackframe/stack` for the latest best practices and potential vulnerabilities.

## 7. Cross-Site Request Forgery (CSRF) Protection

- **State-Changing Operations:** For any non-idempotent operations (e.g., POST, PUT, DELETE requests via forms or tRPC mutations that change state), implement CSRF protection.
- **CSRF Tokens:** Use techniques like the double-submit cookie pattern or synchronize token pattern. Generate a unique, unpredictable token per session or request and validate it on the server.
- **`SameSite` Cookies:** Use `SameSite=Lax` or `SameSite=Strict` for session cookies as a first line of defense (see Secure Cookies).

## 8. Secure Cookies

- **`HttpOnly` Attribute:** Set on session cookies to prevent client-side JavaScript access, mitigating XSS impact.
- **`Secure` Attribute:** Ensure cookies are only sent over HTTPS.
- **`SameSite` Attribute:** Set to `Lax` (default in modern browsers) or `Strict` to protect against CSRF attacks.
- **`Path` and `Domain` Attributes:** Scope cookies appropriately.
- **Expiration:** Set reasonable expiration times for cookies.

## 9. API Security (tRPC)

- **Input Validation:** Enforce strict input validation for all tRPC procedures using `zod` (as mentioned above).
- **Authentication & Authorization:** Protect tRPC procedures with authentication middleware. Ensure that sensitive procedures perform authorization checks.
- **Error Handling:** Return generic error messages for failures to avoid leaking sensitive information. Log detailed errors on the server.
- **Rate Limiting:** Implement rate limiting on tRPC endpoints to prevent abuse and DoS attacks.

## 10. Prisma and Database Security (Neon PostgreSQL)

- **Secure Connection:** Use environment variables for the Neon PostgreSQL connection string. Ensure SSL is enforced (`sslmode=require`).
- **Principle of Least Privilege for DB User:** The database user configured in Prisma should have the minimum necessary permissions on the database. Avoid using superuser roles for the application.
- **Parameterized Queries:** Prisma abstracts SQL and helps prevent SQL injection by using parameterized queries. Avoid raw SQL queries (`$queryRaw`, `$executeRaw`) unless absolutely necessary and ensure inputs are properly sanitized/validated if used.
- **Data Validation:** Validate data before writing to the database using `zod` schemas, even if Prisma provides some type safety.
- **Sensitive Data Handling:** Encrypt sensitive data at rest if necessary. Be mindful of what data is logged.

## 11. Secure File Uploads (if applicable)

- **Validate File Types & Size:** Allow only specific, whitelisted file types and enforce size limits.
- **Scan for Malware:** If possible, scan uploaded files for malware before storing or processing.
- **Store Securely:** Store uploaded files in a non-web-accessible location or a dedicated object storage service (e.g., S3). Do not allow direct execution of uploaded files.
- **Content-Disposition:** Use `Content-Disposition: attachment` header when serving user-uploaded files to prevent them from being executed in the browser context.
- **Prevent Directory Traversal:** Ensure filenames are sanitized.

## 12. Logging and Monitoring

- **Comprehensive Logging:** Log security-relevant events (e.g., login attempts, access control failures, significant errors).
- **Avoid Logging Sensitive Data:** Ensure logs do not contain passwords, API keys, session tokens, or PII.
- **Secure Log Storage:** Protect log files from unauthorized access or tampering.
- **Monitoring & Alerting:** Set up monitoring for suspicious activities and alerts for critical security events.

## 13. Regular Security Audits and Code Reviews

- **Code Reviews:** Incorporate security considerations into code reviews.
- **Automated Scans:** Regularly use security scanning tools for static (SAST) and dynamic (DAST) analysis, and dependency checking.
- **Penetration Testing:** For critical applications, consider periodic penetration testing by third-party experts.

## 14. Error Handling

- **Generic Error Messages:** Do not expose detailed error messages or stack traces to the client, as they can reveal internal system information. Provide generic error messages and log specifics on the server.

## 15. OWASP Top 10 Awareness

Familiarize yourself with the OWASP Top 10 Web Application Security Risks and actively work to mitigate them. Key areas relevant to this stack include:

- **A01: Broken Access Control:** Enforce strong authorization.
- **A02: Cryptographic Failures:** Use HTTPS, strong hashing, secure key management.
- **A03: Injection:** Validate/sanitize all input (Zod for tRPC).
- **A04: Insecure Design:** Build security in from the start; threat model.
- **A05: Security Misconfiguration:** Harden all layers, remove defaults, patch.
- **A06: Vulnerable and Outdated Components:** Keep dependencies updated.
- **A07: Identification and Authentication Failures:** Use `@stackframe/stack` correctly, MFA if possible.
- **A08: Software and Data Integrity Failures:** Protect against unauthorized modification.
- **A09: Security Logging and Monitoring Failures:** Implement robust logging.
- **A10: Server-Side Request Forgery (SSRF):** Validate any URLs fetched by the server.

## 16. Stay Informed

- **Security Bulletins:** Keep an eye on security bulletins for Next.js, Node.js, tRPC, Prisma, and other critical dependencies.
- **Best Practices:** Security is an ongoing process. Continuously learn and adapt to new threats and best practices.
