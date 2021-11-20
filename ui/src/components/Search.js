import React, { useState, useEffect } from "react";
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
import Slider from '@mui/material/Slider';

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
    
    font-size: 1.5rem;
    color: ${theme.colors.primary};
  `}
`;

const ResultsWrapper = styled.div`
  display: flex;
  justify-content: center;
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

const NoResult = styled.div`
  ${({ theme }) => css`
    font-weight: 500;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: left;
  `}
`;

const Suggesion = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 1.1rem;
    color: ${theme.colors.secondary};
    cursor: pointer;

    &:hover {
      border-radius: 10px;
      padding: 0.25rem;
      border: 1px solid ${theme.colors.secondary};
    }
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
  align-items: center;   
  gap: 1rem;

  @media screen and (max-width: 800px) {
    gap: 0;
    justify-content: space-between;
  }
`;

const RangeSelector = styled.div`
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
  let start = new URLSearchParams(location.search).get("start");
  let end = new URLSearchParams(location.search).get("end");
  let pageNo = parseInt(new URLSearchParams(location.search).get("page"));
  let history = useHistory();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(pageNo ? pageNo : 1);
  const [genres, setGenres] = useState([]);
  const [input, setInput] = useState(q);
  const [params, setParams] = useState({genre: currentGenre, start: start, end: end, page: pageNo ? pageNo : 1});
  const [selectedFilter, setSelectedFilter] = useState(currentGenre ? currentGenre : "");

  useEffect(() => {
      const queryTerm = encodeURIComponent(q);

      let url = `http://127.0.0.1:5000/search/${queryTerm}?`;
      if (currentGenre !== undefined && currentGenre !== null && currentGenre !== "සියල්ල"){
        url = url.concat(`&genre=${currentGenre}`)
      }
      if (!isNaN(start) && start !== null){
        url = url.concat(`&start=${start}`)
      }
      if (!isNaN(end) && end !== null){
        url = url.concat(`&end=${end}`)
      }
      if (!isNaN(pageNo) && pageNo !== null){
        url = url.concat(`&page=${pageNo}`)
      } else {
        url = url.concat(`&page=${1}`)
      }

      console.log("url", url);

      fetch(url)
        .then((response) => 
          response.json()
        )
        .then((data) => {
            setLoading(true);

            setData({
              totalCount: data?.totalCount,
              items: data?.documents,
              genres: data?.genres,
              suggest: data?.suggest
            });

            fetch("http://127.0.0.1:5000/genres")
            .then((response) => 
              response.json()
            )
            .then((data) => {
              var sortedLanguages = sortGenres(data);
              sortedLanguages.unshift({ label: "සියල්ල" });
              setGenres(sortedLanguages);
              setLoading(false);
            })
            .catch((error) => {
              console.log("error "+error);
              setLoading(false);
              setError(true);
            });
                 
        })
        .catch((error) => {
          console.log("error "+error);
          setLoading(false);
          setError(true);
        });

  }, [q, currentGenre, start, end, pageNo]);

  const handleSubmit = () => {
    setPage(1);
    routeChange(params);
  };

  const handleChange = (input) => {
    setInput(input);
  };

  const routeChange = (params) => {
    let path = `/search/${input}?`;
    if (data?.suggest !== ""){
      setInput(data?.suggest);
      path = `/search/${data?.suggest}?`;
    }
      
    if (data?.suggest === "" && data?.totalCount===0){
      setInput(input+"*");
      path = `/search/${input}*?`;
    }

    if (params?.genre !== undefined && params?.genre !== null)
      path = path + `&genre=${params?.genre}`;
    if (params?.start !== undefined)
      path = path + `&start=${params?.start}`;
    if (params?.end !== undefined)
      path = path + `&end=${params?.end}`;
    path = path + `&page=${params?.page ? params?.page : 1}`;
    
    history.push(path);
  };

  const handleGenreFilter = (value) => {    
    setParams({...params, genre: value});
    if (params?.start !== null && params?.end !== null)
      routeChange({genre: value, start: params?.start, end: params?.end, page: 1});
    else
      routeChange({genre: value, page: 1});
  };

  const handleSlider = (e) => {
    let value = e.target.value;
    setParams({...params, start: value[0], end: value[1]});
    if (params?.genre !== null)
      routeChange({start: value[0], end: value[1], genre: params?.genre, page: 1});
    else
      routeChange({start: value[0], end: value[1], page: 1});
  }

  const handlePagination = (direction) => {
    let offset = page * 20;
    let results = data?.totalCount || 0;

    if (direction === "prev" && page >= 2) {
      setPage(page - 1);
      routeChange({start: start, end: end, genre: currentGenre, page: page - 1});
    }
    if (direction === "next" && page > 0 && offset < results) {
      setPage(page + 1);
      routeChange({start: start, end: end, genre: currentGenre, page: page + 1});
    }
  };

  return (
    <Container id="Search">
      <Header>
        <IconLink to={`/`}>
          <GiLoveSong />
        </IconLink>
        
        <Dropdowns>
          <Dropdown
            onChange={handleGenreFilter}
            selected={selectedFilter}
            setSelected={setSelectedFilter}
            options={genres}
            label={"සංගීත ශෛලීය"}
          />
          <RangeSelector>
            <p>ක්‍රියාකාරී වසර: {params?.start ? params?.start : ""} සිට {params?.end ? params?.end : ""} දක්වා</p>
            <Slider
              getAriaLabel={() => 'Minimum distance'}
              defaultValue={[1900, 2030]}
              onChange={handleSlider}
              getAriaValueText={() => 'distance'}
              step={10}
              min={1900}
              max={2030}
              disableSwap
            />
          </RangeSelector>
        </Dropdowns>

        <SearchBar 
          placeholder="සොයන්න..." 
          onSubmit={handleSubmit} 
          value={q? q: input} 
          defaultValue={q}
          onInputChange={handleChange}
        />
        </Header>
      <ResultsWrapper>
        <List>
          {
            data?.totalCount===0 && data?.suggest !== "" && (
              <NoResult>
                <p>ඔබ අදහස් කලේ&nbsp; </p>
                  <Suggesion onClick={(e) => routeChange({start: start, end: end, genre: currentGenre, page: pageNo})}
                    >
                    {data?.suggest || q}
                  </Suggesion>
                &nbsp;{"ද?"}
                
              </NoResult>
            ) 
          }
          {
            data?.totalCount===0 && data?.suggest==="" && (
              <NoResult>
                <p>ඔබ අදහස් කලේ&nbsp; </p>
                  <Suggesion onClick={(e) => routeChange({start: start, end: end, genre: currentGenre, page: pageNo})}
                    >
                    {data?.suggest || q}{"*"}
                  </Suggesion>
                &nbsp;{"ද?"}
              </NoResult>
            )
          }
          {
            data?.totalCount!==0 && (
              <TotalResults>
                ප්‍රතිඵල ගණන -{" "}
                {data?.totalCount || 0}{" "}
                
              </TotalResults>
            )
          }
          {loading ? (
            <Loading>
              <Spinner color={`#cf9fff`} />
            </Loading>
          ) : data ? (
            <>
              
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
              <SearchResults data={data} />
            </>
          ) : null}
        </List>
      </ResultsWrapper>
      {error ? <Redirect to="/error" /> : null}
    </Container>
  );
}

export default withRouter(Search);
