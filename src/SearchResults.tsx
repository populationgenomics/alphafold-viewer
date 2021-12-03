import * as React from "react";

export interface SearchResultsHits {
    entrezgeneID: string;
    symbol: string;
    score: number;
    _id: string;
    name: string;
    uniprot?: {
        [key: string]: string;
    };
    uniprotKey: string;
}

interface SearchResultsProps {
    searchResults: SearchResultsHits[];
    url: string;
    setUrl: (url: string) => void;
}

const SearchResults: React.FunctionComponent<SearchResultsProps> = ({
    searchResults,
    url,
    setUrl,
}) => {
    const buttonStyle = {
        display: "block",
        width: 300,
        padding: 10,
        marginBottom: 5,
    };
    return (
        <>
            {searchResults.map((item) => (
                <button
                    style={buttonStyle}
                    key={item._id}
                    onClick={() =>
                        setUrl(
                            "https://alphafold.ebi.ac.uk/files/AF-" +
                                item.uniprotKey +
                                "-F1-model_v1.cif"
                        )
                    }
                    disabled={url !== ""}
                >
                    {item.name} <br />
                    {item.symbol} <br />
                    {item.uniprotKey}
                </button>
            ))}
            <button
                key={"-1"}
                style={buttonStyle}
                onClick={() => setUrl("")}
                disabled={!url}
            >
                Clear
            </button>
        </>
    );
};

export default SearchResults;
