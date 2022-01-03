import React from "react";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { setSubtreeVisibility } from "molstar/lib/mol-plugin/behavior/static/state";

interface LoadCustomOptionsProps {
    plugin: React.MutableRefObject<PluginContext | null>;
}

const LoadCustomOptions: React.FunctionComponent<LoadCustomOptionsProps> = ({
    plugin,
}) => {
    async function addAlphafoldColour() {
        try {
            const components =
                plugin.current!.managers.structure.hierarchy.current
                    .structures[0].components;
            if (!components) {
                alert("Error retrieving components");
                return;
            }

            //if alphafold view already exists
            for (const c of components) {
                if (c.cell.obj?.label === "AlphaFold") {
                    return;
                }
            }

            //hide all components
            for (const c of components) {
                setSubtreeVisibility(
                    plugin.current!.state.data,
                    c.cell.transform.ref,
                    true
                );
            }

            const structure =
                plugin.current!.managers.structure.hierarchy.current.models[0]
                    .structures[0].cell;

            if (!structure) {
                alert("Error retrieving structure");
                return;
            }

            const wholeComponent =
                await plugin.current!.builders.structure.tryCreateComponentStatic(
                    structure,
                    "all",
                    { label: "AlphaFold", tags: ["AlphaFoldInternal"] }
                );

            if (!wholeComponent) {
                alert("Error creating new component");
                return;
            }

            const update = plugin.current!.build();

            plugin.current!.builders.structure.representation.buildRepresentation(
                update,
                wholeComponent,
                {
                    type: "cartoon",
                    //@ts-ignore
                    color: "af-confidence",
                }
            );

            await update.commit();
        } catch (error) {
            console.log(error);
            alert(
                "An error occurred when adding the Alphafold confidence colours"
            );
            return;
        }
    }

    return (
        <>
            <button className="optionButtons" disabled>
                ClinVar LP/P Variants
            </button>
            <br />
            <button className="optionButtons" disabled>
                gnomad
            </button>
            <br />
            <button
                className="optionButtons"
                onClick={() => addAlphafoldColour()}
            >
                AlphaFold Confidence
            </button>
            <br />
            <button className="optionButtons" disabled>
                Custom Domains
            </button>
        </>
    );
};

export default LoadCustomOptions;
