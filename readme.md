# for database

- ecom npm install @prisma/client
- npm install --save-dev prisma

## initiliazation

- ecom npx prisma init

* before migration run sync :=> node prisma/mergeSchema.js

* migration-command: npx prisma migrate dev --name init
  - <->thats all i need to

# manulayy if i added or change nay filed in db i just run only one

- node prisma/mergeSchema.js

* npx prisma migrate dev --name add-otp-field =>(otp is the name of filed but i guess need to make optional)
