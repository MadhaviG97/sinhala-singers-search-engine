import React, {useState} from "react";
import styled, { css } from "styled-components";
import SearchBar from "./SearchBar";
import { GiMicrophone as Icon } from "react-icons/gi";
import { useHistory, withRouter } from "react-router-dom";
import { DivFlexCenter } from "../globals/styles";

const Container = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.colors.secondary};
    color: ${theme.colors.primary};
  `}
`;

const Wrapper = styled(DivFlexCenter)`
  height: 100vh;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled(DivFlexCenter)`
  ${({ theme }) => css`
    font-size: ${theme.fontSizes.title};
    gap: 1rem;
  `}
`;

function Landing() {
  const history = useHistory();
  const [input, setInput] = useState("");

  //Route to Search component on submit and update url params with input value
  const routeChange = () => {
    let path = `/search/${input}`;
    history.push(path);
  };

  const handleChange = (input) => {
    setInput(input);
  }

  return (
    <Container id="Filters">
      <Wrapper>
        <Title>
          <Icon />ශ්‍රී ලාංකික ගායක ගායිකාවන්
        </Title>
        <SearchBar 
          placeholder="සොයන්න..." 
          onSubmit={routeChange}
          onInputChange={handleChange}
        />
      </Wrapper>
    </Container>
  );
}

export default withRouter(Landing);
