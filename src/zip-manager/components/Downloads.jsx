import "./styles/Downloads.css";
import React, {useEffect, useState} from "react";

import { useSelector } from "react-redux";
import WebFont from 'webfontloader';
import * as zip from '@zip.js/zip.js';

import CardDetail from "./CardDetail";
import MySVGComponent from "./MySVGComponent";
import MySVGChildComponent from "./MySVGChildComponent";

const Downloads = ({onDownload, entries}) => {
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
  const [contentMarginTop, setContentMarginTop] = useState(0);

  const [fontFamily, setFontFamilyStyle] = useState("");
  const [fontColor, setFontColor] = useState("");
  const [cardDetails, setCardDetails] = useState([]);
  const [logoFlag, setLogoFlag] = useState(false);

  const stData = useSelector(state => state.reducer.jsonData);
  const imageData = useSelector(state => state.reducer.logo);
  const svgData = useSelector(state => state.reducer.svgData);

  const initAll = () =>{
    setOptionImage("");
    setDetails([]);
    setDownloadflag(false);

    setCustomerLogoName("");
    setCustomerLogoData("");
    setCustomerLogoUrl("");
    setCustomerLogoPosX(0);
    setCustomerLogoPosY(0);
    setCustomerLogoWidth(0);
    setCustomerLogoHeight(0);
    setContentMarginTop(0);
    setFontFamilyStyle("");
    setFontColor("");
    setCardDetails([]);
    setLogoFlag(false);
  }

  const autoDownload = () => {
    onDownload(stData?.orderId, stData?.quantity);
  }

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
    setContentMarginTop(cardContents?.children[0]?.position?.y);
    if (downloadflag) {
      setTimeout(initAll, 3000);
      setTimeout(autoDownload, 2000);
    }
    setDownloadflag(!downloadflag);
  },[details]);


  useEffect(() => {
    if (customerLogoData) {
      if (customerLogoData?.children[0]?.image?.imageName) {
        setCustomerLogoName(customerLogoData?.children[0]?.image?.imageName);
        entries.map(async (entry) => {
          if (entry.name == customerLogoName) {
            const checkJpgfile = entry.name.includes(".jpg");
            const checkPngfile = entry.name.includes(".png");
            if(checkJpgfile){
              const blob = await entry.getData(new zip.BlobWriter("image/jpeg"));
              const imageUrl = URL.createObjectURL(blob);
              setCustomerLogoUrl(imageUrl);
            }else if(checkPngfile){
              const blob = await entry.getData(new zip.BlobWriter("image/png"));
              const imageUrl = URL.createObjectURL(blob);
              setCustomerLogoUrl(imageUrl);
            }
            setCustomerLogoWidth(customerLogoData?.buyerPlacement?.dimension?.width * customerLogoData?.buyerPlacement?.scale?.scaleX);
            setCustomerLogoHeight(customerLogoData?.buyerPlacement?.dimension?.height * customerLogoData?.buyerPlacement?.scale?.scaleY);
            setCustomerLogoPosX(customerLogoData?.buyerPlacement?.position?.x);
            setCustomerLogoPosY(customerLogoData?.buyerPlacement?.position?.y);
            setLogoFlag(true);
          }
        })
        // imageData?.map((imageDataChild) => {
        //   if (customerLogoName === imageDataChild?.imageName) {
        //     setCustomerLogoUrl(imageDataChild?.imageUrl);
        //     setCustomerLogoWidth(customerLogoData?.buyerPlacement?.dimension?.width * customerLogoData?.buyerPlacement?.scale?.scaleX);
        //     setCustomerLogoHeight(customerLogoData?.buyerPlacement?.dimension?.height * customerLogoData?.buyerPlacement?.scale?.scaleY);
        //     setCustomerLogoPosX(customerLogoData?.buyerPlacement?.position?.x);
        //     setCustomerLogoPosY(customerLogoData?.buyerPlacement?.position?.y);
        //     setLogoFlag(true);
        //   }
        // })
      }
    }
      // setCustomerLogo();
  },[customerLogoData]);

  const style = {
    backgroundStyle:{
      width: '404px',
      height: '276px',
      color: fontColor,
      fontFamily
    },
    logoStyle:{
      position: "absolute",
      width: customerLogoWidth  + "px",
      height: customerLogoHeight  + "px",
      top: ((customerLogoPosY < 140)&&(customerLogoPosY != 108))?(customerLogoPosY + 51):((customerLogoPosY < 168) &&(customerLogoPosY > 108))?"168px":customerLogoPosY + "px",
      left: customerLogoPosX + "px",
      transform: 'translateX(-12%) translateY(-100%)'
    },
    cardDetails:{
      position: "absolute",
      left: "24px",
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
      padding: "54px 0px",
      paddingTop: (contentMarginTop - 51) + "px"
    }
  }
  return (
    <div
      className="downloads scrollable"
      role="navigation"
    >
      <div className="business-card" id="businessCard"  style={style.backgroundStyle} >
        <div className="business-card-bg">
          <img src={optionImage} alt="" crossOrigin="anonymous" />
        </div>
        {
            logoFlag && <img src={customerLogoUrl} alt="" style={style.logoStyle} crossOrigin="anonymous" />
        }
        <div style={style.cardDetails}>
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
