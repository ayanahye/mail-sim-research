import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate } from 'react-router-dom';

/*
type ApiResponse = {
  message: string;
};
*/

function App() {
  //const [data, setData] = useState<ApiResponse | null>(null);

  // the categories should correspond to what the nurse has to do in response to the patient query and the urgency

  const dummyData = [
    { 
      mrn: "123456", 
      lastName: "Smith", 
      firstName: "John", 
      dob: "01/01/1980", 
      subject: "Lab Results", 
      dateReceived: "12/18/2024", 
      fromUser: "Dr. Doe", 
      message: "I am very worried about my lab results. Why am I still waiting? I need answers!", 
      categories: ["Urgent Response", "Follow-up", "High Urgency"],
      aiReplies: [
        { 
          label: "Empathetic Reply", 
          content: "Dear John,\n\nI completely understand how stressful this must be for you, and I’m so sorry for the delay. Your results are important, and we're doing everything we can to get them to you as soon as possible. Please hang in there, and we’ll update you shortly.\n\nKind regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
        },
        { 
          label: "Direct Reply", 
          content: "Hi John,\n\nWe are currently processing your lab results. You will receive an update once they are available. Please rest assured that we are actively working on them.\n\nBest regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
        },
        { 
          label: "Reassurance Reply", 
          content: "Hello John,\n\nI know waiting for results can be nerve-wracking, but please know that your results are a priority for us. We are closely monitoring the situation and will notify you immediately once they are ready. You are in good hands.\n\nWarm regards,\nNurse Anna\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Anna.*"
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
      fromUser: "Nurse Joy", 
      message: "My prescription is missing, and I have been waiting for days. What is going on?", 
      categories: ["Prescription Issue", "High Urgency", "Follow-up"],
      aiReplies: [
        { 
          label: "Empathetic Reply", 
          content: "Dear Jane,\n\nI am so sorry for the frustration this delay has caused. I completely understand how important your prescription is. Let me look into this right away and ensure it is processed as quickly as possible.\n\nSincerely,\nNurse Joy\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Joy.*"
        },
        { 
          label: "Direct Reply", 
          content: "Hi Jane,\n\nWe are aware of the missing prescription and are currently working to resolve the issue. I will follow up with the pharmacy to ensure it is sent out as soon as possible.\n\nBest,\nNurse Joy\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Joy.*"
        },
        { 
          label: "Reassurance Reply", 
          content: "Hello Jane,\n\nI completely understand your concern, and I want to assure you that we’re prioritizing this issue. I’m checking with the pharmacy now, and you’ll be receiving your prescription soon. Thanks for your patience.\n\nKind regards,\nNurse Joy\n\n*This email was drafted with AI assistance and reviewed/approved by Nurse Joy.*"
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
      fromUser: "Dr. Smith", 
      message: "Why haven’t I received any updates? I am anxious about my condition.", 
      categories: ["General Inquiry", "Medium Urgency", "Clarification Needed"],
      aiReplies: [
        { 
          label: "Empathetic Reply", 
          content: "Hi Charlie,\n\nI completely understand your concern. It’s very natural to feel anxious when waiting for updates. I’m currently reviewing your case and will provide you with an update as soon as I have more information. Hang in there.\n\nBest regards,\nDr. Smith\n\n*This email was drafted with AI assistance and reviewed/approved by Dr. Smith.*"
        },
        { 
          label: "Direct Reply", 
          content: "Hello Charlie,\n\nI’m aware that you’re waiting for updates on your condition. We’re still awaiting results, and I’ll be sure to inform you once we have the necessary information.\n\nSincerely,\nDr. Smith\n\n*This email was drafted with AI assistance and reviewed/approved by Dr. Smith.*"
        },
        { 
          label: "Reassurance Reply", 
          content: "Dear Charlie,\n\nI understand how difficult it can be to wait for updates. Rest assured, we are closely monitoring your condition and will provide you with any updates as soon as we have them. You’re being taken care of.\n\nWarm regards,\nDr. Smith\n\n*This email was drafted with AI assistance and reviewed/approved by Dr. Smith.*"
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
      fromUser: "Dr. White", 
      message: "The image upload process was confusing. I am not sure if I did it right.", 
      categories: ["Image Upload Assistance", "Medium Urgency", "Clarification Needed"],
      aiReplies: [
        { 
          label: "Empathetic Reply", 
          content: "Dear Emily,\n\nI completely understand how frustrating technical issues can be, especially when you're trying to do everything right. Let’s work together to make sure your image is properly uploaded. I’ll guide you through the process step-by-step.\n\nKind regards,\nDr. White\n\n*This email was drafted with AI assistance and reviewed/approved by Dr. White.*"
        },
        { 
          label: "Direct Reply", 
          content: "Hi Emily,\n\nI’ve checked your image upload, and it appears that everything is in order. If you’d like, I can walk you through the steps again to ensure there are no issues.\n\nBest regards,\nDr. White\n\n*This email was drafted with AI assistance and reviewed/approved by Dr. White.*"
        },
        { 
          label: "Reassurance Reply", 
          content: "Hello Emily,\n\nDon’t worry, your image has been uploaded successfully. If you need any help with the process, I’m here to assist you and ensure everything is done correctly.\n\nSincerely,\nDr. White\n\n*This email was drafted with AI assistance and reviewed/approved by Dr. White.*"
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
      fromUser: "Receptionist", 
      message: "I have submitted all documents, but I haven't heard back yet. Please confirm if everything is okay.", 
      categories: ["Document Submission", "Low Urgency", "Follow-up"],
      aiReplies: [
        { 
          label: "Empathetic Reply", 
          content: "Dear Chris,\n\nI understand how concerning it can be to wait for confirmation. Thank you for submitting your documents. I’m reviewing everything now and will confirm as soon as possible.\n\nSincerely,\nReceptionist\n\n*This email was drafted with AI assistance and reviewed/approved by Receptionist.*"
        },
        { 
          label: "Direct Reply", 
          content: "Hi Chris,\n\nAll documents have been submitted and are currently under review. You will be notified once everything has been processed.\n\nBest regards,\nReceptionist\n\n*This email was drafted with AI assistance and reviewed/approved by Receptionist.*"
        },
        { 
          label: "Reassurance Reply", 
          content: "Hello Chris,\n\nThank you for submitting everything! I want to assure you that we have received your documents, and everything looks great. You’ll hear from us soon regarding the next steps.\n\nKind regards,\nReceptionist\n\n*This email was drafted with AI assistance and reviewed/approved by Receptionist.*"
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
              <Route path="/message/:mrn" element={<MessageDetail dummyData={dummyData} />} />
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
          </tr>
        </thead>
        <tbody>
          {dummyData.map((entry, index) => (
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
                {entry.categories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2 py-1 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// typescript...

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

const MessageDetail: React.FC<MessageDetailProps> = ({ dummyData }) => {
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

  const handleRateButtonClick = (index: number) => {
    setShowRating((prev) => ({
      ...prev,
      [index]: !prev[index],
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: keyof EntryState) => {
    setEntry({
      ...entry,
      [field]: e.target.value,
    });
  };

  const handleSendReply = (replyContent: string, isAIReply: boolean = false) => {
    console.log("send Reply clicked");
    if (isAIReply && replyContent.trim()) {
      setSentReplies((prevReplies) => [
        ...prevReplies,
        { content: replyContent, timestamp: new Date() },
      ]);
      const updatedReplies = entry.aiReplies.map(reply => {
        if (reply.content === replyContent) {
          return { ...reply, content: reply.content };
        }
        return reply;
      });
      setEntry({ ...entry, aiReplies: updatedReplies });
    } 
    else if (!isAIReply && entry.reply.trim()) {
      setSentReplies((prevReplies) => [
        ...prevReplies,
        { content: entry.reply, timestamp: new Date() },
      ]);
    } else {
      console.error("Reply cannot be empty");
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
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
          {entryData.categories.map((category, index) => (
            <span
              key={index}
              className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2 py-1 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-white p-4 border rounded mt-4">
        <label className="font-semibold text-gray-700">Generated Replies (Click to edit):</label>
        {entry.aiReplies.map((reply, index) => (
          <div key={index} className="mb-3">
            <p className="text-sm font-semibold text-blue-600 mt-4">{reply.label}:</p>
            <textarea
              className="w-full h-40 p-2 border rounded mt-1 bg-gray-50"
              value={reply.content}
              onChange={(e) => handleAIReplyChange(index, e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleSendReply(reply.content, true)}
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

            <button
              onClick={() => handleRateButtonClick(index)}
              className="mt-3 inline-flex items-center text-black py-1 cursor-pointer"
            >
              Rate this Reply
              <span
                className={`ml-2 transform ${showRating[index] ? 'rotate-180' : 'rotate-0'} transition-transform`}
              >
                ▼
              </span>
            </button>
            {showRating[index] && (
              <div className="mt-3">
                <label className="text-sm font-medium text-gray-700">Rating:</label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingChange(index, star)}
                      className={`text-xl ${ratings[index] >= star ? "text-yellow-500" : "text-gray-300"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            )}
            {showRating[index] && (
              <div className="mt-3">
                <label className="text-sm font-medium text-gray-700">Provide detailed feedback:</label>
                <textarea
                  className="w-full p-2 border rounded mt-1 bg-gray-50"
                  value={feedback[index]}
                  onChange={(e) => handleFeedbackChange(index, e.target.value)}
                  placeholder="Optional: Share more thoughts..."
                />
              </div>
            )}
            {showRating[index] && (
              <div className="mt-3">
                <button
                  onClick={() => {}}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="bg-white p-4 border rounded mt-4">
        <label className="font-semibold text-gray-700">Your Reply:</label>
        <textarea
          className="w-full h-24 p-2 border rounded mt-1 bg-gray-50"
          value={entry.reply}
          onChange={(e) => handleInputChange(e, "reply")}
          placeholder="Write your reply here..."
        />
        <button
          onClick={() => {
            if (entry.reply.trim()) {
              handleSendReply(entry.reply);
            } else {
              console.error("Reply cannot be empty");
            }
          }}
          className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Send Reply
        </button>
      </div>
      <div className="mt-5">
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Inbox
        </Link>
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
    </div>
  );
};


export default App;
