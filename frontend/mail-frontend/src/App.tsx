import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate } from 'react-router-dom';
import './App.css';
/*
type ApiResponse = {
  message: string;
};
*/

function App() {
  //const [data, setData] = useState<ApiResponse | null>(null);
  // the categories should correspond to what the nurse has to do in response to the patient query and the urgency

  const BACKEND_URL = "http://localhost:5000";

  const dummyData = [
    { 
      mrn: "123456", 
      lastName: "Smith", 
      firstName: "John", 
      dob: "01/01/1980", 
      subject: "Lab Results", 
      dateReceived: "12/18/2024", 
      aiReplies: [],
      fromUser: "Dr. Doe", 
      message: "I am very worried about my lab results. Why am I still waiting? I need answers!", 
      categories: ["Urgent Response", "Follow-up", "High Urgency"],
      negativeMessages: [
        "Well I am not a religious person, I hope and expect that you will spend eternity in hell. You are an abusive, nasty, cheap person.",
        "I would ask that you go ahead and prescribe the Lasix as I will be raising he** about the poor communication here.",
        "Are you just put out with what’s going on? This is serious to me and I am very concerned about it. If this is how you’re feeling about my issue, then fu** it. You’re not the one that is experiencing it!!!"
      ]
    },
    { 
      mrn: "234567", 
      lastName: "Doe", 
      firstName: "Jane", 
      dob: "02/02/1985", 
      subject: "Prescription", 
      dateReceived: "12/17/2024", 
      aiReplies: [],
      fromUser: "Nurse Joy", 
      message: "My prescription is missing, and I have been waiting for days. What is going on?", 
      categories: ["Prescription Issue", "High Urgency", "Follow-up"],
      negativeMessages: [
        "This is ridiculous! Why is my prescription missing? I shouldn’t have to chase this down, and I will raise hell if this isn’t fixed immediately.",
        "You’re telling me I have to wait even longer? I’ve been waiting for days and now you’re giving me excuses. Enough is enough!"
      ]
    },
    { 
      mrn: "345678", 
      lastName: "Brown", 
      firstName: "Charlie", 
      dob: "03/03/1990", 
      subject: "Message", 
      dateReceived: "12/16/2024", 
      aiReplies: [],
      fromUser: "Dr. Smith", 
      message: "Why haven’t I received any updates? I am anxious about my condition.", 
      categories: ["General Inquiry", "Medium Urgency", "Clarification Needed"],
      negativeMessages: [
        "I have been waiting for too long! How hard is it to get a simple update? Why hasn’t anyone contacted me? I’m seriously frustrated right now.",
        "I can’t believe I haven’t received any updates yet. If this is how you handle urgent cases, I’m losing trust in this whole process."
      ]
    },
    { 
      mrn: "456789", 
      lastName: "Johnson", 
      firstName: "Emily", 
      dob: "04/04/1995", 
      subject: "Image Upload", 
      dateReceived: "12/15/2024", 
      aiReplies: [],
      fromUser: "Dr. White", 
      message: "The image upload process was confusing. I am not sure if I did it right.", 
      categories: ["Image Upload Assistance", "Medium Urgency", "Clarification Needed"],
      negativeMessages: [
        "This is unbelievable! How hard can it be to upload a simple image? Why is this process so complicated?",
        "I’m getting fed up with this! I can’t believe I had trouble just uploading an image. This should be much simpler."
      ]
    },
    { 
      mrn: "567890", 
      lastName: "Lee", 
      firstName: "Chris", 
      dob: "05/05/2000", 
      subject: "Document", 
      dateReceived: "12/14/2024", 
      aiReplies: [],
      fromUser: "Receptionist", 
      message: "I have submitted all documents, but I haven't heard back yet. Please confirm if everything is okay.", 
      categories: ["Document Submission", "Low Urgency", "Follow-up"],
      negativeMessages: [
        "Why am I still waiting? I submitted everything days ago and still haven’t heard back. This is extremely frustrating!",
        "I’ve been patient, but this is ridiculous. Why haven’t I received any updates? I want a response now!"
      ]
    }
  ];

  const [dataWithReplies, setDataWithReplies] = useState<InboxEntry[]>(dummyData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generateAllAIReplies() {
      const totalEntries = dummyData.length;
      let completedEntries = 0;

      for (const entry of dummyData) {
        if (entry.negativeMessages.length > 0 && entry.aiReplies.length === 0) {
          const patientMessage = entry.negativeMessages[0];
          try {
            const response = await fetch(`${BACKEND_URL}/api/get-ai-replies`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ patientMessage }),
            });

            if (response.ok) {
              const { aiReplies } = await response.json();
              setDataWithReplies(prevData => 
                prevData.map(item => 
                  item.mrn === entry.mrn ? { ...item, aiReplies } : item
                )
              );
            }
          } catch (error) {
            console.error("Error fetching AI replies:", error);
          }
        }
        
        completedEntries++;
        if (completedEntries === totalEntries) {
          setLoading(false);
        }
      }
    }

    generateAllAIReplies();
  }, []);
  
