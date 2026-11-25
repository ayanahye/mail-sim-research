# Mail Sim Research

A research prototype that simulates a patient-portal inbox for oncology providers and tests how AI-drafted replies can support them. A provider reads a patient message alongside the patient's EMR details, then either chooses from AI-written drafts or writes the reply themselves with AI help. Everything the AI produces stays editable, and every AI draft is labelled as AI-assisted.

> **Research prototype.** The patient messages and EMR details are sample data adapted from the public [OncQA dataset](https://github.com/AIM-Harvard/OncQA/blob/main/Data/original_questions_gpt4_outputs/Master2.csv).

## What it does

**Inbox**
- Lists patient messages with an urgency colour: 🔴 Immediate, 🟠 Emergent, 🟡 Urgent, 🔵 Less Urgent, ⚪ Nonurgent. A legend above the list explains the colours.
- The AI also tags each message with topic categories (shown as `#tags`).

**Standard mode** (Guided Drafting off)
- Three AI drafts per message, each with a different approach: **Informative**, **Suggestive**, **Redirective**.
- Click a draft to read and edit it. **Compare drafts** (or Ctrl+Click on a tab) shows two drafts side by side.
- **AI Edit** rewrites the current draft. Choose Empathy, Professionalism and Health Literacy at Low or High, each with a short description. Grammar and Clarity are also offered on the "Start Blank" tab.
- Regenerate a draft, rate it and leave feedback.

**Guided Drafting mode** (the toggle in the header; hover the ⓘ for a description)
- **Start Blank**: write the reply yourself, with AI Edit available.
- **Custom Points-to-Email**: type bullet points (or dictate them with the mic) and the AI turns them into an email. The box starts empty and shows greyed-out example text as a hint.
- **AI Points-to-Email**: the AI suggests bullet points from the patient message. Tick the ones you want, add your own, and generate the email.
- **See Generated Reply**: review and edit the generated email, then AI Edit it if you like.

## How it fits together

```
Browser (React + Vite)  --/api-->  Flask backend (port 5000)  -->  Ollama (port 11434)
      src/App.tsx                     backend/app.py                 mixtral:8x7b
```

- **Frontend**: `frontend/mail-frontend`. React 18, TypeScript, Vite, Tailwind CSS and `react-speech-recognition` for dictation. The app lives in one file, `src/App.tsx`.
- **Backend**: `backend/app.py`. A Flask API that builds the prompts and calls a local Ollama server (default model `mixtral:8x7b`, set in `query_ollama`). Every AI draft ends with a note saying it was drafted with AI assistance and approved by the provider.
- **Prompts** follow prior work on drafting patient-message replies; the references are listed at the top of `app.py`.

## Getting started

The app uses the `mixtral:8x7b` model, which is too large for most laptops. **To run it as intended, connect to the shared server**. **To run everything on your own machine, use a smaller model**; the drafts will be weaker.

You need three things running at the same time: **Ollama**, the **backend** and the **frontend**. Use a separate terminal for each.

### Running on the lab server

The model, backend and frontend all run on the lab's GPU server, and you open the app in your laptop's browser through an SSH tunnel. The server is reached over [Tailscale](https://tailscale.com), so ask a lab member for access to the lab's tailnet and an account on the server first.

On the lab server, the setup uses the `hf-july` conda environment and the repo at `~/mail-sim-july`. Adjust these if your copy is elsewhere.

**Ports at a glance**

| Port | Where | What |
|------|-------|------|
| 11434 | Server | Ollama |
| 5000 | Server (forwarded to laptop) | Flask backend |
| 5174 | Server (forwarded to laptop) | Frontend |

#### 1. Start the model and backend
Connect with keepalive so idle connections don't drop:
```bash
ssh -o ServerAliveInterval=30 <user>@<server-tailscale-ip>
```
Load the model, then start the backend in the same window:
```bash
ollama run mixtral:8x7b --keepalive 2h   # wait for >>>, then type /bye
conda activate hf-july
cd ~/mail-sim-july/backend
python app.py
```
Leave this window open. Closing it stops the backend.

#### 2. Start the frontend
In a second SSH window:
```bash
cd ~/mail-sim-july
git pull
cd frontend/mail-frontend
npm run dev
```
Note the port Vite reports (5174 by default). Leave this window open too.

#### 4. Open the app
Go to `http://localhost:5174` in your browser to open the app. 

