# Sequence Diagram Example

```mermaid
sequenceDiagram
  accTitle: sequenceDiagram diagram
  accDescr: sequenceDiagram flowchart
    actor User
    User->>System: Request
    System->>Database: Query
    Database-->>System: Response
    System-->>User: Result
```
