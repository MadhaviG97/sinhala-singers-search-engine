import React from "react";
import styled from "styled-components";
import { withRouter, Link } from "react-router-dom";
import { FaBirthdayCake as BirthdayIcon } from "react-icons/fa";
import { GiMusicSpell } from "react-icons/gi";

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

function SearchResults({ data }) {
  return (
    <Results>
      <List>
        {(data?.items || []).map(
          (r) => {
            const {
              name,
              genres,
              birth,
              summary
            } = r;
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
                    <BirthdayIcon />
                    {birth || 0}
                  </YearComponent>
                  {
                    genres.map(
                      (k) => (
                          <GenresComponent key={k}>
                            <GiMusicSpell />
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
