# HELPDESK («Heldesk Service»)

Web Application of technical support department.

<img src="/static/img/social-preview.png">

## Demo application -> [Helpdesk service](https://helpdesk-service.herokuapp.com/)

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```bash
git clone 
```

## Installing NPM modules

```bash
# install dependencies
$ npm install
```

## Project env variables

| Key                | Comment          |
| ------------------ | ---------------- |
| `MONGO_URI`        | Mongo url        |
| `BCRYPT_SALT`      | BCRYPT SALT      |
| `JWT_SECRET_KEY`   | JWT_SECRET_KEY   |
| `TOKEN_EXPIRES_IN` | TOKEN_EXPIRES_IN |

## Run dev application

```bash
# serve with hot reload at localhost:3000
$ npm run dev
```

## Build application

```bash
# build for production
$ npm run build
```

## Running application

```bash
# run production and launch server
$ npm run start
```

## Default login to the application

```bash
  LOGIN: helpdesk
  PASSWORD: helpdesk
```

After starting the app on port (3000 as default) you can open
in your browser helpdesk by typing http://localhost:3000/.
