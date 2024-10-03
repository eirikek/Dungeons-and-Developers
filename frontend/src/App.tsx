import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import DungeonPage from './pages/dungeonPage/DungeonPage.tsx';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
});


function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/project2" element={<LoginPage />} />
          <Route path="/project2/dungeon" element={<DungeonPage />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
