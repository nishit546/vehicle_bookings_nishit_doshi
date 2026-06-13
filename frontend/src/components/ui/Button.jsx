import MuiButton from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

export default function Button({ children, loading, disabled, startIcon, endIcon, ...props }) {
  return (
    <MuiButton
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={18} color="inherit" /> : startIcon}
      endIcon={endIcon}
      {...props}
    >
      {children}
    </MuiButton>
  )
}
