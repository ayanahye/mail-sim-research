import { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate } from 'react-router-dom';

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
  setShowAIFeatures: (show: boolean) => void
}

const TabContext = createContext<TabContextValue | null>(null);

const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('TabContext is not provided');
  }
  return context;
};


const TabProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showAIFeatures, setShowAIFeatures] = useState(true);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab, showAIFeatures, setShowAIFeatures }}>
      {children}
    </TabContext.Provider>
  );
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle, label }) => (
  <div className="flex items-center">
    <span className="mr-2 text-sm">{label}</span>
    <div
      className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer ${
        isOn ? 'bg-green-400' : 'bg-gray-300'
      }`}
      onClick={onToggle}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
          isOn ? 'translate-x-4' : ''
        }`}
      />
    </div>
  </div>
);

function App() {
  const BACKEND_URL = "http://localhost:5000";

  const [inboxWidth, setInboxWidth] = useState(40); // 40% as default
  const [data, setData] = useState<InboxEntry[]>([]);
  const [queue, setQueue] = useState<Omit<InboxEntry, "categories" | "aiReplies">[]>([]);

  const [isLoading, setIsLoading] = useState(false)

  const newMessages: Omit<InboxEntry, "categories" | "aiReplies">[] = [
    {
      mrn: "123456",
      lastName: "Smith",
      firstName: "John",
      dob: "01/01/1980",
      subject: "Lab Results",
      dateReceived: "12/18/2024",
      fromUser: "Patient",
      message: "I’ve been waiting for my lab results for what feels like forever...",
    },
    {
      mrn: "234567",
      lastName: "Doe",
      firstName: "Jane",
      dob: "02/02/1985",
      subject: "Prescription",
      dateReceived: "12/17/2024",
      fromUser: "Patient",
      message:
        "This situation with my missing prescription has been absolutely unacceptable...",
    },
  ];

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const newWidth = (e.clientX / window.innerWidth) * 100;
    setInboxWidth(Math.min(Math.max(newWidth, 20), 80));
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const fetchCategoriesAndReplies = async (email: Omit<InboxEntry, "categories" | "aiReplies">) => {
    try {
      
      const response = await fetch(`${BACKEND_URL}/api/get-ai-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientMessage: email.message }),
      });

      if (!response.ok) throw new Error("failed to fetch AI-generated data");

      const result = await response.json();

      const newEntry: InboxEntry = {
        ...email,
        categories: result.categories, 
        aiReplies: result.aiReplies.map((reply: any) => ({
          label: reply.label,
          content: reply.content,
          AIEdits: reply.AIEdits || { content: "" }, 
        })),
      };

      setData((prevData) =>
        prevData.map((entry) =>
          entry.mrn === email.mrn ? newEntry : entry
        )
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const initializedMessages: InboxEntry[] = newMessages.map((message) => ({
      ...message,
      categories: [],
      aiReplies: [], 
    }));


    setData(initializedMessages);

    setQueue(newMessages);
  }, []);

  useEffect(() => {
    if (queue.length === 0) return; 

    const message = queue[0]; 

    fetchCategoriesAndReplies(message); 

    setQueue((prevQueue) => prevQueue.slice(1)); 
  }, [queue]);
  


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
              <Inbox dummyData={data} />
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
                <Route path="/message/:mrn" element={<MessageDetail dummyData={data} isLoading={isLoading} setIsLoading={setIsLoading} />} />
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

  // rm testing---
  useEffect(() => {
    setTimeout(() => {
      setInboxData(dummyData);
      setLoading(false);
    }, 1000);
  }, [dummyData]);

  const handleRowClick = (entry: InboxEntry) => {
    setSelectedEntry(entry.mrn);
    navigate(`/message/${entry.mrn}`);
  };


  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'High Urgency':
        return '🔴';
      case 'Medium Urgency':
        return '🟠';
      case 'Low Urgency':
        return '🟡';
      default:
        return '';
    }
  };

  const getUrgency = (categories: string[]) => {
    const urgencyTags = ['High Urgency', 'Medium Urgency', 'Low Urgency'];
    return categories.find(category => urgencyTags.includes(category)) || '';
  };

  const processedData = useMemo(() => {
    return inboxData.map((entry) => ({
      ...entry,
      urgency: getUrgency(entry.categories),
      urgencyIcon: getUrgencyIcon(getUrgency(entry.categories)),
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
                  {entry.categories.map((cat) => `#${cat}`).join(" ")}
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
};

type Rating = number; 
type Feedback = string;
type Instruction = string;

interface AIEditOptions {
  grammar: boolean;
  empathy: boolean;
  clarity: boolean;
  professionalism: boolean;
}

// logic to implement geenrated rpely function differ for both modes todo--integration not yet started

const MessageDetail: React.FC<MessageDetailProps> = ({ dummyData, isLoading, setIsLoading }) => {
  const { mrn } = useParams();
  const entryData = dummyData.find((item) => item.mrn === mrn);

  const { activeTab, setActiveTab, showAIFeatures, setShowAIFeatures } = useTabContext();

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
  //const [activeTab, setActiveTab] = useState<number>(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  //const [blankReply, setBlankReply] = useState("");

  const [blankReplyAI, setBlankReplyAI] = useState(""); 
  const [blankReplyManual, setBlankReplyManual] = useState(""); 

  const [isBold, setIsBold] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [showBlankReplyForm, setShowBlankReplyForm] = useState(false);
  const [generateClicked, setGenerateClicked] = useState<boolean>(false);

  const [selectedText, setSelectedText] = useState({ start: 0, end: 0 });

  const [customInstruction, setCustomInstruction] = useState<string>("");
  const [selectedInstructions, setSelectedInstructions] = useState<Instruction[]>([]);
  //const [generatedReply, setGeneratedReply] = useState<string>("");

  const [editedReply, setEditedReply] = useState<string>(entry.aiReplies[activeTab]?.content || "");
  const [aiEditedContent, setAiEditedContent] = useState<string>("");

  //const [isLoading, setIsLoading] = useState(false); // Global loading state

  // updated one

  const [showAIEditModal, setShowAIEditModal] = useState<boolean>(false);
  const [aiEditOptions, setAIEditOptions] = useState<AIEditOptions>({
    grammar: true,
    empathy: true,
    clarity: true,
    professionalism: true
  });

  const [cmdPressed, setCmdPressed] = useState(false);
  
  const [splitViewTab, setSplitViewTab] = useState<number | null>(null);
  const [showSplitView, setShowSplitView] = useState(false);

  const [isAIEditButtonClicked, setIsAIEditButtonClicked] = useState(false);
  // pre 
  const [instructionOptions, setInstructionOptions] = useState([
    "Provide updates on the status of tests or results.",
    "Follow up on referrals or consultations with other departments.",
    "Clarify any next steps or actions for the patient.",
    "Confirm appointment details or reschedule if necessary."
  ]);  

  const [generatedReplies, setGeneratedReplies] = useState<{ [key: string]: string }>({}); 
  const [isAIEditApplied, setIsAIEditApplied] = useState(false);

  const handleAIEditOptionChange = (option: keyof AIEditOptions): void => {
    setAIEditOptions(prev => ({...prev, [option]: !prev[option]}));  //toggle
  };

  // update but no fix
  const handleAIEditSubmit = async (): Promise<void> => {
    try {
      setIsLoading(true); 
      setShowAIEditModal(false);
      const patientMessage = entryData?.message || "";
      let aiReply = "";
      let updateStateCallback: (editedReply: string) => void;
  
      if (showAIFeatures && activeTab === 0) {
        // case - blank
        aiReply = blankReplyAI;
        updateStateCallback = (editedReply: string) => {
          setBlankReplyAI(editedReply);
          setEditedText(editedReply); 
        };
      } else if (showAIFeatures && activeTab === -2) {
        // case - generated edit
        aiReply = generatedReplies[mrn || ""] || "";
        updateStateCallback = (editedReply: string) => {
          setGeneratedReplies((prevReplies) => ({
            ...prevReplies,
            [mrn || ""]: editedReply, 
          }));
          setEditedText(editedReply); 
        };
      } else if (!showAIFeatures && activeTab < entry.aiReplies.length) {
         // case - ai replies tabbed
        aiReply = entry.aiReplies[activeTab]?.content || "";
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
        aiReply = blankReplyManual;
        updateStateCallback = (editedReply: string) => {
          setBlankReplyManual(editedReply);
          setEditedText(editedReply); 
        };
      } else {
        console.error("Unhandled case for AI Edit");
        return;
      }
  
      const response = await fetch(`${BACKEND_URL}/api/edit-ai-reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientMessage: entryData?.message || "",
          aiReply: editedText || entry.aiReplies[activeTab]?.content || "",
          editOptions: aiEditOptions,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to apply AI edits");
      }
  
      const result = await response.json();
      const editedReply = result?.editedReply?.content;
      console.log(editedReply);
  
      if (!editedReply) {
        console.error("No edited reply received from backend");
        return;
      }
  
      console.log("Edited Reply:", editedReply);

  
      updateStateCallback(editedReply);
      setEditedText(editedReply);
      setIsAIEditApplied(true); 
    } catch (error) {
      console.error("Error applying AI edits:", error);
    } finally {
      setIsLoading(false); 
    }
  };
  
  
  
  const handleInstructionToggle = (instruction: string): void => {
    setSelectedInstructions(prev =>
      prev.includes(instruction)
        ? prev.filter(item => item !== instruction) 
        : [...prev, instruction] 
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

  const handleTabClick = (tabIndex: number) => {
    setActiveTab(tabIndex);
    setShowSplitView(false);
  };

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

            <pre className="text-sm whitespace-pre-wrap mr-5 px-2">{currentTabContent}</pre>
          </div>
          <div className="w-full md:w-1/2">
            <button
              onClick={() => handleTabClick(splitViewTab as number)}
              className="text-sm font-bold mb-2 text-left w-full py-2 px-4 bg-blue-200 hover:bg-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded cursor-pointer border border-blue-500"
            >
              {entry.aiReplies[splitViewTab as number].label}
            </button>
            <pre className="text-sm whitespace-pre-wrap px-2">{selectedTabContent}</pre>
          </div>
        </div>
      </div>
    </div>
    );
  };

  const handleTabClick = (index: number, e?: React.MouseEvent<HTMLButtonElement>) => {
    if (!showAIFeatures && index !== activeTab && (index != 3 && activeTab != 3)) {
      if (e?.ctrlKey) {
        handleSplitView(index);
      }
      else {
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
  };

  const handleRateButtonClick = (index: number) => {
    setShowRating((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
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

  const handleSendReply = (replyContent: string, isAIReply: boolean = false) => {
    console.log("send Reply clicked");
  
    if (replyContent.trim() && entryData?.mrn) {  
      setSentReplies((prevReplies) => [
        ...prevReplies,
        { emailId: entryData.mrn, content: replyContent, timestamp: new Date() }
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
  
      if (showAIFeatures && activeTab === 0) {
        setBlankReplyAI(""); 
      } else if (!showAIFeatures && activeTab === 3) {
        setBlankReplyManual(""); 
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
  
    if (showAIFeatures && activeTab === 0) {
      setBlankReplyAI(""); 
    } else if (!showAIFeatures && activeTab === 3) {
      setBlankReplyManual(""); 
    }
  
    setIsBold(false); 
    setIsUnderline(false); 
  };
  

  const handleBlankReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
  
    if (showAIFeatures && activeTab === 0) {
      setBlankReplyAI(newValue);
      console.log('AI Blank Reply:', newValue);
    } else if (!showAIFeatures && activeTab === 3) {
      setBlankReplyManual(newValue);
      console.log('Manual Blank Reply:', newValue);
    } else {
      console.error("Unhandled case in handleBlankReplyChange");
    }
  };
  

  const handleTextSelect = () => {
    const textarea = document.getElementById('blankReplyTextarea') as HTMLTextAreaElement;
    setSelectedText({ start: textarea.selectionStart, end: textarea.selectionEnd });
  };

  const handleGenerateReplyClick = async () => {
    try {
      setIsLoading(true);
      if (!customInstruction.trim() && selectedInstructions.length === 0) {
        console.error("At least one instruction must be provided");
        return;
      }
  
      let updatedSelectedInstructions = [...selectedInstructions];
  
      if (customInstruction.trim() && !updatedSelectedInstructions.includes(customInstruction)) {
        updatedSelectedInstructions.push(customInstruction); 
        setInstructionOptions((prev) => [...prev, customInstruction]); 
        setCustomInstruction(""); 
      }
  
      const response = await fetch(`${BACKEND_URL}/api/provide-instructions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instructions: updatedSelectedInstructions, 
          patientMessage: entryData?.message || "",
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate reply");
      }
  
      const result = await response.json();
      const generatedReply = result?.generatedReply?.content;
  
      if (!generatedReply) {
        console.error("No reply received from backend");
        return;
      }
  
      setGeneratedReplies((prevReplies) => ({
        ...prevReplies,
        [mrn || ""]: generatedReply, 
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
  

  const BACKEND_URL = "http://localhost:5000";

  const handleRegenerateReply_mode1 = async (
    replyIndex: number, 
    currentReplyContent: string, 
    subject: string, 
    previousMessage: string,
    patientMessage: string 
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
      } else {
        setEntry((prevEntry) => ({
          ...prevEntry,
          aiReplies: prevEntry.aiReplies.map((reply, index) =>
            index === replyIndex ? { ...reply, content: regeneratedReply } : reply
          ),
        }));
      }
    } catch (error) {
      console.error("Error regenerating reply:", error);
    }  finally {
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
  
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  const [showDiff, setShowDiff] = useState(false);
  const [prevOriginalText, setPrevOriginalText] = useState(
    entryData?.aiReplies[0]?.content || ""
  );
  const [prevBlankReply, setPrevBlankReply] = useState("");
  const [prevInstructionsReply, setPrevInstructionsReply] = useState("");

  useEffect(() => {
    setPrevOriginalText(entryData?.aiReplies[activeTab]?.content || "");
  }, [activeTab, entryData]);
  

  const [originalText, setOriginalText] = useState(entry.aiReplies[activeTab]?.content || "");
  const [editedText, setEditedText] = useState(entry.aiReplies[activeTab]?.AIEdits?.content || "");  
  const [isAiEditClicked, setIsAiEditClicked] = useState(false);

  const editedTextWithSpaces = editedText.replace(/([.,!?;])/g, '$1 ');
  console.log("edited text here: ", editedTextWithSpaces)

  const [generatedReply, setGeneratedReply] = useState(""); 

  const [showReplySection, setShowReplySection] = useState(false);

  const toggleReplySection = () => {
    setShowReplySection(!showReplySection);
  };

  const LoadingSpinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
    </div>
  );
  

  // fix
  useEffect(() => {
    if (!isAIEditApplied) { 
      setOriginalText(entry.aiReplies[activeTab]?.content || "");
      setEditedText(entry.aiReplies[activeTab]?.AIEdits?.content || "");
    }
  }, [activeTab, entry.aiReplies]);
  
  

  // prevInstructionsReply

  const handleAccept = () => {
    if ((!showAIFeatures && activeTab < 3) || (showAIFeatures && activeTab === 0)) {
      if (showAIFeatures && activeTab === 0) {
        // blank
        setPrevBlankReply(blankReplyAI); 
        setBlankReplyAI(editedTextWithSpaces); 
      } else {
        // tabs
        setPrevOriginalText(editedTextWithSpaces);
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
      setPrevBlankReply(blankReplyManual); 
      setBlankReplyManual(editedTextWithSpaces); 
    } else {
      console.error("Unhandled case in handleAccept");
    }
  
    setIsAIEditButtonClicked(false);
    setShowDiff(false);
  };
  
  
  const handleRevert = () => {
    console.log("Reverting changes...");
    
    if ((!showAIFeatures && activeTab < 3) || (showAIFeatures && activeTab === 0)) {
      if (showAIFeatures && activeTab === 0) {
        // blank
        setBlankReplyAI(prevBlankReply); 
      } else {
        // tabs
        const updatedReplies = [...entry.aiReplies];
        updatedReplies[activeTab] = {
          ...updatedReplies[activeTab],
          content: prevOriginalText,
        };
        setEntry((prevState) => ({
          ...prevState,
          aiReplies: updatedReplies,
        }));
        setEditedText(prevOriginalText); 
      }
    } else if (showAIFeatures && activeTab === -2) {
      // gen
      setGeneratedReply(prevInstructionsReply); 
    } else if (!showAIFeatures && activeTab === 3) {
      // blank
      setBlankReplyManual(prevBlankReply); 
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

  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDragging(true);
    setStartY(e.clientY);
  };

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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedText(e.target.value);
  };

  const normalizeText = (text: string) => {
    return text.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
  };

  const highlightDifferences = (original: string, edited: string) => {
    const originalWords = original.trim().replace(/\s+/g, ' ').split(/\s+/);
    console.log("originalword", originalWords);

    const editedWords = edited.trim().replace(/\s+/g, ' ').split(/\s+/);

    const lcs = findLCS(originalWords, editedWords);
    const diffResult: JSX.Element[] = [];

    let i = 0, j = 0; // need to store only 2

    for (let k = 0; k < lcs.length; k++) {
      while (i < originalWords.length && originalWords[i] !== lcs[k]) {
        diffResult.push(
          <span key={`delete-${i}`} style={{ textDecoration: "line-through", color: "red" }}>
            {originalWords[i]}{" "}
          </span>
        );
        i++;
      }
      while (j < editedWords.length && editedWords[j] !== lcs[k]) {
        diffResult.push(
          <span key={`insert-${j}`} style={{ backgroundColor: "yellow", textDecoration: "underline" }}>
            {editedWords[j]}{" "}
          </span>
        );
        j++;
      }
      diffResult.push(<span key={`word-${i}`} style={{ color: "black" }}>{lcs[k]} </span>);
      i++;
      j++;
    }

    // Handle remaining words --debug from prev version
    while (i < originalWords.length) {
      diffResult.push(
        <span key={`delete-${i}`} style={{ textDecoration: "line-through", color: "red" }}>
          {originalWords[i]}{" "}
        </span>
      );
      i++;
    }
    while (j < editedWords.length) {
      diffResult.push(
        <span key={`insert-${j}`} style={{ backgroundColor: "yellow", textDecoration: "underline" }}>
          {editedWords[j]}{" "}
        </span>
      );
      j++;
    }

    return diffResult;
  };

  // Simplified LCS function  --debug
  const findLCS = (arr1: string[], arr2: string[]) => {
    const m = arr1.length;
    const n = arr2.length;
    const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

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
    let i = m, j = n;
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
    //console.log("blank reply", blankReply);
  
    let originalText = (!showAIFeatures && activeTab < 3) 
      ? prevOriginalText || ""  
      : (showAIFeatures && activeTab > 0) 
        ? prevInstructionsReply || "" 
        : prevBlankReply || "";
  
    let editedText = editedTextWithSpaces || "";
    console.log("edited text...:", editedText);
  
    console.log("test prev instructions", prevInstructionsReply);
    const highlightedText = highlightDifferences(originalText, editedText);
  
    console.log('even here');
  
    return (
      <div className='px-2 mt-10'>
        <h3>Make Additional Changes:</h3>
        <textarea defaultValue={editedTextWithSpaces || ""} onChange={(e) => {
          if (activeTab < 3) {
            handleTextChange(e);
          } else {
            setAiEditedContent(e.target.value);
          }
        }} className="w-full h-40 p-2 border rounded" />
        <div className="mt-4 px-2">
          <h3>Original Text:</h3>
          <p>{originalText}</p>
          <h3 className='mt-4'>Edited Text:</h3>
          <p>{highlightedText}</p>
        </div>
        <div className="flex gap-2 mt-4 mb-4">

            <>
              <button onClick={handleAccept} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">Accept</button>
              <button onClick={handleRevert} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">Revert</button>
            </>
          
        </div>
      </div>
    );
  }
  
  
  if (!entryData) {
    return <div className="p-6 text-gray-700">Message not found.</div>;
  }

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
        {!showReplySection && (
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
        )}
        {showReplySection && (
        <div>
        <div className="items-center px-4 pt-4">
          <h3 className="font-semibold text-gray-600 pb-2">Reply: (Click to Edit)</h3>
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
        Provide Instructions
        </button>
        <button
        onClick={() => generateClicked ? handleTabClick(-2) : null}
        disabled={!generateClicked}
        className={`px-4 py-2 font-medium text-sm focus:outline-none ${
          activeTab === -2
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        } ${!generateClicked ? 'cursor-not-allowed opacity-50' : ''}`}
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
        <button className="pb-2 text-red-600" onClick={() => {console.log("testing123"); setShowDiff(!showDiff)}}>Show Diff</button>
        )}
        <textarea
        id="blankReplyTextarea"
        className="w-full h-40 p-2 border rounded"
        value={blankReplyAI}
        onChange={handleBlankReplyChange}
        onSelect={handleTextSelect}
        placeholder="Write your reply here..."
        />

        <div className="mt-2 flex gap-2">
        <button
          onClick={() => handleSendReply(blankReplyAI)}
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
            value={generatedReplies[mrn || ""] || ""} // Display reply specific to this message
            onChange={(e) =>
              mrn &&
              setGeneratedReplies((prevReplies) => ({
                ...prevReplies,
                [mrn]: e.target.value, // Allow editing of reply for this specific message
              }))
            }
            readOnly={!showAIFeatures} // Make it editable only if AI features are enabled
          />
        <button
          onClick={() => handleSendReply(generatedReplies[mrn || ""] || "")}
          className="bg-blue-600 text-white px-4 py-1 mr-2 rounded hover:bg-blue-700"
        >
          Send Reply
        </button>
        <button
          onClick={() =>
            handleRegenerateReply_mode1(
              activeTab, 
              generatedReplies[mrn || ""] || "", 
              entryData?.subject || "", 
              entry.aiReplies[activeTab - 1]?.content || "", 
              entryData?.message || ""
            )
          }
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
          <button className="pb-2 text-red-600" onClick={() => {console.log("testing123"); setShowDiff(!showDiff)}}>Show Diff Test</button>
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
        onClick={() =>
          handleRegenerateReply_mode1(
            activeTab, 
            entry.aiReplies[activeTab]?.content || "", 
            entry.subject || "", 
            entry.aiReplies[activeTab - 1]?.content || "", 
            entryData?.message || "" 
          )
        }
      >
        Regenerate here
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
        value={blankReplyManual} 
        onChange={handleBlankReplyChange}
        onSelect={handleTextSelect}
        placeholder="Write your reply here..."
        />

        <div className="mt-2 flex gap-2">
        <button
        onClick={() => handleSendReply(blankReplyManual)}
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
          <div className="flex border-b mt-6">
      </div>
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
              <div className="bg-white p-6 rounded shadow-lg w-80">
                <h2 className="text-lg font-bold mb-4">AI Edit Options</h2>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox" checked={aiEditOptions.grammar} onChange={() => handleAIEditOptionChange('grammar')} />
                    <span className="ml-2">Grammar</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox" checked={aiEditOptions.empathy} onChange={() => handleAIEditOptionChange('empathy')} />
                    <span className="ml-2">Empathy</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox" checked={aiEditOptions.clarity} onChange={() => handleAIEditOptionChange('clarity')} />
                    <span className="ml-2">Clarity</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox" checked={aiEditOptions.professionalism} onChange={() => handleAIEditOptionChange('professionalism')} />
                    <span className="ml-2">Professionalism</span>
                  </label>
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
          )};
      </div>
    ); 
};

export default App;
