import React, { createContext, useContext, useReducer } from "react";

export const StateContext = createContext(); // where the data lives

export const StateProvider = ({ reducer, initialState, children }) => (
    <StateContext.Provider value ={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
); //higher order component; children = <App />

export const useStateValue = () => useContext(StateContext); // allows us to pull data 