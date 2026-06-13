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
import { register, clearError } from '../../store/slices/authSlice'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [localError, setLocalError] = useState('')
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
    setLocalError('')
    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match')
      return
    }
    dispatch(register({ name: form.name, email: form.email, password: form.password }))
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Card sx={{ maxWidth: 420, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom align="center">
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Sign up to get started.
          </Typography>
          {(error || localError) && <Alert severity="error" sx={{ mb: 2 }}>{localError || error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Name" name="name" value={form.name} onChange={handleChange} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Email" name="email" type="email" value={form.email} onChange={handleChange} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Password" name="password" type="password" value={form.password} onChange={handleChange} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required sx={{ mb: 3 }} />
            <Button fullWidth type="submit" variant="contained" size="large" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" underline="hover">Sign In</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
