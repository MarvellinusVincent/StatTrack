import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Theme, Mixins } from '../styles';
const { colors } = Theme;

const Container = styled.div`
  ${Mixins.flexCenter};
  width: 100%;
  height: 90vh;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Circle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 5px solid ${colors.green};
  border-top-color: transparent;
  animation: ${rotate} 1s linear infinite;
`;

const Loader = () => (
  <Container>
    <Circle />
  </Container>
);

export default Loader;
