import * as React from "react";
import { SearchResultsHits } from "./SearchResults";

interface SearchBarProps {
    setSearchResults: (validHits: SearchResultsHits[]) => void;
}

const Searchbar: React.FunctionComponent<SearchBarProps> = ({
    setSearchResults,
}) => {
    const handleSearch = async (
        event: React.SyntheticEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formElements = form.elements as typeof form.elements & {
            searchTerm: { value: string };
        };
        const response = await fetch(
            `https://mygene.info/v3/query?q=${formElements.searchTerm.value}&fields=symbol%2C%20name%2C%20uniprot&species=human&size=10&entrezonly=true`
        );
        const data = await response.json();
        const hits: SearchResultsHits[] = data.hits;
        const validHits: SearchResultsHits[] = hits.map((item) => ({
            ...item,
            uniprotKey: item.uniprot?.["Swiss-Prot"]
                ? item.uniprot?.["Swiss-Prot"]
                : "",
        }));
        setSearchResults(validHits.filter((item) => item.uniprotKey));
    };

    return (
        <>
            <form onSubmit={handleSearch}>
                <label>
                    Search protein or gene:
                    <input type="text" id="searchTerm" style={{ width: 600 }} />
                </label>
                <input type="submit" />
            </form>
        </>
    );
};

export default Searchbar;
