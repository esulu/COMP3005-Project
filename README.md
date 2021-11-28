# COMP3005-Bookstore

Look Inna Book online bookstore application for COMP 3005 at Carleton University in the Fall 2021 term.

## Authors
- Eren Sulutas #101101873
- Ben Li(bochen li) # 101113284
- Joshua Challenger #101119396

## Instructions for Running

- Clone the repository
- Download and install pgAdmin and postgresql 
- Create a database named bookstore
- Run the `DDL.sql`,  `populate.sql`, and `views.sql` files to create the tables/views and populate it with sample data
- Update the credentials in the top of `server/source/db.ts` to connect to your local database
- cd into the `server/source` directory and use `npm install` and `npm run dev` to start the db server
- create a new terminal
- cd to client and run `npm install` and `npm start` to start the app locally

## Tools

- [React](https://create-react-app.dev/)
- [PostgreSQL](https://www.postgresql.org/)
- [pgAdmin](https://www.pgadmin.org/) (optional)
- [NodeJS](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Material UI](https://mui.com/)