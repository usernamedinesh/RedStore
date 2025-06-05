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
- npx prisma format

* npx prisma migrate dev --name add-otp-field =>(just add random name )

if there is prodcut exist then u cant add any field in that db or schema of product

# hard reset

npx prisma migrate reset --force
