import React, { useContext } from "react";
import { GraphQLClient } from 'graphql-request';
import { GoogleLogin } from 'react-google-login';
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import '../../styles.css';
//Importing Context
import Context from '../../context';
import { ME_QUERY } from '../../graphql/queries';


const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);
  
  // Onsuccesss of signin sending token to backend
  const onSuccess = async googleUser => {
    try {
      const idToken = googleUser.getAuthResponse().id_token
      const client = new GraphQLClient('http://localhost:4000/graphql',{
        headers: { authorization: idToken }
      })
      const data = await client.request(ME_QUERY)
      
      //Dispatch the user data to state object
      dispatch({ type: "LOGIN_USER", payload: data.me })
      //dispatch the isauth state to global state
      dispatch({ type: "IS_LOGGED_IN", payload: googleUser.isSignedIn()})
    } 
    catch(err) {
      onFailure(err)
    }
  };

  const onFailure = err => {
    console.error("Error Logging in", err)
  }

  return (
    <div className="root">
        <div className="container">
          <Typography
            component="h1"
            variant="h3"
            gutterBottom
            noWrap
            style={{ color: "rgb(66, 133, 244)", fontWeight: "bold", fontStyle:"oblique"}}
          >
            GeoPoints
          </Typography>
          <GoogleLogin 
            clientId="868408474848-q2f5ujaq4fh0qc4jg9tq1lrujvio7h77.apps.googleusercontent.com"
            onSuccess={onSuccess}
            onFailure={onFailure}
            isSignedIn={true}
            buttonText="Login with Google"
            theme="dark"
          />
        </div>
      </div>
  )
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  }
};

export default withStyles(styles)(Login);
