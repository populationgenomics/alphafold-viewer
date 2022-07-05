import React from "react";
import "./Visualisation-App.css";
// import molart from "molart";
import "molart/dist/molart.js";

function initializeTestDataSet(sequence: string, catName: string) {
    const ix1 = Math.floor(Math.random() * sequence.length);
    const ix2 = ix1 + Math.floor(Math.random() * (sequence.length - ix1));

    return {
        // sequence: sequence,
        features: [
            {
                type: "ACT_SITE",
                category: catName,
                begin: String(ix1),
                end: String(ix1),
                color: "#00F5B8",
            },
            {
                type: "MY_REGION",
                category: catName,
                begin: String(ix1),
                end: String(ix2),
                color: "#FF7094",
            },
        ],
    };
}

const VisualisationApp: React.FunctionComponent = () => {
    var MolArt = require("molart");

    const sequence =
        "MDVFMKGLSKAKEGVVAAAEKTKQGVAEAAGKTKEGVLYVGSKTKEGVVHGVATVAEKTKEQVTNVGGAVVTGVTAVAQKTVEGAGSIAAATGFVKKDQLGKNEEGAPQEGILEDMPVDPDNEAYEMPSEEGYQDYEPEA";
    const customDataSources = [
        {
            source: "RANDOM",
            useExtension: false,
            data: initializeTestDataSet(sequence, "MY_CATEGORY1"),
        },
        {
            source: "RANDOM",
            useExtension: false,
            data: initializeTestDataSet(sequence, "MY_CATEGORY2"),
        },
        // {
        //     source: "RANDOM",
        //     useExtension: true,
        //     url: "http://localhost/externalFeatures_",
        // },
    ];

    const test = new MolArt({
        uniprotId: "O00571",
        containerId: "pluginContainer",
        alwaysLoadPredicted: true,
        defaultStructureId: "AF-O00571-F1",
        customDataSources: customDataSources,
    });
    return <div>Test</div>;
    //! I hacked this by moving this div to index.html so it can found.
    // return <div id="pluginContainer"></div>;
};

export default VisualisationApp;
