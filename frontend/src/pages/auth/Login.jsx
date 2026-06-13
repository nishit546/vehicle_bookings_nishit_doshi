import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { login, clearError } from '../../store/slices/authSlice'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  useEffect(() => {
    return () => dispatch(clearError())
  }, [dispatch])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login(form))
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Card sx={{ maxWidth: 420, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom align="center">
            Sign In
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Welcome back! Enter your credentials.
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Email" name="email" type="email" value={form.email} onChange={handleChange} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Password" name="password" type="password" value={form.password} onChange={handleChange} required sx={{ mb: 3 }} />
            <Button fullWidth type="submit" variant="contained" size="large" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" underline="hover">Sign Up</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
