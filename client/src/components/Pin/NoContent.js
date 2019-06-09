import React from "react";
import { withStyles } from "@material-ui/core/styles";
import ExploreIcon from "@material-ui/icons/Explore";
import Typography from "@material-ui/core/Typography";
import  MapIcon  from '@material-ui/icons/Map'

const NoContent = ({ classes }) => (
  <div className={classes.root}>
    <ExploreIcon className={classes.icon} />
    <Typography
      noWrap
      component="h2"
      variant="h6"
      align="center"
      color="textPrimary"
      gutterBottom
    >
      Click on the map to add a pin
    </Typography>
    <MapIcon className={classes.icon2}/>
  </div>
)

const styles = theme => ({
  root: {
    display: "flex",
    backgroundColor: "smokeWhite",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
  },
  icon: {
    margin: theme.spacing.unit,
    color: "#746AFA",
    fontSize: "80px"
  },
  icon2: {
    margin: theme.spacing.unit,
    color: "#66B266",
    fontSize: "80px"
  }
});

export default withStyles(styles)(NoContent);
