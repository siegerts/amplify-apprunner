import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Profile from "./Profile";

function App() {
  return (
    <div className="App">
      <Profile />
    </div>
  );
}

export default withAuthenticator(App);
