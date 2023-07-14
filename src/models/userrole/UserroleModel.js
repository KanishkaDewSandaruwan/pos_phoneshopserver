const { connection } = require('../../../config/connection');

const UserRoleModel = {
  getUserRoleById(userRoleId, callback) {
    connection.query('SELECT * FROM userrole WHERE userroleid = ? AND is_delete = 0', [userRoleId], callback);
  },

  getAllUserRoles(callback) {
    connection.query('SELECT * FROM userrole WHERE is_delete = 0', callback);
  },

  addUserRole(userRole, callback) {
    const { role } = userRole;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    const activeValues = 0;

    const query = 'INSERT INTO userrole (role, trndate, status, is_delete) VALUES (?, ?, ?, ?)';
    const values = [role, trndate, activeValues, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const userRoleId = results.insertId;
      callback(null, userRoleId);
    });
  },

  updateUserRole(userRole, userRoleId, callback) {
    const { role, status } = userRole;
    const query = 'UPDATE userrole SET role = ?, status = ? WHERE userroleid = ?';
    const values = [role, status, userRoleId];

    connection.query(query, values, callback);
  },

  updateUserRoleStatus(userRoleId, status, callback) {
    const query = 'UPDATE userrole SET status = ? WHERE userroleid = ?';
    const values = [status, userRoleId];

    connection.query(query, values, callback);
  },

  deleteUserRole(userRoleId, value, callback) {
    const query = 'UPDATE userrole SET is_delete = ? WHERE userroleid = ?';
    const values = [value, userRoleId];

    connection.query(query, values, callback);
  },

  permanentDeleteUserRole(userRoleId, callback) {
    const query = 'DELETE FROM userrole WHERE userroleid = ?';
    const values = [userRoleId];

    connection.query(query, values, callback);
  },

  userRoleById(userRoleId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM userrole WHERE userroleid = ?', [userRoleId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
};

module.exports = UserRoleModel;
