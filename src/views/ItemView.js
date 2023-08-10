const ItemView = {
    renderItem(item) {
        const {
            item_code,
            itemid,
            item_name,
            item_description,
            catid,
            item_image,
            trndate,
            status,
            sell_price,
            purchase_price,
            wholesale_price,
            discount,
            branch_id

        } = item;

        const data = {
            itemid,
            item_code,
            item_name,
            item_description,
            catid,
            item_image,
            trndate,
            status,
            sell_price,
            purchase_price,
            wholesale_price,
            discount,
            branch_id

        };

        return data;
    },

    renderItemsArray(items) {
        return items.map(item => this.renderItem(item));
    }
};

module.exports = ItemView;
