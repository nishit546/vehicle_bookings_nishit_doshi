import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export default function Users() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Users
      </Typography>
      <Typography variant="body1" color="text.secondary">
        User management (CRUD) coming next.
      </Typography>
    </Box>
  )
}
