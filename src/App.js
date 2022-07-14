import React, { useCallback, useEffect, useState } from "react";

import "./dependencies";
import * as icn3d from "icn3d/module";

import "./App.css";
import Track from "./Track";

const defaultResidue = 500;
const defaultID = "P38398";

const buttonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "15px 15px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "15px",
};

const data = [
    { type: "Exons", data: [1, 100] },
    { type: "Exons", data: [120, 250] },
    { type: "Exons", data: [310, 550] },
    { type: "Exons", data: [600, 1863] },
    {
        type: "gnomAD missense",
        data: Array.from({ length: 15 }, () =>
            Math.floor(Math.random() * 1860)
        ),
    },
    {
        type: "ClinVar variants",
        data: Array.from({ length: 15 }, () =>
            Math.floor(Math.random() * 1860)
        ),
    },
    {
        type: "gnomAD LoF",
        data: Array.from({ length: 15 }, () =>
            Math.floor(Math.random() * 1860)
        ),
    },
    { type: "Domains and annotations", data: [1, 1500] },
    { type: "Domains and annotations", data: [1600, 1863] },
];

function App() {
    const icn3dui = React.useRef();
    const [isStructureVisible, setIsStructureVisible] = useState(false);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        if (isStructureVisible) {
            const cfg = {
                divid: "icn3d-viewer",
                width: "35%",
                height: "60%",
                resize: true,
                rotate: "right",
                showmenu: false,
                showcommand: false,
                showtitle: false,
                closepopup: true,
                command: `select :${defaultResidue}; style proteins sphere; color ff0000; clear all; close popup;`,
            };
            cfg["afid"] = defaultID;
            icn3dui.current = new icn3d.iCn3DUI(cfg);
            icn3dui.current.show3DStructure();
            icn3dui.current.icn3d.applyCommandCls.applyCommand("close popup");
        }
    }, [isStructureVisible]);

    const onClickFunction = useCallback(
        (values, colour, id) => {
            icn3dui.current.icn3d.selByCommCls.selectByCommand(
                `select :${values.join(" or :")}`
            );
            if (!selected.includes(id)) {
                icn3dui.current.icn3d.setOptionCls.setStyle(
                    "proteins",
                    "sphere"
                );
                icn3dui.current.icn3d.setOptionCls.setOption("color", colour);
                setSelected([...selected, id]);
            } else {
                icn3dui.current.icn3d.setOptionCls.setStyle(
                    "proteins",
                    "ribbon"
                );
                icn3dui.current.icn3d.setOptionCls.setOption(
                    "color",
                    "confidence"
                );
                icn3dui.current.icn3d.applyCommandCls.applyCommand(
                    "close popup"
                );
                setSelected(selected.filter((item) => item !== id));
            }

            icn3dui.current.icn3d.applyCommandCls.applyCommand("clear all");
            icn3dui.current.icn3d.hlUpdateCls.clearHighlight();
        },
        [selected]
    );

    return (
        <div style={{ margin: 20, marginRight: 20 }}>
            <h3> THIS IS SEQR</h3>
            <h3> More Seqr Things here</h3>
            <h4> Gene of interest: BRCA1</h4>
            <h4> Variant at Residue: 500</h4>
            <button style={buttonStyle}> Show Reads (placeholder)</button>{" "}
            <button
                style={buttonStyle}
                onClick={() => setIsStructureVisible(!isStructureVisible)}
            >
                {isStructureVisible ? "Hide Structure" : "Show Structure"}
            </button>
            {isStructureVisible && (
                <div>
                    <br />
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "35% 65%",
                            gridGap: 20,
                        }}
                    >
                        <div id="icn3d-viewer" style={{ position: "inline" }} />
                        <Track
                            data={data}
                            onClickFunction={onClickFunction}
                            selected={selected}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
