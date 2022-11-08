var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const { CognitoJwtVerifier } = require("aws-jwt-verify");

var app = express();
const port = 8080;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Create the verifier outside your route handlers,
// so the cache is persisted and can be shared amongst them.
const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USERPOOL_ID,
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID,
  scope: "aws.cognito.signin.user.admin",
});

const message =
  "Unlock additional features with Amplify + App Runner like x, y, and z.";

app.get("/", async (req, res, next) => {
  try {
    // A valid JWT is expected in the HTTP header "authorization"
    // console.log(req.headers);
    await jwtVerifier.verify(req.header("authorization"));
  } catch (err) {
    console.error(err);
    return res.status(403).json({ statusCode: 403, message: "Forbidden" });
  }
  res.json({ message });
});

// Hydrate the JWT verifier, then start express.
// Hydrating the verifier makes sure the JWKS is loaded into the JWT verifier,
// so it can verify JWTs immediately without any latency.
// (Alternatively, just start express, the JWKS will be downloaded when the first JWT is being verified then)
jwtVerifier
  .hydrate()
  .catch((err) => {
    console.error(`Failed to hydrate JWT verifier: ${err}`);
    process.exit(1);
  })
  .then(() =>
    app.listen(port, () =>
      console.log(`
🚀 Server ready at: http://localhost:${port}`)
    )
  );
