````markdown
# AWS Amplify Deployment Instructions

This guide provides instructions for deploying this Next.js application to AWS Amplify when direct GitLab integration isn't working.

## Option 1: Manual Deployment via ZIP Upload

1. Build your application locally:
   ```bash
   npm ci
   npm run build
   ```
````

2. Zip the build artifacts:

   ```bash
   zip -r build.zip .next node_modules package.json package-lock.json amplify.yml next.config.ts public
   ```

3. In the AWS Amplify Console:
   - Create a new app → Host web app
   - Select "Deploy without Git provider"
   - Upload the zip file
   - Amplify will use your `amplify.yml` for build configuration

## Option 2: Setup AWS Amplify CLI and Deploy

1. Install and configure the Amplify CLI:

   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

2. Initialize Amplify in your project:

   ```bash
   amplify init
   ```

3. Add hosting:

   ```bash
   amplify add hosting
   ```

   - Select "Hosting with Amplify Console"
   - Choose "Manual deployment"

4. Publish:

   ```bash
   amplify publish
   ```

## Option 3: Set Up a GitHub Mirror

1. Create a repository on GitHub

2. Add GitHub as a second remote:

   ```bash
   git remote add github https://github.com/your-username/repo-name.git
   ```

3. Push to GitHub:

   ```bash
   git push github main
   ```

4. Connect AWS Amplify to the GitHub repository

## Option 4: Configure GitLab CI/CD to Deploy to Amplify

Create a `.gitlab-ci.yml` file:

```yaml
stages:
  - deploy

deploy_to_amplify:
  stage: deploy
  image: node:latest
  script:
    - npm ci
    - npm run build
    - npm install -g @aws-amplify/cli
    - amplify --version
    - echo $AWS_ACCESS_KEY_ID > ~/.aws/credentials
    - echo $AWS_SECRET_ACCESS_KEY >> ~/.aws/credentials
    - amplify publish -y
  only:
    - main
```

Add AWS credentials as protected variables in your GitLab repository settings:

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION

## Notes on SSR with Amplify

Our configuration in `amplify.yml` specifies that AWS Amplify should handle this as an SSR application:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - "**/*"
  cache:
    paths:
      - node_modules/**/*
```

This setup preserves server-side rendering capabilities and API routes functionality.
