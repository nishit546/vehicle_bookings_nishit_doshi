import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InboxIcon from '@mui/icons-material/Inbox'

export default function EmptyState({ message = 'No data available', icon, action }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
      {icon || <InboxIcon sx={{ fontSize: 64, color: 'text.disabled' }} />}
      <Typography variant="h6" color="text.secondary">{message}</Typography>
      {action}
    </Box>
  )
}
