require('dotenv').config();

module.exports = {
  development: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: 'tpn',
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    logging: false
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    logging: false
  },
  production: {
    username: 'jddw9ybce2qo5e0l',
    password: 'tuuy757xs726njlp',
    database: 'etg1x0hn8pefs58z',
    host: 'b4e9xxkxnpu2v96i.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    port: 3306,
    dialect: 'mysql',
    logging: false
  }

  // production: { // fake production
  //   username: process.env.MYSQL_USER,
  //   password: process.env.MYSQL_PASS,
  //   database: 'tpn',
  //   host: '127.0.0.1',
  //   port: 3306,
  //   dialect: 'mysql',
  //   logging: false
  // }
};