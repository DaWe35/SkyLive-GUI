import { createMuiTheme } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#57b560',
        },
        secondary: {
            main: '#b8954d',
        }
    },
});

export default theme;