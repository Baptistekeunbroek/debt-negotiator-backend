
# Debt Negotiator Backend

This project is a backend service for a conversational debt negotiation agent. It provides API endpoints to facilitate empathetic, human-like debt settlement conversations, including payment proposal calculations and outcome recording.

## Features

- **Conversational Debt Negotiation**: Supports a natural, caring, and collaborative negotiation flow.
- **Payment Proposal Calculation**: Calculates counter-proposals and fair compromises using clear justifications.
- **Outcome Recording**: Records the result of each negotiation (success, failure, or neutral) and can trigger follow-up actions (e.g., sending emails).
- **API-First Design**: Exposes endpoints for integration with conversational AI or frontend clients.

## Endpoints

- `POST /calculate-proposal`: Calculates a counter-proposal or compromise amount based on user input.
- `POST /send-outcome`: Records the outcome of the negotiation (success, failure, or neutral).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```
   git clone https://github.com/yourusername/debt-negotiator-backend.git
   cd debt-negotiator-backend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values (e.g., `PRIVATE_VAPI`, email credentials, etc.).

4. **Start the server:**
   ```
   npm start
   ```
   The server will run on `http://localhost:3000` by default.

## Project Structure

- `index.js` — Main entry point, sets up Express server and routes.
- `routes/calculate.js` — Handles payment proposal calculations.
- `routes/outcome.js` — Handles negotiation outcome recording.
- `services/email.js` — (If present) Handles email notifications.
- `vapi/vapi.js` — Vapi client integration.

## Usage

Integrate this backend with your conversational AI or frontend client. The agent logic is designed to:

- Listen empathetically to user offers.
- Use the `/calculate-proposal` endpoint to suggest counter-proposals or compromises (never inventing amounts).
- Use the `/send-outcome` endpoint to record the result of the negotiation.

## Example Request

**POST /calculate-proposal**
