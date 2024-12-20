import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate } from 'react-router-dom';

type ApiResponse = {
  message: string;
};

function App() {
  const [data, setData] = useState<ApiResponse | null>(null);

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
          content: "I completely understand how stressful this must be for you, and I’m so sorry for the delay. Your results are important, and we're doing everything we can to get them to you as soon as possible. Please hang in there, and we’ll update you shortly."
        },
        { 
          label: "Direct Reply", 
          content: "We are currently processing your lab results. You will receive an update once they are available. Please rest assured that we are actively working on them."
        },
        { 
          label: "Reassurance Reply", 
          content: "I know waiting for results can be nerve-wracking, but please know that your results are a priority for us. We are closely monitoring the situation and will notify you immediately once they are ready. You are in good hands."
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
          content: "I am so sorry for the frustration this delay has caused. I completely understand how important your prescription is. Let me look into this right away and ensure it is processed as quickly as possible."
        },
        { 
          label: "Direct Reply", 
          content: "We are aware of the missing prescription and are currently working to resolve the issue. I will follow up with the pharmacy to ensure it is sent out as soon as possible."
        },
        { 
          label: "Reassurance Reply", 
          content: "I completely understand your concern, and I want to assure you that we’re prioritizing this issue. I’m checking with the pharmacy now, and you’ll be receiving your prescription soon. Thanks for your patience."
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
          content: "I completely understand your concern. It’s very natural to feel anxious when waiting for updates. I’m currently reviewing your case and will provide you with an update as soon as I have more information. Hang in there."
        },
        { 
          label: "Direct Reply", 
          content: "I’m aware that you’re waiting for updates on your condition. We’re still awaiting results, and I’ll be sure to inform you once we have the necessary information."
        },
        { 
          label: "Reassurance Reply", 
          content: "I understand how difficult it can be to wait for updates. Rest assured, we are closely monitoring your condition and will provide you with any updates as soon as we have them. You’re being taken care of."
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
          content: "I completely understand how frustrating technical issues can be, especially when you're trying to do everything right. Let’s work together to make sure your image is properly uploaded. I’ll guide you through the process step-by-step."
        },
        { 
          label: "Direct Reply", 
          content: "I’ve checked your image upload, and it appears that everything is in order. If you’d like, I can walk you through the steps again to ensure there are no issues."
        },
        { 
          label: "Reassurance Reply", 
          content: "Don’t worry, your image has been uploaded successfully. If you need any help with the process, I’m here to assist you and ensure everything is done correctly."
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
          content: "I understand how concerning it can be to wait for confirmation. Thank you for submitting your documents. I’m reviewing everything now and will confirm as soon as possible."
        },
        { 
          label: "Direct Reply", 
          content: "All documents have been submitted and are currently under review. You will be notified once everything has been processed."
        },
        { 
          label: "Reassurance Reply", 
          content: "Thank you for submitting everything! I want to assure you that we have received your documents, and everything looks great. You’ll hear from us soon regarding the next steps."
        }
      ]
    },
  ];
  

  return (
    <Router>
      <div className="min-h-screen flex flex-col m-1">
        <div className="flex flex-1">
          <div className="w-1/4 bg-white flex flex-col pr-1">
            <div className="bg-blue-200 border-2 border-blue-500 p-2 text-center">
              <p className="font-semibold">Inbox</p>
            </div>
            <div className="flex-1 bg-white border-b-2 border-x-2 border-blue-500 overflow-y-auto">
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
                  className={`p-2 border-b border-gray-300 w-full text-left hover:bg-gray-100 ${item.id === "messages" ? "bg-blue-400 text-white border-blue-600 hover:text-black" : "bg-white"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="w-3/4 border-2 border-gray-300 overflow-auto">
            <Routes>
              <Route
                path="/"
                element={<Inbox dummyData={dummyData} />}
              />
              <Route
                path="/message/:mrn"
                element={<MessageDetail dummyData={dummyData} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

type InboxProps = {
  dummyData: any[];
};

const Inbox = ({ dummyData }: InboxProps) => {
  const navigate = useNavigate();

  const handleRowClick = (entry: any) => {
    navigate(`/message/${entry.mrn}`);
  };

  return (
    <div className="w-full p-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-white">
            <th className="border-b border-gray-400 p-2 text-left">MRN</th>
            <th className="border-b border-gray-400 p-2 text-left">Last Name</th>
            <th className="border-b border-gray-400 p-2 text-left">First Name</th>
            <th className="border-b border-gray-400 p-2 text-left">DOB</th>
            <th className="border-b border-gray-400 p-2 text-left">Subject</th>
            <th className="border-b border-gray-400 p-2 text-left">Date Received</th>
            <th className="border-b border-gray-400 p-2 text-left">From User</th>
            <th className="border-b border-gray-400 p-2 text-left text-blue-400">Categories</th>
          </tr>
        </thead>
        <tbody>
          {dummyData.map((entry, index) => (
            <tr
              key={entry.mrn}
              className={`${index % 2 === 0 ? "bg-blue-100" : "bg-white"} cursor-pointer hover:bg-blue-200`}
              onClick={() => handleRowClick(entry)}
            >
              <td className="border-b border-gray-300 p-2">{entry.mrn}</td>
              <td className="border-b border-gray-300 p-2">{entry.lastName}</td>
              <td className="border-b border-gray-300 p-2">{entry.firstName}</td>
              <td className="border-b border-gray-300 p-2">{entry.dob}</td>
              <td className="border-b border-gray-300 p-2">{entry.subject}</td>
              <td className="border-b border-gray-300 p-2">{entry.dateReceived}</td>
              <td className="border-b border-gray-300 p-2">{entry.fromUser}</td>
              <td className="border-b border-gray-300 p-2">
              {entry.categories.map((category, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-200 text-blue-800 text-xs font-medium mr-2 px-2 py-1 rounded-full text-center"
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

type MessageDetailProps = {
  dummyData: any[];
};

const MessageDetail = ({ dummyData }: MessageDetailProps) => {
  const { mrn } = useParams(); // get MRN from URL params
  const entryData = dummyData.find((item) => item.mrn === mrn);

  const [entry, setEntry] = useState({
    to: entryData ? `${entryData.firstName} ${entryData.lastName}` : "",
    subject: entryData ? entryData.subject : "Patient Message",
    reply: "",
    aiReplies: entryData?.aiReplies || [],
  });

  const handleInputChange = (e, field) => {
    setEntry({
      ...entry,
      [field]: e.target.value,
    });
  };

  const handleAIReplyChange = (index, newContent) => {
    const updatedReplies = [...entry.aiReplies];
    updatedReplies[index].content = newContent;
    setEntry({ ...entry, aiReplies: updatedReplies });
  };

  if (!entryData) {
    return <div>Message not found.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-5">Message Details</h2>
      <div className="flex items-center mb-4">
        <p className="w-20"><strong>To:</strong></p>
        <input
          className="ml-4 border border-4 border-gray-300 px-2 w-64 text-blue-600"
          value={entry.to}
          readOnly
        />
      </div>
      
      <div className="flex items-center mb-4">
        <p className="w-20"><strong>Subject:</strong></p>
        <input
          className="ml-4 border border-4 border-gray-300 px-2 w-64"
          value={'RE: ' + entry.subject}
          readOnly
        />
      </div>
      <div className="bg-gray-100 p-4 mb-4 border border-gray-300 rounded">
        <p><strong>Patient Message:</strong></p>
        <p>{entryData.message}</p>
      </div>
      <div className="mb-4">
        <strong className='text-blue-400'>Categories:</strong>
        <div className="mt-2">
          {entryData.categories.map((category, index) => (
            <span
              key={index}
              className="inline-block bg-blue-200 text-blue-800 text-xs font-medium mr-2 px-2 py-1 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-white p-4 border border-blue-400 rounded mt-4">
        <p className='mb-4'><strong>Generated Replies: (Click to edit)</strong></p>
        {entry.aiReplies.map((reply, index) => (
          <div key={index} className="mb-3">
            <p className='mb-4 text-blue-400 text-md'><strong>{reply.label}:</strong></p>
            <textarea
              className="w-full p-2 border border-gray-300 bg-blue-100"
              value={reply.content}
              onChange={(e) => handleAIReplyChange(index, e.target.value)}
            />
            <button
              
              className=" mt-4 bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-200 hover:text-black"
            >
              Send Reply
            </button>
            <button
              
              className=" mt-4 bg-blue-500 text-white py-1 px-2 rounded ml-3 hover:bg-blue-200 hover:text-black"
            >
              Regenerate
            </button>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 border border-blue-400 rounded mt-4">
        <p className='mb-4'><strong>Your Reply:</strong></p>
        <textarea
          className="w-full h-24 p-2 border border-gray-300"
          value={entry.reply}
          onChange={(e) => handleInputChange(e, "reply")}
          placeholder="Write your reply here..."
        />
        <button className=" mt-4 bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-200 hover:text-black">
          Send Reply
        </button>
      </div>
      <div className="mt-5">
        <Link to="/" className="mt-4 bg-blue-200 text-black p-2 rounded">
          Back to Inbox
        </Link>
      </div>
    </div>
  );
};


export default App;
