# Market Research Application

This repo contains an implementation of a **fullstack web application** designed to author and display market research content. The core techonologies are **programming language - [TypeScript](https://www.typescriptlang.org/), web framework - [Next.js](https://nextjs.org/), UI library - [React](https://reactjs.org/), CSS framework - [TailwindCSS](https://tailwindcss.com/) and State management - [Apollo Client](https://www.apollographql.com/docs/react/)**. The application interfaces with a **backend built using a [GraphQL](https://graphql.org/) server, via Schema and Resolvers - [Nexus Schema](https://nxs.li/components/standalone/schema), a Database client - [Prisma Client](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client) and data stored in [PostgreSQL](https://www.postgresql.org/)/[Redis](https://redis.io/)**.

## Getting started

### 1. Clone repo and install dependencies

Clone this repository:

```
git clone git@github.com:djfrsn/djfrsn.git --depth=1
```

Install npm dependencies:

```
cd djfrsn
npm i
```

<br />

### 2. Generate database client/types and seed data

Run this command to setup the database:

```
npm run setup && npx prisma db seed
```

The above runs commands for the following:

<details><summary><strong>a.</strong> Generate the database client and type files</summary>

The following command to create your Prisma client and Nexus type files. The Prisma client creates an interface to the DB and Nexus provides the schema, this mostly happens in [`/pages/api`](./pages/api). The frontend depends on the Apollo server to allow us to access the generated client via GraphQL. To generate the files, we run the generate:prisma and generate:nexus with the following:

```
npm run generate
```

</details>

<br />

<details><summary><strong>b.</strong> Create and seed the database</summary>

Create the tables defined in [`prisma/schema.prisma`](./prisma/schema.prisma) with:

```
npm run migrate:prisma
```

The data from the seed file [`prisma/seed.ts`](./prisma/seed.ts) will be used to populate the database with mock data.

</details>

<br />

### 3. Run the app

```
npm run dev
```

Visit [`http://localhost:3000/`](http://localhost:3000/) in your browser to see the app running.

<br />

## Modify the application

The application defaults to displaying a UI with db seed data and example Prismic CMS data for this repo. You can add applications features via [Prisma Schema](https://github.com/prisma/prisma-examples/blob/latest/typescript/graphql-nextjs/README.md#evolving-the-app) or add new UI by replacing the `apiEndpoint` in [`sm.json`](./sm.json) with a new [Prismic Repository](https://prismic.io/docs/core-concepts/repository), then create new [template slices](https://prismic.io/docs/technologies/template-content-nextjs).

<br />

Modifying the application usually means one of the following will happen:

- Create a new repeatable page section with React and the Slice Machine
- Add new React components for feature update
- Author new pages without code via Prismic UI
- Update schema and server [`API`](./pages/api) to support feature update

<br />

### Create a new Slice

A reusable section of a page, in the form of a slice allows us to create building blocks to form pages.

**Run Slice Machine**

```
npm run slicemachine
```

- Create a new [slice](https://prismic.io/docs/technologies/model-content-nextjs#create-your-first-slice) or [content-type](https://prismic.io/docs/technologies/model-content-nextjs#create-your-first-custom-type) via the [Slice Machine](http://localhost:9999) on localhost.

**Reference the patterns established** in [UtilBarTitle.tsx](./slices/UtilBarTitle) for slices. The slice should contain code that makes for a unique component and import resuable code. Reference the [/create](<(./pages/create.tsx)>) page when creating new content-types.

<br />

### Create a new Page with Prismic

New pages can be created without code on Prismic using the "Page" content type and existing app sections with unique content. If a new [static zone](https://prismic.io/concepts/content-modeling/introduction-to-content-modeling#static-fields) is required the content type "Create" along with the [associated React UI](./pages/create.tsx) establishes this pattern.

- Create a new Prismic document with a content type of "Page", the field `uid` will be the path for the page and render using the [[uid].tsx](./pages/[uid].tsx) file. Title and description are used in the HTML `head`.

<br />

### Create a new React component

Components are any reusable UI code found in [`/pages`](./pages) or [`/slices`](./slices).

<br />

### Add server side api code

Adding a new row or column is done by changing or adding Models in [schema.prisma](./prisma/schema.prisma). Fetching this data requires an update to object type resolvers in [/pages/api](./pages/api/). Once this is done, the change in backend data can be used in the front end GraphQL queries and components.

- Follow the 4 step process for doing so is laid out in the **Evolving the app** section of the official [Prisma Next.js example](https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql-nextjs#evolving-the-app).

<br />

## Architecture

[CQRS pattern](https://martinfowler.com/bliki/CQRS.html)

- UI - React
- Query Model - GraphQl
- Command Model - Node.js + BullMQ
- Database - PostgreSQL + Redis

## Third Party References

### General

- [Official Prisma Next.js/GraphQL example](https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql-nextjs)
- [Prismic.io Next.js Documentation](https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql-nextjs)
- [Prismic Content Modeling](https://prismic.io/concepts/content-modeling)
- [Prismic Helpers](https://prismic.io/docs/technical-reference/prismicio-helpers)
- [Prismic Client](https://prismic.io/docs/technical-reference/prismicio-client)
- [JSDoc](https://jsdoc.app/)
- [BullMQ Flow Pattern](https://blog.taskforce.sh/splitting-heavy-jobs-using-bullmq-flows/)

### Frontend

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)w
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [Prismic Templating](https://prismic.io/docs/technologies/template-content-nextjs#intro-to-templating)
- [React Markdown](https://www.npmjs.com/package/react-markdown)
- [React Chart.js](https://www.npmjs.com/package/react-chartjs-2)
- [React Window](https://github.com/bvaughn/react-window#how-is-react-window-different-from-react-virtualized)

### Backend

- [GraphQL](https://graphql.org/graphql-js/)
- [Nexus Schema](https://nxs.li/components/standalone/schema)
- [Prisma Client](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client)
- [Prismic/Next](https://prismic.io/docs/technical-reference/prismicio-next)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [BullMQ](https://docs.bullmq.io/)
- [throng](https://www.npmjs.com/package/throng)
- [p-queue](https://www.npmjs.com/package/p-queue)
- [got](https://www.npmjs.com/package/got)

### Universal

- [moment](https://momentjs.com/)
- [moment-business-days](https://www.npmjs.com/package/moment-business-days)
- [lodash](https://www.npmjs.com/package/lodash)
