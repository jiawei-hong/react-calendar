import Calendar from "./components/Calendar";
import { IndexedDB, initDB } from './indexed-db';
import { DBConfig } from './DBConfig';

initDB(DBConfig);

function App() {
  return (
    <IndexedDB>
      <Calendar />
    </IndexedDB>
  );
}

export default App;
