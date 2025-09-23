import {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useRef,
  ChangeEvent,
  KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

/*
type ApiResponse = {
  message: string;
};
*/

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  label: string;
}

interface TabContextValue {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  showAIFeatures: boolean;
  setShowAIFeatures: (show: boolean) => void;
}

const TabContext = createContext<TabContextValue | null>(null);

const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("TabContext is not provided");
  }
  return context;
};

const TabProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showAIFeatures, setShowAIFeatures] = useState(false);

  return (
    <TabContext.Provider
      value={{ activeTab, setActiveTab, showAIFeatures, setShowAIFeatures }}
    >
      {children}
    </TabContext.Provider>
  );
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isOn,
  onToggle,
  label,
}) => (
  <div className="flex items-center">
    <span className="mr-2 text-sm">{label}</span>
    <div
      className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer ${
        isOn ? "bg-green-400" : "bg-gray-300"
      }`}
      onClick={onToggle}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
          isOn ? "translate-x-4" : ""
        }`}
      />
    </div>
  </div>
);

function App() {
  // IP address here
  const BACKEND_URL = "";

  const [inboxWidth, setInboxWidth] = useState(40); // 40% as default
  const [data, setData] = useState<InboxEntry[]>([]);
  const [queue, setQueue] = useState<InboxEntry[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const newMessages: Omit<InboxEntry, "categories" | "aiReplies">[] = [
    {
      mrn: "123456",
      lastName: "Smith",
      firstName: "John",
      dob: "01/01/1980",
      subject: "Severe Exhaustion and Need Hospice",
      dateReceived: "04/01/2025",
      fromUser: "Patient",
      message:
        "I am in real trouble. I am in so much pain, I am in tears. I can barely walk, im passing out all over my house from severe exhaustion. My feet and legs feel like they are going to split open. My thighs, lower back and kidneys are in so much pain. My upper back is just aching badly. My whole body is in such incredible pain. My Cluster Headaches are killing me. Just had the worst attack I can remember. I feel like what ever is happening to me is going to kill me. My arms are swollen and my left arm/elbow feels like it is fractured. Dr.Smith office said I need to do a rest and exercise test. Doc I can't go anywhere let alone any appointments. I can barely walk. Smith can bare witness to the severe suffering I'm in. I have never been in this much pain in my life. I need help badly. I need to be back on hospice now",
      emrData: `Age: 55 years  
Gender: Male  
Cancer diagnosis: Stage III non-small cell lung cancer (NSCLC)  
PMH: hypertension, hyperlipidemia, chronic cluster headaches, possible chronic pain syndrome  
Prior cancer treatments: None  
Current cancer treatments: Radiotherapy with concurrent cisplatin (started 2 weeks ago)  
Current medication list: lisinopril, amlodipine, simvastatin, aspirin, pantoprazole, PRN sumatriptan  
Summary of most recent oncology visit (1 week ago):  
55-year-old male with newly diagnosed stage III NSCLC on chemoradiation. He reported **increased fatigue and generalized body aches**, but was able to attend the visit. Complained of **exacerbation of chronic cluster headaches**. Was referred for a cardiopulmonary exercise test to assess baseline endurance. Encouraged to continue treatment, but follow-up visit scheduled sooner to monitor for worsening side effects.`,
    },
    { 
      mrn: "234567", 
      lastName: "Doe", 
      firstName: "Jane", 
      dob: "02/02/1985", 
      subject: "Prescription", 
      dateReceived: "12/17/2024", 
      fromUser: "Patient", 
      message: "This situation with my missing prescription has been absolutely unacceptable. I’ve been without my medication for several days now, and it’s causing me serious distress. This medication isn’t optional for me—it’s something I rely on every day to manage my condition. I feel like I’m being completely ignored. No one seems to understand how urgent this is, and I’m starting to feel like I can’t trust the system to take care of me. I need answers, and I need someone to take responsibility for fixing this immediately. I shouldn’t have to beg for something so basic and essential to my health.",
      categories: ["Prescription Issue", "High Urgency", "Follow-up"],
      aiReplies: [
        { 
          label: "Empathetic Reply", 
          content: "Dear Jane,\n\nI’m so sorry for the distress and inconvenience this has caused. I completely understand how important your medication is and how frustrating delays can be. I’m looking into this immediately and will ensure it is resolved as quickly as possible. Your trust is very important to us, and we’ll do everything we can to make this right.\n\nSincerely,\nNurse Joy\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Joy.*",
          AIEdits: {
            content: "Dear Jane,\n\nI’m truly sorry to hear about the distress you’re experiencing. I understand how critical this medication is for you, and I deeply regret the inconvenience this delay has caused. I am personally addressing this issue and will ensure that it’s resolved promptly. Your well-being and trust are our top priority, and we’re committed to making this right.\n\nSincerely,\nNurse Joy\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Joy.*"
          }
        },
        { 
          label: "Direct Reply", 
          content: "Hi Jane,\n\nI understand how critical your medication is, and I apologize for the delay. I’ve already reached out to the pharmacy and will follow up with you as soon as I have an update. Thank you for bringing this to my attention.\n\nBest regards,\nNurse Joy\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Joy.*",
          AIEdits: {
            content: "Hi Jane,\n\nI completely understand the urgency of this matter, and I sincerely apologize for the delay. I’ve reached out to the pharmacy and am closely following up to ensure the issue is resolved quickly. I will keep you informed with updates as soon as I have them. Thank you for your patience and understanding.\n\nBest regards,\nNurse Joy\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Joy.*"
          }
        },
        { 
          label: "Reassurance Reply", 
          content: "Hello Jane,\n\nI completely understand your frustration and want to assure you that we’re working to resolve this issue as a top priority. I’m in contact with the pharmacy to ensure your medication is sent out immediately. Thank you for your patience as we address this.\n\nKind regards,\nNurse Joy\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Joy.*",
          AIEdits: {
            content: "Hello Jane,\n\nI understand how distressing this situation is, and I want to assure you that it’s being prioritized. I’m actively working with the pharmacy to ensure your medication is sent to you as soon as possible. Your patience and trust are greatly appreciated as we resolve this.\n\nKind regards,\nNurse Joy\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Joy.*"
          }
        }
      ]
    },
    { 
      mrn: "345678", 
      lastName: "Brown", 
      firstName: "Charlie", 
      dob: "03/03/1990", 
      subject: "Message", 
      dateReceived: "12/16/2024", 
      fromUser: "Patient", 
      message: "I don’t know what’s going on with my condition, and the lack of communication has been unbearable. I’m constantly on edge, wondering if I’ve been forgotten or if something has gone wrong. The anxiety is making it hard for me to function in my daily life. I don’t understand why it’s so hard to get updates. I’ve tried to be patient, but it feels like I’m being left in the dark with no regard for how this is affecting me emotionally. I need someone to step up and provide me with the information I’ve been waiting for because I can’t take this silence anymore.",
      categories: ["General Inquiry", "Medium Urgency", "Clarification Needed"],
      aiReplies: [
        { 
          label: "Empathetic Reply", 
          content: "Hi Charlie,\n\nI’m so sorry for the anxiety this is causing you. It’s absolutely understandable to feel this way, and I want to reassure you that your case is important to us. I’m reviewing your file now and will provide you with an update as soon as I have more information. You are not being forgotten.\n\nWarm regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*",
          AIEdits: {
            content: "Hi Charlie,\n\nI completely understand the anxiety you must be feeling, and I want to assure you that you are not being forgotten. Your concerns are very important to us. I’m reviewing your file now and will provide you with an update as soon as possible. Please know that we’re here for you during this challenging time.\n\nWarm regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
          }
        },
        { 
          label: "Direct Reply", 
          content: "Hi Charlie,\n\nI’m so sorry for the delay in communication. We are currently reviewing your case and will provide you with an update as soon as possible. Thank you for your patience.\n\nBest regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*",
          AIEdits: {
            content: "Hi Charlie,\n\nI’m so sorry for the delay in i hate u so much. We are currently reviewing your case and will provide you with an update as soon as possible. Thank you for your patience.\n\nBest regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
          }
        },
        { 
          label: "Reassurance Reply", 
          content: "Hello Charlie,\n\nI know it’s been tough, and I want to assure you that we’re on top of your case. I’m actively reviewing your situation and will update you soon. We value your trust and appreciate your patience.\n\nKind regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*",
          AIEdits: {
            content: "Hello Charlie,\n\nI truly understand how stressful this situation is, and I want to reassure you that we’re reviewing your case carefully. You are not being overlooked, and we’re working to provide you with the information you need. Thank you for your patience during this time.\n\nKind regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
          }
        }
      ]
    },
    { 
      mrn: "567890", 
      lastName: "Lee", 
      firstName: "Chris", 
      dob: "05/05/2000", 
      subject: "Document", 
      dateReceived: "12/14/2024", 
      fromUser: "Patient", 
      message: "I submitted all of my documents over a week ago, and I haven’t heard a single word back. I’m starting to feel like no one is even paying attention to my case, and it’s making me incredibly anxious. I keep wondering if something went wrong—were my documents lost, or did I miss a step? The uncertainty is driving me crazy, and I feel completely ignored. I just need someone to confirm that everything is in order and let me know what’s going on. This is so important to me, and I can’t understand why it’s taking so long to get even a simple acknowledgment.",
      categories: ["Document Submission", "Low Urgency", "Follow-up"],
      aiReplies: [
        { 
          label: "Empathetic Reply", 
          content: "Dear Chris,\n\nI understand how stressful it can be to wait for confirmation. Thank you for letting me know. I’ll review your documents immediately and confirm everything for you. Please don’t worry—we’ll make sure everything is in order.\n\nSincerely,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*",
          AIEdits: {
            content: "Some edited content here"
          }
        },
        { 
          label: "Direct Reply", 
          content: "Hi Chris,\n\nYour documents have been received and are currently under review. I’ll notify you as soon as everything is processed. Thank you for your patience.\n\nBest regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*",
          AIEdits: {
            content: "Some edited content here"
          }
        },
        { 
          label: "Reassurance Reply", 
          content: "Hello Chris,\n\nI want to let you know that your documents have been received and everything looks great. You’ll hear from us soon regarding the next steps. Thank you for keeping us updated.\n\nKind regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*",
          AIEdits: {
            content: "Some edited content here"
          }
        }
      ]
    }
  ];
  
  
  
// notes:
return (
  <TabProvider>
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        <header className="bg-white text-black p-2 flex justify-between items-center border-b fixed top-0 left-0 right-0 z-10 shadow-sm">
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold">Tangent Mail</h1>
          </div>
          <div className="flex-grow max-w-xl mx-4">
            <input 
              type="text" 
              placeholder="Search"
              className="w-full p-2 rounded-md bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <nav className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div className='flex items-center space-x-6'>
            <TabContext.Consumer>
              {context => (
                <ToggleSwitch 
                  isOn={context?.showAIFeatures ?? false} 
                  onToggle={() => {
                    if (context?.showAIFeatures) {
                      context.setActiveTab(0);
                    }
                    context?.setShowAIFeatures(!context.showAIFeatures);
                  }} 
                  label="AI Features Mode 2" 
                />
              )}
            </TabContext.Consumer>
          </div>
          </nav>
        </header>
        
        <div className="flex flex-1 pt-14">
          <aside className="w-64 bg-gray-100 text-black p-4 min-h-screen border-r">
            <nav className="space-y-1">
              {["Inbox", "Drafts", "Sent Items", "Deleted Items", "Junk Email", "Archive", "Notes"].map((folder, index) => (
                <button
                  key={index}
                  className="block w-full p-2 text-left hover:bg-blue-100 rounded-md transition duration-200 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {folder}
                </button>
              ))}
            </nav>
          </aside>
          
          <main className="flex-1 bg-white overflow-hidden flex relative h-screen">
            <div 
              className="border-r overflow-y-auto"
              style={{ width: `${inboxWidth}%`, height: '100%' }}
            >
              <Inbox dummyData={dummyData} />
            </div>
            <div 
              className="w-1 bg-gray-300 cursor-col-resize absolute h-full"
              style={{ left: `${inboxWidth}%` }}
              onMouseDown={handleMouseDown}
            ></div>
            <div 
              className="overflow-y-auto"
              style={{ width: `${100 - inboxWidth}%`, height: '100%' }}
            >
              <Routes>
                <Route path="/message/:mrn" element={<MessageDetail dummyData={dummyData} />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  </TabProvider>
  );
}

type AIEdits = {
  content: string;
};

type AIReply = {
  label: string;
  content: string;
  AIEdits: AIEdits;
};

type InboxEntry = {
  mrn: string;
  lastName: string;
  firstName: string;
  dob: string;
  subject: string;
  dateReceived: string;
  fromUser: string;
  message: string;
  emrData: string;
  categories: string[];
  aiReplies: AIReply[];
};

type InboxProps = {
  dummyData: InboxEntry[];
};

const Inbox: React.FC<InboxProps> = ({ dummyData }) => {
  const navigate = useNavigate();
  const [inboxData, setInboxData] = useState<InboxEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setInboxData(dummyData);
      setLoading(false);
    }, 1000);
  }, [dummyData]);

  const handleRowClick = (entry: any) => {
    setSelectedEntry(entry.mrn);
    navigate(`/message/${entry.mrn}`);
  };

  const urgencyLevels = [
    { label: "Immediate", icon: "🔴" },
    { label: "Emergent", icon: "🟠" },
    { label: "Less Urgent", icon: "🔵" },
    { label: "Urgent", icon: "🟡" },
    { label: "Nonurgent", icon: "⚪" },
    { label: "Non-urgent", icon: "⚪" },
  ];

  const getUrgency = (categories: any) => {
    if (!categories) return "";
    const found = urgencyLevels.find(({ label }) =>
      categories.some((cat: any) => {
        const regex = new RegExp(`\\b${label.replace(/\s+/g, "\\s*")}\\b`, "i");
        return regex.test(cat);
      })
    );
    return found ? found.label : "";
  };

  const getUrgencyIcon = (categories: any) => {
    if (!categories) return "";
    const found = urgencyLevels.find(({ label }) =>
      categories.some((cat: any) => {
        const regex = new RegExp(`\\b${label.replace(/\s+/g, "\\s*")}\\b`, "i");
        return regex.test(cat);
      })
    );
    return found ? found.icon : "";
  };

  const nonUrgencyCategories = (categories: any) =>
    categories.filter(
      (cat: any) =>
        !urgencyLevels.some((u) =>
          cat.toLowerCase().includes(u.label.toLowerCase())
        )
    );

  const processedData = useMemo(() => {
    return inboxData.map((entry) => ({
      ...entry,
      urgency: getUrgency(entry.categories),
      urgencyIcon: getUrgencyIcon(entry.categories),
    }));
  }, [inboxData]);

  if (loading) {
    return <div className="text-center p-4">Loading messages...</div>;
  }

  return (
    <div className="h-full overflow-auto">
      <div className="sticky top-0 bg-white p-2 border-b flex items-center mt-2">
        <input type="checkbox" className="mr-2" />
        <button className="text-gray-600 hover:text-black mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button className="text-gray-600 hover:text-black mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button className="text-gray-600 hover:text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {processedData.map((entry) => (
        <div
          key={entry.mrn}
          className="flex items-stretch p-2 border-b cursor-pointer"
          onClick={() => handleRowClick(entry)}
        >
          <input
            type="checkbox"
            className="mr-2"
            onClick={(e) => e.stopPropagation()}
          />
          <div
            className={`flex flex-grow p-2 rounded ${
              selectedEntry === entry.mrn
                ? "bg-gradient-to-r from-blue-200 to-white"
                : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-white"
            }`}
          >
            <div className="w-6 text-center mr-2">{entry.urgencyIcon}</div>
            <div className="flex-grow">
              <div className="flex">
                <span className="font-semibold">{entry.fromUser}</span>
                <span className="text-sm text-gray-500 ml-10">
                  {entry.dateReceived}
                </span>
              </div>
              <div className="flex">
                <span className="text-sm font-medium truncate">
                  {entry.subject}
                </span>
                <span className="flex text-sm text-gray-500 ml-5">
                  {nonUrgencyCategories(entry.categories)
                    .map((cat: any) => `#${cat}`)
                    .join(" ")}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">{entry.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// typescript...

type MessageDetailProps = {
  dummyData: InboxEntry[];
  //showAIFeatures: boolean;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

type EntryState = {
  to: string;
  subject: string;
  reply: string;
  aiReplies: AIReply[];
  aiPoints?: string;
};

type Rating = number;
type Feedback = string;
type Instruction = string;

type AIEditLevel = "high" | "low" | "";

interface AIEditOptions {
  grammar: AIEditLevel;
  empathy: AIEditLevel;
  clarity: AIEditLevel;
  professionalism: AIEditLevel;
  healthLiteracy: AIEditLevel;
}

// logic to implement geenrated rpely function differ for both modes todo--integration not yet started

const MessageDetail: React.FC<MessageDetailProps> = ({
  dummyData,
  isLoading,
  setIsLoading,
}) => {
  const { mrn } = useParams();
  const entryData = dummyData.find((item) => item.mrn === mrn);

  const { activeTab, setActiveTab, showAIFeatures, setShowAIFeatures } =
    useTabContext();

  const [entry, setEntry] = useState<EntryState>({
    to: entryData ? `${entryData.firstName} ${entryData.lastName}` : "",
    subject: entryData ? entryData.subject : "Patient Message",
    reply: "",
    aiReplies: entryData?.aiReplies || [],
  });

  useEffect(() => {
    if (entryData) {
      setEntry({
        to: `${entryData.firstName} ${entryData.lastName}`,
        subject: entryData.subject,
        reply: "",
        aiReplies: entryData.aiReplies || [],
      });
    }
  }, [mrn, entryData]);

  const [showModal, setShowModal] = useState(false);
  const [sentReplies, setSentReplies] = useState<
    { emailId: string; content: string; timestamp: Date }[]
  >([]);

  const [ratings, setRatings] = useState<Rating[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [showRating, setShowRating] = useState<{ [key: number]: boolean }>({});
  const [showRatingModal, setShowRatingModal] = useState(false);

  const [blankReplyAI, setBlankReplyAI] = useState<{ [mrn: string]: string }>(
    {}
  );

  const [blankReplyManual, setBlankReplyManual] = useState<{
    [mrn: string]: string;
  }>({});

  const [showBlankReplyForm, setShowBlankReplyForm] = useState(false);
  const [generateClicked, setGenerateClicked] = useState<boolean>(false);

  const [selectedText, setSelectedText] = useState({ start: 0, end: 0 });

  const [aiEditedContent, setAiEditedContent] = useState<string>("");

  const [originalBlankReplyAI, setOriginalBlankReplyAI] = useState("");
  const [originalBlankReplyManual, setOriginalBlankReplyManual] = useState("");

  const [originalGeneratedReply, setOriginalGeneratedReply] = useState("");
  const [originalTabbedReply, setOriginalTabbedReply] = useState("");

  const [showAIEditModal, setShowAIEditModal] = useState<boolean>(false);
  const [aiEditOptions, setAIEditOptions] = useState<AIEditOptions>({
    grammar: "",
    empathy: "",
    clarity: "",
    professionalism: "",
    healthLiteracy: "",
  });

  const [cmdPressed, setCmdPressed] = useState(false);

  const [splitViewTab, setSplitViewTab] = useState<number | null>(null);
  const [showSplitView, setShowSplitView] = useState(false);

  const [isAIEditButtonClicked, setIsAIEditButtonClicked] = useState(false);

  const [generatedReplies, setGeneratedReplies] = useState<{
    [key: string]: string;
  }>({});

  const handleAIEditOptionChange = (
    option: keyof AIEditOptions,
    value: AIEditLevel
  ) => {
    setAIEditOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  // update but no fix
  const handleAIEditSubmit = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setShowAIEditModal(false);

      const patientMessage = entryData?.message || "";
      const emrDets = entryData?.emrData || "";
      let originalText = "";
      let aiReply = "";
      let updateStateCallback: (editedReply: string) => void;

      if (showAIFeatures && activeTab === 0) {
        if (!mrn) {
          console.error("MRN is undefined");
          return;
        }

        // case - blank
        originalText = blankReplyAI[mrn];
        aiReply = blankReplyAI[mrn];

        setOriginalBlankReplyAI(blankReplyAI[mrn]);

        updateStateCallback = (editedReply: string) => {
          setBlankReplyAI((prev) => ({
            ...prev,
            [mrn]: editedReply,
          }));

          setEditedText(editedReply);
        };
      } else if (showAIFeatures && activeTab === -2) {
        // case - generated edit
        originalText = generatedReplies[mrn || ""] || "";
        aiReply = generatedReplies[mrn || ""] || "";

        setOriginalGeneratedReply(originalText);

        console.log("og text here:", originalText);

        updateStateCallback = (editedReply: string) => {
          setGeneratedReplies((prevReplies) => ({
            ...prevReplies,
            [mrn || ""]: editedReply,
          }));
          setEditedText(editedReply);
        };
      } else if (!showAIFeatures && activeTab < entry.aiReplies.length) {
        // case - ai replies tabbed
        originalText = entry.aiReplies[activeTab]?.content || "";
        aiReply = entry.aiReplies[activeTab]?.content || "";

        setOriginalTabbedReply(originalText);

        updateStateCallback = (editedReply: string) => {
          const updatedReplies = [...entry.aiReplies];
          updatedReplies[activeTab] = {
            ...updatedReplies[activeTab],
            content: editedReply,
          };
          setEntry((prevState) => ({
            ...prevState,
            aiReplies: updatedReplies,
          }));
          setEditedText(editedReply);
        };
      } else if (!showAIFeatures && activeTab === 3) {
        // case 4 - blank mode 1
        if (!mrn) {
          console.error("MRN is undefined");
          return;
        }
        originalText = blankReplyManual[mrn];
        aiReply = blankReplyManual[mrn];

        setOriginalBlankReplyManual(blankReplyManual[mrn]);

        updateStateCallback = (editedReply: string) => {
          setBlankReplyManual((prev) => ({
            ...prev,
            [mrn]: editedReply,
          }));
          setEditedText(editedReply);
        };
      } else {
        console.error("Unhandled case for AI Edit");
        return;
      }

      console.log("Original Text:", originalText);
      console.log("AI Reply:", aiReply);

      const response = await fetch(`${BACKEND_URL}/api/edit-ai-reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientMessage,
          emrDets,
          originalText,
          aiReply,
          editOptions: aiEditOptions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to apply AI edits");
      }

      const result = await response.json();
      const editedReply = result?.editedReply?.content;

      if (!editedReply) {
        console.error("No edited reply received from backend");
        return;
      }

      console.log("Edited Reply:", editedReply);

      updateStateCallback(editedReply);
    } catch (error) {
      console.error("Error applying AI edits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // adding code for speech to text testing

  type SpeechToTextProps = {
    value: string;
    onChange: (value: string) => void;
  };

  const SpeechToText: React.FC<SpeechToTextProps> = ({ value, onChange }) => {
    const {
      transcript,
      listening,
      browserSupportsSpeechRecognition,
      resetTranscript,
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
      return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={() => {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true });
          }}
          className="px-4 py-1 bg-gray-200 rounded"
          disabled={listening}
        >
          Start Mic
        </button>
        <button
          type="button"
          onClick={() => {
            SpeechRecognition.stopListening();
            onChange(transcript);
          }}
          className="px-4 py-1 bg-gray-200 rounded"
          disabled={!listening}
        >
          Stop Mic
        </button>
      </div>
    );
  };

  const handleSplitView = (index: number) => {
    setSplitViewTab(index);
    setShowSplitView(true);
  };

  const SplitViewPopup: React.FC = () => {
    if (!showSplitView) return null;

    const currentTabContent = entry.aiReplies[activeTab].content;
    const selectedTabContent = entry.aiReplies[splitViewTab as number].content;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl h-full max-h-screen overflow-y-auto">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowSplitView(false)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Close
            </button>
          </div>
          <h2 className="text-lg font-bold mb-4">Compare Replies</h2>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2">
              <button
                onClick={() => handleTabClick(activeTab)}
                className="text-sm font-bold mb-2 text-left w-full py-2 px-4 bg-blue-200 hover:bg-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded cursor-pointer border border-blue-500"
              >
                {entry.aiReplies[activeTab].label}
              </button>

              <pre className="text-sm whitespace-pre-wrap mr-5 px-2">
                {currentTabContent}
              </pre>
            </div>
            <div className="w-full md:w-1/2">
              <button
                onClick={() => handleTabClick(splitViewTab as number)}
                className="text-sm font-bold mb-2 text-left w-full py-2 px-4 bg-blue-200 hover:bg-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded cursor-pointer border border-blue-500"
              >
                {entry.aiReplies[splitViewTab as number].label}
              </button>
              <pre className="text-sm whitespace-pre-wrap px-2">
                {selectedTabContent}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleTabClick = (
    index: number,
    e?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (
      !showAIFeatures &&
      index !== activeTab &&
      index != 3 &&
      activeTab != 3
    ) {
      if (e?.ctrlKey || e?.metaKey) {
        handleSplitView(index);
      } else {
        setActiveTab(index);
      }
    } else {
      setActiveTab(index);
      if (index === entry.aiReplies.length) {
        setShowBlankReplyForm(true);
      } else {
        setShowBlankReplyForm(false);
      }
      setShowSplitView(false);
    }
    setShowDiff(false);
    setIsAIEditButtonClicked(false);
  };

  const handleSubmitRating = () => {
    console.log("Submitting rating:", ratings[activeTab]);
    console.log("Submitting feedback:", feedback[activeTab]);
    setShowRatingModal(true);
  };

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setShowRating((prev) => ({
      ...prev,
      [activeTab]: false,
    }));
  };

  const handleRatingChange = (index: number, newRating: Rating) => {
    const updatedRatings = [...ratings];
    updatedRatings[index] = newRating;
    setRatings(updatedRatings);
  };

  const handleFeedbackChange = (index: number, newFeedback: Feedback) => {
    const updatedFeedback = [...feedback];
    updatedFeedback[index] = newFeedback;
    setFeedback(updatedFeedback);
  };

  const handleSendReply = (
    replyContent: string,
    isAIReply: boolean = false
  ) => {
    console.log("send Reply clicked");

    if (replyContent.trim() && entryData?.mrn) {
      setSentReplies((prevReplies) => [
        ...prevReplies,
        {
          emailId: entryData.mrn,
          content: replyContent,
          timestamp: new Date(),
        },
      ]);

      if (isAIReply) {
        const updatedReplies = entry.aiReplies.map((reply) => {
          if (reply.content === replyContent) {
            return { ...reply, content: replyContent };
          }
          return reply;
        });

        setEntry({ ...entry, aiReplies: updatedReplies });
      }

      if (!mrn) {
        console.error("MRN is undefined");
        return;
      }

      if (showAIFeatures && activeTab === 0) {
        setBlankReplyAI((prev) => ({
          ...prev,
          [mrn]: "",
        }));
      } else if (!showAIFeatures && activeTab === 3) {
        setBlankReplyManual((prev) => ({
          ...prev,
          [mrn]: "",
        }));
      }

      setShowModal(true);
      setShowBlankReplyForm(false);
    } else {
      console.error("Reply cannot be empty or entryData.mrn is undefined");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleAIReplyChange = (index: number, newContent: string) => {
    const updatedReplies = [...entry.aiReplies];
    updatedReplies[index].content = newContent;
    setEntry({ ...entry, aiReplies: updatedReplies });
  };

  const handleStartBlank = () => {
    setShowBlankReplyForm(!showBlankReplyForm);

    if (!mrn) {
      console.error("MRN is undefined");
      return;
    }

    if (showAIFeatures && activeTab === 0) {
      setBlankReplyAI((prev) => ({
        ...prev,
        [mrn]: "",
      }));
    } else if (!showAIFeatures && activeTab === 3) {
      setBlankReplyManual((prev) => ({
        ...prev,
        [mrn]: "",
      }));
    }
  };

  const handleBlankReplyChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;

    if (!mrn) {
      console.error("MRN is undefined");
      return;
    }

    if (showAIFeatures && activeTab === 0) {
      setBlankReplyAI((prev) => ({
        ...prev,
        [mrn]: newValue,
      }));
      setOriginalText(newValue);
      console.log("AI Blank Reply:", newValue);
    } else if (!showAIFeatures && activeTab === 3) {
      setBlankReplyManual((prev) => ({
        ...prev,
        [mrn]: newValue,
      }));
      setOriginalText(newValue);
      console.log("Manual Blank Reply:", newValue);
    } else {
      console.error("Unhandled case in handleBlankReplyChange");
    }
  };

  const handleTextSelect = () => {
    const textarea = document.getElementById(
      "blankReplyTextarea"
    ) as HTMLTextAreaElement;
    setSelectedText({
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    });
  };

  const handleGenerateReplyClick = async () => {
    try {
      setIsLoading(true);

      const currentInput = bulletInputs[contextKey] ?? exampleInput;

      if (!currentInput.trim()) {
        console.error("Please provide your instructions as bullet points.");
        setIsLoading(false);
        return;
      }

      const payload = {
        instructions: currentInput,
        patientMessage: entryData?.message || "",
        emrDets: entryData?.emrData || "",
      };

      const response = await fetch(`${BACKEND_URL}/api/provide-instructions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to generate reply");
      }

      const result = await response.json();
      const generatedReply = result?.generatedReply?.content;

      if (!generatedReply) {
        console.error("No reply received from backend");
        setIsLoading(false);
        return;
      }

      setGeneratedReplies((prevReplies) => ({
        ...prevReplies,
        [mrn || contextKey || ""]: generatedReply,
      }));

      setPrevInstructionsReply(generatedReply);
      setGenerateClicked(true);
      handleTabClick(-2);
    } catch (error) {
      console.error("Error generating reply:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePointsClick = async (instructionsSource: string) => {
    console.log("test");
    console.log(instructionsSource);

    try {
      setIsLoading(true);

      if (!instructionsSource.trim()) {
        console.error("Please provide your instructions as bullet points.");
        setIsLoading(false);
        return;
      }

      const payload = {
        instructions: instructionsSource,
        patientMessage: entryData?.message || "",
        emrDets: entryData?.emrData || "",
      };

      const response = await fetch(`${BACKEND_URL}/api/provide-instructions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to generate reply");
      }

      const result = await response.json();
      const generatedReply = result?.generatedReply?.content;

      if (!generatedReply) {
        console.error("No reply received from backend");
        setIsLoading(false);
        return;
      }

      setGeneratedReplies((prevReplies) => ({
        ...prevReplies,
        [mrn || contextKey || ""]: generatedReply,
      }));

      setPrevInstructionsReply(generatedReply);
      setGenerateClicked(true);
      handleTabClick(-2);
    } catch (error) {
      console.error("Error generating reply:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // IP address here
  const BACKEND_URL = "";

  const handleRegenerateReply_mode1 = async (
    replyIndex: number,
    currentReplyContent: string,
    subject: string,
    previousMessage: string,
    patientMessage: string,
    emrDets: string
  ) => {
    const category =
      replyIndex === 0
        ? "Informative"
        : replyIndex === 1
        ? "Suggestive"
        : replyIndex === 2
        ? "Redirective"
        : "";

    try {
      setIsLoading(true);

      const response = await fetch(`${BACKEND_URL}/api/regenerate-ai-reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientMessage,
          emrDets,
          aiReply: currentReplyContent,
          category,
          subject,
          previousMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to regenerate AI reply");
      }

      const result = await response.json();

      const regeneratedReply = result?.aiReply?.content;

      if (!regeneratedReply) {
        console.error("No regenerated reply received from backend");
        return;
      }

      // avoid err using def
      const mrn: string | undefined = "123456";

      if (replyIndex === -2) {
        setGeneratedReplies((prevReplies) => ({
          ...prevReplies,
          [mrn]: regeneratedReply,
        }));
        setGeneratedReply(regeneratedReply);
        console.log("gen reps here:", generatedReplies);
      } else {
        setEntry((prevEntry) => ({
          ...prevEntry,
          aiReplies: prevEntry.aiReplies.map((reply, index) =>
            index === replyIndex
              ? { ...reply, content: regeneratedReply }
              : reply
          ),
        }));
      }
    } catch (error) {
      console.error("Error regenerating reply:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        setCmdPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        setCmdPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const [showDiff, setShowDiff] = useState(false);
  const [prevOriginalText, setPrevOriginalText] = useState(
    entryData?.aiReplies[0]?.content || ""
  );
  const [prevBlankReply, setPrevBlankReply] = useState("");
  const [prevInstructionsReply, setPrevInstructionsReply] = useState("");

  const [originalText, setOriginalText] = useState(
    entry.aiReplies[activeTab]?.content || ""
  );
  const [editedText, setEditedText] = useState(
    entry.aiReplies[activeTab]?.AIEdits?.content || ""
  );

  const editedTextWithSpaces = editedText.replace(/([.,!?;])/g, "$1 ");
  console.log("edited text here: ", editedTextWithSpaces);

  const [generatedReply, setGeneratedReply] = useState("");

  const [showReplySection, setShowReplySection] = useState(false);

  const toggleReplySection = () => {
    setShowReplySection(!showReplySection);
  };

  const exampleInput = `
    • Purpose: New lab requisition for follow-up on recent symptoms (fatigue)
    • Tests Needed: CBC, iron panel, vitamin D
    • Instructions: Go to any LifeLabs location
    • Important: Bring requisition form (attached)
    • Deadline: Within 2 weeks
    • Next Steps: Results will be discussed at next appointment
    • Additional Info: Patient has history of anemia`;

  const exampleLabels = [
    "Purpose:",
    "Tests Needed:",
    "Instructions:",
    "Important:",
    "Deadline:",
    "Next Steps:",
    "Additional Info:",
  ];

  const placeholderText = exampleLabels.map((label) => `• ${label}`).join("\n");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [bulletInputs, setBulletInputs] = useState<{ [key: string]: string }>(
    {}
  );

  const [userAddedPoints, setUserAddedPoints] = useState<string>("");

  const [checkedPoints, setCheckedPoints] = useState<
    Record<string, Record<number, boolean>>
  >({});

  function extractPoints(text: string | undefined): string[] {
    if (!text) return [];
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => /^(\d+\.)|^[-*•]/.test(line))
      .map((line) => line.replace(/^(\d+\.)|^[-*•]\s?/, "").trim());
  }

  const aiPointsList: string[] = extractPoints(entryData?.aiPoints);

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    const value = bulletInputs[contextKey] ?? exampleInput;

    if (e.key === "Enter") {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.currentTarget;
      const before = value.slice(0, selectionStart);
      const after = value.slice(selectionEnd);
      const newValue = before + "\n• " + after;
      setBulletInputs((prev) => ({
        ...prev,
        [contextKey]: newValue,
      }));

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart =
            textareaRef.current.selectionEnd = selectionStart + 3;
        }
      }, 0);
    }
    if (
      e.key === "Tab" &&
      textareaRef.current &&
      value[textareaRef.current.selectionStart - 1] === "*"
    ) {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.currentTarget;
      const before = value.slice(0, selectionStart - 1);
      const after = value.slice(selectionEnd);
      const newValue = before + "• " + after;
      setBulletInputs((prev) => ({
        ...prev,
        [contextKey]: newValue,
      }));

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart =
            textareaRef.current.selectionEnd = selectionStart;
        }
      }, 0);
    }
  };

  const contextKey = mrn || "";

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setBulletInputs((prev) => ({
      ...prev,
      [contextKey]: e.target.value,
    }));
  };

  const LoadingSpinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
    </div>
  );

  // prevInstructionsReply

  const handleAccept = () => {
    if (!mrn) {
      console.error("MRN is undefined");
      return;
    }
    if (
      (!showAIFeatures && activeTab < 3) ||
      (showAIFeatures && activeTab === 0)
    ) {
      if (showAIFeatures && activeTab === 0) {
        // blank

        setOriginalBlankReplyAI(blankReplyAI[mrn]);
        setPrevBlankReply(blankReplyAI[mrn]);
        setBlankReplyAI((prev) => ({
          ...prev,
          [mrn]: editedTextWithSpaces,
        }));
      } else {
        // tabs
        const updatedReplies = [...entry.aiReplies];
        updatedReplies[activeTab] = {
          ...updatedReplies[activeTab],
          content: editedTextWithSpaces,
        };
        setEntry((prevState) => ({
          ...prevState,
          aiReplies: updatedReplies,
        }));
      }
    } else if (showAIFeatures && activeTab === -2) {
      // gen
      setPrevOriginalText(editedTextWithSpaces);
      setGeneratedReply(editedTextWithSpaces);
    } else if (!showAIFeatures && activeTab === 3) {
      // blank manual
      setOriginalBlankReplyManual(blankReplyManual[mrn]);
      setPrevBlankReply(blankReplyManual[mrn]);
      setBlankReplyManual((prev) => ({
        ...prev,
        [mrn]: editedTextWithSpaces,
      }));
    } else {
      console.error("Unhandled case in handleAccept");
    }

    setIsAIEditButtonClicked(false);
    setShowDiff(false);
  };

  const handleRevert = () => {
    console.log("Reverting changes...");

    if (!mrn) {
      console.error("MRN is undefined");
      return;
    }

    if (
      (!showAIFeatures && activeTab < 3) ||
      (showAIFeatures && activeTab === 0)
    ) {
      if (showAIFeatures && activeTab === 0) {
        // blank
        setBlankReplyAI((prev) => ({
          ...prev,
          [mrn]: originalBlankReplyAI,
        }));
      } else {
        // tabs
        const updatedReplies = [...entry.aiReplies];
        updatedReplies[activeTab] = {
          ...updatedReplies[activeTab],
          content: originalTabbedReply,
        };
        setEntry((prevState) => ({
          ...prevState,
          aiReplies: updatedReplies,
        }));
        setEditedText(originalTabbedReply);
      }
    } else if (showAIFeatures && activeTab === -2) {
      // gen
      const mrn = entryData?.mrn || "default_mrn";

      console.log("Reverting Generated Reply...");
      console.log("Original Generated Reply:", originalGeneratedReply);

      setGeneratedReplies((prevReplies) => ({
        ...prevReplies,
        [mrn]: originalGeneratedReply,
      }));

      setGeneratedReply(originalGeneratedReply);
    } else if (!showAIFeatures && activeTab === 3) {
      // blank
      setBlankReplyManual((prev) => ({
        ...prev,
        [mrn]: originalBlankReplyManual,
      }));
    } else {
      console.error("Unhandled case in handleRevert");
    }

    setIsAIEditButtonClicked(false);
    setShowDiff(false);
  };

  // drag updated functionality
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [categoriesHeight, setCategoriesHeight] = useState(200);

  const handleResizeEnd = () => {
    setIsDragging(false);
  };

  const handleResize = (e: MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientY - startY;
    setCategoriesHeight((prevHeight) =>
      Math.max(100, Math.min(prevHeight + delta, window.innerHeight - 200))
    );
    setStartY(e.clientY);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleResize);
      window.addEventListener("mouseup", handleResizeEnd);
    } else {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", handleResizeEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [isDragging]);

  useEffect(() => {
    setShowReplySection(false);
  }, [mrn]);

  const highlightDifferences = (original: string, edited: string) => {
    const originalWords = original.trim().replace(/\s+/g, " ").split(/\s+/);
    console.log("originalword", originalWords);

    const editedWords = edited.trim().replace(/\s+/g, " ").split(/\s+/);

    const lcs = findLCS(originalWords, editedWords);
    const diffResult: JSX.Element[] = [];

    let i = 0,
      j = 0;

    for (let k = 0; k < lcs.length; k++) {
      while (i < originalWords.length && originalWords[i] !== lcs[k]) {
        diffResult.push(
          <span
            key={`delete-${i}`}
            style={{ textDecoration: "line-through", color: "red" }}
          >
            {originalWords[i]}{" "}
          </span>
        );
        i++;
      }
      while (j < editedWords.length && editedWords[j] !== lcs[k]) {
        diffResult.push(
          <span
            key={`insert-${j}`}
            style={{ backgroundColor: "yellow", textDecoration: "underline" }}
          >
            {editedWords[j]}{" "}
          </span>
        );
        j++;
      }
      diffResult.push(
        <span key={`word-${i}`} style={{ color: "black" }}>
          {lcs[k]}{" "}
        </span>
      );
      i++;
      j++;
    }

    while (i < originalWords.length) {
      diffResult.push(
        <span
          key={`delete-${i}`}
          style={{ textDecoration: "line-through", color: "red" }}
        >
          {originalWords[i]}{" "}
        </span>
      );
      i++;
    }
    while (j < editedWords.length) {
      diffResult.push(
        <span
          key={`insert-${j}`}
          style={{ backgroundColor: "yellow", textDecoration: "underline" }}
        >
          {editedWords[j]}{" "}
        </span>
      );
      j++;
    }

    return diffResult;
  };

  if (!mrn) {
    console.error("MRN is undefined");
    return;
  }

  const findLCS = (arr1: string[], arr2: string[]) => {
    const m = arr1.length;
    const n = arr2.length;
    const dp: number[][] = Array(m + 1)
      .fill(0)
      .map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (arr1[i - 1] === arr2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    const lcs: string[] = [];
    let i = m,
      j = n;
    while (i > 0 && j > 0) {
      if (arr1[i - 1] === arr2[j - 1]) {
        lcs.push(arr1[i - 1]);
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    return lcs.reverse();
  };

  if (showDiff) {
    let originalText = "";
    let editedText = "";

    if (!mrn) {
      console.error("MRN is undefined");
      return;
    }

    if (showAIFeatures && activeTab === 0) {
      originalText = originalBlankReplyAI;
      editedText = editedTextWithSpaces || blankReplyAI[mrn];
    } else if (showAIFeatures && activeTab === -2) {
      originalText = originalGeneratedReply;
      console.log("ogtext2", originalText);
      editedText = editedTextWithSpaces || generatedReplies[mrn || ""] || "";
      console.log("edt2", editedText);
    } else if (!showAIFeatures && activeTab < entry.aiReplies.length) {
      originalText = originalTabbedReply;
      editedText =
        editedTextWithSpaces || entry.aiReplies[activeTab]?.content || "";
    } else if (!showAIFeatures && activeTab === 3) {
      originalText = originalBlankReplyManual;
      editedText = editedTextWithSpaces || blankReplyManual[mrn];
    } else {
      console.error("Unhandled case for Show Diff");
      return null;
    }

    console.log("Original Text:", originalText);
    console.log("Edited Text:", editedText);

    const highlightedText = highlightDifferences(originalText, editedText);

    return (
      <div className="px-2 mt-10">
        <div className="mt-4 px-2">
          <h3>Original Text:</h3>
          <p>{originalText}</p>
          <h3 className="mt-4">Edited Text:</h3>
          <p>{highlightedText}</p>
        </div>
        <div className="flex gap-2 mt-4 mb-4">
          <>
            <button
              onClick={handleAccept}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Accept
            </button>
            <button
              onClick={handleRevert}
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              Revert
            </button>
          </>
        </div>
      </div>
    );
  }

  if (!entryData) {
    return <div className="p-6 text-gray-700">Message not found.</div>;
  }

  interface OptionToggleProps {
    label: string;
    optionKey: keyof AIEditOptions;
  }

  const OptionToggle: React.FC<OptionToggleProps> = ({ label, optionKey }) => (
    <div className="flex items-center justify-between mb-2">
      <span>{label}</span>
      <div className="flex">
        <button
          type="button"
          className={`px-3 py-1 rounded-l border border-purple-600 ${
            aiEditOptions[optionKey] === "low"
              ? "bg-purple-600 text-white"
              : "bg-white text-purple-600"
          }`}
          onClick={() => handleAIEditOptionChange(optionKey, "low")}
        >
          Low
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded-r border border-purple-600 ${
            aiEditOptions[optionKey] === "high"
              ? "bg-purple-600 text-white"
              : "bg-white text-purple-600"
          }`}
          onClick={() => handleAIEditOptionChange(optionKey, "high")}
        >
          High
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white overflow-auto">
      {isLoading && <LoadingSpinner />}
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-2">{entry.subject}</h2>
        <div className="text-sm text-gray-600">
          <div className="flex items-center">
            <span>Myname Surname &lt;myemail@mail.com&gt;</span>
            <svg
              className="w-4 h-4 ml-2 cursor-pointer"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={toggleReplySection}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
          </div>
          <div className="mr-4 mt-2 mb-5">To: {entry.to}</div>
         </div>
            <div className="flex flex-wrap">
              {entryData?.categories.map((category, index) => {
                let colorClass = "bg-blue-100 text-blue-800";
  
                if (category === "High Urgency") {
                  colorClass = "bg-red-100 text-red-800";
                } else if (category === "Medium Urgency") {
                  colorClass = "bg-orange-100 text-orange-800";
                } else if (category === "Low Urgency") {
                  colorClass = "bg-yellow-100 text-yellow-800";
                }
                return (
                  <span
                    key={index}
                    className={`inline-block ${colorClass} text-xs font-medium mr-2 px-2 py-1 rounded-full mb-2`}
                  >
                    {category}
                  </span>
                );
              })}
            </div>
        </div>
        {showReplySection && (
        <div>
          <div className="items-center px-4 pt-4">
            <h3 className="font-semibold text-gray-600 pb-2">
              Reply: (Click to Edit)
            </h3>
            {!showAIFeatures && (
              <small className="text-xs text-red-500 pb-2">
                Ctrl+Click to compare replies
              </small>
            )}
          </div>
          <div className="flex border-b">
            {showAIFeatures ? (
              <>
                <button
                  onClick={() => handleTabClick(0)}
                  className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                    activeTab === 0
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Start Blank
                </button>
                <button
                  onClick={() => handleTabClick(-1)}
                  className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                    activeTab === -1
                      ? "border-b-2 border-red-600 text-red-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Custom Points-to-Email
                </button>
                <button
                  onClick={() => handleTabClick(-3)}
                  className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                    activeTab === -3
                      ? "border-b-2 border-green-600 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  AI Points-to-Email
                </button>
                <button
                  onClick={() => (generateClicked ? handleTabClick(-2) : null)}
                  disabled={!generateClicked}
                  className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                    activeTab === -2
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  } ${!generateClicked ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  See Generated Reply
                </button>
              </>
            ) : (
              entry.aiReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={(e) => handleTabClick(index, e)}
                  className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                    activeTab === index
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {reply.label}
                </button>
              ))
            )}
            <SplitViewPopup />
            {!showAIFeatures && (
              <button
                onClick={() => handleTabClick(entry.aiReplies.length)}
                className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                  activeTab === entry.aiReplies.length
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Start Blank
              </button>
            )}
          </div>
          <div className="p-4">
            {showAIFeatures && activeTab === 0 && (
              <div className="bg-white p-4 border rounded">
                <h3 className="font-semibold text-gray-600 mb-2">New Reply</h3>
                {isAIEditButtonClicked && (
                  <button
                    className="pb-2 text-red-600"
                    onClick={() => {
                      console.log("testing123");
                      setShowDiff(!showDiff);
                    }}
                  >
                    Show Diff
                  </button>
                )}
                <textarea
                  id="blankReplyTextarea"
                  className="w-full h-40 p-2 border rounded"
                  value={blankReplyAI[mrn]}
                  onChange={handleBlankReplyChange}
                  onSelect={handleTextSelect}
                  placeholder="Write your reply here..."
                />

        <div className="mt-2 flex gap-2">
        <button
          onClick={() => handleSendReply(blankReply)}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Send Reply
        </button>
        <button
          onClick={handleStartBlank}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Clear
        </button>
        <button
          onClick={() => {
            setShowAIEditModal(true);
            setIsAIEditButtonClicked(true);
          }}
          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
        >
          AI Edit
        </button>
        </div>
        </div>
        )}

        {showAIFeatures && activeTab === -2 && generateClicked && (
        <div className="bg-white p-4 border rounded">
        <h3 className="font-semibold text-gray-600 mb-2">Generated AI Reply</h3>
        {isAIEditButtonClicked && (
        <button className="pb-2 text-red-600" onClick={() => {console.log("testing123"); setShowDiff(!showDiff)}}>Show Diff</button>
        )}
        <textarea
        className="w-full h-40 p-2 border rounded mt-1 bg-gray-50 mb-1"
        value={generatedReply} 
        onChange={(e) => handleAIReplyChange(-2, e.target.value)} 
        readOnly 
        />
        <button
          onClick={() => handleSendReply(generatedReply)}
          className="bg-blue-600 text-white px-4 py-1 mr-2 rounded hover:bg-blue-700"
        >
          Send Reply
        </button>
        <button
          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
        >
          Regenerate
        </button>
        {showAIFeatures && (
        <button
        onClick={() => {
          setShowAIEditModal(true);
          setIsAIEditButtonClicked(true);
        }}
        className="ml-2 bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
        >
        AI Edit
        </button>          
        )}
        <div className="relative mt-3">
        
        </div>
        {showRating[activeTab] && (
        <>
          <div className="mt-3">
            <label className="text-sm font-medium text-gray-700">Rating:</label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingChange(activeTab, star)}
                  className={`text-xl ${ratings[activeTab] >= star ? "text-yellow-500" : "text-gray-300"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <label className="text-sm font-medium text-gray-700">Provide detailed feedback:</label>
            <textarea
              className="w-full p-2 border rounded mt-1 bg-gray-50"
              value={feedback[activeTab]}
              onChange={(e) => handleFeedbackChange(activeTab, e.target.value)}
              placeholder="Optional: Share more thoughts..."
            />
          </div>
          <div className="mt-3">
            <button
              onClick={handleSubmitRating}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </>
        )}
        </div>
        )}

        {showAIFeatures && (activeTab === -1) && (
        <div className="bg-white p-4 border rounded">
        <h3 className="font-semibold text-gray-600 mb-2">Set AI Instructions</h3>
        <div
        className="space-y-2"
        style={{
        maxHeight: '100px',
        overflowY: 'auto', 
        }}
        >
        {instructionOptions.map((instruction, index) => (
        <label key={index} className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={selectedInstructions.includes(instruction)}
            onChange={() => handleInstructionToggle(instruction)}
          />
          <span className="ml-2">{instruction}</span>
        </label>
        ))}
        </div>
        <textarea
        className="w-full p-2 border rounded mt-4"
        placeholder="Add your own instruction..."
        value={customInstruction}
        onChange={(e) => setCustomInstruction(e.target.value)}
        />
        <div className="flex gap-2 mt-2">
        <button
        onClick={handleGenerateReplyClick}
        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
        Generate AI Reply
        </button>

        </div>
        </div>
        )}
        {!showAIFeatures && activeTab < entry.aiReplies.length && (
        <>
        {
        isAIEditButtonClicked && (
          <button className="pb-2 text-red-600" onClick={() => {console.log("testing123"); setShowDiff(!showDiff)}}>Show Diff</button>
        )
        }
        <textarea
        className="w-full h-40 p-2 border rounded mt-1 bg-gray-50 mb-1"
        value={aiEditedContent || entry.aiReplies[activeTab]?.content}
        onChange={(e) => handleAIReplyChange(activeTab, e.target.value)}
        readOnly={aiEditedContent ? true : false}
        />
        <div className="flex gap-2 mt-2">
        <button
          onClick={() => handleSendReply(entry.aiReplies[activeTab].content, true)}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Send Reply
        </button>
        <button
          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
        >
          Regenerate
        </button>
        <button
          onClick={() => {
            setShowAIEditModal(true);
            setIsAIEditButtonClicked(true);
          }}
          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
        >
          AI Edit
        </button>
        </div>
        <div className="relative mt-3">
       
        </div>
        {showRating[activeTab] && (
        <>
          <div className="mt-3">
            <label className="text-sm font-medium text-gray-700">Rating:</label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingChange(activeTab, star)}
                  className={`text-xl ${ratings[activeTab] >= star ? "text-yellow-500" : "text-gray-300"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <label className="text-sm font-medium text-gray-700">Provide detailed feedback:</label>
            <textarea
              className="w-full p-2 border rounded mt-1 bg-gray-50"
              value={feedback[activeTab]}
              onChange={(e) => handleFeedbackChange(activeTab, e.target.value)}
              placeholder="Optional: Share more thoughts..."
            />
          </div>
          <div className="mt-3">
            <button
              onClick={handleSubmitRating}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </>
        )}
        </>
        )}
        {!showAIFeatures && activeTab==3 && (
        <div className="bg-white p-4 border rounded">
        <h3 className="font-semibold text-gray-600 mb-2">New Reply</h3>
        {isAIEditButtonClicked && (
        <button className="pb-2 text-red-600" onClick={() => {console.log("testing123"); setShowDiff(!showDiff)}}>Show Diff</button>
        )}
        <textarea
        id="blankReplyTextarea"
        className="w-full h-40 p-2 border rounded"
        value={blankReply}
        onChange={handleBlankReplyChange}
        onSelect={handleTextSelect}
        placeholder="Write your reply here..."
        />

        <div className="mt-2 flex gap-2">
        <button
        onClick={() => handleSendReply(blankReply)}
        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
        Send Reply
        </button>
        <button
        onClick={handleStartBlank}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
        Clear
        </button>
        <button
          onClick={() => {
            setShowAIEditModal(true);
            setIsAIEditButtonClicked(true);
          }}
          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
        >
          AI Edit
        </button>
        </div>

        </div>
        )}
        </div>

        <div className="flex-grow p-4 overflow-auto bg-gray-100">
          {sentReplies.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-600 mb-4 text-lg">Replies</h3>
              {sentReplies
                .filter((sent) => sent.emailId === entryData?.mrn)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((sent, index) => (
                  <div
                    key={index}
                    className="border rounded-lg bg-white shadow-sm p-4 mb-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center text-white font-bold mr-3">
                        T
                      </div>
                      <div>
                        <p className="font-semibold">You</p>
                        <p className="text-xs text-gray-500">
                          {new Date(sent.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-800">{sent.content}</p>
                  </div>
                ))}
            </div>
          )}
          <div className="border rounded-lg bg-white shadow-sm p-4 mb-6">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold mr-3">
                {entryData?.fromUser.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{entryData?.fromUser}</p>
                <p className="text-xs text-gray-500">
                  {new Date(entryData?.dateReceived).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-800">{entryData?.message}</p>
          </div>
        </div>
          <div className="mt-10">
            <Link to="/" className="ml-5 text-blue-500 hover:underline">
              Back to Inbox
            </Link>
          </div>
          <div className="flex border-b mt-6"></div>
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">Confirmation</h2>
                <p>Your email has been sent successfully!</p>
                <button
                  onClick={closeModal}
                  className="mt-4 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {showRatingModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">Rating Submitted</h2>
                <p>Thank you for your feedback!</p>
                <button
                  onClick={handleCloseRatingModal}
                  className="mt-4 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {showAIEditModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-lg w-80 relative">
                <button
                  type="button"
                  onClick={() => setShowAIEditModal(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                  aria-label="Close"
                >
                  ×
                </button>
                <h2 className="text-lg font-bold mb-4">AI Edit Options</h2>
                <div className="space-y-2">
                  {((activeTab === 3 && !showAIFeatures) ||
                    (activeTab === 0 && showAIFeatures)) && (
                    <OptionToggle label="Grammar" optionKey="grammar" />
                  )}
                  <OptionToggle label="Empathy" optionKey="empathy" />
                  {((activeTab === 3 && !showAIFeatures) ||
                    (activeTab === 0 && showAIFeatures)) && (
                    <OptionToggle label="Clarity" optionKey="clarity" />
                  )}
                  <OptionToggle
                    label="Professionalism"
                    optionKey="professionalism"
                  />
                  <OptionToggle
                    label="Health Literacy"
                    optionKey="healthLiteracy"
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleAIEditSubmit}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  >
                    Apply Edits
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      ;
    </div>
  );
};

export default App;
