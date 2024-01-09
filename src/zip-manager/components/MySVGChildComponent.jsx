import React from 'react';

const MySVGChildComponent = ({cardDetail}) => {
    let inputValue = cardDetail?.children[0]?.children[0]?.inputValue;
    let height = cardDetail?.dimension?.height;
    let width = cardDetail?.dimension?.width;
    let posX = cardDetail?.position?.x;
    let posY = cardDetail?.position?.y;

  return (
    <>
        <div style={{position:"absolute", top:posY, left:posX, width, fontSize: (height/2 + "px")}}>{inputValue}</div>
    </>
  );
}

export default MySVGChildComponent;