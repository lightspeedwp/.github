# State Diagram Example

```mermaid
stateDiagram-v2
  accTitle: stateDiagram diagram
  accDescr: stateDiagram flowchart
    [*] --> Idle
    Idle --> Processing: start
    Processing --> Idle: done
    Processing --> Error: error
    Error --> Idle: reset
    Idle --> [*]
```
