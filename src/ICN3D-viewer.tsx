import React, { useEffect } from "react";

import { iCn3DUI } from "./lib/icn3dui.js";

function ICN3DViewer() {
    useEffect(() => {
        const cfg = {
            divid: "test",
            width: 500,
            height: 500,
            mobilemenu: true,
            showcommand: false,
            showtitle: true,
            resize: true,
            rotate: "right",
            mmdbid: "1tup",
        };
        console.log(document.getElementById("test"));
        const icn3dui = new iCn3DUI(cfg);

        icn3dui.show3DStructure();
    }, []);

    return <div id="test"></div>;
}

export default ICN3DViewer;
