import api from './api'

export const getRevenueStats = () => api.get('/analytics/revenue')
export const getStatusDistribution = () => api.get('/analytics/status-distribution')
export const getLocationDemand = () => api.get('/analytics/location-demand')
export const getRatingsSummary = () => api.get('/analytics/ratings-summary')
