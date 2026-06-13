import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

export default function Loader({ message = 'Loading...', fullPage }) {
  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">{message}</Typography>
    </Box>
  )

  if (fullPage) {
    return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>{content}</Box>
  }

  return <Box sx={{ py: 8 }}>{content}</Box>
}
