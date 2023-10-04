const SearchView = {
    renderSearchItem(item) {
        const {
            itemid,
            item_code,
            item_name,
            item_image,
            serial_status,
            serial_no,
            colorid,
            sell_price,
            wholesale_price,
            discount,
            qty
        } = item;

        let nameAndcode ="";

        if (serial_no) {
            nameAndcode = `${item_name.replace(/\s/g, '')}${item_code.replace(/\s/g, '')}${serial_no}`;
        }
        if (!serial_no) {
            nameAndcode = `${item_name.replace(/\s/g, '')}${item_code.replace(/\s/g, '')}`;
        }
        

        const data = {
            itemid,
            item_code,
            item_name,
            serial_no,
            colorid,
            item_image,
            serial_status,
            sell_price,
            wholesale_price,
            discount,
            qty,
            nameAndcode  // Add the nameAndcode variable

        };

        return data;
    },

    renderSearchItemsArray(items) {
        return items.map(item => this.renderSearchItem(item));
    }
};

module.exports = SearchView;