import React, {useReducer, createContext} from 'react';
import {jwtDecode} from 'jwt-decode';

const initialState=
{
    user: null
}

if (localStorage.getItem("token"))
    {
        const decodedToken = jwtDecode(localStorage.getItem("token"))

        //multiplication will help to keep the expire time and Date.now in the same time
        if(decodedToken.exp *1000 < Date.now())
            {
                localStorage.removeItem("token")
            }
            else{
                initialState.user=decodedToken;
            }
    }

const AuthContext = createContext({
    user: null,
    login: (userData) => {},
    logout: () => {}
});

// AuthReducer function to manage state transitions
function authReducer (state, action) {
    switch (action.type) {
        case 'LOGIN':
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};
   
// AuthProvider component to wrap the application
function AuthProvider  (props) {
    const [state, dispatch] = useReducer(authReducer, initialState);
  
    //things we want to do on a successfull login from our server not the apollo server login
    const login =  (userData) => {
        localStorage.setItem("token", userData.token); // Store user data in local storage
        dispatch({ 
            type: 'LOGIN', 
            payload: userData
         });
      }

    function logout(){
        localStorage.removeItem("token");
        dispatch({ 
            type: 'LOGOUT', 
         });
    }

    return (
        <AuthContext.Provider
        value={{user: state.user, login, logout}}
        {...props}
        />
    )
}

export {AuthContext, AuthProvider};

