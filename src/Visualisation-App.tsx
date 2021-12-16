import React from "react";
import Viewer from "./Viewer";
import ViewerOptions from "./ViewerOptions";
import "./Visualisation-App.css";
import { useState } from "react";
import Searchbar from "./Searchbar";
import SearchResults from "./SearchResults";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { SearchResultsHits } from "./SearchResults";
import { setSubtreeVisibility } from "molstar/lib/mol-plugin/behavior/static/state";

const VisualisationApp: React.FunctionComponent = () => {
    const [url, setUrl] = useState("");
    // const url = "https://alphafold.ebi.ac.uk/files/AF-P04350-F1-model_v1.cif";
    const plugin =
        React.useRef<PluginContext | null>() as React.MutableRefObject<PluginContext | null>;

    const [searchResults, setSearchResults] = useState<
        SearchResultsHits[] | null
    >(null);

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
            <h1>AlphaFold Protein Viewer</h1>
            <div className="container">
                <div className="searchArea">
                    <Searchbar setSearchResults={setSearchResults}></Searchbar>
                </div>
                {searchResults && (
                    <div className="searchResults">
                        <h4>Results</h4>
                        <SearchResults
                            searchResults={searchResults}
                            url={url}
                            setUrl={setUrl}
                        ></SearchResults>
                    </div>
                )}
                {url && (
                    <>
                        <div className="molstarViewer">
                            <Viewer url={url} plugin={plugin}></Viewer>
                        </div>
                        <div className="molstarOptions">
                            <h4>Visualisation Options</h4>
                            <ViewerOptions plugin={plugin}></ViewerOptions>
                        </div>
                        <div className="molstarProteinToggles">
                            <h4>Load</h4>
                            {/* these buttons will be re-enabled when they are implemented */}
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
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default VisualisationApp;
