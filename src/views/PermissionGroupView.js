const permissionGroupView = {
    renderPermission(res, permission_group) { // <-- Make sure 'permission_group' is valid

        const { permission_code, assignpermissionid } = permission_group;

        const data = {
            assignpermissionid,
            permission_code
        };

        res.send(data);
    },
};

module.exports = permissionGroupView;