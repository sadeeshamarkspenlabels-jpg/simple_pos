"use client";
import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

export default function Barcode({ id }) {
  const svgRef = useRef(null);

   useEffect(() => {
    if (svgRef.current) {
      JsBarcode(svgRef.current, id, {
        format: "CODE128",
        displayValue: true,     // show text under barcode
        width: 1.2,              // thickness of each bar (default: 2)
        height: 30,            // height of the barcode (default: 100)
        fontSize: 15,          // size of the text below (default: 20)
        margin: 10,            // space around the barcode
      });
    }
  }, [id]);

  return <svg ref={svgRef}></svg>;
}
