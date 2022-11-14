import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Amplify, Auth } from "aws-amplify";
import awsExports from "./aws-exports";

Amplify.configure({
  ...awsExports,
  ...{
    API: {
      endpoints: [
        {
          name: "apprunner-api",
          endpoint:
            process.env.REACT_APP_APPRUNNER_API || "http://localhost:8080",
          custom_header: async () => {
            return {
              Authorization: `${(await Auth.currentSession())
                .getAccessToken()
                .getJwtToken()}`,
            };
          },
        },
      ],
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
