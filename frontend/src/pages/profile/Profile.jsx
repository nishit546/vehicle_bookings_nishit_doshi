import { useSelector } from 'react-redux'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'

export default function Profile() {
  const { user } = useSelector((state) => state.auth)

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Profile
      </Typography>
      <Card sx={{ maxWidth: 500 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
          <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main', fontSize: 32 }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="h5" fontWeight={600}>{user?.name}</Typography>
          <Chip label={user?.role} size="small" color="primary" sx={{ mt: 1, mb: 2 }} />
          <Typography variant="body1" color="text.secondary">{user?.email}</Typography>
          {user?.customerId && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Customer ID: {user.customerId}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
