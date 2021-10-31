import React from "react";
import styled from "styled-components";
import { withRouter, Link } from "react-router-dom";
import { GiCalendarHalfYear as YearIcon } from "react-icons/gi";
import {BiCategory as CategoryIcon} from "react-icons/bi";

const Results = styled.div`
  display: flex;
  flex-direction: column;
`;

const List = styled.div``;

const StyledLink = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  color: #0d4436;

  &:hover {
    text-decoration: underline;
  }
`;
const Repo = styled.div`
  padding: 1rem 0 .5rem 0;
  border-bottom: 1px solid black;
`;

const Description = styled.div`
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const YearComponent = styled.div`
  font-size: 1rem;
`;
const GenresComponent = styled.div`
  font-size: 1rem;
`;
const Details = styled.div`
  font-size: 1rem;
  display: flex;
  gap: 1rem;
  line-height: 2.5rem;
`;

function SearchResults({ filteredResults, data }) {
  return (
    <Results>
      <List>
        {(filteredResults ? filteredResults?.items : data?.items || []).map(
          (r) => {
            const {
              name,
              genres,
              birth,
              summary
            } = r;
            // let updatedAt = new Date(updated_at).toDateString();
            return (
              <Repo key={name}>
                <StyledLink
                  to={{
                    pathname: "/repository/"+name,
                    state: { data: r },
                  }}
                >
                  {name}
                </StyledLink>
                <Description>{summary || ""}</Description>
                <Details>
                  <YearComponent>
                    <YearIcon />
                    {birth || 0}
                  </YearComponent>
                  {
                    
                    genres.map(
                      (k) => (
                          <GenresComponent key={k}>
                            <CategoryIcon />
                            {k || 0}
                          </GenresComponent>
                      )
                    )
                  }
                </Details>
              </Repo>
            );
          }
        )}
      </List>
    </Results>
  );
}

export default withRouter(SearchResults);
