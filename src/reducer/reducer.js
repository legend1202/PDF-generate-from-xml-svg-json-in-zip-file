import React from "react";
const initialState = {};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "setJson":
      return {
        ...state,
        jsonData: action.data
      };
    default:
      return state
  }
}

export default reducer;
