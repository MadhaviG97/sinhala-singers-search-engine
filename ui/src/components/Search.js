import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import { Spinner } from "react-spinners-css";
import { withRouter, Link, useParams, Redirect , useHistory, useLocation} from "react-router-dom";
import { GiLoveSong } from "react-icons/gi";
import {
  GoChevronLeft as LeftIcon,
  GoChevronRight as RightIcon,
} from "react-icons/go";
import Dropdown from "./Dropdown";
import { sortGenres } from "../globals/utils";
import { DivFlexCenter } from "../globals/styles";


const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: left;
    justify-content: space-between;
    background-color: ${theme.colors.secondary};
    padding: 1rem;
    color: ${theme.colors.primary};
  `}
`;

const Icon = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    font-size: 1.25rem;
    padding: 0.25rem;
    color: ${theme.colors.secondary};
    cursor: pointer;

    &:hover {
      border-radius: 10px;
      padding: 0.25rem;
      border: 1px solid ${theme.colors.secondary};
    }
  `}
`;

const IconLink = styled(Link)`
  ${({ theme }) => css`
    text-decoration: none;
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    color: ${theme.colors.primary};
  `}
`;

const ResultsWrapper = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1rem;
  font-size: 0.8rem;
`;

const TotalResults = styled.div`
  ${({ theme }) => css`
    font-weight: 700;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: left;
  `}
`;
const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;

  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

const Loading = styled(DivFlexCenter)`
  height: 50vh;
  top: 25%;
  left: 50%;
`;

const Dropdowns = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  @media screen and (max-width: 800px) {
    gap: 0;
    justify-content: space-between;
  }
`;

const Pagination = styled(DivFlexCenter)`
  gap: 2rem;
  padding: 1rem;
  font-size: 0.8rem;
`;

function Search() {
  let { q } = useParams();
  let location = useLocation();  
  let currentGenre = new URLSearchParams(location.search).get("genre");
  let history = useHistory();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [genres, setGenres] = useState([]);
  const [filterActive, setFilterActive] = useState(false);
  const [input, setInput] = useState(q);
  const [params, setParams] = useState({genre: currentGenre, start: 0, end: 0});
  const [selectedFilter, setSelectedFilter] = useState(currentGenre);

  const fetchData = useCallback(
    ({ input, queryParams }) => {
      setLoading(true);
      const queryTerm = encodeURIComponent(input || q);

      let url = `http://127.0.0.1:5000/search/${queryTerm}?`;

      if (queryParams?.genre != ""){
        url = url.concat(`&genre=${queryParams?.genre}`)
      }
      if (queryParams?.start>1000 && queryParams?.end<2500){
        url = url.concat(`&start=${queryParams?.start}&end=${queryParams?.end}`)
      }

      console.log(url);

      fetch(url)
        .then((response) => 
          response.json()
        )
        .then((data) => {
          setData({
            totalCount: data?.totalCount,
            items: data?.documents,
            genres: data?.genres
          });
          setLoading(false);
        })
        .catch((error) => {
          alert("error "+error);
          setLoading(false);
          setError(true);
        });

      fetch("http://127.0.0.1:5000/genres")
        .then((response) => 
          response.json()
        )
        .then((data) => {
          var sortedLanguages = sortGenres(data);
          sortedLanguages.unshift({ label: "Any" });
          setGenres(sortedLanguages);
        })
        .catch((error) => {
          alert("error "+error);
          setLoading(false);
          setError(true);
        });
    },
    [page, params, input]
  );

  const handleSubmit = () => {
    setPage(1);
    routeChange(params);
  };

  const handleChange = (input) => {
    setInput(input);
  };

  const routeChange = (params) => {
    let path = `/search/${input}?`;
    console.log(params);
    if (params?.genre)
      path = path + `genre=${params?.genre}`;
    history.push(path);
  };

  const handleGenreFilter = (value) => {    
    setParams({...params, genre: value});
    routeChange({genre: value});
  };

  const handlePagination = (direction) => {
    let offset = page * 31;
    let results = data?.totalCount || 0;
    if (direction === "prev" && page >= 2) {
      setPage(page - 1);
    }
    if (direction === "next" && page > 0 && offset < results) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    fetchData({ input: q, queryParams: {"genre": currentGenre} });
  }, [q, currentGenre, page, fetchData]);

  return (
    <Container id="Search">
      <Header>
        <IconLink to={`/`}>
          <GiLoveSong />
        </IconLink>
        <SearchBar 
          placeholder="සොයන්න..." 
          onSubmit={handleSubmit} 
          value={q} 
          onInputChange={handleChange}
        />
      </Header>
      <ResultsWrapper>
        <Dropdowns>
            <Dropdown
              onChange={handleGenreFilter}
              selected={selectedFilter}
              setSelected={setSelectedFilter}
              // setFilterActive={setFilterActive}
              options={genres}
              label={"සංගීත ශෛලීය"}
            />
          </Dropdowns>
        <List>
          
          <TotalResults>
            ප්‍රතිඵල ගණන -{" "}
            {data?.totalCount || 0}{" "}
            
          </TotalResults>
          {loading ? (
            <Loading>
              <Spinner color={`#cf9fff`} />
            </Loading>
          ) : data ? (
            <>
              <SearchResults data={data} />
              <Pagination>
                <Icon onClick={() => handlePagination("prev")}>
                  <LeftIcon />
                  පෙර
                </Icon>
                පිටුව {page}
                <Icon onClick={() => handlePagination("next")}>
                පසු
                  <RightIcon />
                </Icon>
              </Pagination>
            </>
          ) : null}
        </List>
      </ResultsWrapper>
      {error ? <Redirect to="/error" /> : null}
    </Container>
  );
}

export default withRouter(Search);
