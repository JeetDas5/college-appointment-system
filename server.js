const app = require('./app.js')
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

dotenv.config();
const port = process.env.PORT || 3000;

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

