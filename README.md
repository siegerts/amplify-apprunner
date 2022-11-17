# amplify-apprunner

React frontend (with Amplify Auth & Storage) hosted on AWS Amplify that calls an Express API running on AWS App Runner. The user's JWT from Amplify Auth is passed with the API request and verified in the service using https://github.com/awslabs/aws-jwt-verify. The API service returns a simple "promo" message for the UI.

![](https://github.com/siegerts/amplify-apprunner/blob/main/amplify-ui-screenshot.png)

Both projects live in the same repo:

- The Amplify app is deployed via continuous CI/CD with GitHub on Amplify Hosting
- The App Runner service is deployed via AWS Copilot + Docker.

The [user's JWT from Amplify Auth](https://github.com/siegerts/amplify-apprunner/blob/main/src/index.js#L17) is passed with the API request and verified in the service using [aws-jwt-verify](https://github.com/awslabs/aws-jwt-verify).

```js
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
```

The API service returns a simple ["promo" message](https://github.com/siegerts/amplify-apprunner/blob/main/backend/src/index.js#L25) for the UI.

This pattern can be extended to access additional resources or [private services](https://aws.github.io/copilot-cli/blogs/release-v123/#app-runner-private-services) via the App Runner service.

## Deployment

### Frontend

The frontend can be deployed using Amplify Hosting continuous CI/CD from the repository. Use the API endpoint created to populate the Environment Variable `REACT_APP_APPRUNNER_API` in the Amplify Hosting console for the application.

### API Service

#### Environment Variables

Update the `COGNITO_USERPOOL_ID` and `COGNITO_CLIENT_ID` environment variables in `backend/copilot/api/manifest.yml`. These values should coincide with the AWS Cognito Auth resources created by Amplify, and redeploy.

```yaml
variables: # Pass environment variables as key value pairs.
  # LOG_LEVEL: info
  # Add in here or in AWS Console
  COGNITO_USERPOOL_ID: <value>
  COGNITO_CLIENT_ID: <value>
```

#### AWS Copilot

Once [AWS Copilot is installed](https://aws.github.io/copilot-cli/docs/overview/):

Change into the `backend` directory and deploy:

```
cd backend

copilot deploy
```

Once deployed, the service will be visible in the App Runner console.
