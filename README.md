# Documentation

Refer to the [documentation](https://pickbazar-react-doc.vercel.app/ "Pickbazar React Documentation") for more details.

# Introduction

Fastest E-commerce template built with React, NextJS, TypeScript, Apollo, React-Query, NestJs & Tailwind. Its very easy to use, you can build your schema very easily. GraphQL playground makes it’s own documentation, and for rest we use swagger, your frontend team will love using it.

# Tech We Have Used

We have used monorepo folder structure with Yarn Workspace. In our template we have three different part Admin Dashboard, Shop and API. Tech specification for specific part is given below

## Admin Dashboard (GraphQL)

- NextJs
- Apollo
- GraphQL Let
- Tailwind
- Typescript
- React Hook Form

## Admin Dashboard (REST)

- NextJs
- React-Query
- Axios
- Tailwind
- Typescript
- React Hook Form

## Shop (GraphQL)

- NextJs
- Apollo
- GraphQL Let
- Typescript
- Tailwind
- Stripe Integration
- React Hook Form

## Shop (REST)

- NextJs
- React-Query
- Axios
- Typescript
- Tailwind
- Stripe Integration
- React Hook Form

## API

- NestJs GraphQL
- NestJs REST
- Class Transformer
- Class Validator

<br>

## Pre-Requirements

- NodeJS (16+)
- Yarn

## Yarn Installation

```bash 
npm install -g yarn
```

# Getting Started & Installation

For getting started with the template you have to follow the below procedure. First navigate to the `root` directory. Then run below command for getting started with specific part.

```bash
# on root directory
yarn
```
<br>

## Start API (NestJs REST)

1. Stay on root and run below command.

```bash
# on root directory
yarn dev:api-rest
```

**NOTE** : This will start the server at `http://localhost:8000/api/` for rest api and you can access it from browser at `http://localhost:8000/docs`(for rest swagger doc).

## Start Admin(REST)

1. Stay on root and run below command.

```bash
# on root directory
yarn dev:admin-rest

```

## Shop

For starting the shop part with corresponding api run below commands.

1. Stay on root and run below command.

```bash
# on root directory
yarn dev:shop-rest
```

**NOTE** : API must be running for the above commands to work.

**NOTE** : `.env` file must be filled with your values.
