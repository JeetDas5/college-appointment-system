# Simple CI/CD Setup

## Overview

This project uses a simplified GitHub Actions setup with just 3 essential workflows:

## Workflows

### 1. **Tests** (`test.yml`)
**Purpose:** Quick test validation on every push/PR
**Triggers:** Push to main/develop, Pull requests
**Features:**
- Single Node.js version (20.x)
- Fast test execution
- Simple pass/fail status

### 2. **CI/CD Pipeline** (`ci.yml`)
**Purpose:** Comprehensive testing and security checks
**Triggers:** Push to main/develop, Pull requests
**Features:**
- Multi-version Node.js testing (18.x, 20.x)
- Security vulnerability scanning
- Test failure artifact collection

### 3. **Deploy** (`deploy.yml`)
**Purpose:** Manual deployment to staging/production
**Triggers:** Manual workflow dispatch
**Features:**
- Choose deployment environment
- Creates deployment package
- Manual deployment control

## Usage

### Running Tests
Tests run automatically on every push and pull request. No configuration needed.

### Manual Deployment
1. Go to Actions tab in GitHub
2. Select "Deploy" workflow
3. Click "Run workflow"
4. Choose environment (staging/production)
5. Click "Run workflow" button

## Environment Variables

Set these in your repository secrets:

```
JWT_SECRET=your-production-jwt-secret
MONGO_URI=your-production-mongodb-uri
```

## Local Development

```bash
# Run tests locally
npm test

# Run tests with coverage
npm run test:coverage

# Start development server
npm start
```

## Benefits of This Setup

✅ **Simple** - Only 3 workflows, easy to understand
✅ **Fast** - Quick feedback on test results  
✅ **Reliable** - Minimal external dependencies
✅ **Secure** - Security scanning included
✅ **Flexible** - Manual deployment control
✅ **Maintainable** - Easy to modify and extend

## Extending the Setup

When you need more features, you can easily add:
- Automatic deployments
- Code coverage reporting
- Slack/email notifications
- Performance testing
- Docker builds

The current setup provides a solid foundation that can grow with your needs.