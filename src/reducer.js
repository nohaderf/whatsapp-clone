export const initialState = {
    avatar : null, 
} // how the data originally looks before adding anything

export const actionTypes = {
    SET_AVATAR: "SET_AVATAR",
}

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_AVATAR: // listen to SET_AVATAR action
            return {
                ...state,
                avatar: action.avatar,
        };

        default:
            return state;
    }
};

export default reducer;