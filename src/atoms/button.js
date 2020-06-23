import { withStyles, Button as MuiButton } from "@material-ui/core";


const Button = withStyles((theme) => ({
    root: {
        color: "white",
        borderWidth: 2,
        '&:hover': {
            borderWidth: 2
        },
        '&:active': {
            borderWidth: 2
        },
        '&:focus': {
            borderWidth: 2
        },

    }

}))(MuiButton);

export default Button;