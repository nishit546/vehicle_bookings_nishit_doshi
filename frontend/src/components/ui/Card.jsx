import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

export default function Card({ children, sx, ...props }) {
  return (
    <MuiCard sx={{ ...sx }} {...props}>
      <CardContent>{children}</CardContent>
    </MuiCard>
  )
}
