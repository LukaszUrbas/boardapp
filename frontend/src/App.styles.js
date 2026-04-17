import { createTheme } from '@mui/material';

const appBackground = 'linear-gradient(140deg, #f5faf8 0%, #edf4ff 100%)';

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f766e'
    },
    secondary: {
      main: '#ea580c'
    },
    background: {
      default: '#f4f8fb',
      paper: '#ffffff'
    }
  },
  shape: {
    borderRadius: 14
  }
});

export const styles = {
  authPage: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    px: 2,
    background: appBackground
  },
  authCard: {
    width: '100%',
    maxWidth: 420
  },
  appPage: {
    minHeight: '100vh',
    position: 'relative',
    py: 4,
    background: appBackground
  },
  logoutButtonWrapper: {
    position: 'absolute',
    top: { xs: 12, sm: 20 },
    right: { xs: 12, sm: 20 },
    zIndex: 10
  },
  appContainer: {
    px: { xs: 2, md: 4 }
  }
};
