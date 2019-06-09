import React, { useState, useEffect, useContext } from "react";
import ReactMapGL, { NavigationControl, Marker } from 'react-map-gl';
import { withStyles } from "@material-ui/core/styles";
import '../styles.css';
import { GraphQLClient } from 'graphql-request';
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

import { BASE_URL } from '../clientHook';
import { GET_PINS } from '../graphql/queries';
import PinIcon from '../components/PinIcon';
import Context from '../context';
import Blog from '../components/Blog';

const INITIAL_VIEWPORT = {
  latitude: 22.589752733932833,
  longitude: 86.02945304174042,
  zoom: 13
}

const Map = ({ classes }) => {
  const { state, dispatch } = useContext(Context);
  const [ mapview, setMapview] = useState('streets-v9');
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null)

  const handleChange = (e) => {
    setMapview(e.target.value)
  };

  const handleClick = ({ lngLat, leftButton }) => {
    if(!leftButton) return 
    if(!state.draft) {
      dispatch({ type: "CREATE_DRAFT" })
    }
    const [longitude, latitude] = lngLat;
    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: {
        longitude, 
        latitude
      }
    })
  }

  useEffect(() => {
    getUserPosition()
  }, []);

  const getUserPosition = () => {
    //Getting User current position using geolocation from window object
    if("geolocation" in navigator ) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude} = position.coords
        setViewport({...viewport, latitude, longitude})
        setUserPosition({ latitude, longitude })
      })
    }
  };

  useEffect(() => {
    getPins();
  }, []);

  const idToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

  const getPins = async () => {
    const client = new GraphQLClient(BASE_URL, {
      headers: { authorization: idToken}
    })
    const { getPins } = await client.request(GET_PINS)
    dispatch({ type: "GET_PINS", payload: getPins })
  };


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
        onClick={handleClick}
      >
        {/* Navigation Control Button with + &  - */}
        <div className={classes.navigationControl}>
          <NavigationControl 
            onViewportChange={newViewport => setViewport(newViewport)}
          />
        </div>

        {/* Pin For User's Current Position */}
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon 
              size={40}
              color="darkred"
            />
          </Marker>
        )}

        {/* DRAFT PIN */}
        {state.draft && (
           <Marker
           latitude={state.draft.latitude}
           longitude={state.draft.longitude}
           offsetLeft={-19}
           offsetTop={-37}
         >
           <PinIcon 
             size={40}
             color="hotpink"
           />
         </Marker>
        )}

        {/* Created Pins  */}
        {state.pins && state.pins.map(pin => (
            <Marker
              key={pin._id}
              latitude={pin.latitude}
              longitude={pin.longitude}
              offsetLeft={-19}
              offsetTop={-37}
            >
           <PinIcon 
             size={40}
             color="darkblue"
           />
          </Marker>
        ))}
      </ReactMapGL>

      {/* BLOG AREA To ADD PIN CONTENT  */}
      <Blog />
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
