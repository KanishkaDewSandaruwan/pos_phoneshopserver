const customerModel = require('../../models/customer/CustomerModel');


const getAllCustomers = (req, res) => {
    customerModel.getAllCustomers((error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      res.status(200).send(results);
    });
  };

  const getCustomerById = (req, res) => {
    const { customer_id } = req.params;

    customerModel.getCustomerById(customer_id,(error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      res.status(200).send(results);
    });
  };


const addCustomer = (req, res) => {
    const customer = req.body;

      customerModel.addCustomer(customer, (error, customer_id) => {
        if (error) {
          res.status(500).send({ error: 'Error fetching data from the database' });
          return;
        }
  
        if (!customer_id) {
          res.status(404).send({ error: 'Failed to create customer' });
          return;
        }
  
        res.status(200).send({ message: 'customer created successfully', customer_id });
      });
  };

  const updateCustomer = (req, res) => {
    const { customer_id } = req.params;
    const customer = req.body;
  
    customerModel.getCustomerById(customer_id, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).send({ error: 'customer not found' });
        return;
      }

        customerModel.updateCustomer(customer, customer_id, (error, results) => {
          if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
          }
  
          if (results.affectedRows === 0) {
            res.status(404).send({ error: 'customer not found or no changes made' });
            return;
          }
  
          res.status(200).send({ message: 'customer updated successfully' });
        });
    });
  };

  const deleteCustomers = (req, res) => {
    const { customerIds } = req.body;
  
    if (!Array.isArray(customerIds) || customerIds.length === 0) {
      res.status(400).send({ error: 'Invalid customer IDs' });
      return;
    }
  
    let successCount = 0;
    let failCount = 0;
  
    for (const customer_id of customerIds) {
      customerModel.getCustomerById(customer_id, (error, results) => {
        if (error) {
          console.error(`Error fetching customer with ID ${customer_id}: ${error}`);
          failCount++;
        } else if (results.length === 0) {
          console.log(`customer with ID ${customer_id} not found`);
          failCount++;
        } else {
          customerModel.deleteCustomer(customer_id, 1, (deleteError, deleteResult) => {
            if (deleteError) {
              console.error(`Error deleting customer with ID ${customer_id}: ${deleteError}`);
              failCount++;
            } else {
              successCount++;
              console.log(`customer with ID ${customer_id} deleted successfully`);
            }
  
            // Check if all deletions have been processed
            if (successCount + failCount === customerIds.length) {
              const totalCount = customerIds.length;
              res.status(200).send({
                totalCount,
                successCount,
                failCount,
              });
            }
          });
        }
  
        // Check if all brands have been processed
        if (successCount + failCount === customerIds.length) {
          const totalCount = customerIds.length;
          res.status(200).send({
            totalCount,
            successCount,
            failCount,
          });
        }
      });
    }
  };

module.exports = {

    addCustomer,
    updateCustomer,
    getAllCustomers,
    getCustomerById,
    deleteCustomers

}
