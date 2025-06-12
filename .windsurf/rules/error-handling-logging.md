---
description: Guidelines for robust error handling and effective logging in the Next.js application.
trigger: model_decision
tags: [error-handling, logging, nextjs, trpc, prisma, structured-logging]
---

# Error Handling and Logging Guidelines

These guidelines ensure consistent and effective error handling and logging practices across the application, aiding in debugging, monitoring, and maintaining application stability.

## 1. General Principles

- **Fail Gracefully:** Prevent application crashes. Display user-friendly error messages or fallbacks.
- **Be Specific:** Catch specific error types rather than generic `Error` objects where possible.
- **Contextual Logging:** Log events/errors with rich, structured context (correlation IDs, user IDs, operation names, relevant params/state) for actionable debugging. Managed by systems like OpenTelemetry.
- **Don't Expose Sensitive Information:** Ensure error messages and logs do not reveal stack traces or sensitive data to the end-user or in insecure logs.
- **Immutable Errors:** Treat error objects as immutable.
- **Structured Logging:** Use dedicated libraries (Pino, Winston) for structured JSON logs. Essential for efficient parsing, searching, and analysis by log management systems.

## 2. Next.js App Router Error Handling

- **`error.tsx`:**
  - Use `app/your-segment/error.tsx` for UI boundaries in nested routes.
  - Client Component (`'use client'`) receiving `error` (Error, optional `digest`) and `reset` (re-render) props.
  - Log errors in `useEffect`: `useEffect(() => { Sentry.captureException(error); }, [error]);`
  - For *unexpected* errors; use `notFound()` for 404s.
  - Doesn't catch same-segment `layout.tsx` errors; handle in parent `error.tsx`.
- **`global-error.tsx`:**
  - Use `app/global-error.tsx` as a root layout/template catch-all.
  - Client Component, defines own `<html>` and `<body>`.
  - For application-wide fallback UI.
- **`notFound()` function:**
  - Import from `next/navigation`.
  - Call in Server Components/Route Handlers to render `not-found.tsx` for current segment.
  - For 404s (e.g., DB record not found).
- **`template.tsx` errors:** Like layouts, errors in `template.tsx` are not caught by `error.tsx` in the same segment. Handle them in a parent segment's `error.tsx`.

## 3. tRPC Error Handling

- **Throw `TRPCError`:** For expected errors in tRPC procedures, throw `TRPCError` from `@trpc/server`.

    ```typescript
    import { TRPCError } from '@trpc/server';

    // Example
    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not authenticated.',
      });
    }
    ```

