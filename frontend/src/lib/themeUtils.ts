export const getThemeStyles = (isDark: boolean) => {
  return {
    // Background colors
    bgPrimary: isDark ? '#111827' : '#f8fafc',
    bgSecondary: isDark ? '#1f2937' : 'white',
    bgTertiary: isDark ? '#374151' : '#f3f4f6',
    
    // Text colors
    textPrimary: isDark ? '#f9fafb' : '#111827',
    textSecondary: isDark ? '#d1d5db' : '#6b7280',
    textTertiary: isDark ? '#9ca3af' : '#9ca3af',
    
    // Border colors
    borderPrimary: isDark ? '#374151' : '#e5e7eb',
    borderSecondary: isDark ? '#4b5563' : '#d1d5db',
    
    // Component colors
    cardBg: isDark ? '#1f2937' : 'white',
    cardBorder: isDark ? '#374151' : '#e5e7eb',
    inputBg: isDark ? '#374151' : 'white',
    inputBorder: isDark ? '#4b5563' : '#d1d5db',
    
    // Status colors (remain the same)
    status: {
      backlog: '#6b7280',
      todo: '#3b82f6',
      'in-progress': '#f59e0b',
      done: '#10b981',
      active: '#10b981',
      archived: '#6b7280',
      completed: '#3b82f6'
    },
    
    // Priority colors (remain the same)
    priority: {
      low: '#84cc16',
      medium: '#eab308',
      high: '#f97316',
      urgent: '#ef4444'
    }
  };
};