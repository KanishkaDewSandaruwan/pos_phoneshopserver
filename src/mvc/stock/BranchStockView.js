
const branchStockView = {
    renderbranchStock(stock) {
        const {
            item_code,
            itemid,
            item_name,
            item_description,
            qty,
            catid,
            subcatid,
            storageid,
            condition_type,
            brandid,
            serial_status,
            branch_id
        } = stock;

        const data = {
            item_code,
            itemid,
            item_name,
            item_description,
            qty,
            catid,
            subcatid,
            storageid,
            condition_type,
            brandid,
            serial_status,
            branch_id
        };

        return data;
    },

    renderbranchStocksArray(stocks) {
        return stocks.map(stock => this.renderbranchStock(stock));
    }
};
module.exports = branchStockView;
