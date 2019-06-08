import React, { useState, useEffect } from "react";
import ReactMapGL, { NavigationControl } from 'react-map-gl';
import { withStyles } from "@material-ui/core/styles";
import '../styles.css';
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const INITIAL_VIEWPORT = {
  latitude: 22.589752733932833,
  longitude: 86.02945304174042,
  zoom: 8
}

const Map = ({ classes }) => {
  const [ mapview, setMapview] = useState('streets-v9');
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null)

  const handleChange = (e) => {
    setMapview(e.target.value)
  }

  useEffect(() => {
    getUserPosition()
  }, [])

  const getUserPosition = () => {
    if("geolocation" in navigator ) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude} = position.coords
        setViewport({...viewport, latitude, longitude})
        setUserPosition({ latitude, longitude })
      })
    }
  }

  return (
    <>
    <div className="alert">
      <label><strong>Choose MapView </strong> </label>
      <input id='streets-v11' type='radio' name='rtoggle' value='streets-v11' onChange={handleChange}/>{' '}
        <label htmlFor='streets'>Streets</label> {' '}
      <input id='light-v10' type='radio' name='rtoggle' value='light-v10' onChange={handleChange}/>{' '}
        <label htmlFor='light'>Light</label>{' '}
      <input id='dark-v10' type='radio' name='rtoggle' value='dark-v10'onChange={handleChange}/>{' '}
        <label htmlFor='dark'>Dark</label>{' '}
      <input id='outdoors-v11' type='radio' name='rtoggle' value='outdoors-v11' onChange={handleChange}/>{' '}
        <label htmlFor='outdoors'>Outdoors</label>{' '}
      <input id='satellite-v9' type='radio' name='rtoggle' value='satellite-v9' onChange={handleChange}/>{' '}
        <label htmlFor='satellite'>Satellite</label>{' '}
    </div>
    
    <div className={classes.root}>
      <ReactMapGL
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle={`mapbox://styles/mapbox/${mapview}`}
        mapboxApiAccessToken="pk.eyJ1Ijoic2FuZGlwZ3VjaGFpdCIsImEiOiJjanduczlybnMxa2c1NDRwNmE5em0xbnZnIn0.pZORJqnyQyGANx-oVXeRXg"
        onViewportChange={newViewport => setViewport(newViewport)}
        {...viewport}
      >
        {/* Navigation Control Button with + &  - */}
        <div className={classes.navigationControl}>
          <NavigationControl 
            onViewportChange={newViewport => setViewport(newViewport)}
          />
        </div>
      </ReactMapGL>
    </div>
    </>
  );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
