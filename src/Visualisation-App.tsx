import Viewer from "./viewer";
import { useState } from "react";
import { searchResultsHits } from "./searchResultsHits.interface";
import Searchbar from "./searchbar";
import SearchResults from "./searchResults";

function VisualisationApp() {
    const [url, setUrl] = useState("");
    const [searchResults, setSearchResults] = useState<
        searchResultsHits[] | null
    >(null);

    return (
        <>
            <h1>AlphaFold Protein Viewer</h1>
            <Searchbar setSearchResults={setSearchResults}></Searchbar>
            <br />
            <div>
                {searchResults && (
                    <SearchResults
                        searchResults={searchResults}
                        url={url}
                        setUrl={setUrl}
                    ></SearchResults>
                )}
            </div>
            <div>{url && <Viewer left={320} top={220} url={url}></Viewer>}</div>
        </>
    );
}

export default VisualisationApp;
