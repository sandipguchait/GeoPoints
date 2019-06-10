import React,{ useState, useContext } from "react";
import { withStyles } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from "@material-ui/icons/Send";
import Divider from "@material-ui/core/Divider";
import { GraphQLClient } from 'graphql-request';

import {CREATE_COMMENT_MUTATION} from '../../graphql/mutations';
import { BASE_URL} from '../../clientHook';
import Context from '../../context';



const CreateComment = ({ classes }) => {
  const { state , dispatch } = useContext(Context);
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const idToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

  const handleSubmitComment = async() => {
    setSubmitting(true)
    const client = new GraphQLClient(BASE_URL, {
      headers: { authorization: idToken }
    });
    const variables = { pinId: state.currentPin._id, text: comment };
    const { createComment } = await client.request(CREATE_COMMENT_MUTATION, variables);

    dispatch({ type: "CREATE_COMMENT", payload: createComment })
    setComment("")
    setSubmitting(false)
  }

  return (
    <>
      <form className={classes.form}>
        <IconButton 
          className={classes.clearButton}
          disabled={!comment.trim()}
          onClick={() => setComment("")}
        >
          <ClearIcon />
        </IconButton>
        <InputBase 
          className={classes.input} 
          placeholder="Add Comment" 
          multiline={true} 
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <IconButton 
          className={classes.sendButton}
          disabled={!comment.trim()}
          onClick={handleSubmitComment}
        >
          <SendIcon />
        </IconButton>
      </form>
      <Divider />
    </>
  )
};

const styles = theme => ({
  form: {
    display: "flex",
    alignItems: "center"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  clearButton: {
    padding: 0,
    color: "red"
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark
  }
});

export default withStyles(styles)(CreateComment);
