import React, { useContext } from "react";
import { GraphQLClient } from 'graphql-request';
import { GoogleLogin } from 'react-google-login';
import { withStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";

//Importing Context
import Context from '../../context';

const ME_QUERY = `
  {
    me{
      _id
      name
      email
      picture
    }
  }
`

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
      dispatch({ type: "LOGIN_USER", payload: data.me })
    } 
    catch(err) {
      onFailure(err)
    }
  };

  const onFailure = err => {
    console.error("Error Logging in", err)
  }

  return (
    <GoogleLogin 
      clientId="868408474848-q2f5ujaq4fh0qc4jg9tq1lrujvio7h77.apps.googleusercontent.com"
      onSuccess={onSuccess}
      onFailure={onFailure}
      isSignedIn={true}
    />
  )
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
