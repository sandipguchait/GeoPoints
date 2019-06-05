
export default function reducer(state, action) {
  switch(action.type) {
    case "LOGIN_USER": 
      return {
        ...state,
        currentUser: action.payload
      }
    case "IS_LOGGED_IN":
      return {
        ...state,
        isAuth: action.payload
      }
    default:
      return state
  }
}