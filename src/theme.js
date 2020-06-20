import { createMuiTheme } from '@material-ui/core/styles';
import { green, lightGreen, red, deepOrange, orange } from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: green,
        secondary: orange
    },
});

export default theme;