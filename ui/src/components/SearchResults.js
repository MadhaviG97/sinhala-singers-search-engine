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
const Stars = styled.div`
  font-size: 1rem;
`;
const Forks = styled.div`
  font-size: 1rem;
`;
const Language = styled.div``;
const UpdatedAt = styled.div``;
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
              forks_count,
              stargazers_count,
              language,
              updated_at,
              full_name,
              id,
              description,
            } = r;
            let updatedAt = new Date(updated_at).toDateString();
            return (
              <Repo key={id}>
                <StyledLink
                  to={{
                    pathname: `/repository/${id}`,
                    state: { data: r, updatedAt: updatedAt },
                  }}
                >
                  {full_name}
                </StyledLink>
                {description && <Description>{r.description}</Description>}
                <Details>
                  <Stars>
                    <YearIcon />
                    {stargazers_count || 0}
                  </Stars>
                  <Forks>
                    <CategoryIcon />
                    {forks_count || 0}
                  </Forks>
                  
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
