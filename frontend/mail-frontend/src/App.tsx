import { useEffect, useState } from 'react';
// ref: https://www.medconnecthealth.com/wp-content/uploads/2020/05/Desktop-7.png

type ApiResponse = {
  message: string;
};

function App() {
  const [data, setData] = useState<ApiResponse | null>(null);

  /*
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/data')
      .then(response => response.json())
      .then(data => setData(data));
      console.log(data)
  }, []);
  */

  const handleClick = (item: string) => {
    alert(`You clicked on ${item}`);
  };

  const handleRowClick = (entry: any) => {
    alert(`You clicked on entry for MRN: ${entry.mrn}`);
  };

  const dummyData = [
    { mrn: "123456", lastName: "Smith", firstName: "John", dob: "01/01/1980", subject: "Lab Results", dateReceived: "12/18/2024", fromUser: "Dr. Doe" },
    { mrn: "234567", lastName: "Doe", firstName: "Jane", dob: "02/02/1985", subject: "Prescription", dateReceived: "12/17/2024", fromUser: "Nurse Joy" },
    { mrn: "345678", lastName: "Brown", firstName: "Charlie", dob: "03/03/1990", subject: "Message", dateReceived: "12/16/2024", fromUser: "Dr. Smith" },
    { mrn: "456789", lastName: "Johnson", firstName: "Emily", dob: "04/04/1995", subject: "Image Upload", dateReceived: "12/15/2024", fromUser: "Dr. White" },
    { mrn: "567890", lastName: "Lee", firstName: "Chris", dob: "05/05/2000", subject: "Document", dateReceived: "12/14/2024", fromUser: "Receptionist" },
  ];

  return (
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
                onClick={() => handleClick(item.label)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="w-3/4 border-2 border-gray-300 overflow-auto">
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
      </div>
    </div>
  );
}

export default App;
