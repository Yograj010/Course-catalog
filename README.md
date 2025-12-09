# Course-catalog
The Nest Course Management System (NCMS) is a backend application built using NestJS, MongoDB (Mongoose), and TypeScript, designed to manage an organized structure of Categories, SubCategories, and Courses.

# API (Category / SubCategory / Course)

Simple project for learning NestJS + MongoDB (Mongoose).

## Features

- Category, SubCategory, Course modules
- Full CRUD
- Soft delete with `isDeleted: boolean`
- Pagination, sorting, filtering, search
- Relations:
  - SubCategory -> one Category (must be valid)
  - Course -> many Categories and many SubCategories
  - All SubCategories selected for a Course **must belong to** the selected Categories
- Aggregation:
  - Category list with SubCategory count
- Transactions:
  - Course create uses MongoDB transaction to validate and save

## Tech

- NestJS 11
- Mongoose 8
- TypeScript 5
- class-validator + class-transformer

## How to run

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and adjust if needed:

```bash
cp .env.example .env
```

Make sure MongoDB is running locally, or change `MONGODB_URI`.

3. Start the app:

```bash
npm run start:dev
```

By default it runs on `http://localhost:3000`.

---

## Endpoints Overview

### Categories

- `POST /categories` - create
- `GET /categories` - list (pagination, search)
- `GET /categories/with-subcategory-count` - aggregation
- `GET /categories/:id` - detail
- `PATCH /categories/:id` - update
- `DELETE /categories/:id` - soft delete

### SubCategories

- `POST /subcategories`
  - Requires `categoryId` (must be a valid Category)
- `GET /subcategories`
  - Query:
    - `page`, `limit`
    - `sortBy`, `sortOrder`
    - `search`
    - `categoryId` (filter)
- `GET /subcategories/:id`
- `PATCH /subcategories/:id`
- `DELETE /subcategories/:id`

### Courses

- `POST /courses`
  - Body:
    - `title`
    - `description` (optional)
    - `categoryIds: string[]`
    - `subCategoryIds: string[]`
  - Validations:
    - All `categoryIds` must exist and not be soft-deleted
    - All `subCategoryIds` must exist and not be soft-deleted
    - **Each SubCategory must belong to one of the given Categories**
- `GET /courses` (supports page, limit, sort, search, `categoryId`, `subCategoryId`)
- `GET /courses/:id`
- `PATCH /courses/:id`
- `DELETE /courses/:id`

---

## Relation explanation (Hinglish)

- **Category**: Top level (e.g. Programming, Design).
- **SubCategory**: Hamesha ek Category se link hoti hai  
  (e.g. JavaScript -> Programming).
- **Course**:
  - Multiple Categories se link ho sakta hai
  - Multiple SubCategories se link ho sakta hai
  - Jo SubCategories select karo, wo unhi Categories me honi chahiye
    jo Course me di hui hain.

Is project ka code simple rakha gaya hai taaki tum NestJS project structure
easily samjha sako (modules, services, controllers, DTOs, schemas, etc.).

