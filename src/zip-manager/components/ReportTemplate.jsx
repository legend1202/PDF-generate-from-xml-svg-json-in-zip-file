import React, {useEffect, useState, useMemo} from "react";

import { useSelector, useDispatch } from "react-redux";
import CardDetail from "./CardDetail";

const ReportTemplate = () => {
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
			width: '57mm',
			height: '57mm',
            position: "relative",
            overflow: "hidden",
            margin: "auto"
		},
        optionImage:{
            width: "57mm",
            height: "57mm",
        },
        blidsUp:{
            position: "absolute",
            width: "100%",
            top: "10mm",
            borderTop: "1px solid black"
        },
        blidsBottom:{
            position: "absolute",
            width: "100%",
            bottom: "10mm",
            borderBottom: "1px solid black"
        },
        blids:{
            width: "100%",
            display: "flex",
            justifyContent: "space-between"
        },
        blidsUpLeft:{
            backgroundColor: "black",
            border: "1px solid white",
            width: "2px",
            height: "2.93dmm",
            marginLeft: "4.5mm"
        },
        blidsUpRight:{
            backgroundColor: "black",
            border: "1px solid white",
            width: "2px",
            height: "2.93mm",
            marginRight: "4.5mm"
        },
        blidsHorizonUpLeft:{
            backgroundColor: "black",
            border: "1px solid white",
            width: "4.5mm",
            height: "2px",
            marginLeft: "0"
        },
        blidsHorizonUpRight:{
            backgroundColor: "black",
            border: "1px solid white",
            width: "4.5mm",
            height: "2px",
            marginRight: "0"
        },
        blidsHorizonBottomLeft:{
            backgroundColor: "black",
            border: "1px solid white",
            width: "4.5mm",
            height: "2px",
            marginLeft: "0"
        },
        blidsHorizonBottomRight:{
            backgroundColor: "black",
            border: "1px solid white",
            width: "4.5mm",
            height: "2px",
            marginRight: "0"
        },
        cardDetails:{
            // display: "none",
            position: "absolute",
            top: "0",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "54px 24px",
            color: fontColor,
            fontFamily
        }
	};

	return (
		<>
			<div style={styles.page} id="businessCard">
                {
                    optionImage && 
				        <img src={ optionImage } alt="" style={ styles.optionImage } />
                }
                <div style={ styles.blidsUp }>
                    <div style={styles.blids}>
                        <div style={styles.blidsUpLeft}></div>
                        <div style={styles.blidsUpRight}></div>
                    </div>
                    <div style={styles.blids}>
                        <div style={styles.blidsHorizonUpLeft}></div>
                        <div style={styles.blidsHorizonUpRight}></div>
                    </div>
                </div>
                <div style={ styles.blidsBottom }>
                    <div style={styles.blids}>
                        <div style={styles.blidsHorizonBottomLeft}></div>
                        <div style={styles.blidsHorizonBottomRight}></div>
                    </div>
                    <div style={styles.blids}>
                        <div style={styles.blidsUpLeft}></div>
                        <div style={styles.blidsUpRight}></div>
                    </div>
                </div>
                <div style={ styles.cardDetails }>
                {
                    cardDetails?.map(( cardDetail, key ) => 
                        <CardDetail cardDetail = {cardDetail} fontColor = {fontColor} fontFamily={fontFamily}  key= {key}/>
                    )
                }
                </div>
			</div>
		</>
	);
};

export default ReportTemplate;