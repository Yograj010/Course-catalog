# Course-catalog
The Course catalog is a backend application built using NestJS, MongoDB (Mongoose), and TypeScript, designed to manage an organized structure of Categories, SubCategories, and Courses.

# API (Category / SubCategory / Course)

- **Category**: Top level (e.g. Programming, Design).
- **SubCategory**: Always linked to single Category  
  (e.g. JavaScript -> Programming).
- **Course**:
  - Can be linked with Multiple Categories
  - Can be linked with Multiple SubCategories
  - Selected SubCategories must be from the Categories which are given in the Course

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
  - Body:
    - `name`
    - `description` (optional)
- `GET /categories` - list (pagination, search)
  - Query:
    - `page` (optional)
    - `limit` (optional)
    - `sortBy` (optional)
    - `sortOrder` (optional)
    - `search` (filter)
- `GET /categories/with-subcategory-count` - aggregation
- `GET /categories/:id` - detail
- `PATCH /categories/:id` - update
  - Body:
    - `name` (optional)
    - `description` (optional)
- `DELETE /categories/:id` - soft delete

### SubCategories

- `POST /subcategories`
  - Body:
    - `name`
    - `categoryId` (required - must be a valid Category)
    - `description` (optional)
- `GET /subcategories`
  - Query:
    - `page` (optional)
    - `limit` (optional)
    - `sortBy` (optional)
    - `sortOrder` (optional)
    - `search` (optional)
    - `categoryId` (optional - filter)
- `GET /subcategories/:id`
- `PATCH /subcategories/:id`
  - Body:
    - `name` (optional)
    - `categoryId` (optional)
    - `description` (optional)
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
  - Query:
    - `page` (optional)
    - `limit` (optional)
    - `sortBy` (optional)
    - `sortOrder` (optional)
    - `search` (optional)
    - `categoryId` (optional - filter)
    - `subCategoryId` (optional - filter)
- `GET /courses/:id`
- `PATCH /courses/:id`
- `DELETE /courses/:id`
