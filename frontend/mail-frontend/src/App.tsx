import { useState } from 'react';
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

  const [showAIFeatures, setShowAIFeatures] = useState<boolean>(true);

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
          content: "Dear John,\n\nI’m truly sorry to hear how this delay has been impacting you. I completely understand how stressful it is to wait for important results. Please know that we’re prioritizing your case, and I’ll personally ensure you’re updated as soon as we have any information. Thank you for your patience during this difficult time.\n\nWarm regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
        },
        { 
          label: "Direct Reply", 
          content: "Hi John,\n\nYour lab results are still being processed. I completely understand the urgency, and I’ll notify you immediately once they are ready. Please rest assured that we’re working to get this resolved for you as quickly as possible.\n\nBest regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
        },
        { 
          label: "Reassurance Reply", 
          content: "Hello John,\n\nI understand how frustrating this wait must be, and I want to reassure you that your results are a priority for us. We’re actively monitoring the situation and will reach out as soon as the information is available. You are in good hands, and I appreciate your patience.\n\nKind regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
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
          content: "Dear Jane,\n\nI’m so sorry for the distress and inconvenience this has caused. I completely understand how important your medication is and how frustrating delays can be. I’m looking into this immediately and will ensure it is resolved as quickly as possible. Your trust is very important to us, and we’ll do everything we can to make this right.\n\nSincerely,\nNurse Joy\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Joy.*"
        },
        { 
          label: "Direct Reply", 
          content: "Hi Jane,\n\nI understand how critical your medication is, and I apologize for the delay. I’ve already reached out to the pharmacy and will follow up with you as soon as I have an update. Thank you for bringing this to my attention.\n\nBest regards,\nNurse Joy\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Joy.*"
        },
        { 
          label: "Reassurance Reply", 
          content: "Hello Jane,\n\nI completely understand your frustration and want to assure you that we’re working to resolve this issue as a top priority. I’m in contact with the pharmacy to ensure your medication is sent out immediately. Thank you for your patience as we address this.\n\nKind regards,\nNurse Joy\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Joy.*"
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
          content: "Hi Charlie,\n\nI’m so sorry for the anxiety this is causing you. It’s absolutely understandable to feel this way, and I want to reassure you that your case is important to us. I’m reviewing your file now and will provide you with an update as soon as I have more information. You are not being forgotten.\n\nWarm regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
        },
        { 
          label: "Direct Reply", 
          content: "Hello Charlie,\n\nI understand your concerns. Your condition is being monitored closely, and I’ll notify you as soon as there are any updates. Thank you for your patience while we work through this.\n\nSincerely,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
        },
        { 
          label: "Reassurance Reply", 
          content: "Dear Charlie,\n\nI completely understand how stressful waiting can be. Please know that we’re actively working on your case, and I’ll ensure you receive updates as soon as we have them. You’re in good hands, and we’re here to support you.\n\nKind regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
        }
      ]
    },
    { 
      mrn: "456789", 
      lastName: "Johnson", 
      firstName: "Emily", 
      dob: "04/04/1995", 
      subject: "Image Upload", 
      dateReceived: "12/15/2024", 
      fromUser: "Patient", 
      message: "I tried to follow the instructions for uploading the images, but the process was so confusing and frustrating that I’m not even sure I did it correctly. I feel like I wasted hours trying to figure it out, and now I’m worried that I’ve made a mistake that could delay my care. This whole experience has been overwhelming and stressful. I don’t understand why something so important has to be so difficult. I need help making sure everything is correct because I can’t afford for there to be any delays. This has been such a frustrating experience, and I just want to know that someone is there to help me.",
      categories: ["Image Upload Assistance", "Medium Urgency", "Clarification Needed"],
      aiReplies: [
        { 
          label: "Empathetic Reply", 
          content: "Dear Emily,\n\nI’m so sorry to hear that the process was confusing. I completely understand how important it is to ensure your images are uploaded correctly. Let’s work together to verify everything and make sure there are no delays in your care. I’m here to help.\n\nWarm regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
        },
        { 
          label: "Direct Reply", 
          content: "Hi Emily,\n\nI’ve reviewed your upload, and everything seems to be in order. If you’d like, I can guide you through the steps again to make sure there are no issues. Let me know how I can assist you further.\n\nBest regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
        },
        { 
          label: "Reassurance Reply", 
          content: "Hello Emily,\n\nI want to assure you that your images have been received and uploaded successfully. If you have any concerns or would like assistance, please don’t hesitate to reach out. I’m happy to help.\n\nKind regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
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
          content: "Dear Chris,\n\nI understand how stressful it can be to wait for confirmation. Thank you for letting me know. I’ll review your documents immediately and confirm everything for you. Please don’t worry—we’ll make sure everything is in order.\n\nSincerely,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
        },
        { 
          label: "Direct Reply", 
          content: "Hi Chris,\n\nYour documents have been received and are currently under review. I’ll notify you as soon as everything is processed. Thank you for your patience.\n\nBest regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
        },
        { 
          label: "Reassurance Reply", 
          content: "Hello Chris,\n\nI want to let you know that your documents have been received and everything looks great. You’ll hear from us soon regarding the next steps. Thank you for keeping us updated.\n\nKind regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
        }
      ]
    }
  ];  
  
  
