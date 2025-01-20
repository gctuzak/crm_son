// Kullanıcı Rolleri
export const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    USER: 'user'
};

// Yetki Sabitleri
export const PERMISSIONS = {
    // Genel Yetkiler
    VIEW_OWN_ENTRIES: 'view_own_entries',
    VIEW_ALL_ENTRIES: 'view_all_entries',
    EDIT_OWN_ENTRIES: 'edit_own_entries',
    EDIT_ALL_ENTRIES: 'edit_all_entries',
    
    // Müşteri & İlişki Yetkileri
    VIEW_CUSTOMERS: 'view_customers',
    ADD_CUSTOMER: 'add_customer',
    EDIT_CUSTOMER: 'edit_customer',
    
    // Aktivite & Görev Yetkileri
    VIEW_ACTIVITIES: 'view_activities',
    ADD_ACTIVITY: 'add_activity',
    EDIT_ACTIVITY: 'edit_activity',
    VIEW_ALL_ACTIVITY_TYPES: 'view_all_activity_types',
    
    // Rapor Yetkileri
    EXPORT_EXCEL: 'export_excel',
    VIEW_PHONE_CALLS: 'view_phone_calls',
    VIEW_REPORTS: 'view_reports',
    
    // Teklif Yetkileri
    VIEW_QUOTES: 'view_quotes',
    ADD_QUOTE: 'add_quote',
    EDIT_QUOTE: 'edit_quote',
    VIEW_QUOTE_STATUS: 'view_quote_status',
    
    // Sipariş Yetkileri
    VIEW_ORDERS: 'view_orders',
    ADD_ORDER: 'add_order',
    EDIT_ORDER: 'edit_order',
    CHANGE_ORDER_STATUS: 'change_order_status',
    
    // Sistem Yetkileri
    MANAGE_USERS: 'MANAGE_USERS',
    VIEW_USERS: 'VIEW_USERS',
    MANAGE_ACTIVITIES: 'MANAGE_ACTIVITIES',
    MANAGE_QUOTES: 'MANAGE_QUOTES',
    MANAGE_ORDERS: 'MANAGE_ORDERS',
    MANAGE_PRODUCTS: 'MANAGE_PRODUCTS',
    MANAGE_FILES: 'MANAGE_FILES',
    VIEW_ALL_REPORTS: 'view_all_reports',
    MANAGE_SYSTEM: 'manage_system',
    VIEW_PRODUCTS: 'VIEW_PRODUCTS',
    VIEW_FILES: 'VIEW_FILES'
};

// Rol bazlı yetkiler
export const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: [
        // Admin tüm yetkilere sahip
        ...Object.values(PERMISSIONS)
    ],
    
    [ROLES.MANAGER]: [
        // Yönetici yetkileri
        PERMISSIONS.VIEW_ALL_ENTRIES,
        PERMISSIONS.EDIT_ALL_ENTRIES,
        PERMISSIONS.VIEW_CUSTOMERS,
        PERMISSIONS.ADD_CUSTOMER,
        PERMISSIONS.EDIT_CUSTOMER,
        PERMISSIONS.VIEW_ACTIVITIES,
        PERMISSIONS.ADD_ACTIVITY,
        PERMISSIONS.EDIT_ACTIVITY,
        PERMISSIONS.EXPORT_EXCEL,
        PERMISSIONS.VIEW_PHONE_CALLS,
        PERMISSIONS.VIEW_REPORTS,
        PERMISSIONS.VIEW_QUOTES,
        PERMISSIONS.ADD_QUOTE,
        PERMISSIONS.EDIT_QUOTE,
        PERMISSIONS.VIEW_ORDERS,
        PERMISSIONS.ADD_ORDER,
        PERMISSIONS.EDIT_ORDER,
        PERMISSIONS.VIEW_ALL_REPORTS
    ],
    
    [ROLES.USER]: [
        // Normal kullanıcı yetkileri
        PERMISSIONS.VIEW_OWN_ENTRIES,
        PERMISSIONS.EDIT_OWN_ENTRIES,
        PERMISSIONS.VIEW_CUSTOMERS,
        PERMISSIONS.VIEW_ACTIVITIES,
        PERMISSIONS.ADD_ACTIVITY,
        PERMISSIONS.VIEW_QUOTES,
        PERMISSIONS.VIEW_ORDERS,
        PERMISSIONS.VIEW_REPORTS
    ]
}; 