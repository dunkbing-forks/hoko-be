### Create folder

```
nest g controller <Controller name>
nest g module <Module name>
nest g service <Service name>
```

### install truffle and web3

```
https://trufflesuite.com/docs/
init truffle
- npm install -g truffle
- truffle init
- truffle console
    - migrate
    - build
```

### before push - run format all

```
npm run format
```

# Step to run back end 💡

**Step 1: Create database**

```
DATABASE_NAME=HOKOLITY
USERNAME=root
PASSWORD=HOKOLITY12345678
HOST=mysqldb
DB_POST=3306
```

**Step 2: coppy file .env.example to .env**

```
cp .env.example .env
```

**Step 3: run backend**

```
npm start:dev
yarn start:dev
```
