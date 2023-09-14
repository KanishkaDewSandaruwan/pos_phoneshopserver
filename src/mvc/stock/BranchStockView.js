
const branchStockView = {
    renderbranchStock(stock) {
        const {
            itemid,
            item_code,
            item_name,
            item_description,
            catid,
            subcatid,
            storageid,
            sale_warranty,
            condition_type,
            brandid,
            item_image,
            serial_status,
            qty,
            branch_id
        } = stock;

        const data = {
            itemid,
            item_code,
            item_name,
            item_description,
            catid,
            subcatid,
            storageid,
            sale_warranty,
            condition_type,
            brandid,
            item_image,
            serial_status,
            qty,
            branch_id
        };

        return data;
    },

    renderbranchStocksArray(stocks) {
        return stocks.map(stock => this.renderbranchStock(stock));
    }
};
module.exports = branchStockView;
