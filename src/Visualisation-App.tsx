import React from "react";
import Viewer from "./Viewer";
import ViewerOptions from "./ViewerOptions";
import "./Visualisation-App.css";
import { useState } from "react";
import Searchbar from "./Searchbar";
import SearchResults from "./SearchResults";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { SearchResultsHits } from "./SearchResults";

const VisualisationApp: React.FunctionComponent = () => {
    const [url, setUrl] = useState("");
    // const url = "https://alphafold.ebi.ac.uk/files/AF-P04350-F1-model_v1.cif";
    const plugin =
        React.useRef<PluginContext | null>() as React.MutableRefObject<PluginContext | null>;

    const [searchResults, setSearchResults] = useState<
        SearchResultsHits[] | null
    >(null);

    return (
        <>
            <h1>AlphaFold Protein Viewer</h1>
            <div className="container">
                <div className="searchArea">
                    <Searchbar setSearchResults={setSearchResults}></Searchbar>
                </div>
                <div className="searchResults">
                    {searchResults && (
                        <>
                            <h4>Results</h4>
                            <SearchResults
                                searchResults={searchResults}
                                url={url}
                                setUrl={setUrl}
                            ></SearchResults>
                        </>
                    )}
                </div>
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
                            <button className="optionButtons">
                                ClinVar LP/P Variants
                            </button>
                            <br />
                            <button className="optionButtons">gnomad</button>
                            <br />
                            <button className="optionButtons">
                                AlphaFold Confidence
                            </button>
                            <br />
                            <button className="optionButtons">
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
