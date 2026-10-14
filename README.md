# SynchroCampus | AI-Powered Student Task Coordination System

> A responsive, modern peer-to-peer student errand coordination platform where university students post small everyday errands, accept requests from peers along their daily walking corridors, earn virtual credits, and intelligently bundle compatible micro-tasks into optimized multi-stop journeys (**Quest Chains**).

---

## 🚀 Key Highlights & Architecture

- **Zero External Paid APIs & Zero Backend Required**: Runs entirely client-side using browser `localStorage` for high-fidelity state persistence and instantaneous interaction.
- **Intelligent Quest Chains (Deterministic Errand Bundler)**: Solves the multi-stop pickup-and-delivery routing problem across a realistic university campus graph. Groups compatible requests by campus zone, travel direction, and deadlines with precedence constraints ($Pickup_i \prec Dropoff_i$), calculates detour time, carbon offsets, and produces transparent explanations of why errands were combined.
- **Fair Reward Estimator (Dynamic Pricing Engine)**: Itemized mathematical compensation formula factoring in transit distance, payload load/effort, and deadline urgency surges.
- **Virtual Credit Wallet with Escrow Protocol**: Guarantees trust without payment processing. Requesters lock credits into escrow upon posting; credits transfer to the helper only when the requester explicitly confirms delivery. Includes an interactive Campus Faucet (+50 cr) for testing.
- **Multi-Persona Demo Switcher**: Switch seamlessly between 4 pre-configured student personas (*Alex Chen*, *Maya Patel*, *Marcus Vance*, *Samira Khan*) to test both requester and helper perspectives in real-time.
- **Interactive 2D Campus Errand Map**: Visualizes campus zones, building nodes, live pickup/dropoff counts, and errand hotspots.
- **Tactile Web Audio Micro-Interactions**: Native Web Audio API sound synthesis (chimes, clicks, alerts) without bulky external audio files.

---

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom university navy/indigo color palette
- **Icons**: Lucide React
- **Celebrations**: Canvas-Confetti
- **Audio**: Web Audio API (Synthesizer)
- **Data Layer**: Browser `localStorage` with automated JSON synchronization and seed fallbacks

---

## 📦 Features Breakdown

### 1. Dashboard
- **Live Metrics**: Spendable credit balance, escrow reserves, available campus tasks, active errands in progress, and estimated campus efficiency.
- **Interactive Campus Zone Map**: Stylized 2D interactive university map showing 10 major campus waypoints (*Student Union*, *Main Library*, *Turing Quad*, *Franklin Bio Labs*, *Pinnacle Dorms*, *North Quad*, *Heritage Quad*, *South Mail Depot*, *Rec Center*, *Arts Studio*). Click any node to view active pickup and delivery tasks.
- **Urgent Errand Spotlights**: Identifies high-bounty tasks due soon.
- **Live Campus Activity Feed**: Chronological transaction stream of escrow locks, completions, and rewards.

### 2. Create Quest Form
- Fields: Title, Category (Food & Drink, Academic & Print, Package & Mail, Dorm Essentials, Tech & Lab), Pickup Location & Detail, Dropoff Location & Detail, Delivery Window (15m to 120m), Package Load/Effort (Light, Medium, Heavy), and Special Instructions.
- **Real-Time Fair Reward Integration**: As the requester adjusts locations, effort, or urgency, the estimator calculates the recommended credit bounty and displays the itemized formula.
- **Automated Escrow Validation**: Verifies the requester holds sufficient balance before locking credits into escrow.

### 3. Quest Marketplace
- **Status Lifecycle**: *Available* $\rightarrow$ *Accepted* $\rightarrow$ *In Transit (Picked Up)* $\rightarrow$ *Delivered* $\rightarrow$ *Confirmed & Released*.
- **Tabs**: Browse All Available, My Coordinated Tasks (Helper view), My Posted Quests (Requester view), and Completed History.
- **Filters & Search**: Filter by 6 categories, 5 campus zones, or instant keyword search. Sort by urgency, bounty, or transit distance.
- **Lifecycle Actions**:
  - Helpers can *Accept*, *Mark Picked Up*, and *Mark Delivered*.
  - Requesters can *Cancel (Refund Escrow)* while open, or *Confirm Delivery & Release Credits* once delivered.

