import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate } from 'react-router-dom';

type ApiResponse = {
  message: string;
};

function App() {
  const [data, setData] = useState<ApiResponse | null>(null);

  const dummyData = [
    { mrn: "123456", lastName: "Smith", firstName: "John", dob: "01/01/1980", subject: "Lab Results", dateReceived: "12/18/2024", fromUser: "Dr. Doe" },
    { mrn: "234567", lastName: "Doe", firstName: "Jane", dob: "02/02/1985", subject: "Prescription", dateReceived: "12/17/2024", fromUser: "Nurse Joy" },
    { mrn: "345678", lastName: "Brown", firstName: "Charlie", dob: "03/03/1990", subject: "Message", dateReceived: "12/16/2024", fromUser: "Dr. Smith" },
    { mrn: "456789", lastName: "Johnson", firstName: "Emily", dob: "04/04/1995", subject: "Image Upload", dateReceived: "12/15/2024", fromUser: "Dr. White" },
    { mrn: "567890", lastName: "Lee", firstName: "Chris", dob: "05/05/2000", subject: "Document", dateReceived: "12/14/2024", fromUser: "Receptionist" },
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
                  className={`p-2 border-b border-gray-300 w-full text-left hover:bg-gray-100 ${
                    item.id === "messages"
                      ? "bg-blue-400 text-white border-blue-600 hover:text-black"
                      : "bg-white"
                  }`}
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
  const { mrn } = useParams(); // get MRN from url params
  const entry = dummyData.find((item) => item.mrn === mrn);

  if (!entry) {
    return <div>Message not found.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Message Details</h2>
      <p><strong>Subject:</strong> {entry.subject}</p>
      <p><strong>From:</strong> {entry.fromUser}</p>
      <p><strong>Last Name:</strong> {entry.lastName}</p>
      <p><strong>First Name:</strong> {entry.firstName}</p>
      <p><strong>MRN:</strong> {entry.mrn}</p>
      <p><strong>Date Received:</strong> {entry.dateReceived}</p>
      <div className='mt-5'>
        <Link to="/" className="mt-4 bg-blue-500 text-white p-2 rounded">
          Back to Inbox
      </Link>
      </div>
    </div>
  );
};

export default App;
