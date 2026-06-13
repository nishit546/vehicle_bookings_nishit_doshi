import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import PeopleIcon from '@mui/icons-material/People'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import StarIcon from '@mui/icons-material/Star'
import { getRevenueStats } from '../../services/analyticsService'

const StatCard = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }} elevation={1}>
    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}15`, color }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      <Typography variant="h5" fontWeight={600}>{value}</Typography>
    </Box>
  </Paper>
)

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth)
  const [revenueData, setRevenueData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRevenueStats()
      .then(({ data }) => setRevenueData(data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalRevenue = revenueData?.reduce((sum, r) => sum + (r.totalBookingValue || 0), 0) || 0
  const totalRides = revenueData?.reduce((sum, r) => sum + (r.count || 0), 0) || 0
  const avgRating = revenueData?.reduce((sum, r) => sum + (r.avgDriverRating || 0), 0) / (revenueData?.length || 1) || 0

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Welcome, {user?.name || 'User'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Here's what's happening with your vehicle bookings today.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? <Skeleton variant="rounded" height={80} /> : (
            <StatCard title="Total Bookings" value={totalRides.toLocaleString()} icon={<DirectionsCarIcon />} color="#1976d2" />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? <Skeleton variant="rounded" height={80} /> : (
            <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<AttachMoneyIcon />} color="#2e7d32" />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? <Skeleton variant="rounded" height={80} /> : (
            <StatCard title="Avg Driver Rating" value={avgRating.toFixed(1)} icon={<StarIcon />} color="#ed6c02" />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? <Skeleton variant="rounded" height={80} /> : (
            <StatCard title="Vehicle Types" value={revenueData?.length || 0} icon={<PeopleIcon />} color="#9c27b0" />
          )}
        </Grid>
      </Grid>
    </Box>
  )
}
