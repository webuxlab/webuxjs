# Step 1 - Generate Self Signed Certificate

```bash
mkdir -p ./keycloak/conf/

keytool -genkeypair -storepass change-this-password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore ./keycloak/conf/server.keystore
```

**Source**

- https://www.keycloak.org/server/enabletls
- https://www.keycloak.org/server/containers#_writing_your_optimized_keycloak_dockerfile _(Self signed certificate)_

# Step 2 - Download Discord Provider (Optional)

```bash
mkdir -p ~/keycloak/providers

curl -L https://github.com/wadahiro/keycloak-discord/releases/download/v0.5.0/keycloak-discord-0.5.0.jar -o ~/keycloak/providers/keycloak-discord-0.5.0.jar
```

# Step 3 - Update the keycloak/docker-compose.yml

You should change all username and password.
Review the Ports as well.

# Step 4 - Deploy the Stack

```bash
pushd keycloak/
docker compose up -d
popd
```

# Step 5 - Access keycloak UI

Using the information you provided at Step 3, go to `https://localhost:8443`
it will warn you about the self signed certificate, you can allow it.

Open the administrative console and login.

# Step 6 - Create a Realm

1. Click on `Master` at the top left. Then choose `Create Realm`.
2. In this example the realm identifier will be: `Studiowebux`.
3. Select the newly created realm to do the following step.
4. Navigate to `https://localhost:8443/admin/master/console/#/studiowebux/realm-settings/login`
5. Enable the `user registration` and `Forgot password`

# Step 7 - Create a client for the NodeJS Application

1. Click `Clients`
2. Click `Create Client`
3. I will use `nodejs` as the `client id`
4. Enable `Client Authentication` and `Authorization`
5. For the `Authentication flow`, check `Standard flow` and `Direct access grants`
6. For the `Root URL`, `Home URL`, enter: `http://localhost:3000`
7. For the `Valid redirect URIs`, enter: `http://localhost:3000/auth/callback`
8. For the `Valid post logout redirect URIs`, enter: `http://localhost:3000/auth/logout/callback`
9. For the `Web origins`, enter `http://localhost:3000` as it will serve the HTML pages as well.

# Step 8 - Add Github Identity Provider

**Keycloak:**

1. Click `Identity providers`
2. Select `Github`
3. The `Redirect URI` must be copied to the **_step 5_** in the **Github** section.
4. Enable the `Enable Device Flow`
5. Click `Register application`

**Github:**

1. Navigate to `github` > `Settings` > `Developer settings` > `OAuth Apps` (https://github.com/settings/developers)
2. Click `New OAuth App`
3. For the `Application name`, enter: `keycloak`
4. For the `Homepage URL`, enter: `http://localhost:3000`
5. For the `Authorization callback URL`, paste the **Redirect URI** from the **keycloak** step.

**Keycloak:**

1. Copy the `Client Id` from **Github** to the `Client Id` in **keycloak**
2. Click `Generate a new client secret` on **Github** and copy the value to the `client secret` in **keycloak**

# Step 9 - Add Discord Authentication

**Keycloak:**

1. Click `Identity providers`
2. Select `Discord`
3. The `Redirect URI` must be copied to the **_step 4_** in the **Discord** section.

**Discord:**

1. Navigate to `https://discord.com/developers/applications/`
2. Create an `application`
3. Click `OAuth2`
4. Set the `redirects`, copy the value from `Redirect URI` in **Keycloak**

**Keycloak:**

1. Copy the `Client id` from **Discord** to `Client ID` in **Keycloak**
2. Copy the `Client secret` from **Discord** (_you might have to click `Reset Secret`_) to `Client ID` in **Keycloak**

# Step 10 - Setting up the nodejs application

**Getting Started:**

```bash
cd nodejs

npm install
npm run start
```

Go to : `http://localhost:3000`
Click on every button !

**Initial setup:**

```bash
pushd nodejs/

npm install --save \
    express \
    openid-client \
    passport \
    express-session

npm install --save-dev \
    nodemon \
    dotenv \
    dotenv-cli \
    eslint \
    prettier \
    eslint-config-prettier \
    eslint-plugin-prettier

cat package.json \
    | jq -r '. + {
        "type": "module",
        "scripts": {
            "start": "dotenv -c - npx nodemon"
        }
    }' | tee package.json

cat <<EOF > nodemon.json
{
  "watch": ["src", ".env"],
  "ext": ".js",
  "ignore": [],
  "exec": "node ./src/index.js"
}
EOF

cat <<EOF > .eslintignore
node_modules
dist
EOF

cat <<EOF > .gitignore
node_modules
EOF

cat <<EOF > .prettierrc
{
  "semi": true,
  "trailingComma": "none",
  "singleQuote": true,
  "printWidth": 80
}
EOF

mkdir src/
touch src/index.js
touch .env
```

**Setup the .env file**

```dotenv
NODE_ENV="development"

KEYCLOAK_ISSUER=""
KEYCLOAK_CLIENT_ID=""
KEYCLOAK_CLIENT_SECRET=""
KEYCLOAK_REDIRECT_URIS=""
KEYCLOAK_LOGOUT_REDIRECT_URIS=""
KEYCLOAK_RESPONSE_TYPES=""

EXPRESS_SESSION_SECRET=""

EXPRESS_PORT=3000
EXPORT_HOSTNAME=0.0.0.0

NODE_TLS_REJECT_UNAUTHORIZED=0
```

# Errors and Solutions

```text
Error: did not find expected authorization request details in session, req.session["oidc:localhost"] is undefined
```

Set the `NODE_ENV="development"` and restart the server. Go to `http://localhost:3000` and it should be back on !

---

# Redis

```bash
docker run --name redis-session -p 6379:6379 -v $(pwd)/tmp/redis:/data -d redis redis-server --save 60 1 --loglevel warning
```

**List all keys**

```bash
scan 0
```

# Enable Groups and Permissions in Keycloak

To enable the **group** support in keycloak, navigate to : `https://localhost:8443/admin/master/console/#/studiowebux/clients/c1988e8a-49e1-40e5-93b9-0eda321b8dc8/clientScopes`
which is: Clients -> nodejs -> Client Scopes -> microprofile-jwt -> Default
Sign out (from your custom application) and log back in.

To create a group, navigate to Groups, create a new one (name it : `Administrator`), then add your user(s) in sign out and sign in to reload the claims.
Then go to Realm Roles, Click Create Role and name it the same `Administrator`, then back to the created group, we need to assign it to the role.

For authorization, you need to go in the nodejs client, click authorization, then resources. You see that by default everything is allowed.