// notes:
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gray-200 text-gray-800 p-3 flex justify-between items-center border-b fixed top-0 left-0 right-0 z-10">
        <h1 className="text-lg font-medium">Inbox Messaging System</h1>
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
              <Route path="/" element={<Inbox dummyData={dataWithReplies} />} />
              <Route path="/message/:mrn" element={<MessageDetail dummyData={dataWithReplies} />} />
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
  negativeMessages: string[];
  categories: string[];
  aiReplies: AIReply[];
};

type InboxProps = {
  dummyData: InboxEntry[];
};

type MessageDetailProps = {
  dummyData: InboxEntry[];
};

type EntryState = {
  to: string;
  subject: string;
  reply: string;
  aiReplies: AIReply[];
};

type Rating = number; 
type Feedback = string;

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

const MessageDetail: React.FC<MessageDetailProps> = ({ dummyData }) => {
  const { mrn } = useParams();
  const entryData = dummyData.find((item) => item.mrn === mrn);

  const [entry, setEntry] = useState<EntryState>({
    to: entryData ? `${entryData.firstName} ${entryData.lastName}` : "",
    subject: entryData ? entryData.subject : "Patient Message",
    reply: "",
    aiReplies: entryData ? entryData.aiReplies : [],
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [sentReplies, setSentReplies] = useState<{ content: string; timestamp: Date }[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [showRating, setShowRating] = useState<{ [key: number]: boolean }>({});
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    if (entryData && entryData.aiReplies?.length > 0) {
      setLoading(false);
      setEntry((prev) => ({
        ...prev,
        aiReplies: entryData.aiReplies,
      }));
    }
  }, [entryData]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const handleSendReply = (replyContent: string, isAIReply = false) => {
    if ((isAIReply && replyContent.trim()) || (!isAIReply && entry.reply.trim())) {
      setSentReplies((prev) => [
        ...prev,
        { content: replyContent || entry.reply, timestamp: new Date() },
      ]);

      if (isAIReply) {
        const updatedReplies = entry.aiReplies.map((reply) =>
          reply.content === replyContent ? { ...reply, content: replyContent } : reply
        );
        setEntry({ ...entry, aiReplies: updatedReplies });
      }

      setShowModal(true);
    } else {
      console.error("Reply cannot be empty");
    }
  };

  const handleCloseModal = () => setShowModal(false);

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

  const handleAIReplyChange = (index: number, newContent: string) => {
    const updatedReplies = [...entry.aiReplies];
    updatedReplies[index].content = newContent;
    setEntry({ ...entry, aiReplies: updatedReplies });
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
        <div className="mt-2">
          {entryData.categories.map((category, index) => {
            const colorClass = {
              "High Urgency": "bg-red-500 text-white",
              "Medium Urgency": "bg-orange-500 text-white",
              "Low Urgency": "bg-yellow-500 text-black",
            }[category] || "bg-blue-100 text-blue-800";

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
      {loading ? (
        <div className="loading-overlay">
          <div className="flex justify-center items-center">
            <div>
              <div className="loading-message text-white">Loading</div>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6 bg-white border rounded shadow">
            <div className="flex border-b">
              {entry.aiReplies.map((reply, index) => (
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
              ))}
            </div>

            <div className="p-4">
              {entry.aiReplies[activeTab] && (
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
                    <button className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                      Regenerate
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
      <div className="bg-white p-4 border rounded mt-4">
        <label className="font-semibold text-gray-700">Your Reply:</label>
        <textarea
          className="w-full h-24 p-2 border rounded mt-1 bg-gray-50"
          value={entry.reply}
          onChange={(e) => setEntry({ ...entry, reply: e.target.value })}
          placeholder="Write your reply here..."
        />
        <button
          onClick={() => handleSendReply(entry.reply)}
          className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Send Reply
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirmation</h2>
            <p>Your reply has been sent successfully!</p>
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
