import React,{ useState, useContext } from "react";
import axios from 'axios';
import { GraphQLClient } from 'graphql-request';
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";

import Context from '../../context';
import {CREATE_PIN_MUTATION} from '../../graphql/mutations';
import { BASE_URL } from '../../clientHook';

const CreatePin = ({ classes }) => {

  const { state, dispatch } = useContext(Context);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [ submitting, setSubmitting ] = useState(false);
  

  //Submitting the Form
  const handleSubmit = async event => {
    try {
      event.preventDefault();
      setSubmitting(true)
      //Getting current logged in user token from window object
      const idToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

      //Performing Mutation
      const client = new GraphQLClient(BASE_URL, {
        headers: { authorization: idToken }
      })
      const url = await handleImageUpload();
      const { latitude, longitude } = state.draft;
      const variables = { title, image: url , content , latitude, longitude }
      const { createPin } = await client.request(CREATE_PIN_MUTATION, variables )

      //dispatching an action for new pin
      dispatch({ type: "CREATE_PIN", payload: createPin })
      handleDeleteDraft();
    } 
    catch(err) {
      setSubmitting(false)
      console.log("Error Creating Pin ",err)
    }
  };


  //Image Upload To cloudinary
  const handleImageUpload = async() => {
    const data = new FormData()
    data.append('file', image)
    data.append("upload_preset", "Traveller")
    data.append("cloud_name", "xjailbreak")

    const res = await axios.post("https://api.cloudinary.com/v1_1/xjailbreak/image/upload", data)
    return res.data.url
  }
  
  //Deleteing Draft 
  const handleDeleteDraft = () => {
    setTitle("")
    setImage("")
    setContent("")
    dispatch({ type: "DELETE_DRAFT"})
  }

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component="h2"
        variant="h4"
        color="secondary"
      >
        <LandscapeIcon className={classes.iconLarge} />Pin Location
      </Typography>
      <div>
        <TextField 
          name="title"
          label="Title"
          placeholder="Insert Pin Title"
          onChange={e => setTitle(e.target.value)}
        />
        <input 
          accept="image/*"
          id="image"
          type="file"
          className={classes.input}
          onChange={e => setImage(e.target.files[0])}
        />
        <label htmlFor="image">
          <Button
            component="span"
            style={{ color: image && "blue"}}
            size="small"
            className={classes.button}
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField 
          name="content"
          label="Content"
          multiline
          rows="6"
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={e => setContent(e.target.value)}
        />
      </div>
      <div>
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleDeleteDraft}
        >
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="secondary"
          disabled={!title.trim() || !content.trim() || !image || submitting }
          onClick={handleSubmit}
        >
          <SaveIcon className={classes.rightIcon} />
          Submit
        </Button>
      </div>
    </form>
  )
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
