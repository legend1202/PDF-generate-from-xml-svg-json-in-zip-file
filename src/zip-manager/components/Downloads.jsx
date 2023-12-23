import "./styles/Downloads.css";
import React, {useEffect, useState} from "react";

import { useSelector } from "react-redux";
import CardDetail from "./CardDetail";

const Downloads = ({onDownload}) => {
  const [optionImage, setOptionImage] = useState("");
  const [details, setDetails] = useState([]);
  const [downloadflag, setDownloadflag] = useState(false);

  const [customerLogoName, setCustomerLogoName] = useState("");
  const [customerLogoData, setCustomerLogoData] = useState("");
  const [customerLogoUrl, setCustomerLogoUrl] = useState("");
  const [customerLogoPosX, setCustomerLogoPosX] = useState(0);
  const [customerLogoPosY, setCustomerLogoPosY] = useState(0);
  const [customerLogoWidth, setCustomerLogoWidth] = useState(0);
  const [customerLogoHeight, setCustomerLogoHeight] = useState(0);

  const [fontFamily, setFontFamilyStyle] = useState("");
  const [fontColor, setFontColor] = useState("");
  const [cardDetails, setCardDetails] = useState([]);

  const stData = useSelector(state => state.reducer.jsonData);
  const imageData = useSelector(state => state.reducer.logo);

  useEffect(() => {
    if (stData) {
      
      
      setOptionImage(stData?.customizationData?.children[0]?.children[0]?.children[0]?.optionSelection?.overlayImage?.imageUrl);
      setDetails(stData?.customizationData?.children[0]?.children[0]?.children[1]?.children);
      setCustomerLogoData(stData?.customizationData?.children[0]?.children[0]?.children[2]);
    }
  },[stData]);
  
  useEffect(() => {
    const [fontFamilyData, fontColorData, cardContents ] = details;
    
    setFontFamilyStyle(fontFamilyData?.fontSelection?.family);
    setFontColor(fontColorData?.colorSelection?.value);
    setCardDetails(cardContents?.children);
    if (downloadflag) {
      console.log(stData?.orderId, stData?.quantity);
      setTimeout(onDownload(stData?.orderId, stData?.quantity), 2000);
    }
    setDownloadflag(!downloadflag);
  },[details]);

  useEffect(() => {
    if (customerLogoData) {
      if (customerLogoData?.children[0]?.image?.imageName) {
        setCustomerLogoName(customerLogoData?.children[0]?.image?.imageName);
        if (customerLogoName === imageData?.imageName) {
          setCustomerLogoUrl(imageData?.imageUrl);
          setCustomerLogoWidth(customerLogoData?.dimension?.width);
          setCustomerLogoHeight(customerLogoData?.dimension?.height);
          setCustomerLogoPosX(customerLogoData?.position?.x);
          setCustomerLogoPosY(customerLogoData?.position?.y);
        }else{
          setCustomerLogoUrl(null);
          setCustomerLogoWidth(0);
          setCustomerLogoHeight(0);
          setCustomerLogoPosX(0);
          setCustomerLogoPosY(0);
        }
      }
    }
      // setCustomerLogo();
  },[imageData]);
    
  const backgroundStyle = {
    // backgroundImage: "url('" + optionImage + "')",
    // backgroundSize: 'cover',
    // backgroundPosition: 'center',
    width: '101mm',
    height: '69mm',
    color: fontColor,
    fontFamily
  };
  const logoStyle = {
    // backgroundImage: "url('" + optionImage + "')",
    // backgroundSize: 'cover',
    // backgroundPosition: 'center',
    position: "absolute",
    width: customerLogoWidth * 0.49 + "px",
    height: customerLogoWidth * 0.7 + "px",
    top: customerLogoPosY * 1.4 + "px",
    left: customerLogoPosX * 1.1 + "px",
    color: fontColor,
    fontFamily
  };

  const bleedline = {
    position: "absolute",
    top: "19px",
    left: "21px",
    width: "336px",
    height: "222px",
    backgroundColor: "transparent",
    border: "1px solid blue",
  }
  const trimline = {
    position: "absolute",
    top: "26.5px",
    left: "28.5px",
    width: "321px",
    height: "208px",
    backgroundColor: "transparent",
    border: "1px solid orange",
  }

  return (
    <div
      className="downloads scrollable"
      role="navigation"
    >
      <div className="business-card" id="businessCard"  style={backgroundStyle} >
        <div className="business-card-bg">
          <img src={optionImage} alt="" crossOrigin="anonymous" />
        </div>
        {
          customerLogoUrl &&
            <img src={customerLogoUrl} alt="" style={logoStyle} crossOrigin="anonymous" />
        }
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
        {/* <div style={bleedline}></div> */}
        {/* <div style={trimline}></div> */}
      </div>
    </div>
  )
}

export default Downloads;
