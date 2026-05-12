<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Armed Eagle - Tactical Sweepstake Tracker

A military-grade sweepstake tracking and account management application with advanced security features including AES-256 encryption, multi-factor authentication, and comprehensive audit logging.

## Features

- **Supabase Authentication**: Secure user registration and login
- **Multi-Factor Authentication (MFA)**: TOTP (Authenticator App) and SMS verification
- **AES-256 Encryption**: Military-grade encryption for all stored passwords
- **Password Strength Indicator**: Real-time password strength analysis
- **Audit Trail**: Complete logging of all sensitive vault operations
- **Secure Vault**: Encrypted storage for account credentials
- **Real-time Dashboard**: Live tracking of sweepstake progress and performance
- **Rewards Tracker**: Automated daily bonus collection with countdown timers
- **Analytics Engine**: Comprehensive performance analytics with charts and insights
- **Deadline Calendar**: Visual calendar for tracking sweepstake deadlines
- **Mission Reminders**: Intelligent notification system for important events
- **Progress Tracking**: Goal setting and progress monitoring tools
- **Win/Loss Statistics**: Detailed statistics on sweepstake outcomes
- **Platform Directory**: Comprehensive index of sweepstake platforms
- **Security Center**: Advanced security settings and threat monitoring

## Dashboard Tools

### Command Center (Dashboard)
- **Field Intelligence Report**: Real-time profit/loss tracking with interactive charts
- **Supply Drop Protocol**: Daily rewards collection with live countdown timers
- **Account Vault Preview**: Quick access to encrypted credentials
- **Active Operations Table**: Current sweepstake entries and progress
- **Sweepstake Progress Tracker**: Visual progress bars for active contests
- **Mission Reminders**: Alert system for deadlines and important events
- **Notifications Center**: Dropdown notifications for urgent alerts

### Rewards Command
- **Daily Supply Drops**: Automated tracking of daily bonuses across platforms
- **Strategic Objectives**: Goal setting with progress visualization
- **Historical Field Logs**: Complete record of rewards collection
- **Real-time Countdown**: Live timer for next reward availability

### Analytics Division
- **Profit Trend Analysis**: Interactive charts showing performance over time
- **Platform Performance**: Comparative analysis of different sweepstake sites
- **Monthly Goal Tracking**: Progress towards financial targets
- **Win/Loss Statistics**: Comprehensive statistics on outcomes
- **Deadline Calendar**: Visual calendar with upcoming deadlines
- **Advanced Intelligence Reports**: AI-powered insights and recommendations

### Security Command Center
- **MFA Management**: Setup and management of multi-factor authentication
- **Security Preferences**: Auto-lock settings and notification controls
- **Security Alerts**: Real-time threat detection and alerts
- **Audit Logs**: Complete activity logging and monitoring

### Platform Intelligence Database
- **Global Platform Index**: Comprehensive directory of sweepstake platforms
- **Status Monitoring**: Real-time operational status of platforms
- **Progress Tracking**: Entry completion percentages
- **Data Export**: CSV export functionality for analysis

### Secure Cryptographic Vault
- **Encrypted Storage**: AES-256 encrypted credential storage
- **Biometric Access**: Secure password viewing with audit logging
- **Platform Organization**: Categorized storage by sweepstake platform
- **Security Advisory**: Real-time security status and recommendations

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Supabase account and project

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd armed-eagle-sweepstakes
npm install
```

### 2. Supabase Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Run the SQL migration in your Supabase SQL editor:
   ```sql
   -- Copy the contents of migrations/001_add_vault_and_security.sql
   ```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Encryption Key (generate a secure random key)
NEXT_PUBLIC_ENCRYPTION_KEY=your_secure_encryption_key_here
```

### 4. Generate Encryption Key
For production, generate a secure encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Run the Application
```bash
npm run dev
```

## Database Schema

The application uses three main tables:

- `vault_entries`: Stores encrypted account credentials
- `audit_logs`: Logs all sensitive operations
- `user_mfa`: Stores MFA settings and secrets

## Security Features

- **AES-256 Encryption**: All passwords are encrypted before storage
- **Row Level Security**: Users can only access their own data
- **Audit Logging**: All vault operations are logged with timestamps
- **MFA Support**: TOTP and SMS-based two-factor authentication
- **Password Strength Enforcement**: Minimum security requirements for stored passwords

## API Routes

- `/auth/login`: User authentication
- `/auth/signup`: User registration
- `/vault`: Password vault management
- `/security`: MFA and security settings

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Security Considerations

- Never commit encryption keys to version control
- Use environment variables for all sensitive configuration
- Regularly rotate encryption keys
- Enable MFA for all user accounts
- Monitor audit logs for suspicious activity

## License

This project is licensed under the MIT License.
