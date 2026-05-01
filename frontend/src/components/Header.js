import { UserContext } from "../userContext";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

function Header(props) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {props.title}
        </Typography>

        <Box>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>

          <Button color="inherit" component={Link} to="/trending">
            Trending
          </Button>

          <UserContext.Consumer>
            {(context) =>
              context.user ? (
                <>
                  <Button color="inherit" component={Link} to="/publish">
                    Publish
                  </Button>
                  <Button color="inherit" component={Link} to="/profile">
                    Profile
                  </Button>
                  <Button color="inherit" component={Link} to="/logout">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/login">
                    Login
                  </Button>
                  <Button color="inherit" component={Link} to="/register">
                    Register
                  </Button>
                </>
              )
            }
          </UserContext.Consumer>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
