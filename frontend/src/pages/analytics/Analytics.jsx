import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import StarIcon from '@mui/icons-material/Star'
import PlaceIcon from '@mui/icons-material/Place'
import { getRevenueStats, getStatusDistribution, getLocationDemand, getRatingsSummary } from '../../services/analyticsService'
import { ErrorState } from '../../components/ui'

const COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f', '#00796b', '#5c6bc0', '#ef5350']

const StatCard = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }} elevation={1}>
    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}15`, color }}>{icon}</Box>
    <Box>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      <Typography variant="h5" fontWeight={600}>{value}</Typography>
    </Box>
  </Paper>
)

export default function Analytics() {
  const [revenue, setRevenue] = useState([])
  const [statusDist, setStatusDist] = useState([])
  const [locations, setLocations] = useState([])
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [r, s, l, ra] = await Promise.all([
          getRevenueStats(), getStatusDistribution(), getLocationDemand(), getRatingsSummary(),
        ])
        setRevenue(r.data.data || [])
        setStatusDist(s.data.data || [])
        setLocations(l.data.data || [])
        setRatings(ra.data.data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />

  const totalRev = revenue.reduce((s, r) => s + (r.totalBookingValue || 0), 0)
  const totalBookings = revenue.reduce((s, r) => s + (r.count || 0), 0)
  const avgDriverRating = ratings.reduce((s, r) => s + (r.avgDriverRating || 0), 0) / (ratings.length || 1)
  const topLocation = locations[0]?.pickupLocation || 'N/A'

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>Analytics</Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {loading ? [1,2,3,4].map(i => <Grid item xs={12} sm={6} md={3} key={i}><Skeleton variant="rounded" height={80} /></Grid>) : (
          <>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Total Revenue" value={`₹${totalRev.toLocaleString()}`} icon={<AttachMoneyIcon />} color="#2e7d32" /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Total Bookings" value={totalBookings.toLocaleString()} icon={<DirectionsCarIcon />} color="#1976d2" /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Avg Driver Rating" value={avgDriverRating.toFixed(1)} icon={<StarIcon />} color="#ed6c02" /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCard title="Top Location" value={topLocation} icon={<PlaceIcon />} color="#9c27b0" /></Grid>
          </>
        )}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Revenue by Vehicle Type</Typography>
            {loading ? <Skeleton variant="rounded" height={300} /> : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vehicleType" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalBookingValue" name="Revenue" fill="#1976d2" />
                  <Bar dataKey="count" name="Count" fill="#2e7d32" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Booking Status Distribution</Typography>
            {loading ? <Skeleton variant="rounded" height={300} /> : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusDist} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label>
                    {statusDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Top Pickup Locations</Typography>
            {loading ? <Skeleton variant="rounded" height={300} /> : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={locations.slice(0, 10)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="pickupLocation" width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ed6c02" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Ratings Summary by Vehicle Type</Typography>
            {loading ? <Skeleton variant="rounded" height={300} /> : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ratings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vehicleType" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgDriverRating" name="Driver Rating" fill="#1976d2" />
                  <Bar dataKey="avgCustomerRating" name="Customer Rating" fill="#9c27b0" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
