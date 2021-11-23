import React, { useEffect } from "react";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { createPlugin } from "molstar/lib/mol-plugin-ui/index";
import "molstar/build/viewer/molstar.css";
import PropTypes from "prop-types";

function Viewer(props: { left: number; top: number; url: string }) {
    const parent = React.createRef<HTMLDivElement>();

    useEffect(() => {
        async function init() {
            let plugin: PluginContext | undefined = undefined;
            plugin = createPlugin(parent.current!);
            const data = await plugin.builders.data.download(
                { url: props.url },
                { state: { isGhost: true } }
            );
            const trajectory = await plugin.builders.structure.parseTrajectory(
                data,
                "mmcif"
            );
            await plugin.builders.structure.hierarchy.applyPreset(
                trajectory,
                "default"
            );
        }
        init();
    }, [props.url, parent]);

    return (
        <div
            ref={parent}
            style={{
                position: "absolute",
                height: 800,
                width: 1500,
                left: props.left,
                top: props.top,
            }}
        />
    );
}

Viewer.propTypes = {
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
};

export default Viewer;
