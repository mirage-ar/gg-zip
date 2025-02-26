# GG

GG is a Solana-based web application that combines augmented reality (AR) and cryptocurrency in a scavenger hunt-style game. Players can compete in real-world environments to collect digital assets and participate in a unique gaming experience.

## Features
- **Hunter Mode**: Players race to collect G Boxes in real-world locations.
- **Sponsor Mode**: Users can support hunters and earn rewards.
- **Leaderboard**: Tracks top hunters and sponsors.
- **Crypto Integration**: Built on Solana, supporting SPL tokens.
- **Next.js & Serverless Architecture**: Utilizes Next.js with SST for backend scalability.

## Tech Stack
- **Frontend**: Next.js, React, TypeScript
- **Backend**: SST (Serverless Stack), Prisma, PostgreSQL
- **Blockchain**: Solana, @project-serum/anchor
- **Authentication**: NextAuth with Twitter login
- **State Management**: React Context API
- **Map Rendering**: rnmapbox for Mapbox integration

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js (v18+ recommended)
- Yarn or npm
- A Solana wallet (e.g., Phantom)

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/mirage-ar/gg-zip.git
   cd gg
   ```
2. Install dependencies:
   ```sh
   yarn install
   ```
3. Set up environment variables:
   - Create a `.env.local` file and configure the required values.

4. Run the development server:
   ```sh
   yarn dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment
GG is built for serverless deployment with SST. You can deploy it using:
```sh
yarn deploy
```

## API Routes
- `POST /api/collect`: Handles collection of G Boxes.
- `GET /api/leaderboard/hunters`: Fetches the top hunters.
- `GET /api/leaderboard/sponsors`: Fetches the top sponsors.
- `GET /api/user/[wallet]`: Retrieves user data based on wallet address.

## Smart Contracts
GG's smart contracts are built using Anchor and deployed on the Solana blockchain.

## Contributions
1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request.

## License
MIT License

## Contact
For support, reach out via 𝕏: [@ggdotzip](https://x.com/ggdotzip)

