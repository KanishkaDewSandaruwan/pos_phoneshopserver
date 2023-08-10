const ComonItemView
 = {
    renderComonItem(item) {
        const {
            item_code,
            itemid,
            item_name,
            item_description,
            catid,
            subcatid,
            colorid,
            brandid,
            item_image,
            trndate,
            status,
            is_delete

        } = item;

        const data = {
            itemid,
            item_code,
            item_name,
            item_description,
            catid,
            subcatid,
            colorid,
            brandid,
            item_image,
            trndate,
            status,
            is_delete
        };

        return data;
    },

    renderComonItemsArray(items) {
        return items.map(item => this.renderComonItem(item));
    }
};

module.exports = ComonItemView;
