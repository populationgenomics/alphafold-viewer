import React, { useEffect } from "react";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { createPluginAsync } from "molstar/lib/mol-plugin-ui/index";
import "molstar/build/viewer/molstar.css";

interface ViewerProps {
    url: string;
    plugin: React.MutableRefObject<PluginContext | null>;
}
const Viewer: React.FunctionComponent<ViewerProps> = ({ url, plugin }) => {
    const parent = React.createRef<HTMLDivElement>();
    const [initialized, setInitialized] = React.useState(false);

    useEffect(() => {
        async function init() {
            plugin.current = await createPluginAsync(parent.current!);
            setInitialized(true);
        }
        init();

        return () => {
            plugin.current?.dispose();
            plugin.current = null;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!initialized || !plugin.current) return;
        loadStructureFromData(url);
    }, [initialized, url]); // eslint-disable-line react-hooks/exhaustive-deps

    async function loadStructureFromData(url: string) {
        plugin.current!.clear();
        const _data = await plugin.current!.builders.data.download(
            { url: url },
            { state: { isGhost: true } }
        );

        const trajectory =
            await plugin.current!.builders.structure.parseTrajectory(
                _data,
                "mmcif"
            );
        await plugin.current?.builders.structure.hierarchy.applyPreset(
            trajectory,
            "default"
        );
    }

    return (
        <div
            ref={parent}
            style={{
                position: "absolute",
                height: 600,
                width: 1000,
                top: 228,
            }}
        />
    );
};

export default Viewer;
