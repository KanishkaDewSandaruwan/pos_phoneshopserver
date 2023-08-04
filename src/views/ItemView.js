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
            subcatid,
            cat_name,
            subcat_name,
            colorid,
            colorname,
            brandid,
            brandname,
            serial_status
        } = item;

        const data = {
            itemid,
            item_code,
            item_name,
            item_description,
            category: {
                catid,
                cat_name
            },
            item_image,
            trndate,
            status: {
                status,
                statusString: status === 1 ? "Active" : "Not Active"
            },
            subcategory: {
                subcatid,
                subcat_name
            },
            brands: {
                brandid,
                brandname
            },
            colors: {
                colorid,
                colorname
            },
            serial_status: {
                serial_status,
                serial_statusString: serial_status === 1 ? "Serial" : "Non Serial"
            }
        };

        return data;
    },

    renderItemsArray(items) {
        const renderedItems = items.map(item => this.renderItem(item));
        return {
            items: renderedItems
        };
    }
};

module.exports = ItemView;