### 4. Quest Chains (Errand Bundling Engine)
- Transparent, deterministic clustering algorithm that scans all available errands and evaluates 2-task and 3-task combinations.
- Computes:
  - Total bundled journey duration vs. sum of isolated trips.
  - Minutes saved and carbon emissions offset ($~24g\text{ CO}_2/\text{min}$).
  - Waypoint ordering respecting precedence (pickups must happen before dropoffs).
  - Clear rationale text (*"Double Corridor: Both pickups in Central Hub heading towards Pinnacle Dorms..."*).
- **One-Click Claim**: Accept all bundled tasks in the chain simultaneously.

### 5. Fair Reward Estimator
- Dedicated calculator and embedded widget based on:
  $$\text{Credits} = (\text{Base: } 8\text{ cr} + \text{Distance } [~1.2\text{ cr}/100\text{m}] + \text{Effort } [0, 4, 9\text{ cr}]) \times \text{Urgency Multiplier } [1.0x - 1.45x]$$
- Interactive sliders for testing different campus routes, loads, and time constraints.

### 6. Virtual Credit Wallet & Ledger
- Spendable balance vs. Escrow locked balance.
- Lifetime earned and lifetime spent metrics.
- Complete audit ledger with transaction timestamps, type badges, counterparty student names, and descriptions.
- Instant **Demo Faucet** button for balance replenishment (+50 cr).

### 7. Helper Routing Preferences
- Configurable maximum detour ceiling ($5 - 25$ minutes).
- Maximum tasks per journey ($2 - 4$).
- Campus transit mode: Walking ($80\text{ m/min}$), Bicycle ($220\text{ m/min}$), Scooter ($260\text{ m/min}$).
- Preferred campus zones filter.
- Audio toggle.

---

## 🏃 Running the Application Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Setup & Launch
1. Open terminal in the project root directory:
   ```bash
   cd AI-Powered-Student-Task-Coordination-System
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the printed URL (typically `http://localhost:5173`).

### Production Build
To create an optimized production build:
```bash
npm run build
npm run preview
```

---

## 🧪 Recommended Test & Walkthrough Scenario

To see the system and escrow lifecycle in action:
1. **Explore the Dashboard**: Note your initial balance as *Alex Chen* (125 credits, 20 in escrow). Click on nodes on the 2D Campus Map.
2. **Review Quest Chains**: Click **Quest Chains** in the sidebar. Inspect the suggested bundles. Notice how the algorithm pairs *Matcha Latte* and *Bio Lab Protocols* or other nearby corridor tasks, showing exact minute savings and route order.
3. **Accept a Chain / Quest**: Click *Claim Entire Quest Chain* or accept an individual quest from the **Marketplace**.
4. **Advance Errand Stages**: Switch to *My Coordinated Tasks* in the marketplace. Click **Mark Picked Up & In Transit**, then **Mark Delivered**.
5. **Test Escrow Release**:
   - In the top right or sidebar, switch your persona to the requester of that quest (e.g. *Maya Patel* or *Marcus Vance*).
   - In the Marketplace under *My Posted Quests* (or in the Quest Details modal), click **Confirm Delivery & Release Credits**.
   - Notice the celebratory confetti, audio chime, and instant balance transfer from escrow to the helper's wallet!
6. **Post a New Quest**: Click **Post Quest**. Select locations and observe the **Fair Reward Estimator** recalculate in real-time. Post the quest and check your wallet to verify escrow locking.
7. **Helper Preferences**: Open **Preferences**, adjust the maximum detour to 6 minutes, and observe how the Quest Chains tab recalculates available bundles.

---

## 📋 Assumptions & Limitations

1. **Campus Waypoint Graph**: Campus locations are modeled as nodes with coordinates on a university grid. Distances are calculated using scaled Manhattan/Euclidean factors ($1.22\times$ factor for pedestrian paths) rather than commercial map APIs (Google Maps/Mapbox), eliminating API key requirements.
2. **Persistence**: State is stored in browser `localStorage`. Using private/incognito browsing or clearing site data resets the app to the initial seed dataset. A manual "Reset Demo Data" button is also provided.
3. **Escrow Guarantee**: The escrow model operates under cooperative student honor guidelines: credits are locked upon post and released upon requester confirmation or helper resolution.
