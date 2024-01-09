import React from "react";
const initialState = {
  logo:[]
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "setJson":
      return {
        ...state,
        jsonData: action.data
      };
    case "setLogo":
      const tempLogo = [action.data, ...state.logo];
      return {
        ...state,
        logo: tempLogo
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
