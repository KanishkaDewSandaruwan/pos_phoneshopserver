const allbranchesStockView = {
    renderStockWithBranches(stock) {
        const {
            item_code,
            itemid,
            item_name,
            item_description,
            catid,
            subcatid,
            storageid,
            condition_type, 
            brandid,
            serial_status,
            stockes // Prices array for different branches
        } = stock;

        const data = {
            item_code,
            itemid,
            item_name,
            item_description,
            catid,
            subcatid,
            storageid,
            condition_type,
            brandid,
            serial_status,
            stock: stockes // stock array
        };

        return data;
    },

    renderStockWithBranchesArray(stocks) {
        const stockMap = new Map();
        
        for (const stock of stocks) {
            const { branch_id, qty} = stock;
             
            if (!stockMap.has(stock.itemid)) {
                stockMap.set(stock.itemid, {
                    ...stock,
                    stockes: []
                });
            }
            
            const stockEntry = stockMap.get(stock.itemid);
            stockEntry.stockes.push({
                branch_id,
                qty
            });
        }
        
        const aggregatedStockes = [...stockMap.values()];

        return aggregatedStockes.map(stock => this.renderStockWithBranches(stock));
    }
};

module.exports = allbranchesStockView;