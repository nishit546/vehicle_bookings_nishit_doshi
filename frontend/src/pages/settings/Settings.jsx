import { useSelector, useDispatch } from 'react-redux'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { toggleDarkMode } from '../../store/slices/uiSlice'

export default function Settings() {
  const { darkMode } = useSelector((state) => state.ui)
  const dispatch = useDispatch()

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Settings
      </Typography>
      <Card sx={{ maxWidth: 500 }}>
        <CardContent>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={() => dispatch(toggleDarkMode())} />}
            label="Dark Mode"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
            Toggle between light and dark theme
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
