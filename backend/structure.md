inventory/
├── backend/
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   │   ├── database.ts      # DB connection config
│   │   │   └── env.ts           # Environment variables
│   │   ├── controllers/         # Route controllers
│   │   │   ├── auth.controller.ts
│   │   │   ├── inventory.controller.ts
│   │   │   ├── items.controller.ts
│   │   │   └── users.controller.ts
│   │   ├── interfaces/          # Type definitions
│   │   │   ├── auth.interface.ts
│   │   │   ├── inventory.interface.ts
│   │   │   └── response.interface.ts
│   │   ├── middleware/          # Middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── models/              # Database models
│   │   │   ├── inventory.model.ts
│   │   │   ├── item.model.ts
│   │   │   └── user.model.ts
│   │   ├── routes/              # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── index.ts
│   │   │   ├── inventory.routes.ts
│   │   │   └── items.routes.ts
│   │   ├── services/            # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── inventory.service.ts
│   │   │   └── items.service.ts
│   │   ├── utils/               # Utility functions
│   │   │   ├── apiFeatures.ts   # API features (pagination, filtering)
│   │   │   ├── appError.ts      # Error handling
│   │   │   └── jwt.ts           # JWT utilities
│   │   ├── validations/         # Validation schemas
│   │   │   ├── auth.validations.ts
│   │   │   └── inventory.validations.ts
│   │   ├── app.ts               # Express app setup
│   │   └── server.ts            # Server entry point
│   ├── tests/                   # Test files
│   │   ├── integration/
│   │   └── unit/
│   ├── .env                     # Environment variables
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md