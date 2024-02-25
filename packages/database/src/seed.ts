import { client } from './client'

client.developer
  .create({
    data: {
      name: 'dreitagebart',
      email: 'input@dreitagebart.io'
    }
  })
  .then(() => {
    console.log('DB seed successful')
  })
