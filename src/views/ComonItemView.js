const ComonItemView
 = {
    renderComonItem(item) {
        const {
            item_code,
            itemid,
            item_name,
            item_description,
            catid,
            item_image,
            trndate,
            status,

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

        };

        return data;
    },

    renderComonItemsArray(items) {
        return items.map(item => this.renderComonItem(item));
    }
};

module.exports = ComonItemView;
