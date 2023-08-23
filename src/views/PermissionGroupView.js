const permissionGroupView = {
    renderpermissionGroup(permissions) {
        const permissionCodes = permissions.map(permission => permission.permission_code);
        return permissionCodes;
    }
};

module.exports = permissionGroupView;