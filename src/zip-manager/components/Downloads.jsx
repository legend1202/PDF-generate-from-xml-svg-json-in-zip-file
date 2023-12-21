import "./styles/Downloads.css";
import React, {useEffect, useState} from "react";

import { useSelector } from "react-redux";
import CardDetail from "./CardDetail";

const Downloads = () => {
  const [optionImage, setOptionImage] = useState("");
  const [details, setDetails] = useState([]);

  const [fontFamily, setFontFamilyStyle] = useState("");
  const [fontColor, setFontColor] = useState("");
  const [cardDetails, setCardDetails] = useState([]);

  const stData = useSelector(state => state.reducer.jsonData);

  useEffect(() => {
    if (stData) {
      setOptionImage(stData?.customizationData?.children[0]?.children[0]?.children[0]?.optionSelection?.overlayImage?.imageUrl);
      setDetails(stData?.customizationData?.children[0]?.children[0]?.children[1]?.children);
    }
  },[stData]);

  useEffect(() => {
      const [fontFamilyData, fontColorData, cardContents ] = details;

      setFontFamilyStyle(fontFamilyData?.fontSelection?.family);
      setFontColor(fontColorData?.colorSelection?.value);
      setCardDetails(cardContents?.children);
  },[details]);

  const backgroundStyle = {
    // backgroundImage: "url('" + optionImage + "')",
    // backgroundSize: 'cover',
    // backgroundPosition: 'center',
    width: '101mm',
    height: '69mm',
    color: fontColor,
    fontFamily
  };

  return (
    <div
      className="downloads scrollable"
      role="navigation"
    >
      <div className="business-card" id="businessCard"  style={backgroundStyle} >
        <div className="business-card-bg">
          <img src={optionImage} alt="" crossOrigin="anonymous" />
        </div>
        <div className="blids-up">
          <div className="blids">
            <div className="vertical-blid-left"></div>
            <div className="vertical-blid-right"></div>
          </div>
          <div className="blids">
            <div className="horizon-blid-left"></div>
            <div className="horizon-blid-right"></div>
          </div>
        </div>
        <div className="blids-down">
          <div className="blids">
            <div className="horizon-blid-left"></div>
            <div className="horizon-blid-right"></div>
          </div>
          <div className="blids">
            <div className="vertical-blid-left"></div>
            <div className="vertical-blid-right"></div>
          </div>
        </div>
        <div className="card-details">
          {
            cardDetails?.map(( cardDetail, key ) => 
              <CardDetail cardDetail = {cardDetail} fontColor = {fontColor} fontFamily={fontFamily} key= {key}/>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Downloads;
