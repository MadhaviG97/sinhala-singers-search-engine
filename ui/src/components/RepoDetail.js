import React from "react";
import styled, { css } from "styled-components";
import { DivFlexCenter } from "../globals/styles";
import { BiArrowBack } from "react-icons/bi";

import {
  FaBirthdayCake as BirthdayIcon
} from "react-icons/fa";

import { GiMusicSpell } from "react-icons/gi";

import {
  useLocation,
  useHistory,
  withRouter,
  Redirect,
} from "react-router-dom";

const Container = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0;
    margin: 0;
  `}
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

const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  padding: 2rem;
  margin: auto;
  gap: 1rem;
  width: 75%;
`;

const NameLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  font-size: 1.25rem;
  text-decoration: none;
  color: #19886B;

  &:hover {
    color: green
  }
`;

const DetailMed = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  font-size: 1rem;
`;

const Detail = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  font-size: 1rem;
`;

const Buttons = styled(DivFlexCenter)``;

const BackButton = styled.div`
  ${({ theme }) => css`
    width: 10rem;
    border: 2px solid ${theme.colors.secondary};
    border-radius: 10px;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: ${theme.colors.secondary};

    &:hover {
      background-color: ${theme.colors.tertiary};
    }
  `}
`;

function RepoDetail() {
  const location = useLocation();
  const history = useHistory();

  if (!location.state) {
    return <Redirect to="/error" />;
  }
  const { data } = location.state;
  const {
    name,
    genres,
    birth,
    summary
  } = data;
  return (
    <Container>
      <Header> Singer Details:</Header>
      <Section>
        <NameLink>
          Name: {name}
        </NameLink>
        <Detail>
          <BirthdayIcon />
          {birth}
        </Detail>
        <DetailMed>About: {summary}</DetailMed>
        {
          genres.map(
            (k) => (
                <Detail>
                  <GiMusicSpell />
                  {k || "n/a"}
                </Detail>
            )
          )
        }
        
       
      </Section>
      <Buttons>
        <BackButton
          onClick={() => {
            history.goBack();
          }}
        >
          <BiArrowBack />
          Back to Results
        </BackButton>
      </Buttons>
    </Container>
  );
}

export default withRouter(RepoDetail);