- **Error Codes:** Use appropriate tRPC error codes (e.g., `BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `INTERNAL_SERVER_ERROR`).
- **Error Formatting:** tRPC allows custom error formatting. Ensure sensitive details are not leaked to the client.
- **Client-Side Handling:** tRPC client libraries (like `@tanstack/react-query` integration) provide error objects that can be used to display feedback in the UI.
- **Input Validation Errors:** Errors arising from Zod input validation in tRPC procedures are typically automatically transformed into `BAD_REQUEST` `TRPCError`s. Ensure client-side logic handles these gracefully, often by displaying specific field errors.

    ```typescript
    // Example with React Query
    const { data, error, isLoading } = trpc.post.getById.useQuery({ id: postId });

    if (error) {
      return <p>Error: {error.message}</p>;
    }
    ```

- **Global Error Logging (`onError`):**
  Use the `onError` handler in tRPC router setup for centralized server-side error logging (before sending to client). Ideal for sending detailed errors to logging/monitoring services.

    ```typescript
    // Conceptual example of the onError function's usage
    // Configuration depends on your tRPC router setup (Pages Router vs. App Router)
    const trpcOptions = {
      // ... other tRPC router configurations (router, createContext)
      onError: ({ error, type, path, input, ctx, req }) => {
        // Log detailed error information server-side
        // Use your structured logger here (e.g., Pino, Winston)
        logger.error({
          source: 'trpc',
          path,
          type,
          code: error.code,
          message: error.message,
          // input, // CAUTION: Log input only if sanitized or known to be safe
          // userId: ctx?.session?.user?.id, // Example: Log user ID from context
          stack: error.stack, // Essential for debugging INTERNAL_SERVER_ERROR
          correlationId: ctx?.correlationId, // Assuming correlationId is in context
        }, 'tRPC Error Occurred');

        // Example: Send to an error reporting service like Sentry
        // if (error.code === 'INTERNAL_SERVER_ERROR') {
        //   Sentry.captureException(error, {
        //     extra: { path, type, input, userId: ctx?.session?.user?.id },
        //     tags: { trpcPath: path, trpcType: type }
        //   });
        // }
      },
    };
    ```

  The `onError` handler gets `error` (`TRPCError`), `type`, `path`, `input`, `ctx`, `req`. Log these, mindful of sensitive data in `input`/`ctx`.

## 4. Prisma Error Handling

- **Prisma Known Errors:** Catch `PrismaClientKnownRequestError` for predictable DB errors (unique constraints, record not found).

    ```typescript
    // import { Prisma } from '@prisma/client';
    // import { TRPCError } from '@trpc/server';
    try {
      // Prisma op
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') { /* Unique constraint */ throw new TRPCError({ code: 'CONFLICT', message: 'Record exists.', cause: e }); }
        if (e.code === 'P2025') { /* Record not found */ throw new TRPCError({ code: 'NOT_FOUND', message: 'Record not found.', cause: e }); }
      }
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unexpected DB error.', cause: e });
    }
    ```

- **Other Prisma Errors:** Consider `PrismaClientUnknownRequestError`, `PrismaClientRustPanicError`, etc.
- **Transactions:** Ensure rollbacks on error.
- **Docs:** See [Prisma error handling docs](https://www.prisma.io/docs/concepts/components/prisma-client/error-handling) for current error codes/types.

## 5. Client-Side Error Handling (General)

- **User Feedback:** Clear, non-technical error messages.
- **Graceful Degradation:** App remains usable or fails gracefully for non-critical errors.
- **Reporting:** Send client errors to monitoring (Sentry, LogRocket). Avoid excessive/sensitive data.
- **Common Techniques:**
  - **`try...catch`:** For sync operations in Client Components.
  - **Promise `.catch()`:** For async operations.
  - **Custom React Error Boundaries:** For granular component tree error handling (beyond `error.tsx`).
  - **Window Listeners:** `window.addEventListener('error'/'unhandledrejection', callback)` for global unhandled client errors.

## 6. Logging Practices

- **Structured Logging:** Use JSON with libraries like Pino/Winston. Include consistent fields: `timestamp`, `level`, `message`, `correlationId`, `serviceName`, `operationName`, `userId`, and domain-specific context.
- **Log Levels:** Utilize appropriate log levels to categorize the severity and importance of log messages:
  - `FATAL`: System unusable, critical failure.
  - `ERROR`: Serious error, app may run degraded.
  - `WARN`: Potential non-critical issue, monitor.
  - `INFO`: General app operation, milestones.
  - `DEBUG`: Detailed dev debugging; disable in prod.
  - `TRACE`: Granular execution tracing; rare in prod.
- **What to Log:**
  - **Requests (Server):** HTTP details (method, URL, status, duration, user agent, IP (privacy aware), correlation/trace ID, user ID, relevant headers).
  - **Errors (Server):** Full error details (message, stack, codes, original `cause`, context like sanitized data, user ID, params, correlation/trace ID).
  - **Business Logic:** Key app events, state changes, transactions (user registration, order creation).
  - **External Services:** API interactions (timing, success/failure).
  - **Performance:** Critical path/query execution times (conditional/sampled).
- **Log Output:** Direct to `stdout`/`stderr` in containers for agent collection.
- **Log Aggregation (Prod):** Centralize with services (Datadog, Sentry, BetterStack). Set up alerts.
- **Security & Compliance:**
  - **PII:** Avoid logging PII/sensitive data unless secured/masked per compliance (GDPR, HIPAA).
  - **Log Tampering:** Ensure integrity, protect from unauthorized access/modification.

## 7. Correlation IDs

- **Trace Requests:** Implement correlation/request/trace IDs. Generate at request entry (middleware, OpenTelemetry) and propagate through function calls, logs, and outbound APIs. Fundamental for tracing request lifecycle across services/components. Include in all related logs.

## 8. Distributed Tracing (e.g., with OpenTelemetry)

Distributed tracing offers an end-to-end view of requests across services (Next.js, APIs, tRPC, Prisma). Vital for diagnosing latency, understanding interactions, and debugging.

- **Core Concepts:**
  - **Trace:** Full request journey, unique Trace ID (Correlation ID).
  - **Span:** Unit of work in a Trace (API call, DB query). Has start/end time, parent-child links, metadata (attributes/tags), logs (events).
  - **Context Propagation:** How Trace/Span IDs (trace context) pass between services/processes, linking operations. Often via HTTP headers (e.g., `traceparent`).

- **OpenTelemetry (OTel):**
  - Open-source standard for observability (APIs, SDKs, tools for telemetry data: traces, metrics, logs).
  - **Instrumentation:** Instrument app code (Next.js, tRPC, Prisma) to generate trace data. OTel offers auto-instrumentation for common libraries.
  - **SDK Config:** Set up OTel SDK (e.g., in Next.js `instrumentation.node.ts` or `instrumentation.ts`).
  - **Exporter:** Send trace data to backends (Sentry, Datadog, Jaeger, etc.).

- **Benefits:**
  - **Performance Bottlenecks:** Visualize time spent in request lifecycle.
  - **Root Cause Analysis:** Understand event sequence leading to errors.
  - **Dependency Mapping:** See system interactions.
  - **Better Debugging:** Correlate logs with traces.

- **Example Setup Snippet (Conceptual for `instrumentation.node.ts` in Next.js):**

  ```typescript
  // In instrumentation.node.ts (Conceptual Example)
  import { NodeSDK } from '@opentelemetry/sdk-node';
  import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
  import { PrismaInstrumentation } from '@prisma/instrumentation';
  import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

  export function register() {
    const sdk = new NodeSDK({
      // serviceName: 'your-app',
      traceExporter: new OTLPTraceExporter({ /* url: 'your-otel-collector-endpoint' */ }),
      instrumentations: [
        new HttpInstrumentation(),
        new PrismaInstrumentation(),
        // Add other instrumentations
      ],
      // Configure resource detectors, propagators as needed
    });
    sdk.start();
    process.on('SIGTERM', () => { // Graceful shutdown
      sdk.shutdown().then(() => console.log('Tracing terminated')).catch(console.error);
    });
  }
  ```

  *Note: For Vercel, check official docs for OTel/partner integrations (Sentry, Baselime) for streamlined setup.*

## 9. Logging Tools and Services

- **Console:** Basic `console.log/warn/error` for dev.
- **Dedicated Libraries:** `pino` or `winston` for server-side advanced features (formatting, transports).
- **External Platforms (Prod):** Integrate with Sentry (error/perf), Better Stack (logs), Datadog, etc., for centralized logging, search, alerts.

## 10. Review and Audit Logs

- Regularly review logs for patterns, errors, security issues.
- Set up critical error alerts in logging platform.
