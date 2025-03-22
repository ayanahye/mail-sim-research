import { useState, useEffect, createContext, useContext } from 'react';
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
  //const [data, setData] = useState<ApiResponse | null>(null);

  // the categories should correspond to what the nurse has to do in response to the patient query and the urgency
  const [inboxWidth, setInboxWidth] = useState(40); // 40% as default

  const [showAIFeatures, setShowAIFeatures] = useState<boolean>(true);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    const newWidth = (e.clientX / window.innerWidth) * 100;
    setInboxWidth(Math.min(Math.max(newWidth, 20), 80)); 
  };
  
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  // ugh this 

  const dummyData = [
    { 
      mrn: "123456", 
      lastName: "Smith", 
      firstName: "John", 
      dob: "01/01/1980", 
      subject: "Lab Results", 
      dateReceived: "12/18/2024", 
      fromUser: "Patient", 
      message: "I’ve been waiting for my lab results for what feels like forever, and it’s starting to take a serious toll on me. I’m losing sleep, I can’t focus at work, and the uncertainty is just too much to bear. I don’t understand why it’s taking this long, and honestly, it feels like no one even cares about how stressful this is for me. I’ve reached out multiple times, but I haven’t gotten any clear answers. I just want to know what’s happening and when I’ll get the results. Please, I need someone to take this seriously and give me some clarity. I can’t handle this waiting anymore.",
      categories: ["Urgent Response", "Follow-up", "High Urgency"],
      aiReplies: [
        { 
          label: "Empathetic Reply", 
          content: "Dear John,\n\nI’m truly sorry to hear how this delay has been impacting you. I completely understand how stressful it is to wait for important results. Please know that we’re prioritizing your case, and I’ll personally ensure you’re updated as soon as we have any information. Thank you for your patience during this difficult time.\n\nWarm regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*",
          AIEdits: {
            content: "Dear John,\n\nI truly understand the stress and anxiety you must be feeling as you await your results. Please know that your concerns are being heard, and we are prioritizing your case. We are actively working to provide you with the information you need, and I will ensure you’re promptly updated. Thank you for your patience and understanding during this challenging time.\n\nWarm regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
          }
        },
        { 
          label: "Direct Reply", 
          content: "Hi John,\n\nYour lab results are still being processed. I completely understand the urgency, and I’ll notify you immediately once they are ready. Please rest assured that we’re working to get this resolved for you as quickly as possible.\n\nBest regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*",
          AIEdits: {
            content: "Hi John,\n\nI completely understand how important these results are to you, and I sincerely apologize for the delay. Rest assured, I am actively following up on your case and will notify you as soon as the results are available. Your patience is greatly appreciated.\n\nBest regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
          }
        },
        { 
          label: "Reassurance Reply", 
          content: "Hello John,\n\nI understand how frustrating this wait must be, and I want to reassure you that your results are a priority for us. We’re actively monitoring the situation and will reach out as soon as the information is available. You are in good hands, and I appreciate your patience.\n\nKind regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*",
          AIEdits: {
            content: "Hello John,\n\nI truly understand how stressful this waiting period is, and I want to assure you that we’re doing everything we can to prioritize your results. We’re actively monitoring the situation and will be in touch as soon as we have more information. Your patience and trust mean a great deal to us.\n\nKind regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
          }
        }
      ]
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
            <h1 className="text-lg font-semibold">Outlook AI</h1>
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
  categories: string[];
  aiReplies: AIReply[];
};

type InboxProps = {
  dummyData: InboxEntry[];
};

const Inbox: React.FC<InboxProps> = ({ dummyData }) => {
  const navigate = useNavigate();
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

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

  return (
    <div className="h-full overflow-auto">
      <div className="sticky top-0 bg-white p-2 border-b flex items-center mt-2">
        <input type="checkbox" className="mr-2" />
        <button className="text-gray-600 hover:text-black mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </button>
        <button className="text-gray-600 hover:text-black mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button className="text-gray-600 hover:text-black">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {dummyData.map((entry) => {
        const urgency = getUrgency(entry.categories);
        const urgencyIcon = getUrgencyIcon(urgency);
        
        return (
          <div
            key={entry.mrn}
            className={`flex items-center p-2 border-b hover:bg-blue-50 cursor-pointer ${selectedEntry === entry.mrn ? 'bg-blue-100' : ''}`}
            onClick={() => handleRowClick(entry)}
          >
            <input type="checkbox" className="mr-2" onClick={(e) => e.stopPropagation()} />
            <div className="w-6 text-center">{urgencyIcon}</div>
            <div className="flex-grow">
              <div className="flex ">
                <span className="font-semibold">{entry.fromUser}</span>
                <span className="text-sm text-gray-500 ml-10">{(entry.dateReceived)}</span>
              </div>
              <div className="flex ">
                <span className="text-sm font-medium truncate">{entry.subject}</span>
                <span className="flex text-sm text-gray-500 ml-5">{entry.categories.map(cat => `#${cat}`).join(' ')}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{entry.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// typescript...

type MessageDetailProps = {
  dummyData: InboxEntry[];
  //showAIFeatures: boolean;
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

const MessageDetail: React.FC<MessageDetailProps> = ({ dummyData }) => {
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
  const [blankReply, setBlankReply] = useState("");
  const [isBold, setIsBold] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [showBlankReplyForm, setShowBlankReplyForm] = useState(false);
  const [generateClicked, setGenerateClicked] = useState<boolean>(false);

  const [selectedText, setSelectedText] = useState({ start: 0, end: 0 });

  const [customInstruction, setCustomInstruction] = useState<string>("");
  const [selectedInstructions, setSelectedInstructions] = useState<Instruction[]>([]);
  const [generatedReply, setGeneratedReply] = useState<string>("");

  const [editedReply, setEditedReply] = useState<string>(entry.aiReplies[activeTab]?.content || "");
  const [aiEditedContent, setAiEditedContent] = useState<string>("");


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

  const handleAIEditOptionChange = (option: keyof AIEditOptions): void => {
    setAIEditOptions(prev => ({...prev, [option]: !prev[option]}));  //toggle
  };

  // update but no fix
  const handleAIEditSubmit = (): void => {
      if ((!showAIFeatures && (activeTab === 3)) || (showAIFeatures)) {
        console.log("hello")

        if (!(showAIFeatures && (activeTab != 0))) {
          setPrevBlankReply(blankReply);
        } else {
          // change this to the edited reply
          setPrevBlankReply(generatedReply);
        }

        setBlankReply("this is a test");
        setGeneratedReply("this is a test");
        setEditedText("this is a test");
        //console.log('aiEditedContent:', aiEditedContent); 
        //handleSendReply("this is a test");
      } else if (!showAIFeatures && (activeTab < 3)) {
        let contentToUpdate = entry.aiReplies[activeTab].AIEdits.content;
        
        const updatedReplies = [...entry.aiReplies];
        
        updatedReplies[activeTab] = {
          ...updatedReplies[activeTab],
          content: contentToUpdate
        };
  
        setEntry((prevState) => ({
          ...prevState,
          aiReplies: updatedReplies
        }));
  
        setEditedText(contentToUpdate); 
      }
      setShowAIEditModal(false);
    
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
            return { ...reply, content: reply.content }; 
          }
          return reply;
        });
  
        setEntry({ ...entry, aiReplies: updatedReplies });
      }
  
      setShowModal(true);
      setBlankReply("");
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
    setBlankReply("");
    setIsBold(false);
    setIsUnderline(false);
  };

  const handleBlankReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBlankReply(e.target.value);
    console.log('blankReply:', blankReply); 
    console.log('e.target.value:', e.target.value);
  };

  const handleTextSelect = () => {
    const textarea = document.getElementById('blankReplyTextarea') as HTMLTextAreaElement;
    setSelectedText({ start: textarea.selectionStart, end: textarea.selectionEnd });
  };

  const handleGenerateReplyClick = () => {
    setGeneratedReply("Here is the generated reply"); 
    setPrevInstructionsReply("Here is the generated reply");
    setGenerateClicked(true); 
    handleTabClick(-2);
    if (customInstruction.trim() && !selectedInstructions.includes(customInstruction)) {
      setSelectedInstructions((prev) => [...prev, customInstruction]);
      setInstructionOptions((prev) => [...prev, customInstruction]);
      setCustomInstruction(""); 
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

  const [showReplySection, setShowReplySection] = useState(false);

  const toggleReplySection = () => {
    setShowReplySection(!showReplySection);
  };

  // fix
  useEffect(() => {
    // update here need to modify when doing actuall llm integration
    //setOriginalText(entry.aiReplies[activeTab]?.content || "");
    setOriginalText(entry.aiReplies[activeTab]?.content || "");
    setEditedText(entry.aiReplies[activeTab]?.AIEdits?.content || "");
  }, [activeTab, entry.aiReplies]);

  // prevInstructionsReply

  const handleAccept = () => {
    if ((!showAIFeatures && activeTab < 3) || (showAIFeatures && activeTab === 0)) {
      if (showAIFeatures && activeTab === 0) {
        setPrevBlankReply(editedTextWithSpaces);
        setBlankReply(editedTextWithSpaces);
      } else {
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
    } else if (showAIFeatures && activeTab > 0) {
      setPrevOriginalText(editedTextWithSpaces);
      setPrevInstructionsReply(editedTextWithSpaces)
    } else {
      setPrevBlankReply(editedTextWithSpaces);
      setBlankReply(editedTextWithSpaces);
    }
    setIsAIEditButtonClicked(false);
    setShowDiff(false);
  };
  
  const handleRevert = () => {
    console.log("here test 36363636")
    console.log("act tab", activeTab);
    if ((!showAIFeatures && activeTab < 3) || (showAIFeatures && activeTab == 0)) {
      if (showAIFeatures && activeTab === 0) {
        setBlankReply(prevBlankReply);
        //setAiEditedContent(prevBlankReply);
      } else {
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
    } else if (showAIFeatures && activeTab == -2) {
      setPrevOriginalText(prevInstructionsReply);
      setGeneratedReply(prevInstructionsReply)
      setPrevInstructionsReply(prevInstructionsReply)
      console.log("here", prevInstructionsReply)
    } else {
      console.log("test 3")
      setBlankReply(prevBlankReply);
      //setAiEditedContent(prevBlankReply);
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
    console.log("blank reply", blankReply);
  
    let originalText = (!showAIFeatures && activeTab < 3) 
      ? prevOriginalText || ""  
      : (showAIFeatures && activeTab > 0) 
        ? prevInstructionsReply || "" 
        : prevBlankReply || "";
  
    let editedText = editedTextWithSpaces || "";
  
    console.log("test prev instructions", prevInstructionsReply);
    const highlightedText = highlightDifferences(originalText, editedText);
  
    console.log('even here');
  
    return (
      <div className='px-2 mt-10'>
        <h3>Make Additional Changes:</h3>
        <textarea value={editedText} onChange={(e) => {
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
        <div className="flex gap-2 mt-4">

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
        <button className="pb-2" onClick={() => {console.log("testing123"); setShowDiff(!showDiff)}}>Show Diff</button>
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

        {showAIFeatures && activeTab === -2 && generateClicked && (
        <div className="bg-white p-4 border rounded">
        <h3 className="font-semibold text-gray-600 mb-2">Generated AI Reply</h3>
        {isAIEditButtonClicked && (
        <button className="pb-2" onClick={() => {console.log("testing123"); setShowDiff(!showDiff)}}>Show Diff</button>
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
          <button className="pb-2" onClick={() => {console.log("testing123"); setShowDiff(!showDiff)}}>Show Diff</button>
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
        <button className="pb-2" onClick={() => {console.log("testing123"); setShowDiff(!showDiff)}}>Show Diff</button>
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

        <div className="flex-grow p-4 overflow-auto">
        {sentReplies.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-600 mb-2">Sent Replies</h3>
            {sentReplies
            .filter((sent) => sent.emailId === entryData?.mrn) 
            .slice()
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) 
            .map((sent, index) => (
              <div key={index} className="bg-blue-50 p-3 rounded mb-2 border">
                <p className="text-sm text-gray-700">{sent.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Sent at {new Date(sent.timestamp).toLocaleTimeString()} on{" "}
                  {new Date(sent.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}


          </div>
        )}
        <div className="bg-gray-50 p-4 rounded mb-4 border">
          <p className="text-sm text-gray-700">{entryData?.message}</p>
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
