import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#1db954',
        },
        secondary: {
            main: '#9B2C2C',
        },
        background: {
            paper: '#1f1f1f',
            default: '#171717'
        }
    },
});

export default theme;