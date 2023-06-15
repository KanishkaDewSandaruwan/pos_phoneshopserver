require('dotenv').config();

const config = require('./config.js');
const mysql = require('mysql2/promise');

const tableInfo = [
  {
    tableName: 'user',
    fields: [
      { name: 'userid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'fullname', type: 'VARCHAR(255)' },
      { name: 'phonenumber', type: 'INT(10)' },
      { name: 'address', type: 'VARCHAR(255)' },
      { name: 'email', type: 'VARCHAR(255)' },
      { name: 'username', type: 'VARCHAR(255)' },
      { name: 'password', type: 'VARCHAR(255)' },
      { name: 'userrole', type: 'INT(5)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'supplier',
    fields: [
      { name: 'supplier_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'supplier_name', type: 'VARCHAR(255)' },
      { name: 'supplier_address', type: 'VARCHAR(255)' },
      { name: 'supplier_email', type: 'VARCHAR(255)' },
      { name: 'supplier_phone', type: 'INT(10)' },
      { name: 'supplier_adddate', type: 'DATETIME' },
      { name: 'supplier_status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
];

async function checkTables() {
  try {
    const pool = await mysql.createPool(config.connection);
    const connection = await pool.getConnection();

    const existingTables = await getExistingTables(connection);
    await createNewTables(connection, existingTables);
    // await removeUnusedTables(connection, existingTables);

    connection.release();
    pool.end();
  } catch (err) {
    console.error(err);
  }
}

async function getExistingTables(connection) {
  const [rows] = await connection.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${config.connection.database}'`);
  return rows.map(row => row.TABLE_NAME);
}

async function createNewTables(connection, existingTables) {
  for (const table of tableInfo) {
    if (!existingTables.includes(table.tableName)) {
      const fieldsString = table.fields.map((field) => `${field.name} ${field.type}`).join(', ');
      const createQuery = `CREATE TABLE ${table.tableName} (${fieldsString})`;
      await connection.query(createQuery);
      console.log(`Table '${table.tableName}' created!`);
    } else {
      await checkAndAlterFields(connection, table);
    }
  }
}

async function checkAndAlterFields(connection, table) {
  const [columns] = await connection.query(`SHOW COLUMNS FROM ${table.tableName}`);
  const existingFields = columns.map(column => column.Field);
  const fieldsToAdd = table.fields.filter(field => !existingFields.includes(field.name));
  const fieldsToRemove = existingFields.filter(field => !table.fields.some(f => f.name === field));

  if (fieldsToAdd.length > 0) {
    await addFieldsToTable(connection, table.tableName, fieldsToAdd);
  }

  if (fieldsToRemove.length > 0) {
    await removeFieldsFromTable(connection, table.tableName, fieldsToRemove);
  }
}

async function addFieldsToTable(connection, tableName, fieldsToAdd) {
  for (const field of fieldsToAdd) {
    const addQuery = `ALTER TABLE ${tableName} ADD COLUMN ${field.name} ${field.type}`;
    await connection.query(addQuery);
    console.log(`Field '${field.name}' added to table '${tableName}'`);
  }
}

async function removeFieldsFromTable(connection, tableName, fieldsToRemove) {
  for (const field of fieldsToRemove) {
    const removeQuery = `ALTER TABLE ${tableName} DROP COLUMN ${field}`;
    await connection.query(removeQuery);
    console.log(`Field '${field}' removed from table '${tableName}'`);
  }
}

async function removeUnusedTables(connection, existingTables) {
  for (const existingTable of existingTables) {
    const tableExists = tableInfo.some(table => table.tableName === existingTable);
    if (!tableExists) {
      const removeQuery = `DROP TABLE ${existingTable}`;
      await connection.query(removeQuery);
      console.log(`Table '${existingTable}' removed`);
    }
  }
}

module.exports = { checkTables, tableInfo };
