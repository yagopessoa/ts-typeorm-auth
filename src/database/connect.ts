import { createConnection } from 'typeorm';

createConnection()
  .then(() => console.log('Successfully connected to Database'))
  .catch(error => console.log(error));
