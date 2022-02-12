## BugTracker Desktop Application

This application is built using ElectronJS framework.It allows users to track all the bugs encountered , share them with others to get them resolved.Suitable for teams working on projects in Companies.

### Install

#### Clone this repo

```
git clone https://github.com/maulikchavda/BugTracker.git
cd project
```

### Env Variables
Create a .env file in then root and add the following

```
NODE_ENV = development
PORT = 5000
MONGO_URI = your mongodb uri
JWT_SECRET = abc123
ADMIN_EMAIL = your email
ADMIN_PASSWORD = your password
```

#### Install dependencies

```
npm install
```

or

```
yarn
```

### Usage

#### Run the app

```
npm run start
```

or

```
yarn start
```

#### Build the app (automatic)

```
npm run package
```

or

```
yarn package
```

#### Build the app (manual)

```
npm run build
```

or

```
yarn build
```

#### Test the app (after `npm run build` || `yarn run build`)

```
npm run prod
```

```
yarn prod
```

### Change app title

Change the app title in the **webpack.build.config.js** and the **webpack.dev.config.js** files
