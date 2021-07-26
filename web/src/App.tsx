import { createGlobalStyle } from 'styled-components';
import Routes from './routes';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    outline: 0;
  }

  body, input, button, textarea {
    font: 400 16px "Roboto", sans-serif;
  }
`;

function App() {
  return (
    <>
      <Routes />

      <GlobalStyle />
    </>
  );
}

export default App;
