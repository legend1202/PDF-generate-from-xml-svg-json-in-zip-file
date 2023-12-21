import { Document, Page, Text,Image, View, StyleSheet, PDFViewer , Font } from '@react-pdf/renderer';
import WebFont from 'webfontloader';

import React, {useEffect, useState, useMemo} from "react";

import { useSelector, useDispatch } from "react-redux";
import TextChild from './TextChild';

Font.register({
    family: "Josefin Sans",
    fonts: [
      { src: `./assets/fonts/JosefinSans-Medium.ttf`}
    ],
});

const MyDocument = () => {

    const [optionImage, setOptionImage] = useState("");
    const [details, setDetails] = useState([]);

    const [fontFamily, setFontFamilyStyle] = useState("");
    const [fontColor, setFontColor] = useState("");
    const [cardDetails, setCardDetails] = useState([]);
    const dispatch = useDispatch();

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
        dispatch({ type: "setFontFamily", data: fontFamilyData?.fontSelection?.family });
        dispatch({ type: "setCardDetails", data: cardContents?.children });
    },[details]);
    
    const styles = {
        page: {
            flexDirection: 'column'
        },
        section: {
            margin: 0,
            width: '252px',
            height: '167px',
            padding: "36px 12px",
            display: "flex",
            justifyContent: "space-between"
        },
        hborderUpLeft:{
            border: "1px solid white",
            position: "absolute",
            width: "1px",
            height: "5.6px",
            backgroundColor: "black",
            left: "12px",
            top: "0"
        },
        hborderUpRight:{
            border: "1px solid white",
            position: "absolute",
            width: "1px",
            height: "5.6px",
            backgroundColor: "black",
            right: "12px",
            top:"0"
        },
        vborderUpLeft:{
            border: "1px solid white",
            position: "absolute",
            height: "1px",
            width: "5.6px",
            backgroundColor: "black",
            left: "0",
            top: "12px"
        },
        vborderUpRight:{
            border: "1px solid white",
            position: "absolute",
            height: "1px",
            width: "5.6px",
            backgroundColor: "black",
            right: "0px",
            top:"12px"
        },
        hborderDownLeft:{
            border: "1px solid white",
            position: "absolute",
            width: "1px",
            height: "5.6px",
            backgroundColor: "black",
            left: "12px",
            bottom: "0"
        },
        hborderDownRight:{
            border: "1px solid white",
            position: "absolute",
            width: "1px",
            height: "5.6px",
            backgroundColor: "black",
            right: "12px",
            bottom:"0"
        },
        vborderDownLeft:{
            border: "1px solid white",
            position: "absolute",
            height: "1px",
            width: "5.6px",
            backgroundColor: "black",
            left: "0",
            bottom: "12px"
        },
        vborderDownRight:{
            border: "1px solid white",
            position: "absolute",
            height: "1px",
            width: "5.6px",
            backgroundColor: "black",
            right: "0px",
            bottom:"12px"
        },
        background: {
            position: 'absolute',
            width: '288px',
            height: '293px',
            bottom: "-63px",
            left: "-18px"
        },
        textfontColor:{
            color: fontColor
        },
        textfontFamily:{
            fontFamily: "Josefin Sans"
        }
    };
    return(
        <PDFViewer>
            <Document>
                <Page size={{ width: 252, height: 167 }} style={styles.page}  wrap={false}>
                    <Image src={optionImage} style={styles.background} />
                    <View style={styles.section}>
                    {
                        cardDetails?.map(( cardDetail, key ) => 
                            <TextChild cardDetail = {cardDetail} fontColor = {fontColor} fontFamily={fontFamily}  key= {key}/>
                        )
                    }

                        {/* <Text style={[styles.textfontColor, styles.textfontFamily]}>Section\n #1</Text> */}
                        {/* <img src="https://m.media-amazon.com/images/S/gestalt-seller-images-prod-eu-west-1/A1F83G8C2ARO7P/A20SF6L0IZKPBB/b16f5ac4-d093-4a1a-ae29-b770bf547866.jpg" alt="" crossOrigin="anonymous" /> */}
                    </View>
                    <View style={styles.hborderUpLeft} />
                    <View style={styles.hborderUpRight} />
                    <View style={styles.vborderUpLeft} />
                    <View style={styles.vborderUpRight} />

                    <View style={styles.hborderDownLeft} />
                    <View style={styles.hborderDownRight} />
                    <View style={styles.vborderDownLeft} />
                    <View style={styles.vborderDownRight} />
                </Page>
            </Document>
        </PDFViewer>
    )
}

export default MyDocument;