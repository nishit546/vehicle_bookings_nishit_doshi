import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
      <WarningAmberIcon sx={{ fontSize: 64, color: 'error.main' }} />
      <Typography variant="h6" color="text.secondary">{message}</Typography>
      {onRetry && <Button variant="outlined" onClick={onRetry}>Try Again</Button>}
    </Box>
  )
}
