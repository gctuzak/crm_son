export const usePermissions = () => {
    // Geliştirme aşamasında tüm izinleri true döndür
    return {
        hasRole: () => true,
        isAdmin: () => true,
        isManager: () => true,
        isUser: () => true
    };
};

export default usePermissions; 