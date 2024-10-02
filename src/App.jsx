import AppRouters from './app/AppRouters';
import AuthRouters from './app/AuthRouters';

function App() {
    const login = false;
  return login ? <AuthRouters /> : <AppRouters />;
  
  
  
}

export default App;
