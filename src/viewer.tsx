import React, { useEffect } from "react";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { createPluginAsync } from "molstar/lib/mol-plugin-ui/index";
import "molstar/build/viewer/molstar.css";
import { DefaultPluginUISpec } from "molstar/lib/mol-plugin-ui/spec";
import { PluginSpec } from "molstar/lib/mol-plugin/spec";
// import { PluginConfig } from "molstar/lib/mol-plugin/config";
import AfConfidenceScore from "./af-confidence/behaviour";
// import { PluginLayoutControlsDisplay } from "molstar/lib/mol-plugin/layout";

interface ViewerProps {
    url: string;
    plugin: React.MutableRefObject<PluginContext | null>;
}

// TODO Fiddle with these settings later (changes UI)
// const viewerOptions = {
//     layoutIsExpanded: false,
//     layoutShowControls: true,
//     layoutShowRemoteState: false,
//     layoutControlsDisplay: "reactive" as PluginLayoutControlsDisplay,
//     layoutShowSequence: false,
//     layoutShowLog: false,
//     layoutShowLeftPanel: false,
//     disableAntialiasing: false,
//     pixelScale: 1,
//     enableWboit: false,
//     viewportShowExpand: true,
//     viewportShowSelectionMode: false,
//     viewportShowAnimation: false,
//     pdbProvider: "pdbe",
//     viewportShowControls: PluginConfig.Viewport.ShowControls.defaultValue,
//     viewportShowSettings: PluginConfig.Viewport.ShowSettings.defaultValue,
// };

const Viewer: React.FunctionComponent<ViewerProps> = ({ url, plugin }) => {
    const parent = React.createRef<HTMLDivElement>();
    const [initialized, setInitialized] = React.useState(false);

    useEffect(() => {
        async function init() {
            const defaultSpec = DefaultPluginUISpec(); // TODO: Make our own to select only essential plugins
            const spec: PluginSpec = {
                actions: defaultSpec.actions,
                // behaviors: defaultSpec.behaviors,
                behaviors: [
                    ...defaultSpec.behaviors,
                    PluginSpec.Behavior(AfConfidenceScore, {
                        //adds alphafold colouring as a colour scheme that the user can select
                        autoAttach: true,
                        showTooltip: true,
                    }),
                ],
                layout: defaultSpec.layout,
                config: [
                    // TODO: Fiddle with these settings later (changes UI)
                    // [
                    //     PluginConfig.General.DisableAntialiasing,
                    //     viewerOptions.disableAntialiasing,
                    // ],
                    // [PluginConfig.General.PixelScale, viewerOptions.pixelScale],
                    // [
                    //     PluginConfig.General.EnableWboit,
                    //     viewerOptions.enableWboit,
                    // ],
                    // [
                    //     PluginConfig.Viewport.ShowExpand,
                    //     viewerOptions.viewportShowExpand,
                    // ],
                    // [
                    //     PluginConfig.Viewport.ShowSelectionMode,
                    //     viewerOptions.viewportShowSelectionMode,
                    // ],
                    // [
                    //     PluginConfig.Download.DefaultPdbProvider,
                    //     viewerOptions.pdbProvider,
                    // ],
                    // [
                    //     PluginConfig.Structure
                    //         .DefaultRepresentationPresetParams,
                    //     {
                    //         theme: {
                    //             globalName: "af-confidence",
                    //             carbonByChainId: false,
                    //             focus: {
                    //                 name: "element-symbol",
                    //                 params: { carbonByChainId: false },
                    //             },
                    //         },
                    //     },
                    // ],
                ],
            };
            plugin.current = await createPluginAsync(parent.current!, spec);
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
