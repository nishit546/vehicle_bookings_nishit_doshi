import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import { Card, Input, Button } from '../../components/ui'
import { fetchProfile } from '../../store/slices/authSlice'
import api from '../../services/api'

export default function Profile() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [form, setForm] = useState({ name: '', email: '', customerId: '' })
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const startEdit = () => {
    setForm({ name: user?.name || '', email: user?.email || '', customerId: user?.customerId || '' })
    setEditing(true)
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })
    try {
      await api.put('/auth/profile', form)
      dispatch(fetchProfile())
      setMessage({ type: 'success', text: 'Profile updated successfully.' })
      setEditing(false)
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>Profile</Typography>
      <Card sx={{ maxWidth: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main', fontSize: 32 }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="h5" fontWeight={600}>{user?.name}</Typography>
          <Chip label={user?.role} size="small" color="primary" sx={{ mt: 1 }} />
        </Box>

        {message.text && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

        {editing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Input label="Name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <Input label="Customer ID" name="customerId" value={form.customerId} onChange={handleChange} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={handleSave} loading={loading}>Save</Button>
              <Button color="inherit" onClick={() => setEditing(false)}>Cancel</Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Email:</strong> {user?.email}</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}><strong>Customer ID:</strong> {user?.customerId || 'N/A'}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </Typography>
            <Button variant="outlined" onClick={startEdit}>Edit Profile</Button>
          </Box>
        )}
      </Card>
    </Box>
  )
}
