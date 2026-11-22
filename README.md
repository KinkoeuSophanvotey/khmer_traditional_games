
# Khmer Living Archive – Khmer Traditional Games

## 1. What This Is

Khmer Living Archive is a digital collection of traditional Khmer games that documents and preserves Cambodian cultural heritage. It includes game descriptions, rules, playing instructions, and photographs in English and Khmer.

The project aims to make traditional games easier to discover and learn about while helping preserve cultural knowledge for future generations.

- **Collection:** Khmer Traditional Games
- **Curator:** Kinkoeu Sophanvotey

## 2. Who It's For

The Khmer Living Archive is intended for:

- **Students and young people:** To discover traditional Khmer games and learn how they are played.
- **Teachers and educators:** To introduce Cambodian cultural heritage through traditional games.
- **Community members:** To share knowledge and help preserve traditional games.
- **Anyone interested in Khmer culture:** To explore traditional games, their rules, and their cultural background.

## 3. How It Works

The Khmer Living Archive allows visitors to explore traditional Khmer games and registered users to contribute and manage game entries.

### Main Features

- **Browse Games:** Visitors can explore published traditional Khmer games.
- **Search:** Users can search for games by name. If no matching game is found, the website displays "No games found matching your search."
- **Bilingual Interface:** Users can switch between English and Khmer. The language preference changes the entire interface, including navigation, buttons, headings, messages, and game content.
- **Game Details:** Each game has an individual page displaying its description, how to play, rules, contributor name, place, and photograph.
- **User Accounts:** Visitors can register and log in.
- **Submit Entries:** Registered users can submit new game entries using bilingual fields for the title, description, playing instructions, rules, contributor name, and place, along with a photo URL.
- **My Entries:** Contributors can view, edit, and delete their own submissions and check their entry statuses: Published, Pending, and Returned.
- **Review Queue:** Authorized reviewers can view pending submissions, examine their information in English and Khmer, approve and publish entries, or return them for revision.

### Technology Stack

- Next.js
- React
- JavaScript
- Supabase (database and authentication)
- GitHub (source code management)
- Vercel (deployment)

## 4. Security Decisions

The project uses Supabase Row Level Security (RLS) to control access to game entries and protect contributor data.

### Database Security

The `entries` table has four RLS policies:

- **SELECT:** Anyone can read published entries. Contributors can also access their own entries, and authorized reviewers can access entries for review.
- **INSERT:** Authenticated users can create entries only under their own account, and new entries must have a pending status.
- **UPDATE:** Contributors can edit only their own entries. Updates must keep the entry pending unless the user is an authorized reviewer.
- **DELETE:** Contributors can delete only their own entries.

### Reviewer Authorization

Reviewer access is managed separately from ordinary user registration. An authorized user's Supabase account ID is manually added to the `reviewers` table.

The `is_reviewer()` database function checks whether the current user's ID is listed in that table. The `review_entry()` function checks reviewer authorization before allowing a pending entry to be published or returned for revision.

### Photo Storage

Game photographs are stored in a public Supabase Storage bucket named `photos`.

- **Maximum file size:** 5 MB
- **Allowed formats:** JPEG, PNG, and WebP
- Authenticated contributors can upload photos using the upload policy.
- Authenticated contributors can delete photos using the delete policy.
- Public visibility allows visitors to view uploaded photographs through their public URLs.

The application saves each uploaded photo's public URL in the `photo_url` column of the corresponding entry.

### Authentication and Environment Variables

Supabase handles user authentication and database access. The application uses environment variables for its Supabase project URL and publishable key rather than placing these values directly in the application code.

## 5. AI Use

AI tools were used as development assistance during this project.

- **Cline with OpenRouter:** Used to assist with creating and modifying website pages and components, improving the design and layout, debugging, and some Supabase-related coding tasks.
- **DeepSeek Chat V3 (`deepseek/deepseek-chat-v3-0324`):** Used through Cline to generate PostgreSQL INSERT statements for migrating game entries into Supabase. I initially used a free OpenRouter model, switched to DeepSeek Chat V3 for this specific task, and later returned to the free model.
- **ChatGPT (GPT-6):** Used to identify and understand errors in the `ReviewQueue.js` component, assist with manually correcting AI-generated code, write and check PostgreSQL queries for Supabase, examine Row Level Security (RLS) policies, and verify reviewer authorization and database permissions.

