This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install  # Fastest option
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev     # Fastest option
```

### Using Bun (Optional)

This project supports [Bun](https://bun.sh) as an optional, faster alternative to Node.js.

#### Installation

##### On macOS or Linux:
```bash
curl -fsSL https://bun.sh/install | bash
```

##### On Windows:
1. First, install Windows Subsystem for Linux (WSL):
   ```powershell
   # Run in PowerShell as Administrator
   wsl --install
   ```
   After installation, restart your computer.

2. Install Bun in WSL:
   ```bash
   # Open WSL terminal and run:
   curl -fsSL https://bun.sh/install | bash
   ```

3. For the best experience on Windows:
   - Install VSCode with the "Remote - WSL" extension
   - Open your project folder in WSL: `code .`
   - Run all Bun commands in the WSL terminal

#### Using Bun

##### On macOS/Linux:
```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Start production server
bun run start
```

##### On Windows (via WSL):
```bash
# Install dependencies
wsl bun install

# Start development server
wsl bun dev

# Build for production
wsl bun run build

# Start production server
wsl bun run start
```

#### Troubleshooting on Windows

1. If WSL is not installed:
   ```powershell
   # Run in PowerShell as Administrator
   wsl --install
   ```

2. If you need to update WSL:
   ```powershell
   wsl --update
   ```

3. Common issues:
   - If Bun commands aren't working, make sure you're running them in a WSL terminal
   - If you can't access the development server, check that port forwarding is enabled in WSL
   - For VSCode integration, install the "Remote - WSL" extension and use the WSL terminal

Bun provides faster installation and development server startup times compared to Node.js. However, using Node.js (npm, yarn, or pnpm) remains fully supported.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js and Bun, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Bun Documentation](https://bun.sh) - learn about Bun runtime.
- [WSL Documentation](https://learn.microsoft.com/en-us/windows/wsl/) - learn about Windows Subsystem for Linux.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# admin
