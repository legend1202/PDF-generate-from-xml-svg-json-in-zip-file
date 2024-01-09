import React from "react";
const initialState = {
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "setJson":
      return {
        ...state,
        jsonData: action.data
      };
    case "setLogo":
      return {
        ...state,
        logo: {...action.data}
      };
    case "setSvg":
      return {
        ...state,
        svgData: action.data
      };
    case "setFontFamily":
      return {
        ...state,
        fontFamily: action.data
      };
    case "setCardDetails":
      return {
        ...state,
        cardDetails: action.data
      };
    default:
      return state
  }
}

export default reducer;
