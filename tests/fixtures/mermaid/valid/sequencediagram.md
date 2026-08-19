# Sequence Diagram Example

```mermaid
sequenceDiagram
    actor User
    User->>System: Request
    System->>Database: Query
    Database-->>System: Response
    System-->>User: Result
```
