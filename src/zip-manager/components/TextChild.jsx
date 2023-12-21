import React, { useState, useEffect, useRef, useMemo } from 'react';
import WebFont from 'webfontloader';
import { Document, Page, Text,Image, View, StyleSheet, PDFViewer , Font } from '@react-pdf/renderer';
import "./styles/Downloads.css";

const TextChild = ({ cardDetail, fontColor, fontFamily }) => {

    let inputValue = cardDetail?.children[0]?.children[0]?.inputValue;
    let height = cardDetail?.dimension?.height;
    let width = cardDetail?.dimension?.width;
    let posX = cardDetail?.position?.x;
    let posY = cardDetail?.position?.y;

    const [fontSize, setFontSize] = useState(10);

    // Create a ref to access the DOM element for measurements
    const cardRef = useRef(null);

    const resolution = 0.6

    useEffect(() => {
        console.log(width, height, inputValue.length);
        if (inputValue.length > 20) {
            setFontSize(10);
        }else{
            const tfontsize = Math.round( width / inputValue.length);
            console.log(tfontsize, '====')
            if (tfontsize > 15) {
                setFontSize(20);
            }else{
                setFontSize(tfontsize * 1.2);
            }
        }
       
    }, [inputValue, width, height]); 

    const cardDetailStyle = {
        width: "151px",
        textAlign: 'center',
        color: fontColor,
        fontSize: fontSize + "px",
        fontFamily: 'Courier', // Or any monospaced font
        fontStyle: "Bold",
    };

    if (inputValue.length > 1) {
        return (
            <Text style={cardDetailStyle}>
                {inputValue}
            </Text>
        );
    } else {
        return false;
    }
}

export default TextChild;
