import PropTypes from "prop-types";
import { searchResultsHits } from "./searchResultsHits.interface";

function SearchResults(props: {
    searchResults: searchResultsHits[];
    url: string;
    setUrl: Function;
}) {
    const buttonStyle = {
        display: "block",
        width: 300,
        padding: 10,
        marginBottom: 5,
    };
    return (
        <>
            {props.searchResults.map((item) => (
                <button
                    style={buttonStyle}
                    key={item._id}
                    onClick={() =>
                        props.setUrl(
                            "https://alphafold.ebi.ac.uk/files/AF-" +
                                item.uniprot +
                                "-F1-model_v1.cif"
                        )
                    }
                    disabled={props.url !== ""}
                >
                    {item.name} <br />
                    {item.symbol} <br />
                    {item.uniprot}
                </button>
            ))}
            <button
                key={"-1"}
                style={buttonStyle}
                onClick={() => props.setUrl("")}
                disabled={!props.url}
            >
                Clear
            </button>
        </>
    );
}

SearchResults.propTypes = {
    searchResults: PropTypes.array.isRequired,
    url: PropTypes.string.isRequired,
    setUrl: PropTypes.func.isRequired,
};

export default SearchResults;
