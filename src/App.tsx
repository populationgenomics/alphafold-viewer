import Viewer from "./viewer";
import React, { useState } from "react";

interface searchResultsHits {
    entrezgeneID: string;
    symbol: string;
    score: number;
    _id: string;
    name: string;
    uniprot: string;
}

function App() {
    const [url, setUrl] = useState("");
    const [searchResults, setSearchResults] = useState<
        searchResultsHits[] | null
    >(null);

    const clear = () => {
        setUrl("");
    };

    const submitUrl = (uniprot: string) => {
        setUrl(
            "https://alphafold.ebi.ac.uk/files/AF-" +
                uniprot +
                "-F1-model_v1.cif"
        );
        // event.preventDefault();
        // const form = event.currentTarget;
        // const formElements = form.elements as typeof form.elements & {
        //     url: { value: string };
        // };
        // setUrl(formElements.url.value);
    };

    async function seek(symbol: string) {
        try {
            let res = await fetch(
                "http://rest.genenames.org/fetch/symbol/" + symbol,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );
            let data = await res.json();
            return await data.response.docs["0"].uniprot_ids[0];
        } catch (error) {
            return null;
        }
    }

    const handleSearch = async (
        event: React.SyntheticEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formElements = form.elements as typeof form.elements & {
            searchTerm: { value: string };
        };
        const response = await fetch(
            `https://mygene.info/v3/query?q=${formElements.searchTerm.value}&fields=symbol%2C%20name%2C%20entrezgene&species=human&size=10&entrezonly=true`
        );
        const data = await response.json();
        const hits: searchResultsHits[] = data.hits;
        const validHits: searchResultsHits[] = await Promise.all(
            hits.map(async function (item) {
                let id = await seek(item.symbol);
                return { ...item, uniprot: id };
            })
        );
        setSearchResults(validHits.filter((item) => item.uniprot));
    };

    return (
        <>
            <h1>AlphaFold Protein Viewer</h1>
            <form onSubmit={handleSearch}>
                <label>
                    Search protein or gene:
                    <input type="text" id="searchTerm" style={{ width: 600 }} />
                </label>
                <input type="submit" />
            </form>
            <br />
            <div>
                {searchResults &&
                    searchResults.map((item) => (
                        <>
                            <button
                                onClick={() => submitUrl(item.uniprot)}
                                disabled={url !== ""}
                            >
                                {item.name} <br /> {item.symbol} <br />
                                {item.uniprot}
                            </button>
                            <br />
                        </>
                    ))}
                {searchResults && (
                    <button onClick={clear} disabled={!url}>
                        Clear
                    </button>
                )}
            </div>
            <div>{url && <Viewer left={250} top={250} url={url}></Viewer>}</div>
        </>
    );
}

export default App;