// notes:
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gray-200 text-gray-800 p-3 flex justify-between items-center border-b fixed top-0 left-0 right-0 z-10">
        <h1 className="text-lg font-medium">Inbox Messaging System</h1>
        <div className='flex items-center space-x-6'>
          <ToggleSwitch isOn={showAIFeatures} onToggle={() => setShowAIFeatures(!showAIFeatures)} label="AI Features Mode 2" />
        </div>
        <nav className="space-x-6">
          <Link to="/" className="text-gray-800 hover:text-blue-600">Inbox</Link>
          <Link to="/settings" className="text-gray-800 hover:text-blue-600">Settings</Link>
        </nav>
      </header>
        <div className="flex flex-1 pt-12">
          <aside className="w-1/6 bg-gray-100 border-r">
            <div className="bg-blue-200 border-b p-3 text-center font-semibold">Categories</div>
            <nav className="overflow-y-auto">
              {[
                { label: "Labs/Diag - 8", id: "labs" },
                { label: "Prescriptions - 6", id: "prescriptions" },
                { label: "Messages - 5", id: "messages" },
                { label: "Images - 5", id: "images" },
                { label: "Documents - 0", id: "documents" },
                { label: "Patient Portal - 5", id: "portal" },
                { label: "Scheduled", id: "scheduled" },
                { label: "Unmatched - 0", id: "unmatched" },
                { label: "Sent Items - 0", id: "sentItems" },
              ].map((item) => (
                <button
                  key={item.id}
                  className={`block p-3 text-left w-full hover:bg-blue-100 border-b transition-colors ${
                    item.id === "messages" ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>
          <main className="w-5/6 bg-white overflow-auto">
            <Routes>
              <Route path="/" element={<Inbox dummyData={dummyData} />} />
              <Route path="/message/:mrn" element={<MessageDetail dummyData={dummyData} showAIFeatures={showAIFeatures}/>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

type AIReply = {
  label: string;
  content: string;
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

  const handleRowClick = (entry: InboxEntry) => {
    navigate(`/message/${entry.mrn}`);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High Urgency':
        return 'bg-red-500 text-white';
      case 'Medium Urgency':
        return 'bg-orange-500 text-black';
      case 'Low Urgency':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const getUrgency = (categories: string[]) => {
    const urgencyTags = ['High Urgency', 'Medium Urgency', 'Low Urgency'];
    return categories.find(category => urgencyTags.includes(category)) || 'N/A';
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Inbox Overview</h2>
      <table className="w-full border-collapse text-sm bg-gray-50">
        <thead>
          <tr className="bg-blue-100 text-gray-700">
            <th className="border p-2 text-left">MRN</th>
            <th className="border p-2 text-left">Last Name</th>
            <th className="border p-2 text-left">First Name</th>
            <th className="border p-2 text-left">DOB</th>
            <th className="border p-2 text-left">Subject</th>
            <th className="border p-2 text-left">Date Received</th>
            <th className="border p-2 text-left">From User</th>
            <th className="border p-2 text-left">Categories</th>
            <th className='border p-2 text-left'>Urgency</th>
          </tr>
        </thead>
        <tbody>
        {dummyData.map((entry, index) => {
            const urgency = getUrgency(entry.categories);
            const urgencyColor = getUrgencyColor(urgency);
            const filteredCategories = entry.categories.filter(category => !['High Urgency', 'Medium Urgency', 'Low Urgency'].includes(category));
            
            return (
              <tr
                key={entry.mrn}
                className={`cursor-pointer hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
                onClick={() => handleRowClick(entry)}
              >
                <td className="border p-2">{entry.mrn}</td>
                <td className="border p-2">{entry.lastName}</td>
                <td className="border p-2">{entry.firstName}</td>
                <td className="border p-2">{entry.dob}</td>
                <td className="border p-2">{entry.subject}</td>
                <td className="border p-2">{entry.dateReceived}</td>
                <td className="border p-2">{entry.fromUser}</td>
                <td className="border p-2">
                  {filteredCategories.map((category, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2 py-1 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </td>
                <td className="border p-2">
                  <span className={`inline-block ${urgencyColor} text-xs font-medium px-2 py-1 rounded-full`}>
                    {urgency}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// typescript...

type MessageDetailProps = {
  dummyData: InboxEntry[];
  showAIFeatures: boolean;
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

const MessageDetail: React.FC<MessageDetailProps> = ({ dummyData, showAIFeatures }) => {
  const { mrn } = useParams();
  const entryData = dummyData.find((item) => item.mrn === mrn);

  const [entry, setEntry] = useState<EntryState>({
    to: entryData ? `${entryData.firstName} ${entryData.lastName}` : "",
    subject: entryData ? entryData.subject : "Patient Message",
    reply: "",
    aiReplies: entryData?.aiReplies || [],
  });

  const [showModal, setShowModal] = useState(false);
  const [sentReplies, setSentReplies] = useState<{ content: string; timestamp: Date }[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [showRating, setShowRating] = useState<{ [key: number]: boolean }>({});
  const [activeTab, setActiveTab] = useState<number>(0);
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

  // updated one

  const [showAIEditModal, setShowAIEditModal] = useState<boolean>(false);
  const [aiEditOptions, setAIEditOptions] = useState<AIEditOptions>({
    grammar: true,
    empathy: true,
    clarity: true,
    professionalism: true
  });
  const [instructionOptions, setInstructionOptions] = useState([
    "Provide updates on the status of tests or results.",
    "Follow up on referrals or consultations with other departments.",
    "Clarify any next steps or actions for the patient.",
    "Confirm appointment details or reschedule if necessary."
  ]);  

  const handleAIEditOptionChange = (option: keyof AIEditOptions): void => {
    setAIEditOptions(prev => ({...prev, [option]: !prev[option]}));  //toggle
  };

  const handleAIEditSubmit = (): void => {
    console.log("todo endpoint:", aiEditOptions);
    setShowAIEditModal(false);
  };

  
  const handleInstructionToggle = (instruction: string): void => {
    setSelectedInstructions(prev =>
      prev.includes(instruction)
        ? prev.filter(item => item !== instruction) 
        : [...prev, instruction] 
    );
  };  
  
  const handleTabClick = (index: number) => {
    setActiveTab(index);
    if (index === entry.aiReplies.length) {
      setShowBlankReplyForm(true);
    } else {
      setShowBlankReplyForm(false);
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
    if (replyContent.trim()) {
      setSentReplies((prevReplies) => [
        ...prevReplies,
        { content: replyContent, timestamp: new Date() },
      ]);
      if (isAIReply) {
        const updatedReplies = entry.aiReplies.map(reply => {
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
      console.error("Reply cannot be empty");
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
  };

  const handleTextSelect = () => {
    const textarea = document.getElementById('blankReplyTextarea') as HTMLTextAreaElement;
    setSelectedText({ start: textarea.selectionStart, end: textarea.selectionEnd });
  };

  const handleGenerateReplyClick = () => {
    setGeneratedReply("Here is the generated reply"); 
    setGenerateClicked(true); 
    handleTabClick(-2);
    if (customInstruction.trim() && !selectedInstructions.includes(customInstruction)) {
      setSelectedInstructions((prev) => [...prev, customInstruction]);
      setInstructionOptions((prev) => [...prev, customInstruction]);
      setCustomInstruction(""); 
    }
  };

  if (!entryData) {
    return <div className="p-6 text-gray-700">Message not found.</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-5 text-gray-800">Message Details</h2>
      <div className="mb-4">
        <label className="font-semibold text-gray-600">To:</label>
        <input
          className="border w-full p-2 mt-1 text-blue-700 rounded"
          value={entry.to}
          readOnly
        />
      </div>
      <div className="mb-4">
        <label className="font-semibold text-gray-600">Subject:</label>
        <input
          className="border w-full p-2 mt-1 text-gray-700 rounded"
          value={`RE: ${entry.subject}`}
          readOnly
        />
      </div>
      <div className="bg-gray-100 p-4 mb-4 border rounded">
        <label className="font-semibold text-gray-600">Patient Message:</label>
        <p className="text-sm text-gray-700">{entryData.message}</p>
      </div>
      <div className="mt-6 bg-gray-50 p-4 border rounded">
        <h3 className="font-semibold text-gray-600">Sent Replies</h3>
        {sentReplies.length > 0 ? (
          sentReplies.map((sent, index) => (
            <div key={index} className="mt-2 border-b">
              <p className="text-sm text-gray-700 mb-2">{sent.content}</p>
              <p className="text-xs text-gray-500 mb-2">
                Sent at {sent.timestamp.toLocaleTimeString()} on{" "}
                {sent.timestamp.toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">No replies sent yet.</p>
        )}
      </div>
      <div className="mb-4 mt-4">
        <label className="font-semibold text-gray-600">Categories:</label>
        <div className='flex justify-between items-start'>
          <div className="mt-2 flex flex-wrap">
            {entryData.categories.map((category, index) => {
              let colorClass = 'bg-blue-100 text-blue-800';
              
              if (category === 'High Urgency') {
                colorClass = 'bg-red-500 text-white';
              } else if (category === 'Medium Urgency') {
                colorClass = 'bg-orange-500 text-white';
              } else if (category === 'Low Urgency') {
                colorClass = 'bg-yellow-500 text-black';
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
      </div>
      <div className="mt-6 bg-white border rounded shadow">

      <div className="flex justify-between items-center px-4 pt-4">
        <h3 className="font-semibold text-gray-600">Reply: (Click to Edit)</h3>
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
            onClick={() => handleTabClick(index)}
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
              onClick={() => setShowAIEditModal(true)}
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
          <textarea
            className="w-full h-40 p-2 border rounded mt-1 bg-gray-50 mb-1"
            value={generatedReply} 
            onChange={(e) => handleAIReplyChange(-2, e.target.value)} 
            readOnly 
          />
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              Regenerate
            </button>
            {showAIFeatures && (
            <button
              onClick={() => setShowAIEditModal(true)}
              className="bg-purple-600 text-white px-3 py-1 ml-2 rounded hover:bg-purple-700"
            >
              AI Edit
            </button>
          )}
            <div className="relative mt-3">
            <button
              onClick={() => handleRateButtonClick(activeTab)}
              className="inline-flex items-center text-black py-1 cursor-pointer"
            >
              Rate this Reply
              <span
                className={`ml-2 transform ${showRating[activeTab] ? 'rotate-180' : 'rotate-0'} transition-transform`}
              >
                ▼
              </span>
            </button>
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
          {showAIFeatures && (
            <button
              onClick={() => setShowAIEditModal(true)}
              className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
            >
              AI Edit
            </button>
          )}
        </div>
      </div>
      )}
      {!showAIFeatures && activeTab < entry.aiReplies.length && (
        <>
          <textarea
            className="w-full h-40 p-2 border rounded mt-1 bg-gray-50"
            value={entry.aiReplies[activeTab].content}
            onChange={(e) => handleAIReplyChange(activeTab, e.target.value)}
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
            
          </div>
          <div className="relative mt-3">
            <button
              onClick={() => handleRateButtonClick(activeTab)}
              className="inline-flex items-center text-black py-1 cursor-pointer"
            >
              Rate this Reply
              <span
                className={`ml-2 transform ${showRating[activeTab] ? 'rotate-180' : 'rotate-0'} transition-transform`}
              >
                ▼
              </span>
            </button>
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
        </div>
      </div>
      )}
    </div>
    </div>
        <div className="mt-10">
          <Link to="/" className="text-blue-500 hover:underline">
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
  ); 
};

export default App;
