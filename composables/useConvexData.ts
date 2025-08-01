import { ConvexClient } from "convex/browser";

// ID de usuario por defecto para desarrollo (fallback)
export const DEFAULT_USER_ID = "kd7chrfefvj8sb4wsxf4jtqqms7mvkx0"; 

export const useConvexData = () => {
  // Cliente de Convex - crear dentro de la función
  const config = useRuntimeConfig()
  const convex = new ConvexClient(config.public.convexUrl);
  
  const authStore = useAuthStore();
  
  // ID del usuario actual para datos locales (autenticación local)
  const getCurrentUserId = () => {
    return authStore.getUserId || `user_${Date.now()}`;
  };
  
  // Mapeo de usuarios locales a IDs de Convex
  const getUserMapping = () => {
    if (process.client) {
      const mapping = localStorage.getItem('user_convex_mapping');
      return mapping ? JSON.parse(mapping) : {};
    }
    return {};
  };
  
  const saveUserMapping = (localUserId: string, convexUserId: string) => {
    if (process.client) {
      const mapping = getUserMapping();
      mapping[localUserId] = convexUserId;
      localStorage.setItem('user_convex_mapping', JSON.stringify(mapping));
    }
  };
  
  // ID del usuario para Convex - generar ID único por usuario local
  const getConvexUserId = () => {
    if (!authStore.isAuthenticated) {
      return DEFAULT_USER_ID;
    }
    
    const localUserId = getCurrentUserId();
    const mapping = getUserMapping();
    
    // Si ya tenemos un mapeo, usarlo
    if (mapping[localUserId]) {
      return mapping[localUserId];
    }
    
    // Generar un nuevo mapeo único basado en el usuario local
    // Por ahora, cada usuario local tendrá asociado el DEFAULT_USER_ID
    // TODO: Cuando tengamos usuarios reales en Convex, esto se puede mejorar
    const convexUserId = DEFAULT_USER_ID;
    
    saveUserMapping(localUserId, convexUserId);
    console.log(`🔗 Usuario local ${localUserId} mapeado a Convex ${convexUserId}`);
    return convexUserId;
  };

  return {
    convex,
    DEFAULT_USER_ID,
    getCurrentUserId,    // Para datos locales (separación por usuario)
    getConvexUserId     // Para queries de Convex (usar ID por defecto)
  };
};