AI-generated code was not always correct. Sometimes Cline's attempted fixes caused additional problems. I used ChatGPT to help understand those problems and manually corrected some of the changes.

I also reviewed the generated SQL, checked Supabase permissions, and corrected image paths that caused deployment issues.

AI tools supported the development process, but I remained responsible for reviewing, testing, and understanding the code included in the project.

## 6. Sources and Credits

The information in this collection was gathered from my grandparents, sister, and friends, who shared their knowledge of traditional Khmer games.

### Game Contributors

| Traditional Game | Contributor | Place |
|---|---|---|
| Veay K’aom (Hit the Earthen Pot) | Grandparents | Takeo Province |
| Khlaeng Jarb Kon Morn | Bopha | Phnom Penh |
| Champa Champey | Jing | Takeo Province |
| Dan Derm Sloek Chhoer (Leaf Grabbing) | Grandparents | Takeo Province |
| Teanh Prot (Tug of War) | Grandparents | Takeo Province |
| Chol Chhoung | Lish | Takeo Province |
| Rorm Donderm Kav Eey (Dancing to Seize the Chair) | Jing | Takeo Province |
| Lout Bav (Jumping Bag Game) | Bopha | Phnom Penh |
| Bos Angkunh | Lish | Takeo Province |

I would like to thank my grandparents, Jing, Bopha, and Lish for sharing their knowledge and helping document these traditional Khmer games.

Their contributions help preserve cultural knowledge and make it accessible to future generations.

## 7. Running It Locally

### Requirements

- Node.js
- npm
- A Supabase project

### Installation

**1. Clone the repository:**

```bash
git clone https://github.com/KinkoeuSophanvotey/khmer_traditional_games.git
```

**2. Open the project folder:**

```bash
cd khmer_traditional_games
```

**3. Install dependencies:**

```bash
npm install
```

**4. Create a `.env.local` file in the project root and add your Supabase credentials:**

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Replace the placeholder values with your own Supabase project URL and publishable key.

**5. Start the development server:**

```bash
npm.cmd run dev
```

**6. Open the website in your browser:**

http://localhost:3000

## Section 8: Checklist

- Live URL loads logged out and shows published entries only: yes, [Open Khmer Living Archive](https://khmer-traditional-games.vercel.app/) (tested in Chrome Incognito, 21 November 2026).

- A stranger cannot publish their own entry through the page or the console: yes, tested with a simulated authenticated non-reviewer account in Supabase SQL Editor (21 November 2026).

- Logged out, the API returns nothing pending or returned: yes, tested using the simulated anonymous (`anon`) role in Supabase SQL Editor (21 November 2026).

- Contributors can edit and delete only their own entries: yes, tested using a normal contributor account (21 November 2026).

- No secrets anywhere in the repo history: yes, checked `.gitignore`, tracked files, and Git history for environment files and common secret-key patterns (21 November 2026).

- At least eight real entries, each with a credited source: yes, 9 published entries, all with credited contributors (21 November 2026).

- Khmer renders on every screen a user meets, including the queue: yes, checked in English and Khmer on the Homepage, Games, Login, Sign Up, and Review Queue (21 November 2026).

- Works at phone width: yes, tested in Chrome at 375px screen width in English and Khmer on the Homepage, Games, Login, Sign Up, and Review Queue (21 November 2026).

- No test entries, lorem ipsum or TODO comments in shipped pages: yes, checked the public Homepage and Games page for test entries and placeholder content, and searched project JavaScript, TypeScript, and HTML files for `TODO`, `Lorem ipsum`, `test entry`, and `placeholder text` (21 November 2026).

- No console errors on the main pages: yes, checked the Homepage, Games, Login, Sign Up, and Review Queue on localhost using Chrome Developer Tools Console; no errors appeared after refreshing each page (21 November 2026).

- jesseorndorff is a collaborator on this repo: invitation sent; previous invitation expired, and a new invitation was sent; awaiting acceptance.

- Supabase project restored and awake on 22 November 2026: yes, status shows Healthy.

- Demo video link opens in a private window: yes, [Watch the demo video](https://drive.google.com/file/d/1YECyrXWaggU4hn8BZSOgPoGUOOwQjZ-v/view?usp=sharing).

- Reflection pasted in the Canvas submission: yes.

- Posted in the Show Your Archive discussion: yes.

- Q&A slot booked for: yes, Friday, December 4, 2026, 9:40 AM–9:45 AM (Cambodia time, UTC+07:00).