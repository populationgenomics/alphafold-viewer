import PropTypes from "prop-types";
import { searchResultsHits } from "./searchResultsHits.interface";

function Searchbar(props: { setSearchResults: Function }) {
    async function seek(symbol: string) {
        try {
            let res = await fetch(
                "https://rest.genenames.org/fetch/symbol/" + symbol,
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
        props.setSearchResults(validHits.filter((item) => item.uniprot));
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
}

Searchbar.propTypes = {
    setSearchResults: PropTypes.func.isRequired,
};

export default Searchbar;
