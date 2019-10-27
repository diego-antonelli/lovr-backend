# Lovr Backend #
- To configure, make sure you create a file `.env` in the root folder of your project.
Add the following variables:
```
MONGO_URI=mongodb://user:password@localhost/database
DATABASE=database
NODE_ENV=development
```

## Database
- You need to create the initial collections at your MongoDB database:
`profiles`, `sessions`

## API Documentation
- API documentation is built using Swagger UI, to check the available API docs, access
`http://localhost:3000/api-docs`