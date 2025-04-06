import styled from 'styled-components';
import Media from './Media';

const MainStyle = styled.main`
  width: 100%;
  margin: 0 auto;
  max-width: 1400px;
  min-height: 100vh;
  padding-left: 80px;
  padding-bottom: 80px;
  padding-right: 80px;
  ${Media.desktop`
    padding: 60px 50px;
  `};
  ${Media.tablet`
    padding: 50px 40px;
  `};
  ${Media.phablet`
    padding: 30px 25px;
  `};
  h2 {
    ${Media.tablet`
      text-align: center;
    `};
  }
`;

export default MainStyle;