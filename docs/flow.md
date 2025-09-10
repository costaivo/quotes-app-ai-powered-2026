```mermaid
graph TD
    A[Business Need/Opportunity] --> B(PRD: Product Requirements Document)
    B -- "Defines what to build (from user/business view)" --> C{Detailed Requirements & Design}

    C -- "Detailed Functional Breakdown" --> D[FRD: Functional Requirements Document]
    C -- "High-Level Tech Structure" --> E[ARD: Architectural Requirements Document]

    D -- "Informs technical solution" --> F(RFD: Request For Design / Tech Design Doc)
    E -- "Provides architectural foundation" --> F

    F -- "Breaks design into actionable steps" --> G[Detailed Task List]

    G -- "Implementation" --> H(Implemented Feature/Product)
    H -- "Monitor & Iterate" --> A

    subgraph Product & Business Focus
        B
        D
    end

    subgraph Engineering Focus
        E
        F
        G
    end