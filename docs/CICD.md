# CI/CD Documentation

## Overview

This project uses GitHub Actions for continuous integration and deployment. The CI/CD pipeline ensures code quality, runs comprehensive tests, and automates deployments.

## Workflow Files

### 1. Main CI/CD Pipeline (`ci.yml`)
**Triggers:** Push to `main`/`develop`, Pull requests
**Purpose:** Complete CI/CD pipeline with testing, linting, security checks, and build

**Jobs:**
- **test**: Runs tests across multiple Node.js versions (18.x, 20.x)
- **lint**: Code quality checks and linting
- **security**: Security vulnerability scanning
- **build**: Application build and artifact creation
- **notify**: Success/failure notifications

### 2. Test Suite (`test.yml`)
**Triggers:** Push to any branch, Pull requests
**Purpose:** Comprehensive testing with MongoDB service

**Features:**
- MongoDB service container for integration testing
- Multi-version Node.js testing (18.x, 20.x, 22.x)
- Test coverage reporting
- Artifact upload on failures

### 3. Pull Request Checks (`pr-check.yml`)
**Triggers:** Pull request events (opened, synchronize, reopened)
**Purpose:** Automated PR validation and feedback

**Features:**
- Automated test execution on PRs
- Success/failure comments on PRs
- Code quality checks
- Security vulnerability scanning

### 4. Deployment (`deploy.yml`)
**Triggers:** Successful main branch builds
**Purpose:** Automated staging and production deployments

**Stages:**
1. **Staging Deployment**: Automatic deployment to staging environment
2. **Production Deployment**: Manual approval required
3. **Rollback**: Automatic rollback on deployment failures

### 5. Status Checks (`status.yml`)
**Triggers:** Push to main, Scheduled (hourly)
**Purpose:** Application health monitoring and dependency checks

**Features:**
- Application startup validation
- Dependency security auditing
- Package integrity checks
- Scheduled health monitoring

### 6. Workflow Validation (`validate.yml`)
**Triggers:** Changes to workflow files
**Purpose:** Validate GitHub Actions workflow syntax and best practices

## Environment Variables

The following environment variables are used in the CI/CD pipeline:

### Required for Tests
- `NODE_ENV`: Set to `test` for test environments
- `JWT_SECRET`: JWT secret key for authentication testing
- `MONGO_URI`: MongoDB connection string (optional, uses in-memory DB by default)

### Required for Deployment
- `DEPLOYMENT_KEY`: SSH key for deployment servers
- `STAGING_HOST`: Staging server hostname
- `PRODUCTION_HOST`: Production server hostname

## Secrets Configuration

Configure the following secrets in your GitHub repository:

1. Go to Repository Settings → Secrets and variables → Actions
2. Add the following secrets:

```
JWT_SECRET_PROD=your-production-jwt-secret
MONGO_URI_PROD=your-production-mongodb-uri
DEPLOYMENT_KEY=your-ssh-private-key
STAGING_HOST=staging.your-domain.com
PRODUCTION_HOST=your-domain.com
```

## Branch Protection Rules

Recommended branch protection rules for `main` branch:

1. **Require pull request reviews before merging**
2. **Require status checks to pass before merging**
   - CI/CD Pipeline
   - Test Suite
   - Pull Request Checks
3. **Require branches to be up to date before merging**
4. **Require linear history**

## Local Development

### Running Tests Locally
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Validating Workflows Locally
```bash
# Install act (GitHub Actions local runner)
# macOS: brew install act
# Windows: choco install act-cli

# Run workflows locally
act push
act pull_request
```

## Deployment Process

### Staging Deployment
1. Code is pushed to `main` branch
2. CI/CD pipeline runs automatically
3. If all tests pass, deployment to staging occurs
4. Smoke tests run on staging environment
5. Success notification sent

### Production Deployment
1. Staging deployment must be successful
2. Manual approval required (GitHub Environment protection)
3. Production deployment executes
4. Health checks run on production
5. Success notification sent

### Rollback Process
1. Automatic rollback triggers on deployment failure
2. Previous version is restored
3. Health checks verify rollback success
4. Failure notification sent with rollback status

## Monitoring and Notifications

### Test Results
- Test artifacts uploaded on failures
- Coverage reports generated and stored
- Multi-version compatibility reports

### Deployment Status
- Real-time deployment status updates
- Success/failure notifications
- Rollback status reporting

### Security Monitoring
- Dependency vulnerability scanning
- Security audit reports
- Package integrity validation

## Troubleshooting

### Common Issues

1. **Test Failures**
   - Check test logs in Actions tab
   - Verify MongoDB connection in tests
   - Ensure environment variables are set correctly

2. **Deployment Failures**
   - Verify deployment secrets are configured
   - Check server connectivity
   - Review deployment logs

3. **Workflow Syntax Errors**
   - Use the workflow validation job
   - Check YAML syntax
   - Verify action versions are up to date

### Debug Commands
```bash
# Check workflow syntax locally
yamllint .github/workflows/*.yml

# Validate package.json
npm run test --dry-run

# Check for security vulnerabilities
npm audit
```

## Best Practices

1. **Keep workflows simple and focused**
2. **Use caching for dependencies**
3. **Implement proper error handling**
4. **Use environment-specific configurations**
5. **Monitor workflow execution times**
6. **Regular security updates for actions**
7. **Document all custom workflows**

## Contributing

When adding new workflows:

1. Follow the existing naming convention
2. Add proper documentation
3. Test workflows locally when possible
4. Update this documentation
5. Ensure proper error handling
6. Add appropriate status checks