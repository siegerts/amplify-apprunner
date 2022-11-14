# amplify-apprunner

React Frontend (with Amplify Auth & Storage) that calls an Express API running on App Runner. The user's JWT from Amplify Auth is passed with the API request and verified in the service using https://github.com/awslabs/aws-jwt-verify. The API service returns a simple "promo" message for the UI.

Both projects live in the same repo:

- the Amplify app is deployed via continuous CI/CD with GitHub on Amplify Hosting
- the App Runner service is deployed via AWS Copilot + Docker.
