---
title: "Performance Issues Saved Replies"
description: "Performance optimization suggestions and benchmarking requests."
category: "Pull Request"
---

# Performance Issues Saved Replies

## Performance Review Needed

**Use case**: When a PR may affect performance.

```markdown
Hi @username,

Thank you for your contribution! We need to evaluate the performance impact of these changes before merging.

**Checklist:**

- [ ] Benchmark critical paths before/after the change
- [ ] Check for regressions in runtime, memory, or resource usage
- [ ] Consider optimizations (caching, batching, etc.)

**Suggestions:**

- Use sample data and real-world scenarios for benchmarks
- Document any identified bottlenecks or improvements

Let us know if you need help running or interpreting benchmarks!
```

## Performance Optimization Suggested

**Use case**: When optimizations are suggested.

```markdown
Hi @username,

Thanks for your PR! Here are some suggestions to optimize performance:

- Minimize repeated computation in loops or hot paths
- Use more efficient algorithms or data structures
- Reduce external calls or expensive operations

Feel free to ask about specific optimization opportunities in your code!
```
